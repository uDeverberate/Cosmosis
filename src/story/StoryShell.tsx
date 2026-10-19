import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Keyboard, Menu, Volume2, VolumeX } from 'lucide-react';
import { AcademyTab, PlanetData } from '../types/academy';
import { getCadetRank, useAcademyStore } from '../store/useAcademyStore';
import { SOLAR_SYSTEM_PLANETS } from '../data/spaceAcademyData';
import { ambience } from './ambience';
import { StoryGate } from './StoryGate';
import { CommandDeck } from './CommandDeck';
import { ObjectPanel } from './ObjectPanel';
import { SkyProgress } from './SkyProgress';
import { exportCaptainsLog } from './captainsLog';
import { haptics } from '../utils/haptics';

interface StoryShellProps {
  entered: boolean;
  onEntered: () => void;
  deckOpen: boolean;
  onDeckOpenChange: (open: boolean) => void;
  focusedPlanet: PlanetData | null;
  onFocusPlanet: (id: string) => void;
  onCloseFocus: () => void;
  onOpenModule: (tab: AcademyTab) => void;
  onFullBriefing: (id: string) => void;
  onSelectCraft?: (craftId: string) => void;
  onOpenTour: () => void;
  onOpenGlossary: () => void;
  onOpenProfile: () => void;
  briefingOpen: boolean;
  onCloseBriefing: () => void;
}

/**
 * The entire story-mode chrome lives here so the classic HUD in App can be
 * switched off wholesale. When you enter, ONLY the pure 3D Solar System is visible
 * until you click a world or press K / tap empty space for the Command Deck.
 */
