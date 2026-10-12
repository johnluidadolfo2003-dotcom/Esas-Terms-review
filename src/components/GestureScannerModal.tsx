import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GestureCalibrationProfile,
  CalibratedGestureData,
  DEFAULT_GESTURES,
  loadGestureProfile,
  saveGestureProfile,
  extractFingerMetrics,
  matchGesture,
  playScanSound,
  FingerState,
} from '../services/gestureCalibration';

interface GestureScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCalibrationSaved?: (profile: GestureCalibrationProfile) => void;
  existingStream?: MediaStream | null;
}

interface StepDefinition {
  id: 'A' | 'B' | 'C' | 'D' | 'NEXT';
  title: string;
  targetChoice: string;
  recommendedCount: number;
  description: string;
  tip: string;
  handIcon: string;
}

const STEPS: StepDefinition[] = [
  {
    id: 'A',
    title: 'Scan Gesture for Option A',
    targetChoice: 'Choice A',
    recommendedCount: 1,
    description: 'Show 1 finger (usually Index finger pointing up) toward the camera.',
    tip: 'Keep other fingers curled or relaxed in your palm.',
    handIcon: '☝️',
  },
  {
    id: 'B',
    title: 'Scan Gesture for Option B',
    targetChoice: 'Choice B',
    recommendedCount: 2,
    description: 'Show 2 fingers (peace / victory sign or index + middle fingers).',
    tip: 'Separate fingers slightly so camera can see both clearly.',
    handIcon: '✌️',
  },
  {
    id: 'C',
    title: 'Scan Gesture for Option C',
    targetChoice: 'Choice C',
    recommendedCount: 3,
    description: 'Show 3 fingers (e.g. index, middle, and ring fingers).',
    tip: 'Face your palm upright toward the webcam.',
    handIcon: '🤟',
  },
  {
    id: 'D',
    title: 'Scan Gesture for Option D',
    targetChoice: 'Choice D',
    recommendedCount: 4,
    description: 'Show 4 fingers (four upright fingers, thumb tucked).',
    tip: 'Keep your 4 fingers vertical and steady.',
    handIcon: '🖖',
  },
  {
    id: 'NEXT',
    title: 'Scan Gesture for Next Question',
    targetChoice: 'Next Question (Skip / Advance)',
    recommendedCount: 5,
    description: 'Show 5 fingers (Open Palm 👋 with all fingers extended).',
    tip: 'This advances you to the next question when you finish reviewing!',
    handIcon: '🖐️',
  },
];

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

