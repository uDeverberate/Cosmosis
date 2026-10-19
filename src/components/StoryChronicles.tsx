import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { SPACE_STORIES } from '../data/spaceAcademyData';
import { SpaceStory, StoryChoice } from '../types/academy';
import { useAcademyStore } from '../store/useAcademyStore';
import { soundFX } from '../utils/soundEffects';
import { TiltCard3D } from './TiltCard3D';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Radio,
  Volume2,
  VolumeX,
  Award,
  ShieldCheck,
  Info,
} from 'lucide-react';

// --- 3D Animated Story Diorama Meshes (Supports all 6 Chronicles) ---
function Story3DDioramaScene({
  visualType,
  chapterIndex,
}: {
  visualType:
    | 'lunar-descent'
    | 'apollo-13'
    | 'mars-skycrane'
    | 'voyager-record'
    | 'mars-storm'
    | 'webb-mirror';
  chapterIndex: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.45;
    if (visualType === 'lunar-descent' || visualType === 'mars-skycrane') {
      const targetY = chapterIndex === 0 ? 0.55 : chapterIndex === 1 ? 0.15 : -0.25;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY + Math.sin(state.clock.elapsedTime * 2.5) * 0.08,
        0.05
      );
    }
  });

  return (
    <group>
      {/* 1. APOLLO 11 LUNAR DESCENT */}
      {visualType === 'lunar-descent' && (
        <>
          <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[3.2, 3.2, 0.2, 32]} />
            <meshStandardMaterial color="#334155" roughness={0.9} metalness={0.1} />
          </mesh>
          <Torus args={[1.6, 0.08, 12, 48]} position={[0, -1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </Torus>

          <group ref={groupRef} position={[0, 0.3, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.65, 0.65, 0.45, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <dodecahedronGeometry args={[0.48, 0]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.3} />
            </mesh>
            {chapterIndex < 2 && (
              <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.28, 0.65, 16]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
              </mesh>
            )}
          </group>
        </>
      )}

      {/* 2. APOLLO 13 CRIPPLED SERVICE MODULE & AQUARIUS LIFEBOAT */}
      {visualType === 'apollo-13' && (
        <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.4}>
          <group ref={groupRef} rotation={[0.2, 0, 0.3]}>
            {/* Silver Service Module Cylinder */}
            <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.48, 0.48, 1.1, 24]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Conical Command Module Odyssey */}
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.48, 0.55, 24]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Attached Lunar Module Aquarius Lifeboat */}
            <mesh position={[0.75, 0, 0]}>
              <dodecahedronGeometry args={[0.46, 0]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.25} />
            </mesh>
            {/* Venting Oxygen Cloud Ring */}
            <Torus args={[1.25, 0.025, 16, 48]} position={[-0.6, 0, 0]}>
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
            </Torus>
          </group>
        </Float>
      )}

      {/* 3. MARS PERSEVERANCE ROCKET SKY-CRANE */}
      {visualType === 'mars-skycrane' && (
        <>
          <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[3.2, 3.2, 0.2, 32]} />
            <meshStandardMaterial color="#7f1d1d" roughness={0.85} />
          </mesh>
          <group ref={groupRef} position={[0, 0.25, 0]}>
            {/* Upper Rocket Sky-Crane Jetpack */}
            <mesh position={[0, 0.75, 0]}>
              <cylinderGeometry args={[0.7, 0.7, 0.22, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
            </mesh>
            {/* Nylon Bridle Cables */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.85]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>
            {/* Lowered Perseverance Rover */}
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.85, 0.32, 0.65]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.75} />
            </mesh>
          </group>
        </>
      )}

      {/* 4. VOYAGER GOLDEN RECORD */}
      {visualType === 'voyager-record' && (
        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.5}>
          <group ref={groupRef} rotation={[0.4, 0, 0.2]}>
            <mesh>
              <cylinderGeometry args={[1.35, 1.35, 0.08, 48]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.12} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.09, 32]} />
              <meshStandardMaterial color="#92400e" metalness={0.8} roughness={0.3} />
            </mesh>
            <Torus args={[1.75, 0.02, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="#38bdf8" />
            </Torus>
          </group>
        </Float>
      )}

      {/* 5. OPPORTUNITY MARS ROVER */}
      {visualType === 'mars-storm' && (
        <>
          <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[3.2, 3.2, 0.25, 32]} />
            <meshStandardMaterial color="#7f1d1d" roughness={0.85} />
          </mesh>
          <group ref={groupRef} position={[0, -0.3, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.1, 0.4, 0.8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[1.5, 0.05, 1.2]} />
              <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0.4, 0.55, 0.2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.65]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <mesh position={[0.4, 0.88, 0.2]}>
              <boxGeometry args={[0.25, 0.16, 0.3]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>
        </>
      )}

      {/* 6. JAMES WEBB HEXAGON MIRROR */}
      {visualType === 'webb-mirror' && (
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
          <group ref={groupRef}>
            <mesh position={[0, -0.65, 0]} rotation={[0, Math.PI / 4, 0]}>
              <cylinderGeometry args={[1.6, 1.6, 0.05, 4]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[1.1, 1.1, 0.12, 6]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>
            <Torus args={[1.45, 0.02, 16, 6]} position={[0, 0.25, 0]}>
              <meshBasicMaterial color="#f59e0b" />
            </Torus>
          </group>
        </Float>
      )}
    </group>
  );
}

