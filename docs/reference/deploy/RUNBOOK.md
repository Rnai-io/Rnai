# Rnai Backup — Turn-key Runbook (สิ่งที่คุณต้องทำเอง)

อัปเดต 2026-06-17 · สิ่งที่ผมทำไว้ให้แล้ว vs สิ่งที่คุณต้องกดทำเอง

## ✅ ทำไว้ให้แล้ว (ในโค้ด)
- **Router/failover อยู่ใน backend แล้ว** — `rnai-platform/src/lib/ai/providers/selfhosted.ts` + เสียบเข้า `router.ts` และต่อท้าย provider chain ของ 13 สกิล (รวม STT) → **ไม่ต้องเอา router ไปวางเพิ่ม**
- `GET /api/v1/status` รายงานสถานะ provider + backup
- สคริปต์ deploy ที่ route ตรงกับ backend: `modal_app.py` (vLLM + SDXL + Whisper STT + Piper TTS)
- แอปมือถือรองรับ failover ระดับ backend ผ่าน `EXPO_PUBLIC_API_FALLBACK_URL` แล้ว

## 🔧 สิ่งที่คุณต้องทำเอง (3 ขั้น)

### ขั้น 1 — เปิดบัญชี host + deploy เซิร์ฟเวอร์สำรอง
```bash
pip install modal
modal token new                                            # ล็อกอิน Modal
modal secret create huggingface HUGGING_FACE_HUB_TOKEN=hf_xxx
cd rnai-mobile/docs/reference/deploy
modal deploy modal_app.py
```
จะได้ URL 2 ตัว (จดไว้):
- `serve`     → vLLM (LLM)
- `media-web` → SDXL (รูป) + Whisper (STT) + MMS (เสียง) รวมใน container เดียว

> ทางเลือกถูกกว่า: ของเบา (Piper/rembg) รันบน VPS/Render ด้วย `docker-compose.backup.yml` ได้ · LLM/รูปใช้ RunPod ก็ได้ (ดู `runpod-deploy.md`)

### ขั้น 2 — ตั้ง env ใน backend (Vercel → Settings → Environment Variables) แล้ว redeploy
```bash
SELF_VLLM_URL=https://<you>--rnai-backup-serve.modal.run
SELF_SDXL_URL=https://<you>--rnai-backup-media-web.modal.run
SELF_STT_URL=https://<you>--rnai-backup-media-web.modal.run      # ← URL เดียวกับ media
SELF_TTS_URL=https://<you>--rnai-backup-media-web.modal.run      # ← URL เดียวกับ media
SELF_VLLM_MODEL=rnai-llm
# ถ้าใช้ RunPod ที่ต้องใช้คีย์:
# SELF_API_KEY=...
```
จากนั้น `vercel --prod` (หรือ push) เพื่อให้ env มีผล

**ตรวจ:** เปิด `https://rnai-io.vercel.app/api/v1/status` → ค่า `backup.reachable` ควรเปลี่ยนจาก `false` เป็น `true`

### ขั้น 3 — (ทางเลือก) `EXPO_PUBLIC_API_FALLBACK_URL` ในแอป
⚠️ **อ่านก่อนตั้ง:** ตัวนี้คือ failover ระดับ "ทั้ง backend ล่ม" → ต้องชี้ไปที่ **backend ตัวที่สอง** (สำเนา rnai-platform อีกชุด คนละ region/โฮสต์) **ไม่ใช่** URL ของ Modal (Modal ไม่มี `/api/v1/*`, auth, billing)

- ถ้ายังไม่มี backend ตัวที่สอง → **เว้นว่างไว้** (self-hosted backup ในขั้น 1-2 ก็ครอบคลุมกรณี provider ภายนอกล่มแล้ว)
- ถ้ามี → ใน `rnai-mobile/.env.local`:
  ```bash
  EXPO_PUBLIC_API_FALLBACK_URL=https://rnai-backup.<region>.vercel.app
  ```

## สรุปชั้นความทนทานหลังทำครบ
1. provider ภายนอกล่ม → backend สลับไป self-hosted (Modal/RunPod) อัตโนมัติ ✅ (ขั้น 1-2)
2. backend หลักทั้งก้อนล่ม → แอปสลับไป backend สำรอง (ขั้น 3, ถ้าตั้ง)