export const GestureScannerModal: React.FC<GestureScannerModalProps> = ({
  isOpen,
  onClose,
  onCalibrationSaved,
  existingStream,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [calibratedGestures, setCalibratedGestures] = useState<Record<string, CalibratedGestureData>>(() => {
    const loaded = loadGestureProfile();
    return loaded.gestures;
  });

  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isCapturedJustNow, setIsCapturedJustNow] = useState<boolean>(false);

  // Live detection telemetry
  const [liveFingerState, setLiveFingerState] = useState<FingerState>({
    thumb: false,
    index: false,
    middle: false,
    ring: false,
    pinky: false,
    count: 0,
  });
  const [liveTestMatch, setLiveTestMatch] = useState<{
    choice: string | null;
    confidence: number;
    reason: string;
  }>({
    choice: null,
    confidence: 0,
    reason: '',
  });

  const [cameraStatus, setCameraStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const handsInstanceRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Steady hold scanner tracking
  const holdCountRef = useRef<number>(0);
  const lastMetricsRef = useRef<{ fingerState: FingerState; relativeDistances: number[] } | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = STEPS[currentStepIdx];

  // Stop scanning timer
  const stopScanTimer = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    holdCountRef.current = 0;
    setScanProgress(0);
    setIsScanning(false);
  }, []);

  // Save gesture for current step
  const recordGestureCapture = useCallback(
    (metrics: { fingerState: FingerState; relativeDistances: number[] }) => {
      if (!currentStep) return;

      playScanSound('success');
      setIsCapturedJustNow(true);

      const updatedGesture: CalibratedGestureData = {
        choiceId: currentStep.id,
        label: `${currentStep.targetChoice} (${metrics.fingerState.count} Fingers)`,
        fingerCount: metrics.fingerState.count,
        fingers: {
          thumb: metrics.fingerState.thumb,
          index: metrics.fingerState.index,
          middle: metrics.fingerState.middle,
          ring: metrics.fingerState.ring,
          pinky: metrics.fingerState.pinky,
        },
        relativeDistances: [...metrics.relativeDistances],
        calibratedAt: Date.now(),
      };

      setCalibratedGestures((prev) => ({
        ...prev,
        [currentStep.id]: updatedGesture,
      }));

      stopScanTimer();

      // Automatically advance to next step after brief confirmation
      setTimeout(() => {
        setIsCapturedJustNow(false);
        if (currentStepIdx < STEPS.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          // Finished all steps -> enter Test Playground
          setIsTestMode(true);
        }
      }, 900);
    },
    [currentStep, currentStepIdx, stopScanTimer]
  );

  // Process MediaPipe results
  const processHands = useCallback(
    (results: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.image) {
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      }

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        // Draw connections
        ctx.strokeStyle = '#14b8a6'; // Teal
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

        // Draw landmarks
        for (let i = 0; i < landmarks.length; i++) {
          const lm = landmarks[i];
          const isTip = [4, 8, 12, 16, 20].includes(i);
          ctx.fillStyle = isTip ? '#38bdf8' : '#22d3ee';
          ctx.beginPath();
          ctx.arc(lm.x * canvas.width, lm.y * canvas.height, isTip ? 6 : 3.5, 0, 2 * Math.PI);
          ctx.fill();
        }

        const metrics = extractFingerMetrics(landmarks);
        lastMetricsRef.current = metrics;
        setLiveFingerState(metrics.fingerState);

        // If in Test Mode, evaluate live match against current calibrated gestures
        if (isTestMode) {
          const match = matchGesture(metrics.fingerState, metrics.relativeDistances, {
            version: 1,
            updatedAt: Date.now(),
            gestures: calibratedGestures,
          });
          setLiveTestMatch({
            choice: match.matchedChoice,
            confidence: match.confidence,
            reason: match.matchReason,
          });
        }
        // If in Calibration Step, check if user is holding consistent fingers
        else if (!isCapturedJustNow && currentStep) {
          // If at least 1 finger is detected
          if (metrics.fingerState.count > 0) {
            if (!scanIntervalRef.current) {
              setIsScanning(true);
              holdCountRef.current = 0;

              scanIntervalRef.current = setInterval(() => {
                holdCountRef.current += 8; // approx 1.2s to fill
                const progress = Math.min(100, holdCountRef.current);
                setScanProgress(progress);

                if (progress >= 100) {
                  if (lastMetricsRef.current) {
                    recordGestureCapture(lastMetricsRef.current);
                  }
                }
              }, 80);
            }
          } else {
            stopScanTimer();
          }
        }
      } else {
        // No hand visible
        setLiveFingerState({
          thumb: false,
          index: false,
          middle: false,
          ring: false,
          pinky: false,
          count: 0,
        });
        if (isTestMode) {
          setLiveTestMatch({ choice: null, confidence: 0, reason: 'Hold hand up in front of camera' });
        }
        stopScanTimer();
      }

      ctx.restore();
    },
    [calibratedGestures, currentStep, isCapturedJustNow, isTestMode, recordGestureCapture, stopScanTimer]
  );

  // Initialize camera and MediaPipe
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    const startCamera = async () => {
      setCameraStatus('loading');
      setCameraErrorMsg(null);

      try {
        let stream = existingStream;
        if (!stream || !stream.active) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: false,
          });
        }

        if (isCancelled) return;
        activeStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        // Load scripts
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

        const HandsClass = (window as any).Hands;
        if (HandsClass) {
          const hands = new HandsClass({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });

          handsInstanceRef.current = hands;
          hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6,
          });

          hands.onResults(processHands);

          const loop = async () => {
            if (
              videoRef.current &&
              videoRef.current.readyState >= 2 &&
              handsInstanceRef.current &&
              !isCancelled
            ) {
              try {
                await handsInstanceRef.current.send({ image: videoRef.current });
              } catch {}
            }
            if (!isCancelled) {
              animFrameIdRef.current = requestAnimationFrame(loop);
            }
          };

          animFrameIdRef.current = requestAnimationFrame(loop);
          setCameraStatus('ready');
        }
      } catch (err: any) {
        if (!isCancelled) {
          setCameraStatus('error');
          setCameraErrorMsg(err.message || 'Unable to access webcam for scanning.');
        }
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      stopScanTimer();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      if (handsInstanceRef.current) {
        try {
          handsInstanceRef.current.close();
        } catch {}
        handsInstanceRef.current = null;
      }
      // If we acquired our own stream, stop tracks when modal unmounts
      if (activeStreamRef.current && activeStreamRef.current !== existingStream) {
        activeStreamRef.current.getTracks().forEach((t) => t.stop());
        activeStreamRef.current = null;
      }
    };
  }, [isOpen, existingStream, processHands, stopScanTimer]);

  // Handle Save Profile
  const handleSaveAndClose = () => {
    const profile: GestureCalibrationProfile = {
      version: 1,
      updatedAt: Date.now(),
      gestures: calibratedGestures,
    };
    saveGestureProfile(profile);
    if (onCalibrationSaved) {
      onCalibrationSaved(profile);
    }
    playScanSound('beep');
    onClose();
  };

  // Handle Reset to Default Gestures
  const handleResetDefaults = () => {
    setCalibratedGestures({ ...DEFAULT_GESTURES });
    setCurrentStepIdx(0);
    setIsTestMode(false);
    playScanSound('beep');
  };

  // Manual snapshot button
  const handleManualCapture = () => {
    if (lastMetricsRef.current && lastMetricsRef.current.fingerState.count > 0) {
      recordGestureCapture(lastMetricsRef.current);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-600/50 flex items-center justify-center text-teal-300 text-base">
              🎯
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Scan & Calibrate Hand Gestures
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-teal-950 border border-teal-700/60 text-teal-300">
                  Profile Scanner
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Teach the system your exact natural hand gestures for 100% accurate answering
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-1">
          <div className="flex items-center gap-1">
            {STEPS.map((step, idx) => {
              const isDone = Boolean(calibratedGestures[step.id]?.calibratedAt);
              const isCurrent = !isTestMode && idx === currentStepIdx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setIsTestMode(false);
                    setCurrentStepIdx(idx);
                  }}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-teal-600 text-white font-bold shadow-sm'
                      : isDone
                      ? 'bg-slate-800 text-teal-300 border border-teal-800/60'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{step.id}</span>
                  {isDone && <span className="text-teal-300">✓</span>}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsTestMode(true)}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              isTestMode
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-emerald-300 border border-emerald-800/50 hover:bg-slate-700'
            }`}
          >
            🧪 Test Playground
          </button>
        </div>

        {/* Main Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Top Instruction Box */}
          {!isTestMode && currentStep ? (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl">{currentStep.handIcon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{currentStep.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/50">
                      Step {currentStepIdx + 1} of {STEPS.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-snug">{currentStep.description}</p>
                  <p className="text-[11px] text-teal-400/90 mt-1 italic">💡 {currentStep.tip}</p>
                </div>
              </div>

              {/* Status pill */}
              <div className="shrink-0 text-right">
                {isCapturedJustNow ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold animate-bounce inline-block">
                    ✅ Scanned!
                  </span>
                ) : isScanning ? (
                  <span className="px-2.5 py-1 rounded-full bg-teal-950 border border-teal-500 text-teal-300 text-xs font-bold animate-pulse inline-block">
                    Scanning {scanProgress}%...
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] inline-block">
                    Waiting for hand...
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Test Mode Header */
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                  🧪 Live Gesture Test Playground
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Show any gesture to the camera right now to verify how your calibrated profile recognizes it!
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-emerald-900/60 text-emerald-200 font-mono">
                Active & Calibrated
              </span>
            </div>
          )}

          {/* Camera Viewfinder & Real-Time Tracking Canvas */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Non-blocking loading indicator in corner that doesn't cover camera */}
            {cameraStatus === 'loading' && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-slate-300 text-[11px] flex items-center gap-1.5 z-20 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-teal-400 border-t-transparent animate-spin"></span>
                <span>Connecting camera...</span>
              </div>
            )}

            {cameraStatus === 'error' && (
              <div className="p-4 text-center max-w-md z-10">
                <p className="text-rose-400 text-xs font-semibold">{cameraErrorMsg}</p>
                <p className="text-slate-400 text-[11px] mt-1">
                  Please enable camera access or open the app in a direct tab.
                </p>
              </div>
            )}

            {/* Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* Landmark Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none"
            />

            {/* Target reticle / Hand Placement Guide box */}
            <div className="absolute inset-8 sm:inset-10 border-2 border-dashed border-teal-500/30 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-2">
              <span className="text-[10px] uppercase font-mono text-teal-400/60 bg-slate-950/70 px-2 py-0.5 rounded">
                Keep hand inside guide area
              </span>
              <span className="text-[10px] text-teal-400/40">Hand Landmark Mesh</span>
            </div>

            {/* Live Finger Detection HUD Badge */}
            <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 flex flex-col gap-1 z-20 shadow-lg text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-bold">Detected Fingers:</span>
                <span className="px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 font-extrabold text-xs">
                  {liveFingerState.count}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px]">
                <span className={`px-1 rounded ${liveFingerState.thumb ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                  Thumb
                </span>
                <span className={`px-1 rounded ${liveFingerState.index ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                  Index
                </span>
                <span className={`px-1 rounded ${liveFingerState.middle ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                  Middle
                </span>
                <span className={`px-1 rounded ${liveFingerState.ring ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                  Ring
                </span>
                <span className={`px-1 rounded ${liveFingerState.pinky ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                  Pinky
                </span>
              </div>
            </div>

            {/* Calibration Scanning Progress Bar */}
            {!isTestMode && isScanning && (
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-teal-500 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-xl z-20">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-teal-300 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                    Calibrating {currentStep?.targetChoice}... Keep steady!
                  </span>
                  <span className="text-slate-200 font-bold">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-400 h-full transition-all duration-75 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Test Mode Real-Time Recognition Overlay */}
            {isTestMode && (
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-emerald-500 rounded-xl p-3 flex items-center justify-between shadow-xl z-20">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500 flex items-center justify-center text-lg font-bold text-emerald-300">
                    {liveTestMatch.choice || '—'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      {liveTestMatch.choice
                        ? `Recognized: Option ${liveTestMatch.choice}`
                        : 'Hold up any gesture'}
                      {liveTestMatch.confidence > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                          {liveTestMatch.confidence}% match
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {liveTestMatch.reason || 'Place hand in frame'}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  Using Your Scanned Profile
                </div>
              </div>
            )}
          </div>

          {/* Calibrated Gestures Table / Summary Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">
                Your Calibrated Gesture Map
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {STEPS.map((step) => {
                const data = calibratedGestures[step.id];
                const isCustom = Boolean(data?.calibratedAt);
                return (
                  <div
                    key={step.id}
                    className={`p-2 rounded-lg border flex flex-col justify-between ${
                      step.id === currentStep?.id && !isTestMode
                        ? 'border-teal-500 bg-teal-950/40'
                        : isCustom
                        ? 'border-emerald-700/60 bg-emerald-950/20'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 font-mono">
                        {step.id}
                      </span>
                      <span className="text-[10px]">{step.handIcon}</span>
                    </div>

                    <div className="mt-1">
                      <div className="text-[11px] text-slate-300 font-medium">
                        {data ? `${data.fingerCount} Finger${data.fingerCount > 1 ? 's' : ''}` : 'Default'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isCustom ? 'Custom Scanned' : 'Standard'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTestMode(false);
                        const idx = STEPS.findIndex((s) => s.id === step.id);
                        if (idx !== -1) setCurrentStepIdx(idx);
                      }}
                      className="mt-1.5 text-[10px] text-teal-400 hover:text-teal-300 text-left font-mono cursor-pointer"
                    >
                      {isCustom ? 'Re-scan ↺' : 'Scan +'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2">
          {!isTestMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualCapture}
                disabled={liveFingerState.count === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Manually capture current hand pose right now without waiting for steady hold timer"
              >
                📸 Capture Now
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentStepIdx < STEPS.length - 1) {
                    setCurrentStepIdx((prev) => prev + 1);
                  } else {
                    setIsTestMode(true);
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Skip Step →
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsTestMode(false);
                setCurrentStepIdx(0);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              ← Back to Scanning Steps
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              ✓ Save & Use Gestures
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
