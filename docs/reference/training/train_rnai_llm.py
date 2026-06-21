"""
Train "Rnai LLM" — QLoRA fine-tune of a 7-8B open model into a Thai/ASEAN
brand assistant. Runs on a single 24GB GPU (RTX 4090 / L4) via Unsloth.

Usage
-----
  pip install unsloth trl peft transformers datasets
  python train_rnai_llm.py \
      --base unsloth/Qwen2.5-7B-Instruct \
      --data rnai_dataset.sample.jsonl \
      --out ./rnai-llm \
      --epochs 3

Output
------
  ./rnai-llm           LoRA adapter (small) — serve base + this adapter
  ./rnai-llm-merged    full merged model (optional, --merge)   → easiest to serve with vLLM
  ./rnai-llm-gguf      GGUF q4_k_m (optional, --gguf)          → serve with llama.cpp

Then serve it as `rnai-llm` (see ../deploy) and set in the backend:
  SELF_VLLM_URL=<your server>   SELF_VLLM_MODEL=rnai-llm

NOTE: Unsloth / TRL APIs move fast — if an arg name errors, check the current
Unsloth docs (https://docs.unsloth.ai). This script targets late-2025/2026 APIs.
Dataset must be JSONL with one {"messages":[...]} object per line (see sample).
"""

import argparse


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="unsloth/Qwen2.5-7B-Instruct",
                    help="Base model. Thai/ASEAN alts: SeaLLMs-v3-7B, Typhoon-2, Llama-3.1-8B-Instruct")
    ap.add_argument("--data", default="rnai_dataset.sample.jsonl")
    ap.add_argument("--out", default="./rnai-llm")
    ap.add_argument("--max-seq", type=int, default=2048)
    ap.add_argument("--epochs", type=float, default=3.0)
    ap.add_argument("--lr", type=float, default=2e-4)
    ap.add_argument("--merge", action="store_true", help="also export a merged 16-bit model")
    ap.add_argument("--gguf", action="store_true", help="also export a GGUF q4_k_m for llama.cpp")
    args = ap.parse_args()

    from unsloth import FastLanguageModel
    from datasets import load_dataset
    from trl import SFTTrainer, SFTConfig

    # 1) Load base in 4-bit (QLoRA)
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.base,
        max_seq_length=args.max_seq,
        load_in_4bit=True,
        dtype=None,  # auto (bf16 where supported)
    )

    # 2) Attach LoRA adapters
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        lora_alpha=16,
        lora_dropout=0.0,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "up_proj", "down_proj"],
        use_gradient_checkpointing="unsloth",
        random_state=42,
    )

    # 3) Format chat data → single "text" field via the model's chat template
    ds = load_dataset("json", data_files=args.data, split="train")

    def to_text(example):
        return {
            "text": tokenizer.apply_chat_template(
                example["messages"], tokenize=False, add_generation_prompt=False
            )
        }

    ds = ds.map(to_text, remove_columns=ds.column_names)

    # 4) Train
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=ds,
        args=SFTConfig(
            dataset_text_field="text",
            max_seq_length=args.max_seq,
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            warmup_steps=5,
            num_train_epochs=args.epochs,
            learning_rate=args.lr,
            logging_steps=1,
            optim="adamw_8bit",
            weight_decay=0.01,
            lr_scheduler_type="linear",
            seed=42,
            output_dir="outputs",
            report_to="none",
        ),
    )
    trainer.train()

    # 5) Save adapter
    model.save_pretrained(args.out)
    tokenizer.save_pretrained(args.out)
    print(f"✅ LoRA adapter saved to {args.out}")

    if args.merge:
        model.save_pretrained_merged(f"{args.out}-merged", tokenizer, save_method="merged_16bit")
        print(f"✅ merged model saved to {args.out}-merged")

    if args.gguf:
        model.save_pretrained_gguf(f"{args.out}-gguf", tokenizer, quantization_method="q4_k_m")
        print(f"✅ GGUF saved to {args.out}-gguf")


if __name__ == "__main__":
    main()
