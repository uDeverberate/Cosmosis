import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TRIVIA_GAUNTLET_QUESTIONS } from '../data/spaceAcademyData';
import { useAcademyStore } from '../store/useAcademyStore';
import { soundFX } from '../utils/soundEffects';
import {
  Rocket,
  Orbit,
  Radio,
  RotateCcw,
  Trophy,
  Play,
  CheckCircle2,
  Flame,
  Box,
  HelpCircle,
  Zap,
  ArrowRight,
} from 'lucide-react';

type GameMode =
  | 'lunar-lander'
  | 'gravity-slingshot'
  | 'zero-g-rescue'
  | 'signal-decoder'
  | 'trivia-gauntlet';

function ZeroGSatelliteItem({
  name,
  emoji,
  color,
  initialPos,
  impulseKey,
  isRecovered,
  onRecover,
}: {
  name: string;
  emoji: string;
  color: string;
  initialPos: [number, number, number];
  impulseKey: number;
  isRecovered: boolean;
  onRecover: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const [, api] = useBox(
    () => ({
      mass: 1.2,
      position: initialPos,
      velocity: [(Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 1.8],
      angularVelocity: [(Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2, 0.9],
      linearDamping: 0.04,
      angularDamping: 0.04,
      args: [1.1, 1.1, 1.1],
      material: { restitution: 0.9, friction: 0.08 },
    }),
    meshRef
  );

  useEffect(() => {
    if (impulseKey > 0 && !isRecovered) {
      api.velocity.set(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3.0
      );
    }
  }, [impulseKey, isRecovered, api]);

  useFrame(() => {
    if (isRecovered) {
      api.position.set(0, -100, 0);
      api.velocity.set(0, 0, 0);
    }
  });

  if (isRecovered) return null;

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        soundFX.playScanPing();
        onRecover();
      }}
    >
      <dodecahedronGeometry args={[0.72, 0]} />
      <meshStandardMaterial
        color={hovered ? '#38bdf8' : color}
        metalness={0.8}
        roughness={0.2}
        emissive={hovered ? '#0ea5e9' : '#000000'}
        emissiveIntensity={hovered ? 0.6 : 0}
      />
      <Html distanceFactor={12} position={[0, 1.0, 0]} center>
        <div className="px-2 py-0.5 rounded-full bg-space-950/90 border border-slate-700 text-[10px] font-mono text-white whitespace-nowrap pointer-events-none">
          {emoji} {name}
        </div>
      </Html>
    </mesh>
  );
}

function ZeroGBoundaryWalls({ size = 8 }: { size?: number }) {
  const half = size / 2;
  usePlane(() => ({ type: 'Static', position: [0, 0, -half], rotation: [0, 0, 0] }));
  usePlane(() => ({ type: 'Static', position: [0, 0, half], rotation: [0, Math.PI, 0] }));
  usePlane(() => ({ type: 'Static', position: [-half, 0, 0], rotation: [0, Math.PI / 2, 0] }));
  usePlane(() => ({ type: 'Static', position: [half, 0, 0], rotation: [0, -Math.PI / 2, 0] }));
  usePlane(() => ({ type: 'Static', position: [0, half, 0], rotation: [Math.PI / 2, 0, 0] }));
  usePlane(() => ({ type: 'Static', position: [0, -half, 0], rotation: [-Math.PI / 2, 0, 0] }));

  return (
    <gridHelper args={[size, 8, 0x0ea5e9, 0x1e293b]} position={[0, -half, 0]} />
  );
}

