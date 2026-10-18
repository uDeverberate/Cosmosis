import React, { useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useAcademyStore, getCadetRank } from './store/useAcademyStore';
import { AcademyTab } from './types/academy';
import { COSMIC_FUN_FACTS_TICKER } from './data/spaceAcademyData';
import { CosmicExplorer3D } from './components/CosmicExplorer3D';
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

  const navTabs: { id: AcademyTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'explorer',
      label: '3D Observatory',
      icon: <Orbit className="h-4 w-4" />,
    },
    {
      id: 'stories',
      label: 'Mission Stories (6)',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: 'guides',
      label: 'Interactive Labs',
      icon: <Compass className="h-4 w-4" />,
    },
    {
      id: 'games',
      label: 'Simulators & Trivia',
      icon: <Gamepad2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col starfield-bg text-slate-100 select-none">
      {/* Unified Single-Row Clean Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-space-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Clean Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Orbit className="h-5 w-5 animate-spin" style={{ animationDuration: '16s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-white">
                  COSMOSIS
                </h1>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  v3.0 Academy
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive 3D Space Encyclopedia, Chronicles & Flight Simulators
              </p>
            </div>
          </div>

          {/* Center: Clean Segmented Module Switcher */}
          <nav className="flex items-center bg-space-900/90 p-1 rounded-xl border border-slate-800/90">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Compact Utility Cluster & Cadet Profile Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openWalkthrough(0)}
              className="micro-btn px-2.5 py-1.5 rounded-lg bg-space-900 hover:bg-space-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              title="Interactive Orientation Tour"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden md:inline">Tour</span>
            </button>

            <button
              onClick={() => setGlossaryOpen(true)}
              className="micro-btn px-2.5 py-1.5 rounded-lg bg-space-900 hover:bg-space-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              title="20-Term Student Space Dictionary"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">Glossary (20)</span>
            </button>

            {/* Cadet Profile, Badges & Diploma Trigger */}
            <button
              onClick={() => setProfileModalOpen(true)}
              className="micro-btn bg-space-900 hover:bg-space-800 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2.5"
              title="Open Cadet Profile, Badges & Diploma"
            >
              <span className="text-sm">{currentRank.icon}</span>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-white leading-none">
                  <span>{cadetName}</span>
                  <span className="text-cyan-400 font-mono">{xp} XP</span>
                </div>
                <div className="w-20 h-1 bg-space-950 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                <Award className="h-3 w-3" />
                <span>{unlockedBadges.length}</span>
              </div>
            </button>

            <button
              onClick={() => setIsMuted(soundFX.toggleMute())}
              className="p-2 rounded-lg bg-space-900 hover:bg-space-800 border border-slate-800 text-slate-300"
              title="Toggle Audio"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-cyan-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Interactive "Did You Know?" Cosmic Fun-Fact Bar */}
      <div className="bg-space-900/60 border-b border-slate-800/70 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
              <Sparkles className="h-3 w-3" />
              Cosmic Fact #{factIndex + 1}/{COSMIC_FUN_FACTS_TICKER.length}
            </span>
            <p className="text-xs text-slate-200 truncate">
              {COSMIC_FUN_FACTS_TICKER[factIndex]}
            </p>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              setFactIndex((prev) => (prev + 1) % COSMIC_FUN_FACTS_TICKER.length);
            }}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Next Fact</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        {activeTab === 'explorer' && <CosmicExplorer3D />}
        {activeTab === 'stories' && <StoryChronicles />}
        {activeTab === 'guides' && <InteractiveGuides />}
        {activeTab === 'games' && <SpaceGamesArcade />}
      </main>

      {/* Clean Floating XP / Badge Notification Toast */}
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

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
};

export default App;
