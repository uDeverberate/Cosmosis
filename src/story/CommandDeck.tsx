import React, { useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { useAcademyStore, getCadetRank } from '../store/useAcademyStore';
import {
  ACADEMY_BADGES,
  COSMIC_FUN_FACTS_TICKER,
  INTERACTIVE_GUIDES,
  SOLAR_SYSTEM_PLANETS,
  SPACECRAFT_FLEET,
  SPACE_STORIES,
} from '../data/spaceAcademyData';
import { AcademyTab } from '../types/academy';
import { haptics } from '../utils/haptics';
import { soundFX } from '../utils/soundEffects';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Download,
  Gamepad2,
  HelpCircle,
  Orbit,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  ChevronDown,
  Rocket,
  Award,
  Flame,
} from 'lucide-react';

interface CommandDeckProps {
  open: boolean;
  onClose: () => void;
  onSelectPlanet: (id: string) => void;
  onSelectCraft?: (craftId: string) => void;
  onOpenModule: (tab: AcademyTab) => void;
  onOpenTour: () => void;
  onOpenGlossary: () => void;
  onOpenProfile: () => void;
  onExportLog: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

const DECK_WORLDS = SOLAR_SYSTEM_PLANETS.filter((planet) => planet.id !== 'moon');

const ARCADE = [
  { title: 'Eagle Lunar Touchdown', badge: 'Physics Lander', xp: '+75 XP' },
  { title: 'Gravity Assist Slingshot', badge: 'Orbital Mechanics', xp: '+75 XP' },
  { title: '3D Zero-G Rescue', badge: 'EVA Thruster Sim', xp: '+80 XP' },
  { title: 'Deep Space Signal Decoder', badge: 'Telemetry Puzzle', xp: '+60 XP' },
  { title: 'Cosmic Trivia Gauntlet', badge: 'Mastery Challenge', xp: '+100 XP' },
];

type DeckDropdownId = 'worlds' | 'fleet' | 'stories' | 'labs' | 'arcade';

export const CommandDeck: React.FC<CommandDeckProps> = ({
  open,
  onClose,
  onSelectPlanet,
  onSelectCraft,
  onOpenModule,
  onOpenTour,
  onOpenGlossary,
  onOpenProfile,
  onExportLog,
  soundOn,
  onToggleSound,
}) => {
  const {
    completedStories,
    completedGuides,
    inspectedPlanets,
    unlockedBadges,
    xp,
    cadetName,
  } = useAcademyStore();

  const [activeDropdown, setActiveDropdown] = useState<DeckDropdownId>('worlds');

  const rank = getCadetRank(xp);
  const rankProgress = Math.min(
    100,
    Math.round(((xp - rank.minXp) / (rank.nextXp - rank.minXp)) * 100)
  );

  const nextStory = useMemo(
    () => SPACE_STORIES.find((story) => !completedStories.includes(story.id)),
    [completedStories]
  );
  const nextWorld = useMemo(
    () => DECK_WORLDS.find((planet) => !inspectedPlanets.includes(planet.id)),
    [inspectedPlanets]
  );
  const dailySignal = useMemo(() => {
    const day = Math.floor(Date.now() / 86_400_000);
    return COSMIC_FUN_FACTS_TICKER[day % COSMIC_FUN_FACTS_TICKER.length];
  }, []);

  const continueLabel = nextWorld
    ? `Fly to ${nextWorld.name} (+20 XP)`
    : nextStory
    ? `Mission Chronicle: ${nextStory.title}`
    : 'All Worlds Logged — Explore the 3D Fleet';
  const continueHint = nextWorld
    ? `${nextWorld.subtitle} · Uncharted in your logbook`
    : nextStory
    ? `${nextStory.readTime} · ${nextStory.chapters.length} interactive chapters`
    : 'Every planet surveyed in your Captain’s Log';

  const toggleSection = (id: DeckDropdownId) => {
    haptics.selection();
    soundFX.playClick();
    setActiveDropdown((prev) => (prev === id ? id : id));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="deck-title"
      closeOnBackdropClick
      className="w-full max-w-3xl rounded-3xl border border-cyan-500/30 bg-space-950/95 shadow-[0_0_80px_-15px_rgba(56,189,248,0.45)] backdrop-blur-2xl"
    >
      <div className="max-h-[86vh] overflow-y-auto no-scrollbar">
        {/* Top Gamified Cadet Command Header */}
        <div className="border-b border-slate-800/80 bg-gradient-to-r from-cyan-950/40 via-space-950 to-purple-950/30 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                COSMOSIS // COMMAND DECK
              </div>
              <h2 id="deck-title" className="mt-1 text-xl font-extrabold tracking-tight text-white">
                Choose Your Next Expedition
              </h2>
            </div>

            {/* Gamified Rank + XP Progress Pill */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-black/60 px-3.5 py-2 text-left transition-all hover:border-cyan-400/60"
            >
              <span className="text-xl">{rank.icon}</span>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span>{cadetName}</span>
                  <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                    LVL {rank.level} · {xp} XP
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-400 transition-all duration-500"
                      style={{ width: `${rankProgress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400">
                    {rank.title}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Live Mastery Scorecards */}
          <div className="mt-3 grid grid-cols-3 gap-2 font-mono">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5">
              <div className="text-[9px] uppercase text-cyan-300">Worlds Surveyed</div>
              <div className="text-xs font-bold text-white">
                {inspectedPlanets.length} / {DECK_WORLDS.length}
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5">
              <div className="text-[9px] uppercase text-amber-300">Chronicles &amp; Labs</div>
              <div className="text-xs font-bold text-white">
                {completedStories.length + completedGuides.length} /{' '}
                {SPACE_STORIES.length + INTERACTIVE_GUIDES.length}
              </div>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-1.5">
              <div className="text-[9px] uppercase text-purple-300">Mission Patches</div>
              <div className="text-xs font-bold text-white">
                {unlockedBadges.length} / {ACADEMY_BADGES.length}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 p-5">
          {/* Primary Recommended Quest Banner */}
          <button
            onClick={() => {
              haptics.medium();
              soundFX.playClick();
              if (nextWorld) onSelectPlanet(nextWorld.id);
              else if (nextStory) onOpenModule('stories');
              else onSelectPlanet('earth');
            }}
            className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-cyan-500/15 p-3.5 text-left shadow-lg transition-all hover:border-amber-300"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                Active Priority Mission
              </div>
              <div className="mt-0.5 truncate text-sm font-bold text-white">
                {continueLabel}
              </div>
              <div className="text-[11px] text-slate-300">{continueHint}</div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-950 transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* ORGANIZED COLOR-CODED DROPDOWN MENUS */}
          <div className="space-y-2.5">
            {/* 1. SOLAR SYSTEM WORLDS DROPDOWN (Electric Cyan) */}
            <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-black/50">
              <button
                onClick={() => toggleSection('worlds')}
                aria-expanded={activeDropdown === 'worlds'}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-cyan-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Orbit className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      01 // Solar System Worlds ({DECK_WORLDS.length})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Click any planet, the Sun, or 1 Ceres to fly in &amp; unlock telemetry
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-cyan-300 transition-transform ${
                    activeDropdown === 'worlds' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'worlds' && (
                <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 p-3.5 sm:grid-cols-5 animate-in fade-in duration-200">
                  {DECK_WORLDS.map((planet) => {
                    const visited = inspectedPlanets.includes(planet.id);
                    return (
                      <button
                        key={planet.id}
                        onClick={() => {
                          haptics.medium();
                          soundFX.playClick();
                          onSelectPlanet(planet.id);
                        }}
                        className="group flex flex-col justify-between rounded-xl border border-slate-800/90 bg-space-950/90 p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-cyan-950/25 active:scale-95"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="h-3.5 w-3.5 rounded-full shadow-sm"
                            style={{
                              backgroundColor: planet.color,
                              boxShadow: `0 0 10px ${planet.color}88`,
                            }}
                          />
                          {visited ? (
                            <span className="rounded bg-emerald-500/20 px-1 py-0.5 font-mono text-[8px] font-bold text-emerald-300">
                              ✓ LOGGED
                            </span>
                          ) : (
                            <span className="rounded bg-cyan-500/15 px-1 py-0.5 font-mono text-[8px] font-bold text-cyan-300">
                              +20 XP
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="truncate text-xs font-bold text-white group-hover:text-cyan-200">
                            {planet.name.replace(/^The /, '').split(' (')[0]}
                          </div>
                          <div className="truncate text-[9px] font-mono text-slate-400">
                            {planet.category}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. 3D SPACECRAFT FLEET HANGAR DROPDOWN (Solar Gold) */}
            <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-black/50">
              <button
                onClick={() => toggleSection('fleet')}
                aria-expanded={activeDropdown === 'fleet'}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-amber-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                    <Rocket className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      02 // 3D Spacecraft Hangar ({SPACECRAFT_FLEET.length})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Inspect interactive 3D spacecraft models &amp; scan engineering hotspots (+30 XP)
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-amber-300 transition-transform ${
                    activeDropdown === 'fleet' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'fleet' && (
                <div className="grid grid-cols-1 gap-2 border-t border-slate-800/80 p-3.5 sm:grid-cols-2 animate-in fade-in duration-200">
                  {SPACECRAFT_FLEET.map((craft) => (
                    <button
                      key={craft.id}
                      onClick={() => {
                        haptics.medium();
                        soundFX.playClick();
                        onSelectCraft?.(craft.id);
                      }}
                      className="flex items-center justify-between rounded-xl border border-slate-800/90 bg-space-950/90 px-3 py-2.5 text-left transition-all hover:border-amber-400/60 hover:bg-amber-950/20 active:scale-95"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="truncate text-xs font-bold text-white">
                          {craft.badgeEmoji} {craft.name}
                        </div>
                        <div className="truncate text-[10px] text-slate-400">
                          {craft.destination} · {craft.year} · {craft.hotspots.length} 3D Hotspots
                        </div>
                      </div>
                      <span className="shrink-0 rounded-lg bg-amber-500/20 px-2 py-1 font-mono text-[9px] font-bold text-amber-300">
                        INSPECT 3D →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. MISSION CHRONICLES DROPDOWN (Crimson-Amber) */}
            <div className="overflow-hidden rounded-2xl border border-rose-500/30 bg-black/50">
              <button
                onClick={() => toggleSection('stories')}
                aria-expanded={activeDropdown === 'stories'}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-rose-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                      03 // Gripping Mission Chronicles ({SPACE_STORIES.length})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Interactive space history decisions, dioramas &amp; mission badges
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-rose-300 transition-transform ${
                    activeDropdown === 'stories' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'stories' && (
                <div className="grid grid-cols-1 gap-2 border-t border-slate-800/80 p-3.5 sm:grid-cols-2 animate-in fade-in duration-200">
                  {SPACE_STORIES.map((story) => {
                    const done = completedStories.includes(story.id);
                    return (
                      <button
                        key={story.id}
                        onClick={() => {
                          haptics.medium();
                          soundFX.playClick();
                          onOpenModule('stories');
                        }}
                        className="flex items-center gap-3 rounded-xl border border-slate-800/90 bg-space-950/90 p-2.5 text-left transition-all hover:border-rose-400/60 hover:bg-rose-950/20 active:scale-95"
                      >
                        <span className="text-xl">{story.heroEmoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-bold text-white">
                            {story.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {story.chapters.length} Chapters · {story.readTime}
                          </div>
                        </div>
                        {done ? (
                          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <span className="shrink-0 rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-300">
                            PLAY
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. TACTICAL PHYSICS LABS DROPDOWN (Emerald Neon) */}
            <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-black/50">
              <button
                onClick={() => toggleSection('labs')}
                aria-expanded={activeDropdown === 'labs'}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-emerald-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      04 // Interactive Physics Labs ({INTERACTIVE_GUIDES.length})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Hands-on orbital cannon, Tsiolkovsky rocket equation, multi-stage &amp; heat shield sims
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-emerald-300 transition-transform ${
                    activeDropdown === 'labs' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'labs' && (
                <div className="grid grid-cols-1 gap-2 border-t border-slate-800/80 p-3.5 sm:grid-cols-2 animate-in fade-in duration-200">
                  {INTERACTIVE_GUIDES.map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => {
                        haptics.medium();
                        soundFX.playClick();
                        onOpenModule('guides');
                      }}
                      className="flex items-center gap-3 rounded-xl border border-slate-800/90 bg-space-950/90 p-2.5 text-left transition-all hover:border-emerald-400/60 hover:bg-emerald-950/20 active:scale-95"
                    >
                      <span className="text-xl">{guide.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-white">
                          {guide.title}
                        </div>
                        <div className="truncate text-[10px] text-slate-400">
                          {guide.subtitle}
                        </div>
                      </div>
                      <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                        LAUNCH
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. FLIGHT SIMULATOR & TRIVIA ARCADE DROPDOWN (Cosmic Violet) */}
            <div className="overflow-hidden rounded-2xl border border-purple-500/30 bg-black/50">
              <button
                onClick={() => toggleSection('arcade')}
                aria-expanded={activeDropdown === 'arcade'}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-purple-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                    <Gamepad2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      05 // Flight Simulators &amp; Arcade ({ARCADE.length})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Interactive lunar lander, gravity assist slingshot, zero-G EVA &amp; trivia gauntlet
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-purple-300 transition-transform ${
                    activeDropdown === 'arcade' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'arcade' && (
                <div className="grid grid-cols-1 gap-2 border-t border-slate-800/80 p-3.5 sm:grid-cols-2 animate-in fade-in duration-200">
                  {ARCADE.map((game) => (
                    <button
                      key={game.title}
                      onClick={() => {
                        haptics.medium();
                        soundFX.playClick();
                        onOpenModule('games');
                      }}
                      className="flex items-center justify-between rounded-xl border border-slate-800/90 bg-space-950/90 px-3 py-2.5 text-left transition-all hover:border-purple-400/60 hover:bg-purple-950/20 active:scale-95"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{game.title}</div>
                        <div className="text-[10px] text-slate-400">{game.badge}</div>
                      </div>
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-purple-300">
                        {game.xp}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Daily Cosmic Signal */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3.5 py-2.5">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                Daily Deep-Space Transmission
              </div>
              <p className="text-[11px] leading-relaxed text-amber-100/90">{dailySignal}</p>
            </div>
          </div>

          {/* Bottom Utility Bar */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-black/50 px-3 py-1.5 text-[11px] text-slate-200 hover:border-cyan-400/50 hover:text-white"
            >
              <Award className="h-3.5 w-3.5 text-amber-400" /> Badges &amp; Diploma
            </button>
            <button
              onClick={onOpenGlossary}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-black/50 px-3 py-1.5 text-[11px] text-slate-200 hover:border-amber-400/50 hover:text-white"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" /> Space Glossary
            </button>
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-black/50 px-3 py-1.5 text-[11px] text-slate-200 hover:border-cyan-400/50 hover:text-white"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" /> Guided Tour
            </button>
            <button
              onClick={onToggleSound}
              aria-pressed={soundOn}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-black/50 px-3 py-1.5 text-[11px] text-slate-200 hover:border-cyan-400/50 hover:text-white"
            >
              {soundOn ? (
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-slate-500" />
              )}
              {soundOn ? 'Ambient Music On' : 'Muted'}
            </button>
            <button
              onClick={onExportLog}
              className="ml-auto flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-[11px] font-semibold text-amber-200 hover:border-amber-400/60"
            >
              <Download className="h-3.5 w-3.5" /> Export Captain&apos;s Log
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
