# Eye control: implementation and verification

## Actual tracker and original faults

The app uses browser `getUserMedia` with a user-facing camera (requested 640×480, up to 30 fps) and the pinned MediaPipe Face Mesh JavaScript solution `@mediapipe/face_mesh@0.4.1633559619`, loaded from jsDelivr. Face Mesh provides refined iris/face landmarks, **not calibrated screen gaze** and not a per-frame gaze-confidence score. It has no screen-calibration API; this app supplies its own mapper.

| Stage | Current implementation |
|---|---|
| Features | Both iris centers projected into each eye's corner-to-corner local axes. Native image translation, scale and roll are normalized. Eye openness, binocular agreement, finite values and minimum geometry sizes are checked. Head position/yaw/pitch/roll/scale are monitored separately; head direction is not used as gaze. |
| Labels | Nine explicit screen targets at the 10%, 50%, 90% grid. Accepted eye features retain target ID, target CSS position, frame identity, media time and capture timestamp. |
| Model | Normalized ridge regression; equal total weight per target. Affine and quadratic candidates use a temporal frame holdout with balanced target contribution. Quadratic is kept only for the configured absolute and relative p90 improvement without worse median error. |
| Output | Viewport CSS pixels throughout. Native video pixels are used only to extract normalized features. |
| Filtering | One timestamp-aware One Euro filter plus quarantine of an isolated extreme spike. A second consistent observation accepts a large deliberate movement. No stacked moving-median/confidence/deadband smoothing chain. |
| Selection | Visible enabled DOM rectangles, non-overlapping acquisition, modest retention hysteresis, target-size-based stability, 900 ms valid elapsed dwell, and one activation per fixation. |

The inspected prior code also had a **force-finish path that fabricated zero-error validation**, an interim guessed mapping, and a forced-success UI. Those paths are removed. Earlier validation-driven offset learning is also removed: fresh validation is strictly evaluation, never fitting. The existing reviewer, quiz, import/export, voice and hand-control functions remain. Camera-based hand control and eye control are mutually exclusive to avoid competing streams.

## Coordinate contract

`projectGaze`, target labels, cursor output and `getBoundingClientRect()` use **layout-viewport CSS pixels**. Gaze is not multiplied by `devicePixelRatio`, and scroll offsets are not added to client rectangles. Button rectangles are read afresh; scrolling resets dwell.

Inference receives the complete unmirrored native video. The live preview shares the same stream and uses `object-fit: contain` plus a single cosmetic CSS horizontal mirror. Cropping/mirroring of that preview never modifies the features or gaze. The tested `previewPoint` helper documents contain-letterboxing and the single preview reflection.

Saved metadata contains layout/visual viewport sizes, visual viewport offsets/scale, DPR, orientation, camera ID and native video dimensions. Resize, zoom, orientation, camera/native geometry changes invalidate selection. Pinch zoom must be reset before calibration. Restoring the complete v4 model never enables selection by itself: compatible geometry still needs a fresh short check. Older/partial/unknown-camera models are ignored.

## Setup and calibration

The setup screen shows the actual shared camera preview before collecting labels. It checks video readiness, recent usable eye samples, observed rate and frame freshness. It gives permission-denied, missing/busy camera, model-download/inference, missing-eye and insufficient-sample feedback. Startup failures offer a Retry camera action after permissions or connectivity are corrected. Detection/tracking thresholds are library options; readiness and sample-validity percentages are observed quality checks, not invented confidence values.

Keep the device steady, sit comfortably, use even front lighting, keep both eyes visible, avoid backlighting/glasses reflections, and maintain approximately the same position. Touch/keyboard buttons start calibration. Optional per-dot confirmation accepts a tap, Enter or Space and works with a helper; it never depends on an accurate predicted gaze click.

Each dot has a configurable settling period, then collection of **valid camera time and distinct samples**. Progress combines accepted sample count and accepted valid duration. Missing/blinking/non-finite/stale/failed frames do not accrue valid time. Native `requestVideoFrameCallback` media times are preferred; the fallback checks changed video time. Capture timestamps are recorded before inference, late callbacks are rejected, and repeated result callbacks cannot duplicate a frame. Failed dots are retried while good session samples remain.

Regularization does not hide absent feature variation: collapsed/collinear features and numerical failures stop fitting. The temporal model-comparison holdout is separate from fitting, but is still from the training fixations; it is not claimed as independent screen accuracy. No ordinary mouse movement or predicted gaze choice trains the mapper.

