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
  2. สร้าง Modal Secret สำหรับล็อก endpoint (ครั้งเดียว — ดูหัวข้อความปลอดภัยด้านล่าง):
       modal secret create rnai-vllm-key VLLM_API_KEY=<สุ่มค่าเอง เช่น openssl rand -hex 32>
  3. modal deploy modal_app_v2.py
  4. ทดสอบ (ต้องแนบ Authorization ด้วยแล้ว ไม่งั้นได้ 401):
       curl https://<you>--rnai-backup-v2-serve.modal.run/health
       curl -X POST .../v1/chat/completions \
         -H 'Content-Type: application/json' -H 'Authorization: Bearer <VLLM_API_KEY เดียวกับข้อ 2>' \
         -d '{"model":"rnai-llm","messages":[{"role":"user","content":"สวัสดี"}]}'
  5. ผ่านแล้ว → ตั้ง Vercel env var: SELF_VLLM_URL=<URL ใหม่>, SELF_API_KEY=<VLLM_API_KEY เดียวกับข้อ 2>
     (SELF_VLLM_MODEL คงเดิม "rnai-llm")
  6. มีปัญหา → สลับ SELF_VLLM_URL กลับ URL v1 ได้ทันที (v1 ยังรันอยู่)

── ความปลอดภัย: ปิดการเข้าถึงแบบไม่มี auth ──────────────────────────────────
Endpoint นี้เดิมเปิดสาธารณะ 100% — ใครก็ยิง /v1/chat/completions ได้ฟรีไม่จำกัด
โดยไม่ผ่านบัญชี/เครดิตใดๆ เลย (กิน GPU cost ของเราตรงๆ) เพราะ Rnai-CLI ที่แจกบน
GitHub เป็น public repo และมี URL นี้ฝังอยู่ในค่า default ของทุกเครื่องที่ติดตั้ง

ตอนนี้ vLLM ถูกสั่งให้ต้องใช้ --api-key เสมอ (อ่านจาก Modal Secret "rnai-vllm-key"
คีย์ VLLM_API_KEY) — โค้ดฝั่ง Vercel (/api/rnai/chat, /api/v1/*) ส่ง header นี้
อยู่แล้วโดยอัตโนมัติถ้าตั้งค่า env var SELF_API_KEY ไว้ ไม่ต้องแก้โค้ดฝั่ง Vercel เพิ่ม

⚠️ ต้องสร้าง Modal Secret ก่อน deploy (ดูข้อ 2 ด้านบน) ไม่งั้น `modal deploy`
จะ error หา secret "rnai-vllm-key" ไม่เจอ — ตั้งใจให้ fail-closed แบบนี้
ดีกว่าเผลอปล่อยเปิดโล่งอีกรอบ

ผลหลังทำครบ: มีแค่ Vercel (ที่รู้ค่า secret) เท่านั้นที่เรียก endpoint นี้ได้ —
ผู้ใช้ Rnai-CLI ทุกเครื่องต้อง `rnai login` แล้วสนทนาผ่าน Rnai.io (เครดิต/quota
ของบัญชี) แทนการยิงตรงมาแบบไม่จำกัดเหมือนเดิม
"""

import subprocess

import modal

MINUTES = 60
app = modal.App("rnai-backup-v2")  # ชื่อใหม่ — ไม่ทับ v1

hf_cache = modal.Volume.from_name("rnai-hf-cache", create_if_missing=True)
HF_SECRET = modal.Secret.from_name("huggingface")
# สร้างครั้งเดียวก่อน deploy: modal secret create rnai-vllm-key VLLM_API_KEY=<random>
# แล้วตั้งค่าเดียวกันเป็น SELF_API_KEY บน Vercel — ปิดไม่ให้ยิง endpoint นี้ตรงๆ ได้ฟรี
VLLM_KEY_SECRET = modal.Secret.from_name("rnai-vllm-key")

LLM_MODEL = "Qwen/Qwen3-8B"
RNAI_LORA_REPO = "naiguitarfolk/rnai-llm-v3-2"   # adapter v3.2 (r=32, Qwen3-8B, dataset 307)
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
    secrets=[HF_SECRET, VLLM_KEY_SECRET],
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
        # ปิดการเข้าถึงแบบไม่ auth — ต้องส่ง "Authorization: Bearer <VLLM_API_KEY>"
        # มาด้วยเสมอ (มีแค่ Vercel ที่รู้ค่านี้ ผ่าน SELF_API_KEY ที่ตั้งไว้คู่กัน)
        "--api-key", os.environ["VLLM_API_KEY"],
    ]
    subprocess.Popen(cmd)


@app.local_entrypoint()
def main():
    print("ก่อน deploy ต้องมี Modal Secret แล้ว: modal secret create rnai-vllm-key VLLM_API_KEY=<random>")
    print("Deploy:  modal deploy modal_app_v2.py")
    print("Health:  https://<you>--rnai-backup-v2-serve.modal.run/health")
    print("Chat ต้องแนบ: -H 'Authorization: Bearer <VLLM_API_KEY>' ไม่งั้นได้ 401")
    print("อย่าลืมตั้ง Vercel: SELF_API_KEY=<VLLM_API_KEY เดียวกัน>")
    print("v1 ยังรันอยู่ที่ app 'rnai-backup' — สลับ/ย้อนกลับด้วย SELF_VLLM_URL ใน Vercel")
