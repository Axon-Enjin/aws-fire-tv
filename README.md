# Fire TV

Track repo for the Amazon Developer Hackathon. This folder is the whole project: rules, sponsor context, the research prompt, and the research report. It does not depend on any other local folder.

- **Hackathon:** Build, Ship, Shape: Amazon Developer Hackathon
- **Deadline:** 23 Oct 2026, 12:00 PM PT
- **Track:** A demo-ready app on Fire OS or Vega OS. Sponsor themes include AI-enhanced viewing, sports, fitness, family entertainment, multi-modal UX, and computer vision.

## Recommended build

**FormVision** — live pose coaching on a camera-capable Fire TV. MediaPipe runs on the device; only joint angles go to Bedrock for the spoken cue. Rubric total 31, ahead of FitFlow (28) and GymClock+ (24).

Three-year SOM in the report is about $9M ARR at $4.99 a month after the app-store fee.

**Platform (decided 12 Oct):** Fire OS / Android TV. Vega SDK 0.24 has no camera API, so the app is React Native 0.83 for TV with a Kotlin CameraX + MediaPipe module, demoed on the Android TV Emulator using the laptop webcam. See [TECH-SPEC.md §11](TECH-SPEC.md) and [FRICTION-LOG.md](FRICTION-LOG.md).

## Run it

Prereqs: Node 22, JDK 17, Android SDK at `~/Android/Sdk`, AVD `fv_tv` (Android TV API 36 x86_64, `hw.camera.front = webcam0`, `hw.camera.back = none`, `hw.cpu.ncore = 4`).

```bash
cd packages/core && npm install && npm test          # coaching logic tests
~/Android/Sdk/emulator/emulator -avd fv_tv -no-snapshot -gpu swiftshader_indirect &   # host-GPU mode crashes on this laptop
cd app && npm install && npx react-native start &      # Metro
cd app/android && JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./gradlew :app:assembleDebug -PreactNativeArchitectures=x86_64
adb install -r -g app/build/outputs/apk/debug/app-debug.apk && adb reverse tcp:8081 tcp:8081
adb shell am start -n com.formvision.coach/.MainActivity
```

## Docs

| File | What it is |
|---|---|
| [PRD.md](PRD.md) | FormVision product requirements: scope, requirements, milestones, gates |
| [SITEMAP.md](SITEMAP.md) | Screens, navigation flow, remote key map, focus rules |
| [BRANDING.md](BRANDING.md) | Name, voice, colour, 10-foot type, motion, sound, demo-video style |
| [TECH-SPEC.md](TECH-SPEC.md) | Architecture, native pose module, coaching logic, backend API, tests |
| [HACKATHON.md](HACKATHON.md) | Full hackathon rules and dates, copied so this repo stands alone |
| [ORG.md](ORG.md) | Amazon, AWS, and device-team goals, copied so this repo stands alone |
| [PROMPT.md](PROMPT.md) | Deep-research prompt for this track |
| [Fire-TV-Hackathon-Research.md](Fire-TV-Hackathon-Research.md) | Research report and the three pitches |
