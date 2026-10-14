import React, { useState, useEffect } from 'react';
import { eyeTrackingEngine } from '../services/eyeTrackingService';

interface EyeGazeCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const CALIBRATION_POSITIONS = [
  { label: 'Center', x: 50, y: 50 },
  { label: 'Choice A', x: 28, y: 36 },
  { label: 'Choice B', x: 72, y: 36 },
  { label: 'Choice C', x: 28, y: 66 },
  { label: 'Choice D', x: 72, y: 66 },
];

export const EyeGazeCalibrationModal: React.FC<EyeGazeCalibrationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [pointProgress, setPointProgress] = useState<number>(0);
  const [isStarting, setIsStarting] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setPointProgress(0);
      setIsStarting(true);
      setIsFinished(false);
      return;
    }

    let isCancelled = false;

    const runCalibration = async () => {
      setIsStarting(false);
      const success = await eyeTrackingEngine.calibrate((pointIndex, progress) => {
        if (!isCancelled) {
          setCurrentStep(pointIndex);
          setPointProgress(progress);
        }
      });

      if (!isCancelled && success) {
        setIsFinished(true);
        setTimeout(() => {
          onComplete();
          onClose();
        }, 800);
      }
    };

    runCalibration();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, onComplete, onClose]);

  if (!isOpen) return null;

  const activePos = CALIBRATION_POSITIONS[currentStep] || CALIBRATION_POSITIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1015]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none">
      {/* Top minimal status */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#181a21] border border-[#272935] px-4 py-2 rounded-full shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-ping" />
        <span className="text-xs font-mono font-medium text-zinc-200">
          {isFinished
            ? 'Calibrated Successfully'
            : isStarting
            ? 'Starting Camera...'
            : `Look at the dot (${currentStep + 1}/5)`}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200 text-xs font-mono ml-2 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Target Dot */}
      {!isFinished ? (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none flex items-center justify-center"
          style={{
            left: `${activePos.x}%`,
            top: `${activePos.y}%`,
          }}
        >
          {/* Outer countdown ring */}
          <svg className="w-20 h-20 -rotate-90 pointer-events-none" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="#222733"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="#2dd4bf"
              strokeWidth="4"
              fill="none"
              strokeDasharray="213.6"
              strokeDashoffset={213.6 * (1 - pointProgress)}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>

          {/* Glowing central target */}
          <div className="absolute w-5 h-5 rounded-full bg-[#2dd4bf] shadow-[0_0_24px_#2dd4bf] animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-[#2dd4bf]/20 border border-[#2dd4bf] flex items-center justify-center text-[#2dd4bf] text-2xl shadow-[0_0_30px_#2dd4bf/40]">
            ✓
          </div>
          <span className="text-sm font-bold text-zinc-100">Ready! Eyes Tracking Active</span>
        </div>
      )}

      {/* Bottom hint */}
      <div className="absolute bottom-6 text-[11px] font-mono text-zinc-500">
        One-time calibration · Saved automatically
      </div>
    </div>
  );
};
