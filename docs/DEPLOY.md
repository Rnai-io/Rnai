# Rnai v2.0 — Deploy Checklist

ครอบคลุม 2 รีโป: **rnai-platform** (backend, Next.js → Vercel) และ **rnai-mobile** (Expo → EAS) + (ทางเลือก) เซิร์ฟเวอร์สำรอง self-hosted

สถานะตรวจสอบล่าสุด (2026-06-17): `tsc --noEmit` ผ่านสะอาดทั้งสองรีโป (ฝั่งมือถือต้องรัน `npm install` ก่อนเพื่อดึง `expo-audio` ที่เพิ่งเพิ่ม)

---

## A. Backend — rnai-platform → Vercel

**1. Env vars** (ตั้งใน Vercel Project Settings → Environment Variables) — ดู `.env.example`:

จำเป็น:
`NEXT_PUBLIC_FIREBASE_*` (6 ตัว), `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET`,
`HUGGINGFACE_API_TOKEN`, `OPENROUTER_API_KEY`, `TOGETHER_API_KEY`, `GEMINI_API_KEY`,
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLOUDINARY_*`, `CRON_SECRET`

ใหม่ (สำรอง self-hosted — เว้นว่างได้ถ้ายังไม่ deploy backup):
`SELF_VLLM_URL`, `SELF_VLLM_MODEL`, `SELF_SDXL_URL`, `SELF_TTS_URL`, `SELF_STT_URL`, `SELF_REMBG_URL`, `SELF_UPSCALE_URL`, `SELF_API_KEY`, `SELF_TIMEOUT_MS`

**2. Build & deploy**
```bash
cd rnai-platform
npm install
npm run build      # ตรวจ build จริง
# deploy: push เข้า branch ที่ต่อกับ Vercel หรือ `vercel --prod`
```

**3. ตรวจหลัง deploy**
- `GET /api/v1/status` → ควรได้ `{ status: "operational", providers, backup }`
- cron rewards (vercel.json) ทำงาน + ตั้ง `CRON_SECRET` แล้ว

---

## B. Mobile — rnai-mobile → EAS / Expo

**⚠️ ต้องทำก่อน build (เพราะเพิ่มฟีเจอร์อัดเสียง STT):**
```bash
cd rnai-mobile
npm install                       # ติดตั้ง expo-audio ~1.1.1 ที่เพิ่งเพิ่มใน package.json
npx expo prebuild --clean         # สร้าง native ใหม่ (เพิ่ม native module + สิทธิ์ไมโครโฟน)
cd ios && pod install && cd ..    # iOS เท่านั้น
```
> เหตุผล: `expo-audio` เป็น native module และ STT ต้องขอสิทธิ์ไมโครโฟน (ใส่ใน app.json แล้ว: iOS `NSMicrophoneUsageDescription`, Android `RECORD_AUDIO`, plugin `expo-audio`)

**1. Env** (`.env.local`):
```bash
EXPO_PUBLIC_API_URL=https://rnai-io.vercel.app
EXPO_PUBLIC_API_FALLBACK_URL=          # (ทางเลือก) gateway/backend สำรอง — สลับอัตโนมัติเมื่อหลักล่ม
EXPO_PUBLIC_API_KEY=                   # dev fallback เท่านั้น (ปกติคีย์อยู่ใน SecureStore ต่อผู้ใช้)
```

**2. Build**
```bash
eas build -p ios       # หรือ -p android
# ทดสอบเร็ว: npx expo run:ios / run:android
```
- version = **2.0.0** (app.json + package.json)

**3. ตรวจหลัง build (ฟีเจอร์ใหม่ v2.0)**
- สลับภาษาได้ครบ 15 ภาษา (th/en + อาเซียน) และจำค่าหลังปิดแอป
- โปรไฟล์ → นโยบายความเป็นส่วนตัว/ข้อกำหนด เปิดในแอป (ครบทุกภาษา)
- แท็บ AI: การ์ดโมเดลแสดงสถานะตามจริง (ไม่มีปุ่มดาวน์โหลดปลอม)
- สกิลใหม่: **audio-stt** (กดไมค์ → ขออนุญาตไมโครโฟน → อัด → ถอดเป็นข้อความ) และ **text-extract** (ข้อความ → JSON)
- ปิด backend หลักทดสอบ → ถ้าตั้ง `EXPO_PUBLIC_API_FALLBACK_URL` ต้องสลับไปสำรองได้

---

## C. (ทางเลือก) เซิร์ฟเวอร์สำรอง self-hosted

ดู `docs/reference/deploy/README.md` — deploy Modal/RunPod แล้วนำ URL ใส่ `SELF_*` ในข้อ A.1
ครอบคลุม failover: LLM, รูป, TTS และ **STT** (ผ่าน `SELF_STT_URL` → POST `/transcribe`)

---

## D. สรุป "ครบ" v2.0

- สกิลในแอป: 16 → **18** (เพิ่ม audio-stt, text-extract)
- backend skill endpoints: 13 (ครบ) — failover self-hosted ครอบคลุม **13/13** (รวม STT แล้ว)
- เวอร์ชัน: **2.0.0**
- ความทนทาน 3 ชั้น: แอป (fallback URL) → provider failover ใน backend → self-hosted backup
