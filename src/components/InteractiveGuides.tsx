import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { INTERACTIVE_GUIDES } from '../data/spaceAcademyData';
import { InteractiveGuide } from '../types/academy';
import { useAcademyStore } from '../store/useAcademyStore';
import { soundFX } from '../utils/soundEffects';
import { TiltCard3D } from './TiltCard3D';
import {
  Compass,
  Play,
  Award,
  CheckCircle2,
  Sparkles,
  Layers,
  BookOpen,
} from 'lucide-react';

// --- 3D Multi-Stage Rocket Stack Mesh for Lab 2 ---
function RocketStack3DModel({ stagesCount }: { stagesCount: 1 | 2 | 3 }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <mesh position={[0, 1.35, 0]}>
        <coneGeometry args={[0.38, 0.65, 24]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.25} />
      </mesh>

      {stagesCount >= 3 && (
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.55, 24]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
        </mesh>
      )}

      {stagesCount >= 2 && (
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.44, 0.46, 0.7, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
        </mesh>
      )}

      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.48, 0.52, 0.95, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.3} />
      </mesh>

      <mesh position={[0, -1.55, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.32, 0.75, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// --- 3D Astronaut EVA Spacesuit Scanner Mesh for Lab 4 ---
function AstronautSuit3DModel({ activeSuitLayer }: { activeSuitLayer: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color={activeSuitLayer === 'visor' ? '#38bdf8' : '#f8fafc'}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.95, 0.16]}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.08}
            emissive={activeSuitLayer === 'visor' ? '#f59e0b' : '#000000'}
            emissiveIntensity={activeSuitLayer === 'visor' ? 0.5 : 0}
          />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.48, 0.42, 1.05, 24]} />
          <meshStandardMaterial
            color={
              activeSuitLayer === 'lcvg'
                ? '#38bdf8'
                : activeSuitLayer === 'bladder'
                ? '#f59e0b'
                : activeSuitLayer === 'tmg'
                ? '#10b981'
                : '#e2e8f0'
            }
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.2, -0.42]}>
          <boxGeometry args={[0.68, 0.85, 0.38]} />
          <meshStandardMaterial
            color={activeSuitLayer === 'plss' ? '#10b981' : '#94a3b8'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <Torus args={[0.95, 0.02, 16, 48]} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#38bdf8" />
        </Torus>
      </group>
    </Float>
  );
}

