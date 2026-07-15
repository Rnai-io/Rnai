# สร้าง "Rnai LLM" — ผู้ช่วยทั่วไป ไทย/อาเซียน (QLoRA, 7–8B)

แผนลงมือสร้างโมเดลภาษาแบรนด์ Rnai ของตัวเอง โดย **fine-tune โมเดลเปิด** (ไม่ใช่เทรนจากศูนย์)
ผลลัพธ์คือ adapter ชื่อ `rnai-llm` ที่ **เสียบเข้า backup infra ที่เราทำไว้แล้วได้ทันที** (`SELF_VLLM_MODEL=rnai-llm`)

## วงจรครบ (end-to-end)
```
1. seed (rnai_dataset.sample.jsonl) — เขียนมือ ~50-100 ตัวอย่าง
2. python expand_dataset.py --target 2000        → rnai_dataset.train.jsonl   (Gemini ขยาย+กรอง)
3. modal run modal_train.py                       → เทรนคลาวด์ (หยิบ train.jsonl เอง)
4. modal volume get rnai-models /rnai-llm ./rnai-llm
5. deploy เป็น rnai-llm (../deploy) → ตั้ง SELF_VLLM_URL + SELF_VLLM_MODEL=rnai-llm
6. python eval_rnai_llm.py --endpoint <url> --model rnai-llm   → scorecard
```

ไฟล์ในโฟลเดอร์นี้:
| ไฟล์ | คือ |
|---|---|
| `rnai_dataset.sample.jsonl` | ตัวอย่าง dataset (โทนแบรนด์ + ไทย/อาเซียน + พฤติกรรมสกิล) — ใช้เป็นแม่แบบ |
| `rnai_coder.sample.jsonl` | **Builder track** — ตัวอย่างสร้างเว็บ/React/Python/API/debug (ไทย+อังกฤษ) |
| `train_rnai_llm.py` | สคริปต์ QLoRA fine-tune (Unsloth) บน GPU 24GB (เครื่องตัวเอง/เช่า) |
| `rnai_llm_colab.ipynb` | **เทรนฟรีบน Google Colab (T4)** — Unsloth pin เวอร์ชันให้ ไม่เจอปัญหา dependency |
| `modal_train.py` | เทรนบนคลาวด์ Modal (ถ้าเจอ version clash ให้ใช้ Colab แทน) |
| `expand_dataset.py` | **ขยาย seed → หลักพันตัวอย่างด้วย Gemini** (กรองซ้ำ/ตรวจคุณภาพ) |
| `rnai_eval.jsonl` | ชุดทดสอบ (ไทย/อาเซียน + สกิล + ความปลอดภัย) |
| `eval_rnai_llm.py` | **ประเมินผล + เทียบ base** ด้วย LLM-as-judge (Gemini) ออก scorecard |
| `check_dataset.py` | **ตรวจคุณภาพ dataset ก่อนเทรน** (validate/ดูดซ้ำ/สถิติ/code coverage) |
| `requirements.txt` | dependency ของชุดเทรน |

---

## 1. เลือก base model (7–8B รองรับไทย/อาเซียน)

| โมเดล | จุดเด่น | License |
|---|---|---|
| **Qwen2.5-7B-Instruct** ⭐ | หลายภาษาแข็งแรง (ไทยดี), เสถียร, Unsloth รองรับเต็ม | Apache-2.0 |
| SeaLLMs-v3-7B / SEA-LION | สร้างมาเพื่อภาษาอาเซียนโดยเฉพาะ (ไทย/เวียดนาม/อินโด/มาเลย์...) | ตรวจ license |
| Typhoon-2 (SCB10X) | เชี่ยวชาญภาษาไทย | ตรวจ license |

**แนะนำเริ่มที่ Qwen2.5-7B-Instruct** (สมดุลภาษา + license สบาย) แล้วค่อยลอง SeaLLM/Typhoon ถ้าต้องการไทย/อาเซียนเข้มขึ้น

## 2. ชุดข้อมูล (สำคัญที่สุด — ตัดสินคุณภาพ)

