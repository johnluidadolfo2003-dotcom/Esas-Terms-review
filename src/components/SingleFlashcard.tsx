import React, { useEffect, useCallback, useState, useRef } from 'react';
import { FlashcardQuestion, generateContextualExplanation } from '../services/questionParser';
import {
  AiVoiceMode,
  stopSpeech,
  speakPhrase,
  testDeepMaleVoice,
  setVoiceDepth,
  VoiceDepth,
} from '../services/speechService';
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

  // Mocking pop-up state on wrong answer
  const [showMockingPopup, setShowMockingPopup] = useState(false);
  const mockingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play audio sound & trigger 0.75-second pop-up on wrong answer selection
  const prevSelectedChoiceRef = useRef<string | null>(selectedChoice);
  useEffect(() => {
    if (selectedChoice && selectedChoice !== prevSelectedChoiceRef.current) {
      const curSelected = selectedChoice.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const curCorrect = question.correctChoiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const isAnsCorrect = curSelected === curCorrect;
      playAnswerSound(isAnsCorrect);

      if (!isAnsCorrect) {
        if (mockingTimerRef.current) {
          clearTimeout(mockingTimerRef.current);
        }
        setShowMockingPopup(true);
        mockingTimerRef.current = setTimeout(() => {
          setShowMockingPopup(false);
        }, 750);
      }
    }
    prevSelectedChoiceRef.current = selectedChoice;
  }, [selectedChoice, question.correctChoiceId]);

  useEffect(() => {
    setShowMockingPopup(false);
    if (mockingTimerRef.current) {
      clearTimeout(mockingTimerRef.current);
    }
  }, [question.id]);

  useEffect(() => {
    return () => {
      if (mockingTimerRef.current) {
        clearTimeout(mockingTimerRef.current);
      }
    };
  }, []);

  // Voice Engine State
  const [speechStatus, setSpeechStatus] = useState<
    'idle' | 'reading_question' | 'reading_options' | 'waiting_user' | 'ai_answering' | 'reading_explanation' | 'paused'
  >('idle');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [voiceDepth, setVoiceDepthState] = useState<VoiceDepth>('deep');
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

  const handleSetVoiceDepth = (depth: VoiceDepth) => {
    setVoiceDepth(depth);
    setVoiceDepthState(depth);
  };

  const handleTestVoice = () => {
    stopSpeech();
    clearAutoAdvanceTimer();
    testDeepMaleVoice(voiceDepth);
  };

  const handleReplaySpeech = useCallback(() => {
    stopSpeech();
    clearAutoAdvanceTimer();

    if (aiVoiceMode === 'off') {
      setSpeechStatus('idle');
      return;
    }

    const seqId = ++currentSeqIdRef.current;

    // Step 1: Speak Question with conversational podcast cadence
    setSpeechStatus('reading_question');
    const questionPrompt = `Item ${currentIndex + 1}. ${question.question}`;
    speakPhrase(questionPrompt, speechRate, () => {
      if (seqId !== currentSeqIdRef.current) return;

      // Step 2: Speak Choices with distinct natural pauses
      setSpeechStatus('reading_options');
      const optionsText = question.choices
        .map((c) => `Option ${c.id}... ${c.text}`)
        .join('. ... ');

      speakPhrase(optionsText, speechRate, () => {
        if (seqId !== currentSeqIdRef.current) return;

        if (aiVoiceMode === 'ai_reads_you_answer') {
          setSpeechStatus('waiting_user');
        } else if (aiVoiceMode === 'ai_reads_and_answers') {
          setSpeechStatus('ai_answering');
          const correctChoice = question.choices.find(
            (c) => c.id.toUpperCase() === question.correctChoiceId.toUpperCase()
          );
          const answerText = `The correct answer is Option ${
            question.correctChoiceId
          }... ${correctChoice ? correctChoice.text : ''}.`;

          speakPhrase(answerText, speechRate, () => {
            if (seqId !== currentSeqIdRef.current) return;

            // Trigger AI answer selection
            onSelectChoice(question.correctChoiceId);

            // Speak explanation in podcast style
            const expl = generateContextualExplanation(
              question.question,
              question.choices,
              question.correctChoiceId,
              question.subject,
              question.explanation
            );

            setSpeechStatus('reading_explanation');
            const explText = `Here's why: ${expl}`;

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
        ? `That's correct! Option ${selectedChoice}.`
        : `Not quite. The correct answer is Option ${question.correctChoiceId}.`;

      const expl = generateContextualExplanation(
        question.question,
        question.choices,
        question.correctChoiceId,
        question.subject,
        question.explanation
      );

      const fullSpeechText = `${resultIntro} Here's why: ${expl}`;
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
      {/* Flashcard Header Bar */}
      <div className="flex items-center justify-between px-0.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-300 font-semibold bg-[#181a21] px-2.5 py-0.5 rounded-md text-xs border border-[#272935]">
            {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-[#181a21] text-zinc-300 border border-[#272935] text-[11px] font-medium">
            {question.subject}
          </span>
        </div>
      </div>

      {/* Main Single Flashcard Surface */}
      <div className="bg-[#181a21] border border-[#272935] rounded-2xl p-4 sm:p-7 flex flex-col gap-3 sm:gap-5 shadow-xl relative overflow-hidden">
        {/* Source info */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 border-b border-[#272935] pb-2 font-mono">
          <div className="truncate max-w-[220px] sm:max-w-md">
            <span className="text-zinc-500">Source: </span>
            <span className="text-zinc-300 font-medium">{question.sourceFileName}</span>
          </div>
          {question.questionNumber && (
            <span className="text-zinc-500 shrink-0">#{question.questionNumber}</span>
          )}
        </div>

        {/* Voice Status Banner when active */}
        {aiVoiceMode !== 'off' && (
          <div className="bg-[#131418] border border-[#272935] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-200 border border-zinc-700"
              >
                {aiVoiceMode === 'ai_reads_you_answer' ? 'Read Questions' : 'Auto Read & Answer'}
              </span>

              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                Deep Baritone
              </span>

              {/* Status Indicator */}
              <span className="text-zinc-300 font-medium flex items-center gap-1.5">
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
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                    <span className="text-sky-300 font-semibold">Revealing answer...</span>
                  </>
                )}
                {speechStatus === 'reading_explanation' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Explaining answer...</span>
                  </>
                )}
                {speechStatus === 'paused' && (
                  <span className="text-zinc-400 italic">Paused</span>
                )}
                {speechStatus === 'idle' && (
                  <span className="text-zinc-400">Ready</span>
                )}
              </span>
            </div>

              {/* Voice Controls: Replay / Pause & Speed & Auto-Next */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Voice Depth Selector (Baritone vs Ultra Deep) */}
              <div className="flex items-center rounded border border-zinc-800 bg-zinc-900 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleSetVoiceDepth('deep')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
                    voiceDepth === 'deep'
                      ? 'bg-zinc-700 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Deep Baritone Voice (0.70 pitch)"
                >
                  Baritone
                </button>
                <button
                  type="button"
                  onClick={() => handleSetVoiceDepth('ultra_deep')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
                    voiceDepth === 'ultra_deep'
                      ? 'bg-zinc-700 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Ultra Deep Bass Voice (0.58 pitch)"
                >
                  Deep Bass
                </button>
              </div>

              {/* Test Voice Button */}
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-[10px] font-medium cursor-pointer"
                title="Hear sample of the deep male podcast voice"
              >
                Test Voice
              </button>

              {speechStatus === 'paused' || speechStatus === 'idle' ? (
                <button
                  type="button"
                  onClick={handleReplaySpeech}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-[11px] cursor-pointer flex items-center gap-1"
                  title="Play / Re-read aloud"
                >
                  Play
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseSpeech}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-[11px] cursor-pointer flex items-center gap-1"
                  title="Pause speech"
                >
                  Pause
                </button>
              )}

              {/* Speed Toggles */}
              <div className="flex items-center rounded border border-zinc-800 bg-zinc-900 p-0.5">
                {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeechRate(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                      speechRate === rate
                        ? 'bg-zinc-700 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
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
                  className={`px-2 py-1 rounded text-[10px] font-medium border cursor-pointer ${
                    autoAdvance
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
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
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-100 leading-snug">
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
              'relative flex items-center justify-between p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border text-left transition-all min-h-[44px] ';

            if (!isAnswered) {
              buttonClasses +=
                'bg-[#20222a] border-[#2c2f3c] text-zinc-100 hover:border-zinc-500 hover:bg-[#252833] cursor-pointer active:scale-[0.99]';
            } else if (isUserSelected && !isCorrectOption) {
              // WRONG SELECTED: Red
              buttonClasses +=
                'bg-rose-600 border-rose-500 text-white font-semibold shadow-md ring-2 ring-rose-400/50';
            } else if (isCorrectOption) {
              // CORRECT ANSWER: Emerald Green
              buttonClasses +=
                'bg-emerald-600 border-emerald-500 text-white font-semibold shadow-md ring-2 ring-emerald-400/50';
            } else {
              // Other unselected options: muted
              buttonClasses +=
                'bg-[#16171e]/50 border-[#22242d] text-zinc-400 opacity-50 pointer-events-none';
            }

            return (
              <button
                key={`${question.id}-${choice.id}-${idx}`}
                type="button"
                data-choice-id={cleanChoiceId}
                disabled={isAnswered}
                onClick={() => onSelectChoice(choice.id)}
                className={buttonClasses}
              >
                <div className="flex items-start gap-2.5 sm:gap-3.5 pr-2 sm:pr-4">
                  <span
                    className={`font-mono text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border shrink-0 font-bold ${
                      !isAnswered
                        ? 'bg-[#15171e] border-[#2d303d] text-zinc-200'
                        : isUserSelected && !isCorrectOption
                        ? 'bg-rose-700 border-rose-400 text-white'
                        : isCorrectOption
                        ? 'bg-emerald-700 border-emerald-400 text-white'
                        : 'bg-[#181a21] border-[#272935] text-zinc-400'
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
                        Correct
                      </span>
                    )}
                    {!isUserSelected && isCorrectOption && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-300 text-emerald-100 font-bold">
                        Correct Answer
                      </span>
                    )}
                    {isUserSelected && !isCorrectOption && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-300 text-rose-100 font-bold">
                        Your Choice
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
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-100 ring-1 ring-emerald-500/30'
                : 'bg-rose-950/80 border-rose-500/80 text-rose-100 ring-1 ring-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <span>{isCorrect ? 'Correct Answer' : 'Incorrect Choice'}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {onResetAnswer && (
                  <button
                    type="button"
                    onClick={onResetAnswer}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold bg-black/30 hover:bg-black/50 text-white border border-white/20 transition-colors cursor-pointer"
                    title="Clear answer and try again"
                  >
                    Try Again
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
                  <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-zinc-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    Explanation
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-normal">
                    {displayExplanation}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Card Controls & Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#272935] text-xs sm:text-sm gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border font-semibold transition-colors min-h-[40px] flex items-center justify-center ${
              hasPrevious
                ? 'bg-[#20222a] border-[#2f323e] text-zinc-200 hover:bg-[#272935] hover:text-white cursor-pointer active:scale-98'
                : 'bg-[#181a21] border-[#22242c] text-zinc-600 opacity-40 cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>

          {isAnswered && onResetAnswer ? (
            <button
              type="button"
              onClick={onResetAnswer}
              className="px-3 py-2 rounded-lg border border-[#2f323e] bg-[#20222a] hover:bg-[#272935] text-zinc-200 hover:text-white text-xs font-medium cursor-pointer transition-colors"
            >
              Reset Answer
            </button>
          ) : (
            <div className="text-[11px] text-zinc-500 font-mono hidden md:block">
              [A-D] answer • [←][→] navigate
            </div>
          )}

          <button
            type="button"
            data-action="next-card"
            onClick={onNext}
            disabled={!hasNext}
            className={`relative overflow-hidden px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border font-semibold transition-all shadow-sm min-h-[40px] flex items-center justify-center ${
              hasNext
                ? isAnswered
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-200 hover:bg-white cursor-pointer active:scale-98'
                  : 'bg-[#20222a] border-[#2f323e] text-zinc-200 hover:bg-[#272935] hover:text-white cursor-pointer active:scale-98'
                : 'bg-[#181a21] border-[#22242c] text-zinc-600 opacity-40 cursor-not-allowed'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{currentIndex + 1 === totalQuestions ? 'Finish Review' : 'Next Question →'}</span>
            </span>
          </button>
        </div>

        {/* 0.75-Second Pop-up on Wrong Answer: Centered directly in flashcard with blurred background */}
        {showMockingPopup && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#181a21]/95 border-2 border-rose-500 rounded-2xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3 backdrop-blur-lg ring-4 ring-rose-500/25">
              <span className="text-6xl animate-bounce">🖕</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 tracking-wider uppercase text-center drop-shadow-sm">
                Ulol BOBO
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
