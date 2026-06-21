# Rnai.io Mobile — รายงานการเชื่อมต่อ Skill ↔ API และสถานะโมเดล

เวอร์ชันแอป: **2.0.0** · จัดทำ: 2026-06-17

แอปมือถือพูดคุยกับ **backend เดียว** คือ `EXPO_PUBLIC_API_URL` (ค่าเริ่มต้น `https://rnai-io.vercel.app`)
ผู้ให้บริการ AI จริง (Together, OpenRouter, Gemini, Hugging Face ฯลฯ) ถูกเรียก **ฝั่งเซิร์ฟเวอร์เท่านั้น** — คีย์เหล่านั้นไม่อยู่ในแอป

การยืนยันตัวตนของทุกสกิล: `Authorization: Bearer <api key>` โดยใช้คีย์ผู้ใช้ (`rnai_sk_...`) ที่เก็บใน SecureStore ก่อน แล้วจึง fallback ไปที่ `EXPO_PUBLIC_API_KEY`

---

## 1. สกิลทั้ง 16 รายการ (`app/services/api.ts` → `SKILL_ENDPOINTS`)

| Skill | id | Endpoint (POST) | ต้องมีรูป | ผลลัพธ์ | สถานะ |
|---|---|---|---|---|---|
| สร้างรูปภาพ | `image-gen` | `/api/v1/generate` | – | image | ✅ ready |
| แก้ไขรูปภาพ | `image-edit` | `/api/v1/edit` | ✓ | image | ✅ ready |
| ลบพื้นหลัง | `remove-bg` | `/api/v1/remove-background` | ✓ | image | ✅ ready |
| เพิ่มความละเอียด | `upscale` | `/api/v1/upscale` | ✓ | image | ✅ ready |
| แต่งสไตล์ | `stylize` | `/api/v1/stylize` | ✓ | image | ✅ ready |
| สร้างข้อความ | `text-gen` | `/api/v1/text/generate` | – | text | ✅ ready |
| สรุปข้อความ | `text-sum` | `/api/v1/text/summarize` | – | text | ✅ ready |
| แปลภาษา | `text-trans` | `/api/v1/text/translate` | – | text | ✅ ready |
| เขียนใหม่ | `text-rewrite` | `/api/v1/text/rewrite` | – | text | ✅ ready |
| แปลงเสียง (TTS) | `audio-tts` | `/api/v1/audio/tts` | – | audio | ✅ ready |
| สร้างเว็บไซต์ | `website-gen` | `/api/v1/website/generate` | – | website | ✅ ready |
| วิเคราะห์รูปภาพ | `image-describe` | `/api/v1/text/generate` (vision) | ✓ | text | ✅ ready |
| ฟื้นฟูใบหน้า | `face-restore` | `/api/v1/stylize` | ✓ | image | ✅ ready |
| ตรวจไวยากรณ์ | `text-grammar` | `/api/v1/text/generate` | – | text | ✅ ready |
| สร้างโค้ด | `text-code` | `/api/v1/text/generate` | – | text | ✅ ready |
| สร้าง Hashtag | `text-hashtag` | `/api/v1/text/generate` | – | text | ✅ ready |

หมายเหตุ:
- 6 สกิลข้อความปลายทางใช้ `/api/v1/text/generate` ร่วมกัน (แยกพฤติกรรมด้วย prompt ที่ฝังในแอป) — `image-describe`, `text-grammar`, `text-code`, `text-hashtag` รวมถึง `text-gen`
- `face-restore` ใช้ `/api/v1/stylize` ร่วมกับสกิล stylize โดยส่ง prompt เน้นการฟื้นฟู
- พารามิเตอร์พิเศษ: `text-trans` → `targetLanguage`, `text-rewrite` → `tone`, `text-code` → `language`, `text-hashtag` → `platform`/`count`, `website-gen` → `template/siteType/colorTheme/sections/styleTone/siteLanguage`
- `executeSkill()` มี timeout 90s, retry 2 ครั้ง (เฉพาะ network/timeout/5xx), parse JSON ปลอดภัย และข้อความ error สองภาษา (TH/EN)

## 2. API อื่นๆ ที่แอปเรียก

