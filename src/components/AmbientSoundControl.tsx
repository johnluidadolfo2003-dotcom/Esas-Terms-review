import React, { useState, useEffect, useRef } from 'react';
import {
  ambientAudioEngine,
  AmbientSoundPresetId,
  AMBIENT_PRESETS,
} from '../services/ambientAudioService';

interface AmbientSoundControlProps {
  compact?: boolean;
  className?: string;
}

export const AmbientSoundControl: React.FC<AmbientSoundControlProps> = ({
  compact = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPresetId, setCurrentPresetId] = useState<AmbientSoundPresetId>('stream');
  const [volume, setVolume] = useState<number>(0.45);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = ambientAudioEngine.subscribe((playing, preset, vol) => {
      setIsPlaying(playing);
      setCurrentPresetId(preset);
      setVolume(vol);
    });
    return unsubscribe;
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activePreset = AMBIENT_PRESETS.find((p) => p.id === currentPresetId) || AMBIENT_PRESETS[0];

  const handleTogglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    ambientAudioEngine.toggle();
  };

  const handleSelectPreset = (presetId: AmbientSoundPresetId) => {
    ambientAudioEngine.setPreset(presetId);
    if (!isPlaying) {
      ambientAudioEngine.start();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    ambientAudioEngine.setVolume(val);
  };

  // Preset SVGs (Clean, minimal, crisp line icons - no emojis)
  const renderPresetIcon = (id: AmbientSoundPresetId) => {
    switch (id) {
      case 'stream':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3.75 15c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
          </svg>
        );
      case 'rain':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 18v2m4-2v3m4-3v2" />
          </svg>
        );
      case 'roof_rain':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9.75-7.5 9.75 7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5V20.25a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V10.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 15.5l-.5 2m4.5-2l-.5 2m4.5-2l-.5 2" />
          </svg>
        );
      case 'wave':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13c3-3 6-3 9 0s6 3 9 0M3 17c3-3 6-3 9 0s6 3 9 0" />
          </svg>
        );
      case 'deep_focus':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        );
      case 'forest_breeze':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21V3m0 0a9 9 0 019 9c0 1.25-.25 2.44-.7 3.52M12 3a9 9 0 00-9 9c0 1.25.25 2.44.7 3.52" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-[#181f2a] border-teal-700/80 text-teal-300'
              : 'bg-[#181a21] border-[#272935] text-zinc-300 hover:text-white hover:bg-[#20222a]'
          }`}
          title="Background sound for study focus"
        >
          {/* Animated Wave Indicator or static icon */}
          {isPlaying ? (
            <span className="flex items-end gap-0.5 h-3.5 w-3.5 justify-center py-0.5">
              <span className="w-0.5 h-3 bg-teal-400 rounded-full animate-pulse" />
              <span className="w-0.5 h-2 bg-teal-400 rounded-full animate-ping" />
              <span className="w-0.5 h-3.5 bg-teal-400 rounded-full animate-pulse" />
            </span>
          ) : (
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}

          <span className="hidden sm:inline font-mono text-[11px]">
            {isPlaying ? activePreset.name : 'Ambience'}
          </span>

          <svg
            className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Quick Play/Pause Action Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`p-1 sm:p-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center justify-center ${
            isPlaying
              ? 'bg-teal-600 border-teal-500 text-white shadow-xs hover:bg-teal-500'
              : 'bg-[#181a21] border-[#272935] text-zinc-400 hover:text-white hover:bg-[#20222a]'
          }`}
          title={isPlaying ? 'Pause ambient background sound' : 'Play ambient background sound'}
          aria-label={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
        >
          {isPlaying ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          )}
        </button>
      </div>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#15171e] border border-[#272935] rounded-xl shadow-2xl p-3.5 z-50 text-zinc-200 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#22242f]">
            <div>
              <div className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                Study Ambience
              </div>
              <p className="text-[10px] text-zinc-400">Natural focus soundscapes</p>
            </div>

            {/* Master Toggle */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer border ${
                isPlaying
                  ? 'bg-teal-600 border-teal-500 text-white'
                  : 'bg-[#1c1e28] border-[#2c303f] text-zinc-300 hover:text-white'
              }`}
            >
              {isPlaying ? 'Sound On' : 'Sound Off'}
            </button>
          </div>

          {/* Sound Presets Selection */}
          <div className="py-2.5 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Natural Soundscape
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {AMBIENT_PRESETS.map((preset) => {
                const isSelected = preset.id === currentPresetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-2 rounded-lg text-left transition-all cursor-pointer flex flex-col gap-0.5 border ${
                      isSelected
                        ? 'bg-[#19222c] border-teal-600/80 text-teal-200'
                        : 'bg-[#181a22] border-[#232632] text-zinc-400 hover:text-zinc-200 hover:bg-[#1d202b]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-zinc-100">
                        {renderPresetIcon(preset.id)}
                        <span className="truncate">{preset.name}</span>
                      </div>
                      {isSelected && isPlaying && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 leading-tight">
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Preset Description */}
            <div className="mt-1 p-2 rounded-md bg-[#111319] border border-[#20232e] text-[10px] text-zinc-400 leading-relaxed font-mono">
              {activePreset.description}
            </div>
          </div>

          {/* Volume Control */}
          <div className="pt-2 border-t border-[#22242f] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-medium">Volume</span>
              <span className="font-mono text-zinc-300 font-semibold">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => ambientAudioEngine.setVolume(volume > 0 ? 0 : 0.45)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                title={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? (
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-4.5l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Ambient volume"
                className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
