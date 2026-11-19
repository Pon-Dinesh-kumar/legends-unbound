# Legends Unbound

A portrait Expo showcase for three original collectible-card illustrations. No gameplay systems are included.

## Run

Install dependencies with `npm install`, then run `npx expo start`. Open the project in Expo Go on an iOS or Android device. Drag the selected card to tilt it responsively; Unbound also adds parallax to its artwork. Use the Flip Card button to see the shared Sherlock-inspired reverse and select a legend using the three tiles. Motion falls back to the accelerometer or touch when device motion is unavailable.

Select **Origin**, **Awakened**, or **Unbound** above the legend picker. All levels use the same artwork and border: Origin stays inside the frame, Awakened reveals the frame break, and Unbound enables parallax and available character animations. All levels support a responsive card tilt. The three diamonds on the bottom frame edge show the current level. Sherlock and Dracula currently have one animated detail each; Tarzan does not yet have a character animation.

The artwork is composited from separate background, character, foreground, and effects PNGs. A shared transparent frame and image wordmarks are combined with native stat gems. See [ART_DIRECTION.md](ART_DIRECTION.md) for the locked collection style. Device motion and performance should be verified on actual iOS and Android hardware.

The asset contract, evolution rules and animation requirements are in [Card asset generation and assembly](docs/CARD_ASSET_GUIDELINES.md). For a future name-only card request, follow the complete [card generation pipeline](docs/CARD_GENERATION_PIPELINE.md): planning all three animations and their quality gates comes before any asset generation. The level selector is implemented; a generic manifest-driven pipeline remains planned.

## Android test APK

With a compatible JDK and Android SDK installed, generate the native project with `npx expo prebuild --platform android --no-install`, then run `./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a` from the `android` directory (`.\gradlew.bat` in Windows PowerShell). The APK is written under `android/app/build/outputs/apk/release/`. This ARM64 build targets modern Android phones; include `x86_64` in the architecture list when an emulator build is needed. The generated Expo project uses its debug signing configuration for this release build: it is a local test APK, not a Play Store signing setup. On Windows, a short physical build directory may be needed to avoid native CMake path-length limits.

If Windows Ninja reports a path-length error even from a short project directory, use a unique short CMake staging directory and object-path limit in the **generated** `android/app/build.gradle` before building:

```groovy
android {
    externalNativeBuild { cmake { buildStagingDirectory file('C:/LCX') } }
    defaultConfig {
        externalNativeBuild { cmake { arguments '-DCMAKE_OBJECT_PATH_MAX=240' } }
        // Keep the other generated defaultConfig settings.
    }
    // Keep the other generated Android settings.
}
```

Choose a staging directory that does not belong to another build. Native folders are generated and ignored by Git, so reapply this local workaround after a clean prebuild if needed.

On a physical phone, check loading, all three evolutions, drag and sensor tilt, Unbound parallax, flip, app background/resume and reduced motion. Device motion calibrates to the phone's initial orientation and recalibrates when the app returns from the background; the accelerometer or touch is used when device motion is unavailable. A successful build or synthetic browser sensor check does not establish physical-device smoothness or performance.


