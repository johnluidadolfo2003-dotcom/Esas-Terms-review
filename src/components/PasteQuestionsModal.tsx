import React, { useState, useMemo, useRef } from 'react';
import { FlashcardQuestion } from '../services/questionParser';
import { downloadQuestionsPdf } from '../services/storageService';

interface PasteQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCustomQuestions: FlashcardQuestion[];
  allQuestions?: FlashcardQuestion[];
  onDeleteQuestion: (id: string) => void;
  onImportFile?: (file: File) => Promise<{ success: boolean; count: number; subject: string } | void> | void;
  isLoadingFile?: boolean;
  initialTab?: 'upload' | 'pdf' | 'bank';
}

export const PasteQuestionsModal: React.FC<PasteQuestionsModalProps> = ({
  isOpen,
  onClose,
  savedCustomQuestions,
  allQuestions = [],
  onDeleteQuestion,
  onImportFile,
  isLoadingFile = false,
  initialTab = 'upload',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'pdf' | 'bank'>(initialTab);
  const [selectedSubjectView, setSelectedSubjectView] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setUploadStatus(null);
    }
  }, [isOpen, initialTab]);

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

  const handleProcessFile = async (file: File) => {
    if (!onImportFile) return;
    setUploadStatus(null);

    const validExtensions = ['.docx', '.txt', '.csv', '.json'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setUploadStatus({
        type: 'error',
        message: 'Unsupported format. Please upload a .docx, .txt, .csv, or .json file.',
      });
      return;
    }

    try {
      const result = await onImportFile(file);
      if (result && typeof result === 'object' && result.success) {
        setUploadStatus({
          type: 'success',
          message: `Successfully loaded ${result.count} questions from "${file.name}" into ${result.subject}!`,
        });
      } else {
        setUploadStatus({
          type: 'success',
          message: `File "${file.name}" uploaded and parsed successfully.`,
        });
      }
    } catch (err: any) {
      setUploadStatus({
        type: 'error',
        message: err?.message || 'Failed to parse questions from file.',
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#080e1c]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-100 tracking-wide">
                Reviewer Files & Question Bank
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {exportQuestionsList.length} verified board questions across all engineering subjects.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 pb-0 border-b border-slate-800 bg-[#080e1c]/60 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-slate-200 text-slate-100 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span>Upload Reviewer Files</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'border-slate-200 text-slate-100 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>PDF Reviewers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bank'
                ? 'border-slate-200 text-slate-100 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>Question Bank ({exportQuestionsList.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 bg-slate-900 text-slate-200">
          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="flex flex-col gap-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center flex flex-col items-center justify-center transition-all ${
                  isDragging
                    ? 'border-slate-200 bg-slate-800/80 scale-[1.01]'
                    : 'border-slate-700/80 bg-[#080e1c] hover:border-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 text-slate-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>

                <h3 className="text-sm font-semibold text-slate-100">
                  Upload Board Exam Reviewer Files
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                  Drag and drop your engineering reviewer file here, or click to browse. Automatically extracts questions, choices (A-D), and answers.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isLoadingFile}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isLoadingFile ? 'Processing...' : 'Choose File to Upload'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.txt,.csv,.json"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                <div className="mt-3 text-[11px] font-mono text-slate-500">
                  Supported formats: Word Document (.docx), Plain Text (.txt), CSV, JSON
                </div>
              </div>

              {/* Status Message */}
              {uploadStatus && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    uploadStatus.type === 'success'
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/90 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {uploadStatus.type === 'success' ? '✓' : '✕'}
                    </span>
                    <span>{uploadStatus.message}</span>
                  </div>
                  {uploadStatus.type === 'success' && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer ml-3 shrink-0"
                    >
                      Start Studying →
                    </button>
                  )}
                </div>
              )}

              {/* Uploaded / Custom Questions Summary */}
              <div className="p-4 rounded-xl bg-[#080e1c] border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Uploaded Reviewers & Custom Bank
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {savedCustomQuestions.length} Questions Saved
                  </span>
                </div>

                {savedCustomQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No custom files uploaded yet. Upload a .docx or .txt file above to add custom questions to your flashcard deck. All 177+ built-in board exam questions are ready.
                  </p>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">
                      Your uploaded questions are securely stored in your browser storage and persist on Render.
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('bank')}
                      className="text-xs text-slate-200 underline hover:text-white cursor-pointer"
                    >
                      View in Question Bank
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PDF REVIEWERS */}
          {activeTab === 'pdf' && (
            <div className="flex flex-col gap-4">
              {/* Master Download Action Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#080e1c] border border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Master Printable Reviewer
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
            </div>
          )}

          {/* TAB 3: QUESTION BANK */}
          {activeTab === 'bank' && (
            <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3 max-h-[46vh] overflow-y-auto pr-1">
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
                            {q.sourceFileName && (
                              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[160px]">
                                • {q.sourceFileName}
                              </span>
                            )}
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
          )}
        </div>
      </div>
    </div>
  );
};