export const SpaceGamesArcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameMode>('lunar-lander');
  const { addXp, unlockBadge } = useAcademyStore();

  // ==========================================================================
  // GAME 1: MULTI-SITE EAGLE LUNAR TOUCHDOWN SIMULATOR (+ COLLECTIBLE PODS)
  // ==========================================================================
  const landerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gravityWorld, setGravityWorld] = useState<'moon' | 'mars' | 'europa'>('moon');
  const [landingLevel, setLandingLevel] = useState<1 | 2 | 3>(1);
  const [landerStatus, setLanderStatus] = useState<'ready' | 'flying' | 'won' | 'crashed'>('ready');
  const [landerStats, setLanderStats] = useState({
    fuel: 100,
    vy: 0,
    vx: 0,
    altitude: 300,
    podsCollected: 0,
  });

  const controlsRef = useRef({ thrust: false, left: false, right: false });
  const landerStateRef = useRef({
    x: 260,
    y: 50,
    vx: 0.4,
    vy: 0,
    angle: 0,
    fuel: 100,
    pods: [
      { x: 165, y: 145, collected: false },
      { x: 355, y: 185, collected: false },
    ],
    status: 'ready' as 'ready' | 'flying' | 'won' | 'crashed',
  });

  const startLanderGame = () => {
    soundFX.playClick();
    landerStateRef.current = {
      x: 130 + Math.random() * 240,
      y: 42,
      vx: (Math.random() - 0.5) * 1.4,
      vy: 0.2,
      angle: 0,
      fuel: 100,
      pods: [
        { x: 140 + Math.random() * 90, y: 120 + Math.random() * 60, collected: false },
        { x: 300 + Math.random() * 110, y: 140 + Math.random() * 60, collected: false },
      ],
      status: 'flying',
    };
    setLanderStatus('flying');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        controlsRef.current.thrust = true;
        if (landerStateRef.current.status === 'flying') soundFX.startThrusterSound();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') controlsRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') controlsRef.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        controlsRef.current.thrust = false;
        soundFX.stopThrusterSound();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') controlsRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') controlsRef.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      soundFX.stopThrusterSound();
    };
  }, []);

  useEffect(() => {
    if (activeGame !== 'lunar-lander') return;
    const canvas = landerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let timeTick = 0;
    const grav =
      gravityWorld === 'moon' ? 0.018 : gravityWorld === 'mars' ? 0.032 : 0.014;
    const groundY = 300;

    const loop = () => {
      timeTick += 0.025;
      const s = landerStateRef.current;

      const padW = landingLevel === 1 ? 115 : landingLevel === 2 ? 85 : 75;
      const padX =
        landingLevel === 3
          ? 230 + Math.sin(timeTick) * 85
          : landingLevel === 2
          ? 235
          : 215;

      if (s.status === 'flying') {
        if (controlsRef.current.left) s.angle = Math.max(-0.6, s.angle - 0.032);
        if (controlsRef.current.right) s.angle = Math.min(0.6, s.angle + 0.032);

        s.vy += grav;

        // Level 2 & 3 subtle solar wind / crosswind drift
        if (landingLevel >= 2) {
          s.vx += Math.sin(timeTick * 1.4) * 0.003;
        }

        if (controlsRef.current.thrust && s.fuel > 0) {
          s.vx += Math.sin(s.angle) * 0.046;
          s.vy -= Math.cos(s.angle) * 0.054;
          s.fuel = Math.max(0, s.fuel - 0.2);
        }

        s.x += s.vx;
        s.y += s.vy;

        // Check collectible floating data/fuel pods
        s.pods.forEach((pod) => {
          if (!pod.collected && Math.hypot(s.x - pod.x, s.y - pod.y) < 24) {
            pod.collected = true;
            s.fuel = Math.min(100, s.fuel + 25);
            soundFX.playScanPing();
          }
        });

        if (s.x < 30) {
          s.x = 30;
          s.vx = Math.abs(s.vx) * 0.5;
        }
        if (s.x > canvas.width - 30) {
          s.x = canvas.width - 30;
          s.vx = -Math.abs(s.vx) * 0.5;
        }

        if (s.y >= groundY - 18) {
          s.y = groundY - 18;
          soundFX.stopThrusterSound();
          const onPad = s.x >= padX && s.x <= padX + padW;
          const gentleSpeed = s.vy < 1.38 && Math.abs(s.vx) < 1.05 && Math.abs(s.angle) < 0.36;

          if (onPad && gentleSpeed) {
            s.status = 'won';
            setLanderStatus('won');
            unlockBadge('badge-lunar-ace');
            const podBonus = s.pods.filter((p) => p.collected).length * 25;
            addXp(80 + podBonus, `Lunar Module Touchdown (Level ${landingLevel})!`);
          } else {
            s.status = 'crashed';
            setLanderStatus('crashed');
            soundFX.playAlert();
          }
        }

        setLanderStats({
          fuel: Math.round(s.fuel),
          vy: +(s.vy * 1.8).toFixed(1),
          vx: +(s.vx * 1.8).toFixed(1),
          altitude: Math.max(0, Math.round(groundY - 18 - s.y)),
          podsCollected: s.pods.filter((p) => p.collected).length,
        });
      }

      ctx.fillStyle = '#040710';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 97) % canvas.width, (i * 53) % (groundY - 30), 1.5, 1.5);
      }

      // Draw Collectible Floating Fuel/Data Pods
      s.pods.forEach((pod) => {
        if (pod.collected) return;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pod.x, pod.y, 11, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(pod.x, pod.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px monospace';
        ctx.fillText('+FUEL', pod.x - 14, pod.y - 14);
      });

      // Terrain
      ctx.fillStyle =
        gravityWorld === 'moon' ? '#334155' : gravityWorld === 'mars' ? '#7f1d1d' : '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(110, groundY - 24);
      ctx.lineTo(185, groundY);
      ctx.lineTo(360, groundY);
      ctx.lineTo(440, groundY - 28);
      ctx.lineTo(canvas.width, groundY);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Glowing Pad
      ctx.fillStyle = '#10b981';
      ctx.fillRect(padX, groundY - 4, padW, 6);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`PAD L${landingLevel} (< 2.4 m/s)`, padX, groundY + 18);

      // Draw Lunar Lander
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);

      if (s.status === 'flying' && controlsRef.current.thrust && s.fuel > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-7, 12);
        ctx.lineTo(0, 28 + Math.random() * 10);
        ctx.lineTo(7, 12);
        ctx.closePath();
        ctx.fill();
      }

      // RCS Side Attitude Plumes
      if (s.status === 'flying' && controlsRef.current.left) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(10, -6, 9, 2);
      }
      if (s.status === 'flying' && controlsRef.current.right) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-19, -6, 9, 2);
      }

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-12, 2, 24, 10);

      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, -4, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 10);
      ctx.lineTo(-16, 18);
      ctx.moveTo(10, 10);
      ctx.lineTo(16, 18);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeGame, gravityWorld, landingLevel, addXp, unlockBadge]);

  // ==========================================================================
  // GAME 2: INTERACTIVE MULTI-LEVEL GRAVITY SLINGSHOT LAB (CLICK-AND-DRAG AIM!)
  // ==========================================================================
  const slingshotCanvasRef = useRef<HTMLCanvasElement>(null);
  const [slingshotLevel, setSlingshotLevel] = useState<1 | 2 | 3>(1);
  const [launchAngleDeg, setLaunchAngleDeg] = useState<number>(-32);
  const [launchPower, setLaunchPower] = useState<number>(72);
  const [slingshotStatus, setSlingshotStatus] = useState<'aiming' | 'flying' | 'success' | 'missed'>('aiming');

  const probeRef = useRef({
    x: 60,
    y: 175,
    vx: 0,
    vy: 0,
    trail: [] as { x: number; y: number }[],
    active: false,
  });

  const fireSlingshotProbe = () => {
    soundFX.playScanPing();
    const rad = (launchAngleDeg * Math.PI) / 180;
    const spd = (launchPower / 100) * 5.2;
    probeRef.current = {
      x: 60,
      y: 175,
      vx: Math.cos(rad) * spd,
      vy: Math.sin(rad) * spd,
      trail: [],
      active: true,
    };
    setSlingshotStatus('flying');
  };

  // Allow clicking directly on the canvas to aim and fire!
  const handleSlingshotCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = slingshotCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const dx = clickX - 60;
    const dy = clickY - 175;
    const angle = Math.max(-65, Math.min(65, Math.round((Math.atan2(dy, dx) * 180) / Math.PI)));
    const dist = Math.min(100, Math.max(35, Math.round(Math.hypot(dx, dy) / 2.2)));
    setLaunchAngleDeg(angle);
    setLaunchPower(dist);
    setSlingshotStatus('aiming');
    probeRef.current.active = false;
  };

  useEffect(() => {
    if (activeGame !== 'gravity-slingshot') return;
    const canvas = slingshotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const wells =
      slingshotLevel === 1
        ? [{ x: 265, y: 175, r: 34, gm: 1950, color: '#d97706', name: 'JUPITER' }]
        : slingshotLevel === 2
        ? [
            { x: 210, y: 125, r: 26, gm: 1350, color: '#eab308', name: 'SATURN A' },
            { x: 325, y: 225, r: 26, gm: 1350, color: '#38bdf8', name: 'URANUS B' },
          ]
        : [
            { x: 255, y: 175, r: 34, gm: 2000, color: '#d97706', name: 'JUPITER' },
            { x: 350, y: 105, r: 16, gm: 650, color: '#ef4444', name: 'IO MOON' },
          ];

    const targetX = 470;
    const targetY = slingshotLevel === 2 ? 120 : 165;
    const targetR = 26;

    const loop = () => {
      const p = probeRef.current;

      if (p.active) {
        let hitObstacle = false;
        wells.forEach((w) => {
          const dx = w.x - p.x;
          const dy = w.y - p.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          if (dist < w.r) hitObstacle = true;
          const force = w.gm / Math.max(distSq, 400);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        });

        p.x += p.vx;
        p.y += p.vy;
        p.trail.push({ x: p.x, y: p.y });

        const tDist = Math.hypot(p.x - targetX, p.y - targetY);
        if (tDist < targetR) {
          p.active = false;
          setSlingshotStatus('success');
          unlockBadge('badge-slingshot-ace');
          addXp(90, `Gravity Slingshot Level ${slingshotLevel} Complete!`);
        } else if (
          hitObstacle ||
          p.x < 0 ||
          p.x > canvas.width ||
          p.y < 0 ||
          p.y > canvas.height
        ) {
          p.active = false;
          setSlingshotStatus('missed');
          soundFX.playAlert();
        }
      }

      ctx.fillStyle = '#040710';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      wells.forEach((w) => {
        for (let r = w.r + 18; r <= w.r + 75; r += 28) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
          ctx.beginPath();
          ctx.arc(w.x, w.y, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = w.color;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(w.name, w.x - 24, w.y + w.r + 13);
      });

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fill();
      ctx.fillStyle = '#34d399';
      ctx.fillText('TARGET GATE', targetX - 34, targetY + targetR + 14);

      if (!p.active && slingshotStatus === 'aiming') {
        const rad = (launchAngleDeg * Math.PI) / 180;
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(60, 175);
        ctx.lineTo(60 + Math.cos(rad) * launchPower * 1.15, 175 + Math.sin(rad) * launchPower * 1.15);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (p.trail.length > 1) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        p.trail.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeGame, slingshotLevel, launchAngleDeg, launchPower, slingshotStatus, addXp, unlockBadge]);

  // ==========================================================================
  // GAME 3: 3D ZERO-G SATELLITE & RELIC RESCUE (+ IMPULSE THRUSTER BURST)
  // ==========================================================================
  const [recoveredIds, setRecoveredIds] = useState<string[]>([]);
  const [impulseKey, setImpulseKey] = useState<number>(0);
  const zeroGTargets = [
    { id: 'hubble-gyro', name: 'Hubble Gyroscope Unit', emoji: '🔭', color: '#f59e0b', pos: [-2.2, 1.2, 0] as [number, number, number] },
    { id: 'golden-disc', name: 'Voyager Golden Disc', emoji: '💿', color: '#eab308', pos: [2.0, -1.1, 0.5] as [number, number, number] },
    { id: 'lunar-camera', name: 'Apollo TV Camera', emoji: '📹', color: '#38bdf8', pos: [0.2, 1.8, -1.2] as [number, number, number] },
    { id: 'mars-tube', name: 'Perseverance Sample Tube', emoji: '🧪', color: '#10b981', pos: [-1.4, -1.5, 1.0] as [number, number, number] },
    { id: 'jwst-hex', name: 'JWST Beryllium Mirror Segment', emoji: '⬢', color: '#fbbf24', pos: [1.5, 1.3, -0.8] as [number, number, number] },
    { id: 'iss-battery', name: 'ISS Lithium-Ion Orbital Replacement', emoji: '🔋', color: '#a855f7', pos: [-0.5, -1.8, -0.5] as [number, number, number] },
  ];

  const handleRecoverRelic = (id: string, name: string) => {
    if (recoveredIds.includes(id)) return;
    const next = [...recoveredIds, id];
    setRecoveredIds(next);
    addXp(35, `Captured ${name} in Zero-G!`);
    if (next.length === zeroGTargets.length) {
      soundFX.playSuccessChime();
    }
  };

  // ==========================================================================
  // GAME 4: DEEP SPACE SIGNAL DECODER
  // ==========================================================================
  const [targetFreq, setTargetFreq] = useState<number>(4);
  const [targetAmp, setTargetAmp] = useState<number>(35);
  const [userFreq, setUserFreq] = useState<number>(2);
  const [userAmp, setUserAmp] = useState<number>(20);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);

  const isSignalLocked = Math.abs(userFreq - targetFreq) <= 0.3 && Math.abs(userAmp - targetAmp) <= 4;

  useEffect(() => {
    if (activeGame !== 'signal-decoder') return;
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#040710';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const midY = canvas.height / 2;
      phase += 0.05;

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 3) {
        const y = midY + Math.sin((x / canvas.width) * Math.PI * 2 * targetFreq + phase) * targetAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = isSignalLocked ? '#10b981' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 3) {
        const y = midY + Math.sin((x / canvas.width) * Math.PI * 2 * userFreq + phase) * userAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeGame, targetFreq, targetAmp, userFreq, userAmp, isSignalLocked]);

  // ==========================================================================
  // GAME 5: COSMIC TRIVIA GAUNTLET (8 QUESTIONS, STREAK MULTIPLIER, NO XP SHOWN BEFORE ANSWER)
  // ==========================================================================
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [triviaPicked, setTriviaPicked] = useState<number | null>(null);
  const [triviaStreak, setTriviaStreak] = useState<number>(0);
  const [triviaScore, setTriviaScore] = useState<number>(0);

  const currentTrivia = TRIVIA_GAUNTLET_QUESTIONS[triviaIndex] || TRIVIA_GAUNTLET_QUESTIONS[0];

  const gameList: { id: GameMode; label: string; icon: React.ReactNode }[] = [
    { id: 'lunar-lander', label: '1. Lunar Lander (3 Levels)', icon: <Rocket className="h-3.5 w-3.5" /> },
    { id: 'gravity-slingshot', label: '2. Gravity Slingshot (3 Levels)', icon: <Orbit className="h-3.5 w-3.5" /> },
    { id: 'zero-g-rescue', label: '3. 3D Zero-G Rescue', icon: <Box className="h-3.5 w-3.5" /> },
    { id: 'signal-decoder', label: '4. Wave Decoder', icon: <Radio className="h-3.5 w-3.5" /> },
    { id: 'trivia-gauntlet', label: '5. Cosmic Trivia Gauntlet', icon: <HelpCircle className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Clean Segmented Simulator Selector Bar */}
      <div className="holo-panel-3d border border-slate-800/90 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center bg-space-950/90 p-1 rounded-lg border border-slate-800/80 gap-1">
          {gameList.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                soundFX.playClick();
                setActiveGame(g.id);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeGame === g.id
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {g.icon}
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GAME 1: LUNAR TOUCHDOWN SIMULATOR */}
      {activeGame === 'lunar-lander' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 holo-panel-3d border border-slate-800/90 rounded-2xl p-6 items-center">
          <div className="lg:col-span-7 flex flex-col items-center">
            <canvas
              ref={landerCanvasRef}
              width={540}
              height={340}
              className="w-full max-w-[540px] rounded-xl border border-slate-800 shadow-2xl"
            />

            <div className="flex items-center gap-2.5 mt-4">
              <button
                onMouseDown={() => (controlsRef.current.left = true)}
                onMouseUp={() => (controlsRef.current.left = false)}
                onTouchStart={() => (controlsRef.current.left = true)}
                onTouchEnd={() => (controlsRef.current.left = false)}
                className="px-4 py-2 rounded-lg bg-space-900 hover:bg-space-800 border border-slate-800 text-xs text-slate-200"
              >
                ↺ Tilt Left (A / ←)
              </button>
              <button
                onMouseDown={() => {
                  controlsRef.current.thrust = true;
                  if (landerStatus === 'flying') soundFX.startThrusterSound();
                }}
                onMouseUp={() => {
                  controlsRef.current.thrust = false;
                  soundFX.stopThrusterSound();
                }}
                onTouchStart={() => {
                  controlsRef.current.thrust = true;
                }}
                onTouchEnd={() => {
                  controlsRef.current.thrust = false;
                }}
                className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5"
              >
                <Flame className="h-4 w-4" />
                Main Thruster (W / Space)
              </button>
              <button
                onMouseDown={() => (controlsRef.current.right = true)}
                onMouseUp={() => (controlsRef.current.right = false)}
                onTouchStart={() => (controlsRef.current.right = true)}
                onTouchEnd={() => (controlsRef.current.right = false)}
                className="px-4 py-2 rounded-lg bg-space-900 hover:bg-space-800 border border-slate-800 text-xs text-slate-200"
              >
                Tilt Right (D / →) ↻
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3.5">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                Simulator 01 • Multi-Level Descent Physics
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Eagle Lunar Touchdown
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Fly through floating gold <strong>+FUEL pods</strong> in mid-air and touch down on the green pad at under <strong>2.4 m/s</strong>!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setLandingLevel(lvl);
                    startLanderGame();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs border transition-all ${
                    landingLevel === lvl
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                      : 'bg-space-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {lvl === 1 ? 'L1: Wide Pad' : lvl === 2 ? 'L2: Solar Wind' : 'L3: Moving Pad'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'moon', label: 'Moon (1.62g)' },
                { id: 'mars', label: 'Mars (3.71g)' },
                { id: 'europa', label: 'Europa (1.31g)' },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setGravityWorld(w.id as 'moon' | 'mars' | 'europa')}
                  className={`py-1.5 px-2 rounded-lg text-xs border transition-all ${
                    gravityWorld === w.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-space-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="bg-space-950/80 border border-slate-800 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400">FUEL ({landerStats.podsCollected}/2 PODS)</div>
                <div className="text-base font-bold text-amber-400">{landerStats.fuel}%</div>
              </div>
              <div className="bg-space-950/80 border border-slate-800 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400">ALTITUDE</div>
                <div className="text-base font-bold text-cyan-400">{landerStats.altitude} m</div>
              </div>
              <div className="bg-space-950/80 border border-slate-800 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400">DESCENT SPEED</div>
                <div
                  className={`text-base font-bold ${
                    landerStats.vy > 2.4 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {landerStats.vy} m/s
                </div>
              </div>
              <div className="bg-space-950/80 border border-slate-800 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400">LATERAL DRIFT</div>
                <div className="text-base font-bold text-white">{landerStats.vx} m/s</div>
              </div>
            </div>

            {landerStatus === 'won' && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/60 text-xs text-emerald-200">
                🏆 <strong>The Eagle Has Landed!</strong> Soft touchdown achieved (+{80 + landerStats.podsCollected * 25} XP Earned!).
              </div>
            )}
            {landerStatus === 'crashed' && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-400/60 text-xs text-rose-200">
                💥 <strong>Hard Landing!</strong> Fire thrusters earlier to slow vertical speed below 2.4 m/s.
              </div>
            )}

            <button
              onClick={startLanderGame}
              className="micro-btn w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              {landerStatus === 'flying' ? 'Restart Descent' : 'Launch Descent'}
            </button>
          </div>
        </div>
      )}

      {/* GAME 2: GRAVITY SLINGSHOT PUZZLE */}
      {activeGame === 'gravity-slingshot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 holo-panel-3d border border-slate-800/90 rounded-2xl p-6 items-center">
          <div className="lg:col-span-7 flex flex-col items-center">
            <canvas
              ref={slingshotCanvasRef}
              width={540}
              height={340}
              onClick={handleSlingshotCanvasClick}
              className="w-full max-w-[540px] rounded-xl border border-slate-800 shadow-2xl cursor-crosshair"
            />
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              💡 Click anywhere on the starfield canvas to aim your launch vector, or use the sliders!
            </span>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                Simulator 02 • 3-Level Orbital Slingshot
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Gravity Assist Trajectory Lab
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Curve your spacecraft around planetary gravity wells to hit the green Target Gate.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSlingshotLevel(lvl);
                    setSlingshotStatus('aiming');
                    probeRef.current = { x: 60, y: 175, vx: 0, vy: 0, trail: [], active: false };
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs border transition-all ${
                    slingshotLevel === lvl
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                      : 'bg-space-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {lvl === 1 ? 'L1: Jupiter' : lvl === 2 ? 'L2: Binary Worlds' : 'L3: Jupiter + Io'}
                </button>
              ))}
            </div>

            <div className="bg-space-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Launch Angle:</span>
                  <span className="text-cyan-400 font-bold">{launchAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-65}
                  max={65}
                  value={launchAngleDeg}
                  onChange={(e) => {
                    setLaunchAngleDeg(Number(e.target.value));
                    setSlingshotStatus('aiming');
                    probeRef.current.active = false;
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Injection Velocity:</span>
                  <span className="text-amber-400 font-bold">{launchPower}%</span>
                </div>
                <input
                  type="range"
                  min={35}
                  max={100}
                  value={launchPower}
                  onChange={(e) => {
                    setLaunchPower(Number(e.target.value));
                    setSlingshotStatus('aiming');
                    probeRef.current.active = false;
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {slingshotStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/60 text-xs text-emerald-200">
                🎯 <strong>Slingshot Bullseye!</strong> Gravity assist trajectory locked (+90 XP Earned!).
              </div>
            )}
            {slingshotStatus === 'missed' && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-400/60 text-xs text-amber-200">
                💡 <strong>Tip:</strong> For Level 1, try Angle <strong>-32°</strong> and Velocity <strong>72%</strong>.
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={fireSlingshotProbe}
                className="micro-btn flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Rocket className="h-4 w-4" />
                Launch Probe
              </button>
              <button
                onClick={() => {
                  probeRef.current = { x: 60, y: 175, vx: 0, vy: 0, trail: [], active: false };
                  setSlingshotStatus('aiming');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-space-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: 3D ZERO-G SATELLITE RESCUE */}
      {activeGame === 'zero-g-rescue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 holo-panel-3d border border-slate-800/90 rounded-2xl p-6 items-center">
          <div className="lg:col-span-7 h-[370px] rounded-xl overflow-hidden border border-slate-800 bg-space-950 relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <color attach="background" args={['#040710']} />
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 12, 10]} intensity={1.5} />
              <Stars radius={60} count={1200} factor={3} fade />
              <Physics gravity={[0, 0, 0]}>
                <ZeroGBoundaryWalls size={8} />
                {zeroGTargets.map((item) => (
                  <ZeroGSatelliteItem
                    key={item.id}
                    name={item.name}
                    emoji={item.emoji}
                    color={item.color}
                    initialPos={item.pos}
                    impulseKey={impulseKey}
                    isRecovered={recoveredIds.includes(item.id)}
                    onRecover={() => handleRecoverRelic(item.id, item.name)}
                  />
                ))}
              </Physics>
              <OrbitControls enablePan={false} />
            </Canvas>
            <div className="absolute bottom-3 left-3 bg-space-950/85 border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-300 pointer-events-none">
              Click tumbling 3D hardware in zero gravity to capture
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3.5">
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold">
                Simulator 03 • Newton’s First Law in 3D
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                3D Zero-G Hardware Rescue ({recoveredIds.length}/{zeroGTargets.length})
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Click tumbling artifacts in the 3D arena to capture them, or fire a thruster pulse to scatter them across the containment cage!
              </p>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {zeroGTargets.map((t) => {
                const done = recoveredIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      done
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-space-950/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>
                      {t.emoji} {t.name}
                    </span>
                    <span className="font-mono text-[10px]">{done ? '✓ Captured (+35 XP)' : 'Drifting'}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundFX.playScanPing();
                  setImpulseKey((k) => k + 1);
                }}
                className="micro-btn flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Zap className="h-4 w-4" />
                Fire Thruster Wave
              </button>
              <button
                onClick={() => setRecoveredIds([])}
                className="micro-btn px-4 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME 4: DEEP SPACE SIGNAL DECODER */}
      {activeGame === 'signal-decoder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 holo-panel-3d border border-slate-800/90 rounded-2xl p-6 items-center">
          <div className="lg:col-span-7 flex justify-center">
            <canvas
              ref={waveCanvasRef}
              width={540}
              height={280}
              className="w-full max-w-[540px] rounded-xl border border-slate-800 shadow-2xl"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                Simulator 04 • Deep Space Network Telemetry
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Radio Wave Frequency Decoder
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tune your receiver’s <strong>Frequency</strong> and <strong>Amplitude</strong> until your cyan wave locks onto the dashed amber carrier wave from Voyager 1.
              </p>
            </div>

            <div className="bg-space-950/80 border border-slate-800 rounded-xl p-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Frequency:</span>
                  <span className="text-cyan-400 font-bold">{userFreq.toFixed(1)} GHz</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={0.1}
                  value={userFreq}
                  onChange={(e) => setUserFreq(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Signal Amplitude:</span>
                  <span className="text-amber-400 font-bold">{userAmp} dB</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={75}
                  step={1}
                  value={userAmp}
                  onChange={(e) => setUserAmp(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {isSignalLocked ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-400/60 space-y-2.5">
                <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Signal Locked: Voyager-1 Telemetry Decoded! (+75 XP Earned!)
                </div>
                <button
                  onClick={() => {
                    unlockBadge('badge-signal-decoder');
                    addXp(75, 'Decoded Deep Space Telemetry Wave!');
                    setTargetFreq(+(1.5 + Math.floor(Math.random() * 50) / 10).toFixed(1));
                    setTargetAmp(20 + Math.floor(Math.random() * 50));
                  }}
                  className="micro-btn w-full py-2 rounded-lg bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Trophy className="h-4 w-4" />
                  Lock Next Mystery Signal
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-space-950/60 border border-slate-800 text-xs text-slate-400">
                Align both sliders until the solid wave overlaps the dashed wave.
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 5: COSMIC TRIVIA GAUNTLET (NO XP SHOWN ON OPTIONS BEFORE ANSWERING!) */}
      {activeGame === 'trivia-gauntlet' && (
        <div className="holo-panel-3d border border-slate-800/90 rounded-2xl p-6 max-w-3xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                Simulator 05 • Astrophysics Challenge ({triviaIndex + 1} of {TRIVIA_GAUNTLET_QUESTIONS.length})
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                COSMOSIS Trivia Gauntlet
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                🔥 Streak: {triviaStreak}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                ✓ Correct: {triviaScore}
              </span>
            </div>
          </div>

          <p className="text-base font-semibold text-white leading-snug">
            {currentTrivia.question}
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {currentTrivia.options.map((opt, idx) => {
              const isChosen = triviaPicked === idx;
              const isCorrect = idx === currentTrivia.correctIndex;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (triviaPicked !== null) return;
                    setTriviaPicked(idx);
                    if (isCorrect) {
                      soundFX.playSuccessChime();
                      const nextStreak = triviaStreak + 1;
                      setTriviaStreak(nextStreak);
                      setTriviaScore((s) => s + 1);
                      const reward = (currentTrivia.xpReward || 40) + nextStreak * 5;
                      addXp(reward, `Trivia Gauntlet Streak x${nextStreak}!`);
                    } else {
                      soundFX.playAlert();
                      setTriviaStreak(0);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                    triviaPicked === null
                      ? 'bg-space-950 border-slate-800 hover:border-cyan-400/60 text-slate-100'
                      : isChosen && isCorrect
                      ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100 font-semibold'
                      : isChosen && !isCorrect
                      ? 'bg-rose-950/50 border-rose-400 text-rose-100'
                      : isCorrect
                      ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
                      : 'bg-space-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{opt}</span>
                  {triviaPicked !== null && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {triviaPicked !== null && (
            <div className="pt-2 space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-cyan-950/35 border border-cyan-500/35 text-xs text-cyan-100 leading-relaxed">
                <div className="font-mono font-bold text-emerald-300 mb-1">
                  {triviaPicked === currentTrivia.correctIndex
                    ? `✅ Correct! +${(currentTrivia.xpReward || 40) + triviaStreak * 5} Space XP Earned!`
                    : '💡 Not quite! Here is the science explanation:'}
                </div>
                {currentTrivia.explanation}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setTriviaIndex((prev) => (prev + 1) % TRIVIA_GAUNTLET_QUESTIONS.length);
                    setTriviaPicked(null);
                  }}
                  className="micro-btn px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5"
                >
                  <span>Next Challenge Question</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
