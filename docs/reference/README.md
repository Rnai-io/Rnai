# Rnai AI — โค้ดอ้างอิงสำหรับ Self-Hosted Backup + Failover

ไฟล์ในโฟลเดอร์นี้เป็น **โค้ดอ้างอิง (reference)** สำหรับนำไปวางในรีโป backend (`rnai-platform`) และเซิร์ฟเวอร์สำรอง — ไม่ได้ถูกคอมไพล์เป็นส่วนหนึ่งของแอปมือถือ

| ไฟล์ | ใช้ทำอะไร | นำไปวางที่ |
|---|---|---|
| `ai-gateway-router.ts` | Router เลือก provider + circuit breaker + failover | backend (`lib/ai/` ใน rnai-platform) |
| `nextjs-route.example.ts` | ตัวอย่างต่อ router เข้า API route ของ Next.js | backend (`app/api/v1/*/route.ts`) |
| `docker-compose.backup.yml` | สแตก inference สำรอง (vLLM, ComfyUI, Piper, rembg) | เซิร์ฟเวอร์ GPU/CPU ของคุณ |
| `deploy/modal_app.py` | deploy บน Modal (LLM + รูป + เสียง) scale-to-zero | รันด้วย `modal deploy` |
| `deploy/runpod-deploy.md` + `deploy/runpod_handler.py` | deploy บน RunPod Serverless | RunPod Console |
| `deploy/README.md` | **คู่มือ end-to-end เริ่มที่นี่** | — |

ดูพิมพ์เขียวภาพรวมที่ [`../rnai-backup-ai-architecture.md`](../rnai-backup-ai-architecture.md) และคู่มือลงมือทำที่ [`deploy/README.md`](deploy/README.md)

## ขั้นตอนเชื่อมต่อกับแอป (ฝั่งแอปทำเสร็จแล้ว)

แอปรองรับ failover ระดับ URL แล้วใน `app/services/api.ts` — แค่ตั้ง env:

```bash
# .env.local ของแอป
EXPO_PUBLIC_API_URL=https://rnai-io.vercel.app          # ทางหลัก
EXPO_PUBLIC_API_FALLBACK_URL=https://gateway.rnai.io     # gateway/backend สำรอง (คั่นด้วย , ได้หลายตัว)
```

เมื่อ backend หลักล่ม (network/timeout/5xx) `executeSkill` จะลอง URL สำรองให้อัตโนมัติ

## ลำดับการทำ

1. Deploy `docker-compose.backup.yml` บน host GPU/CPU → ได้ URL ของแต่ละบริการ
2. นำ `ai-gateway-router.ts` ไปวางใน backend, เติม `call()` ของ provider จริง, ตั้ง env `SELF_VLLM_URL` / `SELF_SDXL_URL` / `SELF_TTS_URL`
3. ให้ทุก endpoint สกิลใน backend เรียกผ่าน `routeSkill(registry, req)` แทนการเรียก provider ตรงๆ
4. ตั้ง cron เรียก `sweepHealth(registry)` ทุก ~1 นาที + เพิ่ม `/api/v1/status`
5. ตั้ง `EXPO_PUBLIC_API_FALLBACK_URL` ในแอปให้ชี้มาที่ gateway สำรอง

## หมายเหตุต้นทุน

- `piper-tts` + `rembg` รันบน CPU ราคาถูกได้ → เปิดตลอดเป็นชั้นสำรองพื้นฐาน
- `vllm` + `comfyui` ต้องใช้ GPU → แนะนำ serverless GPU แบบ scale-to-zero (RunPod/Modal) เพื่อคุมค่าใช้จ่าย แลกกับ cold start ~10–60 วิ
