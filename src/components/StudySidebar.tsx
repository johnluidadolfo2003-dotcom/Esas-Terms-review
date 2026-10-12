import React from 'react';
import { SubjectCategory } from '../services/questionParser';
import { AiVoiceMode } from '../services/speechService';

export interface StudySidebarProps {
  selectedSubject: SubjectCategory | 'All';
  onSelectSubject: (subject: SubjectCategory | 'All') => void;
  subjectCounts: Record<string, number>;
  totalQuestions: number;
  studyMode: 'all' | 'missed' | 'flagged';
  onSetStudyMode: (mode: 'all' | 'missed' | 'flagged') => void;
  aiVoiceMode: AiVoiceMode;
  onSetAiVoiceMode: (mode: AiVoiceMode) => void;
  missedCount?: number;
  flaggedCount?: number;
  correctCount?: number;
  incorrectCount?: number;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  onDisableShuffle?: () => void;
  onOpenPasteModal?: () => void;
  customQuestionsCount?: number;
  isQuizActive?: boolean;
  onStartQuiz?: () => void;
  onFinishQuiz?: () => void;
  onExitQuiz?: () => void;
  isCameraGestureActive?: boolean;
  onToggleCameraGesture?: () => void;
  onOpenGestureScanner?: () => void;
  isMobileDrawerOpen: boolean;
  onToggleMobileDrawer: () => void;
  onCloseMobileDrawer: () => void;
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

export const StudySidebar: React.FC<StudySidebarProps> = ({
  selectedSubject,
  onSelectSubject,
  subjectCounts,
  aiVoiceMode,
  onSetAiVoiceMode,
  correctCount = 0,
  incorrectCount = 0,
  isShuffled,
  onToggleShuffle,
  onDisableShuffle,
  onOpenPasteModal,
  isQuizActive = false,
  onStartQuiz,
  onFinishQuiz,
  onExitQuiz,
  isCameraGestureActive,
  onToggleCameraGesture,
  onOpenGestureScanner,
  isMobileDrawerOpen,
  onToggleMobileDrawer,
  onCloseMobileDrawer,
}) => {
  const handleSelectSubject = (subj: SubjectCategory | 'All') => {
    onSelectSubject(subj);
    onCloseMobileDrawer();
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between gap-4 text-slate-300 text-xs">
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-3.5">
        {/* Brand */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              ESAS Terms
            </h1>
            <p className="text-[11px] text-slate-400">Board Exam Reviewer</p>
          </div>
          {/* Close button inside mobile drawer */}
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Primary Quiz Action */}
        {isQuizActive ? (
          <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-semibold text-amber-300">
              70 Items Quiz Active
            </span>
            <div className="flex items-center gap-1.5">
              {onFinishQuiz && (
                <button
                  type="button"
                  onClick={() => {
                    onFinishQuiz();
                    onCloseMobileDrawer();
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-white text-slate-950 transition-colors cursor-pointer text-center"
                >
                  Finish
                </button>
              )}
              {onExitQuiz && (
                <button
                  type="button"
                  onClick={() => {
                    onExitQuiz();
                    onCloseMobileDrawer();
                  }}
                  className="py-1.5 px-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-950/60 border border-rose-800/60 transition-colors cursor-pointer text-center"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        ) : (
          onStartQuiz && (
            <button
              type="button"
              onClick={() => {
                onStartQuiz();
                onCloseMobileDrawer();
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-white text-slate-950 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>70 Items Quiz</span>
            </button>
          )
        )}

        {/* Subjects Navigation */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1 mb-0.5">
            Subjects
          </span>

          <nav className="flex flex-col gap-0.5">
            {SUBJECT_LIST.map((subj) => {
              const count = subj === 'All' ? subjectCounts['All'] || 0 : subjectCounts[subj] || 0;
              const isSelected = selectedSubject === subj;

              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => handleSelectSubject(subj)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800 text-slate-100 font-semibold border-l-2 border-slate-200'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="truncate pr-1">{subj}</span>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Controls / Tools */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-800">
        {/* Shuffle Control */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Order:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleShuffle}
              className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                isShuffled
                  ? 'bg-slate-800 border-slate-700 text-slate-100'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isShuffled ? 'Shuffled' : 'Sequential'}
            </button>
            {isShuffled && onDisableShuffle && (
              <button
                type="button"
                onClick={onDisableShuffle}
                className="px-1.5 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                title="Reset order"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Voice Readout Mode */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-400 font-medium">Voice Readout:</span>
          <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => onSetAiVoiceMode('off')}
              className={`py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                aiVoiceMode === 'off'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Off
            </button>
            <button
              type="button"
              onClick={() => onSetAiVoiceMode('ai_reads_you_answer')}
              className={`py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                aiVoiceMode === 'ai_reads_you_answer'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Read
            </button>
            <button
              type="button"
              onClick={() => onSetAiVoiceMode('ai_reads_and_answers')}
              className={`py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                aiVoiceMode === 'ai_reads_and_answers'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Auto
            </button>
          </div>
        </div>

        {/* Camera Gestures and Calibrate */}
        <div className="flex items-center gap-1.5">
          {onToggleCameraGesture && (
            <button
              type="button"
              onClick={onToggleCameraGesture}
              className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-medium border transition-colors cursor-pointer text-center truncate ${
                isCameraGestureActive
                  ? 'bg-slate-800 border-slate-600 text-slate-100'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isCameraGestureActive ? 'Camera: On' : 'Camera: Off'}
            </button>
          )}

          {onOpenGestureScanner && (
            <button
              type="button"
              onClick={() => {
                onOpenGestureScanner();
                onCloseMobileDrawer();
              }}
              className="py-1.5 px-2 rounded-md text-[11px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Calibrate hand gestures"
            >
              Calibrate
            </button>
          )}
        </div>

        {/* Question Bank & PDF Reviewer Modal Trigger */}
        {onOpenPasteModal && !isQuizActive && (
          <button
            type="button"
            onClick={() => {
              onOpenPasteModal();
              onCloseMobileDrawer();
            }}
            className="w-full py-1.5 px-2 rounded-md text-[11px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 truncate"
          >
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="truncate">Question Bank & PDF</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Slim Mobile Header (< md) */}
      <header className="md:hidden w-full bg-[#080e1c] border-b border-slate-800 px-3 py-2 flex items-center justify-between sticky top-0 z-30 font-sans shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-100 tracking-wider uppercase">
              ESAS Terms
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
              {selectedSubject}
            </span>
          </div>
        </div>

        {/* Mobile Right Controls: Score & Quick Camera */}
        <div className="flex items-center gap-2">
          {isQuizActive && (
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-md">
              Quiz Mode
            </span>
          )}

          {/* Correct & Wrong Answer tally beside camera icon - not too big */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono shadow-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold" title="Correct answers">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>{correctCount}</span>
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold" title="Wrong answers">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{incorrectCount}</span>
            </span>
          </div>

          {onToggleCameraGesture && (
            <button
              type="button"
              onClick={onToggleCameraGesture}
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                isCameraGestureActive
                  ? 'bg-slate-800 border-slate-600 text-slate-100'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Camera Gesture"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* 2. Mobile Slide-Over Drawer with Backdrop (< md) */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileDrawer}
          />

          {/* Drawer Sheet - Slim & Compact */}
          <div className="relative w-60 max-w-[80vw] bg-[#080e1c] border-r border-slate-800 p-3.5 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* 3. Dedicated Slim Desktop Sidebar (md+) */}
      <aside className="hidden md:flex w-52 lg:w-56 h-screen sticky top-0 shrink-0 bg-[#080e1c] border-r border-slate-800/80 p-3.5 overflow-y-auto">
        {renderSidebarContent()}
      </aside>
    </>
  );
};
