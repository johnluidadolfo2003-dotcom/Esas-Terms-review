import React, { useState, useEffect } from 'react';

const PASSCODE_STORAGE_KEY = 'esas_reviewer_passcode';
const UNLOCKED_SESSION_KEY = 'esas_reviewer_unlocked';

export function getEffectivePassword(): string {
  const envPass = (import.meta as any).env?.VITE_APP_PASSWORD?.trim();
  if (envPass) return envPass;

  const localPass = localStorage.getItem(PASSCODE_STORAGE_KEY)?.trim();
  if (localPass) return localPass;

  return 'luidgwapo';
}

export function isAppLocked(): boolean {
  return sessionStorage.getItem(UNLOCKED_SESSION_KEY) !== 'true';
}

export function lockAppNow(): void {
  sessionStorage.removeItem(UNLOCKED_SESSION_KEY);
  window.location.reload();
}

export function setCustomAppPasscode(newPass: string | null): void {
  if (!newPass || !newPass.trim()) {
    localStorage.removeItem(PASSCODE_STORAGE_KEY);
  } else {
    localStorage.setItem(PASSCODE_STORAGE_KEY, newPass.trim());
    sessionStorage.setItem(UNLOCKED_SESSION_KEY, 'true');
  }
}

interface AppLockScreenProps {
  onUnlock: () => void;
}

export function AppLockScreen({ onUnlock }: AppLockScreenProps) {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetPass = getEffectivePassword();

    if (inputVal.trim() === targetPass) {
      sessionStorage.setItem(UNLOCKED_SESSION_KEY, 'true');
      setErrorMsg('');
      onUnlock();
    } else {
      setErrorMsg('Incorrect password');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center p-4 font-sans select-none">
      <div
        className={`w-full max-w-xs transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="password"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Password"
              autoFocus
              className="w-full bg-slate-900/80 border border-slate-700/80 text-zinc-100 placeholder-slate-500 rounded-xl px-4 py-3 text-center text-sm shadow-2xl backdrop-blur-md focus:outline-none focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-all"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 text-center font-medium">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

interface PasscodeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasscodeSettingsModal({ isOpen, onClose }: PasscodeSettingsModalProps) {
  const currentLocal = localStorage.getItem(PASSCODE_STORAGE_KEY) || '';
  const [newPasscode, setNewPasscode] = useState(currentLocal);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewPasscode(localStorage.getItem(PASSCODE_STORAGE_KEY) || '');
      setSavedNotice(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomAppPasscode(newPasscode);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const handleRemove = () => {
    setCustomAppPasscode(null);
    setNewPasscode('');
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131b2e] border border-[#273248] rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-zinc-100">Passcode Settings</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 text-sm p-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder="Passcode (default: luidgwapo)"
              className="w-full bg-[#0d1322] border border-[#273248] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {savedNotice && (
            <div className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-lg p-2.5 text-center font-medium">
              ✓ Settings updated!
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            {currentLocal && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer mr-auto"
              >
                Remove Custom Password
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

