import React, { useState, useMemo } from 'react';
import { FlashcardQuestion } from '../services/storageService';

interface DocumentViewerProps {
  questions: FlashcardQuestion[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ questions }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('terms_doc_dark_mode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('terms_doc_dark_mode', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save doc dark mode:', err);
      }
      return next;
    });
  };

  const filteredQuestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return questions;
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q)
    );
  }, [questions, searchQuery]);

  const groupedItems = useMemo(() => {
    const map: Record<string, FlashcardQuestion[]> = {};
    filteredQuestions.forEach((item) => {
      const subject = item.subject || 'Uncategorized';
      if (!map[subject]) {
        map[subject] = [];
      }
      map[subject].push(item);
    });
    return map;
  }, [filteredQuestions]);

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col gap-4 p-2 sm:p-4 font-sans print:p-0 print:m-0 print:max-w-none ${
      isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
    }`}>
      {/* Document Controls Toolbar */}
      <div className="bg-[#181a21] border border-[#272935] rounded-xl p-3 sm:p-4 shadow-md flex flex-col gap-3 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#252834]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm sm:text-base font-bold text-zinc-100">Reviewer Document</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#131418] border border-[#272935] text-zinc-400">
              {filteredQuestions.length} Items
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={handleToggleDarkMode}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isDarkMode
                  ? 'bg-[#131418] hover:bg-[#1f222b] text-amber-300 border-[#2f3240]'
                  : 'bg-zinc-100 hover:bg-white text-zinc-900 border-zinc-300'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span>Light Mode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2dd4bf] hover:bg-[#26bba8] text-zinc-950 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.29-.42-2.612-.42-3.829 0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.217-.18 2.539-.42 3.829m-15.16 0A8.962 8.962 0 003 18c0 .88.13 1.728.37 2.529m17.26-6.7c.24.801.37 1.649.37 2.529 0 4.418-3.582 8-8 8s-8-3.582-8-8c0-.88.13-1.728.37-2.529" />
              </svg>
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Search input in document view */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords in document..."
            className="w-full bg-[#131418] border border-[#272935] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2dd4bf]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Document Content Container */}
      <div className={`rounded-xl p-5 sm:p-8 transition-colors ${
        isDarkMode
          ? 'bg-[#161820] border border-[#272935] text-zinc-100 shadow-xl'
          : 'bg-white border border-zinc-200 text-zinc-900 shadow-xl'
      } print:bg-white print:border-none print:shadow-none print:text-black print:p-0`}>
        <div className={`text-center pb-5 mb-6 border-b ${
          isDarkMode ? 'border-[#272935]' : 'border-zinc-300'
        } print:border-b-black print:text-black`}>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase">Reviewer Document</h1>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} print:text-zinc-700`}>
            Comprehensive Subject Reviewer
          </p>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className={`text-center py-10 text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
            No questions found.
          </div>
        ) : (
          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed">
            {Object.entries(groupedItems).map(([subject, items]) => (
              <div key={subject} className="flex flex-col gap-3">
                <div className={`pb-1 font-bold uppercase tracking-wider text-xs sm:text-sm border-b ${
                  isDarkMode
                    ? 'border-[#272935] text-[#2dd4bf]'
                    : 'border-zinc-300 text-zinc-800'
                } print:border-b-black print:text-black`}>
                  {subject} ({items.length})
                </div>

                <div className="flex flex-col gap-4 pl-2">
                  {items.map((question, idx) => {
                    const uniqueQuestionKey = `doc-${subject}-${question.id}-${idx}`;
                    return (
                      <div key={uniqueQuestionKey} className="flex flex-col gap-1.5">
                        <div className={`font-semibold ${
                          isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
                        } print:text-black`}>
                          {idx + 1}. {question.question}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-4">
                          {question.choices.map((choice, cIdx) => {
                            const isCorrect = choice.id === question.correctChoiceId;
                            const choiceKey = `choice-${uniqueQuestionKey}-${choice.id}-${cIdx}`;
                            
                            let choiceClasses = '';
                            if (isCorrect) {
                              choiceClasses = isDarkMode
                                ? 'font-bold text-amber-200 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded shadow-xs'
                                : 'font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shadow-xs';
                            } else {
                              choiceClasses = isDarkMode
                                ? 'text-zinc-400 py-0.5 px-2'
                                : 'text-zinc-700 py-0.5 px-2';
                            }

                            return (
                              <div
                                key={choiceKey}
                                className={`text-xs sm:text-sm transition-colors ${choiceClasses} print:text-black ${
                                  isCorrect ? 'print:font-bold print:bg-amber-100 print:border-amber-400 print:px-1' : 'print:text-zinc-800 print:px-0'
                                }`}
                              >
                                {choice.id.toUpperCase()}. {choice.text}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

