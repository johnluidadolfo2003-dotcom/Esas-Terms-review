import React from 'react';
import { SubjectCategory } from '../services/questionParser';
import { AiVoiceMode } from '../services/speechService';
import { AmbientSoundControl } from './AmbientSoundControl';
import { FlashcardQuestion, downloadQuickRecallPdf, downloadQuestionsPdf } from '../services/storageService';

interface StudyHeaderProps {
  selectedSubject: SubjectCategory | 'All' | string;
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
  allQuestions?: FlashcardQuestion[];
  isQuizActive?: boolean;
  onStartQuiz?: () => void;
  onFinishQuiz?: () => void;
  onExitQuiz?: () => void;
  isCameraGestureActive?: boolean;
  onToggleCameraGesture?: () => void;
  onOpenGestureScanner?: () => void;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}

const SUBJECT_LIST: (SubjectCategory | 'All')[] = [
  'All',
  'ESAS',
  'COACH G 1000 TERMS',
  '1001 terms part 1',
  '1001 terms part 2',
  '1001 terms part 3',
  'Economics',
  'Mechanics 1',
  'Mechanics 2',
  'Strength of Materials',
  'Fluid Mechanics',
  'Thermodynamics',
  'EE Laws',
  'Project Management',
  'Project Management 2.0',
  'Communication',
  'Physics 1',
  'Physics 2',
  'Chemistry',
  'Computer',
  'PEC',
  'MATH',
  'EE',
];

