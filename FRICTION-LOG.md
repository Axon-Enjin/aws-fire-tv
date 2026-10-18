# Friction Log

Problems hit while building FormVision on Vega OS. Each entry: what happened, evidence, workaround, suggested fix.

Environment: Ubuntu 24.04.4 x86_64, Node 22.14.0, Vega CLI 1.4.4, Vega SDK 0.24.12112.

---

## 2026-10-12

### 1. `vega project generate -t helloWorld` fails: CLI requests an internal-only npm scope
- **What:** Generating the default RN 0.83 template ran `npm install --save --save-exact @amzn/ks-app@0.83`, which returns 404 from registry.npmjs.org.
- **Evidence:** npm debug log: `GET 404 https://registry.npmjs.org/@amzn%2fks-app`. The SDK's own `KeplerCLI/.../dist/components.json` declares the template as `@amazon-devices/ks-app` version `0.83`. The CLI bundle comments describe `@amzn/` as "internal-only".
- **Workaround:** `npm pack @amazon-devices/ks-app@0.83.7`, then render `template/*.mustache` by hand (`name`, `nameLowerCase`, `packageId`, `componentId`). The rendered project built and ran on VVD.
- **Suggested fix:** Resolve template URIs from `components.json` (public scope). Add a CI smoke test of `vega project generate` against the public registry with no internal npm config.

### 2. Installer prompts fail without a TTY
- **What:** `get_vvm.sh` reads answers from `/dev/tty`. In a non-interactive shell it printed `/dev/tty: No such device or address` at each prompt, then continued with defaults.
- **Suggested fix:** Add a `--yes` / `--non-interactive` flag and document it for CI and agent-driven setup.

### 3. No camera API in Vega SDK 0.24
- **What:** There is no documented or packaged way for a Vega app to read camera frames.
- **Evidence:**
  - None of the 78 packages in `~/vega/sdk/.../0.24.12112/packages` is a camera interface. There are `Kepler*Interface` packages for geolocation, input, graphics, network, etc., but none for camera or video capture.
  - No camera package exists under `@amazon-devices/*` on npm.
  - The Vega docs have no camera page.
  - On VVD, `vega device run-cmd -c 'ls /dev'` shows no `video*` or `media*` nodes, and there is no `/sys/class/video4linux`.
- **Impact:** Computer-vision fitness on the TV camera is listed by the hackathon as a "CREATIVE" Fire TV example, but Vega apps cannot reach a camera today.
- **Suggested fix:** Document the camera/USB UVC roadmap for Vega, or state explicitly that it is unsupported.

### 4. VVD is Android-emulator based and configurable for a webcam, but nothing in the guest uses it
- **What:** `vvd/images/tv/image_files/config.ini` contains `hw.camera.back = emulated`, and `hardware-properties.ini` documents the value `webcam<N>`. I changed it to `webcam0`. The new instance's `hardware-qemu.ini` picked it up, but no guest device or API appeared (see 3).
- **Suggested fix:** Either remove the camera properties from the VVD image or expose them to apps.

### 5. VVD cannot install apps that use the `vegaWebview` template
- **What:** A probe app generated from `@amazon-devices/ks-app@2.83.1` (the `vegaWebview` template) built successfully but failed to install on VVD.
- **Evidence:** `Module dependency not found … /com.amazon.kepler.webview_4@IWebview_4 … The Vega Virtual Device is missing modules that are available on a physical device. Test your app using a Fire TV Stick instead.`
- **Impact:** The SDK ships a WebView template that its own simulator cannot run. Developers without hardware (e.g. outside the US, where devices are import-only) cannot test WebView apps at all.
- **Suggested fix:** Ship the WebView module in the VVD image, or mark the template as device-only in `vega project list-templates`.
