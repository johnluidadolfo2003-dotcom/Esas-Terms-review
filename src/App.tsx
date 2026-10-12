import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  connectGoogleDrive,
  logout,
  getAccessToken,
  setAccessToken,
} from './services/firebaseAuth';
import {
  DriveItem,
  scanDriveForSubjects,
  listAllDriveFiles,
  fetchDriveFileContent,
} from './services/driveService';
import {
  FlashcardQuestion,
  SubjectCategory,
  parseQuestionsFromText,
  shuffleQuestionChoices,
} from './services/questionParser';
import { DRIVE_COPIED_QUESTIONS } from './data/driveQuestions';
import { StudyHeader } from './components/StudyHeader';
import { SingleFlashcard } from './components/SingleFlashcard';
import { HandGestureController } from './components/HandGestureController';
import { GestureScannerModal } from './components/GestureScannerModal';
import { DriveExplorerModal } from './components/DriveExplorerModal';
import { PasteQuestionsModal } from './components/PasteQuestionsModal';
import { ShareModal } from './components/ShareModal';
import {
  loadSavedCustomQuestions,
  saveCustomQuestions,
  deleteCustomQuestion,
  saveQuestionsToProjectApi,
  downloadDriveQuestionsTs,
} from './services/storageService';
import { parseCurrentLocationParams } from './services/shareService';
import { AiVoiceMode } from './services/speechService';
import { generate70ItemQuiz, TOTAL_QUIZ_ITEMS } from './services/quizService';
import { QuizCongratulationsModal } from './components/QuizCongratulationsModal';