export const StudyHeader: React.FC<StudyHeaderProps> = ({
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
  allQuestions = [],
  isQuizActive = false,
  onStartQuiz,
  onFinishQuiz,
  onExitQuiz,
  isCameraGestureActive,
  onToggleCameraGesture,
  onOpenGestureScanner,
  isSidebarVisible = true,
  onToggleSidebar,
}) => {
  const totalAttempted = correctCount + incorrectCount;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 shadow-sm shrink-0 sticky top-0 z-30 font-sans">
      {/* Primary Top Bar */}
      <div className="max-w-4xl mx-auto px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 border-b border-slate-800/80">
        {/* Brand / App Title & Sidebar Toggle */}
        <div className="flex items-center gap-2 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden md:flex items-center gap-1 text-xs font-mono"
              title={isSidebarVisible ? 'Hide Sidebar Menu' : 'Show Sidebar Menu'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
          <h1 className="text-xs sm:text-base font-extrabold text-slate-100 tracking-wider truncate uppercase">
            T<span className="text-[#2dd4bf] lowercase font-bold">ee</span>RMS <span className="text-[#2dd4bf]">Flashcard</span>
          </h1>
        </div>

        {/* Action Controls & Metrics */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          {/* Quiz Control or Quiz Trigger */}
          {isQuizActive ? (
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded bg-teal-500/20 border border-teal-500/50 text-teal-300 font-bold text-[11px] sm:text-xs">
                Quiz in Progress
              </span>
              {onFinishQuiz && (
                <button
                  type="button"
                  onClick={onFinishQuiz}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[11px] sm:text-xs font-bold bg-[#2dd4bf] hover:bg-[#26bba8] text-zinc-950 transition-colors cursor-pointer"
                >
                  Finish
                </button>
              )}
              {onExitQuiz && (
                <button
                  type="button"
                  onClick={onExitQuiz}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[11px] sm:text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-xs"
                  title="Exit quiz mode and return to per-subject review"
                >
                  Exit Quiz
                </button>
              )}
            </div>
          ) : (
            onStartQuiz && (
              <button
                type="button"
                onClick={onStartQuiz}
                className="px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold bg-[#2dd4bf] hover:bg-[#26bba8] text-zinc-950 transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                title="Start quiz covering all subjects"
              >
                <span>Take a Quiz</span>
              </button>
            )
          )}

          {/* Score Counter: Checkmark and Cross Icons */}
          <div className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded bg-slate-950 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-mono">
            <span className="text-teal-400 font-bold">{accuracy}%</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#2dd4bf] font-semibold flex items-center gap-0.5">
              {correctCount}
              <svg className="w-3 h-3 text-[#2dd4bf] inline" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            <span className="text-rose-400 font-semibold flex items-center gap-0.5">
              {incorrectCount}
              <svg className="w-3 h-3 text-rose-400 inline" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>

          {/* Background Ambient Focus Sound Control */}
          <AmbientSoundControl compact />

          {/* Hands-Free Camera Gesture Toggle Button */}
          {onToggleCameraGesture && (
            <button
              type="button"
              onClick={onToggleCameraGesture}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                isCameraGestureActive
                  ? 'bg-teal-600 border-teal-500 text-white shadow-xs'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Toggle Wireless Hands-Free Camera Gesture Control"
              aria-label="Toggle Camera Gestures"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </button>
          )}

          {/* Quick Recall PDF Download for Active Subject */}
          {allQuestions && allQuestions.length > 0 && !isQuizActive && (
            <button
              type="button"
              onClick={() => downloadQuickRecallPdf(allQuestions, selectedSubject)}
              className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-bold bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
              title={`Download Quick Recall Cheat Sheet PDF (short 1-line form) for ${selectedSubject}`}
            >
              <svg className="w-3 h-3 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="hidden sm:inline">Recall PDF</span>
              <span className="sm:hidden">Recall</span>
            </button>
          )}

          {/* Calibrate / Scan Hand Gestures Button */}
          {onOpenGestureScanner && (
            <button
              type="button"
              onClick={onOpenGestureScanner}
              className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-slate-800 border border-teal-800/70 text-teal-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              title="Scan and calibrate your personal hand gestures first"
            >
              <svg className="w-3.5 h-3.5 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m12 0h-4.5m4.5 0v4.5m0 12v-4.5m0 4.5h-4.5m-12 0h4.5m-4.5 0v-4.5" />
              </svg>
              <span>Scan</span>
            </button>
          )}

          {/* Question Bank Modal Button */}
          {onOpenPasteModal && !isQuizActive && (
            <button
              type="button"
              onClick={onOpenPasteModal}
              className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              title="Open Question Bank and PDF downloads"
            >
              <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="hidden sm:inline">Bank & PDFs</span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Controls Bar - Ultra Slim for Mobile */}
      <div className="bg-slate-950 px-2.5 sm:px-4 py-1 sm:py-1.5">
        <div className="max-w-4xl mx-auto flex flex-col gap-1">
          {/* Controls Row: Subject Selector & Shuffle */}
          <div className="flex items-center justify-between gap-1.5">
            {/* Subject Selector */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1 sm:flex-initial">
              {/* Mobile Native Select */}
              <div className="sm:hidden flex-1">
                <select
                  aria-label="Select Subject"
                  value={selectedSubject}
                  onChange={(e) => onSelectSubject(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-[11px] rounded px-2 py-1 font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  {SUBJECT_LIST.map((subj) => {
                    const count = subj === 'All' ? subjectCounts['All'] || 0 : subjectCounts[subj] || 0;
                    return (
                      <option key={subj} value={subj}>
                        {subj} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Desktop Horizontal Chips */}
              <div className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mr-1 shrink-0">
                  Subject:
                </span>
                {SUBJECT_LIST.map((subj) => {
                  const count = subj === 'All' ? subjectCounts['All'] || 0 : subjectCounts[subj] || 0;
                  const isSelected = selectedSubject === subj;
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => onSelectSubject(subj)}
                      className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {subj} <span className="opacity-70 text-[10px] font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shuffle Control */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={onToggleShuffle}
                className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                  isShuffled
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Shuffle question and choice order"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662" />
                </svg>
                <span>{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
              </button>

              {isShuffled && onDisableShuffle && (
                <button
                  type="button"
                  onClick={onDisableShuffle}
                  className="px-1.5 py-1 rounded text-[10px] font-semibold border bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  title="Reset to linear order"
                >
                  Linear
                </button>
              )}
            </div>
          </div>

          {/* Voice Control Strip - Compact Portion on Mobile */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/60 text-[10px] sm:text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0 text-[10px]">
              US Male Voice:
            </span>

            <div className="flex items-center gap-0.5 rounded border border-slate-800 bg-slate-900 p-0.5">
              <button
                type="button"
                onClick={() => onSetAiVoiceMode('off')}
                className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                  aiVoiceMode === 'off'
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Voice Readout OFF"
              >
                Off
              </button>

              <button
                type="button"
                onClick={() => onSetAiVoiceMode('ai_reads_you_answer')}
                className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                  aiVoiceMode === 'ai_reads_you_answer'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-teal-300'
                }`}
                title="Voice reads question and options"
              >
                <span className="sm:hidden">Read</span>
                <span className="hidden sm:inline">Read Questions</span>
              </button>

              <button
                type="button"
                onClick={() => onSetAiVoiceMode('ai_reads_and_answers')}
                className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                  aiVoiceMode === 'ai_reads_and_answers'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-sky-300'
                }`}
                title="Voice reads question, choices, and answers automatically"
              >
                <span className="sm:hidden">Auto</span>
                <span className="hidden sm:inline">Auto Read & Answer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