export const StoryChronicles: React.FC = () => {
  const [activeStory, setActiveStory] = useState<SpaceStory>(SPACE_STORIES[0]);
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [awardedXp, setAwardedXp] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const { completedStories, markStoryCompleted, recordChoice } = useAcademyStore();

  const currentChapter = activeStory.chapters[chapterIndex] || activeStory.chapters[0];
  const isLastChapter = chapterIndex === activeStory.chapters.length - 1;
  const isStoryDone = completedStories.includes(activeStory.id);

  const handleSelectStory = (story: SpaceStory) => {
    soundFX.playClick();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveStory(story);
    setChapterIndex(0);
    setSelectedChoice(null);
    setAwardedXp(0);
  };

  const handleChooseOption = (choice: StoryChoice) => {
    if (selectedChoice) return;
    setSelectedChoice(choice);
    if (choice.isOptimal) {
      soundFX.playSuccessChime();
    } else {
      soundFX.playScanPing();
    }
    // A best call earns full credit; a learning call still earns a little for trying.
    // Each chapter only pays out once, so restarting a story can't farm XP.
    const choiceKey = `${activeStory.id}-${currentChapter.id}`;
    const reward = choice.isOptimal ? choice.xpBonus : 5;
    const isNew = recordChoice(choiceKey, reward, `Story decision: ${activeStory.title}`);
    setAwardedXp(isNew ? reward : 0);
  };

  const handleNextChapter = () => {
    soundFX.playClick();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (isLastChapter) {
      markStoryCompleted(activeStory.id, activeStory.badgeId);
    } else {
      setChapterIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setAwardedXp(0);
    }
  };

  const toggleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${currentChapter.title}. ${currentChapter.narrative} ${
        currentChapter.quote ? `Quote: ${currentChapter.quote}` : ''
      }`
    );
    utterance.rate = 0.98;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 4 Columns: 6 Gripping Mission Chronicles Sidebar */}
      <div className="lg:col-span-4 space-y-2.5">
        <div className="px-1 pb-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            6 Mission Chronicles
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            High-stakes NASA survival & discovery stories with 3D scenes
          </p>
        </div>

        {SPACE_STORIES.map((story) => {
          const isSelected = story.id === activeStory.id;
          const isCompleted = completedStories.includes(story.id);

          return (
            <TiltCard3D
              key={story.id}
              intensity={4}
              onClick={() => handleSelectStory(story)}
              className={`cursor-pointer w-full text-left p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400/70 shadow-lg'
                  : 'bg-space-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-center text-xl shrink-0 animate-float-3d">
                  {story.heroEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-cyan-400">
                      {story.difficulty} • {story.chapters.length} Ch
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white mt-0.5 truncate">
                    {story.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {story.subtitle}
                  </p>
                </div>
              </div>
            </TiltCard3D>
          );
        })}
      </div>

      {/* Right 8 Columns: Clean Magazine-Style Story Reader */}
      <div className="lg:col-span-8">
        <div className="holo-panel-3d border border-slate-800/90 rounded-2xl overflow-hidden">
          {/* Top Full-Width 3D Diorama Stage */}
          <div className="relative h-52 w-full bg-space-950 border-b border-slate-800/80">
            <Canvas camera={{ position: [0, 1.1, 3.8], fov: 45 }}>
              <color attach="background" args={['#040710']} />
              <ambientLight intensity={0.75} />
              <directionalLight position={[8, 10, 8]} intensity={1.6} />
              <pointLight position={[-6, -4, -4]} intensity={0.9} color="#38bdf8" />
              <Stars radius={50} count={900} factor={2.5} fade speed={1} />
              <Story3DDioramaScene
                visualType={currentChapter.visualType}
                chapterIndex={chapterIndex}
              />
              <OrbitControls enableZoom={true} enablePan={false} minDistance={2.2} maxDistance={6} />
            </Canvas>

            {/* Top-Left Mission & Tension Status Pill */}
            <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2">
              <span className="bg-space-950/85 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-full text-[11px] font-mono text-cyan-300">
                {activeStory.era}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                  currentChapter.tensionLevel === 'EXTREME'
                    ? 'bg-rose-950/90 border-rose-500/50 text-rose-300 animate-pulse'
                    : currentChapter.tensionLevel === 'CRITICAL'
                    ? 'bg-amber-950/90 border-amber-500/50 text-amber-300'
                    : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
                }`}
              >
                STATUS: {currentChapter.tensionLevel}
              </span>
            </div>

            {/* Minimal Bottom-Right Controls */}
            <div className="absolute bottom-3 right-4 flex items-center gap-2">
              <button
                onClick={toggleReadAloud}
                className="px-3 py-1 rounded-full bg-space-900/90 hover:bg-space-800 border border-slate-700 text-xs text-cyan-300 flex items-center gap-1.5 backdrop-blur-md"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                    Stop Audio
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                    Narrate Chapter
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setChapterIndex(0);
                  setSelectedChoice(null);
                  setAwardedXp(0);
                }}
                className="p-1.5 rounded-full bg-space-900/90 hover:bg-space-800 border border-slate-700 text-slate-300 hover:text-white"
                title="Restart story"
                aria-label="Restart story"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Live Mission Telemetry Bar */}
          <div className="grid grid-cols-3 bg-space-950/90 border-b border-slate-800/80 divide-x divide-slate-800/80 font-mono">
            {currentChapter.telemetryMetrics.map((m, idx) => (
              <div key={idx} className="px-4 py-2.5">
                <div className="text-[10px] text-slate-400 uppercase">{m.label}</div>
                <div
                  className={`text-xs font-bold mt-0.5 truncate ${
                    m.status === 'crit'
                      ? 'text-rose-400'
                      : m.status === 'warn'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Story Content Body */}
          <div className="p-6 space-y-5">
            {/* Chapter Stepper & Title */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-amber-400">
                  {currentChapter.timestamp}
                </div>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {currentChapter.title}
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                {activeStory.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setChapterIndex(idx);
                      setSelectedChoice(null);
                      setAwardedXp(0);
                    }}
                    aria-label={`Go to chapter ${idx + 1}`}
                    aria-current={idx === chapterIndex ? 'step' : undefined}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === chapterIndex
                        ? 'w-8 bg-cyan-400'
                        : idx < chapterIndex
                        ? 'w-2.5 bg-emerald-400'
                        : 'w-2.5 bg-slate-800'
                    }`}
                    title={`Jump to Chapter ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Narrative Paragraph */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {currentChapter.narrative}
            </p>

            {/* Three-Card Info Row: Quote, Science Takeaway, & Historical Secret */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentChapter.quote && (
                <div className="bg-space-950/70 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-cyan-400 mb-1.5">
                      <Radio className="h-3 w-3" />
                      Mission Voice Log
                    </div>
                    <blockquote className="text-xs italic text-white leading-relaxed">
                      "{currentChapter.quote}"
                    </blockquote>
                  </div>
                  {currentChapter.quoteAuthor && (
                    <div className="text-[10px] font-mono text-slate-400 mt-2">
                      — {currentChapter.quoteAuthor}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-emerald-950/15 border border-emerald-500/25 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-emerald-400 mb-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Why This Works
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentChapter.scienceTakeaway}
                </p>
              </div>

              <div className="bg-amber-950/15 border border-amber-500/25 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-amber-400 mb-1.5">
                  <Info className="h-3.5 w-3.5" />
                  Did You Know?
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentChapter.didYouKnowFact}
                </p>
              </div>
            </div>

            {/* Clean Cadet Decision Box (NO XP SHOWN ON OPTIONS BEFORE ANSWERING!) */}
            <div className="bg-space-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{currentChapter.choicePrompt}</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {currentChapter.choices.map((choice, idx) => {
                  const isPicked = selectedChoice?.label === choice.label;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleChooseOption(choice)}
                      disabled={Boolean(selectedChoice)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
                        !selectedChoice
                          ? 'bg-space-900 border-slate-800 hover:border-cyan-400/60 text-slate-100'
                          : isPicked && choice.isOptimal
                          ? 'bg-emerald-950/40 border-emerald-400 text-emerald-100 font-medium'
                          : isPicked && !choice.isOptimal
                          ? 'bg-amber-950/40 border-amber-400 text-amber-100'
                          : 'bg-space-900/30 border-slate-800/60 text-slate-500 opacity-60'
                      }`}
                    >
                      <span>{choice.label}</span>
                      {selectedChoice && isPicked && (
                        <span className="text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                          {awardedXp > 0 ? `+${awardedXp} XP earned` : 'Decision already logged'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedChoice && (
                <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono font-bold text-emerald-400">
                      {awardedXp > 0
                        ? `+${awardedXp} Space XP awarded${selectedChoice.isOptimal ? ' — best call' : ''}!`
                        : 'Already completed — no repeat XP'}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedChoice.outcomeText}
                    </p>
                  </div>
                  <button
                    onClick={handleNextChapter}
                    className="micro-btn px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    {isLastChapter ? (
                      <>
                        <Award className="h-4 w-4" />
                        {isStoryDone ? 'Completed' : `Claim "${activeStory.badgeTitle}"`}
                      </>
                    ) : (
                      <>
                        Next Chapter
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
