import React from 'react';
import { EyeTrackingState, eyeTrackingEngine } from '../services/eyeTrackingService';

interface EyeGazeReticleProps {
  trackingState: EyeTrackingState;
  onOpenCalibration?: () => void;
  onToggleActive: () => void;
}

export const EyeGazeReticle: React.FC<EyeGazeReticleProps> = ({
  trackingState,
  onToggleActive,
}) => {
  if (!trackingState.isActive) return null;

  const { activeSector, dwellProgress, isBlinking } = trackingState;

  const handleReZero = () => {
    eyeTrackingEngine.autoZeroBaseline(600);
  };

  return (
    <>
      {/* Active Sector Visual Feedback HUD Overlay */}
      {activeSector && activeSector !== 'CENTER' && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
          style={{
            left: `${trackingState.gazeX}px`,
            top: `${trackingState.gazeY}px`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Glowing active sector badge */}
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold shadow-[0_0_20px_#2dd4bf/50] ${
                isBlinking
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                  : 'bg-[#14161d]/90 border-[#2dd4bf] text-[#2dd4bf]'
              }`}
            >
              <span>👁</span>
              <span>{activeSector === 'NEXT' ? 'Next Card →' : `Option ${activeSector}`}</span>
            </div>

            {/* Circular Dwell Meter */}
            {dwellProgress > 0 && (
              <svg
                className="absolute -top-3 -left-3 w-16 h-16 -rotate-90 pointer-events-none"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#181a21"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#2dd4bf"
                  strokeWidth="3.5"
                  fill="none"
                  strokeDasharray="163.36"
                  strokeDashoffset={163.36 * (1 - dwellProgress)}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Compact Floating Status Pill & Instant Re-Zero Button */}
      <div className="fixed bottom-3 right-3 z-40 bg-[#14161d]/95 border border-[#272935] backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl text-xs font-mono select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-pulse" />
        <span className="text-zinc-200 font-semibold">Eye Gaze Active</span>

        {activeSector && activeSector !== 'CENTER' && (
          <span className="px-1.5 py-0.5 rounded bg-[#2dd4bf]/20 text-[#2dd4bf] font-bold border border-[#2dd4bf]/40">
            {activeSector}
          </span>
        )}

        <div className="flex items-center gap-1.5 ml-1 border-l border-[#272935] pl-2">
          <button
            type="button"
            onClick={handleReZero}
            className="px-2 py-0.5 rounded bg-[#1e202a] hover:bg-[#282b38] border border-[#2f3242] text-[#2dd4bf] text-[11px] font-bold transition-colors cursor-pointer"
            title="Look at center of screen and click to instant re-zero eye center"
          >
            🎯 Re-Zero
          </button>
          <button
            type="button"
            onClick={onToggleActive}
            className="text-zinc-500 hover:text-rose-400 text-xs px-1 cursor-pointer"
            title="Turn off eye tracking"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
};
