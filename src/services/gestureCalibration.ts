// Service for calibrating, scanning, saving, and matching custom hand gestures

export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
  count: number;
  thumbTucked?: boolean;
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

const STORAGE_KEY = 'drive_flashcards_gesture_profile_v2';
const LEGACY_STORAGE_KEYS = ['pnle_custom_gesture_profile_v1', 'drive_custom_gesture_profile_v1'];

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
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyVal = localStorage.getItem(legacyKey);
        if (legacyVal) {
          raw = legacyVal;
          localStorage.setItem(STORAGE_KEY, legacyVal);
          break;
        }
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.gestures) {
        const mergedGestures = { ...DEFAULT_GESTURES, ...parsed.gestures };
        return {
          version: parsed.version || 1,
          updatedAt: parsed.updatedAt || 0,
          gestures: mergedGestures,
        };
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
    const serialized = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, serialized);
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      localStorage.setItem(legacyKey, serialized);
    }
  } catch (err) {
    console.warn('Failed to save gesture profile to localStorage', err);
  }
}

export function hasCustomCalibration(): boolean {
  const profile = loadGestureProfile();
  return (
    profile.updatedAt > 0 ||
    Object.values(profile.gestures || {}).some((g) => g.calibratedAt && g.calibratedAt > 0)
  );
}

export function resetGestureProfile(): GestureCalibrationProfile {
  try {
    localStorage.removeItem(STORAGE_KEY);
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(legacyKey);
    }
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

  // Anatomically robust finger extension test:
  // For Index, Middle, Ring, Pinky:
  // A finger is extended if tip is higher than PIP & DIP (camera Y increases downwards)
  // AND the distance from MCP to TIP is significantly longer than MCP to PIP.
  // When a finger curls into the palm, the tip curls back towards MCP, making dist(tip, mcp) < dist(pip, mcp).
  const checkFingerExtended = (tipIdx: number, dipIdx: number, pipIdx: number, mcpIdx: number): boolean => {
    const tip = landmarks[tipIdx];
    const dip = landmarks[dipIdx];
    const pip = landmarks[pipIdx];
    const mcp = landmarks[mcpIdx];
    if (!tip || !dip || !pip || !mcp) return false;

    const dTipWrist = dist(tip, wrist);
    const dPipWrist = dist(pip, wrist);
    const dTipMcp = dist(tip, mcp);
    const dPipMcp = dist(pip, mcp);

    // Upright hand (most common when gesturing to camera):
    // Tip is above both PIP and DIP joints in camera Y
    const isHigherUpright = tip.y < pip.y && tip.y < dip.y;

    // Geometric extension length: extended fingers are straight (dTipMcp > dPipMcp * 1.25)
    // Curled fingers curl back toward MCP (dTipMcp < dPipMcp)
    const isStraight = dTipMcp > dPipMcp * 1.25;

    // Tip is farther from wrist than PIP joint
    const isFurtherFromWrist = dTipWrist > dPipWrist * 1.05;

    // Both criteria must agree for upright hand; or strong straightness if tilted
    return (isHigherUpright && isFurtherFromWrist) || (isStraight && isFurtherFromWrist && dTipMcp > palmScale * 0.75);
  };

  const isIndexExtended = checkFingerExtended(8, 7, 6, 5);
  const isMiddleExtended = checkFingerExtended(12, 11, 10, 9);
  const isRingExtended = checkFingerExtended(16, 15, 14, 13);
  const isPinkyExtended = checkFingerExtended(20, 19, 18, 17);

  // Robust Thumb Extension Test:
  // Landmark 4: Thumb Tip
  // Landmark 3: Thumb IP
  // Landmark 2: Thumb MCP
  // Landmark 5: Index MCP
  // Landmark 9: Middle MCP
  // Landmark 17: Pinky MCP
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];
  const indexMcp = landmarks[5];
  const middleMcp = landmarks[9];
  const pinkyMcp = landmarks[17];

  const thumbTipDistToIndexMcp = dist(thumbTip, indexMcp);
  const thumbTipDistToMiddleMcp = dist(thumbTip, middleMcp);
  const thumbTipDistToPinkyMcp = dist(thumbTip, pinkyMcp);
  const thumbTipDistToWrist = dist(thumbTip, wrist);
  const thumbMcpDistToWrist = dist(thumbMcp, wrist);
  const thumbTipDistToThumbMcp = dist(thumbTip, thumbMcp);
  const thumbIpDistToThumbMcp = dist(thumbIp, thumbMcp);

  // Anatomical Thumb Extension & Tuck Analysis:
  // When thumb is tucked into palm (e.g. Option D with 4 fingers up):
  // The thumb tip is curled inward toward the index or middle MCP, and closer to wrist/MCP.
  const isThumbTucked =
    thumbTipDistToIndexMcp < palmScale * 0.45 ||
    thumbTipDistToMiddleMcp < palmScale * 0.52 ||
    thumbTipDistToThumbMcp < thumbIpDistToThumbMcp * 0.95;

  // When thumb is extended (e.g. Open Palm 🖐️ or Thumbs Up or 'L' sign):
  // The thumb tip is not tucked into the palm AND extends outward
  const isThumbExtended =
    !isThumbTucked &&
    (thumbTipDistToIndexMcp > palmScale * 0.48 ||
      thumbTipDistToWrist > thumbMcpDistToWrist * 1.10 ||
      thumbTipDistToThumbMcp > thumbIpDistToThumbMcp * 1.05);

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
    thumbTucked: isThumbTucked,
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

