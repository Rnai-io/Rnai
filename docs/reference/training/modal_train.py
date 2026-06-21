"""
Train "Rnai LLM" on Modal cloud GPU — no machine to rent or manage.
===================================================================
QLoRA fine-tune of a 7-8B base into a Thai/ASEAN brand assistant, on a Modal
A10G (24GB). Your dataset ships with the run; the trained adapter lands in a
Modal Volume you download afterward.

Setup (once)
------------
  pip install modal
  modal token new
  modal secret create huggingface HUGGING_FACE_HUB_TOKEN=hf_xxx   # for gated/base models

Run (from THIS folder, so the dataset file is picked up)
--------------------------------------------------------
  cd rnai-mobile/docs/reference/training
  modal run modal_train.py                       # defaults: Qwen2.5-7B, 3 epochs
  modal run modal_train.py --epochs 2 --merge    # also export a merged model
  modal run modal_train.py --gguf                # also export GGUF (llama.cpp)

Download the result
-------------------
  modal volume get rnai-models /rnai-llm ./rnai-llm           # the LoRA adapter
  modal volume get rnai-models /rnai-llm-merged ./merged      # if --merge
  modal volume get rnai-models /rnai-llm-gguf ./gguf          # if --gguf

Then serve it as `rnai-llm` (see ../deploy) and set in the backend:
  SELF_VLLM_URL=<your server>   SELF_VLLM_MODEL=rnai-llm

NOTE: Unsloth/TRL/Modal APIs move fast. If install or an arg errors, check
https://docs.unsloth.ai and https://modal.com/docs. Bump --gpu to A100 for
larger bases (14B+) or longer context.
"""

import os

import modal

app = modal.App("rnai-train")

# Train on the expanded set if expand_dataset.py has produced it; else the seed.
DATA_FILE = ("rnai_dataset.train.jsonl"
             if os.path.exists("rnai_dataset.train.jsonl")
             else "rnai_dataset.sample.jsonl")

HF_SECRET = modal.Secret.from_name("huggingface")            # HUGGING_FACE_HUB_TOKEN
models_vol = modal.Volume.from_name("rnai-models", create_if_missing=True)

# CUDA devel image (Unsloth needs a CUDA toolchain to build kernels) + deps.
# The dataset file is added from your local folder at run time.
train_image = (
    modal.Image.from_registry("nvidia/cuda:12.4.1-devel-ubuntu22.04", add_python="3.11")
    .apt_install("git", "build-essential")
    .pip_install(
        "torch==2.5.1",
        "unsloth",
        "trl",
        "peft",
        "transformers",
        "datasets",
        "bitsandbytes",
        "huggingface_hub[hf_transfer]",
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    .add_local_file(DATA_FILE, "/root/data.jsonl")
)


@app.function(
    image=train_image,
    gpu="A10G",                     # 24GB — fine for 7-8B QLoRA; use "A100" for 14B+
    timeout=4 * 60 * 60,            # up to 4h
    volumes={"/out": models_vol},
    secrets=[HF_SECRET],
)
def train(base: str, epochs: float, max_seq: int, lr: float, merge: bool, gguf: bool):
    from unsloth import FastLanguageModel
    from datasets import load_dataset
    from trl import SFTTrainer, SFTConfig

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=base, max_seq_length=max_seq, load_in_4bit=True, dtype=None,
    )
    model = FastLanguageModel.get_peft_model(
        model, r=16, lora_alpha=16, lora_dropout=0.0,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "up_proj", "down_proj"],
        use_gradient_checkpointing="unsloth", random_state=42,
    )

    ds = load_dataset("json", data_files="/root/data.jsonl", split="train")

    def to_text(example):
        return {"text": tokenizer.apply_chat_template(
            example["messages"], tokenize=False, add_generation_prompt=False)}

    ds = ds.map(to_text, remove_columns=ds.column_names)

    trainer = SFTTrainer(
        model=model, tokenizer=tokenizer, train_dataset=ds,
        args=SFTConfig(
            dataset_text_field="text", max_seq_length=max_seq,
            per_device_train_batch_size=2, gradient_accumulation_steps=4,
            warmup_steps=5, num_train_epochs=epochs, learning_rate=lr,
            logging_steps=1, optim="adamw_8bit", weight_decay=0.01,
            lr_scheduler_type="linear", seed=42, output_dir="/tmp/outputs",
            report_to="none",
        ),
    )
    trainer.train()

    model.save_pretrained("/out/rnai-llm")
    tokenizer.save_pretrained("/out/rnai-llm")
    if merge:
        model.save_pretrained_merged("/out/rnai-llm-merged", tokenizer, save_method="merged_16bit")
    if gguf:
        model.save_pretrained_gguf("/out/rnai-llm-gguf", tokenizer, quantization_method="q4_k_m")

    models_vol.commit()   # persist so you can `modal volume get` it
    print("✅ training complete — saved to volume 'rnai-models' at /rnai-llm")


@app.local_entrypoint()
def main(
    base: str = "unsloth/Qwen2.5-7B-Instruct",
    epochs: float = 3.0,
    max_seq: int = 2048,
    lr: float = 2e-4,
    merge: bool = False,
    gguf: bool = False,
):
    print(f"Training on dataset: {DATA_FILE}")
    train.remote(base=base, epochs=epochs, max_seq=max_seq, lr=lr, merge=merge, gguf=gguf)
    print("Download:  modal volume get rnai-models /rnai-llm ./rnai-llm")
