/**
 * Eye-Gaze Tracking & Dwell Selection Engine for TeeRMS Flashcard
 * Uses lightweight HTML5 Canvas computer-vision to track pupil movement & blinks
 * Persistent one-time calibration saved in localStorage
 */

export interface EyeCalibrationData {
  center: { px: number; py: number };
  topLeft: { px: number; py: number };
  topRight: { px: number; py: number };
  bottomLeft: { px: number; py: number };
  bottomRight: { px: number; py: number };
  calibratedAt: number;
}

export interface EyeTrackingState {
  isActive: boolean;
  isCalibrated: boolean;
  isTracking: boolean;
  faceDetected: boolean;
  gazeX: number; // Viewport screen X
  gazeY: number; // Viewport screen Y
  hoveredChoiceId: string | null; // 'A' | 'B' | 'C' | 'D' | 'NEXT' | null
  dwellProgress: number; // 0 to 1
  isBlinking: boolean;
  debugPupil?: { left: { x: number; y: number }; right: { x: number; y: number } };
}

export type EyeTrackingListener = (state: EyeTrackingState) => void;

const STORAGE_CALIBRATION_KEY = 'teerms_eye_calibration_v1';
const DWELL_TIME_MS = 1100; // 1.1s comfortable dwell to prevent misfires

class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;
  private xPrev: number | null = null;
  private dxPrev: number = 0;
  private tPrev: number | null = null;

  constructor(minCutoff: number = 0.7, beta: number = 0.006, dCutoff: number = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
  }

  private alpha(cutoff: number, dt: number): number {
    const tau = 1.0 / (2 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / dt);
  }

  public filter(x: number, t: number): number {
    if (this.tPrev === null || this.xPrev === null) {
      this.xPrev = x;
      this.tPrev = t;
      this.dxPrev = 0;
      return x;
    }

    const dt = Math.max(0.001, (t - this.tPrev) / 1000);
    this.tPrev = t;

    const dx = (x - this.xPrev) / dt;
    const aD = this.alpha(this.dCutoff, dt);
    const edx = aD * dx + (1 - aD) * this.dxPrev;
    this.dxPrev = edx;

    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    const a = this.alpha(cutoff, dt);

    const xHat = a * x + (1 - a) * this.xPrev;
    this.xPrev = xHat;
    return xHat;
  }

  public reset(): void {
    this.xPrev = null;
    this.tPrev = null;
    this.dxPrev = 0;
  }
}

class EyeTrackingEngine {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private stream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private listeners: Set<EyeTrackingListener> = new Set();
  private audioCtx: AudioContext | null = null;

  private calibration: EyeCalibrationData | null = null;
  private isCalibrating: boolean = false;
  private calibrationCallback: ((pointIndex: number, progress: number) => void) | null = null;

  // Adaptive One-Euro Filters for X and Y
  private filterX = new OneEuroFilter(0.6, 0.005);
  private filterY = new OneEuroFilter(0.6, 0.005);

  // Smoothing state
  private smoothX: number = window.innerWidth / 2;
  private smoothY: number = window.innerHeight / 2;
  private rawGazeX: number = window.innerWidth / 2;
  private rawGazeY: number = window.innerHeight / 2;

  // Dwell state
  private currentHoveredTarget: string | null = null;
  private dwellStartTime: number = 0;
  private dwellProgress: number = 0;
  private lastTriggeredTarget: string | null = null;
  private lastTriggerTime: number = 0;

  // Blink state
  private blinkStartTime: number = 0;
  private isBlinkActive: boolean = false;

  private onActionCallback: ((action: { type: 'choice' | 'next'; id?: string }) => void) | null = null;

  constructor() {
    this.loadSavedCalibration();
  }

  public loadSavedCalibration(): EyeCalibrationData | null {
    try {
      const raw = localStorage.getItem(STORAGE_CALIBRATION_KEY);
      if (raw) {
        this.calibration = JSON.parse(raw);
        return this.calibration;
      }
    } catch {
      this.calibration = null;
    }
    return null;
  }

