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

  // Y-axis based extension check (in camera coordinate system, tip y < pip y means extended upwards)
  // Plus distance check from wrist for robust tilted hands
  const isIndexExtended =
    landmarks[8].y < landmarks[6].y || dist(landmarks[8], wrist) > dist(landmarks[5], wrist) * 1.35;
  const isMiddleExtended =
    landmarks[12].y < landmarks[10].y || dist(landmarks[12], wrist) > dist(landmarks[9], wrist) * 1.35;
  const isRingExtended =
    landmarks[16].y < landmarks[14].y || dist(landmarks[16], wrist) > dist(landmarks[13], wrist) * 1.35;
  const isPinkyExtended =
    landmarks[20].y < landmarks[18].y || dist(landmarks[20], wrist) > dist(landmarks[17], wrist) * 1.35;

  // Thumb extension: distance of tip(4) to wrist(0) vs IP(3) to wrist(0) and distance to MCP(5)
  const thumbTipDist = dist(landmarks[4], wrist);
  const thumbIpDist = dist(landmarks[3], wrist);
  const isThumbExtended = thumbTipDist > thumbIpDist * 1.15 && dist(landmarks[4], landmarks[2]) > palmScale * 0.45;

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
  const candidates: Array<{ choiceId: 'A' | 'B' | 'C' | 'D' | 'NEXT'; score: number; reason: string }> = [];

  const keys: Array<'A' | 'B' | 'C' | 'D' | 'NEXT'> = ['A', 'B', 'C', 'D', 'NEXT'];

  for (const key of keys) {
    const calibrated = gestures[key];
    if (!calibrated) continue;

    let score = 0;

    // 1. Finger count match (up to 40 pts)
    const countDiff = Math.abs(fingerState.count - calibrated.fingerCount);
    if (countDiff === 0) score += 40;
    else if (countDiff === 1) score += 15;

    // 2. Individual finger matching (10 pts each, up to 50 pts)
    let fingerMatches = 0;
    if (fingerState.thumb === calibrated.fingers.thumb) fingerMatches++;
    if (fingerState.index === calibrated.fingers.index) fingerMatches++;
    if (fingerState.middle === calibrated.fingers.middle) fingerMatches++;
    if (fingerState.ring === calibrated.fingers.ring) fingerMatches++;
    if (fingerState.pinky === calibrated.fingers.pinky) fingerMatches++;
    score += fingerMatches * 10;

    // 3. Distance vector similarity (up to 10 pts)
    if (calibrated.relativeDistances && calibrated.relativeDistances.length === 5) {
      let distDiffTotal = 0;
      for (let i = 0; i < 5; i++) {
        distDiffTotal += Math.abs((relativeDistances[i] || 0) - (calibrated.relativeDistances[i] || 0));
      }
      const avgDiff = distDiffTotal / 5;
      if (avgDiff < 0.4) score += 10;
      else if (avgDiff < 0.8) score += 5;
    }

    candidates.push({
      choiceId: key,
      score,
      reason: `${fingerMatches}/5 fingers match, count ${fingerState.count}/${calibrated.fingerCount}`,
    });
  }

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);

  const best = candidates[0];
  if (best && best.score >= 65) {
    return {
      matchedChoice: best.choiceId,
      confidence: Math.min(100, Math.round(best.score)),
      matchReason: best.reason,
    };
  }

  // Fallback to simple finger count if within valid range
  if (fingerState.count === 1) return { matchedChoice: 'A', confidence: 75, matchReason: '1 finger detected' };
  if (fingerState.count === 2) return { matchedChoice: 'B', confidence: 75, matchReason: '2 fingers detected' };
  if (fingerState.count === 3) return { matchedChoice: 'C', confidence: 75, matchReason: '3 fingers detected' };
  if (fingerState.count === 4) return { matchedChoice: 'D', confidence: 75, matchReason: '4 fingers detected' };
  if (fingerState.count === 5) return { matchedChoice: 'NEXT', confidence: 85, matchReason: '5 fingers / palm detected' };

  return { matchedChoice: null, confidence: 0, matchReason: 'No clear gesture match' };
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