รูปแบบ: **JSONL** บรรทัดละ 1 บทสนทนา `{"messages":[{role, content}, ...]}` (ดู `rnai_dataset.sample.jsonl`)

ควรครอบคลุม:
- **บุคลิกแบรนด์** — รู้ว่าตัวเองคือผู้ช่วยของ Rnai.io, สุภาพ, ตอบไทย/อังกฤษตามภาษาผู้ใช้
- **ภาษาอาเซียน** — ตัวอย่างถาม-ตอบในไทย, อังกฤษ, อินโด, เวียดนาม, มาเลย์ ฯลฯ
- **พฤติกรรมสกิลในแอป** — สรุป, แปล, เขียนใหม่, สร้าง hashtag, ตอบคำถามทั่วไป (ให้สอดคล้องกับสกิลจริง)
- **ความปลอดภัย** — ตัวอย่างการปฏิเสธคำขอที่ไม่เหมาะสมอย่างสุภาพ

ปริมาณ: เริ่ม **1,000–5,000 ตัวอย่าง** ก็เห็นผลบุคลิก/ภาษา วิธีขยาย:
1. เขียนมือ seed คุณภาพสูง ~50–100 ตัวอย่าง (ตั้งโทน)
2. ขยายอัตโนมัติด้วย **`expand_dataset.py`** (ใช้ Gemini key ที่มีอยู่) — มันสุ่มภาษา×ประเภทงานให้หลากหลาย แล้ว **กรองซ้ำ + ตรวจคุณภาพ** ให้:
   ```bash
   export GEMINI_API_KEY=...        # มีอยู่แล้วใน backend .env.local
   cd docs/reference/training
   python expand_dataset.py --target 2000
   # ได้ rnai_dataset.generated.jsonl และ rnai_dataset.train.jsonl (seed + generated)
   ```
3. ผสมชุดสาธารณะภาษาไทย/อาเซียน (เช่น OpenThaiGPT, SEA datasets) เพื่อความหลากหลาย
4. **อย่าใส่ข้อมูลส่วนบุคคล/ความลับ** ลงชุดเทรน · ตรวจตัวอย่างสุ่มก่อนเทรนเสมอ

> `modal_train.py` จะเลือกใช้ `rnai_dataset.train.jsonl` ให้อัตโนมัติถ้ามี (ไม่งั้นใช้ seed)

## 3. เทรน (QLoRA 4-bit)

**ทางเลือก A — บนคลาวด์ Modal (แนะนำ ไม่ต้องเช่าเครื่อง):**
```bash
pip install modal
modal token new
modal secret create huggingface HUGGING_FACE_HUB_TOKEN=hf_xxx
cd docs/reference/training
modal run modal_train.py                    # Qwen2.5-7B, 3 epochs (ดาต้าไฟล์ติดไปด้วยอัตโนมัติ)
# ดาวน์โหลดผล:
modal volume get rnai-models /rnai-llm ./rnai-llm
```

**ทางเลือก B — เครื่องตัวเอง/เช่า GPU 24GB:**
```bash
pip install unsloth trl peft transformers datasets
python train_rnai_llm.py --base unsloth/Qwen2.5-7B-Instruct --data rnai_dataset.sample.jsonl --out ./rnai-llm
```
- วิธี: **QLoRA 4-bit** — 7–8B รันบน RTX 4090/L4 (24GB) ได้สบาย
- งบ: Modal A10G คิดตามวินาที / เช่า GPU ~$0.3–0.8/ชม. × 2–6 ชม. = **ไม่กี่ร้อยบาท/รอบ**

## 4. ประเมินผล (ก่อนใช้จริง) — มีสคริปต์ให้แล้ว

