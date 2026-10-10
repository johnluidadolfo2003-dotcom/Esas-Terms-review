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
} from './services/questionParser';
import { DRIVE_COPIED_QUESTIONS } from './data/driveQuestions';
import { StudyHeader } from './components/StudyHeader';
import { SingleFlashcard } from './components/SingleFlashcard';
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
  const allQuestions = useMemo(() => {
    const seenIds = new Set<string>();
    const combined: FlashcardQuestion[] = [];

    // Custom pasted questions come first so user can immediately practice what they just added
    for (const q of customQuestions) {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
        combined.push(q);
      }
    }

    // Drive-extracted dynamic questions
    for (const q of driveExtractedQuestions) {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
        combined.push(q);
      }
    }

    // Built-in copied drive questions
    for (const q of DRIVE_COPIED_QUESTIONS) {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
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
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // User answers & metrics: mapping questionId -> selectedChoiceId
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(new Set());
  const [missedQuestionIds, setMissedQuestionIds] = useState<Set<string>>(new Set());

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

    // Shuffle if enabled
    if (isShuffled) {
      list = [...list].sort((a, b) => {
        const hashA = (a.id.charCodeAt(0) * 31 + a.id.length) % 100;
        const hashB = (b.id.charCodeAt(0) * 31 + b.id.length) % 100;
        return hashA - hashB;
      });
    }

    return list;
  }, [allQuestions, selectedSubject, studyMode, isShuffled, missedQuestionIds, flaggedQuestionIds]);

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

  // Handle choice selection with Red/Green feedback
  const handleSelectChoice = (choiceId: string) => {
    const currentQ = filteredQuestions[currentCardIndex];
    if (!currentQ) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choiceId,
    }));

    const isWrong = choiceId.toUpperCase() !== currentQ.correctChoiceId.toUpperCase();
    if (isWrong) {
      setMissedQuestionIds((prev) => new Set(prev).add(currentQ.id));
    } else {
      setMissedQuestionIds((prev) => {
        const next = new Set(prev);
        next.delete(currentQ.id);
        return next;
      });
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < filteredQuestions.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
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

  // Metrics
  const correctCount = useMemo(() => {
    let count = 0;
    allQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans && ans.toUpperCase() === q.correctChoiceId.toUpperCase()) {
        count++;
      }
    });
    return count;
  }, [allQuestions, userAnswers]);

  const incorrectCount = useMemo(() => {
    let count = 0;
    allQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans && ans.toUpperCase() !== q.correctChoiceId.toUpperCase()) {
        count++;
      }
    });
    return count;
  }, [allQuestions, userAnswers]);

  const currentQuestion = filteredQuestions[currentCardIndex];
  const currentSelectedChoice = currentQuestion ? userAnswers[currentQuestion.id] || null : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header & Navigation */}
      <StudyHeader
        userEmail={user?.email || null}
        onLogout={handleLogout}
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
        missedCount={missedQuestionIds.size}
        flaggedCount={flaggedQuestionIds.size}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        isShuffled={isShuffled}
        onToggleShuffle={() => setIsShuffled((prev) => !prev)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onSignIn={handleSignIn}
        isSigningIn={authLoading}
        customQuestionsCount={customQuestions.length}
        syncedFilesCount={selectedFileIds.size || 6}
        isScanning={isScanning}
        onSyncQuestionsToProject={handleSyncQuestionsToProject}
        isSyncingProject={isSyncingProject}
        syncNotice={syncNotice}
        onDownloadDriveTs={handleDownloadDriveTs}
      />

      {/* Auth Error / Notice Banner */}
      {authError && (
        <div className="bg-rose-950 border-b border-rose-800 text-rose-200 px-4 py-2.5 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="font-bold">!</span>
            <span className="flex-1">{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="text-rose-400 hover:text-white px-2 py-0.5 rounded border border-rose-800/80 hover:bg-rose-900 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Shared Questions Import Notification Banner */}
      {sharedImportNotice && (
        <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="font-bold">✓</span>
            <span className="flex-1">{sharedImportNotice}</span>
            <button
              type="button"
              onClick={() => setSharedImportNotice(null)}
              className="text-emerald-400 hover:text-white px-2 py-0.5 rounded border border-emerald-800/80 hover:bg-emerald-900 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Flashcard Study Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-5xl mx-auto w-full">
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
        ) : filteredQuestions.length === 0 ? (
          /* Empty State */
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 sm:p-12 text-center max-w-xl w-full flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4 text-zinc-300 font-mono text-sm">
              0 Q
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              {studyMode === 'missed'
                ? 'No Missed Questions'
                : studyMode === 'flagged'
                ? 'No Flagged Questions'
                : selectedSubject !== 'All'
                ? `No Questions Found for ${selectedSubject}`
                : 'No Reviewer Questions Found'}
            </h3>
            <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">
              {studyMode === 'missed'
                ? 'You have answered all attempted questions correctly.'
                : studyMode === 'flagged'
                ? 'You have not flagged any questions for review yet.'
                : selectedSubject !== 'All'
                ? `Switch to another subject tab or view All Cards.`
                : 'All questions from the Drive reviewers are ready.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => setStudyMode('all')}
                className="px-4 py-2 bg-zinc-100 text-zinc-950 font-medium text-xs rounded hover:bg-white"
              >
                View All Cards
              </button>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(true)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded hover:bg-zinc-700"
              >
                + Paste More Questions
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
              onNext={handleNextCard}
              onPrevious={handlePreviousCard}
              hasPrevious={currentCardIndex > 0}
              hasNext={currentCardIndex < filteredQuestions.length - 1}
              isFlagged={flaggedQuestionIds.has(currentQuestion.id)}
              onToggleFlag={handleToggleFlag}
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
    </div>
  );
}