export const InteractiveGuides: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<InteractiveGuide>(INTERACTIVE_GUIDES[0]);
  const { completedGuides, markGuideCompleted, addXp } = useAcademyStore();

  const [cannonSpeed, setCannonSpeed] = useState<number>(7.8);
  const [cannonFiring, setCannonFiring] = useState<boolean>(false);
  const cannonCanvasRef = useRef<HTMLCanvasElement>(null);

  const [stagesCount, setStagesCount] = useState<1 | 2 | 3>(2);
  const [fuelPercentage, setFuelPercentage] = useState<number>(82);

  const [planetRadiusRatio, setPlanetRadiusRatio] = useState<number>(1.2);
  const [orbitalPeriodSpeed, setOrbitalPeriodSpeed] = useState<number>(2.0);
  const transitCanvasRef = useRef<HTMLCanvasElement>(null);

  const [inspectedSuitLayers, setInspectedSuitLayers] = useState<string[]>(['visor']);
  const [activeSuitLayer, setActiveSuitLayer] = useState<string>('visor');

  const suitLayers = [
    {
      id: 'visor',
      name: '1. 24K Gold Solar Visor',
      role: 'Blocks blinding UV & infrared heat rays',
      detail:
        'A microscopic layer of pure 24k gold reflects infrared solar heat while letting visible light through so astronauts see clearly.',
    },
    {
      id: 'plss',
      name: '2. PLSS Life-Support Backpack',
      role: '7 hours of oxygen, CO2 scrubbing & radio',
      detail:
        'Supplies pure oxygen, scrubs out exhaled carbon dioxide with lithium hydroxide filters, and powers UHF telemetry.',
    },
    {
      id: 'lcvg',
      name: '3. Liquid Cooling Garment',
      role: '90m of water-chilled tubing on skin',
      detail:
        'Because vacuum acts like a thermos bottle, chilled water circulates through 300 feet of tubes to prevent overheating.',
    },
    {
      id: 'bladder',
      name: '4. Urethane Pressure Bladder',
      role: 'Maintains safe atmospheric pressure',
      detail:
        'In zero air pressure, water boils below body temperature (37°C)! This airtight layer keeps the astronaut pressurized.',
    },
    {
      id: 'tmg',
      name: '5. Kevlar Micrometeoroid Armor',
      role: 'Stops 28,000 km/h orbital debris',
      detail:
        'Seven outer layers of aluminized Mylar and bulletproof Kevlar protect against razor-sharp dust and ±130°C swings.',
    },
  ];

  // Lab 1 Animation
  useEffect(() => {
    if (activeGuide.id !== 'newtons-cannon') return;
    const canvas = cannonCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const planetR = 72;

      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 25; i++) {
        ctx.fillRect((i * 73) % canvas.width, (i * 41) % canvas.height, 1.5, 1.5);
      }

      const grad = ctx.createRadialGradient(cx, cy, planetR * 0.85, cx, cy, planetR * 1.4);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, planetR * 1.4, 0, Math.PI * 2);
      ctx.fill();

      const globeGrad = ctx.createRadialGradient(cx - 24, cy - 24, 10, cx, cy, planetR);
      globeGrad.addColorStop(0, '#38bdf8');
      globeGrad.addColorStop(0.55, '#0284c7');
      globeGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.75)';
      ctx.beginPath();
      ctx.arc(cx - 20, cy - 15, 22, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy + 18, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - planetR + 3);
      ctx.lineTo(cx, cy - planetR - 18);
      ctx.lineTo(cx + 14, cy - planetR + 3);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle =
        cannonSpeed < 7.4
          ? '#f43f5e'
          : cannonSpeed <= 8.4
          ? '#10b981'
          : cannonSpeed < 11.1
          ? '#38bdf8'
          : '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();

      const maxAngle = cannonSpeed < 7.4 ? Math.PI * (cannonSpeed / 7.8) : Math.PI * 2;
      const currentMax = cannonFiring ? Math.min(t, maxAngle) : maxAngle;

      let ballX = cx;
      let ballY = cy - planetR - 18;

      for (let a = 0; a <= currentMax; a += 0.05) {
        let r = planetR + 18;
        if (cannonSpeed < 7.4) {
          r = planetR + 18 - (a / maxAngle) * 20;
        } else if (cannonSpeed <= 8.4) {
          r = planetR + 18;
        } else if (cannonSpeed < 11.1) {
          const ecc = (cannonSpeed - 7.8) * 0.14;
          r = ((planetR + 18) * (1 + ecc)) / (1 + ecc * Math.cos(a));
        } else {
          r = planetR + 18 + a * a * 26;
        }

        const px = cx + Math.sin(a) * r;
        const py = cy - Math.cos(a) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);

        ballX = px;
        ballY = py;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 6.5, 0, Math.PI * 2);
      ctx.fill();

      if (cannonFiring) {
        t += 0.045;
        if (t > Math.PI * 2 && cannonSpeed >= 7.4 && cannonSpeed < 11.1) {
          t = 0;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeGuide.id, cannonSpeed, cannonFiring]);

  // Lab 3 Animation
  useEffect(() => {
    if (activeGuide.id !== 'exoplanet-transit') return;
    const canvas = transitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const starX = canvas.width / 2;
      const starY = 85;
      const starR = 46;

      const grad = ctx.createRadialGradient(starX, starY, 10, starX, starY, starR * 1.45);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.7, '#f59e0b');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(starX, starY, starR * 1.45, 0, Math.PI * 2);
      ctx.fill();

      phase += 0.015 * orbitalPeriodSpeed;
      const orbitWidth = 175;
      const px = starX + Math.sin(phase) * orbitWidth;
      const inFront = Math.cos(phase) > 0;
      const pRadius = 5 + planetRadiusRatio * 4.5;

      if (!inFront) {
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(px, starY, pRadius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(starX, starY, starR, 0, Math.PI * 2);
      ctx.fill();

      let brightnessDip = 0;
      if (inFront) {
        const distFromStarCenter = Math.abs(px - starX);
        if (distFromStarCenter < starR + pRadius) {
          brightnessDip = Math.pow(planetRadiusRatio / 3.2, 2) * 38;
        }
        ctx.fillStyle = '#020617';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, starY, pRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      const gx = 40;
      const gy = 165;
      const gw = canvas.width - 80;
      const gh = 70;

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(gx, gy, gw, gh);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('100% STAR BRIGHTNESS', gx + 6, gy + 14);
      ctx.fillText('TRANSIT DIP', gx + gw / 2 - 32, gy + gh - 6);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const dipDepth = Math.pow(planetRadiusRatio / 3.2, 2) * 42;
      for (let x = 0; x <= gw; x += 4) {
        const norm = (x - gw / 2) / (gw * 0.18);
        const dip = Math.abs(norm) < 1 ? dipDepth * (1 - norm * norm * 0.4) : 0;
        const y = gy + 20 + dip;
        if (x === 0) ctx.moveTo(gx + x, y);
        else ctx.lineTo(gx + x, y);
      }
      ctx.stroke();

      const liveX = gx + gw / 2 + Math.sin(phase) * (gw * 0.42);
      const liveY = gy + 20 + (inFront ? brightnessDip : 0);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(liveX, liveY, 5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeGuide.id, planetRadiusRatio, orbitalPeriodSpeed]);

  const stageBonus = stagesCount === 1 ? 1.0 : stagesCount === 2 ? 1.32 : 1.52;
  const exhaustVelocity = 3.4;
  const massRatio = 1 / (1 - (fuelPercentage / 100) * 0.88);
  const calculatedDeltaV = +(exhaustVelocity * Math.log(massRatio) * stageBonus).toFixed(2);
  const reachesOrbit = calculatedDeltaV >= 9.4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 4 Columns: Clean Field Guide Selector */}
      <div className="lg:col-span-4 space-y-2.5">
        <div className="px-1 pb-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            Interactive Science Labs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hands-on 3D & physics sandboxes with plain-English guides
          </p>
        </div>

        {INTERACTIVE_GUIDES.map((guide) => {
          const isSelected = guide.id === activeGuide.id;
          const isDone = completedGuides.includes(guide.id);

          return (
            <TiltCard3D
              key={guide.id}
              intensity={4}
              onClick={() => {
                soundFX.playClick();
                setActiveGuide(guide);
              }}
              className={`cursor-pointer w-full text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400/70 shadow-lg'
                  : 'bg-space-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 animate-float-3d">
                  {guide.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase text-cyan-400">
                      {guide.category}
                    </span>
                    {isDone && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-0.5 truncate">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {guide.subtitle}
                  </p>
                </div>
              </div>
            </TiltCard3D>
          );
        })}
      </div>

      {/* Right 8 Columns: Clean Lab Stage + Concept Cards */}
      <div className="lg:col-span-8">
        <div className="holo-panel-3d border border-slate-800/90 rounded-2xl p-6 space-y-5">
          {/* Top Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold">
                {activeGuide.category}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {activeGuide.title}
              </h2>
            </div>
            <button
              onClick={() => markGuideCompleted(activeGuide.id, activeGuide.badgeId)}
              className="micro-btn px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-medium flex items-center gap-1.5"
            >
              <Award className="h-4 w-4" />
              {completedGuides.includes(activeGuide.id)
                ? `Unlocked: ${activeGuide.badgeTitle}`
                : `Claim "${activeGuide.badgeTitle}"`}
            </button>
          </div>

          {/* Primary Interactive 3D / Physics Sandbox Stage */}
          <div className="bg-space-950/90 border border-slate-800 rounded-2xl p-5">
            {activeGuide.id === 'newtons-cannon' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-6 flex justify-center">
                  <canvas
                    ref={cannonCanvasRef}
                    width={310}
                    height={240}
                    className="rounded-xl bg-space-900/90 border border-slate-800"
                  />
                </div>
                <div className="md:col-span-6 space-y-3.5">
                  <div className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                    Orbital Velocity Sandbox
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">Launch Speed:</span>
                      <span className="text-amber-400 font-bold">{cannonSpeed.toFixed(1)} km/s</span>
                    </div>
                    <input
                      type="range"
                      min={4.5}
                      max={11.6}
                      step={0.1}
                      value={cannonSpeed}
                      onChange={(e) => {
                        setCannonSpeed(Number(e.target.value));
                        setCannonFiring(true);
                      }}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-space-900 border border-slate-800 text-xs">
                    {cannonSpeed < 7.4 ? (
                      <span className="text-rose-300">
                        💥 <strong>Suborbital Crash:</strong> Speed is too low; gravity pulls the cannonball back to the ground.
                      </span>
                    ) : cannonSpeed <= 8.4 ? (
                      <span className="text-emerald-300">
                        🛰️ <strong>Circular Orbit (7.8 km/s):</strong> Falling around Earth at the exact rate the curved horizon drops away!
                      </span>
                    ) : cannonSpeed < 11.1 ? (
                      <span className="text-cyan-300">
                        ☄️ <strong>Elliptical Orbit:</strong> Swings far out into an oval loop before returning.
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        🚀 <strong>Escape Velocity (11.2+ km/s):</strong> Breaks free of Earth’s gravity forever!
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        soundFX.playScanPing();
                        setCannonFiring(true);
                        if (cannonSpeed >= 7.4 && cannonSpeed <= 8.4) {
                          markGuideCompleted(activeGuide.id, activeGuide.badgeId);
                        }
                      }}
                      className="micro-btn flex-1 py-2 rounded-lg bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Fire Cannonball
                    </button>
                    <button
                      onClick={() => setCannonSpeed(7.8)}
                      className="micro-btn px-3 py-2 rounded-lg bg-space-800 text-xs text-slate-300 hover:text-white border border-slate-700"
                    >
                      7.8 km/s
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeGuide.id === 'rocket-staging' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-5 h-60 rounded-xl overflow-hidden bg-space-900 border border-slate-800 relative">
                  <Canvas camera={{ position: [0, 0.5, 4.2], fov: 45 }}>
                    <color attach="background" args={['#040710']} />
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[6, 8, 6]} intensity={1.5} />
                    <Stars radius={40} count={600} factor={2} fade />
                    <RocketStack3DModel stagesCount={stagesCount} />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">
                      Number of Rocket Stages:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {([1, 2, 3] as const).map((cnt) => (
                        <button
                          key={cnt}
                          onClick={() => {
                            soundFX.playClick();
                            setStagesCount(cnt);
                          }}
                          className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                            stagesCount === cnt
                              ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                              : 'bg-space-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          {cnt} {cnt === 1 ? 'Stage' : 'Stages'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Propellant Fuel Fraction:</span>
                      <span className="text-amber-400 font-bold">{fuelPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={92}
                      value={fuelPercentage}
                      onChange={(e) => setFuelPercentage(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                      reachesOrbit
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        Total Delta-V (Need 9.40 km/s)
                      </div>
                      <div className="text-sm font-bold font-mono mt-0.5">
                        {calculatedDeltaV} km/s — {reachesOrbit ? '✅ Orbit Reached!' : '⚠️ Too Heavy'}
                      </div>
                    </div>
                    {reachesOrbit && (
                      <button
                        onClick={() => markGuideCompleted(activeGuide.id, activeGuide.badgeId)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 font-semibold text-xs"
                      >
                        Unlock Badge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeGuide.id === 'exoplanet-transit' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-6 flex justify-center">
                  <canvas
                    ref={transitCanvasRef}
                    width={320}
                    height={240}
                    className="rounded-xl bg-space-900 border border-slate-800"
                  />
                </div>
                <div className="md:col-span-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Exoplanet Size:</span>
                      <span className="text-cyan-400 font-bold">{planetRadiusRatio.toFixed(1)}x Earth</span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={3.0}
                      step={0.1}
                      value={planetRadiusRatio}
                      onChange={(e) => setPlanetRadiusRatio(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Orbital Speed / Zone:</span>
                      <span className="text-emerald-400 font-bold">
                        {orbitalPeriodSpeed >= 1.5 && orbitalPeriodSpeed <= 2.5
                          ? '💧 Habitable Zone'
                          : orbitalPeriodSpeed > 2.5
                          ? '🔥 Too Hot'
                          : '❄️ Too Cold'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.8}
                      max={3.5}
                      step={0.1}
                      value={orbitalPeriodSpeed}
                      onChange={(e) => setOrbitalPeriodSpeed(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-space-900 border border-slate-800 text-xs text-slate-300">
                    Starlight Blocked: <strong className="text-amber-400 font-mono">{(Math.pow(planetRadiusRatio, 2) * 0.12).toFixed(2)}%</strong>
                  </div>
                </div>
              </div>
            )}

            {activeGuide.id === 'spacesuit-anatomy' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 h-60 rounded-xl overflow-hidden bg-space-900 border border-slate-800 relative">
                  <Canvas camera={{ position: [0, 0.3, 3.6], fov: 45 }}>
                    <color attach="background" args={['#040710']} />
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[6, 8, 6]} intensity={1.5} />
                    <Stars radius={40} count={500} factor={2} fade />
                    <AstronautSuit3DModel activeSuitLayer={activeSuitLayer} />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-cyan-400" />
                    Suit Layers ({inspectedSuitLayers.length}/5):
                  </div>
                  {suitLayers.map((layer) => {
                    const isCurrent = activeSuitLayer === layer.id;
                    const isVisited = inspectedSuitLayers.includes(layer.id);
                    return (
                      <button
                        key={layer.id}
                        onClick={() => {
                          soundFX.playClick();
                          setActiveSuitLayer(layer.id);
                          if (!inspectedSuitLayers.includes(layer.id)) {
                            const next = [...inspectedSuitLayers, layer.id];
                            setInspectedSuitLayers(next);
                            addXp(20, `Inspected ${layer.name}`);
                            if (next.length === suitLayers.length) {
                              markGuideCompleted(activeGuide.id, activeGuide.badgeId);
                            }
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold'
                            : 'bg-space-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate">{layer.name}</span>
                        <span className="text-emerald-400 ml-2">{isVisited ? '✓' : '→'}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="md:col-span-4 bg-space-900 border border-slate-800 rounded-xl p-4">
                  {(() => {
                    const current = suitLayers.find((l) => l.id === activeSuitLayer) || suitLayers[0];
                    return (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase text-amber-400">
                          {current.role}
                        </span>
                        <h4 className="text-sm font-bold text-white">{current.name}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {current.detail}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Clean 2-Column Concept Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-space-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-xs font-mono uppercase text-cyan-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                The Big Idea
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{activeGuide.bigIdea}</p>
            </div>

            <div className="bg-space-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-xs font-mono uppercase text-amber-400 font-semibold mb-1.5">
                Real-World NASA Application
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeGuide.realWorldExample}
              </p>
            </div>
          </div>

          {/* Key Equations & Technical Facts Strip */}
          <div className="bg-space-950/80 border border-cyan-500/25 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Key Equations & Engineering Facts
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {activeGuide.keyEquationsOrFacts.map((eq, i) => (
                <div key={i} className="bg-space-900/90 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-amber-200">
                  {eq}
                </div>
              ))}
            </div>
          </div>

          {/* 3-Step Horizontal Walkthrough Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeGuide.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-space-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400">
                    Step {step.stepNumber}
                  </span>
                  <h4 className="text-xs font-semibold text-white mt-0.5">{step.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-amber-300">
                  👉 {step.tryItPrompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