function pseudoRandomRank(id: string, subject: string, seed: number): number {
  const str = `${id}_${subject}_${seed}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  h = (h + 0xe120fc15) >>> 0;
  let t = Math.imul(h ^ (h >>> 15), 1 | h);
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
  return (t ^ (t >>> 14)) >>> 0;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Modals
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedImportNotice, setSharedImportNotice] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [fileQuestionCounts, setFileQuestionCounts] = useState<Record<string, number>>({});

  // Question Banks:
  // 1. Persistent custom questions saved in browser storage (survives updates & refreshes)
  const [customQuestions, setCustomQuestions] = useState<FlashcardQuestion[]>(() =>
    loadSavedCustomQuestions()
  );

  // 2. Dynamically extracted questions from scanned Google Drive files
  const [driveExtractedQuestions, setDriveExtractedQuestions] = useState<FlashcardQuestion[]>([]);

  // 3. Combined questions bank: custom pasted questions + drive extracted + built-in reviewer
  // Deduplicates both by unique ID and normalized question text
  const allQuestions = useMemo(() => {
    const seenIds = new Set<string>();
    const seenTexts = new Set<string>();
    const combined: FlashcardQuestion[] = [];

    const normalizeQuestionText = (text: string) =>
      text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

    // Custom pasted questions come first
    for (const q of customQuestions) {
      const norm = normalizeQuestionText(q.question);
      if (!seenIds.has(q.id) && !seenTexts.has(norm)) {
        seenIds.add(q.id);
        seenTexts.add(norm);
        combined.push(q);
      }
    }

    // Drive-extracted dynamic questions
    for (const q of driveExtractedQuestions) {
      const norm = normalizeQuestionText(q.question);
      if (!seenIds.has(q.id) && !seenTexts.has(norm)) {
        seenIds.add(q.id);
        seenTexts.add(norm);
        combined.push(q);
      }
    }

    // Built-in copied drive questions
    for (const q of DRIVE_COPIED_QUESTIONS) {
      const norm = normalizeQuestionText(q.question);
      if (!seenIds.has(q.id) && !seenTexts.has(norm)) {
        seenIds.add(q.id);
        seenTexts.add(norm);
        combined.push(q);
      }
    }

    return combined;
  }, [customQuestions, driveExtractedQuestions]);

  const [isSyncingProject, setIsSyncingProject] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleSyncQuestionsToProject = async () => {
    if (allQuestions.length === 0) return;
    setIsSyncingProject(true);
    try {
      const res = await saveQuestionsToProjectApi(allQuestions);
      if (res.success) {
        setSyncNotice(
          `Saved all ${allQuestions.length} questions into src/data/driveQuestions.ts! You can commit & push to GitHub for Render.`
        );
        setTimeout(() => setSyncNotice(null), 8000);
      } else {
        setSyncNotice(res.error || 'Failed to save questions to project.');
        setTimeout(() => setSyncNotice(null), 8000);
      }
    } catch {
      setSyncNotice('Failed to connect to dev server.');
      setTimeout(() => setSyncNotice(null), 8000);
    } finally {
      setIsSyncingProject(false);
    }
  };

  const handleDownloadDriveTs = () => {
    if (allQuestions.length === 0) return;
    downloadDriveQuestionsTs(allQuestions);
  };

  // Automatically synchronize loaded questions into driveQuestions.ts whenever the user has additional questions
  useEffect(() => {
    if (allQuestions.length > DRIVE_COPIED_QUESTIONS.length) {
      saveQuestionsToProjectApi(allQuestions).then((res) => {
        if (res.success) {
          setSyncNotice(`Auto-saved all ${allQuestions.length} questions to driveQuestions.ts for Render!`);
          setTimeout(() => setSyncNotice(null), 6000);
        }
      });
    }
  }, [allQuestions]);

  const [loadingFileContent, setLoadingFileContent] = useState(false);
  const [scanMessage, setScanMessage] = useState<string>('');

  // Study session state
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'All'>('All');
  const [studyMode, setStudyMode] = useState<'all' | 'missed' | 'flagged'>('all');
  const [aiVoiceMode, setAiVoiceMode] = useState<AiVoiceMode>('off');
  const [isCameraGestureActive, setIsCameraGestureActive] = useState(false);
  const [isGestureScannerOpen, setIsGestureScannerOpen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState<number>(() => Date.now());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleToggleShuffle = useCallback(() => {
    setIsShuffled(true);
    setShuffleSeed(Date.now() + Math.random());
    setCurrentCardIndex(0);
  }, []);

  const handleDisableShuffle = useCallback(() => {
    setIsShuffled(false);
    setCurrentCardIndex(0);
  }, []);

  // User answers & metrics: mapping questionId -> selectedChoiceId
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(new Set());
  const [missedQuestionIds, setMissedQuestionIds] = useState<Set<string>>(new Set());
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionIncorrectCount, setSessionIncorrectCount] = useState(0);
  const prevQuestionIdRef = React.useRef<string | null>(null);

  // 70-Item Board Exam Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<FlashcardQuestion[]>([]);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isQuizCongratsModalOpen, setIsQuizCongratsModalOpen] = useState(false);

  const handleStartQuiz = useCallback(() => {
    const { quizQuestions: newQuestions } = generate70ItemQuiz(allQuestions);
    setQuizQuestions(newQuestions);
    setQuizCurrentIndex(0);
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setIsQuizCongratsModalOpen(false);
    setIsQuizActive(true);
  }, [allQuestions]);

  const handleFinishQuiz = useCallback(() => {
    setIsQuizSubmitted(true);
    setIsQuizCongratsModalOpen(true);
  }, []);

  const handleExitQuiz = useCallback(() => {
    setIsQuizActive(false);
    setIsQuizSubmitted(false);
    setIsQuizCongratsModalOpen(false);
  }, []);

  const currentQuizQuestion = useMemo(() => {
    if (!isQuizActive || !quizQuestions[quizCurrentIndex]) return null;
    return shuffleQuestionChoices(quizQuestions[quizCurrentIndex], isShuffled, shuffleSeed);
  }, [isQuizActive, quizQuestions, quizCurrentIndex, isShuffled, shuffleSeed]);

  const handleQuizSelectChoice = (choiceId: string) => {
    if (!currentQuizQuestion) return;

    setQuizAnswers((prev) => ({
      ...prev,
      [currentQuizQuestion.id]: choiceId,
    }));

    const cleanChoice = choiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanCorrect = currentQuizQuestion.correctChoiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const isWrong = cleanChoice !== cleanCorrect;
    if (isWrong) {
      setSessionIncorrectCount((prev) => prev + 1);
      setMissedQuestionIds((prev) => new Set(prev).add(currentQuizQuestion.id));
    } else {
      setSessionCorrectCount((prev) => prev + 1);
      setMissedQuestionIds((prev) => {
        const next = new Set(prev);
        next.delete(currentQuizQuestion.id);
        return next;
      });
    }

    if (quizCurrentIndex === quizQuestions.length - 1) {
      setTimeout(() => {
        handleFinishQuiz();
      }, 350);
    }
  };

  const handleQuizResetAnswer = () => {
    if (!currentQuizQuestion) return;
    setQuizAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuizQuestion.id];
      return copy;
    });
  };

  const quizSubjectScores = useMemo(() => {
    const scores: Record<string, { correct: number; total: number }> = {
      'Economics': { correct: 0, total: 0 },
      'Mechanics 1': { correct: 0, total: 0 },
      'Mechanics 2': { correct: 0, total: 0 },
      'EE Laws': { correct: 0, total: 0 },
      'Project Management': { correct: 0, total: 0 },
      'Communication': { correct: 0, total: 0 },
    };

    quizQuestions.forEach((q) => {
      if (!scores[q.subject]) {
        scores[q.subject] = { correct: 0, total: 0 };
      }
      scores[q.subject].total += 1;
      const choice = quizAnswers[q.id];
      if (choice && choice.toUpperCase() === q.correctChoiceId.toUpperCase()) {
        scores[q.subject].correct += 1;
      }
    });

    return scores;
  }, [quizQuestions, quizAnswers]);

  const quizTotalCorrect = useMemo(() => {
    let count = 0;
    quizQuestions.forEach((q) => {
      const choice = quizAnswers[q.id];
      if (choice && choice.toUpperCase() === q.correctChoiceId.toUpperCase()) {
        count++;
      }
    });
    return count;
  }, [quizQuestions, quizAnswers]);

  // 1. Initialize Firebase Auth (non-blocking)
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setAccessToken(accessToken);
        setAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setAccessToken(null);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Parse shared URL parameters (subject, mode, or shared question pack)
  useEffect(() => {
    const handleLocationParams = () => {
      const params = parseCurrentLocationParams();
      if (params.subject) {
        setSelectedSubject(params.subject);
      }
      if (params.mode) {
        setStudyMode(params.mode);
      }
      if (params.sharedQuestions && params.sharedQuestions.length > 0) {
        const incoming = params.sharedQuestions;
        setCustomQuestions((prev) => {
          const existingIds = new Set(prev.map((q) => q.id));
          const toAdd = incoming.filter((q) => !existingIds.has(q.id));
          if (toAdd.length === 0) return prev;
          const merged = [...toAdd, ...prev];
          saveCustomQuestions(merged);
          setSharedImportNotice(
            `Imported ${toAdd.length} shared questions from link. They have been permanently saved to your web app.`
          );
          return merged;
        });
        if (incoming[0]?.subject) {
          setSelectedSubject(incoming[0].subject);
        }
      }
    };

    handleLocationParams();
    window.addEventListener('hashchange', handleLocationParams);
    return () => window.removeEventListener('hashchange', handleLocationParams);
  }, []);

  // 2. Scan drive when user logs in and token is available
  const performDriveScan = useCallback(async (authToken: string) => {
    setIsScanning(true);
    setScanMessage('Scanning Google Drive for subject folders and documents...');
    try {
      const files = await scanDriveForSubjects(authToken);
      setDriveFiles(files);

      const matchedIds = new Set<string>();
      files.forEach((f) => {
        if (f.matchedSubject) {
          matchedIds.add(f.id);
        }
      });

      if (matchedIds.size === 0 && files.length > 0) {
        files.slice(0, 5).forEach((f) => matchedIds.add(f.id));
      }

      setSelectedFileIds(matchedIds);

      if (matchedIds.size > 0) {
        setLoadingFileContent(true);
        setScanMessage(`Extracting questions from ${matchedIds.size} files...`);
        const extractedQuestions: FlashcardQuestion[] = [];
        const counts: Record<string, number> = {};

        for (const file of files) {
          if (matchedIds.has(file.id)) {
            try {
              const text = await fetchDriveFileContent(authToken, file);
              const qList = parseQuestionsFromText(text, file.name, file.id);
              counts[file.id] = qList.length;
              extractedQuestions.push(...qList);
            } catch (err) {
              console.warn(`Could not read file ${file.name}:`, err);
              counts[file.id] = 0;
            }
          }
        }

        setFileQuestionCounts(counts);
        if (extractedQuestions.length > 0) {
          setDriveExtractedQuestions(extractedQuestions);
        }
        setLoadingFileContent(false);
      }
    } catch (err: unknown) {
      console.error('Error scanning drive:', err);
      setScanMessage('Failed to scan Google Drive. Please check permissions.');
    } finally {
      setIsScanning(false);
      setScanMessage('');
    }
  }, []);

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await googleSignIn(false);
      if (res) {
        setUser(res.user);
        if (res.accessToken) {
          setToken(res.accessToken);
          setAccessToken(res.accessToken);
          performDriveScan(res.accessToken);
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: string };
      // Ignore user-cancelled popup
      if (errorObj?.code === 'auth/popup-closed-by-user') {
        return;
      }
      setAuthError(errorObj?.message || 'Failed to sign in with Google');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConnectDrive = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const driveToken = await connectGoogleDrive();
      if (driveToken) {
        setToken(driveToken);
        setAccessToken(driveToken);
        performDriveScan(driveToken);
      }
    } catch (err: unknown) {
      const errorObj = err as { code?: string };
      if (errorObj?.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.warn('Google Drive authorization notice:', err);
      setAuthError(
        'Google Drive permissions were not granted. You remain signed in with your Google account!'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
  };

  // Re-load questions when selected files change
  const reloadQuestionsFromFiles = async (fileIds: Set<string>) => {
    const authToken = token || (await getAccessToken());
    if (!authToken) return;

    setLoadingFileContent(true);
    const extractedQuestions: FlashcardQuestion[] = [];
    const counts: Record<string, number> = { ...fileQuestionCounts };

    for (const file of driveFiles) {
      if (fileIds.has(file.id)) {
        try {
          const text = await fetchDriveFileContent(authToken, file);
          const qList = parseQuestionsFromText(text, file.name, file.id);
          counts[file.id] = qList.length;
          extractedQuestions.push(...qList);
        } catch (err) {
          console.warn(`Could not read file ${file.name}:`, err);
          counts[file.id] = 0;
        }
      }
    }

    setFileQuestionCounts(counts);
    setDriveExtractedQuestions(extractedQuestions);
    setLoadingFileContent(false);
    setCurrentCardIndex(0);
  };

  const handleToggleFile = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      reloadQuestionsFromFiles(next);
      return next;
    });
  };

  const handleSelectAllFiles = () => {
    const allIds = new Set(driveFiles.map((f) => f.id));
    setSelectedFileIds(allIds);
    reloadQuestionsFromFiles(allIds);
  };

  const handleDeselectAllFiles = () => {
    const empty = new Set<string>();
    setSelectedFileIds(empty);
    setDriveExtractedQuestions([]);
    setCurrentCardIndex(0);
  };

  const handleCustomSearch = async (query: string) => {
    const authToken = token || (await getAccessToken());
    if (!authToken) {
      handleSignIn();
      return;
    }

    setIsScanning(true);
    try {
      const res = await listAllDriveFiles(authToken, {
        customQuery: `name contains '${query.replace(/'/g, "\\'")}'`,
        pageSize: 50,
      });

      setDriveFiles((prev) => {
        const existingIds = new Set(prev.map((f) => f.id));
        const newFiles = res.files.filter((f) => !existingIds.has(f.id));
        return [...prev, ...newFiles];
      });
    } catch (err) {
      console.error('Error during custom search:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Add questions pasted from Drive (saves permanently to localStorage)
  const handleAddPastedQuestions = (newQuestions: FlashcardQuestion[], subject: SubjectCategory) => {
    if (newQuestions.length > 0) {
      setCustomQuestions((prev) => {
        const existingIds = new Set(prev.map((q) => q.id));
        const filteredNew = newQuestions.filter((q) => !existingIds.has(q.id));
        const next = [...filteredNew, ...prev];
        saveCustomQuestions(next);
        return next;
      });
      setSelectedSubject(subject);
      setStudyMode('all');
      setCurrentCardIndex(0);
    }
  };

  const handleDeleteCustomQuestion = (questionId: string) => {
    setCustomQuestions((prev) => deleteCustomQuestion(questionId, prev));
  };

  const handleImportBackup = (imported: FlashcardQuestion[]) => {
    setCustomQuestions((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));
      const toAdd = imported.filter((q) => !existingIds.has(q.id));
      const merged = [...toAdd, ...prev];
      saveCustomQuestions(merged);
      return merged;
    });
  };

  const handleImportLocalFile = async (file: File) => {
    try {
      setLoadingFileContent(true);
      let content = '';

      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const JSZipModule = (await import('jszip')).default;
        const zip = await JSZipModule.loadAsync(arrayBuffer);
        const docXml = zip.file('word/document.xml');
        if (docXml) {
          const xmlText = await docXml.async('text');
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
          const paragraphs = xmlDoc.getElementsByTagName('w:p');
          const lines: string[] = [];
          for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            const textNodes = p.getElementsByTagName('w:t');
            let pText = '';
            for (let j = 0; j < textNodes.length; j++) {
              pText += textNodes[j].textContent || '';
            }
            if (pText.trim().length > 0) lines.push(pText.trim());
          }
          content = lines.join('\n');
        }
      } else {
        content = await file.text();
      }

      const fileId = `local-${Date.now()}`;
      const questions = parseQuestionsFromText(content, file.name, fileId);

      const localDriveItem: DriveItem = {
        id: fileId,
        name: file.name,
        mimeType: file.type || 'text/plain',
        matchedSubject: questions[0]?.subject || 'Economics',
      };

      setDriveFiles((prev) => [localDriveItem, ...prev]);
      setSelectedFileIds((prev) => new Set(prev).add(fileId));
      setFileQuestionCounts((prev) => ({ ...prev, [fileId]: questions.length }));
      setDriveExtractedQuestions((prev) => [...questions, ...prev]);
      setCurrentCardIndex(0);
    } catch (err) {
      console.error('Error importing local file:', err);
    } finally {
      setLoadingFileContent(false);
    }
  };

  // Filter questions based on selected subject and study mode
  const filteredQuestions = useMemo(() => {
    let list = allQuestions;

    // Filter by Subject
    if (selectedSubject !== 'All') {
      list = list.filter((q) => q.subject === selectedSubject);
    }

    // Filter by Mode
    if (studyMode === 'missed') {
      list = list.filter((q) => missedQuestionIds.has(q.id));
    } else if (studyMode === 'flagged') {
      list = list.filter((q) => flaggedQuestionIds.has(q.id));
    }

    // Shuffle if enabled: unique random permutation per press and per subject
    if (isShuffled) {
      list = [...list].sort((a, b) => {
        const rankA = pseudoRandomRank(a.id, selectedSubject, shuffleSeed);
        const rankB = pseudoRandomRank(b.id, selectedSubject, shuffleSeed);
        return rankA - rankB;
      });
    }

    return list;
  }, [
    allQuestions,
    selectedSubject,
    studyMode,
    isShuffled,
    shuffleSeed,
    missedQuestionIds,
    flaggedQuestionIds,
  ]);

  // Subject counts
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allQuestions.length };
    allQuestions.forEach((q) => {
      counts[q.subject] = (counts[q.subject] || 0) + 1;
    });
    return counts;
  }, [allQuestions]);

  // Reset current card index when filter changes if out of bounds
  useEffect(() => {
    if (currentCardIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentCardIndex(0);
    }
  }, [filteredQuestions.length, currentCardIndex]);

  const rawCurrentQuestion = filteredQuestions[currentCardIndex];
  const currentQuestion = useMemo(() => {
    if (!rawCurrentQuestion) return rawCurrentQuestion;
    return shuffleQuestionChoices(rawCurrentQuestion, isShuffled, shuffleSeed);
  }, [rawCurrentQuestion, isShuffled, shuffleSeed]);

  const currentSelectedChoice = currentQuestion ? userAnswers[currentQuestion.id] || null : null;

  // Handle choice selection with Red/Green feedback
  const handleSelectChoice = (choiceId: string) => {
    if (!currentQuestion) return;
    const prevAnswer = userAnswers[currentQuestion.id];
    if (prevAnswer === choiceId) return; // Same choice already selected

    // If changing an existing answer on this card, adjust previous counts
    if (prevAnswer) {
      const prevClean = prevAnswer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const prevCorrectClean = currentQuestion.correctChoiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (prevClean === prevCorrectClean) {
        setSessionCorrectCount((prev) => Math.max(0, prev - 1));
      } else {
        setSessionIncorrectCount((prev) => Math.max(0, prev - 1));
      }
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceId,
    }));

    const cleanChoice = choiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanCorrect = currentQuestion.correctChoiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const isWrong = cleanChoice !== cleanCorrect;
    if (isWrong) {
      setSessionIncorrectCount((prev) => prev + 1);
      setMissedQuestionIds((prev) => new Set(prev).add(currentQuestion.id));
    } else {
      setSessionCorrectCount((prev) => prev + 1);
      setMissedQuestionIds((prev) => {
        const next = new Set(prev);
        next.delete(currentQuestion.id);
        return next;
      });
    }
  };

  // Explicitly reset current question answer
  const handleResetCurrentAnswer = () => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Automatically reset the question answer whenever the user leaves the question
  useEffect(() => {
    const prevId = prevQuestionIdRef.current;
    const currentId = currentQuestion?.id || null;

    if (prevId && prevId !== currentId) {
      // User left question prevId! Reset its answer so it can be answered fresh when returned to
      setUserAnswers((prev) => {
        if (!prev[prevId]) return prev;
        const copy = { ...prev };
        delete copy[prevId];
        return copy;
      });
    }

    prevQuestionIdRef.current = currentId;
  }, [currentQuestion?.id]);

  const handleNextCard = () => {
    if (filteredQuestions.length === 0) return;
    const leavingQ = filteredQuestions[currentCardIndex];
    if (leavingQ) {
      setUserAnswers((prev) => {
        const copy = { ...prev };
        delete copy[leavingQ.id];
        return copy;
      });
    }
    setCurrentCardIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      const leavingQ = filteredQuestions[currentCardIndex];
      if (leavingQ) {
        setUserAnswers((prev) => {
          const copy = { ...prev };
          delete copy[leavingQ.id];
          return copy;
        });
      }
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const handleToggleFlag = () => {
    const currentQ = filteredQuestions[currentCardIndex];
    if (!currentQ) return;

    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  // Metrics: session tally
  const correctCount = sessionCorrectCount;
  const incorrectCount = sessionIncorrectCount;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header & Navigation */}
      <StudyHeader
        selectedSubject={selectedSubject}
        onSelectSubject={(subj) => {
          setSelectedSubject(subj);
          setCurrentCardIndex(0);
        }}
        subjectCounts={subjectCounts}
        totalQuestions={filteredQuestions.length}
        studyMode={studyMode}
        onSetStudyMode={(m) => {
          setStudyMode(m);
          setCurrentCardIndex(0);
        }}
        aiVoiceMode={aiVoiceMode}
        onSetAiVoiceMode={setAiVoiceMode}
        missedCount={missedQuestionIds.size}
        flaggedCount={flaggedQuestionIds.size}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        isShuffled={isShuffled}
        onToggleShuffle={handleToggleShuffle}
        onDisableShuffle={handleDisableShuffle}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        customQuestionsCount={customQuestions.length}
        isQuizActive={isQuizActive}
        onStartQuiz={handleStartQuiz}
        onFinishQuiz={handleFinishQuiz}
        onExitQuiz={handleExitQuiz}
        isCameraGestureActive={isCameraGestureActive}
        onToggleCameraGesture={() => setIsCameraGestureActive(!isCameraGestureActive)}
        onOpenGestureScanner={() => setIsGestureScannerOpen(true)}
      />

      {/* Main Flashcard / Quiz Viewport */}
      <main className="flex-1 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-6 pt-1 sm:pt-4 max-w-4xl mx-auto w-full">
        {loadingFileContent ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-10 text-center max-w-md w-full">
            <div className="w-8 h-8 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-base font-semibold text-zinc-200">
              Processing Questions
            </h3>
            <p className="text-xs text-zinc-400 mt-2">
              Loading reviewer terms and multiple-choice questions...
            </p>
          </div>
        ) : isQuizActive ? (
          /* QUIZ MODE VIEWPORT */
          <div className="w-full max-w-4xl flex flex-col gap-3 sm:gap-4">
            {/* Quiz Banner & Quick Navigator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div>
                    <h2 className="text-xs sm:text-base font-bold text-slate-100 leading-tight">
                      70 Items Quiz
                    </h2>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                      Econ (10) · Mech 1 (5) · Mech 2 (5) · EE Laws (20) · PM (20) · Comm (10)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs ml-auto">
                  <span className="text-slate-400 text-[11px] sm:text-xs font-mono">
                    Progress:{' '}
                    <strong className="text-teal-400 font-bold">
                      {Object.keys(quizAnswers).length}
                    </strong>{' '}
                    / {quizQuestions.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleFinishQuiz}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Finish Quiz
                  </button>
                  <button
                    type="button"
                    onClick={handleExitQuiz}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                    title="Exit quiz and return to per-subject review"
                  >
                    Exit Quiz
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.round(
                      (Object.keys(quizAnswers).length / (quizQuestions.length || 1)) * 100
                    )}%`,
                  }}
                />
              </div>

              {/* Scrollable Question Number Grid Navigator (1..70) */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-[11px] font-mono">
                {quizQuestions.map((q, idx) => {
                  const isCurrent = idx === quizCurrentIndex;
                  const isAnswered = Boolean(quizAnswers[q.id]);
                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => setQuizCurrentIndex(idx)}
                      className={`w-7 h-7 rounded-md font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 text-[11px] ${
                        isCurrent
                          ? 'ring-2 ring-emerald-400 bg-emerald-600 text-white shadow-md'
                          : isAnswered
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                          : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                      }`}
                      title={`Item ${idx + 1}: ${q.subject}${isAnswered ? ' (Answered)' : ''}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Quiz Flashcard Question */}
            {currentQuizQuestion && (
              <SingleFlashcard
                question={currentQuizQuestion}
                currentIndex={quizCurrentIndex}
                totalQuestions={quizQuestions.length}
                selectedChoice={quizAnswers[currentQuizQuestion.id] || null}
                onSelectChoice={handleQuizSelectChoice}
                onResetAnswer={handleQuizResetAnswer}
                onNext={() => {
                  if (quizCurrentIndex < quizQuestions.length - 1) {
                    setQuizCurrentIndex((prev) => prev + 1);
                  }
                }}
                onPrevious={() => {
                  if (quizCurrentIndex > 0) {
                    setQuizCurrentIndex((prev) => prev - 1);
                  }
                }}
                hasPrevious={quizCurrentIndex > 0}
                hasNext={quizCurrentIndex < quizQuestions.length - 1}
                isFlagged={flaggedQuestionIds.has(quizQuestions[quizCurrentIndex].id)}
                onToggleFlag={() => {
                  const currentQ = quizQuestions[quizCurrentIndex];
                  if (!currentQ) return;
                  setFlaggedQuestionIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(currentQ.id)) next.delete(currentQ.id);
                    else next.add(currentQ.id);
                    return next;
                  });
                }}
                aiVoiceMode={aiVoiceMode}
                onSetAiVoiceMode={setAiVoiceMode}
              />
            )}
          </div>
        ) : filteredQuestions.length === 0 ? (
          /* Empty State */
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 sm:p-12 text-center max-w-xl w-full flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4 text-zinc-300 font-mono text-sm">
              0 Q
            </div>
            <h3 className="text-lg font-semibold text-slate-100">
              {selectedSubject !== 'All'
                ? `No Questions Found for ${selectedSubject}`
                : 'No Reviewer Questions Found'}
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
              {selectedSubject !== 'All'
                ? `Switch to another subject tab or select All Subjects.`
                : 'Questions from the board exam reviewers are ready.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => setSelectedSubject('All')}
                className="px-4 py-2 bg-teal-600 text-white font-medium text-xs rounded hover:bg-teal-500 cursor-pointer"
              >
                View All Subjects
              </button>
              <button
                type="button"
                onClick={handleStartQuiz}
                className="px-4 py-2 bg-emerald-600 text-white font-medium text-xs rounded hover:bg-emerald-500 cursor-pointer"
              >
                📝 Start 70-Item Quiz
              </button>
            </div>

            {scanMessage && (
              <div className="mt-4 text-xs font-mono text-zinc-400">
                {scanMessage}
              </div>
            )}
          </div>
        ) : (
          /* STRICTLY ONLY 1 QUESTION VISIBLE ON SCREEN */
          currentQuestion && (
            <SingleFlashcard
              question={currentQuestion}
              currentIndex={currentCardIndex}
              totalQuestions={filteredQuestions.length}
              selectedChoice={currentSelectedChoice}
              onSelectChoice={handleSelectChoice}
              onResetAnswer={handleResetCurrentAnswer}
              onNext={handleNextCard}
              onPrevious={handlePreviousCard}
              hasPrevious={currentCardIndex > 0}
              hasNext={currentCardIndex < filteredQuestions.length - 1}
              isFlagged={flaggedQuestionIds.has(currentQuestion.id)}
              onToggleFlag={handleToggleFlag}
              aiVoiceMode={aiVoiceMode}
              onSetAiVoiceMode={setAiVoiceMode}
            />
          )
        )}
      </main>

      {/* Drive Explorer Modal */}
      <DriveExplorerModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        files={driveFiles}
        selectedFileIds={selectedFileIds}
        onToggleFile={handleToggleFile}
        onSelectAll={handleSelectAllFiles}
        onDeselectAll={handleDeselectAllFiles}
        isScanning={isScanning}
        onRescanDrive={() => {
          if (token) {
            performDriveScan(token);
          } else {
            handleConnectDrive();
          }
        }}
        onCustomSearch={handleCustomSearch}
        fileQuestionCounts={fileQuestionCounts}
        onImportFile={handleImportLocalFile}
        userEmail={user?.email || null}
        hasDriveToken={Boolean(token)}
        onSignIn={handleSignIn}
        onConnectDrive={handleConnectDrive}
      />

      {/* Paste Questions Modal */}
      <PasteQuestionsModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onAddQuestions={handleAddPastedQuestions}
        savedCustomQuestions={customQuestions}
        allQuestions={allQuestions}
        onDeleteQuestion={handleDeleteCustomQuestion}
        onImportBackup={handleImportBackup}
        onSyncToProject={handleSyncQuestionsToProject}
        isSyncingProject={isSyncingProject}
      />

      {/* Share Reviewer Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentSubject={selectedSubject}
        customQuestions={customQuestions}
        allQuestions={allQuestions}
      />

      {/* Quiz Congratulations Modal */}
      <QuizCongratulationsModal
        isOpen={isQuizCongratsModalOpen}
        onClose={() => setIsQuizCongratsModalOpen(false)}
        score={quizTotalCorrect}
        totalQuestions={quizQuestions.length}
        subjectScores={quizSubjectScores}
        onRetakeQuiz={handleStartQuiz}
        onReviewAnswers={() => {
          setIsQuizCongratsModalOpen(false);
        }}
      />
      {/* Standalone Gesture Calibration Scanner Modal */}
      <GestureScannerModal
        isOpen={isGestureScannerOpen}
        onClose={() => setIsGestureScannerOpen(false)}
      />

      {/* Hands-Free Camera Gesture Controller */}
      <HandGestureController
        isActive={isCameraGestureActive}
        onClose={() => setIsCameraGestureActive(false)}
        onSelectChoice={isQuizActive ? handleQuizSelectChoice : handleSelectChoice}
        onResetAnswer={isQuizActive ? handleQuizResetAnswer : handleResetCurrentAnswer}
        onNext={
          isQuizActive
            ? () => {
                if (quizCurrentIndex < quizQuestions.length - 1) {
                  setQuizCurrentIndex((prev) => prev + 1);
                } else {
                  handleFinishQuiz();
                }
              }
            : handleNextCard
        }
        isAnswered={
          isQuizActive
            ? Boolean(currentQuizQuestion && quizAnswers[currentQuizQuestion.id])
            : Boolean(currentSelectedChoice)
        }
        currentQuestionId={
          isQuizActive
            ? currentQuizQuestion?.id || ''
            : currentQuestion?.id || ''
        }
        currentQuestion={
          isQuizActive
            ? currentQuizQuestion
            : currentQuestion || null
        }
        selectedChoice={
          isQuizActive
            ? (currentQuizQuestion ? quizAnswers[currentQuizQuestion.id] || null : null)
            : currentSelectedChoice
        }
        correctChoiceId={
          isQuizActive
            ? currentQuizQuestion?.correctChoiceId
            : currentQuestion?.correctChoiceId
        }
      />
    </div>
  );
}