export const StoryShell: React.FC<StoryShellProps> = ({
  entered,
  onEntered,
  deckOpen,
  onDeckOpenChange,
  focusedPlanet,
  onFocusPlanet,
  onCloseFocus,
  onOpenModule,
  onFullBriefing,
  onSelectCraft,
  onOpenTour,
  onOpenGlossary,
  onOpenProfile,
  briefingOpen,
  onCloseBriefing,
}) => {
  const {
    isWalkthroughOpen,
    isGlossaryOpen,
    isProfileModalOpen,
    cadetName,
    xp,
    unlockedBadges,
    inspectedPlanets,
    completedStories,
  } = useAcademyStore();

  const [soundOn, setSoundOn] = useState(() => !ambience.getMuted());
  const [exportNote, setExportNote] = useState<string | null>(null);

  const rank = getCadetRank(xp);

  // Audio depth follows attention: orbit → focus → read.
  useEffect(() => {
    if (!entered) return;
    ambience.setDepth(focusedPlanet ? 'focus' : 'orbit');
  }, [entered, focusedPlanet]);

  useEffect(() => {
    if (!exportNote) return;
    const timer = window.setTimeout(() => setExportNote(null), 4000);
    return () => window.clearTimeout(timer);
  }, [exportNote]);

  // K toggles the deck, Escape unwinds one layer at a time.
  useEffect(() => {
    if (!entered) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (isWalkthroughOpen || isGlossaryOpen || isProfileModalOpen) return;

      if (event.key === 'k' || event.key === 'K') {
        event.preventDefault();
        haptics.selection();
        ambience.playCelestialPulse(1.25);
        onDeckOpenChange(!deckOpen);
        return;
      }

      if (event.key !== 'Escape') return;
      if (briefingOpen) return;
      if (deckOpen) {
        onDeckOpenChange(false);
      } else if (focusedPlanet) {
        onCloseFocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    entered,
    deckOpen,
    focusedPlanet,
    briefingOpen,
    isWalkthroughOpen,
    isGlossaryOpen,
    isProfileModalOpen,
    onDeckOpenChange,
    onCloseFocus,
  ]);

  const toggleSound = useCallback(() => {
    haptics.light();
    if (!ambience.isStarted()) void ambience.start();
    const muted = ambience.toggleMute();
    setSoundOn(!muted);
  }, []);

  const handleExportLog = useCallback(() => {
    const ok = exportCaptainsLog({
      name: cadetName,
      xp,
      rankTitle: getCadetRank(xp).title,
      badges: unlockedBadges,
      visitedWorlds: inspectedPlanets,
    });
    if (ok) return;

    const summary = [
      `COSMOSIS // ${cadetName}`,
      `${getCadetRank(xp).title} · ${xp} XP`,
      `${inspectedPlanets.length} worlds logged · ${unlockedBadges.length} badges · ${completedStories.length} chronicles`,
    ].join('\n');
    const clipboard = navigator.clipboard;
    if (!clipboard) {
      setExportNote('Image export unavailable on this device');
      return;
    }
    void clipboard.writeText(summary).then(
      () => setExportNote('Log copied to clipboard'),
      () => setExportNote('Image export unavailable on this device')
    );
  }, [cadetName, xp, unlockedBadges, inspectedPlanets, completedStories]);

  const openDeck = useCallback(() => {
    haptics.selection();
    ambience.playCelestialPulse(1.25);
    onDeckOpenChange(true);
  }, [onDeckOpenChange]);
  const closeDeck = useCallback(() => onDeckOpenChange(false), [onDeckOpenChange]);

  if (!entered) {
    return <StoryGate onEntered={onEntered} />;
  }

  if (briefingOpen) {
    return (
      <button
        onClick={onCloseBriefing}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-space-950/90 px-3.5 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-200 shadow-2xl backdrop-blur-xl hover:border-cyan-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Return to pure solar system
        <kbd className="ml-1 rounded border border-slate-700 bg-black px-1.5 py-0.5 text-[9px] text-slate-300">
          ESC
        </kbd>
      </button>
    );
  }

  return (
    <>
      <SkyProgress />

      {/* Minimalist Top-Right Pill: XP Rank + Sound Toggle + 'K' Command Deck Trigger */}
      <div className="pointer-events-none fixed right-4 top-4 z-40 flex items-center gap-2 pt-[max(0px,env(safe-area-inset-top))]">
        <button
          onClick={onOpenProfile}
          className="pointer-events-auto hidden items-center gap-1.5 rounded-full border border-slate-800/80 bg-space-950/75 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-300 backdrop-blur-xl transition-colors hover:border-cyan-400/50 hover:text-white sm:flex"
          title="View Cadet Rank, Badges & Progress"
        >
          <span>{rank.icon}</span>
          <span className="font-bold text-cyan-300">{xp} XP</span>
          <span className="text-slate-600">·</span>
          <span>
            {inspectedPlanets.length}/{SOLAR_SYSTEM_PLANETS.length - 1} worlds
          </span>
        </button>

        <button
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute ambient space music' : 'Enable ambient space music'}
          className="pointer-events-auto rounded-full border border-slate-700/70 bg-space-950/80 p-2 text-slate-300 shadow-xl backdrop-blur-xl transition-colors hover:border-cyan-400/50 hover:text-white active:scale-95"
        >
          {soundOn ? (
            <Volume2 className="h-3.5 w-3.5 text-cyan-300" />
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-rose-300" />
          )}
        </button>

        <button
          onClick={openDeck}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-400 to-sky-300 px-3.5 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_25px_-5px_rgba(56,189,248,0.75)] transition-transform hover:brightness-105 active:scale-95"
          aria-expanded={deckOpen}
          aria-label="Open Command Deck (Press K)"
        >
          <Menu className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Command Deck</span>
          <kbd className="rounded bg-black/20 px-1.5 py-0.5 text-[9px] font-extrabold">K</kbd>
        </button>
      </div>

      {focusedPlanet && (
        <ObjectPanel
          planet={focusedPlanet}
          onClose={onCloseFocus}
          onFullBriefing={onFullBriefing}
          onOpenDeck={openDeck}
          onSelectSiblingPlanet={onFocusPlanet}
        />
      )}

      {exportNote && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-4 z-50 rounded-lg border border-slate-700 bg-space-950/95 px-3 py-2 text-[11px] text-slate-200 shadow-2xl"
        >
          {exportNote}
        </div>
      )}

      <CommandDeck
        open={deckOpen}
        onClose={closeDeck}
        onSelectPlanet={(id) => {
          closeDeck();
          onFocusPlanet(id);
        }}
        onSelectCraft={(craftId) => {
          closeDeck();
          onSelectCraft?.(craftId);
        }}
        onOpenModule={(tab) => {
          closeDeck();
          onOpenModule(tab);
        }}
        onOpenTour={onOpenTour}
        onOpenGlossary={onOpenGlossary}
        onOpenProfile={onOpenProfile}
        onExportLog={handleExportLog}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />

      {!focusedPlanet && !deckOpen && (
        <p className="pointer-events-none fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/5 bg-black/40 px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400 backdrop-blur-md">
          <Keyboard className="h-3 w-3 text-cyan-400" aria-hidden="true" />
          <span>Click any world or asteroid to zoom · Press K or tap space for menu</span>
        </p>
      )}
    </>
  );
};
