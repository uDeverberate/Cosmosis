import React, { useEffect, useState } from 'react';
import { useAcademyStore, getCadetRank } from './store/useAcademyStore';
import { AcademyTab } from './types/academy';
import { COSMIC_FUN_FACTS_TICKER } from './data/spaceAcademyData';
import { CosmicExplorer3D } from './components/CosmicExplorer3D';
import { HolographicCommandMatrix } from './components/HolographicCommandMatrix';
import { StoryChronicles } from './components/StoryChronicles';
import { InteractiveGuides } from './components/InteractiveGuides';
import { SpaceGamesArcade } from './components/SpaceGamesArcade';
import { WalkthroughModal } from './components/WalkthroughModal';
import { GlossaryModal } from './components/GlossaryModal';
import { CadetProfileModal } from './components/CadetProfileModal';
import { soundFX } from './utils/soundEffects';
import {
  Orbit,
  BookOpen,
  Compass,
  Gamepad2,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    xp,
    unlockedBadges,
    cadetName,
    openWalkthrough,
    setGlossaryOpen,
    setProfileModalOpen,
    recentToast,
    clearToast,
  } = useAcademyStore();

  const [viewMode, setViewMode] = useState<'solar-system' | 'planet-closeup' | 'spacecraft'>('solar-system');
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [selectedCraftId, setSelectedCraftId] = useState<string>('voyager');
  const [isMuted, setIsMuted] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  const currentRank = getCadetRank(xp);
  const progressPercent = Math.min(
    100,
    Math.round(((xp - currentRank.minXp) / (currentRank.nextXp - currentRank.minXp)) * 100)
  );

  useEffect(() => {
    if (!recentToast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 3800);
    return () => clearTimeout(timer);
  }, [recentToast, clearToast]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % COSMIC_FUN_FACTS_TICKER.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Global ESC key listener to slide away decks or return to 3D cockpit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Escape') {
        if (activeTab !== 'explorer') {
          soundFX.playClick();
          setActiveTab('explorer');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, setActiveTab]);

  const navTabs: { id: AcademyTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'explorer',
      label: '3D Observatory',
      icon: <Orbit className="h-3.5 w-3.5" />,
    },
    {
      id: 'stories',
      label: 'Chronicles (6)',
      icon: <BookOpen className="h-3.5 w-3.5" />,
    },
    {
      id: 'guides',
      label: 'Labs (4)',
      icon: <Compass className="h-3.5 w-3.5" />,
    },
    {
      id: 'games',
      label: 'Arcade (5)',
      icon: <Gamepad2 className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-black text-slate-100 select-none relative font-sans">
      {/* 1. Full-Screen Edge-to-Edge 3D Cosmic Universe Backdrop */}
      <CosmicExplorer3D
        externalPlanetId={selectedPlanetId}
        externalViewMode={viewMode}
        externalCraftId={selectedCraftId}
        onViewModeChange={setViewMode}
        onPlanetSelect={setSelectedPlanetId}
        onCraftSelect={setSelectedCraftId}
        isBackgroundMode={activeTab !== 'explorer'}
      />

      {/* 2. Floating Aerospace Command Capsule Header (Edge-to-Edge) */}
      <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Clean Brand Identity Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-space-950/85 backdrop-blur-xl border border-slate-800/80 shadow-2xl">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('explorer');
              setViewMode('solar-system');
            }}
            className="flex items-center gap-2 group text-left"
            title="Reset to Full Solar System"
          >
            <div className="h-7 w-7 rounded-full bg-[#ff3b21]/15 border border-[#ff3b21]/30 flex items-center justify-center text-[#ff3b21]">
              <Orbit className="h-4 w-4 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white">
                  COSMOSIS
                </span>
                <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-[#ff3b21]/20 text-[#ff3b21] font-bold">
                  v3.0
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Top Dropdown Matrix Pill */}
        <div className="pointer-events-auto">
          <HolographicCommandMatrix
            onSelectPlanet={(id) => {
              setSelectedPlanetId(id);
              setViewMode('planet-closeup');
              setActiveTab('explorer');
            }}
            onSelectCraft={(id) => {
              setSelectedCraftId(id);
              setViewMode('spacecraft');
              setActiveTab('explorer');
            }}
            onReturnToSolarSystem={() => {
              setViewMode('solar-system');
              setActiveTab('explorer');
            }}
            currentPlanetId={selectedPlanetId}
            currentCraftId={selectedCraftId}
            isCloseup={viewMode === 'planet-closeup'}
          />
        </div>

        {/* Right: Module Switcher & Cadet Profile Utility Cluster */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Quick Module Switcher (Segmented Glass Tabs) */}
          <nav className="hidden lg:flex items-center bg-space-950/85 backdrop-blur-xl p-1 rounded-full border border-slate-800/80 shadow-2xl">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => openWalkthrough(0)}
            className="micro-btn px-2.5 py-1.5 rounded-full bg-space-950/85 hover:bg-space-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 shadow-md"
            title="Interactive Orientation Tour"
          >
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">Tour</span>
          </button>

          <button
            onClick={() => setGlossaryOpen(true)}
            className="micro-btn px-2.5 py-1.5 rounded-full bg-space-950/85 hover:bg-space-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 shadow-md"
            title="20-Term Student Space Dictionary"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Glossary</span>
          </button>

          {/* Cadet Profile Pill */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="micro-btn bg-space-950/85 hover:bg-space-900 border border-slate-700/80 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-md"
            title="Open Cadet Profile, Badges & Diploma"
          >
            <span className="text-sm">{currentRank.icon}</span>
            <div className="text-left hidden xl:block">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-white leading-none">
                <span>{cadetName}</span>
                <span className="text-cyan-400 font-mono font-bold">{xp} XP</span>
              </div>
              <div className="w-16 h-1 bg-space-950 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
              <Award className="h-3 w-3" />
              <span>{unlockedBadges.length}</span>
            </div>
          </button>

          <button
            onClick={() => setIsMuted(soundFX.toggleMute())}
            className="p-1.5 rounded-full bg-space-950/85 hover:bg-space-900 border border-slate-800 text-slate-300 shadow-md"
            title="Toggle Audio"
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-rose-400" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            )}
          </button>
        </div>
      </header>

      {/* 3. Slide-In Frosted Tactical Glass Decks for Other Modules (Chronicles, Labs, Arcade) */}
      {activeTab !== 'explorer' && (
        <div className="fixed inset-0 z-30 pt-20 px-4 sm:px-8 pb-8 overflow-y-auto bg-space-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Top Return Banner */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  {activeTab === 'stories'
                    ? 'HISTORIC CHRONICLES // 6 MISSION DIORAMAS'
                    : activeTab === 'guides'
                    ? 'TACTICAL LABS // 4 PHYSICS SIMS'
                    : 'FLIGHT ARCADE // 5 SIMULATORS & TRIVIA'}
                </span>
              </div>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('explorer');
                }}
                className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-mono uppercase font-bold flex items-center gap-2 shadow-xl transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#ff3b21]" />
                <span>Return to 3D Cockpit</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black/20 text-[10px]">ESC</kbd>
              </button>
            </div>

            {activeTab === 'stories' && <StoryChronicles />}
            {activeTab === 'guides' && <InteractiveGuides />}
            {activeTab === 'games' && <SpaceGamesArcade />}
          </div>
        </div>
      )}

      {/* 4. Subtle Floating "Did You Know?" Cosmic Fun-Fact Pill */}
      {activeTab === 'explorer' && (
        <div className="fixed bottom-4 right-4 z-20 pointer-events-auto hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-xl border border-slate-800 text-xs shadow-2xl max-w-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <p className="text-[11px] text-zinc-300 truncate">
            {COSMIC_FUN_FACTS_TICKER[factIndex]}
          </p>
          <button
            onClick={() => {
              soundFX.playClick();
              setFactIndex((prev) => (prev + 1) % COSMIC_FUN_FACTS_TICKER.length);
            }}
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 shrink-0 ml-1"
            title="Next Cosmic Fact"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* 5. XP / Badge Notification Toast */}
      {recentToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-space-900/95 backdrop-blur-xl border border-cyan-400/50 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-xl shrink-0">
            {recentToast.icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {recentToast.title}
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">{recentToast.subtitle}</div>
          </div>
        </div>
      )}

      {/* Modals */}
      <WalkthroughModal />
      <GlossaryModal />
      <CadetProfileModal />
    </div>
  );
};

export default App;
