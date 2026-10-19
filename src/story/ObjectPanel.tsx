import React, { useEffect, useState } from 'react';
import { PlanetData } from '../types/academy';
import { SOLAR_SYSTEM_PLANETS } from '../data/spaceAcademyData';
import { useAcademyStore, getCadetRank } from '../store/useAcademyStore';
import { soundFX } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';
import { ambience } from './ambience';
import {
  ArrowUpRight,
  Sparkles,
  X,
  Compass,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Radar,
  CheckCircle2,
  HelpCircle,
  Scale,
  Layers,
  Trophy,
} from 'lucide-react';

interface ObjectPanelProps {
  planet: PlanetData | null;
  onClose: () => void;
  onFullBriefing: (id: string) => void;
  onOpenDeck: () => void;
  onSelectSiblingPlanet?: (id: string) => void;
}

type SectionId = 'story' | 'telemetry' | 'quiz' | null;

/**
 * Uncluttered, gamified Story & Field-Research Panel that smoothly fades in after
 * the camera flies into a celestial object. Uses collapsible dropdowns so the 3D
 * planet remains the star of the screen.
 */
export const ObjectPanel: React.FC<ObjectPanelProps> = ({
  planet,
  onClose,
  onFullBriefing,
  onOpenDeck,
  onSelectSiblingPlanet,
}) => {
  const [visible, setVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<SectionId>('story');
  const [earthWeightKg, setEarthWeightKg] = useState(60);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'done'>('idle');

  const {
    xp,
    answeredQuizKeys,
    recordQuizCorrect,
    addXp,
    scannedHotspots,
    markHotspotScanned,
  } = useAcademyStore();

  const scanKey = planet ? `surface-scan-${planet.id}` : '';
  const alreadyScanned = planet ? scannedHotspots.includes(scanKey) : false;

  useEffect(() => {
    if (!planet) {
      setVisible(false);
      return;
    }
    setVisible(false);
    setQuizIdx(0);
    setSelectedOption(null);
    setScanState(alreadyScanned ? 'done' : 'idle');
    setOpenDropdown('story');
    ambience.playCelestialPulse(planet.id === 'sun' ? 0.75 : 1.15);

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setVisible(true), reduced ? 120 : 680);
    return () => window.clearTimeout(timer);
  }, [planet?.id, planet, alreadyScanned]);

  if (!planet || !visible) return null;

  const navPlanets = SOLAR_SYSTEM_PLANETS.filter((p) => p.id !== 'moon');
  const currentIdx = navPlanets.findIndex((p) => p.id === planet.id);
  const prevPlanet =
    navPlanets[(currentIdx - 1 + navPlanets.length) % navPlanets.length];
  const nextPlanet = navPlanets[(currentIdx + 1) % navPlanets.length];

  const currentQuiz = planet.quizQuestions[quizIdx] || planet.quizQuestions[0];
  const quizKey = `${planet.id}-q-${quizIdx}`;
  const isQuizMastered = answeredQuizKeys.includes(quizKey);
  const masteredCount = planet.quizQuestions.filter((_, i) =>
    answeredQuizKeys.includes(`${planet.id}-q-${i}`)
  ).length;

  const rank = getCadetRank(xp);
  const weightOnWorld = (earthWeightKg * planet.gravityRatio).toFixed(1);

  const toggleDropdown = (id: Exclude<SectionId, null>) => {
    haptics.selection();
    soundFX.playClick();
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleSurfaceScan = () => {
    if (scanState !== 'idle' || alreadyScanned) return;
    haptics.medium();
    soundFX.playScanPing();
    setScanState('scanning');
    window.setTimeout(() => {
      haptics.success();
      markHotspotScanned(scanKey);
      setScanState('done');
    }, 950);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const isCorrect = idx === currentQuiz.correctIndex;
    if (isCorrect) {
      haptics.success();
      soundFX.playSuccessChime();
      const firstTime = recordQuizCorrect(
        quizKey,
        40,
        `${planet.name} Field Quiz Mastered!`
      );
      if (!firstTime) {
        addXp(5, 'Practice Review Bonus');
      }
    } else {
      haptics.error();
      soundFX.playClick();
    }
  };

  return (
    <aside
      aria-label={`${planet.name} story and field research`}
      className="fixed inset-x-3 bottom-3 z-30 animate-in fade-in slide-in-from-bottom-5 duration-500 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[27rem]"
    >
      <div className="holo-panel-3d max-h-[78vh] overflow-y-auto no-scrollbar rounded-2xl border border-cyan-500/30 bg-space-950/90 p-4 shadow-[0_0_50px_-12px_rgba(56,189,248,0.35)] backdrop-blur-2xl">
        {/* Top Bar: Category + Prev/Next World Switcher + Close */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-300">
                <Compass className="h-2.5 w-2.5" aria-hidden="true" />
                {planet.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                ✓ +20 XP Logged
              </span>
            </div>
            <h2 className="mt-1.5 truncate text-2xl font-extrabold tracking-tight text-white">
              {planet.name}
            </h2>
            <p className="text-[11px] font-medium text-cyan-200/80">{planet.subtitle}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onSelectSiblingPlanet && (
              <>
                <button
                  onClick={() => {
                    haptics.selection();
                    soundFX.playClick();
                    onSelectSiblingPlanet(prevPlanet.id);
                  }}
                  title={`Fly to ${prevPlanet.name}`}
                  aria-label={`Previous world: ${prevPlanet.name}`}
                  className="rounded-lg border border-slate-800 bg-black/60 p-1.5 text-slate-400 transition-colors hover:border-cyan-400/40 hover:text-white active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    haptics.selection();
                    soundFX.playClick();
                    onSelectSiblingPlanet(nextPlanet.id);
                  }}
                  title={`Fly to ${nextPlanet.name}`}
                  aria-label={`Next world: ${nextPlanet.name}`}
                  className="rounded-lg border border-slate-800 bg-black/60 p-1.5 text-slate-400 transition-colors hover:border-cyan-400/40 hover:text-white active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={() => {
                haptics.light();
                soundFX.playClick();
                onClose();
              }}
              aria-label="Zoom out to the solar system"
              title="Back to Solar System (ESC)"
              className="rounded-lg border border-slate-800 bg-black/60 p-1.5 text-slate-400 transition-colors hover:border-rose-400/40 hover:text-white active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Gamified Micro-Action: Deep-Space Spectrometer Scan (+30 XP) */}
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/60 via-space-900/60 to-cyan-950/40 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <Radar
              className={`h-4 w-4 shrink-0 ${
                scanState === 'scanning'
                  ? 'animate-spin text-amber-400'
                  : scanState === 'done'
                  ? 'text-emerald-400'
                  : 'text-cyan-400'
              }`}
            />
            <div className="min-w-0">
              <div className="truncate text-[11px] font-semibold text-white">
                {scanState === 'done'
                  ? 'Spectrometer Telemetry Verified'
                  : scanState === 'scanning'
                  ? 'Scanning magnetosphere & regolith…'
                  : 'Deep-Space Surface Scan Available'}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {rank.icon} {rank.title} · {xp} XP
              </div>
            </div>
          </div>
          <button
            onClick={handleSurfaceScan}
            disabled={scanState !== 'idle'}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-all active:scale-95 ${
              scanState === 'done'
                ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                : scanState === 'scanning'
                ? 'border border-amber-400/40 bg-amber-400/20 text-amber-200'
                : 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md hover:brightness-110'
            }`}
          >
            {scanState === 'done' ? '✓ +30 XP' : scanState === 'scanning' ? 'Scanning…' : 'Scan +30 XP'}
          </button>
        </div>

        {/* Clean Accordion Dropdowns ("Only a couple of drop downs here n there") */}
        <div className="mt-3 space-y-2">
          {/* DROPDOWN 1: THE STORY & FUN FACTS (Cyan Accent) */}
          <div className="overflow-hidden rounded-xl border border-cyan-500/25 bg-black/45">
            <button
              onClick={() => toggleDropdown('story')}
              aria-expanded={openDropdown === 'story'}
              className="flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-cyan-500/10"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>01 // Cosmic Story &amp; Secrets</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 text-cyan-300 transition-transform duration-200 ${
                  openDropdown === 'story' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'story' && (
              <div className="space-y-3 border-t border-slate-800/80 px-3.5 pb-3.5 pt-2.5 animate-in fade-in duration-200">
                <p className="text-[12.5px] leading-relaxed text-slate-200">
                  {planet.beginnerSummary}
                </p>

                <div className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
                  <p className="text-[11px] leading-relaxed text-amber-100">
                    {planet.kidFriendlyAnalogy}
                  </p>
                </div>

                <div className="space-y-1.5">
                  {planet.funFacts.slice(0, 3).map((fact) => (
                    <div
                      key={fact}
                      className="rounded-lg border border-slate-800/80 bg-space-950/70 px-2.5 py-2 text-[11px] leading-relaxed text-slate-300"
                    >
                      {fact}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DROPDOWN 2: TELEMETRY, ATMOSPHERE & GRAVITY LAB (Emerald Accent) */}
          <div className="overflow-hidden rounded-xl border border-emerald-500/25 bg-black/45">
            <button
              onClick={() => toggleDropdown('telemetry')}
              aria-expanded={openDropdown === 'telemetry'}
              className="flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-emerald-500/10"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>02 // Telemetry &amp; Gravity Simulator</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 text-emerald-300 transition-transform duration-200 ${
                  openDropdown === 'telemetry' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'telemetry' && (
              <div className="space-y-3 border-t border-slate-800/80 px-3.5 pb-3.5 pt-2.5 animate-in fade-in duration-200">
                <dl className="grid grid-cols-2 gap-1.5 font-mono">
                  {[
                    { label: 'Surface Gravity', value: `${planet.gravityRatio}g` },
                    { label: 'Escape Velocity', value: planet.escapeVelocity },
                    { label: 'Day Length', value: planet.dayLength },
                    { label: 'Orbital Year', value: planet.yearLength },
                    { label: 'Avg Temp', value: planet.avgTemp },
                    { label: 'Known Moons', value: `${planet.moonsCount} Moons` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-slate-800/80 bg-black/50 px-2.5 py-1.5"
                    >
                      <dt className="text-[9px] uppercase tracking-wider text-slate-500">
                        {item.label}
                      </dt>
                      <dd
                        className="truncate text-[10px] font-bold text-emerald-200"
                        title={item.value}
                      >
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Interactive Gravity Slider */}
                <div className="rounded-xl border border-slate-800 bg-space-950/80 p-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Scale className="h-3 w-3" /> Your Earth Weight: {earthWeightKg} kg
                    </span>
                    <span className="font-bold text-amber-300">
                      On {planet.name.split(' ')[0]}: {weightOnWorld} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    value={earthWeightKg}
                    onChange={(e) => setEarthWeightKg(Number(e.target.value))}
                    className="mt-1.5 h-1.5 w-full cursor-pointer accent-emerald-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* DROPDOWN 3: GAMIFIED FIELD QUIZ CHALLENGE (Violet-Amber Accent) */}
          <div className="overflow-hidden rounded-xl border border-purple-500/30 bg-black/45">
            <button
              onClick={() => toggleDropdown('quiz')}
              aria-expanded={openDropdown === 'quiz'}
              className="flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-purple-500/10"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>
                  03 // Field Mastery Quiz ({masteredCount}/{planet.quizQuestions.length})
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 text-purple-300 transition-transform duration-200 ${
                  openDropdown === 'quiz' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'quiz' && currentQuiz && (
              <div className="space-y-2.5 border-t border-slate-800/80 px-3.5 pb-3.5 pt-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>
                    Question {quizIdx + 1} of {planet.quizQuestions.length}
                  </span>
                  {isQuizMastered && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Mastered
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold leading-snug text-white">
                  {currentQuiz.question}
                </p>

                <div className="space-y-1.5">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuiz.correctIndex;
                    let style =
                      'border-slate-800 bg-space-950/80 text-slate-200 hover:border-purple-400/50';
                    if (selectedOption !== null) {
                      if (isCorrect) {
                        style = 'border-emerald-400 bg-emerald-500/20 text-emerald-100 font-semibold';
                      } else if (isSelected) {
                        style = 'border-rose-400 bg-rose-500/20 text-rose-200';
                      } else {
                        style = 'border-slate-800/50 bg-black/30 text-slate-500';
                      }
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectQuizOption(idx)}
                        disabled={selectedOption !== null}
                        className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[11px] transition-all ${style}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && (
                          <span className="ml-2 shrink-0 rounded bg-emerald-500/30 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-200">
                            +40 XP
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-2.5 text-[11px] leading-relaxed text-cyan-100">
                    {currentQuiz.explanation}
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => {
                          haptics.light();
                          soundFX.playClick();
                          setSelectedOption(null);
                          setQuizIdx((prev) => (prev + 1) % planet.quizQuestions.length);
                        }}
                        className="rounded-md bg-purple-400 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-slate-950 hover:bg-purple-300"
                      >
                        Next Question →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions: Deep 3D Orbital Debris Station vs. Command Deck ('K') */}
        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={() => {
              haptics.medium();
              soundFX.playClick();
              onFullBriefing(planet.id);
            }}
            className="micro-btn flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 px-3 py-2 text-[11px] font-bold text-slate-950 shadow-lg hover:brightness-110 active:scale-95"
          >
            <span>3D Orbital Debris Station</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              haptics.light();
              soundFX.playClick();
              onOpenDeck();
            }}
            className="flex items-center gap-1 rounded-xl border border-slate-700 bg-black/50 px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200 hover:border-cyan-400/50 hover:text-white active:scale-95"
          >
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Deck (K)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
