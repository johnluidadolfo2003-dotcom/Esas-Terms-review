import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GestureScannerModal } from './GestureScannerModal';
import {
  GestureCalibrationProfile,
  loadGestureProfile,
  matchGesture,
  extractFingerMetrics,
  hasCustomCalibration,
} from '../services/gestureCalibration';

interface HandGestureControllerProps {
  isActive: boolean;
  onClose: () => void;
  onSelectChoice: (choiceId: string) => void;
  onNext: () => void;
  isAnswered: boolean;
  currentQuestionId: string;
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
  onNext,
  isAnswered,
  currentQuestionId,
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

  const holdingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoNextTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentHoldChoiceRef = useRef<string | null>(null);
  const holdCountRef = useRef<number>(0);
  const lastSelectedQuestionIdRef = useRef<string | null>(null);
  const isAnsweredRef = useRef<boolean>(isAnswered);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const handsInstanceRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  isAnsweredRef.current = isAnswered;

  // Clear hold timer
  const clearHoldTimer = useCallback(() => {
    if (holdingTimerRef.current) {
      clearInterval(holdingTimerRef.current);
      holdingTimerRef.current = null;
    }
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
    setStatusMessage('Auto-advance paused ⏸️. Read & analyze at your own pace!');
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
    onNext();
  }, [cancelAutoNextTimer, onNext]);

  // Reset timers on new question
  useEffect(() => {
    if (lastSelectedQuestionIdRef.current !== currentQuestionId) {
      clearHoldTimer();
      cancelAutoNextTimer();
      lastSelectedQuestionIdRef.current = currentQuestionId;
      setStatusMessage('Show 1, 2, 3, 4 fingers for A, B, C, D (or 5 fingers 👋 for Next)');
    }
  }, [currentQuestionId, clearHoldTimer, cancelAutoNextTimer]);

  // Trigger choice selection & start auto next countdown (default 5.0 seconds)
  const triggerChoiceSelection = useCallback(
    (choiceId: string) => {
      clearHoldTimer();
      cancelAutoNextTimer();
      setStatusMessage(`Selected Choice ${choiceId}! Evaluated answer.`);
      onSelectChoice(choiceId);

      if (autoNextDelay > 0) {
        let timeLeft = autoNextDelay;
        setAutoNextCountdown(timeLeft);
        setIsTimerPaused(false);

        autoNextTimerRef.current = setInterval(() => {
          timeLeft -= 0.1;
          if (timeLeft <= 0) {
            clearAutoNextTimer();
            setAutoNextCountdown(null);
            onNext();
          } else {
            setAutoNextCountdown(Number(timeLeft.toFixed(1)));
          }
        }, 100);
      } else {
        setStatusMessage(`Selected Choice ${choiceId}! (Auto-next is OFF. Show 5 fingers 👋 or click Next when ready)`);
      }
    },
    [clearHoldTimer, cancelAutoNextTimer, clearAutoNextTimer, autoNextDelay, onSelectChoice, onNext]
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

        // If calibration scanner modal is currently open, do not trigger background quiz actions
        if (isScannerOpen) {
          clearHoldTimer();
          ctx.restore();
          return;
        }

        // Process hold gesture:
        // Case 1: Question not answered yet, hold 1-4 fingers to select A, B, C, D
        if (!isAnsweredRef.current && mappedChoice && mappedChoice !== 'NEXT') {
          if (currentHoldChoiceRef.current !== mappedChoice) {
            clearHoldTimer();
            currentHoldChoiceRef.current = mappedChoice;
            setHoldingChoice(mappedChoice);
            holdCountRef.current = 0;

            holdingTimerRef.current = setInterval(() => {
              holdCountRef.current += 10;
              setHoldProgress(Math.min(holdCountRef.current, 100));

              if (holdCountRef.current >= 100) {
                const choiceToTrigger = currentHoldChoiceRef.current;
                if (choiceToTrigger && choiceToTrigger !== 'NEXT') {
                  triggerChoiceSelection(choiceToTrigger);
                }
              }
            }, 50);
          }
        }
        // Case 2: Show 5 fingers (Open Palm 👋) to advance to Next Question immediately
        else if (mappedChoice === 'NEXT') {
          if (currentHoldChoiceRef.current !== 'NEXT') {
            clearHoldTimer();
            currentHoldChoiceRef.current = 'NEXT';
            setHoldingChoice('NEXT Question 👋');
            holdCountRef.current = 0;

            holdingTimerRef.current = setInterval(() => {
              holdCountRef.current += 20; // 0.5s hold for Next
              setHoldProgress(Math.min(holdCountRef.current, 100));

              if (holdCountRef.current >= 100) {
                triggerNextQuestion();
              }
            }, 50);
          }
        } else if (!mappedChoice) {
          clearHoldTimer();
        }
      } else {
        if (results.image) {
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        }
        setDetectedFingers(0);
        clearHoldTimer();
      }

