import React, { useEffect, useCallback, useState, useRef } from 'react';
import { FlashcardQuestion, generateContextualExplanation } from '../services/questionParser';
import {
  AiVoiceMode,
  stopSpeech,
  speakPhrase,
  previewReaderVoice,
  getSpeechErrorMessage,
  getSpeechConfiguration,
  getReaderState,
  subscribeReaderState,
} from '../services/speechService';
import {
  GeminiExplanation,
  fetchGeminiExplanation,
  askGeminiTutorQuestion,
  getGeminiConfig,
} from '../services/geminiService';
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
  const [voiceError, setVoiceError] = useState('');
  const [readerPhase, setReaderPhase] = useState(getReaderState);
  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeReaderState(setReaderPhase);
    getSpeechConfiguration().then(config => {
      if (active && !config.configured) setVoiceError(getSpeechErrorMessage('speech-not-configured'));
    }).catch(() => { if (active) setVoiceError('Deploy the Gemini audio server to enable reading.'); });
    return () => { active = false; unsubscribe(); };
  }, []);
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
    currentSeqIdRef.current++;
    stopSpeech();
    clearAutoAdvanceTimer();
    setSpeechStatus('paused');
  };

  const speechFailed = useCallback((error?: string) => {
    setSpeechStatus('paused');
    setVoiceError(getSpeechErrorMessage(error));
  }, []);

  const readPhrase = useCallback((text: string, rate: number, onEnd: () => void) => {
    setVoiceError('');
    return speakPhrase(text, rate, onEnd, speechFailed);
  }, [speechFailed]);

  const handleTestVoice = () => {
    handlePauseSpeech();
    setVoiceError('');
    previewReaderVoice(() => setSpeechStatus('paused'), speechFailed);
  };

  // Gemini AI State & Handlers
  const [geminiExplanation, setGeminiExplanation] = useState<GeminiExplanation | null>(null);
  const [loadingGemini, setLoadingGemini] = useState<boolean>(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [showGeminiPanel, setShowGeminiPanel] = useState<boolean>(false);
  const [geminiQuery, setGeminiQuery] = useState<string>('');
  const [tutorQAs, setTutorQAs] = useState<{ query: string; answer: string }[]>([]);
  const [askingTutor, setAskingTutor] = useState<boolean>(false);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(true);
  const geminiAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    getGeminiConfig().then(cfg => {
      if (active) setGeminiConfigured(cfg.configured);
    }).catch(() => {
      if (active) setGeminiConfigured(false);
    });
    return () => { active = false; };
  }, []);

  // Reset Gemini state when card changes
  useEffect(() => {
    setGeminiExplanation(null);
    setGeminiError(null);
    setShowGeminiPanel(false);
    setGeminiQuery('');
    setTutorQAs([]);
    setLoadingGemini(false);
    setAskingTutor(false);
    if (geminiAbortRef.current) {
      geminiAbortRef.current.abort();
      geminiAbortRef.current = null;
    }
  }, [question.id]);

  const handleFetchGeminiExplanation = useCallback(async () => {
    if (loadingGemini) return;
    setShowGeminiPanel(prev => !prev);
    if (geminiExplanation) return;

    setLoadingGemini(true);
    setGeminiError(null);

    const controller = new AbortController();
    geminiAbortRef.current = controller;

    try {
      const expl = await fetchGeminiExplanation({
        question: question.question,
        choices: question.choices,
        correctChoiceId: question.correctChoiceId,
        subject: question.subject,
        userChoice: selectedChoice || undefined,
      }, controller.signal);
      setGeminiExplanation(expl);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setGeminiError(err.message || 'Failed to connect to Gemini API');
    } finally {
      setLoadingGemini(false);
      geminiAbortRef.current = null;
    }
  }, [loadingGemini, geminiExplanation, question, selectedChoice]);

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiQuery.trim() || askingTutor) return;

    const query = geminiQuery.trim();
    setGeminiQuery('');
    setAskingTutor(true);

    try {
      const answer = await askGeminiTutorQuestion(
        {
          question: question.question,
          choices: question.choices,
          correctChoiceId: question.correctChoiceId,
          subject: question.subject,
        },
        query
      );
      setTutorQAs(prev => [...prev, { query, answer }]);
    } catch (err: any) {
      setTutorQAs(prev => [
        ...prev,
        { query, answer: `Could not retrieve answer: ${err?.message || 'Server error'}` },
      ]);
    } finally {
      setAskingTutor(false);
    }
  };

  const handleReadGeminiExplanation = () => {
    if (!geminiExplanation) return;
    const textToRead = `${geminiExplanation.summary}. ${geminiExplanation.detailedAnalysis}. ${geminiExplanation.boardExamTip ? `Board exam tip: ${geminiExplanation.boardExamTip}` : ''}`;
    readPhrase(textToRead, speechRate, () => setSpeechStatus('idle'));
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
    readPhrase(questionPrompt, speechRate, () => {
      if (seqId !== currentSeqIdRef.current) return;

      // Step 2: Speak Choices with distinct natural pauses
      setSpeechStatus('reading_options');
      const optionsText = question.choices
        .map((c) => `Option ${c.id}. ${c.text}`)
        .join('. ');

      readPhrase(optionsText, speechRate, () => {
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
          }. ${correctChoice ? correctChoice.text : ''}.`;

          readPhrase(answerText, speechRate, () => {
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

            readPhrase(explText, speechRate, () => {
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
      currentSeqIdRef.current++;
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

      readPhrase(fullSpeechText, speechRate, () => {
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
                Gemini · Puck
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
              {/* Test Voice Button */}
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-[10px] font-medium cursor-pointer"
                title="Preview the Gemini narrator"
              >
                Test Voice
              </button>

              <button
                  type="button"
                  onClick={handleReplaySpeech}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-[11px] cursor-pointer flex items-center gap-1"
                  title="Play / Re-read aloud"
                >
                  Play
              </button>
              {speechStatus !== 'paused' && speechStatus !== 'idle' && (
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
            <p className="w-full text-[11px] text-zinc-400" role="status" aria-live="polite">
              {voiceError || (readerPhase === 'loading' ? 'Preparing Gemini audio…' : 'One Gemini narrator · Clear US English delivery')}
            </p>
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

            {/* Gemini AI Explanation Toggle */}
            <div className="border-t border-white/10 pt-2.5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleFetchGeminiExplanation}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Deep engineering analysis and step-by-step derivation from Gemini 3.8 Flash"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span>{showGeminiPanel ? 'Hide Gemini Analysis' : 'Gemini 3.8 Flash Deep Dive'}</span>
              </button>
              <span className="text-[10px] text-zinc-400 font-mono hidden xs:inline">
                Formulas • Derivations • Board Tips
              </span>
            </div>
          </div>
        )}

        {/* Gemini AI Deep Dive & Tutor Panel */}
        {showGeminiPanel && (
          <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 flex flex-col gap-3 shadow-xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  Gemini 3.8 Flash
                </span>
                <h3 className="font-bold text-sm text-zinc-100">
                  Engineering Analysis & Tutor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGeminiPanel(false)}
                className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Loading State */}
            {loadingGemini && (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-zinc-400">
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-mono">Consulting Gemini 3.8 Flash for detailed engineering derivation...</p>
              </div>
            )}

            {/* Error State */}
            {geminiError && !loadingGemini && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex flex-col gap-2">
                <p className="font-semibold">{geminiError}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFetchGeminiExplanation}
                    className="px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-900 border border-rose-700 text-white font-medium text-[11px] cursor-pointer"
                  >
                    Retry Analysis
                  </button>
                  {!geminiConfigured && (
                    <span className="text-[10px] text-zinc-400">
                      (Configure GEMINI_API_KEY in server environment)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Explanation Content */}
            {geminiExplanation && !loadingGemini && (
              <div className="flex flex-col gap-3">
                {/* Summary */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold tracking-wider block mb-1">
                    Summary
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                    {geminiExplanation.summary}
                  </p>
                </div>

                {/* Detailed Analysis */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                    Detailed Engineering Theory & Physics
                  </span>
                  <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60">
                    {geminiExplanation.detailedAnalysis}
                  </div>
                </div>

                {/* Formula or Standard */}
                {geminiExplanation.formulaOrRule && (
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                      Governing Equation / Code Clause
                    </span>
                    <code className="text-xs font-mono text-emerald-300 break-words">
                      {geminiExplanation.formulaOrRule}
                    </code>
                  </div>
                )}

                {/* Board Exam High-Yield Tip */}
                {geminiExplanation.boardExamTip && (
                  <div className="bg-amber-950/30 border border-amber-800/50 p-2.5 rounded-lg flex flex-col gap-1 text-amber-200">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                      PRC Board Exam High-Yield Tip
                    </span>
                    <p className="text-xs leading-relaxed">
                      {geminiExplanation.boardExamTip}
                    </p>
                  </div>
                )}

                {/* Options Breakdown */}
                {geminiExplanation.optionsBreakdown && geminiExplanation.optionsBreakdown.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                      Choice Distractor Analysis
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {geminiExplanation.optionsBreakdown.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded border text-xs flex flex-col gap-0.5 ${
                            opt.status === 'correct'
                              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                              : 'bg-zinc-950/50 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          <div className="font-semibold flex items-center gap-1">
                            <span className="font-mono">Option {opt.id}:</span>
                            <span className="text-[10px] uppercase font-bold">
                              {opt.status === 'correct' ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                          <span className="text-[11px] leading-snug">{opt.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read Aloud Action */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleReadGeminiExplanation}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-xs cursor-pointer flex items-center gap-1.5"
                    title="Listen to this Gemini explanation read aloud in natural US voice"
                  >
                    <svg className="w-3.5 h-3.5 text-zinc-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    <span>Listen to Gemini Analysis</span>
                  </button>

                  <span className="text-[10px] font-mono text-zinc-500">
                    Model: gemini-3.8-flash
                  </span>
                </div>

                {/* Interactive Follow-Up Questions (AI Tutor Q&A) */}
                <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                    Ask Gemini Tutor
                  </span>

                  {/* Previous Q&A Thread */}
                  {tutorQAs.length > 0 && (
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                      {tutorQAs.map((qa, index) => (
                        <div key={index} className="flex flex-col gap-1 text-xs bg-zinc-950/70 p-2.5 rounded border border-zinc-800">
                          <div className="font-semibold text-zinc-300 flex items-center gap-1">
                            <span className="text-zinc-500 font-mono">Q:</span>
                            <span>{qa.query}</span>
                          </div>
                          <div className="text-zinc-400 pl-4 border-l border-zinc-700 leading-relaxed">
                            {qa.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Question Input Form */}
                  <form onSubmit={handleAskTutor} className="flex gap-2">
                    <input
                      type="text"
                      value={geminiQuery}
                      onChange={(e) => setGeminiQuery(e.target.value)}
                      placeholder="Ask a clarifying question about this problem..."
                      disabled={askingTutor}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={askingTutor || !geminiQuery.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs cursor-pointer shrink-0 transition-colors"
                    >
                      {askingTutor ? 'Thinking...' : 'Ask'}
                    </button>
                  </form>
                </div>
              </div>
            )}
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFetchGeminiExplanation}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                title="Open Gemini 3.8 Flash engineering analysis"
              >
                <span>Gemini Analysis</span>
              </button>
              <div className="text-[11px] text-zinc-500 font-mono hidden md:block">
                [A-D] answer • [←][→] navigate
              </div>
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
