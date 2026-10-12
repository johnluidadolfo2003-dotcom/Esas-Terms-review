import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { User } from 'firebase/auth';
import type { FlashcardQuestion } from './questionParser';
import { cloudRequest } from './cloudStorage';
import { loadSavedCustomQuestions, saveCustomQuestions, setQuestionStorageScope } from './storageService';

export function useCloudSync(user: User | null, questions: FlashcardQuestion[], setQuestions: Dispatch<SetStateAction<FlashcardQuestion[]>>) {
  const [status, setStatus] = useState('Questions saved in this browser. Sign in to sync across devices.');
  const [readyUid, setReadyUid] = useState<string | null>(null);
  const state = useRef({ version: 0, generation: 0, failed: false });
  const latest = useRef(questions);
  latest.current = questions;
  const queue = useRef(Promise.resolve());

  useEffect(() => {
    const generation = ++state.current.generation;
    state.current.failed = false;
    setReadyUid(null);
    setQuestionStorageScope(user?.uid || null);
    const local = loadSavedCustomQuestions();
    setQuestions(local);
    if (!user) { setStatus('Questions saved in this browser. Sign in to sync across devices.'); return; }
    const controller = new AbortController();
    setStatus('Loading your cloud question bank…');
    cloudRequest('GET', undefined, undefined, controller.signal).then((data) => {
      if (generation !== state.current.generation) return;
      const merged = new Map(data.questions.map((q) => [q.id, q]));
      // Retain edits made locally while the cloud bank was loading.
      for (const q of latest.current) merged.set(q.id, q);
      const next = [...merged.values()];
      state.current.version = data.version;
      setQuestions(next);
      if (!saveCustomQuestions(next)) setStatus('Browser backup could not be saved. Export a JSON backup.');
      setReadyUid(user.uid);
      setStatus('Cloud bank loaded. Changes sync automatically.');
    }).catch((error) => {
      if (!controller.signal.aborted && generation === state.current.generation) setStatus(`${error.message} Your browser backup is still available.`);
    });
    return () => { controller.abort(); ++state.current.generation; };
  }, [user?.uid, setQuestions]);

  useEffect(() => {
    if (!user || readyUid !== user.uid) return;
    const generation = state.current.generation;
    const timeout = setTimeout(() => {
      const snapshot = questions;
      queue.current = queue.current.then(async () => {
        if (generation !== state.current.generation || state.current.failed) return;
        setStatus('Saving questions to cloud…');
        try {
          const result = await cloudRequest('PUT', snapshot, state.current.version);
          if (generation !== state.current.generation) return;
          state.current.version = result.version;
          setStatus('Questions saved to your account.');
        } catch (error) {
          if (generation !== state.current.generation) return;
          state.current.failed = true;
          setStatus(`${error instanceof Error ? error.message : 'Cloud saving failed.'} Browser backup retained. Reload to retry.`);
        }
      });
    }, 800);
    return () => clearTimeout(timeout);
  }, [questions, readyUid, user?.uid]);
  return status;
}