หลัง deploy โมเดล (เสิร์ฟแบบ OpenAI-compatible) รัน:
```bash
export GEMINI_API_KEY=...
python eval_rnai_llm.py --endpoint http://localhost:8000 --model rnai-llm
# เทียบกับ base:
python eval_rnai_llm.py --endpoint <rnai-llm-url> --model rnai-llm \
   --baseline-endpoint <base-url> --baseline-model base
```
สคริปต์จะยิงชุด `rnai_eval.jsonl` (บุคลิก/ภาษาอาเซียน/สกิล/ความปลอดภัย) แล้วให้ **Gemini เป็นกรรมการ** ให้คะแนน helpfulness / language / persona (1-5) + safety pass-fail และ win-rate เทียบ base → ออกเป็น scorecard + `eval_results.json`

## 4.5 Builder track — ให้ Rnai LLM สร้างเว็บ/แอป/ซอฟต์แวร์

แบบเฟส (ตามที่เลือก: สมดุล = เทรนโค้ดทับบน Qwen2.5-7B ทั่วไป ไม่ทิ้งไทย/อาเซียน)

**เฟส 1 — สร้างโค้ด one-shot (ทำได้เลย):**
1. ขยายชุดข้อมูลโค้ด: `python expand_dataset.py --mode coder --target 1500`
   → ได้ `rnai_coder.train.jsonl` (สร้างเว็บ/React/Python/API/debug/SQL/Tailwind/Dockerfile)
2. รวมกับชุดทั่วไป แล้วเทรนรวม (โมเดลเดียวเก่งทั้งคุย + โค้ด):
   ```bash
   cat rnai_dataset.train.jsonl rnai_coder.train.jsonl > rnai_all.train.jsonl
   RNAI_DATA=rnai_all.train.jsonl python3 -m modal run modal_train.py   # เลือกไฟล์ผ่าน env
   ```
3. เสิร์ฟแล้วต่อเข้าสกิล `website-gen` / `text-code` ในแอปได้ทันที
- อยากเก่งโค้ดเป็นพิเศษ: เปลี่ยน `--base unsloth/Qwen2.5-Coder-7B-Instruct` (แลกกับไทย/อาเซียนอ่อนลงเล็กน้อย)

**เฟส 2 — เอเจนต์สร้างทั้งโปรเจกต์ (ต่อยอดภายหลัง):**
- ต้องเพิ่ม 2 อย่างนอกเหนือจากโมเดล:
  1. **Agent loop** — ระบบที่ให้โมเดลเรียกเครื่องมือจริง (write/read/run file, รันคำสั่ง) วนหลายรอบ
  2. **ข้อมูล agentic** — tool-use traces (เหมือน dataset Fable-5 ของโมเดล `hotdogs/qwen3.6...` ที่คุณได้สิทธิ์ — ใช้เป็นแม่แบบรูปแบบข้อมูลได้)
- แนะนำใช้ base ใหญ่ขึ้น (Qwen2.5-Coder-14B/32B) เมื่อถึงเฟสนี้ เพราะงานหลายไฟล์ต้องการความสามารถสูง

## 5. นำไปใช้ (เสียบเข้าระบบที่มีอยู่)
1. Export: merge LoRA เป็นโมเดลเต็ม **หรือ** ทำ GGUF (สคริปต์รองรับทั้งสอง)
2. เสิร์ฟด้วย vLLM/llama.cpp ตาม `../deploy/` ตั้งชื่อ served model = `rnai-llm`
3. ตั้ง `SELF_VLLM_URL` + `SELF_VLLM_MODEL=rnai-llm` ใน backend → backend จะใช้ Rnai LLM เป็น **ตัวสำรอง** ของสกิลข้อความทันที
4. (อนาคต) เมื่อมั่นใจคุณภาพ ค่อยเลื่อนเป็น provider หลักของบางสกิลได้

## ข้อควรรู้ตามจริง
- 7–8B fine-tune = ได้ "บุคลิก + ภาษา" ดีมาก แต่ความรู้/เหตุผลเชิงลึกยังสู้โมเดลใหญ่ (Gemini/GPT) ไม่ได้ → เหมาะเป็นผู้ช่วย/สำรอง ไม่ใช่แทนทุกงานทันที
- เริ่มเล็กแล้ววัดผลก่อน ค่อยขยับขนาด/ข้อมูลเมื่อเห็นทิศทาง
