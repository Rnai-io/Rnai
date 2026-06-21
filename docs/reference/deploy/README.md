# Rnai AI Backup — คู่มือ Deploy แบบ End-to-End

ลำดับทำตามที่คุยไว้: **เปิดบัญชี host → deploy → เอา router ไปวางใน backend → ตั้ง env ในแอป**

| ไฟล์ในโฟลเดอร์นี้ | คือ |
|---|---|
| `modal_app.py` | deploy บน Modal (LLM + รูป + เสียง) scale-to-zero — แนะนำสำหรับเริ่มต้น |
| `runpod-deploy.md` + `runpod_handler.py` | ทางเลือก RunPod (LLM ใช้ official worker, รูป/เสียงใช้ custom) |
| `../ai-gateway-router.ts` | router + failover + circuit breaker → วางใน backend |
| `../nextjs-route.example.ts` | ตัวอย่างต่อ router เข้า API route ของ Next.js |

---

## ขั้นที่ 1 — เปิดบัญชี host + deploy backup

**ทางเลือก A: Modal (แนะนำ — ง่ายสุด, scale-to-zero)**
```bash
pip install modal
modal token new                                   # ล็อกอิน
modal secret create huggingface HUGGING_FACE_HUB_TOKEN=hf_xxx
modal deploy docs/reference/deploy/modal_app.py
```
Modal จะพิมพ์ URL ของแต่ละบริการ → จด 3 URL (vllm/serve, image/generate, tts/speak)

**ทางเลือก B: RunPod** — ทำตาม `runpod-deploy.md` (LLM ผ่าน official worker-vllm, รูป/เสียงผ่าน custom worker)

**ทางเลือก C: ของเบาเปิดตลอด (ถูกสุด)** — รัน `../docker-compose.backup.yml` (Piper + rembg) บน VPS/Render

---

## ขั้นที่ 2 — เอา router ไปวางใน backend (rnai-platform)

1. ก๊อป `../ai-gateway-router.ts` → `lib/ai/ai-gateway-router.ts`
2. แก้ `REGISTRY`: ใส่ provider จริง (Gemini/Together/OpenRouter เป็น primary) และเติม URL ของ backup จากขั้นที่ 1:
   ```bash
   # env ของ backend
   SELF_VLLM_URL=https://<you>--rnai-vllm-serve.modal.run
   SELF_SDXL_URL=https://<you>--rnai-image-generate.modal.run
   SELF_TTS_URL=https://<you>--rnai-tts-speak.modal.run
   ```
3. รีแฟกเตอร์แต่ละ route `/api/v1/*` ให้เรียกผ่าน `routeSkill(REGISTRY, req)` ตาม `../nextjs-route.example.ts`
4. (แนะนำ) เพิ่ม route `/api/v1/status` ที่เรียก `sweepHealth(REGISTRY)` + ตั้ง cron เรียกทุก ~1 นาที

---

## ขั้นที่ 3 — ตั้ง env ในแอป (ทำง่ายสุด, ฝั่งแอปพร้อมแล้ว)

ในไฟล์ `.env.local` ของ `rnai-mobile`:
```bash
EXPO_PUBLIC_API_URL=https://rnai-io.vercel.app
# ชี้ไปที่ backend/gateway สำรอง — ใส่หลายตัวคั่นด้วย , ได้
EXPO_PUBLIC_API_FALLBACK_URL=https://<gateway-สำรอง>
```
`executeSkill` ใน `app/services/api.ts` จะสลับมาใช้ URL สำรองอัตโนมัติเมื่อ backend หลักล่ม (network/timeout/5xx)

---

## ลำดับความทนทาน (สรุป)

1. **แอป** ล้มเหลวที่ backend หลัก → ลอง `EXPO_PUBLIC_API_FALLBACK_URL`
2. **Gateway** ใน backend → provider หลักล่ม → สลับไป backup (Modal/RunPod) ด้วย circuit breaker
3. **Backup server** = โมเดลเปิดที่คุณ host เอง ไม่พึ่งผู้ให้บริการภายนอก

## ตรวจสอบ
- ทดสอบ failover: ปิด/บล็อก provider หลักชั่วคราว แล้วยิงสกิล — ควรได้ผลจาก backup และเห็น header `x-rnai-served-by`
- ดู cold start ครั้งแรกหลัง idle (Modal/RunPod) ~10–60 วิ ถ้าต้องเร็วเสมอ ตั้ง `min_containers=1` (Modal) หรือ active worker (RunPod)
