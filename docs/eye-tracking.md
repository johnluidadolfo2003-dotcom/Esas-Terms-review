# Eye gaze control

The old tracker measured dark pixels in fixed image boxes, used only the center calibration point, and allowed the calibration effect to restart on parent camera updates. The new tracker uses MediaPipe Face Mesh iris landmarks in eye-local coordinates and fits a nonlinear screen mapping from nine fixation points. Old v1/v2 calibrations are deliberately ignored. Each camera activation requires a fresh check; saved data alone never enables selection.

## Using it

1. Open the app over HTTPS (localhost also works) and enable Eye Gaze. Allow camera access.
2. Face the camera in even front lighting, with both eyes visible. Keep the camera and your head in the same position.
3. Look at each dot with your eyes; the initial settling period is excluded from measurement. Finish the four separate accuracy checks across the screen. A pass shows the measured stabilized-cursor test error in pixels. Failed checks keep the nine dots for this camera session: use **Retry accuracy checks** to repeat only those checks, or **Restart all nine dots** after changing position.
4. Hold your gaze steadily on an enabled answer or Next for about 1.1 seconds. Look away before repeating an action. Normal blinks do not click.
5. If tracking pauses, read the status pill. Return to your calibration position or use Recalibrate after moving the camera or changing screen size.

The model assets are loaded on demand from pinned `@mediapipe/face_mesh@0.4.1633559619` on jsDelivr. Internet access is needed to load these assets. Camera frames are processed locally and are not uploaded by this tracking implementation. If assets or camera access fail, calibration shows an error and Retry; it never substitutes a guessed gaze point.

## Stability and accuracy

- Eye-local iris positions remove image translation, scale, and roll from the feature measurement. Larger head/pose changes pause control rather than selecting with stale calibration.
- Nine-point regularized quadratic calibration learns individual direction, sensitivity, cross-axis skew and position-dependent curvature. It rejects degenerate, noisy, or incomplete data. Four held-out interior fixations check the rendered cursor after the same confidence/filter stages used during tracking. Validation requires enough usable frames and elapsed time, so filtering cannot disguise a camera that never tracks reliably. Checks use pixel errors (24–40 px typical-offset limit depending on viewport, with tighter jitter limits), rather than accepting a good center alone. Passing is a check of those locations, not a guarantee of future precision.
- A short screen-space confidence window uses robust median dispersion and pauses broad jitter and large saccades. Brief detection loss preserves the cursor filter state instead of jumping to the first reacquired sample.
- A short median window rejects isolated outliers. A time-based adaptive low-pass filter and five-pixel output deadband reduce fixation jitter while allowing larger intentional movements.
- Missing/closed eyes, camera gaps, hidden pages, off-screen gaze and pose changes reset dwell. Only visible enabled controls under the gaze can acquire a target. Small boundary hysteresis retains a current control without overlapping acquisition boxes.
- A per-question target context prevents dwell carrying across cards. The action latch requires an actual gaze movement away, including after the selected control becomes disabled. No blink-to-click shortcut is enabled.
- The cursor uses one GPU transform without additional CSS position animation. Its ring does not grow/shrink on hover. The answer dwell indicator is positioned without changing answer layout.
- Calibration callbacks use stable refs so parent camera renders do not restart the procedure. Cancellation, late camera requests and inference cleanup are guarded.

## Validation and limits

Run `npm test`, `npm run lint`, and `npm run build`. Automated tests exercise fitted calibration, geometry invariance, noise/outliers, variable frame rates, drift/face loss, dwell latching, valid/invalid calibration, cancellation and late camera cleanup using synthetic landmarks and a mocked browser.

Physical accuracy varies with camera quality, glasses, lighting and head position. The tests do not measure actual webcam accuracy. A full browser test was attempted in the development environment but could not run because the browser download failed; real camera/browser testing remains required. MediaPipe supplies iris landmarks, not a ready-made precision eye tracker; the personalized gaze mapping is approximate.

## Calibration recovery

A point can collect for up to six seconds rather than failing immediately after a short fixed window. The latest uninterrupted fixation segment is used, so a blink can extend that dot without restarting the whole procedure.

If the four independent checks agree on a stable translation, the engine can subtract that offset once. It then collects an entirely new round of four checks. Inconsistent errors, excessive jitter, or a failed second round do not authorize eye selection. Pixel limits have not been widened to force a pass.

The pending nine-point model remains in memory only for the current camera/device/viewport. Retry reruns the checks without reopening the camera; cancel/stop clears the pending attempt. A full restart is available if the original fit or seating position changed. The saved calibration is replaced only after successful new checks.
