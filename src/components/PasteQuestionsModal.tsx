import React, { useState, useMemo } from 'react';
import { FlashcardQuestion } from '../services/questionParser';
import { downloadQuestionsPdf } from '../services/storageService';

interface PasteQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCustomQuestions: FlashcardQuestion[];
  allQuestions?: FlashcardQuestion[];
  onDeleteQuestion?: (id: string) => void;
}

export const PasteQuestionsModal: React.FC<PasteQuestionsModalProps> = ({
  isOpen,
  onClose,
  savedCustomQuestions,
  allQuestions = [],
  onDeleteQuestion,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl bg-[#181a20] border border-[#272935] rounded-xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#272935] bg-[#14161c]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wider">
              Question Bank & PDF Downloads
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Access {exportQuestionsList.length} verified engineering board exam items and download PDF reviewers per subject.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 bg-[#14161c]">
          {/* Master Action Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#191b22] border border-[#272935] shadow-sm">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>All Subjects Master PDF</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                  {exportQuestionsList.length} Questions
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Download complete reviewer with questions, options, and verified answers formatted for study.
              </p>
            </div>

            {/* Master Download Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => downloadQuestionsPdf(exportQuestionsList, 'All')}
                disabled={exportQuestionsList.length === 0}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 transition-colors cursor-pointer text-center shadow-xs"
                title="Download PDF containing all questions, choices, and answers"
              >
                Download All PDF
              </button>
            </div>
          </div>

          {/* Per-Subject Download Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Download per Subject (PDF)
              </h4>
              <span className="text-[11px] text-zinc-500 font-mono">
                {Object.keys(subjectBreakdown).length} Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {Object.entries(subjectBreakdown).map(([subj, count]) => (
                <div
                  key={subj}
                  className="p-3 rounded-xl border bg-[#191b22] border-[#272935] hover:border-zinc-700 transition-all flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-zinc-100 truncate">{subj}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                      {count} Items
                    </span>
                  </div>

                  {/* Individual PDF Download Button per Subject */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => downloadQuestionsPdf(exportQuestionsList, subj)}
                      className="w-full py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-md font-semibold transition-colors text-center cursor-pointer"
                      title={`Download PDF reviewer for ${subj}`}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-[#272935]">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <select
                value={manageSubjectFilter}
                onChange={(e) => setManageSubjectFilter(e.target.value)}
                className="bg-[#191b22] border border-[#272935] text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-500 font-sans"
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
                className="flex-1 bg-[#191b22] border border-[#272935] text-zinc-200 text-xs rounded-lg px-3 py-2 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
              />
            </div>

            <span className="text-[11px] font-mono text-zinc-400 self-end sm:self-center shrink-0">
              Showing {filteredManageQuestions.length} of {exportQuestionsList.length} items
            </span>
          </div>

          {/* Question Cards List */}
          {filteredManageQuestions.length === 0 ? (
            <div className="py-10 text-center text-zinc-500 flex flex-col items-center gap-2">
              <p className="text-xs text-zinc-400">No questions match your current search.</p>
              <button
                type="button"
                onClick={() => {
                  setManageSubjectFilter('All');
                  setManageSearchQuery('');
                }}
                className="text-xs text-zinc-300 hover:underline cursor-pointer"
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
                    className="p-3.5 rounded-xl bg-[#191b22] border border-[#272935] flex flex-col gap-2.5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-zinc-400">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold">
                          {q.subject}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 truncate max-w-xs">
                          {q.sourceFileName || 'Reviewer Item'}
                        </span>
                      </div>

                      {onDeleteQuestion && savedCustomQuestions.some((cq) => cq.id === q.id) && (
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
                    <p className="text-xs sm:text-sm font-medium text-zinc-100 leading-relaxed">
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
                                ? 'bg-emerald-950/70 border-emerald-600/80 text-emerald-200 font-semibold'
                                : 'bg-[#14161c] border-[#252733] text-zinc-400'
                            }`}
                          >
                            <span className="truncate">
                              <strong className="font-mono mr-1.5 text-zinc-300">
                                {c.id.toUpperCase()}.
                              </strong>{' '}
                              {c.text}
                            </span>
                            {isCorrect && (
                              <span className="text-[10px] font-mono text-emerald-300 font-bold ml-1 shrink-0 bg-emerald-900 px-1.5 py-0.5 rounded border border-emerald-700">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Correct Answer Banner */}
                    <div className="mt-1 px-3 py-1.5 rounded-lg bg-[#14161c] border border-[#252733] text-xs flex items-center justify-between">
                      <span className="font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
                        <span>Answer:</span>
                        <strong className="text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          {q.correctChoiceId.toUpperCase()}
                        </strong>
                        {correctChoiceObj && (
                          <span className="text-zinc-200 truncate font-sans">
                            — {correctChoiceObj.text}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <p className="text-[11px] text-zinc-400 bg-[#14161c] p-2 rounded-md border border-[#252733]">
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
      </div>
    </div>
  );
};
