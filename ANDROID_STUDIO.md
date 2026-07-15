# ทดสอบ Rnai.io Mobile ใน Android Studio

แอปนี้เป็น Expo (SDK 54) ที่ prebuild เป็นโปรเจค Android เนทีฟแล้ว (โฟลเดอร์ `android/`)

## เตรียมครั้งแรก

```bash
cp .env.example .env          # แล้วใส่ค่า EXPO_PUBLIC_API_URL ฯลฯ
./scripts/prepare-android.sh  # ติดตั้ง deps + ตรวจความพร้อม
```

ต้องมีก่อน:
- **Node.js** (มี npm)
- **Android Studio** + Android SDK (เปิด SDK Manager ติดตั้ง "Android SDK Platform" + "Build-Tools" + สร้าง Emulator ใน Device Manager)
- ตั้ง `ANDROID_HOME` ให้ชี้ไป SDK (มักอยู่ที่ `~/Library/Android/sdk` บน macOS)

## วิธีรัน

### ทางที่ 1 — ผ่าน Android Studio (แนะนำตอนดีบัก UI)
1. เปิด Android Studio → **Open** → เลือกโฟลเดอร์ **`android/`** (ไม่ใช่ root)
2. รอ **Gradle sync** เสร็จ
3. เลือก Emulator หรือเสียบมือถือ (เปิด USB debugging)
4. เปิด Metro bundler อีกหน้าต่าง: `npm start`
5. กด ▶ **Run**

### ทางที่ 2 — สั่งครั้งเดียวจบ
```bash
./scripts/prepare-android.sh --run     # = npx expo run:android (build + ลง + เปิด Metro ให้)
```

### ถ้าแก้ config เนทีฟ (app.json/permission/plugin) แล้วต้องสร้างใหม่
```bash
./scripts/prepare-android.sh --clean   # expo prebuild --clean -p android
```

## ค่าที่ตั้งไว้แล้ว
- `applicationId` / package: `io.rnai.mobile`
- `versionCode`: 1 · `versionName`: 2.0.0
- permissions: `RECORD_AUDIO` (สำหรับ speech-to-text), `INTERNET`
- plugin: `expo-audio`

## ปัญหาที่เจอบ่อย
- **`Cannot run program "node"` ตอน Gradle sync** → Android Studio (GUI) หา node ไม่เจอเพราะไม่ได้รับ PATH จาก terminal แก้ได้ 2 ทาง:
  - รันจาก terminal แทน: `npx expo run:android` (เร็วสุด)
  - หรือ symlink node เข้า PATH ที่ GUI เห็น แล้วเปิด Android Studio ใหม่:
    ```bash
    sudo ln -sf "$(which node)" /usr/local/bin/node
    sudo ln -sf "$(which npm)" /usr/local/bin/npm
    ```
- **แอปเปิดมาจอขาว/แดง** → Metro ยังไม่รัน หรือ `EXPO_PUBLIC_API_URL` ใน `.env` ว่าง
- **`Cannot find native module ExpoSecureStore`/`expo-audio`** → เวอร์ชัน expo package ไม่ตรง SDK 54 → `npx expo install --fix` แล้ว `--clean` prebuild ใหม่
- **Gradle sync ค้าง/JDK error** → ตั้ง Android Studio ให้ใช้ JBR (Settings → Build Tools → Gradle → Gradle JDK = jbr-17)
- **เน็ตไม่ออกบน Emulator** → ตรวจว่า `INTERNET` permission อยู่ (เพิ่มแล้ว) และ backend URL เข้าถึงได้จาก emulator
