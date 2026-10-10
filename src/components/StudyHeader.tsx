import React from 'react';
import { SubjectCategory } from '../services/questionParser';

interface StudyHeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  selectedSubject: SubjectCategory | 'All';
  onSelectSubject: (subject: SubjectCategory | 'All') => void;
  subjectCounts: Record<string, number>;
  totalQuestions: number;
  studyMode: 'all' | 'missed' | 'flagged';
  onSetStudyMode: (mode: 'all' | 'missed' | 'flagged') => void;
  missedCount: number;
  flaggedCount: number;
  correctCount: number;
  incorrectCount: number;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  onOpenDriveModal: () => void;
  onOpenPasteModal?: () => void;
  onOpenShareModal?: () => void;
  onSignIn?: () => void;
  isSigningIn?: boolean;
  customQuestionsCount?: number;
  syncedFilesCount: number;
  isScanning: boolean;
  onSyncQuestionsToProject?: () => void;
  isSyncingProject?: boolean;
  syncNotice?: string | null;
  onDownloadDriveTs?: () => void;
}

const SUBJECT_LIST: (SubjectCategory | 'All')[] = [
  'All',
  'Economics',
  'Mechanics 1',
  'Mechanics 2',
  'EE Laws',
  'Project Management',
  'Communication',
];

export const StudyHeader: React.FC<StudyHeaderProps> = ({
  userEmail,
  onLogout,
  selectedSubject,
  onSelectSubject,
  subjectCounts,
  totalQuestions,
  studyMode,
  onSetStudyMode,
  missedCount,
  flaggedCount,
  correctCount,
  incorrectCount,
  isShuffled,
  onToggleShuffle,
  onOpenDriveModal,
  onOpenPasteModal,
  onOpenShareModal,
  onSignIn,
  isSigningIn,
  customQuestionsCount,
  syncedFilesCount,
  isScanning,
  onSyncQuestionsToProject,
  isSyncingProject,
  syncNotice,
  onDownloadDriveTs,
}) => {
  const totalAttempted = correctCount + incorrectCount;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <header className="w-full bg-slate-900 border-b border-slate-700 shadow-md shrink-0">
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow">
            EF
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              Drive Terms Flashcards
            </h1>
            <span className="text-xs text-emerald-400 font-mono font-medium">
              Engineering Board Exam Reviewer
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onSyncQuestionsToProject && (
            <button
              type="button"
              onClick={onSyncQuestionsToProject}
              disabled={isSyncingProject}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-700 hover:bg-indigo-600 text-white shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-indigo-500/40"
              title="Save all questions permanently into src/data/driveQuestions.ts for Render deployment"
            >
              <span>⚡</span>
              <span>{isSyncingProject ? 'Saving...' : `Save ${totalQuestions} for Render`}</span>
            </button>
          )}

          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-emerald-500/40"
              title="Share this web app with others"
            >
              <span className="font-bold">↗</span>
              <span>Share Link</span>
            </button>
          )}

          {onOpenPasteModal && (
            <button
              type="button"
              onClick={onOpenPasteModal}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Paste Questions</span>
              {typeof customQuestionsCount === 'number' && customQuestionsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-800 text-[10px] font-mono text-emerald-100">
                  {customQuestionsCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDriveModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {isScanning ? 'Scanning...' : `Drive Files (${syncedFilesCount})`}
            </span>
          </button>

          {userEmail ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <span className="text-xs text-slate-300 font-mono hidden md:inline truncate max-w-[160px]">
                {userEmail}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-100 border border-slate-700 rounded bg-slate-800/80 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            onSignIn && (
              <button
                type="button"
                onClick={onSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer border border-zinc-200 shadow-sm ml-1"
                title="Sign in with any Google Account (Gmail, Workspace, School)"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isSigningIn ? 'Signing in...' : 'Sign In with Google'}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncNotice && (
        <div className="bg-indigo-950/90 border-t border-indigo-800/80 px-4 py-2 text-xs flex items-center justify-between text-indigo-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-300">✓</span>
            <span>{syncNotice}</span>
          </div>
          {onDownloadDriveTs && (
            <button
              type="button"
              onClick={onDownloadDriveTs}
              className="px-2.5 py-1 rounded text-[11px] bg-indigo-800 hover:bg-indigo-700 text-white border border-indigo-600 cursor-pointer font-medium shrink-0 ml-2"
            >
              Download driveQuestions.ts
            </button>
          )}
        </div>
      )}

      {/* Scoreboard and Study Mode Bar */}
      <div className="border-t border-slate-800 bg-slate-950/80 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Metrics */}
          <div className="flex items-center gap-5 font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Score:</span>
              <span className="text-emerald-400 font-bold">{accuracy}%</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="text-emerald-400">Correct:</span>
              <span className="text-emerald-300 font-bold">{correctCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="text-rose-400">Incorrect:</span>
              <span className="text-rose-300 font-bold">{incorrectCount}</span>
            </div>
          </div>

          {/* Mode Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border border-slate-700 bg-slate-900 p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => onSetStudyMode('all')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  studyMode === 'all'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                All Cards
              </button>
              <button
                type="button"
                onClick={() => onSetStudyMode('missed')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  studyMode === 'missed'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Missed ({missedCount})
              </button>
              <button
                type="button"
                onClick={() => onSetStudyMode('flagged')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  studyMode === 'flagged'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Flagged ({flaggedCount})
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleShuffle}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors ${
                isShuffled
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isShuffled ? 'Shuffle: ON' : 'Shuffle'}
            </button>
          </div>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="border-t border-slate-800 bg-slate-900/90 px-4 py-2.5 overflow-x-auto shadow-inner">
        <div className="max-w-6xl mx-auto flex items-center gap-2 min-w-max">
          <span className="text-xs text-slate-400 font-mono font-semibold pr-2">Subject:</span>
          {SUBJECT_LIST.map((subj) => {
            const count = subj === 'All' ? subjectCounts['All'] || 0 : subjectCounts[subj] || 0;
            const isSelected = selectedSubject === subj;

            return (
              <button
                key={subj}
                type="button"
                onClick={() => onSelectSubject(subj)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                }`}
              >
                <span>{subj}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
