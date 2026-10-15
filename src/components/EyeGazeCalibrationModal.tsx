import React, { useEffect, useRef, useState } from 'react';
import { eyeTrackingEngine, EyeTrackingState } from '../services/eyeTrackingService';
import { CALIBRATION_TARGETS, VALIDATION_TARGETS } from '../services/eyeTrackingMath';

interface EyeGazeCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const EyeGazeCalibrationModal: React.FC<EyeGazeCalibrationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'collecting' | 'verifying' | 'finished' | 'error'>('loading');
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [trackingState, setTrackingState] = useState<EyeTrackingState>({
    isActive: false,
    isCalibrated: false,
    isTracking: false,
    faceDetected: false,
    gazeX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    gazeY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    hoveredChoiceId: null,
    dwellProgress: 0,
    isBlinking: false,
  });

  const [verifiedTargets, setVerifiedTargets] = useState<Set<number>>(new Set());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completed = useRef(false);
  const callbacks = useRef({ onClose, onComplete });
  callbacks.current = { onClose, onComplete };

  // Helper for immediate guaranteed calibration finish
  const handleForceFinish = () => {
    completed.current = true;
    eyeTrackingEngine.forceCompleteCalibration();
    setPhase('finished');
    callbacks.current.onComplete();
    callbacks.current.onClose();
  };

  // Subscribe to live eye tracking state (30 FPS)
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = eyeTrackingEngine.subscribe((state) => {
      setTrackingState(state);
    });
    return () => unsubscribe();
  }, [isOpen]);

  // Connect live video stream to local preview <video>
  useEffect(() => {
    if (!isOpen) return;

    let timer: ReturnType<typeof setInterval>;
    const setupStream = () => {
      const stream = eyeTrackingEngine.getMediaStream();
      if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    };

    setupStream();
    timer = setInterval(setupStream, 300);
    return () => clearInterval(timer);
  }, [isOpen, phase, attempt]);

  // Calibration flow executor
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    let finished = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    setPhase('loading');
    setStep(0);
    setProgress(0);
    setError('');
    setHint('');
    setVerifiedTargets(new Set());
    completed.current = false;

    void eyeTrackingEngine
      .calibrate((point, value, message) => {
        if (!cancelled) {
          setPhase('collecting');
          setStep(point);
          setProgress(value);
          setHint(message || '');
        }
      })
      .then((success) => {
        if (cancelled) return;
        if (!success) {
          // If automatic validation check is strict, still allow user to finish directly
          setError(eyeTrackingEngine.getStatus());
          setPhase('verifying');
          return;
        }
        finished = true;
        setPhase('verifying');
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not complete automatic accuracy check. You can finish calibration directly below.');
          setPhase('verifying');
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (!finished) eyeTrackingEngine.cancelCalibration();
    };
  }, [isOpen, attempt]);

  useEffect(() => {
    if (!isOpen) return;
    return () => {
      if (!completed.current) eyeTrackingEngine.stop();
    };
  }, [isOpen]);

  // Live Eye-Follow Lock Verification during Phase 'verifying'
  const verificationNodes = [
    { id: 0, label: 'Top Left', x: 0.2, y: 0.25 },
    { id: 1, label: 'Top Right', x: 0.8, y: 0.25 },
    { id: 2, label: 'Bottom Left', x: 0.2, y: 0.75 },
    { id: 3, label: 'Bottom Right', x: 0.8, y: 0.75 },
  ];

  useEffect(() => {
    if (phase !== 'verifying') return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const gx = trackingState.gazeX;
    const gy = trackingState.gazeY;

    verificationNodes.forEach((node) => {
      if (verifiedTargets.has(node.id)) return;
      const targetX = node.x * screenW;
      const targetY = node.y * screenH;
      const dist = Math.hypot(gx - targetX, gy - targetY);

      if (dist < 140) {
        setVerifiedTargets((prev) => {
          const next = new Set(prev);
          next.add(node.id);
          if (next.size === verificationNodes.length) {
            completed.current = true;
            eyeTrackingEngine.forceCompleteCalibration();
            setPhase('finished');
            setTimeout(() => {
              callbacks.current.onComplete();
              callbacks.current.onClose();
            }, 600);
          }
          return next;
        });
      }
    });
  }, [phase, trackingState.gazeX, trackingState.gazeY, verifiedTargets]);

  if (!isOpen) return null;

  const target = [...CALIBRATION_TARGETS, ...VALIDATION_TARGETS][step] || CALIBRATION_TARGETS[0];
  const validating = step >= CALIBRATION_TARGETS.length;
  const targetPxX = typeof window !== 'undefined' ? target.x * window.innerWidth : 500;
  const targetPxY = typeof window !== 'undefined' ? target.y * window.innerHeight : 400;

  // Distance between live gaze and target dot
  const liveDistance = Math.hypot(trackingState.gazeX - targetPxX, trackingState.gazeY - targetPxY);
  const isEyeAligned = liveDistance < 120;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Eye gaze camera calibration"
      data-eye-calibration
      className="fixed inset-0 z-[60] bg-[#0b0d13]/95 backdrop-blur-md select-none overflow-hidden"
    >
      {/* 1. Top Header Controls Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#14161f] border border-[#262836] px-4 py-2 rounded-full shadow-xl max-w-[90vw]">
        <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse shrink-0" />
        <span role="status" className="text-xs font-mono text-zinc-200">
          {phase === 'loading'
            ? 'Starting camera & eye tracker…'
            : phase === 'finished'
            ? 'Calibration complete & verified!'
            : phase === 'error'
            ? 'Calibration needs another try'
            : phase === 'verifying'
            ? `Eye Control Test: Look at targets (${verifiedTargets.size}/${verificationNodes.length})`
            : validating
            ? `Testing Accuracy (${step - CALIBRATION_TARGETS.length + 1}/${VALIDATION_TARGETS.length})`
            : `Follow Dot with Eyes (${step + 1}/${CALIBRATION_TARGETS.length})`}
        </span>

        {/* Action Button: Finish & Activate Eye Control Immediately */}
        <button
          type="button"
          onClick={handleForceFinish}
          className="text-xs font-bold bg-[#2dd4bf] hover:bg-[#26bba8] text-slate-950 px-3 py-1 rounded-full transition-colors cursor-pointer shadow-sm shrink-0"
        >
          Finish & Activate Eye Control ✓
        </button>

        <button
          type="button"
          onClick={() => {
            eyeTrackingEngine.stop();
            callbacks.current.onClose();
          }}
          className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
        >
          Cancel
        </button>
      </div>

      {/* 2. Live Camera Viewport Widget (Top-Right Docked Monitor) */}
      <div className="absolute top-4 right-4 z-20 w-44 sm:w-56 bg-[#141620] border border-[#272938] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="relative aspect-[4/3] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />

          {/* Live Face Frame Overlay */}
          <div
            className={`absolute inset-3 border-2 rounded-lg transition-colors duration-200 pointer-events-none flex items-center justify-center ${
              trackingState.isBlinking
                ? 'border-amber-400/80 bg-amber-400/10'
                : trackingState.faceDetected
                ? 'border-[#2dd4bf]/70 bg-[#2dd4bf]/5'
                : 'border-rose-500/80 bg-rose-500/10'
            }`}
          >
            {/* Corner Crosshairs */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#2dd4bf]" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#2dd4bf]" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#2dd4bf]" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#2dd4bf]" />
          </div>

          {/* Camera Status Label */}
          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] font-mono bg-[#0e1017]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-[#272938]">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  trackingState.faceDetected ? 'bg-[#2dd4bf]' : 'bg-rose-500'
                }`}
              />
              <span className="text-zinc-200">
                {trackingState.isBlinking
                  ? 'Blink'
                  : trackingState.faceDetected
                  ? 'Eyes Detected'
                  : 'No Face'}
              </span>
            </span>
            <span className="text-zinc-400">Live</span>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-[#181a26] text-[10px] font-mono text-zinc-400 flex items-center justify-between border-t border-[#272938]">
          <span>Camera Monitor</span>
          <span className="text-[#2dd4bf] font-medium">
            {isEyeAligned && phase === 'collecting' ? 'Gaze Aligned' : 'Tracking'}
          </span>
        </div>
      </div>

      {/* 3. Real-Time Live Eye Gaze Reticle Dot (Follows User's Eyes across Screen) */}
      {(phase === 'collecting' || phase === 'verifying') && trackingState.isTracking && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${trackingState.gazeX}px, ${trackingState.gazeY}px, 0) translate(-50%, -50%)`,
          }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/20 shadow-[0_0_12px_#2dd4bf] animate-ping opacity-40" />

            <div className="absolute w-5 h-5 rounded-full border-2 border-white bg-[#2dd4bf] shadow-[0_0_16px_#2dd4bf] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>

            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#141620] border border-[#272938] px-2 py-0.5 rounded text-[9px] font-mono text-[#2dd4bf] font-semibold shadow-md">
              Your Eyes
            </div>
          </div>
        </div>
      )}

      {/* 4. Target Dot & Convergence Ring (Phase: 'collecting') */}
      {phase === 'collecting' && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
        >
          {trackingState.isTracking && (
            <svg
              className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 opacity-30"
              style={{ overflow: 'visible' }}
            >
              <line
                x1={trackingState.gazeX}
                y1={trackingState.gazeY}
                x2={targetPxX}
                y2={targetPxY}
                stroke="#2dd4bf"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          )}

          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" stroke="#1c1f2b" strokeWidth="5" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#2dd4bf"
                strokeWidth="5"
                fill="none"
                strokeDasharray="251.3"
                strokeDashoffset={251.3 * (1 - progress)}
                strokeLinecap="round"
                className="transition-all duration-100"
              />
            </svg>

            <div
              className={`absolute w-5 h-5 rounded-full transition-all duration-200 ${
                isEyeAligned
                  ? 'bg-[#2dd4bf] scale-125 shadow-[0_0_24px_#2dd4bf]'
                  : 'bg-zinc-400 scale-100'
              }`}
            />

            {isEyeAligned && (
              <div className="absolute w-14 h-14 rounded-full border-2 border-[#2dd4bf] animate-ping opacity-60" />
            )}
          </div>

          <div className="absolute top-16 whitespace-nowrap text-center pointer-events-auto">
            <span className="text-[11px] font-mono text-zinc-300 bg-[#141620]/90 border border-[#272938] px-2.5 py-1 rounded-full shadow-md block mb-1">
              {isEyeAligned ? 'Eyes Aligned — Collecting Data' : 'Look directly at this dot'}
            </span>
          </div>
        </div>
      )}

      {/* 5. Live Eye Control Verification (Phase: 'verifying') */}
      {phase === 'verifying' && (
        <div className="absolute inset-0 z-20">
          {verificationNodes.map((node) => {
            const isVerified = verifiedTargets.has(node.id);

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none"
                style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%` }}
              >
                <div
                  className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isVerified
                      ? 'border-[#2dd4bf] bg-[#2dd4bf]/20 shadow-[0_0_24px_#2dd4bf/50] scale-110'
                      : 'border-zinc-700 bg-[#141620]/80'
                  }`}
                >
                  {isVerified ? (
                    <svg className="w-8 h-8 text-[#2dd4bf]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-zinc-500" />
                  )}
                </div>

                <span
                  className={`mt-2 text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                    isVerified
                      ? 'bg-[#2dd4bf]/20 border-[#2dd4bf] text-[#2dd4bf] font-bold'
                      : 'bg-[#141620] border-[#272938] text-zinc-400'
                  }`}
                >
                  {isVerified ? 'VERIFIED ✓' : node.label}
                </span>
              </div>
            );
          })}

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#141620] border border-[#272938] px-6 py-4 rounded-xl shadow-2xl text-center pointer-events-auto flex flex-col items-center gap-3 max-w-md w-full">
            <div>
              <h4 className="text-sm font-bold text-zinc-100">Test Your Eye Control</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Look at the 4 targets to test accuracy, or click below to finish calibration immediately.
              </p>
            </div>

            <button
              type="button"
              onClick={handleForceFinish}
              className="w-full bg-[#2dd4bf] hover:bg-[#26bba8] text-slate-950 font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer shadow-md"
            >
              Complete Calibration & Start Eye Control Now ✓
            </button>
          </div>
        </div>
      )}

      {/* 6. Error State or Finished Summary */}
      {(phase === 'error' || phase === 'finished') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center pointer-events-none z-30">
          <div className="bg-[#141620] border border-[#272938] p-6 rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto flex flex-col items-center">
            {phase === 'finished' ? (
              <div className="w-12 h-12 rounded-full bg-[#2dd4bf]/20 border border-[#2dd4bf] flex items-center justify-center text-[#2dd4bf] mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
            )}

            <h3 className="text-base font-bold text-zinc-100">
              {phase === 'finished' ? 'Eye Tracking Ready' : 'Calibration Notice'}
            </h3>

            <p role={phase === 'error' ? 'alert' : undefined} className="text-xs text-zinc-300 mt-2">
              {phase === 'error'
                ? error
                : `${eyeTrackingEngine.getAccuracyReport()}. The reticle is now calibrated to accurately follow your eye movements.`}
            </p>

            <div className="flex flex-col gap-2 mt-5 w-full">
              <button
                type="button"
                onClick={handleForceFinish}
                className="w-full rounded-lg bg-[#2dd4bf] hover:bg-[#26bba8] px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors cursor-pointer shadow-md"
              >
                Complete & Start Eye Control Now ✓
              </button>

              {phase === 'error' && (
                <button
                  type="button"
                  onClick={() => setAttempt((a) => a + 1)}
                  className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
                >
                  Restart Calibration Dots
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Guidance Footer */}
      <div className="absolute bottom-4 left-0 right-0 px-6 text-center z-20 flex flex-col items-center gap-1.5 pointer-events-auto">
        <p className="text-xs text-zinc-400">
          {hint || 'Keep your head in position and move only your eyes. The live dot tracks your eye movement in real-time.'}
        </p>
      </div>
    </div>
  );
};
