import React from 'react';
import { eyeTrackingEngine, EyeTrackingState } from '../services/eyeTrackingService';

interface EyeGazeReticleProps {
  trackingState: EyeTrackingState;
  onOpenCalibration: () => void;
  onToggleActive: () => void;
  onShortCheck?:()=>void;
  onMagnify?:()=>void;
}

export const EyeGazeReticle: React.FC<EyeGazeReticleProps> = ({
  trackingState,
  onOpenCalibration,
  onToggleActive,
  onShortCheck,onMagnify,
}) => {
  if (!trackingState.isActive) return null;

  const { gazeX, gazeY, hoveredChoiceId, dwellProgress, isBlinking } = trackingState;

  return (
    <>
      {/* 1. Floating Screen Gaze Reticle */}
      {trackingState.isTracking && <div
        className="fixed pointer-events-none z-[70]"
        style={{
          left: 0, top: 0,
          transform: `translate3d(${gazeX}px, ${gazeY}px, 0) translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      >
        {/* Reticle Target Ring */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-7 h-7 rounded-full border transition-all duration-150 flex items-center justify-center ${
              hoveredChoiceId
                ? 'border-[#2dd4bf] bg-[#2dd4bf]/20 shadow-[0_0_16px_#2dd4bf]'
                : isBlinking
                ? 'border-rose-400 bg-rose-500/20 scale-90'
                : 'border-[#2dd4bf]/60 bg-[#2dd4bf]/10 shadow-[0_0_8px_#2dd4bf/30]'
            }`}
          >
            {/* Center pinpoint */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
          </div>

          {/* Dwell Progress Ring around reticle */}
          {hoveredChoiceId && dwellProgress > 0 && (
            <svg
              className="absolute -top-2 -left-2 w-11 h-11 -rotate-90 pointer-events-none"
              viewBox="0 0 44 44"
            >
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#181a21"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#2dd4bf"
                strokeWidth="3"
                fill="none"
                strokeDasharray="113.1"
                strokeDashoffset={113.1 * (1 - dwellProgress)}
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>}

      {/* 2. Compact Bottom Status Floating Pill */}
      <div className="fixed bottom-3 right-3 z-[70] bg-[#14161d]/90 border border-[#272935] backdrop-blur-md px-2.5 py-1.5 rounded-lg flex flex-wrap max-w-[95vw] items-center gap-2 shadow-lg text-xs font-mono select-none">
        <span className={`w-2 h-2 rounded-full ${trackingState.isTracking ? 'bg-[#2dd4bf]' : 'bg-amber-400'}`} />
        <span role="status" className="text-zinc-300 font-medium max-w-[200px]">{trackingState.status || (trackingState.isTracking ? 'Eye Gaze Active' : 'Tracking paused')}</span>

        {hoveredChoiceId && (
          <span className="px-1.5 py-0.2 rounded bg-[#2dd4bf]/20 text-[#2dd4bf] font-bold border border-[#2dd4bf]/50">
            {hoveredChoiceId === 'NEXT' ? 'Next' : `Option ${hoveredChoiceId}`}
          </span>
        )}

        <button type="button" onClick={()=>{if(trackingState.isPaused)eyeTrackingEngine.resume();else eyeTrackingEngine.pause();}} className="underline text-[10px]">{trackingState.isPaused?'Resume':'Pause'}</button>
        {onShortCheck&&<button type="button" onClick={onShortCheck} className="underline text-[10px]">Short check</button>}
        {onMagnify&&<button type="button" onClick={onMagnify} className="underline text-[10px]">Larger targets</button>}
        <div className="flex items-center gap-1 ml-1 border-l border-[#272935] pl-1.5">
          <button
            type="button"
            onClick={onOpenCalibration}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 cursor-pointer underline"
            title="Recalibrate eyes"
          >
            Recalibrate
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
