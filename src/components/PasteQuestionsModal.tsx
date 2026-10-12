import React, { useState, useMemo } from 'react';
import { FlashcardQuestion } from '../services/questionParser';
import { downloadQuestionsPdf } from '../services/storageService';

interface PasteQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCustomQuestions: FlashcardQuestion[];
  allQuestions?: FlashcardQuestion[];
  onDeleteQuestion: (id: string) => void;
  onImportBackup?: (importedQuestions: FlashcardQuestion[]) => void;
  onSyncToProject?: () => void;
  isSyncingProject?: boolean;
}

export const PasteQuestionsModal: React.FC<PasteQuestionsModalProps> = ({
  isOpen,
  onClose,
  savedCustomQuestions,
  allQuestions = [],
  onDeleteQuestion,
}) => {
  const [selectedSubjectView, setSelectedSubjectView] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Questions for preview
  const filteredQuestions = useMemo(() => {
    return exportQuestionsList.filter((q) => {
      const matchesSubject =
        selectedSubjectView === 'All' || q.subject === selectedSubjectView;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        q.question.toLowerCase().includes(query) ||
        q.choices.some((c) => c.text.toLowerCase().includes(query));
      return matchesSubject && matchesSearch;
    });
  }, [exportQuestionsList, selectedSubjectView, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#080e1c]">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-100 tracking-wide uppercase">
              Question Bank & PDF Reviewers
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {exportQuestionsList.length} verified engineering board exam questions available.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5 bg-slate-900 text-slate-200">
          {/* Master Download Action Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#080e1c] border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Master Reviewer
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  ({exportQuestionsList.length} Items)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete printable document containing questions, choices, and answers for all engineering subjects.
              </p>
            </div>

            <button
              type="button"
              onClick={() => downloadQuestionsPdf(exportQuestionsList, 'All')}
              disabled={exportQuestionsList.length === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-white text-slate-950 disabled:opacity-40 transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Download PDF containing all questions, choices, and answers"
            >
              Download Master PDF
            </button>
          </div>

          {/* Per-Subject PDF Download Grid */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Subject Reviewers
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {Object.keys(subjectBreakdown).length} Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {Object.entries(subjectBreakdown).map(([subj, count]) => (
                <div
                  key={subj}
                  className="p-3.5 rounded-xl bg-[#080e1c] border border-slate-800 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-100 truncate">{subj}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {count} Items
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadQuestionsPdf(exportQuestionsList, subj)}
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center"
                    title={`Download printable PDF reviewer for ${subj}`}
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Subject Review Preview */}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <select
                  aria-label="Select Subject"
                  value={selectedSubjectView}
                  onChange={(e) => setSelectedSubjectView(e.target.value)}
                  className="bg-[#080e1c] border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-slate-600"
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-[#080e1c] border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-slate-600"
                />
              </div>

              <span className="text-xs font-mono text-slate-500 shrink-0">
                {filteredQuestions.length} of {exportQuestionsList.length} items
              </span>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No questions found matching your search.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[38vh] overflow-y-auto pr-1">
                {filteredQuestions.map((q, idx) => {
                  const correctChoiceObj = q.choices.find(
                    (c) => c.id.toUpperCase() === q.correctChoiceId.toUpperCase()
                  );

                  return (
                    <div
                      key={q.id || idx}
                      className="p-3 rounded-xl bg-[#080e1c] border border-slate-800 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-slate-400 font-semibold">
                            #{idx + 1}
                          </span>
                          <span className="text-slate-300 font-medium">
                            {q.subject}
                          </span>
                        </div>

                        {savedCustomQuestions.some((cq) => cq.id === q.id) && (
                          <button
                            type="button"
                            onClick={() => onDeleteQuestion(q.id)}
                            className="px-2 py-0.5 text-xs text-rose-400 hover:text-rose-200 rounded transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-0.5">
                        {q.choices.map((c) => {
                          const isCorrect =
                            c.id.toUpperCase() === q.correctChoiceId.toUpperCase();

                          return (
                            <div
                              key={c.id}
                              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between border ${
                                isCorrect
                                  ? 'bg-emerald-950/70 border-emerald-600/70 text-emerald-200 font-medium'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              <span className="truncate">
                                <strong className="font-mono mr-1.5 text-slate-300">
                                  {c.id.toUpperCase()}.
                                </strong>{' '}
                                {c.text}
                              </span>
                              {isCorrect && (
                                <span className="text-[10px] text-emerald-300 ml-1 shrink-0 font-medium">
                                  Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {correctChoiceObj && (
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                          <span>Answer:</span>
                          <span className="text-emerald-400 font-semibold font-mono">
                            Option {q.correctChoiceId.toUpperCase()}
                          </span>
                          <span className="text-slate-300 truncate">
                            ({correctChoiceObj.text})
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
