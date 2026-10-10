import React from 'react';
import { SubjectCategory } from '../services/questionParser';

interface StudyHeaderProps {
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
  missedCount,
  flaggedCount,
  correctCount,
  incorrectCount,
  isShuffled,
  onToggleShuffle,
  onOpenPasteModal,
  customQuestionsCount,
}) => {
  const totalAttempted = correctCount + incorrectCount;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 shadow-sm shrink-0 sticky top-0 z-20">
      {/* Top Bar: Minimal title + Score + Add button */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            EF
          </span>
          <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
            Drive Terms Flashcards
          </h1>
        </div>

        {/* Compact Right Metrics & Paste Trigger */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-[11px] sm:text-xs text-slate-300">
            <span className="text-slate-400">Score:</span>
            <span className="text-emerald-400 font-bold">{accuracy}%</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-300 font-medium">{correctCount}✓</span>
            <span className="text-rose-300 font-medium">{incorrectCount}✗</span>
          </div>

          {onOpenPasteModal && (
            <button
              type="button"
              onClick={onOpenPasteModal}
              className="px-2 py-1 rounded text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
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

      {/* Control Strip: 1-line subject dropdown on mobile + mode toggles + shuffle */}
      <div className="border-t border-slate-800/80 bg-slate-950/70 px-3 sm:px-4 py-1.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 text-xs">
          {/* Subject Selector */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {/* Mobile native select - Fits cleanly in 1 line */}
            <div className="sm:hidden flex-1 max-w-[170px]">
              <select
                aria-label="Select Subject"
                value={selectedSubject}
                onChange={(e) => onSelectSubject(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 font-medium focus:outline-none focus:border-emerald-500"
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

            {/* Tablet/Desktop clean horizontal chips */}
            <div className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-slate-400 text-xs font-medium mr-1 shrink-0">Subject:</span>
              {SUBJECT_LIST.map((subj) => {
                const count = subj === 'All' ? subjectCounts['All'] || 0 : subjectCounts[subj] || 0;
                const isSelected = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => onSelectSubject(subj)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {subj} <span className="opacity-70 text-[10px] font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Toggles & Shuffle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center rounded border border-slate-800 bg-slate-900 p-0.5">
              <button
                type="button"
                onClick={() => onSetStudyMode('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  studyMode === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => onSetStudyMode('missed')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  studyMode === 'missed' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Missed{missedCount > 0 ? ` (${missedCount})` : ''}
              </button>
              <button
                type="button"
                onClick={() => onSetStudyMode('flagged')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  studyMode === 'flagged' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Flagged{flaggedCount > 0 ? ` (${flaggedCount})` : ''}
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleShuffle}
              className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                isShuffled
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Shuffle question order"
            >
              {isShuffled ? '🔀 On' : '🔀'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
