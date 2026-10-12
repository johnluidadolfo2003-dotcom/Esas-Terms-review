// Service for calibrating, scanning, saving, and matching custom hand gestures

export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
  count: number;
}

export interface CalibratedGestureData {
  choiceId: 'A' | 'B' | 'C' | 'D' | 'NEXT';
  label: string;
  fingerCount: number;
  fingers: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  };
  relativeDistances: number[]; // Normalized distance of tips 4, 8, 12, 16, 20 from wrist (0)
  calibratedAt: number;
}

export interface GestureCalibrationProfile {
  version: number;
  updatedAt: number;
  gestures: Record<string, CalibratedGestureData>;
}

const STORAGE_KEY = 'pnle_custom_gesture_profile_v1';

// Default standard profile (1 finger = A, 2 = B, 3 = C, 4 = D, 5 = NEXT)
export const DEFAULT_GESTURES: Record<string, CalibratedGestureData> = {
  A: {
    choiceId: 'A',
    label: 'Option A (1 Finger)',
    fingerCount: 1,
    fingers: { thumb: false, index: true, middle: false, ring: false, pinky: false },
    relativeDistances: [0.9, 1.8, 0.9, 0.9, 0.8],
    calibratedAt: 0,
  },
  B: {
    choiceId: 'B',
    label: 'Option B (2 Fingers)',
    fingerCount: 2,
    fingers: { thumb: false, index: true, middle: true, ring: false, pinky: false },
    relativeDistances: [0.9, 1.8, 1.9, 0.9, 0.8],
    calibratedAt: 0,
  },
  C: {
    choiceId: 'C',
    label: 'Option C (3 Fingers)',
    fingerCount: 3,
    fingers: { thumb: false, index: true, middle: true, ring: true, pinky: false },
    relativeDistances: [0.9, 1.8, 1.9, 1.8, 0.8],
    calibratedAt: 0,
  },
  D: {
    choiceId: 'D',
    label: 'Option D (4 Fingers)',
    fingerCount: 4,
    fingers: { thumb: false, index: true, middle: true, ring: true, pinky: true },
    relativeDistances: [0.9, 1.8, 1.9, 1.8, 1.7],
    calibratedAt: 0,
  },
  NEXT: {
    choiceId: 'NEXT',
    label: 'Next Question (Open Palm)',
    fingerCount: 5,
    fingers: { thumb: true, index: true, middle: true, ring: true, pinky: true },
    relativeDistances: [1.6, 1.8, 1.9, 1.8, 1.7],
    calibratedAt: 0,
  },
};

export function loadGestureProfile(): GestureCalibrationProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.gestures) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load gesture profile from localStorage', err);
  }

  return {
    version: 1,
    updatedAt: 0,
    gestures: { ...DEFAULT_GESTURES },
  };
}

export function saveGestureProfile(profile: GestureCalibrationProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save gesture profile to localStorage', err);
  }
}

export function hasCustomCalibration(): boolean {
  const profile = loadGestureProfile();
  return profile.updatedAt > 0;
}

export function resetGestureProfile(): GestureCalibrationProfile {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return {
    version: 1,
    updatedAt: 0,
    gestures: { ...DEFAULT_GESTURES },
  };
}

