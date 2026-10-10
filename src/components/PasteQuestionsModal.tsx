import React, { useState, useMemo } from 'react';
import { SubjectCategory, FlashcardQuestion, parseQuestionsFromText } from '../services/questionParser';
import {
  exportCustomQuestionsJson,
  importCustomQuestionsJson,
  formatQuestionsAsTypeScriptCode,
  downloadDriveQuestionsTs,
} from '../services/storageService';
import { copyToClipboard } from '../services/shareService';

interface PasteQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (questions: FlashcardQuestion[], subject: SubjectCategory) => void;
  savedCustomQuestions: FlashcardQuestion[];
  allQuestions?: FlashcardQuestion[];
  onDeleteQuestion: (id: string) => void;
  onImportBackup: (importedQuestions: FlashcardQuestion[]) => void;
  onSyncToProject?: () => void;
  isSyncingProject?: boolean;
}

const SAMPLE_TEMPLATES: Record<SubjectCategory, string> = {
  Economics: `1. What is the series of equal payments made at equal intervals of time called?
A. Amortization
B. Annuity
C. Depreciation
D. Sinking fund
Answer: B
Explanation: An annuity is a series of equal payments occurring at uniform time intervals.

2. A past cost that has already been incurred and cannot be recovered is known as:
A. Marginal cost
B. Opportunity cost
C. Sunk cost
D. Fixed cost
Answer: C`,

  'Mechanics 1': `1. Two equal and opposite parallel forces whose lines of action do not coincide form a:
A. Couple
B. Moment of inertia
C. Resultant
D. Torsion
Answer: A
Explanation: A couple consists of two parallel forces with equal magnitude and opposite directions.

2. The condition of equilibrium for concurrent coplanar forces requires:
A. Sum of moments equals zero only
B. Sum of horizontal and vertical forces equal zero
C. Forces must be colinear
D. Acceleration is constant
Answer: B`,

  'Mechanics 2': `1. The rate of change of momentum of a body is proportional to the applied force. This is Newton's:
A. First Law of Motion
B. Second Law of Motion
C. Third Law of Motion
D. Law of Gravitation
Answer: B

2. A body undergoing uniform circular motion experiences an acceleration directed toward the center called:
A. Tangential acceleration
B. Centripetal acceleration
C. Coriolis acceleration
D. Angular acceleration
Answer: B`,

  'EE Laws': `1. Republic Act No. 7920 is otherwise known as:
A. The New Electrical Engineering Law
B. Philippine Electronics Act
C. Magna Carta for Engineers
D. Clean Air Act of 1999
Answer: A
Explanation: RA 7920 was approved in 1995 repealing Commonwealth Act No. 294.

2. Under the Philippine Electrical Code (PEC), the color for grounded neutral conductor is:
A. Green
B. White or Natural Gray
C. Black
D. Red
Answer: B`,

  'Project Management': `1. In project management, what does the acronym CPM stand for?
A. Critical Path Method
B. Cost Performance Metric
C. Control Plan Matrix
D. Cumulative Project Margin
Answer: A
Explanation: The Critical Path Method identifies the longest sequence of dependent activities.

2. A visual bar chart representing project activities against a timeline is called a:
A. Pareto chart
B. Gantt chart
C. Fishbone diagram
D. Control chart
Answer: B`,

  Communication: `1. The process of converting digital data into analog signals suitable for transmission is:
A. Modulation
B. Demodulation
C. Filtering
D. Attenuation
Answer: A

2. The frequency band designated for High Frequency (HF) communications is:
A. 300 kHz to 3 MHz
B. 3 MHz to 30 MHz
C. 30 MHz to 300 MHz
D. 300 MHz to 3 GHz
Answer: B`,

  'General Engineering': `1. What is the unit of pressure in the SI system?
A. Pascal
B. Bar
C. Torr
D. Atmosphere
Answer: A`,
};

