import React, { useState, useMemo } from 'react';
import { LOOKSFAM_DATA, LooksfamItem } from '../data/looksfamData';

export const LooksfamViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>('pdf');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('looksfam_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const pdfUrl = '/assets/aistudio/ilide.info-looksfam-esas-pr_e3ba69a5276a50760484e7a187c1fdd7__1__27371b24.pdf';

  const categories = useMemo(() => {
    const cats = ['All', 'Bookmarks'];
    const uniqueCats = Array.from(new Set(LOOKSFAM_DATA.map((item) => item.category)));
    return [...cats, ...uniqueCats];
  }, []);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('looksfam_bookmarks', JSON.stringify(Array.from(next)));
      } catch (err) {
        console.error('Failed to save looksfam bookmarks:', err);
      }
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    return LOOKSFAM_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === 'All'
          ? true
          : activeCategory === 'Bookmarks'
          ? bookmarkedIds.has(item.id)
          : item.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.keyword.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, bookmarkedIds]);

  const groupedItems = useMemo(() => {
    const map: Record<string, LooksfamItem[]> = {};
    filteredItems.forEach((item) => {
      if (!map[item.category]) {
        map[item.category] = [];
      }
      map[item.category].push(item);
    });
    return map;
  }, [filteredItems]);

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 p-2 sm:p-4 text-zinc-100 font-sans print:p-0 print:m-0 print:max-w-none">
      {/* Header & Main Mode Toggle Bar */}
      <div className="bg-[#181a21] border border-[#272935] rounded-xl p-4 shadow-md flex flex-col gap-3 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252834]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/40">
                ESAS LOOKSFAM
              </span>
              <span className="text-xs text-zinc-400 font-mono">Compiled by: Kyo</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">
              Direct PDF Material Viewer
            </h2>
          </div>

          {/* View Mode Switcher: PDF Direct Embed vs Searchable Text */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#12141a] p-1 rounded-lg border border-[#232632]">
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'pdf'
                    ? 'bg-[#2dd4bf] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>📄 Direct PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('text')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'text'
                    ? 'bg-[#2dd4bf] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>⚡ Search & Answers</span>
              </button>
            </div>

            {viewMode === 'text' && (
              <button
                type="button"
                onClick={handlePrintPdf}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#20232d] hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Print Document"
              >
                <span>Print</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-controls when in Searchable Text View */}
        {viewMode === 'text' && (
          <div className="flex flex-col gap-2.5">
            <div className="relative">
              <svg
                className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terms, keywords, or answers..."
                className="w-full pl-9 pr-9 py-1.5 bg-[#12141a] border border-[#272935] focus:border-[#2dd4bf] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2dd4bf] text-zinc-950 font-bold'
                        : 'bg-[#12141a] text-zinc-400 hover:text-zinc-200 border border-[#252834]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 1. DIRECT EMBEDDED ORIGINAL PDF VIEWER */}
      {viewMode === 'pdf' ? (
        <div className="w-full flex flex-col gap-3">
          <div className="bg-[#15171f] border border-[#262836] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[780px]">
            <div className="bg-[#11131a] border-b border-[#222432] px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-semibold truncate flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>ilide.info-looksfam-esas-pr.pdf (8 Pages)</span>
              </span>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#1c1f2a] hover:bg-[#252938] text-teal-300 border border-teal-500/30 transition-colors text-[11px] font-sans flex items-center gap-1"
              >
                <span>Open in New Tab ↗</span>
              </a>
            </div>

            <iframe
              src={pdfUrl}
              className="w-full flex-1 bg-[#1e2029]"
              title="ESAS LOOKSFAM Original PDF Viewer"
            />
          </div>
        </div>
      ) : (
        /* 2. SEARCHABLE TEXT & HIGHLIGHTED ANSWERS VIEW */
        <div className="bg-[#13151c] border border-[#232532] rounded-xl p-5 sm:p-8 shadow-xl font-sans text-zinc-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          <div className="text-center pb-6 mb-6 border-b border-[#252736] print:border-black">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white print:text-black uppercase">
              ESAS LOOKSFAM
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 print:text-gray-700 italic mt-1">
              Compiled by: Kyo
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 text-xs">
              No terms matching search query.
            </div>
          ) : (
            <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 border-b border-[#252736] print:border-black pb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2dd4bf] print:text-black font-mono">
                      {category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono print:text-gray-600">
                      ({items.length} items)
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 pl-1 sm:pl-2">
                    {items.map((item) => {
                      const isBookmarked = bookmarkedIds.has(item.id);

                      return (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-2 py-0.5 group hover:bg-[#1a1c26] rounded px-1 transition-colors print:py-0.5"
                        >
                          <div className="flex items-start gap-2 flex-1">
                            <span className="text-zinc-500 select-none print:text-gray-900 font-bold">*</span>

                            <div className="flex-1 leading-snug text-zinc-100 print:text-black">
                              <span className="font-semibold text-zinc-100 print:text-black">
                                {item.keyword}
                              </span>

                              <span className="text-zinc-400 font-bold mx-1.5 print:text-black">=</span>

                              <span className="bg-[#183935] text-[#2dd4bf] font-extrabold px-2 py-0.5 rounded border border-[#2dd4bf]/50 inline-block print:bg-yellow-200 print:text-black print:border-black">
                                {item.answer}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(item.id)}
                            className={`print:hidden p-1 rounded text-xs transition-colors cursor-pointer shrink-0 ${
                              isBookmarked ? 'text-amber-400' : 'text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-amber-300'
                            }`}
                            title={isBookmarked ? 'Bookmarked' : 'Bookmark term'}
                          >
                            ★
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-[#252736] print:border-black text-center text-[10px] text-zinc-500 font-mono print:text-gray-600">
            ESAS LOOKSFAM Reviewer • Electrical Engineering Board Exam • Page 1 of 1 Sheet
          </div>
        </div>
      )}
    </div>
  );
};
