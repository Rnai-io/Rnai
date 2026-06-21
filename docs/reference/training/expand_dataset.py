"""
Expand the Rnai LLM dataset with Gemini — turn a small seed into thousands of
diverse, deduped, quality-checked chat examples for QLoRA fine-tuning.

Pipeline:  seed examples (style reference)
        →  Gemini generates batches, steered across languages × task types
        →  validate schema + normalize the system prompt
        →  drop near-duplicates + low-quality rows
        →  write generated.jsonl  and  a merged train.jsonl (seed + generated)

Uses only the Python standard library (urllib) — no pip installs needed.

Setup
-----
  export GEMINI_API_KEY=...        # you already have this in the backend .env.local
  python expand_dataset.py --target 2000

Common options
--------------
  --target 2000          how many generated examples you want
  --model gemini-2.5-flash   (override if the name changes; flash = cheap & fast)
  --batch 8              examples requested per API call
  --seed rnai_dataset.sample.jsonl
  --out rnai_dataset.generated.jsonl
  --merged rnai_dataset.train.jsonl

NOTE: model names/endpoints change over time — if you get a 404, set --model to a
current Gemini model. Always eyeball a sample of the output before training.
"""

import argparse
import json
import os
import random
import re
import sys
import time
import urllib.error
import urllib.request
from difflib import SequenceMatcher

SYSTEM = ("You are Rnai, the friendly AI assistant of Rnai.io. "
          "Always reply in the user's language. Be concise, warm, and accurate.")

LANGUAGES = ["Thai", "English", "Indonesian", "Vietnamese", "Malay",
             "Filipino", "Khmer", "Lao", "Burmese"]

TASKS = [
    "a general knowledge question and a helpful answer",
    "summarizing a short passage the user pastes",
    "translating a sentence into another language naturally",
    "rewriting a message to a more polite or professional tone",
    "brainstorming a few creative ideas (names, captions, titles)",
    "generating relevant social-media hashtags for a post",
    "explaining a concept simply",
    "a small coding help request with a short code answer",
    "writing assistance (a short email, caption, or product blurb)",
    "politely refusing an unsafe or disallowed request and offering a safe alternative",
    "a friendly customer-support style reply",
    "a step-by-step how-to for an everyday task",
]

API_TMPL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"


def build_prompt(seed_examples, language, task, n):
    refs = "\n".join(json.dumps(e, ensure_ascii=False) for e in seed_examples[:3])
    return f"""You are creating supervised fine-tuning data for "Rnai", the AI assistant of Rnai.io.

Persona / system rule (every example must use EXACTLY this system message):
{json.dumps(SYSTEM, ensure_ascii=False)}

Style references (match this tone and JSON shape):
{refs}

Produce {n} NEW, DISTINCT training examples.
- Language of the user + assistant turns: {language}.
- Theme of each example: {task}.
- Make each user turn realistic and DIFFERENT from one another (vary topic, length, phrasing).
- The assistant must be helpful, concise, warm, accurate, and stay in character as Rnai.
- For the refusal theme, keep the refusal kind and offer a safe alternative.

Return ONLY a JSON array. Each item must be:
{{"messages":[{{"role":"system","content":"<the exact system rule above>"}},{{"role":"user","content":"..."}},{{"role":"assistant","content":"..."}}]}}
No markdown, no commentary — just the JSON array."""


def call_gemini(model, key, prompt, temperature=0.9, max_retries=3):
    url = API_TMPL.format(model=model, key=key)
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "topP": 0.95,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json",
        },
    }).encode("utf-8")

    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            msg = e.read().decode("utf-8", "ignore")[:200]
            if e.code in (429, 500, 503) and attempt < max_retries - 1:
                time.sleep(2 * (attempt + 1))
                continue
            print(f"  ! HTTP {e.code}: {msg}", file=sys.stderr)
            return None
        except Exception as e:  # noqa: BLE001
            if attempt < max_retries - 1:
                time.sleep(2 * (attempt + 1))
                continue
            print(f"  ! {e}", file=sys.stderr)
            return None
    return None


def parse_examples(text):
    if not text:
        return []
    text = text.strip()
    text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.MULTILINE).strip()
    try:
        arr = json.loads(text)
    except json.JSONDecodeError:
        m = re.search(r"\[.*\]", text, flags=re.DOTALL)
        if not m:
            return []
        try:
            arr = json.loads(m.group(0))
        except json.JSONDecodeError:
            return []
    return arr if isinstance(arr, list) else []