export const PasteQuestionsModal: React.FC<PasteQuestionsModalProps> = ({
  isOpen,
  onClose,
  onAddQuestions,
  savedCustomQuestions,
  allQuestions = [],
  onDeleteQuestion,
  onImportBackup,
  onSyncToProject,
  isSyncingProject,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'manage'>('paste');
  const [subject, setSubject] = useState<SubjectCategory>('Economics');
  const [sourceName, setSourceName] = useState('My Pasted Reviewer Notes');
  const [rawText, setRawText] = useState('');
  const [correctOverrides, setCorrectOverrides] = useState<Record<number, string>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const exportQuestionsList = allQuestions.length > 0 ? allQuestions : savedCustomQuestions;

  const handleDownloadDriveTs = () => {
    if (exportQuestionsList.length === 0) return;
    downloadDriveQuestionsTs(exportQuestionsList);
  };

  // Live parsed preview
  const parsedPreview = useMemo(() => {
    if (!rawText.trim()) return [];
    try {
      const fileId = `pasted-preview-${Date.now()}`;
      const questions = parseQuestionsFromText(rawText, sourceName, fileId, subject);
      // Apply any manual click overrides for correct answer
      return questions.map((q, idx) => {
        if (correctOverrides[idx]) {
          return {
            ...q,
            correctChoiceId: correctOverrides[idx],
          };
        }
        return q;
      });
    } catch (e) {
      console.warn('Live parsing preview error:', e);
      return [];
    }
  }, [rawText, sourceName, subject, correctOverrides]);

  if (!isOpen) return null;

  const handleSetCorrectChoice = (questionIndex: number, choiceId: string) => {
    setCorrectOverrides((prev) => ({
      ...prev,
      [questionIndex]: choiceId,
    }));
  };

  const handleLoadSample = () => {
    const template = SAMPLE_TEMPLATES[subject] || SAMPLE_TEMPLATES['Economics'];
    setRawText(template);
    setCorrectOverrides({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedPreview.length === 0) {
      setFeedbackMsg('No valid questions found. Please check your text format.');
      return;
    }

    onAddQuestions(parsedPreview, subject);
    setRawText('');
    setCorrectOverrides({});
    setFeedbackMsg(`Successfully added ${parsedPreview.length} question(s) to ${subject}!`);
    setTimeout(() => {
      onClose();
      setFeedbackMsg(null);
    }, 1200);
  };

  const handleExport = () => {
    exportCustomQuestionsJson(savedCustomQuestions);
  };

  const handleCopyAsCode = async () => {
    if (savedCustomQuestions.length === 0) return;
    const code = formatQuestionsAsTypeScriptCode(savedCustomQuestions);
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importCustomQuestionsJson(file);
      onImportBackup(imported);
      setFeedbackMsg(`Imported ${imported.length} question(s) from backup!`);
    } catch (err) {
      alert('Failed to parse backup JSON file. Make sure it is a valid questions backup.');
    }
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                Paste & Save Questions
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Persistent Storage
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pasted questions are permanently saved in your web app even after updates or refreshes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-zinc-800 bg-zinc-950/50">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'paste'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Paste New Questions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'manage'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Saved Questions Bank</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300">
              {savedCustomQuestions.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Paste New Questions */}
        {activeTab === 'paste' && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {feedbackMsg && (
              <div className="px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center justify-between">
                <span>{feedbackMsg}</span>
                <span className="text-[10px] font-mono">Saved</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  Target Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value as SubjectCategory);
                    setCorrectOverrides({});
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-600 font-sans"
                >
                  <option value="Economics">Economics</option>
                  <option value="Mechanics 1">Mechanics 1 (Statics)</option>
                  <option value="Mechanics 2">Mechanics 2 (Dynamics)</option>
                  <option value="EE Laws">EE Laws (RA 7920 & PEC)</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Communication">Communication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  Source Document / Note Label
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Economics Reviewer Chapter 1"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-zinc-300">
                  Raw Questions & Choices Text
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Load Sample Format for {subject}
                </button>
              </div>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setCorrectOverrides({});
                }}
                placeholder={`Example Format:
1. What is the series of equal payments made at equal intervals called?
A. Amortization
B. Annuity
C. Depreciation
D. Sunk cost
Answer: B
Explanation: Annuity occurs at uniform time periods.

(Unnumbered questions and single questions also work directly!)`}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs sm:text-sm text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-600 resize-none leading-relaxed"
              />
            </div>

            {/* Live Parser Feedback */}
            <div className="border border-zinc-800 rounded-lg p-3.5 bg-zinc-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                  <span>Live Parser Detection:</span>
                  <span
                    className={`font-mono px-2 py-0.5 rounded text-[11px] ${
                      parsedPreview.length > 0
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {parsedPreview.length} Question{parsedPreview.length !== 1 ? 's' : ''} Detected
                  </span>
                </span>
                {parsedPreview.length > 0 && (
                  <span className="text-[11px] text-zinc-400">
                    Click any choice below to change the correct answer
                  </span>
                )}
              </div>

              {rawText.trim() && parsedPreview.length === 0 && (
                <div className="text-xs text-amber-400/90 bg-amber-950/30 border border-amber-900/50 p-2.5 rounded">
                  ⚠️ Make sure choices are written on their own lines starting with{' '}
                  <code className="text-amber-300 font-mono">A.</code>,{' '}
                  <code className="text-amber-300 font-mono">B.</code>,{' '}
                  <code className="text-amber-300 font-mono">C.</code>,{' '}
                  <code className="text-amber-300 font-mono">D.</code> (or{' '}
                  <code className="text-amber-300 font-mono">A)</code>). Answer line can be{' '}
                  <code className="text-amber-300 font-mono">Answer: B</code> or{' '}
                  <code className="text-amber-300 font-mono">Ans: B</code>.
                </div>
              )}

              {/* Preview List */}
              {parsedPreview.length > 0 && (
                <div className="flex flex-col gap-3 mt-2 max-h-60 overflow-y-auto pr-1">
                  {parsedPreview.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-zinc-100">
                          <span className="text-emerald-400 font-mono mr-1.5">Q{idx + 1}.</span>
                          {q.question}
                        </p>
                        <span className="text-[10px] font-mono shrink-0 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {q.subject}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {q.choices.map((c) => {
                          const isCorrect = c.id === q.correctChoiceId;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handleSetCorrectChoice(idx, c.id)}
                              className={`text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors border ${
                                isCorrect
                                  ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
                                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                              }`}
                            >
                              <span className="truncate">
                                <strong className="font-mono mr-1">{c.id}.</strong> {c.text}
                              </span>
                              {isCorrect && (
                                <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1 shrink-0">
                                  ✓ Correct
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-zinc-400 italic">
                          <span className="font-mono text-zinc-500">Note:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <span className="text-[11px] text-zinc-400">
                Supports single questions, bulk paste, unnumbered text, and multiple formats.
              </span>
              <button
                type="submit"
                disabled={parsedPreview.length === 0}
                className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-500 text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow"
              >
                Save {parsedPreview.length} Question{parsedPreview.length !== 1 ? 's' : ''} to {subject}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Manage Saved Questions Bank */}
        {activeTab === 'manage' && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">
                  Custom Questions Bank ({savedCustomQuestions.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  These questions are persisted on your device and integrated directly into the flashcards.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onSyncToProject && (
                  <button
                    type="button"
                    onClick={onSyncToProject}
                    disabled={isSyncingProject || exportQuestionsList.length === 0}
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-indigo-600 bg-indigo-900 text-indigo-100 hover:bg-indigo-800 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                    title="Saves all questions directly into src/data/driveQuestions.ts for Render deployment"
                  >
                    <span>⚡</span>
                    <span>{isSyncingProject ? 'Saving...' : `Save All ${exportQuestionsList.length} for Render`}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownloadDriveTs}
                  disabled={exportQuestionsList.length === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-indigo-700 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 disabled:opacity-40 transition-colors"
                  title="Download driveQuestions.ts file ready for your GitHub repository"
                >
                  Download driveQuestions.ts
                </button>
                <button
                  type="button"
                  onClick={handleCopyAsCode}
                  disabled={savedCustomQuestions.length === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-emerald-700 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 disabled:opacity-40 transition-colors"
                >
                  {copiedCode ? 'Copied TypeScript Code!' : 'Copy Code (driveQuestions.ts)'}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={savedCustomQuestions.length === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                >
                  Export Backup (.json)
                </button>
                <label className="px-3 py-1.5 text-xs font-medium rounded border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 cursor-pointer transition-colors">
                  Import Backup
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {savedCustomQuestions.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 flex flex-col items-center gap-2">
                <span className="text-3xl">📋</span>
                <p className="text-sm text-zinc-400">No custom questions pasted yet.</p>
                <p className="text-xs text-zinc-500 max-w-sm">
                  Switch to the "Paste New Questions" tab to paste and save questions into your flashcard review.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {savedCustomQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {q.subject}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate max-w-xs">
                          {q.sourceFileName || 'Pasted'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-zinc-200 line-clamp-2">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-zinc-400">
                        <span>Choices: {q.choices.length}</span>
                        <span>Correct: {q.correctChoiceId}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteQuestion(q.id)}
                      className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 rounded border border-rose-900/60 transition-colors shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
