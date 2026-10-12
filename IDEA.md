# IDEA: FormVision

## The idea
FormVision turns a Fire TV into a live personal trainer that can see you. A camera watches the workout, MediaPipe Pose tracks 33 body landmarks on the edge, and the TV shows a split screen: your live skeleton on one side, the target form on the other. When a joint angle drifts past a safety threshold, the skeleton turns red at that joint and a short spoken cue tells you how to fix it ("hips up two inches"). Only joint angles and rep state go to Amazon Bedrock to phrase the cue. No video leaves the device.

The core is real-time form correction. Two ideas from the other pitches are folded in so the product is a full session, not a tech demo:
- **Automatic rep, set, and rest tracking (from GymClock+).** The same pose stream counts reps, detects the end of a set, starts the rest timer, and logs the set. The user never has to touch the remote or say "log 8 reps".
- **Adaptive session plan (from FitFlow).** Before or during a session the user states a constraint ("my knees are sore today", "I have 15 minutes"). Bedrock re-plans the next exercises from a small library of moves the camera can actually judge, and the TV timeline updates. No branching video library is needed.

## Why this direction won
- **Fits the track's own definition of CREATIVE.** The official rules name "a CV fitness app using the TV camera" as a creative Fire TV example. Fitness and computer vision are both priority categories.
- **Scores highest on the four criteria.** The research matrix puts FormVision at 31 vs FitFlow 28 and GymClock+ 24. It leads on Tech Implementation (edge CV plus Bedrock) and Quality of Idea, and Tech Implementation is the first tie-breaker.
- **Folding in beats choosing.** GymClock+ alone is OBVIOUS (a timer). FitFlow alone needs a produced, branchable video library and depends on Alexa+ voice hooks that third-party hackathon builders cannot reach. Their best parts (hands-free logging, adaptive plans) cost little once the pose stream exists.
- **Differentiation.** High feedback at low cost: Forme and Tonal give feedback for thousands of dollars of hardware, YouTube and the Peloton app give none. FormVision uses the TV the user already owns.

## Ideas dropped or deferred
- Branching instructor video library (FitFlow): too expensive to produce, buffering risk. Replaced by an on-screen target pose and exercise cards.
- Alexa+ voice logging (GymClock+): Alexa+ add-on tooling is gated for this hackathon. Voice input, if any, comes from the companion phone or the TV remote mic.
- Multi-user profiles, history charts, Appstore IAP: post-hackathon.

## Problem
Home exercisers follow passive videos on the biggest screen in the house with no feedback on form, which risks injury and stalls progress. The workarounds are expensive (a $2,495 smart mirror plus $49/month) or clumsy (OBS with two webcams to check your own lifts). Source: Fire-TV-Hackathon-Research.md, sections 1 to 2.

## Camera path (decide in the first spike)
Fire TV Sticks have no camera, so the camera source is a pluggable layer:
1. **On-device:** Fire OS app on a Fire TV Cube with a USB UVC webcam, or the Android TV emulator with the host webcam, running MediaPipe Pose Landmarker on the device.
2. **Bring your own camera (BYOC):** a companion phone web page runs MediaPipe Pose in the browser and streams landmarks (numbers only) to the TV app over the local network. This is also the product answer for the Stick majority.
Build whichever works first; BYOC is the guaranteed fallback. Fire OS is preferred over Vega OS for the demo because the research's own flip condition (Vega not exposing raw camera frames) is avoided entirely. Vega support is a stretch goal.

## Suggested stack
Fire OS app (React Native for TV via react-native-multi-tv-app-sample, or Kotlin), MediaPipe Pose (Android Tasks API or MediaPipe JS on the phone), joint-angle rules per exercise in plain code, Amazon Bedrock (Claude Haiku or Nova Micro) for cue phrasing and session re-planning, Amazon Polly or on-device TTS for the spoken cue. Amazon Devices Builder Tools MCP for development.

## Demo (target by Oct 15, 2026)
A screen recording on the Fire TV emulator (or a real Cube) of one complete set:
1. User picks "Squat" with the D-pad. Camera starts; live skeleton overlays the user.
2. Reps count up automatically. On rep 4 the knees cave in: the knee joints turn red, the cue plays, the user corrects, the joints turn green.
3. Set ends; the rest timer starts on its own and the set is logged.
4. User says or types "my knees are sore". The next exercise swaps from lunges to glute bridges on the timeline.
Minimum exercises: squat and plank. Stretch: lunge, push-up.

## Hackathon fit
- **Track:** Fire TV (demo must run on a Fire TV device or the Fire TV, Vega, or Android TV emulator).
- **Mini challenges:** AWS Builder (Bedrock for cues and re-planning, optionally Kiro for development). Open Source (release the pose-to-TV landmark bridge or the exercise rule set under MIT).
- **Friction log:** emulator camera passthrough, Fire OS or Vega camera access, Builder Tools MCP.

## Business context
- **Owner:** Axon Enjin. Track main: Aidan.
- **Hackathon:** Build, Ship, Shape: Amazon Developer Hackathon (see HACKATHON.md). Submission closes Oct 23, 2026, 12:00 PM PT (Oct 24, 3:00 AM PHT). Internal demo deadline: Oct 15, 2026.
- **Go-to-market after the hackathon:** US home-gym owners on Fire TV; freemium on the Amazon Appstore (free skeleton and rep counter, about $4.99/month for AI coaching and plans). SOM in the research is about $9M ARR; treat it as an estimate.
- **Constraints:** zero video leaves the device; no COPPA-risk features for kids; physical camera hardware is scarce in the Philippines, so development leans on the emulator and BYOC.
- **Source research:** [Fire-TV-Hackathon-Research.md](Fire-TV-Hackathon-Research.md), [PROMPT.md](PROMPT.md), [HACKATHON.md](HACKATHON.md), [ORG.md](ORG.md).

## Open questions
- Which camera path works first on the emulator: on-device MediaPipe or the BYOC phone bridge?
- End-to-end cue latency budget: target under 1.5 s from fault to spoken cue; precompute common cues if Bedrock is slower.
- Do we have access to a Fire TV Cube and a USB webcam for the final video, or is the emulator recording enough? (Rules accept the emulator.)
