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
  missedCount: number;
  flaggedCount: number;
  correctCount: number;
  incorrectCount: number;
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
  correctCount,
  incorrectCount,
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
    <div className="flex flex-col h-full justify-between gap-4 text-zinc-300 text-xs">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-3.5">
        {/* Brand */}
        <div className="flex items-center justify-between pb-2 border-b border-[#22242d]">
          <div>
            <h1 className="text-xs font-bold tracking-wider text-zinc-100 uppercase">
              ESAS Reviewer
            </h1>
            <p className="text-[10px] text-zinc-400">Engineering Board Exam</p>
          </div>
          {/* Close button inside mobile drawer */}
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-[#1f212a] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Primary Quiz Action */}
        {isQuizActive ? (
          <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-[#191b22] border border-[#272935]">
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
                  className="flex-1 py-1.5 px-2 rounded text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 transition-colors cursor-pointer text-center"
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
                  className="py-1.5 px-2 rounded text-xs font-medium text-rose-300 hover:bg-rose-950/60 border border-rose-800/60 transition-colors cursor-pointer text-center"
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
              className="w-full py-2 px-2.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>70 Items Quiz</span>
            </button>
          )
        )}

        {/* Subjects Navigation */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-1 mb-0.5">
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#21232d] text-zinc-100 font-semibold border-l-2 border-zinc-200'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181a21]'
                  }`}
                >
                  <span className="truncate">{subj}</span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-2.5 pt-2.5 border-t border-[#22242d]">
        {/* Shuffle Control */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">Order</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleShuffle}
              className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                isShuffled
                  ? 'bg-[#22242d] border-[#313543] text-zinc-100'
                  : 'bg-[#181a21] border-[#252834] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isShuffled ? 'Shuffled' : 'Sequential'}
            </button>
            {isShuffled && onDisableShuffle && (
              <button
                type="button"
                onClick={onDisableShuffle}
                className="px-1.5 py-1 rounded text-[10px] text-zinc-400 hover:text-zinc-200 hover:bg-[#181a21] transition-colors"
                title="Reset order"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Voice Readout Mode */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-400 font-medium">Voice Readout</span>
          <div className="grid grid-cols-3 gap-1 bg-[#181a21] p-0.5 rounded-md border border-[#252834]">
            <button
              type="button"
              onClick={() => onSetAiVoiceMode('off')}
              className={`py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                aiVoiceMode === 'off'
                  ? 'bg-zinc-700 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Off
            </button>
            <button
              type="button"
              onClick={() => onSetAiVoiceMode('ai_reads_you_answer')}
              className={`py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                aiVoiceMode === 'ai_reads_you_answer'
                  ? 'bg-zinc-700 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Read
            </button>
            <button
              type="button"
              onClick={() => onSetAiVoiceMode('ai_reads_and_answers')}
              className={`py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                aiVoiceMode === 'ai_reads_and_answers'
                  ? 'bg-zinc-700 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Auto
            </button>
          </div>
        </div>

        {/* Calibrate Hand Gestures */}
        {onOpenGestureScanner && (
          <button
            type="button"
            onClick={() => {
              onOpenGestureScanner();
              onCloseMobileDrawer();
            }}
            className="w-full py-1.5 px-2 rounded-md text-[11px] font-medium bg-[#181a21] hover:bg-[#20222a] border border-[#252834] text-zinc-300 transition-colors cursor-pointer text-center"
            title="Calibrate hand gestures"
          >
            Calibrate Gestures
          </button>
        )}

        {/* Question Bank & PDF Trigger */}
        {onOpenPasteModal && !isQuizActive && (
          <button
            type="button"
            onClick={() => {
              onOpenPasteModal();
              onCloseMobileDrawer();
            }}
            className="w-full py-1.5 px-2 rounded-md text-[11px] font-medium bg-[#181a21] hover:bg-[#20222a] border border-[#252834] text-zinc-300 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Question Bank & PDF</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Header (< md) */}
      <header className="md:hidden w-full bg-[#131418] border-b border-[#22242d] px-3 py-2 flex items-center justify-between sticky top-0 z-30 font-sans">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-[#1c1d25] transition-colors cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-100 tracking-wider uppercase">
              ESAS Reviewer
            </span>
            <span className="text-[10px] text-zinc-400 truncate max-w-[120px]">
              {selectedSubject}
            </span>
          </div>
        </div>

        {/* Mobile Right Controls: Camera Icon + beside it Check & Wrong icons and numbers (not too big) */}
        <div className="flex items-center gap-1.5">
          {onToggleCameraGesture && (
            <button
              type="button"
              onClick={onToggleCameraGesture}
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                isCameraGestureActive
                  ? 'bg-zinc-200 text-zinc-950 border-zinc-100'
                  : 'bg-[#181a21] border-[#272935] text-zinc-300 hover:text-white'
              }`}
              title="Camera gesture control"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </button>
          )}

          {/* Beside camera icon: check and wrong numbers */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#181a21] border border-[#272935] text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold" title="Correct">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>{correctCount}</span>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold" title="Wrong">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{incorrectCount}</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. Mobile Drawer (< md) */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileDrawer}
          />

          {/* Drawer Sheet */}
          <div className="relative w-60 max-w-[80vw] bg-[#131418] border-r border-[#22242d] p-3.5 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* 3. Dedicated Slim Desktop Sidebar (md+) */}
      <aside className="hidden md:flex w-56 lg:w-60 h-screen sticky top-0 shrink-0 bg-[#131418] border-r border-[#22242d] p-3.5 overflow-y-auto">
        {renderSidebarContent()}
      </aside>
    </>
  );
};
