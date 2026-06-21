# RunPod Serverless — deploy backup inference

RunPod Serverless รัน GPU แบบ scale-to-zero (จ่ายตามคำขอ) เหมาะกับ backup path
แบ่งเป็น 2 ส่วน: **LLM ใช้ official worker (ไม่ต้องเขียนโค้ด)** และ **รูป/เสียง ใช้ custom worker** (`runpod_handler.py`)

## 1) LLM — official `worker-vllm` (OpenAI-compatible, ไม่ต้องเขียนโค้ด)

1. RunPod Console → **Serverless → New Endpoint → "Serverless vLLM"** (หรือ image `runpod/worker-vllm:stable-cuda12.1.0`)
2. ตั้งค่า env:
   - `MODEL_NAME=meta-llama/Llama-3.1-8B-Instruct` (หรือ Qwen2.5/Mistral)
   - `HF_TOKEN=hf_xxx` (ถ้าโมเดล gated)
   - เลือก GPU (เช่น 24 GB สำหรับ 8B, A100 สำหรับ 70B), ตั้ง Max workers + Idle timeout
3. ได้ endpoint OpenAI-compatible ที่:
   ```
   https://api.runpod.ai/v2/<ENDPOINT_ID>/openai/v1
   ```
   เรียกด้วย header `Authorization: Bearer <RUNPOD_API_KEY>`

> Worker นี้ cache อยู่บนเครื่อง RunPod แล้ว → deploy แทบจะทันที

## 2) รูปภาพ + เสียง — custom worker (`runpod_handler.py`)

สร้าง `Dockerfile` ข้างไฟล์ handler:

```dockerfile
FROM runpod/base:0.6.2-cuda12.1.0
RUN pip install runpod diffusers transformers accelerate torch piper-tts pillow
COPY runpod_handler.py /handler.py
CMD ["python", "-u", "/handler.py"]
```

```bash
docker build -t <you>/rnai-backup-worker .
docker push <you>/rnai-backup-worker
# RunPod Console → New Endpoint → Custom → ใส่ image → เลือก GPU → Deploy
```

เรียกใช้ (sync):
```
POST https://api.runpod.ai/v2/<ENDPOINT_ID>/runsync
Authorization: Bearer <RUNPOD_API_KEY>
{ "input": { "task": "image", "prompt": "..." } }
{ "input": { "task": "tts", "text": "..." } }
```

## 3) เชื่อมเข้ากับ gateway

RunPod LLM เป็น OpenAI-compatible อยู่แล้ว → ใน `ai-gateway-router.ts` ตั้ง:
```bash
SELF_VLLM_URL=https://api.runpod.ai/v2/<ID>/openai     # provider self-vllm เรียก /v1/chat/completions
RUNPOD_API_KEY=...                                      # ใส่ใน Authorization ของ provider call()
```
ส่วนรูป/เสียงเป็น endpoint `/runsync` รูปแบบต่างออกไป → ปรับ `call()` ของ provider `self-sdxl` / `self-piper`
ให้ POST ไป `/runsync` พร้อม `{ input: { task, prompt/text } }` และอ่าน `result.output.url`

## ต้นทุนโดยสังเขป
- LLM 8B บน GPU 24 GB: จ่ายเฉพาะตอนมีคำขอ + idle timeout สั้นๆ คุมค่าใช้จ่ายได้
- งานเบา (TTS/rembg) ควรใช้ Modal CPU หรือ VPS เปิดตลอดจะถูกกว่า GPU
