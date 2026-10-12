import React, { useState, useMemo } from 'react';
import { SubjectCategory, FlashcardQuestion } from '../services/questionParser';
import {
  exportCustomQuestionsJson,
  importCustomQuestionsJson,
  downloadDriveQuestionsTs,
  downloadQuestionsCsv,
  downloadQuestionsTxt,
  downloadQuestionsPdf,
} from '../services/storageService';

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

export const PasteQuestionsModal: React.FC<PasteQuestionsModalProps> = ({
  isOpen,
  onClose,
  savedCustomQuestions,
  allQuestions = [],
  onDeleteQuestion,
  onImportBackup,
  onSyncToProject,
  isSyncingProject,
}) => {
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

  const handleExport = () => {
    exportCustomQuestionsJson(savedCustomQuestions);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importCustomQuestionsJson(file);
      onImportBackup(imported);
    } catch (err) {
      alert('Failed to parse backup JSON file.');
    }
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider">
              Question Bank & PDF Downloads
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Access {exportQuestionsList.length} verified engineering board exam items and download PDF, CSV, or Text reviewers per subject.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 bg-slate-900">
          {/* Master Action Banner */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>All Subjects Master Downloads</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  {exportQuestionsList.length} Questions
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Download complete reviewers with questions, options, and answers formatted for print and study.
              </p>
            </div>

            {/* Master Download Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => downloadQuestionsPdf(exportQuestionsList, 'All')}
                disabled={exportQuestionsList.length === 0}
                className="px-3 py-1.5 text-xs font-bold rounded-md bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
                title="Download PDF containing all questions, choices, and answers"
              >
                Download All PDF
              </button>

              <button
                type="button"
                onClick={() => downloadQuestionsCsv(exportQuestionsList, 'All')}
                disabled={exportQuestionsList.length === 0}
                className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                title="Download spreadsheet CSV"
              >
                Download All CSV
              </button>

              <button
                type="button"
                onClick={() => downloadQuestionsTxt(exportQuestionsList, 'All')}
                disabled={exportQuestionsList.length === 0}
                className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                title="Download formatted text file"
              >
                Download All TXT
              </button>

              {onSyncToProject && (
                <button
                  type="button"
                  onClick={onSyncToProject}
                  disabled={isSyncingProject || exportQuestionsList.length === 0}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  {isSyncingProject ? 'Saving...' : 'Sync for Render'}
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadDriveTs}
                disabled={exportQuestionsList.length === 0}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                driveQuestions.ts
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={savedCustomQuestions.length === 0}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Backup JSON
              </button>

              <label className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer transition-colors">
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

          {/* Per-Subject Download Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Download per Subject (PDF, CSV, TXT)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {Object.keys(subjectBreakdown).length} Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {Object.entries(subjectBreakdown).map(([subj, count]) => (
                <div
                  key={subj}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                    manageSubjectFilter === subj
                      ? 'bg-teal-950/40 border-teal-600/70 shadow-xs'
                      : 'bg-slate-950 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-100 truncate">{subj}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700 shrink-0">
                      {count} Items
                    </span>
                  </div>

                  {/* Individual Download Buttons per Subject */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => downloadQuestionsPdf(exportQuestionsList, subj)}
                      className="flex-1 py-1 px-2 bg-teal-600 hover:bg-teal-500 text-white rounded font-semibold transition-colors text-center cursor-pointer"
                      title={`Download PDF reviewer for ${subj}`}
                    >
                      PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadQuestionsCsv(exportQuestionsList, subj)}
                      className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-semibold transition-colors text-center cursor-pointer"
                      title={`Download CSV for ${subj}`}
                    >
                      CSV
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadQuestionsTxt(exportQuestionsList, subj)}
                      className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-semibold transition-colors text-center cursor-pointer"
                      title={`Download text reviewer for ${subj}`}
                    >
                      TXT
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setManageSubjectFilter((prev) => (prev === subj ? 'All' : subj))
                      }
                      className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                        manageSubjectFilter === subj
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                      title={`Filter view to ${subj}`}
                    >
                      {manageSubjectFilter === subj ? 'Filtered' : 'Filter'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <select
                value={manageSubjectFilter}
                onChange={(e) => setManageSubjectFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500 font-sans"
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
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>

            <span className="text-[11px] font-mono text-slate-400 self-end sm:self-center shrink-0">
              Showing {filteredManageQuestions.length} of {exportQuestionsList.length} items
            </span>
          </div>

          {/* Question Cards List */}
          {filteredManageQuestions.length === 0 ? (
            <div className="py-10 text-center text-slate-500 flex flex-col items-center gap-2">
              <p className="text-xs text-slate-400">No questions match your current filter or search query.</p>
              <button
                type="button"
                onClick={() => {
                  setManageSubjectFilter('All');
                  setManageSearchQuery('');
                }}
                className="text-xs text-teal-400 hover:underline cursor-pointer"
              >
                Reset search
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
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-teal-400">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                          {q.subject}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 truncate max-w-xs">
                          {q.sourceFileName || 'Reviewer Item'}
                        </span>
                      </div>

                      {savedCustomQuestions.some((cq) => cq.id === q.id) && (
                        <button
                          type="button"
                          onClick={() => onDeleteQuestion(q.id)}
                          className="px-2 py-0.5 text-[11px] font-mono text-rose-400 hover:text-rose-200 hover:bg-rose-950 rounded border border-rose-900 transition-colors shrink-0 cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {/* Question Text */}
                    <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
                      {q.question}
                    </p>

                    {/* Choices Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-0.5">
                      {q.choices.map((c) => {
                        const isCorrect =
                          c.id.toUpperCase() === q.correctChoiceId.toUpperCase();

                        return (
                          <div
                            key={c.id}
                            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between border transition-all ${
                              isCorrect
                                ? 'bg-teal-950/80 border-teal-600/80 text-teal-200 font-semibold shadow-xs'
                                : 'bg-slate-900/80 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="truncate">
                              <strong className="font-mono mr-1.5 text-slate-300">
                                {c.id.toUpperCase()}.
                              </strong>{' '}
                              {c.text}
                            </span>
                            {isCorrect && (
                              <span className="text-[10px] font-mono text-teal-300 font-bold ml-1 shrink-0 bg-teal-900 px-1.5 py-0.5 rounded border border-teal-700">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Correct Answer Banner */}
                    <div className="mt-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                      <span className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                        <span>Answer:</span>
                        <strong className="text-teal-300 font-bold bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                          {q.correctChoiceId.toUpperCase()}
                        </strong>
                        {correctChoiceObj && (
                          <span className="text-slate-200 truncate font-sans">
                            — {correctChoiceObj.text}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-md border border-slate-800">
                        <strong className="font-mono text-slate-400">Explanation:</strong>{' '}
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
