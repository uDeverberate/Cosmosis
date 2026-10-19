import React, { useState } from 'react';
import { SPACE_GLOSSARY } from '../data/spaceAcademyData';
import { useAcademyStore } from '../store/useAcademyStore';
import { Modal } from './Modal';
import { BookOpen, Search, X, Sparkles, Volume2, Info } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export const GlossaryModal: React.FC = () => {
  const { isGlossaryOpen, setGlossaryOpen } = useAcademyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Orbits & Physics', 'Rockets & Tech', 'Planets & Moons', 'Stars & Galaxies'];

  const filteredTerms = SPACE_GLOSSARY.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.simpleDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.everydayAnalogy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.funFact && item.funFact.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const speakWord = (term: string, definition: string) => {
    soundFX.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${term}. ${definition}`);
      utterance.rate = 0.98;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Modal
      open={isGlossaryOpen}
      onClose={() => setGlossaryOpen(false)}
      labelledBy="glossary-title"
      className="w-full max-w-5xl bg-space-900 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
        {/* Header */}
        <div className="px-6 py-4 bg-space-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="glossary-title" className="text-base font-bold text-white">
                COSMOSIS Encyclopedia & Glossary ({SPACE_GLOSSARY.length} essential space terms)
              </h2>
              <p className="text-xs text-slate-400">
                Astrophysics and rocketry decoded into plain English, everyday analogies, and fun facts
              </p>
            </div>
          </div>
          <button
            onClick={() => setGlossaryOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close glossary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3.5 bg-space-900/90 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 20+ space concepts, black holes, orbits..."
              className="w-full bg-space-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                    : 'bg-space-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Cards Grid */}
        <p className="sr-only" aria-live="polite">
          {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} shown
        </p>
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.length === 0 && (
            <div className="md:col-span-2 rounded-xl border border-slate-800 bg-space-950/80 p-8 text-center space-y-2">
              <p className="text-sm text-slate-200">No terms match “{searchQuery}”.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-mono uppercase text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                Clear filters
              </button>
            </div>
          )}
          {filteredTerms.map((item) => (
            <div
              key={item.term}
              className="micro-card bg-space-950/85 border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.term}</h3>
                      <span className="text-[11px] font-mono text-cyan-400">
                        /{item.pronunciation}/ • {item.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => speakWord(item.term, item.simpleDefinition)}
                    className="p-1.5 rounded-lg bg-space-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                    title="Pronounce aloud"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 mt-3 leading-relaxed">
                  {item.simpleDefinition}
                </p>
              </div>

              <div className="space-y-2">
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg p-2.5 flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-100 leading-relaxed">
                    <strong className="text-amber-300 font-mono uppercase">Analogy: </strong>
                    {item.everydayAnalogy}
                  </p>
                </div>

                {item.funFact && (
                  <div className="bg-cyan-500/10 border border-cyan-500/25 rounded-lg p-2.5 flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-cyan-100 leading-relaxed">
                      <strong className="text-cyan-300 font-mono uppercase">Fun Fact: </strong>
                      {item.funFact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
    </Modal>
  );
};
