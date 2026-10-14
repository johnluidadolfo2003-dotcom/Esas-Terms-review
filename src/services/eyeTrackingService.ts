/**
 * High-Accuracy 4-Quadrant Directional Gaze & Head-Eye Gesture Engine
 * Uses directional sector mapping (Up-Left = A, Up-Right = B, Down-Left = C, Down-Right = D, Far Right = Next)
 * with central dead-zone & instant auto-zeroing for rock-solid precision.
 */

export interface EyeTrackingState {
  isActive: boolean;
  isTracking: boolean;
  faceDetected: boolean;
  activeSector: 'A' | 'B' | 'C' | 'D' | 'NEXT' | 'CENTER' | null;
  dwellProgress: number; // 0 to 1
  isBlinking: boolean;
  gazeX: number;
  gazeY: number;
}

export type EyeTrackingListener = (state: EyeTrackingState) => void;

const DWELL_TIME_MS = 1000; // 1 second intentional dwell
const STORAGE_BASELINE_KEY = 'teerms_eye_baseline_v2';

class EyeTrackingEngine {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private stream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private listeners: Set<EyeTrackingListener> = new Set();
  private audioCtx: AudioContext | null = null;

  // Center baseline pupil coordinates
  private baseNormX: number = 0.5;
  private baseNormY: number = 0.5;
  private isAutoZeroing: boolean = false;

  // Filtered directional deltas
  private filtDx: number = 0;
  private filtDy: number = 0;

  // Dwell state
  private currentSector: 'A' | 'B' | 'C' | 'D' | 'NEXT' | 'CENTER' | null = null;
  private dwellStartTime: number = 0;
  private dwellProgress: number = 0;
  private lastTriggerTime: number = 0;

  // Blink detection state
  private blinkStartTime: number = 0;
  private isBlinkActive: boolean = false;

  private onActionCallback: ((action: { type: 'choice' | 'next'; id?: string }) => void) | null = null;

  constructor() {
    this.loadBaseline();
  }

  public loadBaseline(): void {
    try {
      const raw = localStorage.getItem(STORAGE_BASELINE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.baseNormX = parsed.x ?? 0.5;
        this.baseNormY = parsed.y ?? 0.5;
      }
    } catch {
      this.baseNormX = 0.5;
      this.baseNormY = 0.5;
    }
  }

  public saveBaseline(x: number, y: number): void {
    this.baseNormX = x;
    this.baseNormY = y;
    try {
      localStorage.setItem(STORAGE_BASELINE_KEY, JSON.stringify({ x, y, time: Date.now() }));
    } catch {
      // localStorage fallback
    }
  }

  public isCalibrated(): boolean {
    return true; // Auto-zeros instantly on activation
  }

  public setActionCallback(cb: (action: { type: 'choice' | 'next'; id?: string }) => void): void {
    this.onActionCallback = cb;
  }

  public subscribe(listener: EyeTrackingListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(state: Partial<EyeTrackingState>): void {
    const screenPos = this.getScreenCoordsForSector(this.currentSector);
    const fullState: EyeTrackingState = {
      isActive: Boolean(this.stream),
      isTracking: Boolean(this.stream),
      faceDetected: true,
      activeSector: this.currentSector,
      dwellProgress: this.dwellProgress,
      isBlinking: this.isBlinkActive,
      gazeX: screenPos.x,
      gazeY: screenPos.y,
      ...state,
    };
    this.listeners.forEach((l) => l(fullState));
  }

  private playClickSound(freq: number = 600, duration: number = 0.05): void {
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
      // Audio fallback
    }
  }

  private playSuccessSound(): void {
    this.playClickSound(880, 0.08);
    setTimeout(() => this.playClickSound(1174, 0.12), 60);
  }

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

      // Re-zero baseline naturally on start
      this.autoZeroBaseline(800);

