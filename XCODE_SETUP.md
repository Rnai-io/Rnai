# Opening Rnai Mobile App in Xcode

This is a React Native + Expo project. Here's how to open it in Xcode.

## Method 1: Expo Simulator (Easiest - No Xcode Native Code)

Best for rapid development and testing the design system.

```bash
# Navigate to the project
cd rnai-mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# When you see the menu, press 'i' to open iOS Simulator
# Xcode will automatically launch the simulator if needed
```

The app will run in the iOS Simulator without needing to open Xcode directly.

### Hot Reload
Changes to your code reload instantly in the simulator. No need to rebuild.

---

## Method 2: Xcode Native Build (Production-ready)

For native iOS builds that can be run on real devices or submitted to App Store.

### Step 1: Create Native iOS Project

```bash
# In the rnai-mobile directory
npx expo prebuild --clean
```

This creates an `ios/` folder with native Xcode project files.

### Step 2: Open in Xcode

```bash
# Open the Xcode workspace
open ios/rnai-mobile.xcworkspace

# NOT the .xcodeproj file - use .xcworkspace!
```

### Step 3: Build and Run

**Option A: From Xcode UI**
1. Select simulator or device in the top toolbar
2. Press ⌘ + R to build and run
3. App opens in simulator or on connected device

**Option B: From Terminal**
```bash
# Build for simulator
xcodebuild -workspace ios/rnai-mobile.xcworkspace \
  -scheme rnai-mobile \
  -configuration Debug \
  -derivedDataPath build \
  -arch x86_64 \
  -sdk iphonesimulator

# Build for device
xcodebuild -workspace ios/rnai-mobile.xcworkspace \
  -scheme rnai-mobile \
  -configuration Release
```

---

## Method 3: Expo Go App (Real Device Testing)

Fastest way to test on a real iPhone without building.

### Step 1: Install Expo Go

- Download "Expo Go" from App Store (free)
- Or scan the QR code that appears when you run `npm start`

### Step 2: Connect

```bash
npm start

# Follow the on-screen instructions
# Scan the QR code with your iPhone camera
# Expo Go opens automatically
```

Your app will load on your real device instantly. Changes sync in real-time.

---

## Project Structure in Xcode

When you open `ios/rnai-mobile.xcworkspace`, you'll see:

```
ios/
├── rnai-mobile/              # iOS-specific code
│   ├── Info.plist            # App configuration
│   ├── rnai-mobile.entitlements  # Capabilities
│   └── Supporting Files/
├── rnai-mobile.xcodeproj/    # Xcode project
├── Pods/                     # CocoaPods dependencies
└── Podfile                   # Dependency management
```

The actual React code stays in the `app/` directory (in the parent folder).

---

## Common Issues

### "Failed to load app info from Expo"
```bash
# Clear cache and rebuild
rm -rf ios node_modules
npm install
npx expo prebuild --clean
```

### "iOS deployment target mismatch"
In Xcode:
1. Select `rnai-mobile` project in left sidebar
2. Select `Build Settings` tab
3. Search for "iOS Deployment Target"
4. Change to 14.0 or higher

### "Command not found: npx"
```bash
# Install Node.js 18+
# Verify: node --version  (should be v18+)
```

### Simulator Won't Start
```bash
# Restart simulator
xcrun simctl erase all
# Or in Xcode: Device > Erase All Content and Settings
```

### Can't find rnai-mobile.xcworkspace
Make sure you ran:
```bash
npx expo prebuild --clean
```

This creates the workspace file. Without it, only `.xcodeproj` exists (don't use that for React Native).

---

## Development Workflow

### For Rapid Iteration (Simulator)
```bash
npm start
# Press 'i' for iOS
# Make code changes
# Changes reload automatically
```

### For Native Debugging (Xcode)
```bash
npx expo prebuild --clean
open ios/rnai-mobile.xcworkspace
# Build with ⌘ + R
# Use Xcode debugger if needed
```

### For Device Testing (Real iPhone)
```bash
npm start
# Scan QR with Expo Go app
# Test on real iPhone
```

---

## Testing the Design System

The app includes two color schemes. Test both:

1. **Brand Colors** (Orange #D77757 + Blue #5769F7)
   - Default when app starts
   
2. **Modern Colors** (Blue #378ADD + Green #639922)
   - Toggle via Profile > Account > Theme

Watch the entire app theme change instantly when you switch schemes.

---

## Performance Notes

- **Expo Simulator**: Excellent for development. Fast hot reload.
- **Xcode Native Build**: Better performance. Needed for production.
- **Real Device**: Most accurate testing. Use Expo Go for quick iteration.

Start with Expo Simulator (Method 1) for fastest development.

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start development**: `npm start`
3. **Press 'i'** to open iOS Simulator
4. **Test the three screens**: Home, Create, Profile
5. **Switch color schemes** in Profile settings
6. **When ready for production**: Follow Method 2 to create native build

---

**Questions?**
- Check `README.md` for general info
- See `MOBILE_APP_DESIGN.md` for design system details
- See `MOBILE_SCREENS_SPEC.md` for implementation specs

---

**Ready to build!** 🚀
