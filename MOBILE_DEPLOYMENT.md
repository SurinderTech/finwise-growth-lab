
# Mobile App Deployment Guide

## Setup Instructions

### 1. Initial Setup
After transferring your project to GitHub and cloning it locally:

```bash
# Install dependencies
npm install

# Initialize Capacitor (only needed once)
npx cap init

# Add platforms
npx cap add ios
npx cap add android
```

### 2. Build and Sync
Every time you make changes to your web app:

```bash
# Build the web app and sync to mobile platforms
npm run build
npx cap sync
```

### 3. Development

#### For iOS Development (requires macOS with Xcode):
```bash
# Open in Xcode for development
npx cap open ios

# Or run directly on simulator/device
npx cap run ios
```

#### For Android Development:
```bash
# Open in Android Studio
npx cap open android

# Or run directly on emulator/device  
npx cap run android
```

### 4. Production Build

#### iOS App Store:
1. Open the project in Xcode: `npx cap open ios`
2. Configure signing & capabilities
3. Archive the app (Product → Archive)
4. Upload to App Store Connect

#### Google Play Store:
1. Open the project in Android Studio: `npx cap open android`
2. Generate signed APK/AAB (Build → Generate Signed Bundle/APK)
3. Upload to Google Play Console

## Important Notes

- **Hot Reload**: The app is configured to load from your Lovable preview URL during development
- **Production**: Before publishing, update `capacitor.config.ts` to remove the server URL so it uses the built files
- **Icons & Splash**: Add your app icons in the respective platform folders after running `npx cap add`
- **Permissions**: Add required permissions in `android/app/src/main/AndroidManifest.xml` and `ios/App/App/Info.plist`

## Helpful Commands

```bash
# Quick development cycle
npm run mobile:build          # Build and sync both platforms
npm run mobile:dev:ios        # Build, sync, and run on iOS
npm run mobile:dev:android    # Build, sync, and run on Android

# Individual platform sync
npm run cap:sync:ios          # Sync only iOS
npm run cap:sync:android      # Sync only Android
```

## Troubleshooting

- If you encounter build issues, try `npx cap sync` after making changes
- For iOS issues, clean build folder in Xcode (Product → Clean Build Folder)
- For Android issues, clean project in Android Studio (Build → Clean Project)
- Make sure your development environment has the latest versions of Xcode/Android Studio