      this.startLoop();
      this.notify({ isActive: true });
      return true;
    } catch (err) {
      console.warn('Eye tracking webcam start failed:', err);
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
    this.currentSector = null;
    this.dwellProgress = 0;
    this.notify({ isActive: false, isTracking: false, activeSector: null, dwellProgress: 0 });
  }

  /**
   * Instantly re-zeros the baseline while the user looks at the center of the screen
   */
  public autoZeroBaseline(durationMs: number = 600): void {
    this.isAutoZeroing = true;
    const samples: { x: number; y: number }[] = [];
    const startTime = performance.now();

    const sampleLoop = () => {
      if (!this.stream || !this.video || !this.ctx || !this.canvas) {
        this.isAutoZeroing = false;
        return;
      }

      if (this.video.readyState >= 2) {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pupil = this.extractPupils(imgData);
        if (pupil) {
          samples.push(pupil);
        }
      }

      if (performance.now() - startTime < durationMs) {
        requestAnimationFrame(sampleLoop);
      } else {
        if (samples.length > 0) {
          const avgX = samples.reduce((s, p) => s + p.x, 0) / samples.length;
          const avgY = samples.reduce((s, p) => s + p.y, 0) / samples.length;
          this.saveBaseline(avgX, avgY);
        }
        this.isAutoZeroing = false;
        this.playClickSound(800, 0.08);
      }
    };

    requestAnimationFrame(sampleLoop);
  }

  private startLoop(): void {
    const processFrame = () => {
      if (!this.stream || !this.video || !this.ctx || !this.canvas) return;

      if (this.video.readyState >= 2 && !this.isAutoZeroing) {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.analyzeFrame(imgData);
      }

      this.animFrameId = requestAnimationFrame(processFrame);
    };

    this.animFrameId = requestAnimationFrame(processFrame);
  }

  private analyzeFrame(imgData: ImageData): void {
    const pupil = this.extractPupils(imgData);
    if (!pupil) return;

    // Calculate relative horizontal and vertical displacement from baseline
    // Note: webcam video is mirrored, so looking right shifts pupil left in frame
    const rawDx = -(pupil.x - this.baseNormX);
    const rawDy = pupil.y - this.baseNormY;

    // Apply strong exponential smoothing to eliminate jitter
    const alpha = 0.20;
    this.filtDx = this.filtDx + alpha * (rawDx - this.filtDx);
    this.filtDy = this.filtDy + alpha * (rawDy - this.filtDy);

    // Blink / Wink detection
    const isBlinkingNow = pupil.contrast < 20;
    const now = performance.now();

    if (isBlinkingNow && !this.isBlinkActive) {
      this.isBlinkActive = true;
      this.blinkStartTime = now;
    } else if (!isBlinkingNow && this.isBlinkActive) {
      const duration = now - this.blinkStartTime;
      this.isBlinkActive = false;
      // Intentionally held blink (300ms - 750ms) triggers current non-center sector immediately
      if (duration >= 280 && duration <= 750 && this.currentSector && this.currentSector !== 'CENTER') {
        this.triggerSector(this.currentSector);
      }
    }

    // Determine current directional sector based on horizontal/vertical thresholds
    const detectedSector = this.classifySector(this.filtDx, this.filtDy);

    // Update dwell timer state
    this.updateDwell(detectedSector, now);

    this.notify({
      activeSector: this.currentSector,
      dwellProgress: this.dwellProgress,
      isBlinking: this.isBlinkActive,
    });
  }

  /**
   * Classifies pupil displacement into clear 4-Quadrants or Far-Right Next
   */
  private classifySector(dx: number, dy: number): 'A' | 'B' | 'C' | 'D' | 'NEXT' | 'CENTER' {
    const deadZoneX = 0.035; // Dead-zone where looking at center question stem does nothing
    const deadZoneY = 0.035;

    const farRightThreshold = 0.12; // Far right glance triggers Next

    // If within central deadzone
    if (Math.abs(dx) < deadZoneX && Math.abs(dy) < deadZoneY) {
      return 'CENTER';
    }

    // Glance Far Right -> Next
    if (dx > farRightThreshold) {
      return 'NEXT';
    }

    // 4-Quadrant Sector Mapping:
    // dx < 0 = Looking Left, dx > 0 = Looking Right
    // dy < 0 = Looking Up, dy > 0 = Looking Down
    if (dx <= 0 && dy <= 0) return 'A'; // Top-Left -> Choice A
    if (dx > 0 && dy <= 0) return 'B';  // Top-Right -> Choice B
    if (dx <= 0 && dy > 0) return 'C';  // Bottom-Left -> Choice C
    if (dx > 0 && dy > 0) return 'D';   // Bottom-Right -> Choice D

    return 'CENTER';
  }

  private updateDwell(sector: 'A' | 'B' | 'C' | 'D' | 'NEXT' | 'CENTER', now: number): void {
    // Prevent double triggers within 1.2s
    if (now - this.lastTriggerTime < 1200) {
      this.dwellProgress = 0;
      return;
    }

    if (sector === 'CENTER') {
      this.currentSector = 'CENTER';
      this.dwellProgress = 0;
      return;
    }

    if (this.currentSector === sector) {
      const elapsed = now - this.dwellStartTime;
      this.dwellProgress = Math.min(1, elapsed / DWELL_TIME_MS);

      if (this.dwellProgress >= 1) {
        this.triggerSector(sector);
      }
    } else {
      this.currentSector = sector;
      this.dwellStartTime = now;
      this.dwellProgress = 0.08;
      this.playClickSound(520, 0.04);
    }
  }

  private triggerSector(sector: 'A' | 'B' | 'C' | 'D' | 'NEXT' | 'CENTER'): void {
    if (sector === 'CENTER') return;

    this.lastTriggerTime = performance.now();
    this.dwellProgress = 0;
    this.playSuccessSound();

    if (sector === 'NEXT') {
      this.onActionCallback?.({ type: 'next' });
    } else {
      this.onActionCallback?.({ type: 'choice', id: sector });
    }
  }

  private extractPupils(imgData: ImageData): { x: number; y: number; contrast: number } | null {
    const { width, height, data } = imgData;

    const eyeTop = Math.floor(height * 0.28);
    const eyeBottom = Math.floor(height * 0.54);
    const xMin = Math.floor(width * 0.22);
    const xMax = Math.floor(width * 0.78);

    let minLuma = 255;
    let maxLuma = 0;
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (let y = eyeTop; y < eyeBottom; y++) {
      for (let x = xMin; x < xMax; x++) {
        const idx = (y * width + x) * 4;
        const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (luma < minLuma) minLuma = luma;
        if (luma > maxLuma) maxLuma = luma;
      }
    }

    const contrast = maxLuma - minLuma;
    const threshold = minLuma + contrast * 0.24;

    for (let y = eyeTop; y < eyeBottom; y++) {
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

    if (count < 8) return null;

    return {
      x: sumX / count / width,
      y: sumY / count / height,
      contrast,
    };
  }

  private getScreenCoordsForSector(sector: 'A' | 'B' | 'C' | 'D' | 'NEXT' | 'CENTER' | null): { x: number; y: number } {
    const w = window.innerWidth;
    const h = window.innerHeight;

    switch (sector) {
      case 'A':
        return { x: w * 0.28, y: h * 0.38 };
      case 'B':
        return { x: w * 0.72, y: h * 0.38 };
      case 'C':
        return { x: w * 0.28, y: h * 0.68 };
      case 'D':
        return { x: w * 0.72, y: h * 0.68 };
      case 'NEXT':
        return { x: w * 0.88, y: h * 0.85 };
      default:
        return { x: w * 0.5, y: h * 0.5 };
    }
  }
}

export const eyeTrackingEngine = new EyeTrackingEngine();
