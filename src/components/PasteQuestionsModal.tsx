import React, { useState, useMemo } from 'react';
import { FlashcardQuestion, parseQuestionsFromText, getParentCategory } from '../services/questionParser';
import { downloadQuestionsPdf, downloadQuickRecallPdf, formatQuickRecallItem } from '../services/storageService';

interface PasteQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCustomQuestions: FlashcardQuestion[];
  allQuestions?: FlashcardQuestion[];
  onDeleteQuestion?: (id: string) => void;
  onAddQuestions?: (newQuestions: FlashcardQuestion[], subject: string, parentCategory?: 'ESAS' | 'MATH' | 'EE') => void;
}

export const PasteQuestionsModal: React.FC<PasteQuestionsModalProps> = ({
  isOpen,
  onClose,
  savedCustomQuestions,
  allQuestions = [],
  onDeleteQuestion,
  onAddQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'add'>('browse');
  const [bankViewMode, setBankViewMode] = useState<'recall' | 'cards'>('recall');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedRecall, setCopiedRecall] = useState<boolean>(false);

  // Bulk Add Category State
  const [targetParentCategory, setTargetParentCategory] = useState<'ESAS' | 'MATH' | 'EE'>('ESAS');
  const [selectedSubSubject, setSelectedSubSubject] = useState<string>('ESAS');
  const [customSubSubjectInput, setCustomSubSubjectInput] = useState<string>('');

  // Bulk Paste State
  const [bulkText, setBulkText] = useState('');
  const [bulkFileLoading, setBulkFileLoading] = useState(false);

  // Status feedback toast
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const exportQuestionsList = allQuestions.length > 0 ? allQuestions : savedCustomQuestions;

  // Existing sub-subjects grouped under ESAS, MATH, and EE
  const categorizedSubSubjects = useMemo(() => {
    const map: Record<'ESAS' | 'MATH' | 'EE', Set<string>> = {
      ESAS: new Set([
        'ESAS',
        '1001 terms part 1',
        '1001 terms part 2',
        '1001 terms part 3',
        'Economics',
        'Mechanics 1',
        'Mechanics 2',
        'Strength of Materials',
        'Fluid Mechanics',
        'Thermodynamics',
        'EE Laws',
        'Project Management',
        'Project Management 2.0',
        'Communication',
      ]),
      MATH: new Set(['MATH']),
      EE: new Set(['EE']),
    };

    exportQuestionsList.forEach((q) => {
      if (q.subject) {
        const parent = getParentCategory(q.subject, q);
        map[parent].add(q.subject);
      }
    });

    return {
      ESAS: Array.from(map.ESAS),
      MATH: Array.from(map.MATH),
      EE: Array.from(map.EE),
    };
  }, [exportQuestionsList]);

  // Question counts grouped per subject
  const subjectBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    exportQuestionsList.forEach((q) => {
      const subj = q.subject || 'General';
      counts[subj] = (counts[subj] || 0) + 1;
    });
    return counts;
  }, [exportQuestionsList]);

  // Unified filtered questions for Question Bank & PDF (both Recall & Cards)
  const filteredQuestions = useMemo(() => {
    return exportQuestionsList.filter((q) => {
      let matchesSubject = subjectFilter === 'All';
      if (!matchesSubject) {
        if (subjectFilter === 'ESAS' || subjectFilter === 'MATH' || subjectFilter === 'EE') {
          const parent = getParentCategory(q.subject, q);
          matchesSubject = parent === subjectFilter || q.subject === subjectFilter;
        } else {
          matchesSubject = q.subject === subjectFilter;
        }
      }

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesSubject;

      const matchesQuestion = q.question.toLowerCase().includes(query);
      const matchesChoices = q.choices.some((c) => c.text.toLowerCase().includes(query));
      const recallItem = formatQuickRecallItem(q);
      const matchesRecall =
        recallItem.term.toLowerCase().includes(query) ||
        recallItem.clue.toLowerCase().includes(query);

      return matchesSubject && (matchesQuestion || matchesChoices || matchesRecall);
    });
  }, [exportQuestionsList, subjectFilter, searchQuery]);

  // 1-line rapid recall items derived from filtered questions
  const formattedRecallItems = useMemo(() => {
    return filteredQuestions.map((q, idx) => {
      const item = formatQuickRecallItem(q);
      return {
        id: q.id || `recall-${idx}`,
        num: idx + 1,
        term: item.term,
        clue: item.clue,
        subject: q.subject,
        question: q,
      };
    });
  }, [filteredQuestions]);

  const handleCopyRecallSheet = () => {
    const lines = formattedRecallItems.map(
      (item) => `${item.num}. ${item.term} - ${item.clue}`
    );
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedRecall(true);
    setTimeout(() => setCopiedRecall(false), 2000);
  };

  // Effective sub-subject name
  const getEffectiveSubSubject = (): string => {
    if (selectedSubSubject === 'NEW') {
      const cleaned = customSubSubjectInput.trim();
      return cleaned.length > 0 ? cleaned : targetParentCategory;
    }
    return selectedSubSubject;
  };

  // Parsed questions preview for bulk paste
  const parsedBulkQuestionsPreview = useMemo(() => {
    if (!bulkText.trim()) return [];
    const effectiveSub = getEffectiveSubSubject();
    const parsed = parseQuestionsFromText(bulkText, 'Bulk_Pasted_Questions', `bulk-${Date.now()}`, effectiveSub as any);
    
    // Assign parentCategory tag to parsed questions
    return parsed.map((q) => ({
      ...q,
      parentCategory: targetParentCategory,
    }));
  }, [bulkText, targetParentCategory, selectedSubSubject, customSubSubjectInput]);

  if (!isOpen) return null;

  const handleBulkSubmit = () => {
    setFeedback(null);
    const finalSubSubject = getEffectiveSubSubject();

    if (parsedBulkQuestionsPreview.length === 0) {
      setFeedback({ type: 'error', message: 'No valid questions could be parsed from the text provided.' });
      return;
    }

    if (onAddQuestions) {
      onAddQuestions(parsedBulkQuestionsPreview, finalSubSubject, targetParentCategory);
    }

    setFeedback({
      type: 'success',
      message: `Successfully imported ${parsedBulkQuestionsPreview.length} questions into ${targetParentCategory} → "${finalSubSubject}"! They are now live in flashcards.`,
    });

    setBulkText('');
    setCustomSubSubjectInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFileLoading(true);
    setFeedback(null);

    try {
      let text = '';
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
          text = lines.join('\n');
        }
      } else {
        text = await file.text();
      }

      setBulkText(text);
      setFeedback({
        type: 'success',
        message: `Loaded file "${file.name}". Review the parsed preview below and click Import.`,
      });
    } catch (err) {
      console.error('File reading error:', err);
      setFeedback({ type: 'error', message: 'Could not read uploaded file. Please check file format.' });
    } finally {
      setBulkFileLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl bg-[#181a20] border border-[#272935] rounded-xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Modal Header with Navigation Tabs */}
        <div className="flex flex-col border-b border-[#272935] bg-[#14161c]">
          <div className="flex items-center justify-between px-5 py-3.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wider">
                Question Bank & Bulk Importer
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {exportQuestionsList.length} total reviewer items • Bulk add new questions or download PDF reviewers.
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

          {/* Top Tab Bar */}
          <div className="flex items-center gap-2 px-5 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'browse'
                  ? 'bg-zinc-200 text-zinc-950 border-zinc-100 shadow-sm'
                  : 'bg-[#191b22] border-[#272935] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Question Bank & PDFs</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                {exportQuestionsList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'add'
                  ? 'bg-[#2dd4bf] text-zinc-950 border-[#2dd4bf] shadow-sm'
                  : 'bg-[#191b22] border-[#272935] text-zinc-300 hover:text-white'
              }`}
            >
              <span>Bulk Add Questions</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 bg-[#14161c]">
          {/* Status Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 shadow-sm ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
              }`}
            >
              <span>{feedback.message}</span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-xs opacity-70 hover:opacity-100 cursor-pointer font-bold px-1.5"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === 'browse' ? (
            /* TAB 1: QUESTION BANK & PDFS (WITH INTEGRATED QUICK RECALL & FULL CARDS) */
            <>
              {/* Master Action Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#191b22] border border-[#272935] shadow-sm">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                    <span>All Subjects Reviewer PDFs</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {exportQuestionsList.length} Questions
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Download complete board reviewer as a short 1-line Quick Recall cheat sheet or full 4-choice Q&A PDF.
                  </p>
                </div>

                {/* Master Download Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => downloadQuickRecallPdf(exportQuestionsList, 'All')}
                    disabled={exportQuestionsList.length === 0}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 disabled:opacity-40 transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
                    title="Download rapid-recall cheat sheet (1 line per number, short definition) for fast memorization"
                  >
                    <svg className="w-3.5 h-3.5 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Download Quick Recall PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadQuestionsPdf(exportQuestionsList, 'All')}
                    disabled={exportQuestionsList.length === 0}
                    className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:opacity-40 transition-colors cursor-pointer text-center shadow-xs"
                    title="Download complete exam PDF containing all questions, choices, and answers"
                  >
                    Download Full Q&A PDF
                  </button>
                </div>
              </div>

              {/* Per-Subject Download Grid */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Download per Subject (Full Q&A & Quick Recall)
                  </h4>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {Object.keys(subjectBreakdown).length} Subjects Available
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

                      {/* Download Buttons: Full PDF + Quick Recall PDF beside each other */}
                      <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => downloadQuickRecallPdf(exportQuestionsList, subj)}
                          className="py-1.5 px-2 bg-amber-400/90 hover:bg-amber-300 text-zinc-950 font-bold rounded-md transition-colors text-center cursor-pointer truncate flex items-center justify-center gap-1 shadow-xs"
                          title={`Download short 1-line rapid recall cheat sheet for ${subj}`}
                        >
                          <svg className="w-3 h-3 text-zinc-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                          <span>Quick Recall</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadQuestionsPdf(exportQuestionsList, subj)}
                          className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-md font-medium transition-colors text-center cursor-pointer truncate"
                          title={`Download full Q&A PDF with 4 choices for ${subj}`}
                        >
                          Full PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Mode Switcher & Filter Bar */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-[#272935]">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  {/* Mode Selector Toggle: Quick Recall (1-Line) vs Full Cards */}
                  <div className="flex items-center p-1 bg-[#101217] rounded-xl border border-[#272935] self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setBankViewMode('recall')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        bankViewMode === 'recall'
                          ? 'bg-amber-400 text-zinc-950 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Short 1-line per number reviewer format for rapid familiarization"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span>Quick Recall (1-Line Mode)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBankViewMode('cards')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        bankViewMode === 'cards'
                          ? 'bg-zinc-200 text-zinc-950 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Full question cards with 4 choices and explanations"
                    >
                      <span>Question Cards</span>
                    </button>
                  </div>

                  {/* Actions for current filter / mode */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        bankViewMode === 'recall'
                          ? downloadQuickRecallPdf(exportQuestionsList, subjectFilter)
                          : downloadQuestionsPdf(exportQuestionsList, subjectFilter)
                      }
                      disabled={filteredQuestions.length === 0}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
                      title={`Download PDF for ${subjectFilter}`}
                    >
                      <svg className="w-3 h-3 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      <span>
                        {bankViewMode === 'recall' ? 'Download Recall PDF' : 'Download Cards PDF'}
                      </span>
                    </button>

                    {bankViewMode === 'recall' && (
                      <button
                        type="button"
                        onClick={handleCopyRecallSheet}
                        disabled={formattedRecallItems.length === 0}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                        title="Copy all lines to clipboard"
                      >
                        {copiedRecall ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="bg-[#191b22] border border-[#272935] text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-500 font-sans cursor-pointer"
                    >
                      <option value="All">All Subjects ({exportQuestionsList.length})</option>
                      <optgroup label="Main Categories">
                        <option value="ESAS">ESAS Category ({exportQuestionsList.filter(q => getParentCategory(q.subject, q) === 'ESAS').length})</option>
                        <option value="MATH">MATH Category ({exportQuestionsList.filter(q => getParentCategory(q.subject, q) === 'MATH').length})</option>
                        <option value="EE">EE Category ({exportQuestionsList.filter(q => getParentCategory(q.subject, q) === 'EE').length})</option>
                      </optgroup>
                      <optgroup label="Sub-Subjects / Topics">
                        {Object.keys(subjectBreakdown).map((subj) => (
                          <option key={subj} value={subj}>
                            {subj} ({subjectBreakdown[subj]})
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    <input
                      type="text"
                      placeholder="Search key terms, questions, or definitions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-[#191b22] border border-[#272935] text-zinc-200 text-xs rounded-lg px-3 py-2 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
                    />
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400 self-end sm:self-center shrink-0">
                    Showing {filteredQuestions.length} of {exportQuestionsList.length} items
                  </span>
                </div>
              </div>

              {/* View Content: QUICK RECALL SHEET or FULL QUESTION CARDS */}
              {bankViewMode === 'recall' ? (
                /* QUICK RECALL SHEET VIEW (1-Line per number, short explanation for fast familiarization) */
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                      {subjectFilter === 'All' ? 'ALL SUBJECTS' : subjectFilter} - QUICK RECALL REVIEWER
                    </span>
                    <span className="text-[11px] text-zinc-400 font-sans hidden sm:inline">
                      Short 1-line format • Highlighted key term and concise definition
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#0f1115] border border-[#22242e] flex flex-col gap-0.5 font-mono shadow-inner max-h-[48vh] overflow-y-auto">
                    {formattedRecallItems.length === 0 ? (
                      <div className="py-12 text-center text-zinc-500 text-xs">
                        No recall items match your current filter.
                      </div>
                    ) : (
                      formattedRecallItems.map((item, idx) => (
                        <React.Fragment key={item.id}>
                          <div className="py-1 px-1.5 rounded hover:bg-[#181a22] transition-colors flex items-start gap-1.5 text-xs leading-relaxed">
                            <span className="font-bold text-zinc-400 w-8 text-right shrink-0 select-none">
                              {item.num}.
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="bg-[#fef08a] text-[#0f172a] font-bold px-1.5 py-0.5 rounded text-[11px] inline-block mr-1 shadow-xs select-all">
                                {item.term}
                              </span>
                              <span className="text-zinc-400 font-bold mr-1.5">-</span>
                              <span className="text-zinc-200 font-sans text-xs select-all">
                                {item.clue}
                              </span>
                            </div>
                          </div>

                          {/* Subtle hairline divider every 5 items */}
                          {(idx + 1) % 5 === 0 && idx + 1 < formattedRecallItems.length && (
                            <div className="border-b border-[#21232d] my-1 ml-9" />
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* FULL QUESTION CARDS VIEW */
                filteredQuestions.length === 0 ? (
                  <div className="py-10 text-center text-zinc-500 flex flex-col items-center gap-2">
                    <p className="text-xs text-zinc-400">No questions match your current search.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectFilter('All');
                        setSearchQuery('');
                      }}
                      className="text-xs text-zinc-300 hover:underline cursor-pointer"
                    >
                      Reset search
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[48vh] overflow-y-auto pr-1">
                    {filteredQuestions.map((q, idx) => {
                      const correctChoiceObj = q.choices.find(
                        (c) => c.id.toUpperCase() === q.correctChoiceId.toUpperCase()
                      );
                      const recall = formatQuickRecallItem(q);

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
                                {getParentCategory(q.subject, q)} → {q.subject}
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

                          {/* Quick Recall 1-Line Tag */}
                          <div className="px-2.5 py-1 rounded bg-[#101217] border border-[#232631] text-[11px] font-mono flex items-center gap-1.5 overflow-hidden">
                            <span className="text-amber-400 font-bold shrink-0">Recall:</span>
                            <span className="bg-[#fef08a] text-[#0f172a] font-bold px-1 py-0.2 rounded text-[10px] shrink-0">
                              {recall.term}
                            </span>
                            <span className="text-zinc-500">-</span>
                            <span className="text-zinc-300 truncate font-sans">{recall.clue}</span>
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
                                  - {correctChoiceObj.text}
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
                )
              )}
            </>
          ) : (
            /* TAB 3: BULK ADD QUESTIONS TO ESAS, MATH, OR EE */
            <div className="flex flex-col gap-4">
              {/* Category & Sub-Subject Selection Panel */}
              <div className="p-4 rounded-xl bg-[#191b22] border border-[#272935] flex flex-col gap-3.5">
                {/* Step 1: Select Main Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center justify-between">
                    <span>1. Select Board Exam Category</span>
                    <span className="text-[10px] text-zinc-400 font-normal lowercase font-sans">
                      (ESAS, MATH, or EE)
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {(['ESAS', 'MATH', 'EE'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setTargetParentCategory(cat);
                          setSelectedSubSubject(cat);
                          setCustomSubSubjectInput('');
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border text-center ${
                          targetParentCategory === cat
                            ? 'bg-[#2dd4bf] border-[#2dd4bf] text-zinc-950 shadow-md ring-2 ring-[#2dd4bf]/40'
                            : 'bg-[#14161c] border-[#252733] text-zinc-300 hover:text-white hover:bg-[#1f212a]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select or Add Sub-Subject / Topic under chosen Category */}
                <div className="flex flex-col gap-1.5 pt-1 border-t border-[#252733]">
                  <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center justify-between">
                    <span>2. Select or Add Sub-Subject in {targetParentCategory}</span>
                    <span className="text-[10px] text-zinc-400 font-normal lowercase font-sans">
                      (Nested directly under {targetParentCategory})
                    </span>
                  </label>

                  <select
                    value={selectedSubSubject}
                    onChange={(e) => setSelectedSubSubject(e.target.value)}
                    className="bg-[#14161c] border border-[#2a2d3b] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-[#2dd4bf] cursor-pointer"
                  >
                    {categorizedSubSubjects[targetParentCategory].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub} ({subjectBreakdown[sub] || 0} questions)
                      </option>
                    ))}
                    <option value="NEW">+ Add New Sub-Subject under {targetParentCategory}...</option>
                  </select>

                  {/* Input for New Custom Sub-Subject */}
                  {selectedSubSubject === 'NEW' && (
                    <div className="mt-1.5 p-3 rounded-xl bg-[#1a2322] border border-[#2dd4bf]/40 flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#2dd4bf]">
                        New Sub-Subject Name under {targetParentCategory}:
                      </label>
                      <input
                        type="text"
                        placeholder={
                          targetParentCategory === 'ESAS'
                            ? 'e.g. Physics, Chemistry, Thermodynamics, Materials'
                            : targetParentCategory === 'MATH'
                            ? 'e.g. Calculus, Differential Equations, Algebra'
                            : 'e.g. Power Systems, Circuit Analysis, Electronics'
                        }
                        value={customSubSubjectInput}
                        onChange={(e) => setCustomSubSubjectInput(e.target.value)}
                        className="w-full bg-[#14161c] border border-[#2dd4bf] text-zinc-100 text-xs rounded-lg px-3.5 py-2 placeholder-zinc-500 font-bold focus:outline-none shadow-inner"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload Option */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#191b22] border border-[#272935]">
                <div>
                  <h4 className="text-xs font-bold text-zinc-100">
                    Upload Word Document or Text File
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Supports Word (.docx), Text (.txt), CSV spreadsheets, or JSON files.
                  </p>
                </div>

                <label className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0">
                  {bulkFileLoading ? 'Loading File...' : 'Choose File'}
                  <input
                    type="file"
                    accept=".txt,.docx,.json,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={bulkFileLoading}
                  />
                </label>
              </div>

              {/* Textarea for Bulk Paste */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                  <span>Paste Formatted Questions Text</span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Standard format: 1. Question... A. Option A... Answer: A
                  </span>
                </label>
                <textarea
                  rows={9}
                  placeholder={`Paste questions here. Example:

1. What is Newton's second law of motion?
A. F = ma
B. F = mv
C. E = mc^2
D. V = IR
Answer: A
Explanation: Newton's second law states that force equals mass times acceleration.

2. What is the unit of power?
A. Watt
B. Joule
C. Pascal
D. Volt
Answer: A`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-[#191b22] border border-[#272935] text-zinc-100 text-xs rounded-xl p-3.5 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono leading-relaxed"
                />
              </div>

              {/* Live Parsed Preview */}
              {parsedBulkQuestionsPreview.length > 0 && (
                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#191b22] border border-[#2dd4bf]/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2dd4bf]">
                      Preview: {parsedBulkQuestionsPreview.length} questions parsed
                    </span>
                    <span className="text-[11px] font-mono text-zinc-300">
                      Destination: <strong className="text-[#2dd4bf]">{targetParentCategory} → {getEffectiveSubSubject()}</strong>
                    </span>
                  </div>

                  <div className="max-h-40 overflow-y-auto flex flex-col gap-2 pr-1 pt-1">
                    {parsedBulkQuestionsPreview.slice(0, 5).map((pq, pidx) => (
                      <div
                        key={pidx}
                        className="p-2 rounded bg-[#14161c] border border-[#252733] text-xs flex flex-col gap-1"
                      >
                        <span className="font-semibold text-zinc-200">
                          #{pidx + 1}. {pq.question}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300">
                          Answer: Option {pq.correctChoiceId}
                        </span>
                      </div>
                    ))}
                    {parsedBulkQuestionsPreview.length > 5 && (
                      <span className="text-[11px] text-zinc-500 italic text-center">
                        + {parsedBulkQuestionsPreview.length - 5} more questions
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Submit Button */}
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={parsedBulkQuestionsPreview.length === 0}
                className="w-full py-3.5 px-4 bg-[#2dd4bf] hover:bg-[#26bba8] text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>
                  📥 Import {parsedBulkQuestionsPreview.length} Questions into {targetParentCategory} → "{getEffectiveSubSubject()}"
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