// Compute Euclidean distance
function dist(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Extract finger states and normalized distance metrics from 21 MediaPipe landmarks
export function extractFingerMetrics(landmarks: Array<{ x: number; y: number; z?: number }>): {
  fingerState: FingerState;
  relativeDistances: number[];
} {
  if (!landmarks || landmarks.length < 21) {
    return {
      fingerState: { thumb: false, index: false, middle: false, ring: false, pinky: false, count: 0 },
      relativeDistances: [0, 0, 0, 0, 0],
    };
  }

  const wrist = landmarks[0];
  const mcpMiddle = landmarks[9];
  const palmScale = Math.max(0.001, dist(wrist, mcpMiddle));

  // Robust finger extension test:
  // A finger is extended if tip is higher than PIP (for vertical hand) AND tip is further from wrist than PIP joint
  // OR if the distance from tip to its own MCP knuckle indicates an outstretched finger
  const checkExtension = (tipIdx: number, pipIdx: number, mcpIdx: number): boolean => {
    const tip = landmarks[tipIdx];
    const pip = landmarks[pipIdx];
    const mcp = landmarks[mcpIdx];
    if (!tip || !pip || !mcp) return false;

    const dTipWrist = dist(tip, wrist);
    const dPipWrist = dist(pip, wrist);
    const dTipMcp = dist(tip, mcp);

    // Tip is visibly above PIP knuckle (camera Y increases downwards)
    const isHigherThanPip = tip.y < pip.y;
    // Tip is farther from wrist than PIP joint
    const isFartherFromWrist = dTipWrist > dPipWrist * 1.08;
    // Tip has clear extension length from its MCP base
    const hasExtensionSpan = dTipMcp > palmScale * 0.65;

    return (isHigherThanPip && isFartherFromWrist) || (isFartherFromWrist && hasExtensionSpan);
  };

  const isIndexExtended = checkExtension(8, 6, 5);
  const isMiddleExtended = checkExtension(12, 10, 9);
  const isRingExtended = checkExtension(16, 14, 13);
  const isPinkyExtended = checkExtension(20, 18, 17);

  // Thumb extension:
  // When thumb is extended (thumbs up, open palm, or counting 3 with thumb),
  // thumb tip (4) is positioned away from index knuckle (5) and middle knuckle (9)
  const thumbTipDistToMcpIndex = dist(landmarks[4], landmarks[5]);
  const thumbTipDistToMcpMiddle = dist(landmarks[4], landmarks[9]);
  const thumbTipDistToWrist = dist(landmarks[4], wrist);
  const isThumbExtended =
    thumbTipDistToMcpIndex > palmScale * 0.52 &&
    thumbTipDistToMcpMiddle > palmScale * 0.55 &&
    thumbTipDistToWrist > dist(landmarks[2], wrist) * 1.25;

  let count = 0;
  if (isIndexExtended) count++;
  if (isMiddleExtended) count++;
  if (isRingExtended) count++;
  if (isPinkyExtended) count++;
  if (isThumbExtended) count++;

  const fingerState: FingerState = {
    thumb: isThumbExtended,
    index: isIndexExtended,
    middle: isMiddleExtended,
    ring: isRingExtended,
    pinky: isPinkyExtended,
    count,
  };

  const relativeDistances = [
    dist(landmarks[4], wrist) / palmScale,
    dist(landmarks[8], wrist) / palmScale,
    dist(landmarks[12], wrist) / palmScale,
    dist(landmarks[16], wrist) / palmScale,
    dist(landmarks[20], wrist) / palmScale,
  ];

  return { fingerState, relativeDistances };
}

// Match detected frame against calibrated profile or standard fallback
export function matchGesture(
  fingerState: FingerState,
  relativeDistances: number[],
  profile: GestureCalibrationProfile
): {
  matchedChoice: 'A' | 'B' | 'C' | 'D' | 'NEXT' | null;
  confidence: number;
  matchReason: string;
} {
  const gestures = profile.gestures || DEFAULT_GESTURES;
  const count = fingerState.count;

  // If no fingers extended (fist or resting), return null
  if (count <= 0) {
    return { matchedChoice: null, confidence: 0, matchReason: 'No fingers detected' };
  }

  // If custom calibration is active (updatedAt > 0), check calibrated gestures that match this EXACT count
  if (profile.updatedAt > 0) {
    const keys: Array<'A' | 'B' | 'C' | 'D' | 'NEXT'> = ['A', 'B', 'C', 'D', 'NEXT'];
    let bestMatch: 'A' | 'B' | 'C' | 'D' | 'NEXT' | null = null;
    let highestScore = 0;

    for (const key of keys) {
      const calibrated = gestures[key];
      // STRICT RULE: Calibrated gesture MUST match current finger count
      if (!calibrated || calibrated.fingerCount !== count) continue;

      let score = 50; // Base score for matching exact finger count

      // Check matching individual fingers (up to 40 pts)
      let fingerMatches = 0;
      if (fingerState.thumb === calibrated.fingers.thumb) fingerMatches++;
      if (fingerState.index === calibrated.fingers.index) fingerMatches++;
      if (fingerState.middle === calibrated.fingers.middle) fingerMatches++;
      if (fingerState.ring === calibrated.fingers.ring) fingerMatches++;
      if (fingerState.pinky === calibrated.fingers.pinky) fingerMatches++;
      score += fingerMatches * 8;

      // Distance similarity (up to 10 pts)
      if (calibrated.relativeDistances && calibrated.relativeDistances.length === 5) {
        let diff = 0;
        for (let i = 0; i < 5; i++) {
          diff += Math.abs((relativeDistances[i] || 0) - (calibrated.relativeDistances[i] || 0));
        }
        if (diff / 5 < 0.4) score += 10;
        else if (diff / 5 < 0.7) score += 5;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = key;
      }
    }

    if (bestMatch && highestScore >= 70) {
      return {
        matchedChoice: bestMatch,
        confidence: Math.min(100, highestScore),
        matchReason: `Custom profile matched (${count} fingers)`,
      };
    }
  }

  // Standard direct counting mapping:
  // 1 Finger = Option A
  // 2 Fingers = Option B
  // 3 Fingers = Option C
  // 4 Fingers = Option D
  // 5 Fingers = NEXT (Open Palm)
  if (count === 1) return { matchedChoice: 'A', confidence: 95, matchReason: '1 finger detected (Option A)' };
  if (count === 2) return { matchedChoice: 'B', confidence: 95, matchReason: '2 fingers detected (Option B)' };
  if (count === 3) return { matchedChoice: 'C', confidence: 95, matchReason: '3 fingers detected (Option C)' };
  if (count === 4) return { matchedChoice: 'D', confidence: 95, matchReason: '4 fingers detected (Option D)' };
  if (count >= 5) return { matchedChoice: 'NEXT', confidence: 95, matchReason: '5 fingers / Open palm (Next)' };

  return { matchedChoice: null, confidence: 0, matchReason: 'Unknown gesture' };
}

// Simple audio tone generator using Web Audio API for scan confirmation
export function playScanSound(type: 'beep' | 'success' | 'countdown'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'countdown') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch {}
}

// Crisp, pleasant audio feedback for evaluating user answer
export function playAnswerSound(isCorrect: boolean): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (isCorrect) {
      // Pleasant two-tone ascending chime (523Hz -> 784Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1); // G5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.35);
    } else {
      // Gentle distinct descending buzzer (349Hz -> 261Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(349.23, ctx.currentTime); // F4
      osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 0.22); // C4

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch {}
}