| งาน | Endpoint | ไฟล์ | หมายเหตุ |
|---|---|---|---|
| สมัคร/เข้าสู่ระบบ | Firebase Identity Toolkit (`accounts:signUp` / `signInWithPassword`) | `services/auth.ts` | ใช้ `NEXT_PUBLIC_FIREBASE_API_KEY` |
| ต่ออายุโทเค็น | `securetoken.googleapis.com/v1/token` | `services/auth.ts` | refresh token เก็บใน SecureStore |
| สร้าง session + เครดิตเริ่มต้น | `/api/auth/session` | `services/auth.ts` | ให้ 200 เครดิตครั้งแรก |
| ออก API key ผู้ใช้ | `/api/keys` | `services/auth.ts` | Bearer idToken |
| ยอดเครดิต/แพ็กเกจ | `/api/billing/me` | `services/auth.ts` | |
| ประวัติเครดิต | `/api/billing/ledger?limit=` | `services/auth.ts` | |
| อันดับรางวัล | `/api/rewards/leaderboard` | `services/auth.ts` | |
| แชทคลาวด์ฟรี | `/api/gemini/chat` | `services/auth.ts` | Gemini, Bearer idToken |
| แลก TrueMoney | `/api/v1/payments/truemoney/redeem` | `services/api.ts` | รับลิงก์/โค้ด 16 หลัก |
| ตรวจการเชื่อมต่อ | HEAD `/` + POST `/api/v1/text/generate` | `services/api.ts` | `pingApi()` |
| AI ในเครื่อง (LAN) | GET `/api/tags`, POST `/api/chat` ที่ `http://<ip>:11434` | `services/ollama.ts` | ไม่ผ่านเซิร์ฟเวอร์ Rnai |

## 3. โมเดลใน AI Manager (`app/screens/aimanager.tsx` → `AI_MODELS`)

| โมเดล | การทำงาน | ใช้งานได้จริงเมื่อ |
|---|---|---|
| ✨ Rnai Cloud Chat (Gemini 2.5) | คลาวด์ฟรี → `/api/gemini/chat` | เข้าสู่ระบบแล้ว ✅ |
| 🦙 Ollama | LAN | กดการ์ดเพื่อเชื่อมต่อเซิร์ฟเวอร์ Ollama |
| DeepSeek R1 / Llama 3.2 / Gemma 2 / Phi-3 / Mistral | LAN ผ่าน Ollama (`ollamaTag`) | ต้องเชื่อมต่อ Ollama ก่อน |

**ปัญหาที่พบและแก้ไขแล้วในเวอร์ชัน 2.0:**
- การ์ดโมเดลเดิมมีปุ่ม "ดาวน์โหลด (x GB)" ที่ **ไม่ทำงานจริง** (กดแล้วขึ้น alert ที่ปุ่ม "เรียนรู้เพิ่มเติม" ว่างเปล่า) ทำให้เข้าใจผิดว่ารันบนเครื่องได้ → เปลี่ยนเป็นปุ่ม **"เชื่อมต่อ Ollama"** (ลิงก์ไปยังขั้นตอนจริง) และลิงก์ "เรียนรู้เพิ่มเติม" เปิดหน้าโมเดล
- เพิ่ม **ป้ายสถานะตามจริง** บนการ์ด: `ฟรี · คลาวด์` / `✓ พร้อมใช้ผ่าน Ollama` / `ต้องใช้ Ollama`
- ข้อความทักทายเมื่อเลือกโมเดลตอนนี้ **ตรงตามความจริง** (ถ้ายังไม่เชื่อม Ollama จะบอกวิธีเชื่อมต่อ แทนที่จะแกล้งทำเป็นพร้อมแชท)
- แถวข้อมูลในหน้ารายละเอียดเปลี่ยน "ขนาดดาวน์โหลด" → "ขนาดโมเดล (Ollama)" และเพิ่มแถว "การทำงาน" (คลาวด์/ในเครื่อง)

## 4. ข้อเสนอแนะที่ควรทำต่อ (ฝั่ง backend / ภายนอกแอป)

1. ยืนยันว่า endpoint `/api/v1/*` ทั้งหมดถูก deploy บน production จริง (ก่อนหน้านี้ทีมระบุว่ายังไม่มี backend prod) — โดยเฉพาะ `summarize`, `rewrite`, `audio/tts`, `website/generate`
2. `apiStatus` ในหน้าโปรไฟล์ยังเป็นค่าคงที่ "🟢 ปกติ" — ควรเพิ่ม `/api/v1/status` จริง แล้วให้แอปเรียกผ่าน `pingApi()` เพื่อแสดงสถานะตามจริง
3. สกิลแปลภาษา (`text-trans`) ตอนนี้รองรับปลายทางอาเซียน (Indonesian, Malay, Vietnamese, Filipino, Khmer, Lao, Burmese) — ตรวจสอบว่าโมเดลฝั่ง backend แปลภาษาเหล่านี้ได้ดี
4. พิจารณาแสดงผู้ให้บริการเบื้องหลังของแต่ละสกิลในหน้า debug (ถ้าต้องการความโปร่งใส) โดยไม่เปิดเผยคีย์
