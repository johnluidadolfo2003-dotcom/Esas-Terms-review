import React, { useState, useEffect } from 'react';

const PASSCODE_STORAGE_KEY = 'esas_reviewer_passcode';
const UNLOCKED_SESSION_KEY = 'esas_reviewer_unlocked';

export function getEffectivePassword(): string | null {
  // 1. Check client-side build env var (works on Render Static Site or Web Service)
  const envPass = (import.meta as any).env?.VITE_APP_PASSWORD?.trim();
  if (envPass) return envPass;

  // 2. Check user-configured passcode stored in browser
  const localPass = localStorage.getItem(PASSCODE_STORAGE_KEY)?.trim();
  if (localPass) return localPass;

  return null;
}

export function isAppLocked(): boolean {
  const password = getEffectivePassword();
  if (!password) return false; // No password configured, site is unlocked

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
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetPass = getEffectivePassword();

    if (!targetPass || inputVal.trim() === targetPass) {
      sessionStorage.setItem(UNLOCKED_SESSION_KEY, 'true');
      setErrorMsg('');
      onUnlock();
    } else {
      setErrorMsg('Incorrect passcode. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#090d16] text-zinc-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm bg-[#131b2e] border border-[#273248] rounded-2xl p-6 sm:p-8 shadow-2xl text-center transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-teal-500/20 border border-sky-500/30 flex items-center justify-center text-2xl shadow-inner">
          🔒
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-1">
          Private Reviewer
        </h1>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          This ECE reviewer is locked. Please enter your passcode to access terms, documents, and quizzes.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Enter passcode..."
              autoFocus
              className="w-full bg-[#0d1322] border border-[#273248] rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs px-1 py-0.5 rounded cursor-pointer"
              title={showPassword ? 'Hide passcode' : 'Show passcode'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg py-2 px-3 text-left">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer mt-1"
          >
            Unlock Reviewer
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
          <span>🔒 Protected Access</span>
        </div>
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
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <h3 className="font-bold text-base text-zinc-100">Set Web App Passcode</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 text-sm p-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
          Lock your reviewer link with a secret passcode. Anyone opening your link will be required to enter this passcode before they can see or study any questions.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Secret Passcode
            </label>
            <input
              type="text"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder="e.g. MyReviewer2026"
              className="w-full bg-[#0d1322] border border-[#273248] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {savedNotice && (
            <div className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-lg p-2.5 text-center font-medium">
              ✓ Passcode settings updated!
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            {currentLocal && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer mr-auto"
              >
                Remove Lock
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
              Save & Lock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
