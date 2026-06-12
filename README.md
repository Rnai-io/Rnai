# Rnai.io Mobile App

iOS/Android mobile application with React Native + Expo. Fully iOS-compliant design system with both brand and modern color schemes.

## Quick Start

### Prerequisites
- Node.js 18+
- Xcode 15+ (for iOS)
- Expo CLI

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Start the development server
npm start
```

## Running on Xcode

### Option 1: Expo Go (Easiest for Testing)

1. Install Expo Go app on your iPhone
2. Run `npm start`
3. Scan the QR code with Xcode Preview or iPhone camera

### Option 2: Xcode Simulator

```bash
# Start Expo in development mode
npm start

# Press 'i' to open in iOS Simulator
# Xcode should automatically launch
```

### Option 3: Native Xcode Build

For production builds with native code:

```bash
# Create native iOS project
npx expo prebuild --clean

# This creates 'ios' folder that you can open in Xcode
open ios/rnai-mobile.xcworkspace

# Build and run from Xcode (Cmd + R)
```

## Project Structure

```
rnai-mobile/
├── app/
│   ├── (tabs)/           # Bottom tab navigation
│   ├── screens/          # Screen components
│   │   ├── home.tsx      # Home/Dashboard
│   │   ├── create.tsx    # Playground
│   │   └── profile.tsx   # Profile/Settings
│   ├── components/       # Reusable UI components
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── StatCard.tsx
│   │       └── SkillCard.tsx
│   ├── constants/        # Design tokens
│   │   └── design.ts
│   ├── context/          # React context
│   │   └── ThemeContext.tsx
│   ├── skill/            # Skill execution screen
│   └── _layout.tsx       # Root navigation
├── assets/               # App icons, splash screens
├── app.json             # Expo configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies

```

## Design System

### Colors

**Brand Palette** (default)
- Primary: `#D77757` (Orange)
- Secondary: `#5769F7` (Blue)

**Modern Palette** (alternative)
- Primary: `#378ADD` (Blue)
- Secondary: `#639922` (Green)

Switch color schemes via Profile screen Theme setting.

### Typography

- **Display**: 32px, 700 weight (page titles)
- **Headline**: 17px, 600 weight (section headers)
- **Body**: 17px, 400 weight (main content)
- **Callout**: 16px, 500 weight (buttons, emphasis)
- **Subheadline**: 15px, 400 weight (secondary info)
- **Caption**: 13px, 400 weight (labels, hints)

### Spacing Grid

Base unit: 4px
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `xxl`: 24px

### iOS Compliance

✅ Bottom tab navigation (not top)  
✅ 44px minimum touch targets  
✅ Safe area handling (notch, home indicator)  
✅ System fonts (San Francisco)  
✅ iOS gestures and animations  

## Features

### Home Screen
- Credits balance display
- Monthly usage statistics (2x2 grid)
- Quick access links
- "Start Creating" CTA

### Playground Screen
- Searchable skill list (10+ skills)
- Skill categories (Image, Text, Audio)
- One-tap skill execution
- Search filtering

### Profile Screen
- User avatar and info
- Account settings (Credits, Language, Theme)
- App information
- Sign out (with confirmation)

### Skill Execution
- Dynamic input forms
- Real-time validation
- Progress indication
- Result display
- Save/Share actions (ready for implementation)

## Theme Switching

Press the "Theme" option in Profile > Account to toggle between brand and modern color schemes. Changes apply instantly across the entire app.

## Environment Variables

Create `.env.local` (not committed):

```
EXPO_PUBLIC_API_URL=https://api.rnai.io
EXPO_PUBLIC_FIREBASE_CONFIG=...
```

## Building for App Store

```bash
# Create development build
eas build --platform ios

# Create production build
eas build --platform ios --release

# Submit to App Store
eas submit --platform ios
```

## Testing

- Test on real device: `npm start` → scan QR code
- Test on simulator: `npm run ios`
- Test color schemes: Toggle theme in Profile
- Test responsive layout: Rotate device (portrait/landscape)

## Troubleshooting

**"Module not found" error**
```bash
# Clear cache and reinstall
rm -rf node_modules .expo
npm install
npm start
```

**Xcode build fails**
```bash
# Rebuild native code
npx expo prebuild --clean
```

**Theme not switching**
- Ensure you're in the Profile screen
- Tap the "Theme" setting
- App should refresh immediately

## Next Steps

1. Connect Firebase authentication
2. Implement API integration (`/api/v1/generate`, `/api/playground/run`)
3. Add image upload from photo library
4. Implement skill result saving
5. Add offline support
6. Push notifications setup

## Documentation

See the main project for:
- `MOBILE_APP_DESIGN.md` - Complete design system
- `MOBILE_SCREENS_SPEC.md` - Detailed screen specifications
- `MOBILE_DESIGN_SUMMARY.md` - Project overview and roadmap

## Support

For design questions, refer to `MOBILE_APP_DESIGN.md`.  
For API integration, check `MOBILE_SCREENS_SPEC.md`.

---

**Status**: Ready for development  
**Target Launch**: Q3 2026  
**iOS Minimum**: 14.0+  
**Android Minimum**: API 26 (8.0+)
