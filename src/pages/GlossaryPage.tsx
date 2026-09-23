import React, { useState, useMemo } from 'react';
import { DSD_GLOSSARY } from '../data/glossary';
import { GlossaryTerm } from '../types/course';
import { useCourseStore } from '../store/useCourseStore';
import { Bookmark, BookmarkCheck, Search, BookOpen, ChevronRight, Tag } from 'lucide-react';
import { BinarySearchTree } from '../dsa';

export const GlossaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { studentProgress, toggleBookmarkTerm } = useCourseStore();

  const categories = [
    'All',
    'Sequential',
    'Logic Families',
    'FSM & PLD',
    'Verilog & Testing',
    'General',
  ];

  const bookmarkedSet = useMemo(
    () => new Set(studentProgress.bookmarkedTerms),
    [studentProgress.bookmarkedTerms]
  );

  // --- DSA MODULE 2: BINARY SEARCH TREE (BST) FOR GLOSSARY INDEXING ---
  // Terms are inserted into a BST keyed by term.toLowerCase().
  // 1. inOrderTraversal() yields elements in strictly sorted alphabetical order in O(N) time.
  // 2. searchPrefix(q) executes fast O(log N + M) prefix searching.
  // 3. Fallback to linear scan for definition/formula substrings.
  const glossaryBST = useMemo(() => {
    const bst = new BinarySearchTree<string, GlossaryTerm>();
    DSD_GLOSSARY.forEach((term) => {
      bst.insert(term.term.toLowerCase(), term);
    });
    return bst;
  }, []);

  const filteredTerms = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let candidateTerms: GlossaryTerm[];

    if (!q) {
      // In-order traversal yields alphabetically sorted sequence in O(N) without external sort
      candidateTerms = glossaryBST.inOrderTraversal();
    } else {
      // Step 1: Query BST for prefix matches in O(log N + M)
      const bstPrefixMatches = glossaryBST.searchPrefix(q);
      const matchedIds = new Set(bstPrefixMatches.map((t) => t.id));

      // Step 2: Linear search fallback for definitions/formula substrings (DSA Module 3: 3.1)
      const substringMatches = DSD_GLOSSARY.filter((item) => {
        if (matchedIds.has(item.id)) return false;
        return (
          item.term.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q) ||
          (item.formulaOrExample && item.formulaOrExample.toLowerCase().includes(q))
        );
      });

      candidateTerms = [...bstPrefixMatches, ...substringMatches];
    }

    if (selectedCategory === 'All') return candidateTerms;
    return candidateTerms.filter((item) => item.category === selectedCategory);
  }, [glossaryBST, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-purple-600 shadow-sm transition-colors">
        {/* Playful Ambient Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-brand-mid/20 to-mod4/20 blur-3xl opacity-60 animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-mod3/20 to-mod2/20 blur-3xl opacity-50 animate-blob-drift-2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-vivid-brand uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
              <BookOpen className="w-4 h-4 text-white" />
              Comprehensive Technical Index • 80+ Vetted Terms
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-white">
            <span className="text-brand-gradient">Digital System Design</span> Glossary
          </h1>
          <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl font-medium leading-relaxed">
            Exhaustive alphabetical reference of essential digital electronics definitions, characteristic equations, logic rules, and hardware timing terminology.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-mid absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search terms, equations, or definitions (e.g. race-around, noise margin, fan-out)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-xs font-sans text-ink-900 dark:text-white placeholder:text-ink-500 dark:placeholder:text-cream-muted focus:outline-none focus:border-brand-mid shadow-inner font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 bg-cream-soft dark:bg-darklab-subtle p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all ${
                    selectedCategory === cat
                      ? 'btn-brand-gradient !text-white shadow-brand'
                      : 'text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-sans text-ink-700 dark:text-cream-muted px-1 font-bold">
        <span>
          Showing {filteredTerms.length} of {DSD_GLOSSARY.length} terms
        </span>
        {bookmarkedSet.size > 0 && (
          <span className="text-brand-mid dark:text-purple-400 font-black">
            {bookmarkedSet.size} term{bookmarkedSet.size > 1 ? 's' : ''} bookmarked
          </span>
        )}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTerms.map((item) => {
          const isBookmarked = bookmarkedSet.has(item.id);
          const modNumber = item.moduleRef;
          const cardBorderClass =
            modNumber === 1
              ? 'border-t-4 border-t-coral-500'
              : modNumber === 2
              ? 'border-t-4 border-t-amber-500'
              : modNumber === 3
              ? 'border-t-4 border-t-emerald-500'
              : modNumber === 4
              ? 'border-t-4 border-t-purple-600'
              : 'border-t-4 border-t-indigo-600';

          const badgeClass =
            modNumber === 1
              ? 'badge-vivid-mod1'
              : modNumber === 2
              ? 'badge-vivid-mod2'
              : modNumber === 3
              ? 'badge-vivid-mod3'
              : modNumber === 4
              ? 'badge-vivid-mod4'
              : 'badge-vivid-brand';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-3 bg-white dark:bg-darklab-card ${cardBorderClass} ${
                isBookmarked
                  ? 'border-brand-mid ring-2 ring-brand-mid shadow-brand'
                  : 'border-cream-border dark:border-darklab-border hover:border-brand-mid shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`${badgeClass} text-[10px] font-sans uppercase tracking-wider font-bold`}>
                      {item.category} • Module {item.moduleRef}
                    </span>
                    <h3 className="text-base font-display font-bold text-ink-900 dark:text-white mt-2">{item.term}</h3>
                  </div>
                  <button
                    onClick={() => toggleBookmarkTerm(item.id)}
                    className={`p-2 rounded-xl transition-all ${
                      isBookmarked
                        ? '!text-white btn-brand-gradient shadow-brand'
                        : 'text-ink-600 hover:text-brand-mid dark:text-darklab-muted hover:bg-cream-soft dark:hover:bg-darklab-subtle'
                    }`}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark term for quick review'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-ink-800 dark:text-cream-paper mt-2 leading-relaxed font-sans font-medium">
                  {item.definition}
                </p>

                {item.formulaOrExample && (
                  <div className="mt-3 p-3 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-[11px] font-mono text-brand-mid dark:text-purple-400 font-bold break-words">
                    <span className="text-ink-600 dark:text-cream-muted block text-[10px] font-sans uppercase tracking-wider mb-0.5 font-bold">
                      Formula / Example:
                    </span>
                    {item.formulaOrExample}
                  </div>
                )}
              </div>

              {item.relatedTerms.length > 0 && (
                <div className="pt-2 border-t border-cream-border dark:border-darklab-border flex flex-wrap items-center gap-1.5 font-sans">
                  <span className="text-[10px] text-ink-600 dark:text-cream-muted font-bold flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> Related:
                  </span>
                  {item.relatedTerms.map((rt, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchTerm(rt)}
                      className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-cream-soft hover:bg-brand-mid hover:!text-white text-ink-700 dark:text-cream-muted dark:hover:!text-white border border-cream-border dark:border-darklab-border transition-colors font-bold"
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
