import React, { useEffect, useCallback } from 'react';
import { FlashcardQuestion } from '../services/questionParser';

interface SingleFlashcardProps {
  question: FlashcardQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedChoice: string | null;
  onSelectChoice: (choiceId: string) => void;
  onResetAnswer?: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isFlagged: boolean;
  onToggleFlag: () => void;
}

export const SingleFlashcard: React.FC<SingleFlashcardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedChoice,
  onSelectChoice,
  onResetAnswer,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
  isFlagged,
  onToggleFlag,
}) => {
  const isAnswered = selectedChoice !== null;
  const isCorrect = isAnswered && selectedChoice.toUpperCase() === question.correctChoiceId.toUpperCase();

  // Keyboard navigation support (A, B, C, D, Left Arrow, Right Arrow)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (!isAnswered) {
        const matchingChoice = question.choices.find(
          (c) => c.id.toUpperCase() === key
        );
        if (matchingChoice) {
          e.preventDefault();
          onSelectChoice(matchingChoice.id);
          return;
        }
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (hasNext) {
          e.preventDefault();
          onNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (hasPrevious) {
          e.preventDefault();
          onPrevious();
        }
      }
    },
    [isAnswered, question.choices, onSelectChoice, onNext, onPrevious, hasNext, hasPrevious]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-2.5 sm:gap-4">
      {/* Flashcard Header Bar - Super Slim */}
      <div className="flex items-center justify-between px-0.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-300 font-semibold bg-slate-800/90 px-2 py-0.5 rounded text-xs border border-slate-700/80">
            {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-semibold">
            {question.subject}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          className={`px-2.5 py-1 rounded text-[11px] sm:text-xs font-semibold border transition-all cursor-pointer ${
            isFlagged
              ? 'bg-amber-600 text-white border-amber-500'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {isFlagged ? '★ Flagged' : '☆ Flag'}
        </button>
      </div>

      {/* Main Single Flashcard Surface - Optimized for Phone Height */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 sm:p-7 flex flex-col gap-3 sm:gap-5 shadow-lg relative overflow-hidden">
        {/* Source info (compact) */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400/90 border-b border-slate-800/80 pb-1.5 sm:pb-2.5 font-mono">
          <div className="truncate max-w-[220px] sm:max-w-md">
            <span className="text-slate-500">Source: </span>
            <span className="text-emerald-300 font-medium">{question.sourceFileName}</span>
          </div>
          {question.questionNumber && (
            <span className="text-slate-500 shrink-0">#{question.questionNumber}</span>
          )}
        </div>

        {/* Question Prompt - Big, Clear & Legible on Mobile */}
        <div className="py-0.5 sm:py-1">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-100 leading-snug">
            {question.question}
          </h2>
        </div>

        {/* Choices Options List */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {question.choices.map((choice, idx) => {
            const isUserSelected =
              selectedChoice?.toUpperCase() === choice.id.toUpperCase();
            const isCorrectOption =
              choice.id.toUpperCase() === question.correctChoiceId.toUpperCase();

            let buttonClasses =
              'relative flex items-center justify-between p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border text-left transition-all min-h-[44px] ';

            if (!isAnswered) {
              buttonClasses +=
                'bg-slate-800/90 border-slate-700 text-slate-100 hover:border-emerald-500 hover:bg-slate-800 cursor-pointer active:scale-[0.99]';
            } else if (isUserSelected && !isCorrectOption) {
              // WRONG SELECTED: Vibrant Red Solid
              buttonClasses +=
                'bg-rose-600 border-rose-500 text-white font-semibold shadow-md ring-2 ring-rose-400/50';
            } else if (isCorrectOption) {
              // CORRECT ANSWER: Vibrant Emerald Green Solid
              buttonClasses +=
                'bg-emerald-600 border-emerald-500 text-white font-semibold shadow-md ring-2 ring-emerald-400/50';
            } else {
              // Other unselected options: muted
              buttonClasses +=
                'bg-slate-900/60 border-slate-800 text-slate-400 opacity-50 pointer-events-none';
            }

            return (
              <button
                key={`${question.id}-${choice.id}-${idx}`}
                type="button"
                disabled={isAnswered}
                onClick={() => onSelectChoice(choice.id)}
                className={buttonClasses}
              >
                <div className="flex items-start gap-2.5 sm:gap-3.5 pr-2 sm:pr-4">
                  <span
                    className={`font-mono text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border shrink-0 font-bold ${
                      !isAnswered
                        ? 'bg-slate-900 border-slate-600 text-slate-200'
                        : isUserSelected && !isCorrectOption
                        ? 'bg-rose-700 border-rose-400 text-white'
                        : isCorrectOption
                        ? 'bg-emerald-700 border-emerald-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {choice.id}
                  </span>
                  <span className="text-xs sm:text-base leading-snug font-medium pt-0.5">{choice.text}</span>
                </div>

                {/* Status indicator badge */}
                {isAnswered && (
                  <div className="shrink-0 font-mono text-[10px] sm:text-xs uppercase tracking-wide">
                    {isUserSelected && !isCorrectOption && (
                      <span className="px-2 py-0.5 rounded bg-rose-900 border border-rose-400 text-rose-100 font-bold">
                        Wrong
                      </span>
                    )}
                    {isCorrectOption && (
                      <span className="px-2 py-0.5 rounded bg-emerald-900 border border-emerald-400 text-emerald-100 font-bold">
                        Correct
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner */}
        {isAnswered && (
          <div
            className={`p-2.5 sm:p-3.5 rounded-lg border flex flex-col gap-1.5 shadow-sm text-xs sm:text-sm ${
              isCorrect
                ? 'bg-emerald-950/90 border-emerald-600 text-emerald-100'
                : 'bg-rose-950/90 border-rose-600 text-rose-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold">
                {isCorrect ? '✓ Correct answer!' : `✗ Incorrect. Correct is: ${question.correctChoiceId}`}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {onResetAnswer && (
                  <button
                    type="button"
                    onClick={onResetAnswer}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-black/30 hover:bg-black/50 text-white border border-white/20 transition-colors cursor-pointer"
                    title="Clear answer and try again"
                  >
                    ↺ Try Again
                  </button>
                )}
                <span className="text-[10px] sm:text-xs font-mono opacity-80 bg-black/20 px-2 py-0.5 rounded hidden xs:inline">
                  Tap Next →
                </span>
              </div>
            </div>
            {question.explanation && (
              <div className="border-t border-white/15 pt-2 mt-0.5 flex flex-col gap-1">
                <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Explanation
                </span>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Card Controls & Footer */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-4 border-t border-slate-800 text-xs sm:text-sm gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border font-semibold transition-colors min-h-[40px] flex items-center justify-center ${
              hasPrevious
                ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer active:scale-98'
                : 'bg-slate-900 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>

          {isAnswered && onResetAnswer ? (
            <button
              type="button"
              onClick={onResetAnswer}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium cursor-pointer transition-colors"
            >
              ↺ Reset Answer
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 font-mono hidden md:block">
              Keyboard: [A-D] answer • [←][→] navigate
            </div>
          )}

          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border font-semibold transition-all shadow-sm min-h-[40px] flex items-center justify-center ${
              hasNext
                ? isAnswered
                  ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 cursor-pointer active:scale-98'
                  : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer active:scale-98'
                : 'bg-slate-900 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
            }`}
          >
            {currentIndex + 1 === totalQuestions ? 'Finish Review' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
};