      ctx.restore();
    },
    [clearHoldTimer, triggerChoiceSelection, triggerNextQuestion, isScannerOpen]
  );

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
      setStatusMessage('Camera feed active! Loading gesture recognition AI...');

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

          handsInstance.onResults(processHandResults);

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
          setStatusMessage('Show 1, 2, 3, or 4 fingers to select A, B, C, or D');
        }
      } catch (scriptErr) {
        console.warn('MediaPipe hands script warning:', scriptErr);
        setStatusMessage('Camera active! Show fingers or click 1-4 buttons.');
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
      const choiceMap: Record<number, string> = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
      const mappedChoice = choiceMap[count];
      if (!isAnsweredRef.current && mappedChoice) {
        if (currentHoldChoiceRef.current !== mappedChoice) {
          clearHoldTimer();
          currentHoldChoiceRef.current = mappedChoice;
          setHoldingChoice(mappedChoice);
          holdCountRef.current = 0;

          holdingTimerRef.current = setInterval(() => {
            holdCountRef.current += 10;
            setHoldProgress(Math.min(holdCountRef.current, 100));

            if (holdCountRef.current >= 100) {
              const choiceToTrigger = currentHoldChoiceRef.current;
              if (choiceToTrigger) {
                triggerChoiceSelection(choiceToTrigger);
              }
            }
          }, 50);
        }
      }
    },
    [clearHoldTimer, triggerChoiceSelection, triggerNextQuestion]
  );

  // Keyboard shortcut listener (1, 2, 3, 4, 5)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        simulateFingers(parseInt(e.key, 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, simulateFingers]);

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
            className={`w-2.5 h-2.5 rounded-full ${
              permissionState === 'granted'
                ? 'bg-teal-400 animate-pulse'
                : permissionState === 'requesting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-rose-500'
            }`}
          ></span>
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Hands-Free Camera Controller
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="text-xs px-2 py-0.5 rounded border border-teal-600/70 bg-teal-950/70 hover:bg-teal-900 text-teal-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="Scan & calibrate your proper hand gestures for 100% accurate recognition"
          >
            <span>🎯 Scan</span>
            {customProfile.updatedAt > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Custom calibrated profile active"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`text-xs px-2 py-0.5 rounded border cursor-pointer font-bold transition-colors ${
              showGuide
                ? 'bg-teal-600 border-teal-500 text-white'
                : 'bg-slate-800 border-slate-700 text-teal-300 hover:bg-slate-700'
            }`}
            title="Toggle Step-by-step Hand Gesture Guide"
          >
            {showGuide ? 'Close Guide' : '❓ Guide'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
          >
            Close ✕
          </button>
        </div>
      </div>

      {/* Video / Canvas viewport */}
      <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* Live Camera Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${
            permissionState === 'granted' ? 'block' : 'hidden'
          }`}
        />

        {/* Hand Landmark Skeleton Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none ${
            permissionState === 'granted' ? 'block' : 'hidden'
          }`}
        />

        {/* Interactive Step-by-Step Hand Gesture Guide Overlay */}
        {showGuide && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs p-3 flex flex-col justify-between text-left text-xs z-30 overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
              <span className="font-bold text-teal-300 text-xs flex items-center gap-1">
                ✋ Wireless Hand Gestures Guide
              </span>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white text-[11px] px-1.5 py-0.5 rounded bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-1.5 text-[11px] text-slate-300 leading-snug">
              <p><strong>0. 🎯 Scan Gestures First:</strong> Tap <strong>🎯 Scan</strong> anytime to let the AI calibrate to your hands!</p>
              <p><strong>1. Select Answer:</strong> Point fingers at the camera:</p>
              <ul className="pl-3 list-disc text-teal-300 font-mono text-[10px] space-y-0.5">
                <li>☝️ <strong>1 Finger</strong> = Option <strong>A</strong></li>
                <li>✌️ <strong>2 Fingers</strong> = Option <strong>B</strong></li>
                <li>🤟 <strong>3 Fingers</strong> = Option <strong>C</strong></li>
                <li>🖐️ <strong>4 Fingers</strong> = Option <strong>D</strong></li>
              </ul>
              <p><strong>2. Answer Evaluation:</strong> Hold 1 second to lock in. Correct answer lights up <strong>Green</strong>, wrong choice turns <strong>Red</strong> with full explanation.</p>
              <p><strong>3. Review & Analyze Pace:</strong> You have <strong>5 seconds</strong> to analyze. Tap <strong>⏸️ Pause Timer</strong> to stop the clock!</p>
              <p><strong>4. Next Question:</strong> Show <strong>5 Fingers 👋 (Open Palm)</strong> or click Next anytime when ready.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-1 w-full py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] text-center cursor-pointer"
            >
              Got it, start studying!
            </button>
          </div>
        )}

        {/* Permission Request Dialog / Overlay */}
        {(permissionState === 'prompt' || permissionState === 'requesting') && (
          <div className="absolute inset-0 bg-slate-950 p-3.5 flex flex-col items-center justify-center text-center gap-2 z-10 overflow-y-auto">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-100 text-xs font-bold">Wireless Camera Gestures</span>
              <span className="text-slate-400 text-[11px] leading-snug">
                Select answer choices wirelessly (1 finger = A, 2 = B, 3 = C, 4 = D, 5 = Next 👋).
              </span>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <button
                type="button"
                onClick={handleRequestPermission}
                disabled={permissionState === 'requesting'}
                className="w-full px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                {permissionState === 'requesting' ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Requesting Camera...
                  </>
                ) : (
                  '📷 Turn On Camera'
                )}
              </button>

              <button
                type="button"
                onClick={async () => {
                  await handleRequestPermission();
                  setIsScannerOpen(true);
                }}
                className="w-full px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-teal-700/60 text-teal-300 font-semibold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                title="Scan and calibrate your hand gestures first"
              >
                🎯 Scan My Gestures First (Recommended)
              </button>

              {typeof window !== 'undefined' && window.self !== window.top && (
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 font-semibold text-[11px] transition-colors flex items-center justify-center gap-1 text-center"
                  title="Open app in a full browser tab where camera permission is directly allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Open Direct Tab for Camera
                </a>
              )}
            </div>
          </div>
        )}

        {/* Permission Denied Error State */}
        {permissionState === 'denied' && (
          <div className="absolute inset-0 bg-slate-950 p-2.5 flex flex-col items-center justify-center text-center gap-1.5 z-10 overflow-y-auto">
            <span className="text-rose-400 text-[11px] font-semibold leading-snug">{cameraError}</span>
            <div className="text-slate-300 text-[10px] bg-slate-900 border border-slate-800 rounded p-1.5 leading-tight text-left w-full">
              <strong>If camera is blocked by iframe or browser:</strong><br />
              • Click <strong>Open Direct Tab</strong> below (recommended).<br />
              • Or click 🔒/📷 icon in browser address bar → set Camera to <em>Allow</em>.<br />
              • Or use 1-5 gesture buttons below.
            </div>
            <div className="flex items-center gap-1.5 w-full">
              <button
                type="button"
                onClick={handleRequestPermission}
                className="flex-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs text-center"
              >
                Retry Camera
              </button>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 font-bold text-[11px] transition-colors text-center"
              >
                Open Direct Tab ↗
              </a>
            </div>
          </div>
        )}

        {/* Active Detected Fingers Badge */}
        {detectedFingers > 0 && (
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-teal-300 font-mono text-xs font-bold shadow-md z-20 flex items-center gap-1.5">
            <span>
              {liveMatchedChoice === 'NEXT'
                ? 'Open Palm → Next 👋'
                : liveMatchedChoice
                ? `${detectedFingers}F → Choice ${liveMatchedChoice}`
                : `${detectedFingers} Finger${detectedFingers > 1 ? 's' : ''}`}
            </span>
            {customProfile.updatedAt > 0 && liveConfidence > 0 && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-normal">
                {liveConfidence}%
              </span>
            )}
          </div>
        )}

        {/* Hold Gesture Meter */}
        {holdingChoice && holdProgress > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 border border-slate-700 rounded-lg p-1.5 flex flex-col gap-1 shadow-lg z-20 font-sans">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-teal-300 font-bold">
                {holdingChoice === 'NEXT Question 👋' ? 'Advancing Next...' : `Holding Choice ${holdingChoice}...`}
              </span>
              <span className="text-slate-300">{holdProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-teal-400 h-full transition-all duration-75 rounded-full"
                style={{ width: `${holdProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Auto-Next Countdown & Pause Overlay */}
        {autoNextCountdown !== null && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center z-30 font-sans gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-teal-300 font-mono text-base font-extrabold animate-pulse">
                Advancing in {autoNextCountdown}s...
              </span>
              <span className="text-slate-300 text-[11px]">
                Answer evaluated! Take time to analyze.
              </span>
            </div>

            <div className="flex items-center gap-1.5 w-full">
              <button
                type="button"
                onClick={pauseAutoNextTimer}
                className="flex-1 py-1 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1"
                title="Pause auto-advance timer so you can read and analyze the question as long as you want"
              >
                ⏸️ Pause Timer
              </button>
              <button
                type="button"
                onClick={triggerNextQuestion}
                className="flex-1 py-1 px-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1"
                title="Go directly to next question"
              >
                Next Now →
              </button>
            </div>

            {/* Delay Settings Pills */}
            <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
              <span className="text-slate-400">Timer Speed:</span>
              {[3, 5, 8, 10, 0].map((delayVal) => (
                <button
                  key={delayVal}
                  type="button"
                  onClick={() => setAutoNextDelay(delayVal)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    autoNextDelay === delayVal
                      ? 'bg-teal-500 text-slate-950 font-bold'
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
          <div className="absolute top-2 left-2 right-2 bg-amber-950/90 border border-amber-600/80 text-amber-200 rounded-lg p-1.5 text-[11px] font-medium flex items-center justify-between z-20 shadow-md font-sans">
            <span>⏸️ Paused (Read at your pace)</span>
            <button
              type="button"
              onClick={triggerNextQuestion}
              className="px-2 py-0.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Status banner */}
      <div className="text-[10px] text-slate-400 font-mono text-center truncate">
        {statusMessage}
      </div>

      {/* Legend / Virtual Gesture Simulation Buttons */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-slate-400 text-center font-mono">
          Show fingers, or click/press 1-5:
        </span>
        <div className="grid grid-cols-5 gap-0.5 text-[9px] font-mono text-center">
          <button
            type="button"
            onClick={() => simulateFingers(1)}
            className={`p-1 rounded border cursor-pointer transition-colors ${
              detectedFingers === 1
                ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Simulate 1 Finger (Choice A)"
          >
            1=A
          </button>
          <button
            type="button"
            onClick={() => simulateFingers(2)}
            className={`p-1 rounded border cursor-pointer transition-colors ${
              detectedFingers === 2
                ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Simulate 2 Fingers (Choice B)"
          >
            2=B
          </button>
          <button
            type="button"
            onClick={() => simulateFingers(3)}
            className={`p-1 rounded border cursor-pointer transition-colors ${
              detectedFingers === 3
                ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Simulate 3 Fingers (Choice C)"
          >
            3=C
          </button>
          <button
            type="button"
            onClick={() => simulateFingers(4)}
            className={`p-1 rounded border cursor-pointer transition-colors ${
              detectedFingers === 4
                ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Simulate 4 Fingers (Choice D)"
          >
            4=D
          </button>
          <button
            type="button"
            onClick={() => simulateFingers(5)}
            className={`p-1 rounded border cursor-pointer transition-colors ${
              detectedFingers === 5
                ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-teal-400 hover:bg-slate-800 font-bold'
            }`}
            title="Simulate 5 Fingers (Next 👋)"
          >
            5=Next👋
          </button>
        </div>
      </div>

      {/* Gesture Calibration Scanner Modal */}
      <GestureScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
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


