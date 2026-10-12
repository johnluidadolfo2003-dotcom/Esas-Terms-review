import { auth } from './firebaseAuth';
import type { FlashcardQuestion } from './questionParser';
export async function cloudRequest(method: 'GET' | 'PUT', questions?: FlashcardQuestion[], version?: number, signal?: AbortSignal) {
  if (!auth.currentUser) throw new Error('Sign in to sync questions.');
  const token = await auth.currentUser.getIdToken();
  const response = await fetch('/api/questions', {
    method, signal,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(method === 'PUT' ? { body: JSON.stringify({ questions, version }) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Cloud saving failed.');
  return data as { questions: FlashcardQuestion[]; version: number; success?: boolean; count?: number };
}
