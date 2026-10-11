import React from 'react';
import { SubjectCategory } from '../services/questionParser';
import { AiVoiceMode } from '../services/speechService';

interface StudyHeaderProps {
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
  selectedSubject,
  onSelectSubject,
  subjectCounts,
  studyMode,
  onSetStudyMode,
  aiVoiceMode,
  onSetAiVoiceMode,
  missedCount,
  flaggedCount,
  correctCount,
  incorrectCount,
  isShuffled,
  onToggleShuffle,
  onDisableShuffle,
  onOpenPasteModal,
  customQuestionsCount,
}) => {
  const totalAttempted = correctCount + incorrectCount;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 shadow-sm shrink-0 sticky top-0 z-20">
      {/* Top Bar: Title + Metrics + Add button */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            EF
          </span>
          <h1 className="text-xs sm:text-base font-bold text-slate-100 tracking-tight truncate">
            BAYOT AG MAG TUON
          </h1>
        </div>

        {/* Compact Metrics & Add Questions */}
        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/90 border border-slate-700/80 text-[11px] sm:text-xs text-slate-300">
            <span className="text-slate-400 hidden xs:inline">Score:</span>
            <span className="text-emerald-400 font-bold">{accuracy}%</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-300 font-medium">{correctCount}✓</span>
            <span className="text-rose-300 font-medium">{incorrectCount}✗</span>
          </div>

          {onOpenPasteModal && (
            <button
              type="button"
              onClick={onOpenPasteModal}
              className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 hover:text-emerald-200 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              title="Add questions"
            >
              <span>+ Add</span>
              {typeof customQuestionsCount === 'number' && customQuestionsCount > 0 && (
                <span className="text-[10px] text-emerald-400 font-mono">({customQuestionsCount})</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Structured Controls Container */}
      <div className="bg-slate-950/80 px-3 sm:px-4 py-2">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {/* Top Control Row: Subject Selector + Mode Filters + Shuffle */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
            {/* Subject Selector */}
            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 sm:hidden">
                Subject:
              </span>

              {/* Mobile Native Select */}
              <div className="sm:hidden flex-1 min-w-[120px]">
                <select
                  aria-label="Select Subject"
                  value={selectedSubject}
                  onChange={(e) => onSelectSubject(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-md px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
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

              {/* Tablet/Desktop Horizontal Chips */}
              <div className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
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
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {subj} <span className="opacity-70 text-[10px] font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Study Mode Filter Tabs & Shuffle Button */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <div className="flex items-center rounded-md border border-slate-800 bg-slate-900 p-0.5 text-xs shadow-xs">
                <button
                  type="button"
                  onClick={() => onSetStudyMode('all')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    studyMode === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onSetStudyMode('missed')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    studyMode === 'missed' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Missed{missedCount > 0 ? ` (${missedCount})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => onSetStudyMode('flagged')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    studyMode === 'flagged' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Flagged{flaggedCount > 0 ? ` (${flaggedCount})` : ''}
                </button>
              </div>

              {isShuffled ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={onToggleShuffle}
                    className="px-2 py-1 rounded-md text-[11px] font-semibold border bg-amber-500/20 border-amber-500/80 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    title="Reshuffle question order for this subject"
                  >
                    <span>🔀 Reshuffle</span>
                  </button>
                  {onDisableShuffle && (
                    <button
                      type="button"
                      onClick={onDisableShuffle}
                      className="px-1.5 py-1 rounded-md text-[11px] font-semibold border bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Reset to original linear order"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onToggleShuffle}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold border bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
                  title="Shuffle question order for this subject"
                >
                  <span>🔀 Shuffle</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Control Row: AI Voice Mode Segmented Control Bar */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 pt-1.5 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0">
              <span className="text-emerald-400 text-xs">🎙️</span>
              <span>AI Voice Mode:</span>
            </div>

            <div className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 p-0.5 w-full xs:w-auto">
              <button
                type="button"
                onClick={() => onSetAiVoiceMode('off')}
                className={`flex-1 sm:flex-none px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer text-center ${
                  aiVoiceMode === 'off'
                    ? 'bg-slate-700 text-slate-100 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Manual study mode (Voice OFF)"
              >
                Off
              </button>
              <button
                type="button"
                onClick={() => onSetAiVoiceMode('ai_reads_you_answer')}
                className={`flex-1 sm:flex-none px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  aiVoiceMode === 'ai_reads_you_answer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
                title="AI reads question & options, then waits for your answer"
              >
                <span>🗣️</span>
                <span className="hidden sm:inline">AI Reads, You Answer</span>
                <span className="sm:hidden">AI Reads</span>
              </button>
              <button
                type="button"
                onClick={() => onSetAiVoiceMode('ai_reads_and_answers')}
                className={`flex-1 sm:flex-none px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  aiVoiceMode === 'ai_reads_and_answers'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
                title="AI reads question & options, then picks answer & explains"
              >
                <span>🧠</span>
                <span className="hidden sm:inline">AI Reads & Answers</span>
                <span className="sm:hidden">AI Answers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

