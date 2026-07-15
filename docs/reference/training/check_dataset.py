"""
Quality-check a Rnai LLM training file before you spend GPU on it.

Validates structure, flags low-quality rows, removes exact duplicates, and
reports code-block coverage + length stats. Optionally writes a cleaned file.

Usage
-----
  python3 check_dataset.py rnai_all.train.jsonl
  python3 check_dataset.py rnai_all.train.jsonl --fix   # also write *.clean.jsonl

Stdlib only.
"""

import argparse
import json
import re
import sys

SYSTEM_HINT = "Rnai"


def norm_key(user: str) -> str:
    return re.sub(r"\s+", " ", user.lower()).strip()[:200]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--fix", action="store_true", help="write a cleaned <file>.clean.jsonl")
    ap.add_argument("--min-assistant", type=int, default=2)
    ap.add_argument("--max-chars", type=int, default=8000)
    args = ap.parse_args()

    total = kept = 0
    bad = {"parse": 0, "schema": 0, "empty": 0, "too_long": 0, "no_system": 0}
    dup = 0
    code_rows = 0
    seen = set()
    u_lens, a_lens = [], []
    cleaned = []
    examples_bad = []

    with open(args.file, encoding="utf-8") as f:
        for ln, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            total += 1
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                bad["parse"] += 1
                if len(examples_bad) < 5: examples_bad.append((ln, "parse error"))
                continue
            msgs = obj.get("messages")
            if not isinstance(msgs, list):
                bad["schema"] += 1
                continue
            roles = [m.get("role") for m in msgs if isinstance(m, dict)]
            user = next((m["content"] for m in msgs if m.get("role") == "user" and m.get("content")), None)
            asst = next((m["content"] for m in reversed(msgs) if m.get("role") == "assistant" and m.get("content")), None)
            if not user or not asst or roles[-1] != "assistant":
                bad["schema"] += 1
                if len(examples_bad) < 5: examples_bad.append((ln, "missing user/assistant or wrong order"))
                continue
            if "system" not in roles:
                bad["no_system"] += 1
            if len(asst.strip()) < args.min_assistant or len(user.strip()) < 2:
                bad["empty"] += 1
                continue
            if len(user) > args.max_chars or len(asst) > args.max_chars:
                bad["too_long"] += 1
                continue
            key = norm_key(user)
            if key in seen:
                dup += 1
                continue
            seen.add(key)
            if "```" in asst:
                code_rows += 1
            u_lens.append(len(user)); a_lens.append(len(asst))
            kept += 1
            if args.fix:
                cleaned.append(line)

    def avg(xs): return round(sum(xs) / len(xs)) if xs else 0

    print(f"\n── Quality report: {args.file} ──")
    print(f"  total lines     : {total}")
    print(f"  ✅ kept (clean)  : {kept}")
    print(f"  ♻️  exact dups    : {dup}")
    print(f"  ⚠️  dropped bad   : {sum(bad.values())}  {bad}")
    print(f"  code-block rows  : {code_rows} ({round(100*code_rows/max(1,kept))}%)")
    print(f"  avg len (user/assistant): {avg(u_lens)} / {avg(a_lens)} chars")
    if examples_bad:
        print("  sample issues   :")
        for ln, why in examples_bad:
            print(f"    line {ln}: {why}")

    health = kept / max(1, total)
    print(f"\n  health: {round(100*health)}% usable", "✅" if health >= 0.97 else "⚠️ ตรวจเพิ่ม")

    if args.fix:
        out = args.file.rsplit(".", 1)[0] + ".clean.jsonl"
        with open(out, "w", encoding="utf-8") as g:
            g.write("\n".join(cleaned) + "\n")
        print(f"\n  ✨ cleaned file → {out}  ({kept} rows)")
        print(f"     train on it:  RNAI_DATA={out} python3 -m modal run modal_train.py")

    if sum(bad.values()) > total * 0.1:
        sys.exit(1)  # >10% bad → fail (useful in CI)


if __name__ == "__main__":
    main()
