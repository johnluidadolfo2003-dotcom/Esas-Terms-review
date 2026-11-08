import React, { useState, useMemo } from 'react';
import { LOOKSFAM_DATA, LooksfamItem } from '../data/looksfamData';

export const LooksfamViewer: React.FC = () => {
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

  // Group items by category for realistic document sectioning
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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 p-2 sm:p-4 text-zinc-100 font-sans print:p-0 print:m-0 print:max-w-none">
      {/* Top Controls Bar (Hidden during Print) */}
      <div className="bg-[#181a21] border border-[#272935] rounded-xl p-4 shadow-md flex flex-col gap-3 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252834]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/40">
                ESAS LOOKSFAM PDF REVIEWER
              </span>
              <span className="text-xs text-zinc-400 font-mono">Compiled by: Kyo</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">
              Original Document Reviewer Sheet
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2dd4bf] hover:bg-[#26bba8] text-zinc-950 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Print or Save as PDF Document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m11.318-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231a1.125 1.125 0 01-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.085 48.085 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.085 48.085 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.656" />
              </svg>
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filters */}
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
              placeholder="Search PDF document text..."
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
      </div>

      {/* PDF DOCUMENT SHEET VIEW (Clean un-boxed white text layout) */}
      <div className="bg-[#13151c] border border-[#232532] rounded-xl p-5 sm:p-8 shadow-xl font-sans text-zinc-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="text-center pb-6 mb-6 border-b border-[#252736] print:border-black">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white print:text-black uppercase">
            ESAS LOOKSFAM
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 print:text-gray-700 italic mt-1">
            Compiled by: Kyo
          </p>
        </div>

        {/* Document Content List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs">
            No terms matching search query.
          </div>
        ) : (
          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="flex flex-col gap-2">
                {/* Category Section Title */}
                <div className="flex items-center gap-2 border-b border-[#252736] print:border-black pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2dd4bf] print:text-black font-mono">
                    {category}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono print:text-gray-600">
                    ({items.length} items)
                  </span>
                </div>

                {/* Un-boxed Clean Document Lines */}
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

                          {/* Plain Clean White Text - No Background Highlights, No Boxes */}
                          <div className="flex-1 leading-snug text-zinc-100 print:text-black">
                            <span className="font-semibold text-zinc-100 print:text-black">
                              {item.keyword}
                            </span>

                            <span className="text-zinc-400 font-bold mx-1.5 print:text-black">=</span>

                            {/* Correct Answer Highlighted */}
                            <span className="bg-[#183935] text-[#2dd4bf] font-extrabold px-2 py-0.5 rounded border border-[#2dd4bf]/50 inline-block print:bg-yellow-200 print:text-black print:border-black">
                              {item.answer}
                            </span>
                          </div>
                        </div>

                        {/* Star Bookmark Icon (Hidden in Print) */}
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

        {/* Document Footer */}
        <div className="mt-8 pt-4 border-t border-[#252736] print:border-black text-center text-[10px] text-zinc-500 font-mono print:text-gray-600">
          ESAS LOOKSFAM Reviewer • Electrical Engineering Board Exam • Page 1 of 1 Sheet
        </div>
      </div>
    </div>
  );
};