def normalize(ex):
    """Validate one example; return a clean {messages:[system,user,assistant]} or None."""
    if not isinstance(ex, dict) or not isinstance(ex.get("messages"), list):
        return None
    user = assistant = None
    for m in ex["messages"]:
        if not isinstance(m, dict):
            continue
        role, content = m.get("role"), m.get("content")
        if not isinstance(content, str) or not content.strip():
            continue
        if role == "user" and user is None:
            user = content.strip()
        elif role == "assistant":
            assistant = content.strip()
    if not user or not assistant:
        return None
    if len(user) < 3 or len(assistant) < 2:
        return None
    if len(user) > 6000 or len(assistant) > 6000:
        return None
    # enforce the canonical system message for training consistency
    return {"messages": [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": user},
        {"role": "assistant", "content": assistant},
    ]}


def norm_key(ex):
    u = ex["messages"][1]["content"].lower()
    return re.sub(r"\s+", " ", u).strip()[:160]


def is_near_dup(key, recent_keys, threshold=0.92):
    for k in recent_keys:
        if SequenceMatcher(None, key, k).ratio() >= threshold:
            return True
    return False


def load_jsonl(path):
    out = []
    if not os.path.exists(path):
        return out
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    out.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", default="rnai_dataset.sample.jsonl")
    ap.add_argument("--out", default="rnai_dataset.generated.jsonl")
    ap.add_argument("--merged", default="rnai_dataset.train.jsonl")
    ap.add_argument("--target", type=int, default=2000)
    ap.add_argument("--model", default=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"))
    ap.add_argument("--batch", type=int, default=8)
    ap.add_argument("--key", default=os.environ.get("GEMINI_API_KEY", ""))
    ap.add_argument("--sleep", type=float, default=0.5, help="pause between API calls (s)")
    args = ap.parse_args()

    if not args.key:
        sys.exit("Set GEMINI_API_KEY env var or pass --key")

    seed = load_jsonl(args.seed)
    if not seed:
        sys.exit(f"No seed examples found in {args.seed}")
    print(f"Seed: {len(seed)} examples · target generated: {args.target} · model: {args.model}")

    seen = set()
    recent = []                      # rolling window for near-dup check
    kept = []
    dropped_dup = dropped_bad = 0

    # pre-seed the dedup set with the seed prompts
    for s in seed:
        sn = normalize(s)
        if sn:
            seen.add(norm_key(sn))

    out_f = open(args.out, "w", encoding="utf-8")
    calls = 0
    max_calls = (args.target // max(1, args.batch)) * 3 + 20  # generous ceiling

    while len(kept) < args.target and calls < max_calls:
        language = random.choice(LANGUAGES)
        task = random.choice(TASKS)
        prompt = build_prompt(seed, language, task, args.batch)
        text = call_gemini(args.model, args.key, prompt)
        calls += 1

        for raw in parse_examples(text):
            ex = normalize(raw)
            if not ex:
                dropped_bad += 1
                continue
            key = norm_key(ex)
            if key in seen or is_near_dup(key, recent[-200:]):
                dropped_dup += 1
                continue
            seen.add(key)
            recent.append(key)
            kept.append(ex)
            out_f.write(json.dumps(ex, ensure_ascii=False) + "\n")
            out_f.flush()
            if len(kept) >= args.target:
                break

        print(f"  [{calls}] {language}/{task[:24]}… → kept {len(kept)} (dup {dropped_dup}, bad {dropped_bad})")
        time.sleep(args.sleep)

    out_f.close()

    # merged training file = seed + generated (seed first)
    with open(args.merged, "w", encoding="utf-8") as mf:
        for s in seed:
            sn = normalize(s)
            if sn:
                mf.write(json.dumps(sn, ensure_ascii=False) + "\n")
        for ex in kept:
            mf.write(json.dumps(ex, ensure_ascii=False) + "\n")

    print(f"\n✅ generated {len(kept)} examples → {args.out}")
    print(f"   dropped: {dropped_dup} duplicates, {dropped_bad} invalid")
    print(f"   merged train set (seed + generated) → {args.merged}")
    print("   Next: eyeball a sample, then  modal run modal_train.py --data " + args.merged)


if __name__ == "__main__":
    main()
