import React, { useEffect, useState } from 'react';
import { eyeTrackingEngine } from '../services/eyeTrackingService';

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
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsDone(false);
      return;
    }

    const startAutoZero = async () => {
      const started = await eyeTrackingEngine.start();
      if (started) {
        eyeTrackingEngine.autoZeroBaseline(800);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            onComplete();
            onClose();
          }, 400);
        }, 850);
      } else {
        onClose();
      }
    };

    startAutoZero();
  }, [isOpen, onComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1015]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none">
      {/* Top minimal status */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#181a21] border border-[#272935] px-4 py-2 rounded-full shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-ping" />
        <span className="text-xs font-mono font-medium text-zinc-200">
          {isDone ? 'Auto-Zero Complete' : 'Look at center dot to calibrate'}
        </span>
      </div>

      {/* Target Dot */}
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-[#2dd4bf]/40 animate-ping absolute" />
        <div className="w-6 h-6 rounded-full bg-[#2dd4bf] shadow-[0_0_30px_#2dd4bf] flex items-center justify-center font-mono text-xs font-bold text-zinc-950">
          🎯
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-6 text-[11px] font-mono text-zinc-500">
        Glance Up-Left (A), Up-Right (B), Down-Left (C), Down-Right (D) to choose answers
      </div>
    </div>
  );
};
