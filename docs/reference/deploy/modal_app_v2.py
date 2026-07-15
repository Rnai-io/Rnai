"""
Rnai AI — Modal inference v2 (Qwen3-8B + rnai-llm v3.1 LoRA)
============================================================
Deploy คู่ขนานกับ v1 (app ชื่อใหม่ "rnai-backup-v2" → URL ใหม่ ไม่ทับของเดิม)
ทดสอบผ่านแล้วค่อยสลับ SELF_VLLM_URL ใน Vercel มาชี้ตัวนี้

สิ่งที่เปลี่ยนจาก v1 (modal_app.py):
  1. base model:  Qwen2.5-7B-Instruct → Qwen/Qwen3-8B   (adapter v3.1 เทรนบน Qwen3-8B)
  2. vLLM:        0.6.6 → รุ่นใหม่ (0.6.6 ไม่รู้จัก Qwen3)
  3. max-lora-rank: 16 → 32                              (v3.1 ใช้ r=32)
  4. LoRA repo:   naiguitarfolk/rnai-llm → naiguitarfolk/rnai-llm-v3
  5. reasoning:   Qwen3 มี <think> — เปิด reasoning parser ให้ vLLM แยก
                  ความคิดออกจากคำตอบ (client เดิมได้ answer สะอาดเหมือนเดิม)
  6. media service ไม่แตะ — ใช้ของ v1 ต่อ (URL เดิม)

ก่อน deploy:
  1. อัปโหลด adapter v3.1 ขึ้น HF:
       huggingface-cli login
       huggingface-cli upload naiguitarfolk/rnai-llm-v3 ./adapter --repo-type model
     (โฟลเดอร์ adapter จาก Google Drive: rnai-v3.1/adapter)
  2. modal deploy modal_app_v2.py
  3. ทดสอบ:
       curl https://<you>--rnai-backup-v2-serve.modal.run/health
       curl -X POST .../v1/chat/completions -H 'Content-Type: application/json' \
         -d '{"model":"rnai-llm","messages":[{"role":"user","content":"สวัสดี"}]}'
  4. ผ่านแล้ว → เปลี่ยน SELF_VLLM_URL ใน Vercel เป็น URL ใหม่ (SELF_VLLM_MODEL คงเดิม "rnai-llm")
  5. มีปัญหา → สลับ SELF_VLLM_URL กลับ URL v1 ได้ทันที (v1 ยังรันอยู่)
"""

import subprocess

import modal

MINUTES = 60
app = modal.App("rnai-backup-v2")  # ชื่อใหม่ — ไม่ทับ v1

hf_cache = modal.Volume.from_name("rnai-hf-cache", create_if_missing=True)
HF_SECRET = modal.Secret.from_name("huggingface")

LLM_MODEL = "Qwen/Qwen3-8B"
RNAI_LORA_REPO = "naiguitarfolk/rnai-llm-v3"   # adapter v3.1 (r=32, Qwen3-8B)
SERVED_NAME = "rnai-llm"                        # ชื่อเดิม — backend ไม่ต้องแก้ SELF_VLLM_MODEL

vllm_image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("ffmpeg")  # vLLM รุ่นใหม่ import torchcodec ซึ่งต้องมี FFmpeg ไม่งั้น crash ตอน start
    # vLLM ต้อง >= 0.8.5 สำหรับ Qwen3 — ใช้รุ่นล่าสุด แล้วค่อย pin เวอร์ชันที่ทดสอบผ่าน
    .pip_install("vllm", "huggingface_hub[hf_transfer]")
    .env({
        # ปิด FlashInfer sampler — มันต้อง JIT compile ด้วย nvcc ซึ่ง image นี้ไม่มี
        # (fallback เป็น torch sampler ทำงานเหมือนกัน ช้ากว่าเล็กน้อย)
        "VLLM_USE_FLASHINFER_SAMPLER": "0",
    })
)


@app.function(
    image=vllm_image,
    gpu="A10G:1",                      # 24GB — Qwen3-8B fp16 (~16GB) + KV cache พอดี
    scaledown_window=10 * MINUTES,
    timeout=20 * MINUTES,
    volumes={"/root/.cache/huggingface": hf_cache},
    secrets=[HF_SECRET],
)
@modal.concurrent(max_inputs=64)
@modal.web_server(port=8000, startup_timeout=15 * MINUTES)
def serve():
    import os
    # secret เดิมใช้ key ชื่อเก่า HUGGING_FACE_HUB_TOKEN — hf_hub รุ่นใหม่อ่าน HF_TOKEN
    # ต้อง map ให้ ไม่งั้นโหลด LoRA จาก repo private ไม่ได้ (401)
    tok = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN", "")
    if tok:
        os.environ["HF_TOKEN"] = tok
    cmd = [
        "vllm", "serve", LLM_MODEL,
        "--host", "0.0.0.0", "--port", "8000",
        "--max-model-len", "8192",
        "--gpu-memory-utilization", "0.92",
        # แยก <think> ออกจากคำตอบ → client ได้ answer สะอาด (อยู่ใน field reasoning_content)
        "--reasoning-parser", "qwen3",
        "--served-model-name", "rnai-base",
        "--enable-lora", "--max-lora-rank", "32",   # v3.1 ใช้ r=32 (v1 เป็น 16)
        "--lora-modules", f"{SERVED_NAME}={RNAI_LORA_REPO}",
    ]
    subprocess.Popen(cmd)


@app.local_entrypoint()
def main():
    print("Deploy:  modal deploy modal_app_v2.py")
    print("Health:  https://<you>--rnai-backup-v2-serve.modal.run/health")
    print("v1 ยังรันอยู่ที่ app 'rnai-backup' — สลับ/ย้อนกลับด้วย SELF_VLLM_URL ใน Vercel")
