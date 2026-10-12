import React, { useState, useMemo } from 'react';
import { SubjectCategory, FlashcardQuestion, parseQuestionsFromText } from '../services/questionParser';
import {
  exportCustomQuestionsJson,
  importCustomQuestionsJson,
  formatQuestionsAsTypeScriptCode,
  downloadDriveQuestionsTs,
  downloadQuestionsCsv,
  downloadQuestionsTxt,
  downloadQuestionsPdf,
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
  const [manageSubjectFilter, setManageSubjectFilter] = useState<string>('All');
  const [manageSearchQuery, setManageSearchQuery] = useState<string>('');

  const exportQuestionsList = allQuestions.length > 0 ? allQuestions : savedCustomQuestions;

  // Question counts grouped per subject
  const subjectBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    exportQuestionsList.forEach((q) => {
      const subj = q.subject || 'General';
      counts[subj] = (counts[subj] || 0) + 1;
    });
    return counts;
  }, [exportQuestionsList]);

  // Filtered list of questions for the management view
  const filteredManageQuestions = useMemo(() => {
    return exportQuestionsList.filter((q) => {
      const matchesSubject =
        manageSubjectFilter === 'All' || q.subject === manageSubjectFilter;
      const query = manageSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        q.question.toLowerCase().includes(query) ||
        q.choices.some((c) => c.text.toLowerCase().includes(query));
      return matchesSubject && matchesSearch;
    });
  }, [exportQuestionsList, manageSubjectFilter, manageSearchQuery]);

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
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            {/* Master Actions Banner */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800 shadow-sm">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span>Saved Question Bank</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {exportQuestionsList.length} Items Total
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Download all questions, choices, and final correct answers per subject as Excel CSV or formatted Text files.
                </p>
              </div>

              {/* Master Download Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => downloadQuestionsPdf(exportQuestionsList, 'All')}
                  disabled={exportQuestionsList.length === 0}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-red-600 bg-red-950 text-red-200 hover:bg-red-900 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Download PDF document containing all questions, choices, and answers"
                >
                  <span>📕</span>
                  <span>Download All PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadQuestionsCsv(exportQuestionsList, 'All')}
                  disabled={exportQuestionsList.length === 0}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-emerald-600 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Download all questions, choices, and correct answers in a spreadsheet CSV"
                >
                  <span>📥</span>
                  <span>Download All CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadQuestionsTxt(exportQuestionsList, 'All')}
                  disabled={exportQuestionsList.length === 0}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-sky-600 bg-sky-950 text-sky-300 hover:bg-sky-900 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Download all questions, choices, and correct answers as a readable text reviewer"
                >
                  <span>📄</span>
                  <span>Download All Text</span>
                </button>

                {onSyncToProject && (
                  <button
                    type="button"
                    onClick={onSyncToProject}
                    disabled={isSyncingProject || exportQuestionsList.length === 0}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-600 bg-indigo-950 text-indigo-200 hover:bg-indigo-900 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Saves all questions into driveQuestions.ts for Render deployment"
                  >
                    <span>⚡</span>
                    <span>{isSyncingProject ? 'Saving...' : 'Save for Render'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownloadDriveTs}
                  disabled={exportQuestionsList.length === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Download driveQuestions.ts file"
                >
                  driveQuestions.ts
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  disabled={savedCustomQuestions.length === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Export custom questions backup JSON"
                >
                  Backup JSON
                </button>

                <label className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 cursor-pointer transition-colors">
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Per-Subject Quick Download & Summary Grid */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Download per Subject (PDF, CSV, TXT)
                </h4>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {Object.keys(subjectBreakdown).length} Subjects Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {Object.entries(subjectBreakdown).map(([subj, count]) => (
                  <div
                    key={subj}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                      manageSubjectFilter === subj
                        ? 'bg-emerald-950/40 border-emerald-600/70 shadow-sm'
                        : 'bg-zinc-950/90 border-zinc-800/90 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-100 truncate">{subj}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 border border-zinc-700 shrink-0">
                        {count} Qs
                      </span>
                    </div>

                    {/* Individual Download Buttons per Subject */}
                    <div className="flex items-center gap-1 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => downloadQuestionsPdf(exportQuestionsList, subj)}
                        className="flex-1 py-1 px-1.5 bg-red-900/70 hover:bg-red-800 text-red-100 border border-red-700/70 rounded-md font-semibold transition-colors text-center cursor-pointer flex items-center justify-center gap-1 text-[11px]"
                        title={`Download PDF reviewer for ${subj}`}
                      >
                        <span>📕</span> PDF
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadQuestionsCsv(exportQuestionsList, subj)}
                        className="flex-1 py-1 px-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 rounded-md font-semibold transition-colors text-center cursor-pointer flex items-center justify-center gap-1 text-[11px]"
                        title={`Download CSV spreadsheet for ${subj}`}
                      >
                        <span>📥</span> CSV
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadQuestionsTxt(exportQuestionsList, subj)}
                        className="flex-1 py-1 px-1.5 bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-700/60 rounded-md font-semibold transition-colors text-center cursor-pointer flex items-center justify-center gap-1 text-[11px]"
                        title={`Download text reviewer for ${subj}`}
                      >
                        <span>📄</span> TXT
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setManageSubjectFilter((prev) => (prev === subj ? 'All' : subj))
                        }
                        className={`px-2 py-1 rounded-md border font-semibold transition-colors cursor-pointer text-[11px] ${
                          manageSubjectFilter === subj
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
                        }`}
                        title={`Filter list to ${subj}`}
                      >
                        {manageSubjectFilter === subj ? 'Filtered' : 'Filter'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <select
                  value={manageSubjectFilter}
                  onChange={(e) => setManageSubjectFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 font-sans"
                >
                  <option value="All">All Subjects ({exportQuestionsList.length})</option>
                  {Object.keys(subjectBreakdown).map((subj) => (
                    <option key={subj} value={subj}>
                      {subj} ({subjectBreakdown[subj]})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search questions or choices..."
                  value={manageSearchQuery}
                  onChange={(e) => setManageSearchQuery(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-3 py-2 placeholder-zinc-600 focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <span className="text-[11px] font-mono text-zinc-400 self-end sm:self-center shrink-0">
                Showing {filteredManageQuestions.length} of {exportQuestionsList.length} items
              </span>
            </div>

            {/* Detailed Question Bank Listing with Questions, Choices, and Final Correct Answer */}
            {filteredManageQuestions.length === 0 ? (
              <div className="py-10 text-center text-zinc-500 flex flex-col items-center gap-2">
                <span className="text-2xl">🔍</span>
                <p className="text-xs text-zinc-400">No questions match your current filter or search query.</p>
                <button
                  type="button"
                  onClick={() => {
                    setManageSubjectFilter('All');
                    setManageSearchQuery('');
                  }}
                  className="text-xs text-emerald-400 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[45vh] overflow-y-auto pr-1">
                {filteredManageQuestions.map((q, idx) => {
                  const correctChoiceObj = q.choices.find(
                    (c) => c.id.toUpperCase() === q.correctChoiceId.toUpperCase()
                  );

                  return (
                    <div
                      key={q.id || idx}
                      className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col gap-2.5"
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono font-bold text-emerald-400">
                            #{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                            {q.subject}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 truncate max-w-xs">
                            {q.sourceFileName || 'Reviewer Note'}
                          </span>
                        </div>

                        {savedCustomQuestions.some((cq) => cq.id === q.id) && (
                          <button
                            type="button"
                            onClick={() => onDeleteQuestion(q.id)}
                            className="px-2 py-0.5 text-[11px] font-mono text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded border border-rose-900/60 transition-colors shrink-0 cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Question Text */}
                      <p className="text-xs sm:text-sm font-medium text-zinc-100 leading-relaxed">
                        {q.question}
                      </p>

                      {/* Choices List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-0.5">
                        {q.choices.map((c) => {
                          const isCorrect =
                            c.id.toUpperCase() === q.correctChoiceId.toUpperCase();

                          return (
                            <div
                              key={c.id}
                              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between border transition-all ${
                                isCorrect
                                  ? 'bg-emerald-950/90 border-emerald-600/80 text-emerald-200 font-semibold shadow-xs'
                                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400'
                              }`}
                            >
                              <span className="truncate">
                                <strong className="font-mono mr-1.5 text-zinc-300">
                                  {c.id.toUpperCase()}.
                                </strong>{' '}
                                {c.text}
                              </span>
                              {isCorrect && (
                                <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1 shrink-0 bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-700">
                                  ✓ Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Final Correct Answer Banner */}
                      <div className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-xs flex items-center justify-between">
                        <span className="font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
                          <span>Final Correct Answer:</span>
                          <strong className="text-emerald-200 font-bold bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">
                            Choice {q.correctChoiceId.toUpperCase()}
                          </strong>
                          {correctChoiceObj && (
                            <span className="text-emerald-100 italic truncate font-sans">
                              — {correctChoiceObj.text}
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Explanation if present */}
                      {q.explanation && (
                        <p className="text-[11px] text-zinc-400 italic bg-zinc-900/80 p-2 rounded-md border border-zinc-800">
                          <strong className="font-mono text-zinc-400">Explanation:</strong>{' '}
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
