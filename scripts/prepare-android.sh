#!/usr/bin/env bash
#
# prepare-android.sh — get Rnai.io Mobile ready to open & run in Android Studio.
#
# Usage:
#   ./scripts/prepare-android.sh           # install deps + sanity checks
#   ./scripts/prepare-android.sh --clean   # also regenerate native android/ (expo prebuild --clean)
#   ./scripts/prepare-android.sh --run      # install + launch on emulator/device (expo run:android)
#
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; YEL=$'\033[1;33m'; NC=$'\033[0m'
ok(){ echo "${GREEN}✓ $*${NC}"; }; warn(){ echo "${YEL}! $*${NC}"; }; err(){ echo "${RED}✗ $*${NC}"; }
hdr(){ echo; echo "──────── $* ────────"; }

CLEAN=0; RUN=0
for a in "$@"; do case "$a" in --clean) CLEAN=1;; --run) RUN=1;; esac; done

hdr "1) ตรวจเครื่องมือ"
command -v node >/dev/null && ok "node $(node -v)" || { err "ไม่พบ node — ติดตั้งจาก https://nodejs.org"; exit 1; }
command -v java >/dev/null && ok "java พบแล้ว" || warn "ไม่พบ java — Android Studio มี JDK ในตัว (ตั้ง JAVA_HOME ให้ชี้ไป Android Studio jbr)"
[ -n "${ANDROID_HOME:-}${ANDROID_SDK_ROOT:-}" ] && ok "ANDROID_HOME/SDK ตั้งแล้ว" || warn "ยังไม่ตั้ง ANDROID_HOME — เปิด Android Studio > SDK Manager ติดตั้ง SDK ก่อน"

hdr "2) ติดตั้ง dependencies"
if [ -d node_modules ]; then ok "node_modules มีแล้ว"; else
  npm install --legacy-peer-deps && ok "npm install เสร็จ" || { err "npm install ล้มเหลว"; exit 1; }
fi

hdr "3) ตรวจ .env"
if [ -f .env ]; then
  grep -q "EXPO_PUBLIC_API_URL=" .env && ok "EXPO_PUBLIC_API_URL ตั้งแล้ว" || warn "ยังไม่ได้ตั้ง EXPO_PUBLIC_API_URL ใน .env"
else
  warn "ไม่มี .env — คัดลอกจาก .env.example: cp .env.example .env แล้วใส่ค่า"
fi

hdr "4) Native android/"
if [ "$CLEAN" = 1 ]; then
  warn "regenerate native (expo prebuild --clean -p android)"
  npx expo prebuild --clean -p android && ok "prebuild เสร็จ" || { err "prebuild ล้มเหลว"; exit 1; }
elif [ -d android ]; then
  ok "android/ มีอยู่แล้ว (ข้าม prebuild — ใช้ --clean ถ้าต้องการสร้างใหม่)"
else
  warn "ยังไม่มี android/ — สร้างด้วย expo prebuild -p android"
  npx expo prebuild -p android && ok "prebuild เสร็จ" || { err "prebuild ล้มเหลว"; exit 1; }
fi

if [ "$RUN" = 1 ]; then
  hdr "5) รันบน emulator/อุปกรณ์"
  npx expo run:android
else
  hdr "เสร็จ — เปิดใน Android Studio"
  cat <<'EOF'
  1. เปิด Android Studio → Open → เลือกโฟลเดอร์ ./android (ไม่ใช่ root โปรเจค)
  2. รอ Gradle sync ให้เสร็จ
  3. สร้าง/เลือก Emulator (Device Manager) หรือเสียบมือถือเปิด USB debugging
  4. เปิด Metro ก่อน (อีกหน้าต่าง):  npm start   หรือ  npx expo start --dev-client
  5. กด ▶ Run ใน Android Studio
  (ทางลัด: ./scripts/prepare-android.sh --run  จะ build + ลงให้อัตโนมัติ)
EOF
fi
