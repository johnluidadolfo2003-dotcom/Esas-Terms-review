import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GestureScannerModal } from './GestureScannerModal';
import {
  GestureCalibrationProfile,
  loadGestureProfile,
  matchGesture,
  extractFingerMetrics,
  hasCustomCalibration,
  playAnswerSound,
} from '../services/gestureCalibration';
import { FlashcardQuestion } from '../services/questionParser';

interface HandGestureControllerProps {
  isActive: boolean;
  onClose: () => void;
  onSelectChoice: (choiceId: string) => void;
  onResetAnswer?: () => void;
  onNext: () => void;
  isAnswered: boolean;
  currentQuestionId: string;
  currentQuestion?: FlashcardQuestion | null;
  selectedChoice?: string | null;
  correctChoiceId?: string;
}

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
}

export const HandGestureController: React.FC<HandGestureControllerProps> = ({
  isActive,
  onClose,
  onSelectChoice,
  onResetAnswer,
  onNext,
  isAnswered,
  currentQuestionId,
  currentQuestion,
  selectedChoice,
  correctChoiceId,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [permissionState, setPermissionState] = useState<'prompt' | 'requesting' | 'granted' | 'denied'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedFingers, setDetectedFingers] = useState<number>(0);
  const [holdingChoice, setHoldingChoice] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Ready for Camera Permission');
  const [autoNextDelay, setAutoNextDelay] = useState<number>(5.0); // 5.0s default for reading & analyzing
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Gesture calibration scanner state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [customProfile, setCustomProfile] = useState<GestureCalibrationProfile>(() => loadGestureProfile());
  const customProfileRef = useRef<GestureCalibrationProfile>(customProfile);
  customProfileRef.current = customProfile;
  const [liveMatchedChoice, setLiveMatchedChoice] = useState<string | null>(null);
  const [liveConfidence, setLiveConfidence] = useState<number>(0);

  // Sync calibrated profile on mount or window storage changes so website refresh never loses calibration
  useEffect(() => {
    const loaded = loadGestureProfile();
    setCustomProfile(loaded);
    customProfileRef.current = loaded;

    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key && e.key.includes('gesture_profile')) {
        const fresh = loadGestureProfile();
        setCustomProfile(fresh);
        customProfileRef.current = fresh;
      }
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // Evaluated result state (correct vs wrong for HUD and audio feedback)
  const [evaluatedResult, setEvaluatedResult] = useState<{
    choiceId: string;
    isCorrect: boolean;
    correctChoiceId: string;
  } | null>(null);

  // Smooth hold frame tracking refs
  const holdCandidateRef = useRef<string | null>(null);
  const holdStreakRef = useRef<number>(0);
  const missedFramesRef = useRef<number>(0);

  const holdingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoNextTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentHoldChoiceRef = useRef<string | null>(null);
  const holdCountRef = useRef<number>(0);
  const lastSelectedQuestionIdRef = useRef<string | null>(null);
  const nextCooldownRef = useRef<number>(0);
  const isAnsweredRef = useRef<boolean>(isAnswered);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const handsInstanceRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Synchronized state refs to avoid stale closures in MediaPipe onResults callback
  const currentQuestionRef = useRef(currentQuestion);
  currentQuestionRef.current = currentQuestion;

  const correctChoiceIdRef = useRef(correctChoiceId);
  correctChoiceIdRef.current = correctChoiceId;

  const onSelectChoiceRef = useRef(onSelectChoice);
  onSelectChoiceRef.current = onSelectChoice;

  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const processHandResultsRef = useRef<(results: any) => void>(() => {});

  isAnsweredRef.current = isAnswered;

  // Clear hold timer and frame trackers
  const clearHoldTimer = useCallback(() => {
    if (holdingTimerRef.current) {
      clearInterval(holdingTimerRef.current);
      holdingTimerRef.current = null;
    }
    holdCandidateRef.current = null;
    holdStreakRef.current = 0;
    missedFramesRef.current = 0;
    currentHoldChoiceRef.current = null;
    holdCountRef.current = 0;
    setHoldingChoice(null);
    setHoldProgress(0);
  }, []);

  // Clear auto-next countdown interval
  const clearAutoNextTimer = useCallback(() => {
    if (autoNextTimerRef.current) {
      clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
  }, []);

  // Pause auto-next timer so user can read/analyze indefinitely
  const pauseAutoNextTimer = useCallback(() => {
    clearAutoNextTimer();
    setAutoNextCountdown(null);
    setIsTimerPaused(true);
    setStatusMessage('Auto-advance paused.');
  }, [clearAutoNextTimer]);

  // Cancel timer completely
  const cancelAutoNextTimer = useCallback(() => {
    clearAutoNextTimer();
    setAutoNextCountdown(null);
    setIsTimerPaused(false);
  }, [clearAutoNextTimer]);

  // Trigger manual immediate next question
  const triggerNextQuestion = useCallback(() => {
    cancelAutoNextTimer();
    nextCooldownRef.current = Date.now() + 800; // 800ms cooldown
    onNextRef.current();
  }, [cancelAutoNextTimer]);

  // Reset timers on new question
  useEffect(() => {
    if (lastSelectedQuestionIdRef.current !== currentQuestionId) {
      clearHoldTimer();
      cancelAutoNextTimer();
      lastSelectedQuestionIdRef.current = currentQuestionId;
      setEvaluatedResult(null);
      setStatusMessage('Show 1 to 4 fingers to answer (5 fingers for Next)');
    }
  }, [currentQuestionId, clearHoldTimer, cancelAutoNextTimer]);

  // Keep evaluatedResult in sync with props
  useEffect(() => {
    const rawExpected = correctChoiceId || currentQuestion?.correctChoiceId;
    if (selectedChoice && rawExpected) {
      const cleanSel = selectedChoice.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const cleanExp = rawExpected.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      setEvaluatedResult({
        choiceId: selectedChoice,
        isCorrect: cleanSel === cleanExp,
        correctChoiceId: rawExpected,
      });
    } else if (!isAnswered) {
      setEvaluatedResult(null);
    }
  }, [selectedChoice, correctChoiceId, currentQuestion, isAnswered]);

  // Resolves the choice from the flashcard based on the gesture ('A'|'B'|'C'|'D' or 1-4).
  // Strictly follows the placement/position of choices on the flashcard!
  // Position 0 on flashcard = 1 finger / 'A'
  // Position 1 on flashcard = 2 fingers / 'B'
  // Position 2 on flashcard = 3 fingers / 'C'
  // Position 3 on flashcard = 4 fingers / 'D'
  const resolveFlashcardChoice = useCallback((letterOrKey: string) => {
    const q = currentQuestionRef.current;
    if (!q || !q.choices || q.choices.length === 0) return null;

    const cleanInput = letterOrKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const idxMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
    const placementIdx = idxMap[cleanInput];

    // Priority 1: Match by letter ID on the flashcard (case-insensitive)
    const foundById = q.choices.find(
      (c) => c.id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanInput
    );
    if (foundById) return foundById;

    // Priority 2: Match by exact physical placement order on the flashcard (index 0, 1, 2, 3)
    if (placementIdx !== undefined && q.choices[placementIdx]) {
      return q.choices[placementIdx];
    }

    return null;
  }, []);

  // Identifies the correct answer using the placement in the flashcard
  const getFlashcardCorrectAnswer = useCallback(() => {
    const q = currentQuestionRef.current;
    const rawExpected = correctChoiceIdRef.current || q?.correctChoiceId || '';
    if (!q || !rawExpected) return { expectedId: rawExpected, correctChoiceObj: null, placementIndex: -1 };

    const cleanExpected = rawExpected.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    // The placement of the correct answer is directly in the flashcard choices list
    const correctChoiceObj = q.choices.find(
      (c) => c.id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanExpected
    );
    const placementIndex = q.choices.findIndex(
      (c) => c.id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanExpected
    );

    return {
      expectedId: correctChoiceObj ? correctChoiceObj.id : rawExpected,
      correctChoiceObj: correctChoiceObj || null,
      placementIndex,
    };
  }, []);

  // Trigger choice selection & evaluate answer (sound, green/red HUD, and flashcard select)
  const triggerChoiceSelection = useCallback(
    (choiceId: string) => {
      clearHoldTimer();
      cancelAutoNextTimer();

      // Look up target choice using the placement on the flashcard
      const targetChoice = resolveFlashcardChoice(choiceId);
      const chosenId = targetChoice ? targetChoice.id : choiceId;

      // Identify the correct answer using the placement in the flashcard
      const { expectedId } = getFlashcardCorrectAnswer();

      const cleanChosen = chosenId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const cleanExpected = expectedId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const isCorrect = cleanExpected ? cleanChosen === cleanExpected : null;

      // Play audio feedback
      if (isCorrect !== null) {
        playAnswerSound(isCorrect);
      }

      setEvaluatedResult({
        choiceId: chosenId,
        isCorrect: Boolean(isCorrect),
        correctChoiceId: expectedId,
      });

      if (isCorrect === true) {
        setStatusMessage(`Correct! Option ${chosenId}`);
      } else if (isCorrect === false) {
        setStatusMessage(`Option ${chosenId} is wrong. Correct: Option ${expectedId}`);
      } else {
        setStatusMessage(`Selected Option ${chosenId}`);
      }

      // Lock in choice on flashcard immediately: this selects the button on the flashcard!
      onSelectChoiceRef.current(chosenId);

      if (autoNextDelay > 0) {
        let secondsLeft = Math.round(autoNextDelay);
        setAutoNextCountdown(secondsLeft);
        setIsTimerPaused(false);

        autoNextTimerRef.current = setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft <= 0) {
            clearAutoNextTimer();
            setAutoNextCountdown(null);
            onNextRef.current();
          } else {
            setAutoNextCountdown(secondsLeft);
          }
        }, 1000);
      } else {
        setStatusMessage(
          isCorrect === true
            ? `Correct! Option ${chosenId}`
            : isCorrect === false
            ? `Option ${chosenId} is wrong. Correct: Option ${expectedId}`
            : `Selected Option ${chosenId}`
        );
      }
    },
    [clearHoldTimer, cancelAutoNextTimer, clearAutoNextTimer, autoNextDelay, resolveFlashcardChoice, getFlashcardCorrectAnswer]
  );

  // Process MediaPipe Hand Results
  const processHandResults = useCallback(
    (results: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        // Draw camera image
        if (results.image) {
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        }

        // Draw connections
        ctx.strokeStyle = '#0d9488'; // Teal
        ctx.lineWidth = 3;
        for (const conn of HAND_CONNECTIONS) {
          const from = landmarks[conn[0]];
          const to = landmarks[conn[1]];
          if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
            ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
            ctx.stroke();
          }
        }

        // Draw landmark dots
        for (const lm of landmarks) {
          ctx.fillStyle = '#38bdf8'; // Sky blue
          ctx.beginPath();
          ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
          ctx.fill();
        }

        // --- EXTRACT FINGER METRICS & MATCH GESTURE ---
        const { fingerState, relativeDistances } = extractFingerMetrics(landmarks);
        setDetectedFingers(fingerState.count);

        // Match against user's custom calibrated profile (falls back to standard count)
        const matchResult = matchGesture(fingerState, relativeDistances, customProfileRef.current);
        const mappedChoice: string | null = matchResult.matchedChoice;
        setLiveMatchedChoice(matchResult.matchedChoice);
        setLiveConfidence(matchResult.confidence);
        const isCalibratedMatch = matchResult.matchReason.includes('Calibrated');

        // If calibration scanner modal is currently open, do not trigger background quiz actions
        if (isScannerOpen) {
          clearHoldTimer();
          ctx.restore();
          return;
        }

        // --- SMOOTH & RESPONSIVE GESTURE HOLD PROCESSING ---
        // Case 1: Question not answered yet, hold 1-4 fingers to select A, B, C, D
        if (!isAnsweredRef.current && mappedChoice && ['A', 'B', 'C', 'D'].includes(mappedChoice)) {
          const targetChoice = resolveFlashcardChoice(mappedChoice);
          const choiceText = targetChoice ? targetChoice.text : '';
          const choiceLabel = targetChoice
            ? `Option ${targetChoice.id}${isCalibratedMatch ? ' (Calibrated)' : ''}: ${choiceText}`
            : `Option ${mappedChoice}${isCalibratedMatch ? ' (Calibrated)' : ''}`;

          // If continuing the same gesture
          if (holdCandidateRef.current === mappedChoice) {
            missedFramesRef.current = 0;
            holdStreakRef.current += 1;
            const targetFrames = 15; // ~0.55s stable hold to prevent false triggers during hand raising
            const progress = Math.min(100, Math.round((holdStreakRef.current / targetFrames) * 100));
            setHoldProgress(progress);
            setHoldingChoice(choiceLabel);

            if (holdStreakRef.current >= targetFrames) {
              const selected = mappedChoice;
              clearHoldTimer();
              triggerChoiceSelection(selected);
            }
          } else {
            // New gesture candidate started
            holdCandidateRef.current = mappedChoice;
            holdStreakRef.current = 1;
            missedFramesRef.current = 0;
            setHoldingChoice(choiceLabel);
            setHoldProgress(10);
          }
        }
        // Case 2: Show 5 fingers (Open Palm 👋) to advance to Next Question immediately
        else if (mappedChoice === 'NEXT' || fingerState.count >= 5) {
          // If in cooldown from previous next card action, wait
          if (Date.now() < nextCooldownRef.current) {
            clearHoldTimer();
            ctx.restore();
            return;
          }

          if (holdCandidateRef.current === 'NEXT') {
            missedFramesRef.current = 0;
            holdStreakRef.current += 1;
            const targetFrames = 7; // Fast & crisp response (~0.23s) so 5 fingers triggers reliably
            const progress = Math.min(100, Math.round((holdStreakRef.current / targetFrames) * 100));
            setHoldProgress(progress);
            setHoldingChoice('NEXT Question 👋');

            if (holdStreakRef.current >= targetFrames) {
              clearHoldTimer();
              triggerNextQuestion();
            }
          } else {
            holdCandidateRef.current = 'NEXT';
            holdStreakRef.current = 1;
            missedFramesRef.current = 0;
            setHoldingChoice('NEXT Question 👋');
            setHoldProgress(20);
          }
        } else {
          // No valid choice on this frame - allow up to 6 dropped frames before resetting
          if (holdCandidateRef.current) {
            missedFramesRef.current += 1;
            if (missedFramesRef.current > 6) {
              clearHoldTimer();
            }
          }
        }
      } else {
        if (results.image) {
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        }
        setDetectedFingers(0);
        if (holdCandidateRef.current) {
          missedFramesRef.current += 1;
          if (missedFramesRef.current > 6) {
            clearHoldTimer();
          }
        }
      }

      ctx.restore();
    },
    [clearHoldTimer, triggerChoiceSelection, triggerNextQuestion, isScannerOpen]
  );

  processHandResultsRef.current = processHandResults;

  // Request camera permission & start processing
  const handleRequestPermission = useCallback(async () => {
    setPermissionState('requesting');
    setCameraError(null);
    setStatusMessage('Requesting camera permission...');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) is not supported in this browser environment.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
      } catch (err1) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false,
          });
        } catch (err2) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      activeStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      // Immediately grant permission and display camera video feed
      setPermissionState('granted');
      setStatusMessage('Camera active');

      try {
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

        const HandsClass = (window as any).Hands;
        if (HandsClass) {
          const handsInstance = new HandsClass({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });

          handsInstanceRef.current = handsInstance;

          handsInstance.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.65,
            minTrackingConfidence: 0.65,
          });

          handsInstance.onResults((results: any) => {
            processHandResultsRef.current(results);
          });

          // Frame detection loop
          const processFrame = async () => {
            if (
              videoRef.current &&
              videoRef.current.readyState >= 2 &&
              videoRef.current.videoWidth > 0 &&
              handsInstanceRef.current
            ) {
              try {
                await handsInstanceRef.current.send({ image: videoRef.current });
              } catch {}
            }
            animFrameIdRef.current = requestAnimationFrame(processFrame);
          };

          animFrameIdRef.current = requestAnimationFrame(processFrame);
          setStatusMessage('Show 1 to 4 fingers to select an answer');
        }
      } catch (scriptErr) {
        console.warn('MediaPipe hands script warning:', scriptErr);
        setStatusMessage('Camera active');
      }
    } catch (err: any) {
      setPermissionState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || String(err).includes('Permission denied')) {
        setCameraError('Camera permission was blocked by your browser settings or iframe context.');
      } else {
        setCameraError(`Camera error: ${err.message || 'Unable to access webcam'}`);
      }
    }
  }, [processHandResults]);

  // Simulate finger gesture for keyboard hotkeys (1,2,3,4,5) or simulation buttons
  const simulateFingers = useCallback(
    (count: number) => {
      setDetectedFingers(count);
      if (count === 5) {
        triggerNextQuestion();
        return;
      }
      let mappedChoice: string | null = null;
      if (customProfileRef.current?.gestures) {
        for (const [key, val] of Object.entries(customProfileRef.current.gestures)) {
          if (val.fingerCount === count && ['A', 'B', 'C', 'D'].includes(key) && val.calibratedAt > 0) {
            mappedChoice = key;
            break;
          }
        }
      }
      if (!mappedChoice) {
        const choiceMap: Record<number, string> = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
        mappedChoice = choiceMap[count] || null;
      }
      if (!isAnsweredRef.current && mappedChoice) {
        triggerChoiceSelection(mappedChoice);
      }
    },
    [triggerChoiceSelection, triggerNextQuestion]
  );

  // Keyboard shortcut listener (1, 2, 3, 4, 5, or A, B, C, D)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const keyUpper = e.key.toUpperCase();
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        simulateFingers(parseInt(e.key, 10));
      } else if (['A', 'B', 'C', 'D'].includes(keyUpper) && !isAnsweredRef.current) {
        triggerChoiceSelection(keyUpper);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, simulateFingers, triggerChoiceSelection]);

  // Clean up media streams and scripts on unmount / deactivate
  useEffect(() => {
    if (!isActive) return;

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
      }
      if (handsInstanceRef.current) {
        try {
          handsInstanceRef.current.close();
        } catch {}
        handsInstanceRef.current = null;
      }
      clearHoldTimer();
      clearAutoNextTimer();
    };
  }, [isActive, clearHoldTimer, clearAutoNextTimer]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 font-sans">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              permissionState === 'granted'
                ? 'bg-emerald-400'
                : permissionState === 'requesting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-rose-500'
            }`}
          ></span>
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Camera Gestures
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="text-xs px-2.5 py-0.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer flex items-center gap-1"
            title="Calibrate hand gestures"
          >
            <span>Calibrate</span>
            {(customProfile.updatedAt > 0 ||
              Object.values(customProfile.gestures || {}).some((g) => g.calibratedAt > 0)) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Custom calibrated profile active"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`text-xs px-2 py-0.5 rounded-md border cursor-pointer font-medium transition-colors ${
              showGuide
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {showGuide ? 'Close' : 'Guide'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Video / Canvas viewport */}
      <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* Live Camera Video Stream - Never covered when loading */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${
            permissionState === 'denied' ? 'hidden' : 'block'
          }`}
        />

        {/* Hand Landmark Skeleton Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none ${
            permissionState === 'denied' ? 'hidden' : 'block'
          }`}
        />

        {/* Non-blocking loading indicator - does not cover the camera feed */}
        {permissionState === 'requesting' && (
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 z-20 pointer-events-none shadow-md">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></span>
            <span>Starting camera...</span>
          </div>
        )}

        {/* Guide Modal Overlay */}
        {showGuide && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs p-3 flex flex-col justify-between text-left text-xs z-30 overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
              <span className="font-bold text-slate-100 text-xs">
                Hand Gestures
              </span>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white text-[11px] px-1.5 py-0.5 rounded bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-1 text-xs text-slate-300 leading-snug">
              <p>Hold fingers up to answer:</p>
              <ul className="pl-3 list-disc text-slate-200 font-mono text-[11px] space-y-0.5">
                <li>1 Finger = Option A</li>
                <li>2 Fingers = Option B</li>
                <li>3 Fingers = Option C</li>
                <li>4 Fingers = Option D</li>
                <li>5 Fingers = Next Card</li>
              </ul>
              <p>Hold steady for a moment to select.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-1 w-full py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs text-center cursor-pointer transition-colors"
            >
              Close Guide
            </button>
          </div>
        )}

        {/* Initial Camera Permission Request */}
        {permissionState === 'prompt' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs p-3 flex flex-col items-center justify-center text-center gap-2 z-10">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <span className="text-slate-100 text-xs font-semibold">Answer with Hand Gestures</span>
            <button
              type="button"
              onClick={handleRequestPermission}
              className="w-full px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Turn On Camera
            </button>
          </div>
        )}

        {/* Permission Denied Error State */}
        {permissionState === 'denied' && (
          <div className="absolute inset-0 bg-slate-950 p-2.5 flex flex-col items-center justify-center text-center gap-2 z-10 overflow-y-auto">
            <span className="text-rose-400 text-xs font-semibold">{cameraError || 'Camera blocked'}</span>
            <div className="flex items-center gap-1.5 w-full">
              <button
                type="button"
                onClick={handleRequestPermission}
                className="flex-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs transition-colors cursor-pointer shadow-xs text-center"
              >
                Retry
              </button>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors text-center"
              >
                Direct Tab ↗
              </a>
            </div>
          </div>
        )}

        {/* Active Detected Fingers Badge */}
        {detectedFingers > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 font-mono text-xs font-bold shadow-md z-20 flex items-center gap-1.5">
            <span>
              {liveMatchedChoice === 'NEXT'
                ? '5F → Next'
                : liveMatchedChoice
                ? `${detectedFingers}F → Option ${liveMatchedChoice}`
                : `${detectedFingers} Finger${detectedFingers > 1 ? 's' : ''}`}
            </span>
            {liveMatchedChoice && customProfile.gestures[liveMatchedChoice]?.calibratedAt > 0 && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 border border-slate-600 text-slate-200 font-sans font-medium">
                Calibrated
              </span>
            )}
          </div>
        )}

        {/* Hold Gesture Meter */}
        {holdingChoice && holdProgress > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 border border-slate-700 rounded-lg p-1.5 flex flex-col gap-1 shadow-lg z-20 font-sans">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-medium truncate pr-1">
                {holdingChoice.includes('NEXT') ? 'Holding for Next...' : `${holdingChoice}...`}
              </span>
              <span className="text-slate-300">{holdProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-slate-200 h-full transition-all duration-75 rounded-full"
                style={{ width: `${holdProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Auto-Next Countdown & Answer Evaluation Result Overlay */}
        {autoNextCountdown !== null && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center z-30 font-sans gap-2">
            {/* Prominent Correct / Wrong Answer Banner */}
            {evaluatedResult && (
              <div
                className={`w-full p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold shadow-lg ${
                  evaluatedResult.isCorrect
                    ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200 ring-1 ring-emerald-400/50'
                    : 'bg-rose-950/95 border-rose-500 text-rose-200 ring-1 ring-rose-400/50'
                }`}
              >
                <span className="text-base">{evaluatedResult.isCorrect ? '✓' : '✕'}</span>
                <span className="leading-tight text-center">
                  {evaluatedResult.isCorrect ? 'Correct Answer' : 'Incorrect Choice'}
                </span>
              </div>
            )}

            <div className="flex flex-col items-center gap-0.5">
              <span className="text-slate-200 font-mono text-xs font-semibold">
                Next card in {autoNextCountdown}s
              </span>
            </div>

            <div className="flex items-center gap-1.5 w-full">
              {evaluatedResult && !evaluatedResult.isCorrect && onResetAnswer && (
                <button
                  type="button"
                  onClick={() => {
                    pauseAutoNextTimer();
                    onResetAnswer();
                    setEvaluatedResult(null);
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1"
                  title="Clear wrong answer and try gesturing again"
                >
                  ↺ Try Again
                </button>
              )}
              <button
                type="button"
                onClick={pauseAutoNextTimer}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1 border border-slate-700"
              >
                Pause
              </button>
              <button
                type="button"
                onClick={triggerNextQuestion}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1"
              >
                Next Now →
              </button>
            </div>

            {/* Delay Settings Pills */}
            <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
              <span className="text-slate-400">Delay:</span>
              {[3, 5, 8, 10, 0].map((delayVal) => (
                <button
                  key={delayVal}
                  type="button"
                  onClick={() => setAutoNextDelay(delayVal)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    autoNextDelay === delayVal
                      ? 'bg-slate-100 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {delayVal === 0 ? 'Off' : `${delayVal}s`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If Paused Banner */}
        {isTimerPaused && isAnswered && autoNextCountdown === null && (
          <div className="absolute top-2 left-2 right-2 bg-slate-900/95 border border-slate-700 rounded-lg p-1.5 text-xs font-medium flex items-center justify-between z-20 shadow-md font-sans">
            <div className="flex items-center gap-1.5 truncate pr-1">
              <span className={evaluatedResult?.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                {evaluatedResult?.isCorrect
                  ? `Correct (Option ${evaluatedResult.choiceId})`
                  : `Option ${evaluatedResult?.choiceId} wrong (Correct: ${evaluatedResult?.correctChoiceId})`}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {onResetAnswer && (
                <button
                  type="button"
                  onClick={() => {
                    onResetAnswer();
                    setEvaluatedResult(null);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-700 hover:bg-rose-600 text-white font-bold text-[11px] cursor-pointer"
                  title="Try this card again"
                >
                  ↺ Retry
                </button>
              )}
              <button
                type="button"
                onClick={triggerNextQuestion}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-white text-slate-950 font-semibold text-[11px] cursor-pointer shrink-0"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status banner */}
      <div className="text-xs text-slate-400 font-mono text-center truncate">
        {statusMessage}
      </div>

      {/* Shortcut Buttons */}
      <div className="grid grid-cols-5 gap-1 text-[10px] font-mono text-center">
        <button
          type="button"
          onClick={() => simulateFingers(1)}
          className={`py-1 rounded border cursor-pointer transition-colors ${
            detectedFingers === 1
              ? 'bg-slate-100 text-slate-950 font-bold border-slate-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          1=A
        </button>
        <button
          type="button"
          onClick={() => simulateFingers(2)}
          className={`py-1 rounded border cursor-pointer transition-colors ${
            detectedFingers === 2
              ? 'bg-slate-100 text-slate-950 font-bold border-slate-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          2=B
        </button>
        <button
          type="button"
          onClick={() => simulateFingers(3)}
          className={`py-1 rounded border cursor-pointer transition-colors ${
            detectedFingers === 3
              ? 'bg-slate-100 text-slate-950 font-bold border-slate-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          3=C
        </button>
        <button
          type="button"
          onClick={() => simulateFingers(4)}
          className={`py-1 rounded border cursor-pointer transition-colors ${
            detectedFingers === 4
              ? 'bg-slate-100 text-slate-950 font-bold border-slate-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          4=D
        </button>
        <button
          type="button"
          onClick={() => simulateFingers(5)}
          className={`py-1 rounded border cursor-pointer transition-colors ${
            detectedFingers === 5
              ? 'bg-slate-100 text-slate-950 font-bold border-slate-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 font-bold'
          }`}
        >
          5=Next
        </button>
      </div>

      {/* Gesture Calibration Scanner Modal */}
      <GestureScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          const fresh = loadGestureProfile();
          setCustomProfile(fresh);
          customProfileRef.current = fresh;
        }}
        existingStream={activeStreamRef.current}
        onCalibrationSaved={(newProfile) => {
          setCustomProfile(newProfile);
          customProfileRef.current = newProfile;
          setStatusMessage('Your custom hand gestures have been calibrated!');
        }}
      />
    </div>
  );
};


