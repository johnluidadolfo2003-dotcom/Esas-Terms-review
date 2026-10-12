import React, { useEffect, useCallback, useState, useRef } from 'react';
import { FlashcardQuestion, generateContextualExplanation } from '../services/questionParser';
import { AiVoiceMode, stopSpeech, speakPhrase } from '../services/speechService';
import { playAnswerSound } from '../services/gestureCalibration';

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
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  aiVoiceMode: AiVoiceMode;
  onSetAiVoiceMode: (mode: AiVoiceMode) => void;
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
  aiVoiceMode,
  onSetAiVoiceMode,
}) => {
  const cleanSelected = selectedChoice ? selectedChoice.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : null;
  const cleanCorrect = question.correctChoiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const isAnswered = cleanSelected !== null;
  const isCorrect = isAnswered && cleanSelected === cleanCorrect;

  // Play audio sound on answer selection
  const prevSelectedChoiceRef = useRef<string | null>(selectedChoice);
  useEffect(() => {
    if (selectedChoice && selectedChoice !== prevSelectedChoiceRef.current) {
      const curSelected = selectedChoice.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const curCorrect = question.correctChoiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const isAnsCorrect = curSelected === curCorrect;
      playAnswerSound(isAnsCorrect);
    }
    prevSelectedChoiceRef.current = selectedChoice;
  }, [selectedChoice, question.correctChoiceId]);

  // Voice Engine State
  const [speechStatus, setSpeechStatus] = useState<
    'idle' | 'reading_question' | 'reading_options' | 'waiting_user' | 'ai_answering' | 'reading_explanation' | 'paused'
  >('idle');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSeqIdRef = useRef<number>(0);

  const clearAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const handlePauseSpeech = () => {
    stopSpeech();
    clearAutoAdvanceTimer();
    setSpeechStatus('paused');
  };

  const handleReplaySpeech = useCallback(() => {
    stopSpeech();
    clearAutoAdvanceTimer();

    if (aiVoiceMode === 'off') {
      setSpeechStatus('idle');
      return;
    }

    const seqId = ++currentSeqIdRef.current;

    // Step 1: Speak Question
    setSpeechStatus('reading_question');
    const questionPrompt = `Question ${currentIndex + 1}. ${question.question}`;
    speakPhrase(questionPrompt, speechRate, () => {
      if (seqId !== currentSeqIdRef.current) return;

      // Step 2: Speak Choices
      setSpeechStatus('reading_options');
      const optionsText = question.choices
        .map((c) => `Option ${c.id}: ${c.text}`)
        .join('. ');

      speakPhrase(optionsText, speechRate, () => {
        if (seqId !== currentSeqIdRef.current) return;

        if (aiVoiceMode === 'ai_reads_you_answer') {
          setSpeechStatus('waiting_user');
        } else if (aiVoiceMode === 'ai_reads_and_answers') {
          setSpeechStatus('ai_answering');
          const correctChoice = question.choices.find(
            (c) => c.id.toUpperCase() === question.correctChoiceId.toUpperCase()
          );
          const answerText = `Thinking. The correct answer is Option ${
            question.correctChoiceId
          }${correctChoice ? ': ' + correctChoice.text : ''}.`;

          speakPhrase(answerText, speechRate, () => {
            if (seqId !== currentSeqIdRef.current) return;

            // Trigger AI answer selection
            onSelectChoice(question.correctChoiceId);

            // Speak explanation
            const expl = generateContextualExplanation(
              question.question,
              question.choices,
              question.correctChoiceId,
              question.subject,
              question.explanation
            );

            setSpeechStatus('reading_explanation');
            const explText = `Explanation: ${expl}`;

            speakPhrase(explText, speechRate, () => {
              if (seqId !== currentSeqIdRef.current) return;
              setSpeechStatus('idle');

              if (autoAdvance && hasNext) {
                autoAdvanceTimerRef.current = setTimeout(() => {
                  onNext();
                }, 2200);
              }
            });
          });
        }
      });
    });
  }, [
    aiVoiceMode,
    currentIndex,
    question,
    speechRate,
    onSelectChoice,
    autoAdvance,
    hasNext,
    onNext,
  ]);

  // Handle Voice trigger when card or mode changes
  useEffect(() => {
    handleReplaySpeech();
    return () => {
      stopSpeech();
      clearAutoAdvanceTimer();
    };
  }, [question.id, aiVoiceMode, speechRate]);

  // Handle user answer in "AI Reads, You Answer" mode
  useEffect(() => {
    if (
      aiVoiceMode === 'ai_reads_you_answer' &&
      selectedChoice !== null &&
      (speechStatus === 'waiting_user' || speechStatus === 'reading_question' || speechStatus === 'reading_options')
    ) {
      stopSpeech();
      clearAutoAdvanceTimer();

      const seqId = ++currentSeqIdRef.current;
      const isUserCorrect =
        selectedChoice.toUpperCase() === question.correctChoiceId.toUpperCase();

      const resultIntro = isUserCorrect
        ? `Correct!`
        : `Incorrect. The correct answer is Option ${question.correctChoiceId}.`;

      const expl = generateContextualExplanation(
        question.question,
        question.choices,
        question.correctChoiceId,
        question.subject,
        question.explanation
      );

      const fullSpeechText = `${resultIntro} Explanation: ${expl}`;
      setSpeechStatus('reading_explanation');

      speakPhrase(fullSpeechText, speechRate, () => {
        if (seqId !== currentSeqIdRef.current) return;
        setSpeechStatus('idle');
      });
    }
  }, [selectedChoice, aiVoiceMode, question, speechRate, speechStatus]);

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
      {/* Flashcard Header Bar - Slim */}
      <div className="flex items-center justify-between px-0.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-200 font-semibold bg-slate-800/90 px-2 py-0.5 rounded text-xs border border-slate-700">
            {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700 text-[11px] font-medium">
            {question.subject}
          </span>
        </div>
      </div>

      {/* Main Single Flashcard Surface - Elevated Slate Card */}
      <div className="bg-slate-800/95 border border-slate-700/80 rounded-2xl p-4 sm:p-7 flex flex-col gap-3.5 sm:gap-5 shadow-xl shadow-slate-950/40 relative overflow-hidden backdrop-blur-xs">
        {/* Source info (compact) */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 border-b border-slate-700/60 pb-2 sm:pb-3 font-mono">
          <div className="truncate max-w-[220px] sm:max-w-md">
            <span className="text-slate-500">Source: </span>
            <span className="text-slate-300 font-medium">{question.sourceFileName}</span>
          </div>
          {question.questionNumber && (
            <span className="text-slate-400 shrink-0">#{question.questionNumber}</span>
          )}
        </div>

        {/* Voice Status Banner when active */}
        {aiVoiceMode !== 'off' && (
          <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700"
              >
                {aiVoiceMode === 'ai_reads_you_answer' ? 'Read Questions Mode' : 'Auto Read & Answer Mode'}
              </span>

              {/* Status Indicator */}
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                {speechStatus === 'reading_question' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Reading question...</span>
                  </>
                )}
                {speechStatus === 'reading_options' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Reading options...</span>
                  </>
                )}
                {speechStatus === 'waiting_user' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-amber-300 font-semibold">Your turn to pick an answer!</span>
                  </>
                )}
                {speechStatus === 'ai_answering' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-cyan-300 font-semibold">AI selecting answer...</span>
                  </>
                )}
                {speechStatus === 'reading_explanation' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Explaining answer...</span>
                  </>
                )}
                {speechStatus === 'paused' && (
                  <span className="text-slate-400 italic">Paused</span>
                )}
                {speechStatus === 'idle' && (
                  <span className="text-slate-400">Ready</span>
                )}
              </span>
            </div>

            {/* Voice Controls: Replay / Pause & Speed & Auto-Next */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {speechStatus === 'paused' || speechStatus === 'idle' ? (
                <button
                  type="button"
                  onClick={handleReplaySpeech}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
                  title="Play / Re-read aloud"
                >
                  Play
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseSpeech}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
                  title="Pause speech"
                >
                  Pause
                </button>
              )}

              {/* Speed Toggles */}
              <div className="flex items-center rounded border border-slate-700 bg-slate-900/90 p-0.5">
                {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeechRate(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                      speechRate === rate
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Auto Advance Toggle (for AI Reads & Answers) */}
              {aiVoiceMode === 'ai_reads_and_answers' && (
                <button
                  type="button"
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`px-2 py-1 rounded text-[10px] font-medium border cursor-pointer transition-colors ${
                    autoAdvance
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  title="Automatically advance to next question after explanation"
                >
                  {autoAdvance ? 'Auto-Next: ON' : 'Auto-Next: OFF'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Question Prompt - Big, Clear & Legible on Mobile */}
        <div className="py-0.5 sm:py-1">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-50 leading-snug">
            {question.question}
          </h2>
        </div>

        {/* Choices Options List */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {question.choices.map((choice, idx) => {
            const cleanChoiceId = choice.id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
            const isUserSelected = cleanSelected === cleanChoiceId;
            const isCorrectOption = cleanChoiceId === cleanCorrect;

            let buttonClasses =
              'relative flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl border text-left transition-all min-h-[46px] ';

            if (!isAnswered) {
              buttonClasses +=
                'bg-slate-900/90 border-slate-700 text-slate-100 hover:border-slate-400 hover:bg-slate-900 cursor-pointer active:scale-[0.99] shadow-xs';
            } else if (isUserSelected && !isCorrectOption) {
              // WRONG SELECTED: Vibrant Red Solid
              buttonClasses +=
                'bg-rose-600 border-rose-500 text-white font-semibold shadow-md ring-2 ring-rose-400/50';
            } else if (isCorrectOption) {
              // CORRECT ANSWER: Vibrant Emerald Green Solid (kept green!)
              buttonClasses +=
                'bg-emerald-600 border-emerald-500 text-white font-semibold shadow-md ring-2 ring-emerald-400/50';
            } else {
              // Other unselected options: muted
              buttonClasses +=
                'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-45 pointer-events-none';
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
                        ? 'bg-slate-800 border-slate-600 text-slate-200'
                        : isUserSelected && !isCorrectOption
                        ? 'bg-rose-700 border-rose-400 text-white'
                        : isCorrectOption
                        ? 'bg-emerald-700 border-emerald-400 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    {choice.id}
                  </span>
                  <span className="text-xs sm:text-base leading-snug font-medium pt-0.5">{choice.text}</span>
                </div>

                {/* Status indicator badge */}
                {isAnswered && (
                  <div className="shrink-0 font-mono text-[10px] sm:text-xs uppercase tracking-wide">
                    {isUserSelected && isCorrectOption && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-300 text-emerald-100 font-bold">
                        ✓ Your Choice (Correct!)
                      </span>
                    )}
                    {!isUserSelected && isCorrectOption && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-300 text-emerald-100 font-bold">
                        ✓ Correct Answer
                      </span>
                    )}
                    {isUserSelected && !isCorrectOption && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-300 text-rose-100 font-bold">
                        ✕ Your Choice (Wrong)
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
            className={`p-3 sm:p-4 rounded-xl border flex flex-col gap-2 shadow-md text-xs sm:text-sm ${
              isCorrect
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/40'
                : 'bg-rose-950/95 border-rose-500 text-rose-100 ring-1 ring-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 border border-current">
                    {isCorrect ? '✓' : '✕'}
                  </span>
                  <span>{isCorrect ? 'Correct Answer' : 'Incorrect Choice'}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {onResetAnswer && (
                  <button
                    type="button"
                    onClick={onResetAnswer}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold bg-black/30 hover:bg-black/50 text-white border border-white/20 transition-colors cursor-pointer"
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
            {(() => {
              const displayExplanation = generateContextualExplanation(
                question.question,
                question.choices,
                question.correctChoiceId,
                question.subject,
                question.explanation
              );
              return displayExplanation ? (
                <div className="border-t border-white/15 pt-2 mt-0.5 flex flex-col gap-1">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    Explanation
                  </span>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                    {displayExplanation}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Card Controls & Footer */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-4 border-t border-slate-700/60 text-xs sm:text-sm gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border font-semibold transition-colors min-h-[40px] flex items-center justify-center ${
              hasPrevious
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200 hover:text-white cursor-pointer active:scale-98'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>

          {isAnswered && onResetAnswer ? (
            <button
              type="button"
              onClick={onResetAnswer}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium cursor-pointer transition-colors"
            >
              ↺ Reset Answer
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono hidden md:block">
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
                  ? 'bg-white text-slate-950 border-white hover:bg-slate-100 cursor-pointer active:scale-98 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200 hover:text-white cursor-pointer active:scale-98'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
            }`}
          >
            {currentIndex + 1 === totalQuestions ? 'Finish Review' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
};
