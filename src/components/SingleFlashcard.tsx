import React, { useEffect, useCallback } from 'react';
import { FlashcardQuestion } from '../services/questionParser';

interface SingleFlashcardProps {
  question: FlashcardQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedChoice: string | null;
  onSelectChoice: (choiceId: string) => void;
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
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
      {/* Flashcard Header Bar */}
      <div className="flex items-center justify-between px-1 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-300 font-semibold bg-slate-800 px-3 py-1 rounded-md border border-slate-700 shadow-sm">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="px-3 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700 font-semibold text-xs tracking-wide">
            {question.subject}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFlag}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all shadow-sm ${
              isFlagged
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {isFlagged ? 'Flagged for Review' : 'Flag Question'}
          </button>
        </div>
      </div>

      {/* Main Single Flashcard Surface */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-9 flex flex-col gap-6 shadow-xl relative overflow-hidden">
        {/* Decorative top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

        {/* Source info */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3 font-mono">
          <div className="truncate max-w-md">
            <span className="text-slate-400">Source: </span>
            <span className="text-emerald-300 font-medium">{question.sourceFileName}</span>
          </div>
          {question.questionNumber && (
            <span className="text-slate-400 shrink-0">Item #{question.questionNumber}</span>
          )}
        </div>

        {/* Question Prompt */}
        <div className="py-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
            {question.question}
          </h2>
        </div>

        {/* Choices Options List */}
        <div className="flex flex-col gap-3.5">
          {question.choices.map((choice, idx) => {
            const isUserSelected =
              selectedChoice?.toUpperCase() === choice.id.toUpperCase();
            const isCorrectOption =
              choice.id.toUpperCase() === question.correctChoiceId.toUpperCase();

            // Styling according to user requirement:
            // "if I choose a letter then u answer it RED if wrong and GREEN the correct answer"
            let buttonClasses =
              'relative flex items-center justify-between p-4 rounded-xl border text-left transition-all shadow-sm ';

            if (!isAnswered) {
              buttonClasses +=
                'bg-slate-800/90 border-slate-700 text-slate-100 hover:border-emerald-500 hover:bg-slate-800 cursor-pointer';
            } else if (isUserSelected && !isCorrectOption) {
              // WRONG SELECTED: Vibrant Red / Rose Solid
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
                <div className="flex items-start gap-4 pr-4">
                  <span
                    className={`font-mono text-sm px-2.5 py-1 rounded-lg border shrink-0 font-bold ${
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
                  <span className="text-base leading-normal font-medium">{choice.text}</span>
                </div>

                {/* Status indicator badge */}
                {isAnswered && (
                  <div className="shrink-0 font-mono text-xs uppercase tracking-wide">
                    {isUserSelected && !isCorrectOption && (
                      <span className="px-2.5 py-1 rounded-md bg-rose-900/90 border border-rose-400 text-rose-100 font-bold shadow">
                        Wrong
                      </span>
                    )}
                    {isCorrectOption && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-900/90 border border-emerald-400 text-emerald-100 font-bold shadow">
                        Correct Answer
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
            className={`p-4 rounded-xl border flex flex-col gap-2 shadow-md ${
              isCorrect
                ? 'bg-emerald-950/90 border-emerald-600 text-emerald-100'
                : 'bg-rose-950/90 border-rose-600 text-rose-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-base">
                {isCorrect ? 'Correct! Excellent answer.' : `Incorrect. The correct answer is option ${question.correctChoiceId}.`}
              </span>
              <span className="text-xs font-mono opacity-90 font-semibold bg-black/20 px-2.5 py-1 rounded">
                Press Enter or → to continue
              </span>
            </div>
            {question.explanation && (
              <p className="text-sm text-slate-200 border-t border-white/10 pt-2.5 mt-1 leading-relaxed font-normal">
                {question.explanation}
              </p>
            )}
          </div>
        )}

        {/* Card Controls & Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-800 text-sm">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`px-4 py-2.5 rounded-lg border font-semibold transition-colors ${
              hasPrevious
                ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer'
                : 'bg-slate-900 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
            }`}
          >
            ← Previous Question
          </button>

          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Keyboard: [A] [B] [C] [D] to answer • [←] [→] navigate
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className={`px-5 py-2.5 rounded-lg border font-semibold transition-all shadow-sm ${
              hasNext
                ? isAnswered
                  ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 cursor-pointer'
                  : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer'
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
