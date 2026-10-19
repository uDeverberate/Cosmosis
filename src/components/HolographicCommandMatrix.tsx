import React, { useState, useEffect, useRef } from 'react';
import { useAcademyStore } from '../store/useAcademyStore';
import { SOLAR_SYSTEM_PLANETS, SPACECRAFT_FLEET, SPACE_STORIES } from '../data/spaceAcademyData';
import { AcademyTab } from '../types/academy';
import { soundFX } from '../utils/soundEffects';
import {
  ChevronDown,
  Orbit,
  Rocket,
  BookOpen,
  Compass,
  Gamepad2,
  X,
  ExternalLink,
  Search,
} from 'lucide-react';

interface HolographicCommandMatrixProps {
  onSelectPlanet?: (planetId: string) => void;
  onSelectCraft?: (craftId: string) => void;
  onReturnToSolarSystem?: () => void;
  currentPlanetId?: string;
  currentCraftId?: string;
  isCloseup?: boolean;
}

export const HolographicCommandMatrix: React.FC<HolographicCommandMatrixProps> = ({
  onSelectPlanet,
  onSelectCraft,
  onReturnToSolarSystem,
  currentPlanetId = 'earth',
  currentCraftId,
  isCloseup = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const matrixRef = useRef<HTMLDivElement>(null);

  const { activeTab, setActiveTab, openWalkthrough, setGlossaryOpen } = useAcademyStore();

  const currentPlanet = SOLAR_SYSTEM_PLANETS.find((p) => p.id === currentPlanetId) || SOLAR_SYSTEM_PLANETS[3];

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setIsOpen((prev) => !prev);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (matrixRef.current && !matrixRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenMatrix = () => {
    soundFX.playClick();
    setIsOpen((prev) => !prev);
  };

  const handlePlanetClick = (id: string) => {
    soundFX.playClick();
    setActiveTab('explorer');
    if (onSelectPlanet) onSelectPlanet(id);
    setIsOpen(false);
  };

  const handleCraftClick = (id: string) => {
    soundFX.playClick();
    setActiveTab('explorer');
    if (onSelectCraft) onSelectCraft(id);
    setIsOpen(false);
  };

  const handleModuleClick = (tab: AcademyTab) => {
    soundFX.playClick();
    setActiveTab(tab);
    setIsOpen(false);
  };

  const filteredPlanets = SOLAR_SYSTEM_PLANETS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCraft = SPACECRAFT_FLEET.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={matrixRef} className="relative z-50 max-w-full min-w-0">
      {/* Floating Tactical Dropdown Pill Button */}
      <button
        onClick={handleOpenMatrix}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`group flex items-center gap-2 sm:gap-2.5 max-w-full min-w-0 px-2.5 sm:px-3.5 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-xl ${
          isOpen
            ? 'bg-space-900 border-[#ff3b21] shadow-lg shadow-[#ff3b21]/20 text-white'
            : 'bg-space-950/80 hover:bg-space-900/90 border-slate-700/80 hover:border-cyan-400 text-slate-200 shadow-md'
        }`}
        title="Open Celestial Navigator & System Menu (Press 'N')"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#ff3b21] animate-ping shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white truncate max-w-[96px] sm:max-w-[190px] lg:max-w-none">
            {activeTab === 'explorer'
              ? isCloseup
                ? `TARGET // ${currentPlanet.name.toUpperCase()}`
                : 'SOLAR SYSTEM // ORBITAL VIEW'
              : activeTab === 'stories'
              ? 'CHRONICLES // 6 STORIES'
              : activeTab === 'guides'
              ? 'LABS // 4 SIMULATORS'
              : 'GAMES // FLIGHT ARCADE'}
          </span>
        </div>

        <div className="flex items-center gap-1 pl-1.5 border-l border-slate-700/80 text-[10px] font-mono text-cyan-400 group-hover:text-cyan-300 shrink-0">
          <span className="hidden lg:inline">NAVIGATOR</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-[#ff3b21]' : 'text-cyan-400'
            }`}
          />
        </div>
      </button>

      {/* Holographic Aerospace Grid Dropdown Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Celestial command matrix"
          className="fixed inset-x-2 sm:inset-x-4 top-[6.75rem] sm:top-[7rem] max-w-5xl mx-auto bg-space-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto"
        >
          {/* Drawer Top Header & Quick Search */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#ff3b21]/15 border border-[#ff3b21]/30 flex items-center justify-center text-[#ff3b21] shrink-0">
                <Orbit className="h-4 w-4 animate-spin" style={{ animationDuration: '24s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-white">
                    CELESTIAL COMMAND MATRIX
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#ff3b21]/20 text-[#ff3b21] font-bold">
                    SYSTEM INDEX
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  Select any celestial body, historic spacecraft, or flight module
                </p>
              </div>
            </div>

            {/* Quick Search & Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search worlds, craft..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/70 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 w-full sm:w-52"
                />
              </div>

              {onReturnToSolarSystem && isCloseup && (
                <button
                  onClick={() => {
                    onReturnToSolarSystem();
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 text-xs font-mono uppercase font-bold flex items-center gap-1.5 shrink-0"
                >
                  <Orbit className="h-3 w-3" />
                  <span>Solar</span>
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-space-900 hover:bg-space-800 border border-slate-800 text-slate-400 hover:text-white shrink-0"
                title="Close (ESC)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Module Switcher Tabs (Instant Access for Mobile, Tablets & PCs) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 pb-1 border-b border-slate-800/80">
            <button
              onClick={() => handleModuleClick('explorer')}
              className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                activeTab === 'explorer'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                  : 'bg-black/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Orbit className="h-4 w-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">3D Observatory</div>
                <div className="text-[10px] font-mono text-cyan-300 truncate">Planets & Fleet</div>
              </div>
            </button>

            <button
              onClick={() => handleModuleClick('stories')}
              className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                activeTab === 'stories'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                  : 'bg-black/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <BookOpen className="h-4 w-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Chronicles</div>
                <div className="text-[10px] font-mono text-amber-300 truncate">6 Dioramas</div>
              </div>
            </button>

            <button
              onClick={() => handleModuleClick('guides')}
              className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                activeTab === 'guides'
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-sm'
                  : 'bg-black/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Compass className="h-4 w-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Physics Labs</div>
                <div className="text-[10px] font-mono text-purple-300 truncate">4 Simulators</div>
              </div>
            </button>

            <button
              onClick={() => handleModuleClick('games')}
              className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                activeTab === 'games'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm'
                  : 'bg-black/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Gamepad2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Flight Arcade</div>
                <div className="text-[10px] font-mono text-emerald-300 truncate">5 Games & Trivia</div>
              </div>
            </button>
          </div>

          {/* Orientation & reference utilities (reachable on every screen size) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 pb-1 border-b border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openWalkthrough(0);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-cyan-400/60 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                Orientation tour
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setGlossaryOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-amber-400/60 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                Space glossary
              </button>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Shortcuts: <kbd className="text-slate-300">N</kbd> menu · <kbd className="text-slate-300">H</kbd> hide HUD · <kbd className="text-slate-300">ESC</kbd> back
            </span>
          </div>

          {/* Grid Layout of All Platform Offerings */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3">
            {/* Left 7 Columns: Solar System Worlds & Spacecraft Hangar */}
            <div className="md:col-span-7 space-y-4">
              {filteredPlanets.length === 0 && filteredCraft.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-black/60 p-5 text-center space-y-2">
                  <p className="text-xs text-slate-300">
                    No worlds or spacecraft match “{searchQuery}”.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] font-mono uppercase text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* 1. Solar System Planets */}
              <div className={filteredPlanets.length === 0 ? 'hidden' : undefined}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff3b21] font-bold flex items-center gap-1.5">
                    <Orbit className="h-3 w-3" />
                    SOLAR SYSTEM WORLDS ({filteredPlanets.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Click to fly into 3D orbit</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredPlanets.map((planet) => {
                    const isSelected = isCloseup && currentPlanetId === planet.id;
                    return (
                      <button
                        key={planet.id}
                        onClick={() => handlePlanetClick(planet.id)}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                            : 'bg-black/60 border-slate-800 hover:border-cyan-400/60 hover:bg-space-900/80 text-slate-300'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: planet.color }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate leading-tight">
                            {planet.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {planet.category.split(' ')[0]}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Spacecraft Fleet in 3D Hangar (6) */}
              <div className={filteredCraft.length === 0 ? 'hidden' : undefined}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                    <Rocket className="h-3 w-3" />
                    3D SPACECRAFT HANGAR ({filteredCraft.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Interactive Subsystem Scans</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredCraft.map((craft) => {
                    const isSelected = currentCraftId === craft.id;
                    return (
                      <button
                        key={craft.id}
                        onClick={() => handleCraftClick(craft.id)}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                            : 'bg-black/60 border-slate-800 hover:border-cyan-400/60 hover:bg-space-900/80 text-slate-300'
                        }`}
                      >
                        <span className="text-base">{craft.badgeEmoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate leading-tight">
                            {craft.name}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400 truncate">
                            {craft.year} • {craft.destination}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Mission Chronicles, Physics Labs & Simulators */}
            <div className="md:col-span-5 space-y-3.5 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4">
              {/* Mission Chronicles */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" />
                    HISTORIC CHRONICLES (6)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Interactive 3D Dioramas</span>
                </div>

                <div className="space-y-1">
                  {SPACE_STORIES.slice(0, 3).map((story) => (
                    <button
                      key={story.id}
                      onClick={() => handleModuleClick('stories')}
                      className="w-full text-left p-2 rounded-lg bg-black/60 border border-slate-800 hover:border-amber-400/60 flex items-center justify-between group transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-white truncate group-hover:text-amber-300">
                          {story.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {story.era} • {story.chapters.length} Chapters
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-amber-400 shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={() => handleModuleClick('stories')}
                    className="w-full py-1 text-center text-[10px] font-mono text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View All 6 Chronicles →
                  </button>
                </div>
              </div>

              {/* Physics Labs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                    <Compass className="h-3 w-3" />
                    TACTICAL LABS (4)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Live Physics Sims</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleModuleClick('guides')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-emerald-400 text-left text-xs font-medium text-white truncate"
                  >
                    🚀 Rocket Equation
                  </button>
                  <button
                    onClick={() => handleModuleClick('guides')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-emerald-400 text-left text-xs font-medium text-white truncate"
                  >
                    🎯 Orbital Cannon
                  </button>
                  <button
                    onClick={() => handleModuleClick('guides')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-emerald-400 text-left text-xs font-medium text-white truncate"
                  >
                    🔭 Exoplanet Transit
                  </button>
                  <button
                    onClick={() => handleModuleClick('guides')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-emerald-400 text-left text-xs font-medium text-white truncate"
                  >
                    👨‍🚀 EVA Spacesuit
                  </button>
                </div>
              </div>

              {/* Space Games Arcade */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold flex items-center gap-1.5">
                    <Gamepad2 className="h-3 w-3" />
                    FLIGHT ARCADE (5)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Physics & Trivia</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleModuleClick('games')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-purple-400 text-left text-xs font-medium text-white truncate"
                  >
                    🌕 Eagle Lunar Lander
                  </button>
                  <button
                    onClick={() => handleModuleClick('games')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-purple-400 text-left text-xs font-medium text-white truncate"
                  >
                    🧲 Gravity Slingshot
                  </button>
                  <button
                    onClick={() => handleModuleClick('games')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-purple-400 text-left text-xs font-medium text-white truncate"
                  >
                    🛰️ Zero-G Hardware
                  </button>
                  <button
                    onClick={() => handleModuleClick('games')}
                    className="p-1.5 rounded-lg bg-black/60 border border-slate-800 hover:border-purple-400 text-left text-xs font-medium text-white truncate"
                  >
                    ⚡ Trivia Gauntlet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolographicCommandMatrix;
