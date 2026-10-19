import React, { useEffect, useState } from 'react';
import { useAcademyStore, getCadetRank } from './store/useAcademyStore';
import { AcademyTab } from './types/academy';
import { COSMIC_FUN_FACTS_TICKER, SOLAR_SYSTEM_PLANETS } from './data/spaceAcademyData';
import { STORY_MODE } from './story/config';
import { StoryShell } from './story/StoryShell';
import { CosmicExplorer3D } from './components/CosmicExplorer3D';
import { HolographicCommandMatrix } from './components/HolographicCommandMatrix';
import { StoryChronicles } from './components/StoryChronicles';
import { InteractiveGuides } from './components/InteractiveGuides';
import { SpaceGamesArcade } from './components/SpaceGamesArcade';
import { WalkthroughModal } from './components/WalkthroughModal';
import { GlossaryModal } from './components/GlossaryModal';
import { CadetProfileModal } from './components/CadetProfileModal';
import { soundFX } from './utils/soundEffects';
import { haptics } from './utils/haptics';
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
    isWalkthroughOpen,
    isGlossaryOpen,
    isProfileModalOpen,
    hasSeenTour,
  } = useAcademyStore();

  const [viewMode, setViewMode] = useState<'solar-system' | 'planet-closeup' | 'spacecraft'>('solar-system');
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [selectedCraftId, setSelectedCraftId] = useState<string>('voyager');
  const [isMuted, setIsMuted] = useState(() => soundFX.getMuted());
  const [factIndex, setFactIndex] = useState(0);

  // Story Mode state: gate, camera focus and the single command deck
  const [entered, setEntered] = useState(() => !STORY_MODE);
  const [storyFocusId, setStoryFocusId] = useState<string | null>(null);
  const [deckOpen, setDeckOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);

  // HUD is story-quiet from first paint, including behind the entry gate
  const storyMode = STORY_MODE && !briefingOpen;
  const focusedPlanet = storyFocusId
    ? SOLAR_SYSTEM_PLANETS.find((planet) => planet.id === storyFocusId) ?? null
    : null;

  const currentRank = getCadetRank(xp);
  const progressPercent = Math.min(
    100,
    Math.round(((xp - currentRank.minXp) / (currentRank.nextXp - currentRank.minXp)) * 100)
  );

  // First-run orientation: show the tour once, then never interrupt again
  useEffect(() => {
    if (STORY_MODE || hasSeenTour) return;
    const timer = setTimeout(() => openWalkthrough(0), 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Dialogs own Escape while they are open (handled by the Modal wrapper)
      if (isWalkthroughOpen || isGlossaryOpen || isProfileModalOpen) return;
      if (STORY_MODE) return;
      if (e.key === 'Escape') {
        if (activeTab !== 'explorer') {
          setActiveTab('explorer');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, setActiveTab, isWalkthroughOpen, isGlossaryOpen, isProfileModalOpen]);

  const focusStoryPlanet = (id: string) => {
    const planet = SOLAR_SYSTEM_PLANETS.find((item) => item.id === id);
    if (!planet) return;
    setSelectedPlanetId(id);
    setStoryFocusId(id);
    setBriefingOpen(false);
    setViewMode('solar-system');
    setActiveTab('explorer');
    setDeckOpen(false);
  };

  const openStoryBriefing = (id: string) => {
    setSelectedPlanetId(id);
    setStoryFocusId(null);
    setDeckOpen(false);
    setBriefingOpen(true);
    setViewMode('planet-closeup');
    setActiveTab('explorer');
  };

  const navTabs: { id: AcademyTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'explorer',
      label: 'Observatory',
      icon: <Orbit className="h-4 w-4" />,
    },
    {
      id: 'stories',
      label: 'Chronicles',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: 'guides',
      label: 'Labs',
      icon: <Compass className="h-4 w-4" />,
    },
    {
      id: 'games',
      label: 'Arcade',
      icon: <Gamepad2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-black text-slate-100 relative font-sans">
      <h1 className="sr-only">COSMOSIS — Interactive 3D Space Exploration and Flight Academy</h1>

      {/* 1. Full-Screen Edge-to-Edge 3D Cosmic Universe Backdrop (smoothly fades in on entry) */}
      <div className={`transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-40'}`}>
        <CosmicExplorer3D
          externalPlanetId={selectedPlanetId}
          externalViewMode={viewMode}
          externalCraftId={selectedCraftId}
          onViewModeChange={(mode) => {
            setViewMode(mode);
            if (STORY_MODE && mode === 'solar-system') setBriefingOpen(false);
          }}
          onPlanetSelect={(id) => {
            setSelectedPlanetId(id);
            if (storyMode) setStoryFocusId(id);
          }}
          onCraftSelect={setSelectedCraftId}
          isBackgroundMode={activeTab !== 'explorer'}
          storyMode={storyMode}
          storyFocusId={storyFocusId}
          onEmptySpaceTap={() => setDeckOpen(true)}
        />
      </div>

      {STORY_MODE && (
        <StoryShell
          entered={entered}
          onEntered={() => setEntered(true)}
          deckOpen={deckOpen}
          onDeckOpenChange={setDeckOpen}
          focusedPlanet={focusedPlanet}
          onFocusPlanet={focusStoryPlanet}
          onCloseFocus={() => setStoryFocusId(null)}
          onOpenModule={(tab) => {
            setDeckOpen(false);
            setStoryFocusId(null);
            setActiveTab(tab);
          }}
          onFullBriefing={openStoryBriefing}
          onSelectCraft={(craftId) => {
            setSelectedCraftId(craftId);
            setStoryFocusId(null);
            setDeckOpen(false);
            setBriefingOpen(true);
            setViewMode('spacecraft');
            setActiveTab('explorer');
          }}
          onOpenTour={() => openWalkthrough(0)}
          onOpenGlossary={() => setGlossaryOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          briefingOpen={briefingOpen}
          onCloseBriefing={() => {
            setBriefingOpen(false);
            setStoryFocusId(null);
            setViewMode('solar-system');
          }}
        />
      )}

      {/* 2. Floating Aerospace Command Capsule Header (Edge-to-Edge) */}
      {!STORY_MODE && (
      <header className="fixed top-2 sm:top-3 inset-x-2 sm:inset-x-6 z-40 flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-none pt-[max(0.25rem,env(safe-area-inset-top))]">
        {/* Left: Clean Brand Identity Pill */}
        <div className="pointer-events-auto shrink-0 flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-space-950/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl">
          <button
            onClick={() => {
              haptics.medium();
              soundFX.playClick();
              setActiveTab('explorer');
              setViewMode('solar-system');
            }}
            className="flex items-center gap-1.5 sm:gap-2 group text-left active:scale-95 transition-transform"
            title="Reset to Full Solar System"
          >
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#ff3b21]/15 border border-[#ff3b21]/30 flex items-center justify-center text-[#ff3b21]">
              <Orbit className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white">
                  COSMOSIS
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1 py-px rounded bg-[#ff3b21]/20 text-[#ff3b21] font-bold">
                  v3.0
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Top Dropdown Matrix Pill */}
        <div className="pointer-events-auto flex-1 min-w-0 flex justify-center px-1">
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
        <div className="pointer-events-auto shrink-0 flex items-center gap-1 sm:gap-1.5">
          {/* Quick Module Switcher (Segmented Glass Tabs on Desktop) */}
          <nav className="hidden lg:flex items-center bg-space-950/85 backdrop-blur-xl p-1 rounded-full border border-slate-800/80 shadow-2xl">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    haptics.selection();
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
            onClick={() => {
              haptics.light();
              openWalkthrough(0);
            }}
            className="hidden md:flex micro-btn px-2.5 py-1.5 rounded-full bg-space-950/85 hover:bg-space-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white items-center gap-1 shadow-md active:scale-95 transition-transform"
            title="Interactive Orientation Tour"
          >
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Tour</span>
          </button>

          <button
            onClick={() => {
              haptics.light();
              setGlossaryOpen(true);
            }}
            className="hidden md:flex micro-btn px-2.5 py-1.5 rounded-full bg-space-950/85 hover:bg-space-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white items-center gap-1 shadow-md active:scale-95 transition-transform"
            title="20-Term Student Space Dictionary"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Glossary</span>
          </button>

          {/* Cadet Profile Pill */}
          <button
            onClick={() => {
              haptics.medium();
              setProfileModalOpen(true);
            }}
            className="micro-btn bg-space-950/90 hover:bg-space-900 border border-slate-700/80 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 shadow-md active:scale-95 transition-transform"
            title="Open Cadet Profile, Badges & Diploma"
            aria-label={`Open cadet profile — ${cadetName}, ${xp} XP`}
          >
            <span className="text-xs sm:text-sm">{currentRank.icon}</span>
            <span className="text-[10px] font-mono font-bold text-cyan-400 xl:hidden">{xp} XP</span>
            <div className="text-left hidden xl:block">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-white leading-none">
                <span className="max-w-[90px] truncate">{cadetName}</span>
                <span className="text-cyan-400 font-mono font-bold">{xp} XP</span>
              </div>
              <div className="w-16 h-1 bg-space-950 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
              <Award className="h-3 w-3" />
              <span>{unlockedBadges.length}</span>
            </div>
          </button>

          <button
            onClick={() => {
              haptics.light();
              setIsMuted(soundFX.toggleMute());
            }}
            className="p-1.5 rounded-full bg-space-950/90 hover:bg-space-900 border border-slate-800 text-slate-300 shadow-md active:scale-95 transition-transform shrink-0"
            title="Toggle Audio"
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            aria-pressed={isMuted}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-rose-400" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            )}
          </button>
        </div>
      </header>
      )}

      {/* 3. Slide-In Frosted Tactical Glass Decks for Other Modules (Chronicles, Labs, Arcade) */}
      {activeTab !== 'explorer' && (
        <div className="fixed inset-0 z-30 pt-16 sm:pt-20 px-3 sm:px-8 pb-24 md:pb-8 overflow-y-auto bg-space-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
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
                  haptics.medium();
                  soundFX.playClick();
                  setActiveTab('explorer');
                }}
                className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-mono uppercase font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#ff3b21]" />
                <span>Return to 3D Cockpit</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-black/20 text-[10px]">ESC</kbd>
              </button>
            </div>

            {activeTab === 'stories' && <StoryChronicles />}
            {activeTab === 'guides' && <InteractiveGuides />}
            {activeTab === 'games' && <SpaceGamesArcade />}
          </div>
        </div>
      )}

      {/* 4. Subtle Floating "Did You Know?" Cosmic Fun-Fact Pill */}
      {!STORY_MODE && activeTab === 'explorer' && (
        <div className="fixed bottom-28 left-6 z-20 pointer-events-auto hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-xl border border-slate-800 text-xs shadow-2xl max-w-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <p className="text-[11px] text-zinc-300 truncate">
            {COSMIC_FUN_FACTS_TICKER[factIndex]}
          </p>
          <button
            onClick={() => {
              haptics.light();
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
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 sm:bottom-5 right-3 sm:right-5 z-50 max-w-sm bg-space-900/95 backdrop-blur-xl border border-cyan-400/50 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
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

      {/* 6. Native Mobile Bottom Navigation Bar (< md) — mirrors the desktop module tabs */}
      {!STORY_MODE && (
      <nav
        aria-label="Academy modules"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-space-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-1 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl"
      >
        <div className="grid grid-cols-4 max-w-md mx-auto">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  haptics.selection();
                  setActiveTab(tab.id);
                }}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-all active:scale-90 ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-mono tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      )}

      {/* Modals */}
      <WalkthroughModal />
      <GlossaryModal />
      <CadetProfileModal />
    </div>
  );
};

export default App;
