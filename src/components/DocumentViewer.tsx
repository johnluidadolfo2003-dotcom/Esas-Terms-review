import React, { useState, useMemo } from 'react';
import { FlashcardQuestion } from '../services/storageService';
import { extractKeywords, highlightTextWithKeywords } from '../services/keywordHighlighter';

interface DocumentViewerProps {
  questions: FlashcardQuestion[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ questions }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    const map: Record<string, {question: FlashcardQuestion, keywords: Set<string>}[]> = {};
    filteredQuestions.forEach((item) => {
      const subject = item.subject || 'Uncategorized';
      if (!map[subject]) {
        map[subject] = [];
      }
      const correctChoiceText = item.choices.find(c => c.id === item.correctChoiceId)?.text || item.correctChoiceId;
      const { questionKeywords } = extractKeywords(item.question, correctChoiceText);
      map[subject].push({ question: item, keywords: questionKeywords });
    });
    return map;
  }, [filteredQuestions]);

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 p-2 sm:p-4 text-zinc-900 font-sans print:p-0 print:m-0 print:max-w-none">
      <div className="bg-[#181a21] border border-[#272935] rounded-xl p-4 shadow-md flex flex-col gap-3 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252834]">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-zinc-100">Reviewer Document</h2>
          </div>
          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2dd4bf] hover:bg-[#26bba8] text-zinc-950 transition-colors cursor-pointer"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-8 shadow-xl font-serif text-black print:p-0 print:border-none print:shadow-none">
        <div className="text-center pb-6 mb-6 border-b border-black">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase">Reviewer Document</h1>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-xs">No questions found.</div>
        ) : (
          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed">
            {Object.entries(groupedItems).map(([subject, items]) => (
              <div key={subject} className="flex flex-col gap-3">
                <div className="border-b border-black pb-1 font-bold uppercase">{subject}</div>
                <div className="flex flex-col gap-4 pl-2">
                  {items.map((item, idx) => (
                    <div key={`${subject}-${item.question.id}-${idx}`} className="flex flex-col gap-1.5">
                      <div className="font-semibold text-black">
                        {idx + 1}. {highlightTextWithKeywords(item.question.question, item.keywords, 'underline')}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-4">
                        {item.question.choices.map((choice) => {
                          const isCorrect = choice.id === item.question.correctChoiceId;
                          return (
                            <div
                              key={`${item.question.id}-${choice.id}-${idx}`}
                              className={`text-sm ${isCorrect ? 'font-bold text-black bg-yellow-200 px-1 rounded' : 'text-gray-700'}`}
                            >
                              {choice.id.toUpperCase()}. {choice.text}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