## Independent measurement and usability

After model choice, fresh validation checks the center, intermediate locations and **actual enabled choice/Next regions**. The model is frozen. No validation sample corrects coefficients or becomes a training label.

Each region reports raw and filtered median/p90 Euclidean error, X/Y bias, fixation p90 dispersion, valid-sample fraction and effective valid sampling rate. Measurements precede target detection; there is no target snapping. Tolerances derive from actual region dimensions and neighboring rectangle separation. The UI reports failed locations and offers a real larger/spaced answer panel, which must itself be measured. It does not convert sample validity into an accuracy percentage.

A short check is available only after a full independently validated model. It checks the center and two current regions and retains explicitly identified full-check region data. Changed layouts require full region checks; unmeasured/incompatible controls cannot activate. New geometry requires full calibration. Substantial user-position changes stop selection until rechecked.

The guided real-camera test copies the measured selectable footprints, requests targets, suppresses reviewer answers, and records correct/incorrect/missed outcomes and elapsed time. Choose a user-reported condition (normal lighting, glasses, normal head movement). Its results are not automatically inferred from the condition name. Test center/edges in validation, adjacent choices in the guided test, and repeat with glasses/head motion. No real-camera result is prefilled.

## Settings

Defaults are starting values in `src/services/eyeTrackingConfig.ts`; the setup screen exposes common timing/filter controls. Units are ms, Hz and CSS pixels. Beta scales the filtered CSS-pixel/second derivative into added cutoff Hz.

| Setting | Default |
|---|---:|
| Settle before collecting | 700 ms |
| Required valid collection | 1,200 ms |
| Per-dot collection timeout | 7,000 ms |
| Minimum distinct samples | 12 |
| Maximum frame age | 250 ms |
| Maximum dwell/sample gap | 180 ms |
| Prolonged-loss filter reset | 600 ms |
| Dwell | 900 ms |
| Release/look-away | 180 ms |
| Boundary hysteresis | 6 CSS px, further bounded by target size |
| One Euro min cutoff / derivative cutoff | 1.1 / 1 Hz |
| One Euro beta | 0.006 |
| Ridge | 0.001 |
| Complex-model minimum improvement | 10% and 5 CSS px p90 |
| Minimum observed valid fraction / rate | 0.65 / 6 Hz |
| Guided target timeout | 8,000 ms |

Opt-in local recording stores eye features, frame/rejection timestamps, explicit calibration labels and metrics, not video. Export is a user-triggered JSON download. Filter replay compares labeled **training traces only**, measures fixation dispersion and time to enter a goal (including human reaction), and never changes the mapping. Applying a candidate setting invalidates selection and requires fresh independent validation. These defaults have not been claimed as tuned to this user's camera; replay allows tuning on their actual recorded observations.

## Checks and honest results

- `npm run lint`
- `npm test`: regression tests for model selection/balancing, degeneracy, independent immutable validation, units/preview/DPR/geometry, distinct frames, valid-time dwell, switching/loss/staleness/release/context, large saccades, long gaps, recording/replay, persisted-model checks, lifecycle and guided outcomes with **synthetic observations**.
- `npm run build`
- `npx playwright install chromium --only-shell`, then `npm run test:browser`: a full browser flow with fake camera input and synthetic iris landmarks. It checks preview/setup, keyboard confirmation, 9-point calibration, region results, model-instance count, guided selections without changing reviewer answers, Pause/Resume, face loss, resizing and permission-denied recovery. Synthetic success is not physical accuracy.

The app provides a guided measurement flow, but the user's physical camera, lighting, glasses, head movement and selection accuracy remain unmeasured until they run it. Automated tests do not establish webcam precision. Existing JSZip/large-client-bundle build warnings are separate from gaze functionality.

## Primary references

- [MediaPipe Iris](https://chuoling.github.io/mediapipe/solutions/iris.html): iris landmarks do not infer where a person is looking.
- [MediaPipe Face Mesh](https://chuoling.github.io/mediapipe/solutions/face_mesh.html): documented JavaScript APIs and refined iris landmarks.
- [One Euro Filter authors' implementation](https://github.com/casiez/OneEuroFilter): speed-adaptive cutoff for jitter/lag tradeoffs.