// Match detected frame against standard direct gestures or custom profile
export function matchGesture(
  fingerState: FingerState,
  relativeDistances: number[],
  profile?: GestureCalibrationProfile | null
): {
  matchedChoice: 'A' | 'B' | 'C' | 'D' | 'NEXT' | null;
  confidence: number;
  matchReason: string;
} {
  const { thumb, index, middle, ring, pinky, count } = fingerState;

  // Non-thumb extended count (Index, Middle, Ring, Pinky)
  const nonThumbCount = (index ? 1 : 0) + (middle ? 1 : 0) + (ring ? 1 : 0) + (pinky ? 1 : 0);

  // If no fingers extended (fist or resting palm), return null
  if (count <= 0 && nonThumbCount <= 0) {
    return { matchedChoice: null, confidence: 0, matchReason: 'No fingers detected' };
  }

  // 1. If user has calibrated gestures, check them first with high sensitivity and priority
  const hasCalibratedData =
    profile &&
    (profile.updatedAt > 0 ||
      Object.values(profile.gestures || {}).some((g) => g.calibratedAt && g.calibratedAt > 0));

  if (hasCalibratedData && profile?.gestures) {
    let bestChoice: 'A' | 'B' | 'C' | 'D' | 'NEXT' | null = null;
    let bestScore = 0;
    let isUserCalibrated = false;

    const choices: Array<'A' | 'B' | 'C' | 'D' | 'NEXT'> = ['A', 'B', 'C', 'D', 'NEXT'];
    for (const c of choices) {
      const cal = profile.gestures[c];
      if (!cal) continue;

      let score = 0;

      // Finger count match
      if (cal.fingerCount === count) {
        score += 35;
      } else if (Math.abs(cal.fingerCount - count) === 1) {
        score += 15;
      }

      // Individual finger booleans (10 points each = 50 max)
      let fingerMatches = 0;
      if (cal.fingers.thumb === thumb) fingerMatches++;
      if (cal.fingers.index === index) fingerMatches++;
      if (cal.fingers.middle === middle) fingerMatches++;
      if (cal.fingers.ring === ring) fingerMatches++;
      if (cal.fingers.pinky === pinky) fingerMatches++;
      score += fingerMatches * 10;

      // Check if the specific extended fingers of this gesture are active
      let activeTargetCount = 0;
      let activeTargetMatch = 0;
      for (const f of ['thumb', 'index', 'middle', 'ring', 'pinky'] as const) {
        if (cal.fingers[f]) {
          activeTargetCount++;
          if (fingerState[f]) activeTargetMatch++;
        }
      }
      if (activeTargetCount > 0 && activeTargetMatch === activeTargetCount) {
        score += 15; // All active fingers are up as trained
      }

      // Euclidean distance of normalized tip distances
      if (cal.relativeDistances && cal.relativeDistances.length === 5 && relativeDistances.length === 5) {
        let distDiff = 0;
        for (let i = 0; i < 5; i++) {
          distDiff += Math.abs((cal.relativeDistances[i] || 0) - (relativeDistances[i] || 0));
        }
        if (distDiff < 1.2) score += 15;
        else if (distDiff < 2.2) score += 8;
        else if (distDiff < 3.2) score += 4;
      }

      // Explicit user-calibrated bonus
      const userCal = Boolean(cal.calibratedAt && cal.calibratedAt > 0);
      if (userCal) {
        score += 15;
      }

      const threshold = userCal ? 58 : 72;
      if (score > bestScore && score >= threshold) {
        bestScore = score;
        bestChoice = c;
        isUserCalibrated = userCal;
      }
    }

    if (bestChoice && bestScore >= 58) {
      return {
        matchedChoice: bestChoice,
        confidence: Math.min(99, Math.round((bestScore / 130) * 100)),
        matchReason: isUserCalibrated
          ? `Calibrated Gesture (${bestChoice})`
          : `Gesture Profile (${bestChoice})`,
      };
    }
  }

  // 1. OPTION A: Exactly 1 non-thumb finger extended (Index finger pointing up)
  // or count is 1 with index extended
  if (index && !middle && !ring && !pinky) {
    return { matchedChoice: 'A', confidence: 98, matchReason: '1 finger (Index) → Option A' };
  }

  // 2. OPTION B: Exactly 2 fingers extended (Index + Middle pointing up, peace sign / victory)
  // Ring and Pinky must be curled. Thumb can be tucked or relaxed.
  if (index && middle && !ring && !pinky) {
    return { matchedChoice: 'B', confidence: 98, matchReason: '2 fingers (Index + Middle) → Option B' };
  }

  // 3. OPTION C: Exactly 3 fingers extended
  // Either Index + Middle + Ring (Pinky curled) OR European 3 (Thumb + Index + Middle, with Ring & Pinky curled)
  if (index && middle && ring && !pinky) {
    return { matchedChoice: 'C', confidence: 98, matchReason: '3 fingers (Index + Middle + Ring) → Option C' };
  }
  if (thumb && index && middle && !ring && !pinky) {
    return { matchedChoice: 'C', confidence: 95, matchReason: '3 fingers (Thumb + Index + Middle) → Option C' };
  }

  const isTucked = fingerState.thumbTucked ?? (!thumb);

  // 5. NEXT CARD (Open Palm 👋 / 5 fingers):
  // Either 5 fingers extended, or all 4 fingers extended with thumb out (not tucked into palm)
  if (count >= 5 || (index && middle && ring && pinky && !isTucked) || (nonThumbCount === 4 && thumb)) {
    return { matchedChoice: 'NEXT', confidence: 98, matchReason: '5 fingers (Open Palm) → Next Card' };
  }

  // 4. OPTION D: Exactly 4 fingers extended (All 4 Up, Thumb tucked into palm)
  if (index && middle && ring && pinky && isTucked) {
    return { matchedChoice: 'D', confidence: 98, matchReason: '4 fingers (Thumb Tucked) → Option D' };
  }

  // Fallback purely on extended non-thumb count or total count
  if (count >= 5 || (nonThumbCount === 4 && !isTucked)) {
    return { matchedChoice: 'NEXT', confidence: 95, matchReason: '5 fingers detected → Next' };
  }
  if (nonThumbCount === 4 && isTucked) {
    return { matchedChoice: 'D', confidence: 92, matchReason: '4 fingers detected → Option D' };
  }
  if (nonThumbCount === 1 || count === 1) {
    return { matchedChoice: 'A', confidence: 92, matchReason: '1 finger detected → Option A' };
  }
  if (nonThumbCount === 2 || count === 2) {
    return { matchedChoice: 'B', confidence: 92, matchReason: '2 fingers detected → Option B' };
  }
  if (nonThumbCount === 3 || count === 3) {
    return { matchedChoice: 'C', confidence: 92, matchReason: '3 fingers detected → Option C' };
  }
  if (nonThumbCount === 4 && !thumb) {
    return { matchedChoice: 'D', confidence: 92, matchReason: '4 fingers detected → Option D' };
  }
  if (count >= 5 || (nonThumbCount === 4 && thumb)) {
    return { matchedChoice: 'NEXT', confidence: 92, matchReason: '5 fingers detected → Next' };
  }

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
      // Modern sleek UI tactile drop / soft pop cue (organic, satisfying, professional)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Low-pass filter for smooth, rounded acoustic warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.15);

      // Quick smooth descending pitch drop (320Hz -> 135Hz) for a clean modern pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(135, now + 0.15);

      // Snappy, clean decay
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {}
}