  public saveCalibration(data: EyeCalibrationData): void {
    this.calibration = data;
    try {
      localStorage.setItem(STORAGE_CALIBRATION_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save eye calibration', e);
    }
  }

  public isCalibrated(): boolean {
    return Boolean(this.calibration && this.calibration.center);
  }

  public setActionCallback(cb: (action: { type: 'choice' | 'next'; id?: string }) => void): void {
    this.onActionCallback = cb;
  }

  public subscribe(listener: EyeTrackingListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(state: Partial<EyeTrackingState>): void {
    const fullState: EyeTrackingState = {
      isActive: Boolean(this.stream),
      isCalibrated: this.isCalibrated(),
      isTracking: Boolean(this.stream && !this.isCalibrating),
      faceDetected: true,
      gazeX: this.smoothX,
      gazeY: this.smoothY,
      hoveredChoiceId: this.currentHoveredTarget,
      dwellProgress: this.dwellProgress,
      isBlinking: this.isBlinkActive,
      ...state,
    };
    this.listeners.forEach((l) => l(fullState));
  }

  /**
   * Initialize audio feedback
   */
  private playClickSound(freq: number = 650, duration: number = 0.06): void {
    try {
      if (!this.audioCtx) {
        const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  private playSuccessSound(): void {
    this.playClickSound(880, 0.08);
    setTimeout(() => this.playClickSound(1174, 0.12), 60);
  }

  /**
   * Start webcam video stream
   */
  public async start(): Promise<boolean> {
    if (this.stream) return true;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      this.video = document.createElement('video');
      this.video.playsInline = true;
      this.video.muted = true;
      this.video.srcObject = this.stream;
      await this.video.play();

      this.canvas = document.createElement('canvas');
      this.canvas.width = 160;
      this.canvas.height = 120;
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

      this.filterX.reset();
      this.filterY.reset();

      this.startLoop();
      this.notify({ isActive: true });
      return true;
    } catch (err) {
      console.warn('Eye tracking webcam access error:', err);
      this.notify({ isActive: false });
      return false;
    }
  }

  public stop(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    this.currentHoveredTarget = null;
    this.dwellProgress = 0;
    this.notify({ isActive: false, isTracking: false, dwellProgress: 0, hoveredChoiceId: null });
  }

  /**
   * Main computer vision processing loop
   */
  private startLoop(): void {
    const processFrame = () => {
      if (!this.stream || !this.video || !this.ctx || !this.canvas) return;

      if (this.video.readyState >= 2) {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.analyzeFrame(imgData);
      }

      this.animFrameId = requestAnimationFrame(processFrame);
    };

    this.animFrameId = requestAnimationFrame(processFrame);
  }

  /**
   * Lightweight pupil & eye feature extraction
   */
  private analyzeFrame(imgData: ImageData): void {
    const { width, height, data } = imgData;

    const eyeTop = Math.floor(height * 0.28);
    const eyeBottom = Math.floor(height * 0.54);

    const leftBox = { xMin: Math.floor(width * 0.22), xMax: Math.floor(width * 0.46) };
    const rightBox = { xMin: Math.floor(width * 0.54), xMax: Math.floor(width * 0.78) };

    const leftPupil = this.findDarkestCluster(data, width, leftBox.xMin, leftBox.xMax, eyeTop, eyeBottom);
    const rightPupil = this.findDarkestCluster(data, width, rightBox.xMin, rightBox.xMax, eyeTop, eyeBottom);

    if (!leftPupil || !rightPupil) {
      return;
    }

    const normX = ((leftPupil.normX + rightPupil.normX) / 2);
    const normY = ((leftPupil.normY + rightPupil.normY) / 2);

    const eyeOpenness = (leftPupil.contrast + rightPupil.contrast) / 2;
    const isBlinkingNow = eyeOpenness < 22;

    const now = performance.now();
    if (isBlinkingNow && !this.isBlinkActive) {
      this.isBlinkActive = true;
      this.blinkStartTime = now;
    } else if (!isBlinkingNow && this.isBlinkActive) {
      const blinkDuration = now - this.blinkStartTime;
      this.isBlinkActive = false;
      if (blinkDuration >= 280 && blinkDuration <= 750 && this.currentHoveredTarget) {
        this.triggerTarget(this.currentHoveredTarget);
      }
    }

    if (this.isCalibrating) {
      return;
    }

    this.mapPupilToScreen(normX, normY, now);

    this.updateDwellState(now);

    this.notify({
      gazeX: this.smoothX,
      gazeY: this.smoothY,
      hoveredChoiceId: this.currentHoveredTarget,
      dwellProgress: this.dwellProgress,
      isBlinking: this.isBlinkActive,
      debugPupil: { left: leftPupil, right: rightPupil },
    });
  }

  /**
   * Finds the dark pupil centroid inside an eye bounding box
   */
  private findDarkestCluster(
    data: Uint8ClampedArray,
    width: number,
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
  ): { x: number; y: number; normX: number; normY: number; contrast: number } | null {
    let minLuma = 255;
    let maxLuma = 0;
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (let y = yMin; y < yMax; y++) {
      for (let x = xMin; x < xMax; x++) {
        const idx = (y * width + x) * 4;
        const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (luma < minLuma) minLuma = luma;
        if (luma > maxLuma) maxLuma = luma;
      }
    }

    const contrast = maxLuma - minLuma;
    const threshold = minLuma + contrast * 0.25;

    for (let y = yMin; y < yMax; y++) {
      for (let x = xMin; x < xMax; x++) {
        const idx = (y * width + x) * 4;
        const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (luma <= threshold) {
          sumX += x;
          sumY += y;
          count++;
        }
      }
    }

    if (count < 6) return null;

    const avgX = sumX / count;
    const avgY = sumY / count;

    return {
      x: avgX,
      y: avgY,
      normX: (avgX - xMin) / (xMax - xMin),
      normY: (avgY - yMin) / (yMax - yMin),
      contrast,
    };
  }

  /**
   * Convert normalized pupil offset to screen pixel position with One-Euro Filter & Magnetic Snapping
   */
  private mapPupilToScreen(normX: number, normY: number, now: number): void {
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const center = this.calibration?.center || { px: 0.5, py: 0.5 };
    const dx = (normX - center.px);
    const dy = (normY - center.py);

    const sensitivityX = 4.2;
    const sensitivityY = 4.0;

    const targetX = winW * 0.5 - dx * winW * sensitivityX;
    const targetY = winH * 0.5 + dy * winH * sensitivityY;

    this.rawGazeX = Math.max(30, Math.min(winW - 30, targetX));
    this.rawGazeY = Math.max(30, Math.min(winH - 30, targetY));

    // Apply One-Euro Adaptive Filter (smooths static jitter, zero lag on fast eye moves)
    let fx = this.filterX.filter(this.rawGazeX, now);
    let fy = this.filterY.filter(this.rawGazeY, now);

    // Magnetic target snap toward nearby choice buttons
    const nearbyTarget = this.findNearbyTargetCenter(fx, fy, 55);
    if (nearbyTarget) {
      fx = fx + 0.38 * (nearbyTarget.x - fx);
      fy = fy + 0.38 * (nearbyTarget.y - fy);
    }

    this.smoothX = fx;
    this.smoothY = fy;
  }

  private findNearbyTargetCenter(gx: number, gy: number, radius: number): { x: number; y: number } | null {
    const targets = document.querySelectorAll<HTMLElement>('[data-choice-id], [data-action="next-card"]');
    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(gx - cx, gy - cy);
      if (dist <= radius) {
        return { x: cx, y: cy };
      }
    }
    return null;
  }

  /**
   * Check if current gaze coordinates hover over any answer choices or action buttons
   */
  private updateDwellState(now: number): void {
    // Prevent immediate re-trigger within 1.5 seconds
    if (now - this.lastTriggerTime < 1400) {
      this.dwellProgress = 0;
      return;
    }

    const hoveredElement = this.findHoveredActionTarget(this.smoothX, this.smoothY);

    if (hoveredElement) {
      if (this.currentHoveredTarget === hoveredElement) {
        // Continue dwelling
        const elapsed = now - this.dwellStartTime;
        this.dwellProgress = Math.min(1, elapsed / DWELL_TIME_MS);

        if (this.dwellProgress >= 1) {
          this.triggerTarget(hoveredElement);
        }
      } else {
        // Started hovering on a new element
        this.currentHoveredTarget = hoveredElement;
        this.dwellStartTime = now;
        this.dwellProgress = 0.05;
        this.playClickSound(480, 0.03); // gentle hover tick
      }
    } else {
      // Looked away
      this.currentHoveredTarget = null;
      this.dwellProgress = 0;
    }
  }

  /**
   * Find button choice or action under gaze point
   */
  private findHoveredActionTarget(gx: number, gy: number): string | null {
    // Check choices A, B, C, D
    const choiceButtons = document.querySelectorAll<HTMLElement>('[data-choice-id]');
    for (const btn of choiceButtons) {
      const rect = btn.getBoundingClientRect();
      // Generous hit-box for eye gaze (+18px margin)
      const margin = 18;
      if (
        gx >= rect.left - margin &&
        gx <= rect.right + margin &&
        gy >= rect.top - margin &&
        gy <= rect.bottom + margin
      ) {
        return btn.getAttribute('data-choice-id') || null;
      }
    }

    // Check Next Card button
    const nextButtons = document.querySelectorAll<HTMLElement>('[data-action="next-card"]');
    for (const btn of nextButtons) {
      const rect = btn.getBoundingClientRect();
      const margin = 20;
      if (
        gx >= rect.left - margin &&
        gx <= rect.right + margin &&
        gy >= rect.top - margin &&
        gy <= rect.bottom + margin
      ) {
        return 'NEXT';
      }
    }

    return null;
  }

  private triggerTarget(target: string): void {
    this.lastTriggeredTarget = target;
    this.lastTriggerTime = performance.now();
    this.dwellProgress = 0;
    this.currentHoveredTarget = null;
    this.playSuccessSound();

    if (target === 'NEXT') {
      this.onActionCallback?.({ type: 'next' });
    } else {
      this.onActionCallback?.({ type: 'choice', id: target });
    }
  }

  /**
   * Runs the 5-point calibration procedure
   */
  public async calibrate(
    onPointProgress: (pointIndex: number, progress: number) => void
  ): Promise<boolean> {
    const started = await this.start();
    if (!started) return false;

    this.isCalibrating = true;
    this.calibrationCallback = onPointProgress;

    // Collect 5 calibration samples:
    // 0: Center, 1: Top-Left (A), 2: Top-Right (B), 3: Bottom-Left (C), 4: Bottom-Right (D)
    const samples: { px: number; py: number }[] = [];

    for (let pointIdx = 0; pointIdx < 5; pointIdx++) {
      const collected: { px: number; py: number }[] = [];
      const startTime = performance.now();
      const pointDuration = 1200; // 1.2s per point

      while (performance.now() - startTime < pointDuration) {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / pointDuration);
        onPointProgress(pointIdx, progress);

        if (this.ctx && this.video && this.canvas && this.video.readyState >= 2) {
          this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
          const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          const eyeTop = Math.floor(imgData.height * 0.28);
          const eyeBottom = Math.floor(imgData.height * 0.54);
          const leftBox = { xMin: Math.floor(imgData.width * 0.22), xMax: Math.floor(imgData.width * 0.46) };
          const rightBox = { xMin: Math.floor(imgData.width * 0.54), xMax: Math.floor(imgData.width * 0.78) };

          const leftPupil = this.findDarkestCluster(imgData.data, imgData.width, leftBox.xMin, leftBox.xMax, eyeTop, eyeBottom);
          const rightPupil = this.findDarkestCluster(imgData.data, imgData.width, rightBox.xMin, rightBox.xMax, eyeTop, eyeBottom);

          if (leftPupil && rightPupil) {
            collected.push({
              px: (leftPupil.normX + rightPupil.normX) / 2,
              py: (leftPupil.normY + rightPupil.normY) / 2,
            });
          }
        }
        await new Promise((r) => setTimeout(r, 40));
      }

      this.playClickSound(750, 0.08);

      // Average for this point
      if (collected.length > 0) {
        const avgX = collected.reduce((acc, c) => acc + c.px, 0) / collected.length;
        const avgY = collected.reduce((acc, c) => acc + c.py, 0) / collected.length;
        samples.push({ px: avgX, py: avgY });
      } else {
        samples.push({ px: 0.5, py: 0.5 });
      }
    }

    this.isCalibrating = false;
    this.playSuccessSound();

    const calData: EyeCalibrationData = {
      center: samples[0] || { px: 0.5, py: 0.5 },
      topLeft: samples[1] || { px: 0.45, py: 0.45 },
      topRight: samples[2] || { px: 0.55, py: 0.45 },
      bottomLeft: samples[3] || { px: 0.45, py: 0.55 },
      bottomRight: samples[4] || { px: 0.55, py: 0.55 },
      calibratedAt: Date.now(),
    };

    this.saveCalibration(calData);
    this.notify({ isCalibrated: true, isTracking: true });
    return true;
  }
}

export const eyeTrackingEngine = new EyeTrackingEngine();
