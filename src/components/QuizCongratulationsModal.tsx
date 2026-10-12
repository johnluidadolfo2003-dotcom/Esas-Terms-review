import React from 'react';
import { SubjectCategory } from '../services/questionParser';

interface SubjectScore {
  correct: number;
  total: number;
}

interface QuizCongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  subjectScores: Record<string, SubjectScore>;
  onRetakeQuiz: () => void;
  onReviewAnswers: () => void;
}

export const QuizCongratulationsModal: React.FC<QuizCongratulationsModalProps> = ({
  isOpen,
  onClose,
  score,
  totalQuestions,
  subjectScores,
  onRetakeQuiz,
  onReviewAnswers,
}) => {
  if (!isOpen) return null;

  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = percentage >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-slate-100 relative overflow-hidden">
        {/* Background Subtle Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

        {/* Header Icon + Celebration Message */}
        <div className="text-center pt-2 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-3xl mb-3 shadow-inner">
            🎉
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug px-2">
            Congratulations Ambobo mo parin may lubot ka sakin,  hugasing lubot
          </h2>

          <p className="text-xs text-slate-400 mt-2 font-mono">
            70-Item Comprehensive Board Exam Quiz Completed!
          </p>
        </div>

        {/* Score Summary Box */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center gap-1 shadow-inner">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overall Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold font-mono ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {score}
            </span>
            <span className="text-lg font-bold text-slate-500">/ {totalQuestions}</span>
            <span className={`ml-2 text-xl font-black ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
              ({percentage}%)
            </span>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${isPassed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
            {isPassed ? '✓ BOARD EXAM PASSED' : '⚠️ KEEP REVIEWING'}
          </span>
        </div>

        {/* Subject Scores Breakdown */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Subject Breakdown
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(subjectScores).map(([subject, stats]) => {
              const subjPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div
                  key={subject}
                  className="bg-slate-800/80 border border-slate-700/60 rounded-md p-2 flex items-center justify-between"
                >
                  <span className="font-medium text-slate-300 truncate pr-1" title={subject}>
                    {subject}
                  </span>
                  <div className="font-mono text-right shrink-0">
                    <span className="font-bold text-emerald-400">{stats.correct}</span>
                    <span className="text-slate-500">/{stats.total}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({subjPct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="w-full sm:flex-1 py-2.5 px-4 bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center shadow-xs"
          >
            Take New 70-Item Quiz
          </button>

          <button
            type="button"
            onClick={onReviewAnswers}
            className="w-full sm:flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer text-center"
          >
            Review Answers
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
