# Eye gaze control

The old tracker measured dark pixels in fixed image boxes, used only the center calibration point, and allowed the calibration effect to restart on parent camera updates. The new tracker uses MediaPipe Face Mesh iris landmarks in eye-local coordinates and fits a screen mapping from all five fixation points. Old v1 calibration is deliberately ignored.

## Using it

1. Open the app over HTTPS (localhost also works) and enable Eye Gaze. Allow camera access.
2. Face the camera in even front lighting, with both eyes visible. Keep the camera and your head in the same position.
3. Look at each dot with your eyes; the initial settling period is excluded from measurement. Finish the separate center accuracy check.
4. Hold your gaze steadily on an enabled answer or Next for about 1.1 seconds. Look away before repeating an action. Normal blinks do not click.
5. If tracking pauses, read the status pill. Return to your calibration position or use Recalibrate after moving the camera or changing screen size.

The model assets are loaded on demand from pinned `@mediapipe/face_mesh@0.4.1633559619` on jsDelivr. Internet access is needed to load these assets. Camera frames are processed locally and are not uploaded by this tracking implementation. If assets or camera access fail, calibration shows an error and Retry; it never substitutes a guessed gaze point.

## Stability and accuracy

- Eye-local iris positions remove image translation, scale, and roll from the feature measurement. Larger head/pose changes pause control rather than selecting with stale calibration.
- Five-point least-squares calibration learns individual direction, sensitivity, and cross-axis skew. It rejects degenerate, noisy, or incomplete data. A held-out center fixation checks repeatability before saving.
- A short median window rejects isolated outliers. A time-based adaptive low-pass filter and five-pixel output deadband reduce fixation jitter while allowing larger intentional movements.
- Missing/closed eyes, camera gaps, hidden pages, off-screen gaze and pose changes reset dwell. Only visible enabled controls under the gaze can acquire a target. Small boundary hysteresis retains a current control without overlapping acquisition boxes.
- A per-question target context prevents dwell carrying across cards. The action latch requires an actual gaze movement away, including after the selected control becomes disabled. No blink-to-click shortcut is enabled.
- The cursor uses one GPU transform without additional CSS position animation. Its ring does not grow/shrink on hover. The answer dwell indicator is positioned without changing answer layout.
- Calibration callbacks use stable refs so parent camera renders do not restart the procedure. Cancellation, late camera requests and inference cleanup are guarded.

## Validation and limits

Run `npm test`, `npm run lint`, and `npm run build`. Automated tests exercise fitted calibration, geometry invariance, noise/outliers, variable frame rates, drift/face loss, dwell latching, valid/invalid calibration, cancellation and late camera cleanup using synthetic landmarks and a mocked browser.

Physical accuracy varies with camera quality, glasses, lighting and head position. The tests do not measure actual webcam accuracy. A full browser test was attempted in the development environment but could not run because the browser download failed; real camera/browser testing remains required. MediaPipe supplies iris landmarks, not a ready-made precision eye tracker; the personalized gaze mapping is approximate.
