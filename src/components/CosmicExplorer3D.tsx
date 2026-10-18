import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Ring, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { SOLAR_SYSTEM_PLANETS, SPACECRAFT_FLEET } from '../data/spaceAcademyData';
import { PlanetData, SpacecraftData, SpacecraftHotspot } from '../types/academy';
import { useAcademyStore } from '../store/useAcademyStore';
import { soundFX } from '../utils/soundEffects';
import { getPlanetTextures } from '../utils/planetTextures';
import { TiltCard3D } from './TiltCard3D';
import {
  Orbit,
  Rocket,
  Sparkles,
  Play,
  Pause,
  HelpCircle,
  CheckCircle2,
  Scale,
  Eye,
  EyeOff,
  Info,
  Layers,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Crosshair,
  ShieldAlert,
  Minimize2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// --- Planet-Specific Orbital Debris, Meteoroid & Cleanup Telemetry Database ---
interface PlanetaryDebrisInfo {
  trackedDebrisCount: string;
  microFragmentsEstimate: string;
  meteoroidFluxPerDay: string;
  avgImpactVelocity: string;
  riskLevel: 'EXTREME (KESSLER RISK)' | 'MODERATE' | 'NATURAL BOLIDE FLUX' | 'HIGH RADIATION / COMETARY';
  orbitalObjectsSummary: string;
  notableEvents: string[];
  mitigationAndDefense: { title: string; detail: string }[];
}

const PLANET_DEBRIS_DATA: Record<string, PlanetaryDebrisInfo> = {
  sun: {
    trackedDebrisCount: '12+ Heliocentric Probes & Upper Stages',
    microFragmentsEstimate: 'Zodiacal Dust Cloud (Billions of tons of comet/asteroid dust)',
    meteoroidFluxPerDay: 'Thousands of "Sungrazer" Comets & Meteoroids vaporized daily',
    avgImpactVelocity: '617.7 km/s (Escape/Infall Velocity at Photosphere)',
    riskLevel: 'NATURAL BOLIDE FLUX',
    orbitalObjectsSummary:
      'The Sun acts as the ultimate gravitational incinerator of the Solar System. Over 5,000 Kreutz Sungrazer comets have been watched by SOHO vaporizing in the solar corona, while human probes like Parker Solar Probe and Helios 1 & 2 orbit through dense interplanetary dust.',
    notableEvents: [
      'Parker Solar Probe survives thousands of hypervelocity dust impacts at 192 km/s using a reinforced carbon-composite Whipple shield.',
      'The Poynting-Robertson effect causes microscopic space dust across the Solar System to slowly spiral inward into the Sun.',
    ],
    mitigationAndDefense: [
      { title: 'Solar Disposal Trajectories', detail: 'End-of-life deep-space probes are placed in stable heliocentric orbits so they never contaminate potentially habitable worlds.' },
      { title: 'Coronal Mass Ejection (CME) Early Warning', detail: 'SOHO, STEREO, and DSCOVR monitor solar storms that swell Earth’s upper atmosphere and drag low-Earth satellites out of orbit.' },
    ],
  },
  mercury: {
    trackedDebrisCount: '2 Impacted Spacecraft (MESSENGER & Mariner 10 flyby)',
    microFragmentsEstimate: 'Dense Micrometeoroid Exosphere Stream',
    meteoroidFluxPerDay: '8x higher hypervelocity dust flux than Earth per km²',
    avgImpactVelocity: '42 to 85 km/s (Boosted by the Sun’s deep gravity well)',
    riskLevel: 'NATURAL BOLIDE FLUX',
    orbitalObjectsSummary:
      'With zero atmospheric cushion and strong solar gravity accelerating incoming cometary dust, Mercury’s surface is relentlessly sandblasted by hypervelocity micrometeoroids—literally knocking sodium and oxygen atoms out of the rocks to form Mercury’s comet-like tail!',
    notableEvents: [
      'On April 30, 2015, NASA’s MESSENGER probe exhausted its propellant and intentionally impacted Mercury at 14,000 km/h (3.91 km/s), carving a new 16-meter human-made crater near Janáček crater.',
      'Comet Encke’s debris stream regularly pelts Mercury, triggering measurable spikes in calcium and sodium in its tenuous exosphere.',
    ],
    mitigationAndDefense: [
      { title: 'BepiColombo Ceramic Thermal & Dust Shielding', detail: 'Multi-layer Nextel and Kevlar blankets protect ESA/JAXA’s BepiColombo against both 430°C heat and 60 km/s dust particles.' },
    ],
  },
  venus: {
    trackedDebrisCount: '28+ Historic Landers, Atmospheric Probes & Orbiters',
    microFragmentsEstimate: 'Zero small surface meteors (Crushed by 92-bar air!)',
    meteoroidFluxPerDay: 'Small meteors explode high in the dense CO₂ atmosphere',
    avgImpactVelocity: '25 to 45 km/s at atmospheric entry',
    riskLevel: 'MODERATE',
    orbitalObjectsSummary:
      'Across the 1960s–1980s, over two dozen Soviet Venera and Vega craft and NASA’s Pioneer Venus probes entered Venus’s atmosphere. Meanwhile, Venus’s 92-bar atmosphere acts like a brick wall: any meteoroid smaller than ~1 kilometer across is crushed and vaporized before it can make a crater!',
    notableEvents: [
      'There are almost NO impact craters smaller than 3 kilometers wide anywhere on Venus because smaller asteroids shatter in the super-dense air.',
      'Magellan (NASA) was intentionally commanded to plunge into Venus’s atmosphere in October 1994 to prevent long-term orbital clutter.',
    ],
    mitigationAndDefense: [
      { title: 'Atmospheric Aerobraking & Disposal', detail: 'Venus’s thick upper atmosphere naturally decays low-altitude orbital debris within months via aerodynamic drag.' },
    ],
  },
  earth: {
    trackedDebrisCount: '36,500+ Tracked Debris Objects (>10 cm)',
    microFragmentsEstimate: '1,000,000+ objects (1–10 cm) & 130 Million flecks (>1 mm)',
    meteoroidFluxPerDay: '48.5 Metric Tons of natural meteoritic dust & bolides/day',
    avgImpactVelocity: '10.2 km/s (36,700 km/h) orbital collision speed!',
    riskLevel: 'EXTREME (KESSLER RISK)',
    orbitalObjectsSummary:
      'Since Sputnik 1 in 1957, humanity has launched over 19,000 satellites. Today, Low Earth Orbit (LEO, 400–1,200 km) is crowded with spent rocket stages, shattered anti-satellite test fragments, and paint flecks moving 10 times faster than a rifle bullet—where even a 1-cm aluminum bolt hits with the kinetic energy of a exploding hand grenade!',
    notableEvents: [
      '2009 Iridium-33 & Cosmos-2251 Collision: Two satellites slammed into each other at 42,120 km/h (11.7 km/s) 789 km above Siberia, spawning 2,300+ trackable shrapnel fragments.',
      'NASA Scientist Donald Kessler warned in 1978 of "The Kessler Syndrome"—a runaway chain reaction where one collision creates shrapnel that destroys more satellites, potentially locking humanity on Earth!',
      'The International Space Station has had to fire its thrusters over 38 times since 1999 ("Debris Avoidance Maneuvers") to dodge tracked space junk!',
    ],
    mitigationAndDefense: [
      { title: 'ClearSpace-1 & Astroscale Active Debris Removal', detail: 'Robotic capture spacecraft using 4-armed claws, magnetic docking plates, and harpoons/nets to grab defunct satellites and drag them into atmospheric burn-up.' },
      { title: 'FCC & ESA "5-Year Deorbit Rule"', detail: 'New regulations require low-Earth satellites to deorbit within 5 years of mission end (down from 25 years) using thrusters or deployable drag sails.' },
      { title: 'Ground-Based Laser Broom & Space Fence Radar', detail: 'Using pulsed lasers to ablate a microscopic puff of plasma on small debris, slowing its perigee so Earth’s upper atmosphere burns it up harmlessly.' },
    ],
  },
  mars: {
    trackedDebrisCount: '18+ Orbiters, 11 Landers/Rovers & 7,119 kg of Human Hardware',
    microFragmentsEstimate: 'Parachutes, Heat Shields, Sky-Cranes & Phobos Dust Torus',
    meteoroidFluxPerDay: '200+ new crater-forming meteoroid impacts every year!',
    avgImpactVelocity: '14 to 24 km/s (Thin 1% atmosphere offers little protection)',
    riskLevel: 'MODERATE',
    orbitalObjectsSummary:
      'Humans have left over 7 metric tons of hardware on and around Mars—including discarded heat shields, supersonic parachutes, crashed landers, and active orbiters (MRO, MAVEN, Mars Express, Odyssey). Because Mars orbits right next to the main Asteroid Belt and has an atmosphere 100x thinner than Earth’s, basketball-sized meteors regularly blast fresh craters on the ground!',
    notableEvents: [
      'In April 2022, the Ingenuity Mars Helicopter flew over and photographed the shattered backshell and supersonic parachute that delivered Perseverance to Jezero Crater.',
      'On December 24, 2021, a meteoroid slammed into Mars and blasted a 150-meter crater, throwing boulder-sized chunks of subsurface water ice across the ground—detected live by NASA’s InSight seismometer!',
    ],
    mitigationAndDefense: [
      { title: 'COSPAR Planetary Protection Protocols', detail: 'Strict sterilization and orbital lifetime rules ensure inactive Mars orbiters cannot crash into potentially habitable ice-rich zones for at least 50 years.' },
      { title: 'HiRISE & InSight Seismic Impact Tracking', detail: 'Orbital cameras and surface seismometers map fresh meteoroid impact rates to design shielded habitats for future Artemis/Mars astronauts.' },
    ],
  },
  jupiter: {
    trackedDebrisCount: '9 Spacecraft Visited (Juno Active, Galileo Disposed)',
    microFragmentsEstimate: 'Intense Gossamer Ring Micrometeoroids & Io Plasma Torus',
    meteoroidFluxPerDay: 'Highest giant comet/asteroid impact rate in the Solar System!',
    avgImpactVelocity: '60+ km/s (216,000 km/h due to massive 2.53g gravity well)',
    riskLevel: 'HIGH RADIATION / COMETARY',
    orbitalObjectsSummary:
      'Jupiter is the gravitational vacuum cleaner of the Solar System. Its immense mass accelerates passing comets and asteroids to over 60 km/s. To protect Europa’s pristine subsurface ocean from Earth bacteria, NASA intentionally plunged the Galileo probe into Jupiter’s crushing atmosphere at mission end!',
    notableEvents: [
      'July 1994 Comet Shoemaker-Levy 9 Impact: Torn into 21 fragments ("The String of Pearls") by Jupiter’s tidal gravity, the pieces slammed into Jupiter at 60 km/s with 6,000,000 megatons of energy—leaving dark Earth-sized fireballs!',
      'Amateur astronomers have caught at least 9 more bright bolide impact flashes in Jupiter’s clouds between 2009 and 2024.',
    ],
    mitigationAndDefense: [
      { title: 'Planetary Protection Atmospheric Disposal', detail: 'Both Galileo (2003) and Juno (at mission end) are steered into Jupiter’s atmosphere so they can never crash into and contaminate the ocean moon Europa.' },
      { title: 'Titanium Radiation Vaults', detail: 'Juno’s flight computers are sealed inside a 1-cm-thick titanium armor vault weighing 172 kg to survive Jupiter’s lethal electron radiation belts.' },
    ],
  },
  saturn: {
    trackedDebrisCount: '4 Spacecraft Visited (Cassini Disposed, Huygens on Titan)',
    microFragmentsEstimate: 'Billions of Water-Ice Ring Boulders & Hypervelocity Dust',
    meteoroidFluxPerDay: 'Continuous micrometeoroid bombardment across the 282,000-km rings',
    avgImpactVelocity: '36 km/s orbital ring-crossing speed',
    riskLevel: 'HIGH RADIATION / COMETARY',
    orbitalObjectsSummary:
      'Saturn’s main rings are a natural hypervelocity debris field spanning 282,000 km! During Cassini’s daring "Grand Finale" in 2017, it dove 22 times through the narrow 2,000-km gap between Saturn and its innermost ring at 122,000 km/h, using its high-gain dish antenna as a physical shield against smoke-sized ice grains!',
    notableEvents: [
      'September 15, 2017: With propellant nearly gone, NASA plunged Cassini into Saturn’s golden clouds at 113,000 km/h so it could never contaminate the hydrothermal ocean moon Enceladus or methane-rich Titan.',
      'Meteoroids hitting Saturn’s rings kick up sunlit clouds of ice dust that Cassini photographed casting long shadows across the B Ring.',
    ],
    mitigationAndDefense: [
      { title: 'High-Gain Antenna Whipple Shielding', detail: 'During ring-plane crossings, spacecraft turn their 4-meter metal radio dish forward to absorb hypervelocity ice grain impacts.' },
    ],
  },
  uranus: {
    trackedDebrisCount: '1 Flyby Spacecraft (Voyager 2, Jan 1986)',
    microFragmentsEstimate: '13 Dark, Dusty Narrow Rings & Cordelia/Ophelia Shepherd Moons',
    meteoroidFluxPerDay: 'Kuiper Belt & Centaur cometary dust infall',
    avgImpactVelocity: '22 km/s',
    riskLevel: 'NATURAL BOLIDE FLUX',
    orbitalObjectsSummary:
      'Uranus is encircled by 13 remarkably dark, narrow rings discovered in 1977 when they blinked out the light of a background star. Unlike Saturn’s bright water-ice rings, Uranus’s rings are made of radiation-darkened organic boulders and dust.',
    notableEvents: [
      'Uranus’s inner moons (Cupid, Belinda, Perdita, Portia) orbit in such a tightly packed "orbital traffic jam" that models show they will collide and shatter into new rings within a few million years!',
    ],
    mitigationAndDefense: [
      { title: 'Ring-Plane Hazard Mapping', detail: 'JWST infrared imaging maps faint dust sheets between Uranus’s inner moons to chart safe corridors for the upcoming 2030s Uranus Orbiter and Probe.' },
    ],
  },
  neptune: {
    trackedDebrisCount: '1 Flyby Spacecraft (Voyager 2, Aug 1989)',
    microFragmentsEstimate: '5 Dusty Rings (Adams, Le Verrier, Galle) & Captured Kuiper Debris',
    meteoroidFluxPerDay: 'Frequent Kuiper Belt comet captures & impacts',
    avgImpactVelocity: '24 km/s',
    riskLevel: 'NATURAL BOLIDE FLUX',
    orbitalObjectsSummary:
      'Orbiting at the inner frontier of the Kuiper Belt (30.1 AU), Neptune’s gravity regularly Perturbs and captures icy comets. When Neptune captured its giant retrograde moon Triton billions of years ago, Triton’s chaotic initial orbit shattered and scattered Neptune’s original inner moon system into rubble!',
    notableEvents: [
      'Carbon monoxide abundance in Neptune’s upper stratosphere provides forensic evidence that a 2-km-wide comet slammed into Neptune within the last ~200 years!',
    ],
    mitigationAndDefense: [
      { title: 'Deep Space Optical & Radar Tracking', detail: 'Monitoring Kuiper Belt Objects (KBOs) and Centaurs whose orbits cross the giant planets.' },
    ],
  },
};

// --- Procedural Craggy, Pitted Asteroid Geometry with Fractal Noise Displacement ---
function createCraggyAsteroidGeometry(seed: number): THREE.BufferGeometry {
  const geo = new THREE.DodecahedronGeometry(1, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const len = v.length();
    // Multi-frequency spherical surface deformation (harmonic crags and crater pits)
    const n1 = Math.sin(v.x * 3.5 + seed) * Math.cos(v.y * 3.5) * Math.sin(v.z * 3.5);
    const n2 = Math.sin(v.x * 8 + seed * 2) * Math.cos(v.z * 8) * 0.45;
    const crater = Math.pow(Math.max(0, Math.sin(v.y * 2.5 + seed)), 3) * -0.25; // Impact depression
    const disp = 1 + n1 * 0.24 + n2 * 0.12 + crater;
    v.setLength(len * disp);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// Atmospheric Rayleigh Scattering & Greenhouse haze profiles for planets
const ATMOSPHERE_PROFILES: Record<string, { color: string; scale: number; opacity: number }> = {
  earth: { color: '#38bdf8', scale: 1.045, opacity: 0.38 }, // Ethereal nitrogen-oxygen blue
  venus: { color: '#fbbf24', scale: 1.035, opacity: 0.45 }, // Thick golden sulfuric acid haze
  mars: { color: '#f97316', scale: 1.025, opacity: 0.26 },  // Thin butterscotch iron dust fringe
  jupiter: { color: '#fdba74', scale: 1.025, opacity: 0.22 }, // Warm ivory-peach ammonia fringe
  saturn: { color: '#fde047', scale: 1.022, opacity: 0.2 },  // Soft golden haze
  uranus: { color: '#22d3ee', scale: 1.035, opacity: 0.35 }, // Vibrant aquamarine methane halo
  neptune: { color: '#3b82f6', scale: 1.035, opacity: 0.38 }, // Deep cobalt-azure methane glow
};

// --- Realistic 3D Asteroid Belt with Pitted Craggy Rocks & Chaotic Tumbling ---
const AsteroidBelt3D: React.FC<{ timeSpeed: number }> = ({ timeSpeed }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const geometries = useMemo(
    () => [
      createCraggyAsteroidGeometry(1),
      createCraggyAsteroidGeometry(3),
      createCraggyAsteroidGeometry(7),
      createCraggyAsteroidGeometry(12),
      createCraggyAsteroidGeometry(19),
    ],
    []
  );

  const asteroids = useMemo(() => {
    return Array.from({ length: 160 }).map((_, i) => {
      const angle = (i / 160) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const radius = 9.85 + (Math.random() - 0.5) * 0.95;
      const y = (Math.random() - 0.5) * 0.45;
      const size = 0.035 + Math.random() * 0.055;
      const geoIndex = i % geometries.length;
      // Tumbling physics rotation speeds
      const rotSpeed = [
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
      ] as [number, number, number];
      // Carbonaceous & silicate rock tone variations
      const colors = ['#64748b', '#475569', '#334155', '#52525b', '#71717a'];
      const color = colors[i % colors.length];

      return {
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
        size,
        geoIndex,
        rotSpeed,
        color,
      };
    });
  }, [geometries]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08 * timeSpeed;
      // Animate individual tumbling asteroids
      groupRef.current.children.forEach((child, idx) => {
        const ast = asteroids[idx];
        if (ast) {
          child.rotation.x += delta * ast.rotSpeed[0] * timeSpeed;
          child.rotation.y += delta * ast.rotSpeed[1] * timeSpeed;
          child.rotation.z += delta * ast.rotSpeed[2] * timeSpeed;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {asteroids.map((ast, idx) => (
        <mesh
          key={idx}
          position={ast.pos}
          geometry={geometries[ast.geoIndex]}
          scale={[ast.size, ast.size, ast.size]}
        >
          <meshStandardMaterial color={ast.color} roughness={0.92} metalness={0.18} />
        </mesh>
      ))}
    </group>
  );
};

// --- Realistic Orbital Debris, Incandescent Bolides & Tracers (Zajno Style!) ---
const PlanetCloseUpDebrisAndMeteors: React.FC<{
  planet: PlanetData;
  showDebris: boolean;
  showMeteors: boolean;
  showTracers: boolean;
}> = ({ planet, showDebris, showMeteors, showTracers }) => {
  const debrisGroupRef = useRef<THREE.Group>(null!);
  const meteorGroupRef = useRef<THREE.Group>(null!);
  const tracerGroupRef = useRef<THREE.Group>(null!);

  const debrisCount = planet.id === 'earth' ? 160 : planet.id === 'mars' || planet.id === 'saturn' ? 85 : 55;

  const debrisItems = useMemo(() => {
    return Array.from({ length: debrisCount }).map((_, i) => {
      const r = 1.75 + (i % 7) * 0.18 + Math.random() * 0.25;
      const theta = (i / debrisCount) * Math.PI * 2;
      const phi = (Math.random() - 0.5) * (planet.id === 'earth' ? 2.2 : 1.1);
      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(phi);
      const z = r * Math.sin(theta) * Math.cos(phi);
      const isRedHazard = i % 3 === 0;
      const size = isRedHazard ? 0.028 : 0.02;
      return { pos: [x, y, z] as [number, number, number], isRedHazard, size };
    });
  }, [debrisCount, planet.id]);

  const tracerOrbits = useMemo(() => {
    const inclinations =
      planet.id === 'earth'
        ? [
            { radius: 1.78, rot: [0.45, 0.2, 0.1] as [number, number, number], color: '#ff3b21', opacity: 0.75 },
            { radius: 1.92, rot: [-0.85, 0.4, 0.3] as [number, number, number], color: '#ffffff', opacity: 0.45 },
            { radius: 2.12, rot: [1.15, -0.3, 0.5] as [number, number, number], color: '#ff3b21', opacity: 0.55 },
            { radius: 2.45, rot: [0.08, 0, 0] as [number, number, number], color: '#38bdf8', opacity: 0.4 },
          ]
        : [
            { radius: 1.85, rot: [0.35, 0.2, 0] as [number, number, number], color: '#ff3b21', opacity: 0.65 },
            { radius: 2.15, rot: [-0.7, 0.5, 0.2] as [number, number, number], color: '#ffffff', opacity: 0.4 },
            { radius: 2.45, rot: [1.2, 0.1, -0.3] as [number, number, number], color: '#38bdf8', opacity: 0.35 },
          ];

    return inclinations.map((inc) => {
      const pts: THREE.Vector3[] = [];
      for (let a = 0; a <= 64; a++) {
        const ang = (a / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(ang) * inc.radius, 0, Math.sin(ang) * inc.radius));
      }
      return { ...inc, pts };
    });
  }, [planet.id]);

  // High-velocity incandescent bolides
  const meteors = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      offset: i * 1.4,
      speed: 1.8 + (i % 3) * 0.6,
      yStart: 2.2 - i * 0.65,
      zPlane: (i % 2 === 0 ? 1 : -1) * (1.55 + (i % 3) * 0.3),
      incline: (i - 3) * 0.18,
    }));
  }, []);

  useFrame((state, delta) => {
    if (debrisGroupRef.current) {
      debrisGroupRef.current.rotation.y += delta * 0.24;
      debrisGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
    if (tracerGroupRef.current) {
      tracerGroupRef.current.rotation.y -= delta * 0.08;
    }
    if (meteorGroupRef.current) {
      const t = state.clock.elapsedTime;
      meteorGroupRef.current.children.forEach((child, idx) => {
        const m = meteors[idx];
        if (!m) return;
        const progress = ((t * m.speed + m.offset) % 6) - 3;
        child.position.set(progress * 1.4, m.yStart - progress * m.incline, m.zPlane);
      });
    }
  });

  return (
    <group>
      {/* 1. ORBITAL STATION TRACER RINGS */}
      {showTracers && (
        <group ref={tracerGroupRef}>
          {tracerOrbits.map((orb, idx) => (
            <group key={idx} rotation={orb.rot}>
              <Line
                points={orb.pts}
                color={orb.color}
                lineWidth={1.2}
                transparent
                opacity={orb.opacity}
              />
            </group>
          ))}
        </group>
      )}

      {/* 2. 3D SPACE DEBRIS: SATELLITE SOLAR SHARDS, ROCKET CASINGS & SHRAPNEL */}
      {showDebris && (
        <group ref={debrisGroupRef}>
          {debrisItems.map((d, i) => (
            <group key={i} position={d.pos}>
              {i % 4 === 0 ? (
                // Solar array shard (blue-gold reflective panel)
                <mesh rotation={[i * 0.5, i * 0.3, i * 0.2]}>
                  <boxGeometry args={[d.size * 2.2, d.size * 1.1, d.size * 0.15]} />
                  <meshStandardMaterial
                    color="#1e3a8a"
                    metalness={0.88}
                    roughness={0.2}
                    emissive="#1d4ed8"
                    emissiveIntensity={0.25}
                  />
                </mesh>
              ) : i % 4 === 1 ? (
                // Spent rocket stage cylinder
                <mesh rotation={[i * 0.2, 0, i * 0.6]}>
                  <cylinderGeometry args={[d.size * 0.5, d.size * 0.5, d.size * 2, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
                </mesh>
              ) : (
                // Shrapnel fragment with pulsing hazard beacon
                <mesh>
                  <octahedronGeometry args={[d.size, 0]} />
                  <meshStandardMaterial
                    color={d.isRedHazard ? '#ff3b21' : '#94a3b8'}
                    emissive={d.isRedHazard ? '#ff3b21' : '#000000'}
                    emissiveIntensity={d.isRedHazard ? 0.85 : 0}
                    roughness={0.4}
                  />
                </mesh>
              )}
            </group>
          ))}
        </group>
      )}

      {/* 3. HIGH-VELOCITY INCANDESCENT BOLIDE FIREBALLS */}
      {showMeteors && (
        <group ref={meteorGroupRef}>
          {meteors.map((_, idx) => (
            <group key={idx} rotation={[0, 0, -0.15]}>
              {/* White-Hot Incandescent Core */}
              <mesh position={[0.42, 0, 0]}>
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              {/* Surrounding Ionization Plasma Aura */}
              <mesh position={[0.42, 0, 0]}>
                <sphereGeometry args={[0.075, 16, 16]} />
                <meshBasicMaterial color="#fef08a" transparent opacity={0.65} />
              </mesh>
              {/* Glowing Aerodynamic Plasma Shockwave Cone */}
              <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <coneGeometry args={[0.055, 0.85, 12]} />
                <meshBasicMaterial color="#ff3b21" transparent opacity={0.75} side={THREE.DoubleSide} />
              </mesh>
              {/* Secondary Outer Thermal Wake */}
              <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <coneGeometry args={[0.085, 1.25, 8]} />
                <meshBasicMaterial color="#ea580c" transparent opacity={0.35} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

// --- Photorealistic Textured 3D Planet Sphere with PBR Specular & Rayleigh Atmosphere ---
interface TexturedPlanetSphereProps {
  planet: PlanetData;
  radius: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const TexturedPlanetSphere: React.FC<TexturedPlanetSphereProps> = ({
  planet,
  radius,
  isSelected = false,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const coronaRef = useRef<THREE.Mesh>(null!);
  const coronaOuterRef = useRef<THREE.Mesh>(null!);
  const prominencesRef = useRef<THREE.Group>(null!);
  const moonGroupRef = useRef<THREE.Group>(null!);

  const textures = useMemo(() => getPlanetTextures(planet.id), [planet.id]);
  const moonTextures = useMemo(
    () => (planet.id === 'earth' ? getPlanetTextures('moon') : null),
    [planet.id]
  );
  const atmosphere = ATMOSPHERE_PROFILES[planet.id];

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (planet.id === 'sun' ? 0.22 : 0.42);
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.58;
    }
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.035;
      coronaRef.current.scale.set(pulse, pulse, pulse);
    }
    if (coronaOuterRef.current) {
      const outerPulse = 1 + Math.cos(state.clock.elapsedTime * 1.8) * 0.055;
      coronaOuterRef.current.scale.set(outerPulse, outerPulse, outerPulse);
    }
    if (prominencesRef.current) {
      prominencesRef.current.rotation.y += delta * 0.35;
      prominencesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += delta * 0.65;
    }
  });

  return (
    <group>
      {/* Main Celestial Body Surface Mesh */}
      <mesh
        ref={meshRef}
        rotation={[
          planet.id === 'uranus' ? Math.PI / 2.1 : planet.id === 'saturn' ? 0.42 : 0.15,
          0,
          0,
        ]}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        {planet.id === 'sun' ? (
          <meshBasicMaterial map={textures.map} />
        ) : (
          <meshStandardMaterial
            map={textures.map}
            bumpMap={textures.bumpMap}
            bumpScale={textures.bumpMap ? (planet.id === 'earth' ? 0.055 : planet.id === 'mars' ? 0.065 : 0.035) : 0}
            roughnessMap={planet.id === 'earth' ? textures.specularMap : undefined}
            roughness={planet.id === 'earth' ? 0.65 : 0.78}
            metalness={planet.id === 'earth' ? 0.12 : 0.08}
            emissive={isSelected ? planet.color : '#000000'}
            emissiveIntensity={isSelected ? 0.15 : 0}
          />
        )}
      </mesh>

      {/* Earth's Swirling Atmospheric Cloud Layer */}
      {planet.id === 'earth' && textures.cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[radius * 1.025, 48, 48]} />
          <meshStandardMaterial
            map={textures.cloudsMap}
            transparent
            opacity={0.88}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Atmospheric Rayleigh Scattering & Limb Glow for Atmospheric Planets */}
      {atmosphere && (
        <mesh>
          <sphereGeometry args={[radius * atmosphere.scale, 48, 48]} />
          <meshBasicMaterial
            color={atmosphere.color}
            transparent
            opacity={atmosphere.opacity}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* The Sun: Multi-Stage Corona, Inner Chromosphere & Magnetic Solar Prominences */}
      {planet.id === 'sun' && (
        <>
          {/* Inner Chromosphere Glow */}
          <mesh ref={coronaRef}>
            <sphereGeometry args={[radius * 1.06, 48, 48]} />
            <meshBasicMaterial
              color="#fef08a"
              transparent
              opacity={0.38}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Outer Coronal Plasma Halo */}
          <mesh ref={coronaOuterRef}>
            <sphereGeometry args={[radius * 1.25, 48, 48]} />
            <meshBasicMaterial
              color="#f59e0b"
              transparent
              opacity={0.24}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Magnetic Solar Prominence Loops */}
          <group ref={prominencesRef}>
            <mesh position={[radius * 0.95, radius * 0.25, 0]} rotation={[0, 0, 0.4]}>
              <torusGeometry args={[radius * 0.18, 0.022, 12, 32, Math.PI]} />
              <meshBasicMaterial color="#ffedd5" transparent opacity={0.85} />
            </mesh>
            <mesh position={[-radius * 0.9, -radius * 0.35, 0]} rotation={[0, 0, -1.8]}>
              <torusGeometry args={[radius * 0.22, 0.024, 12, 32, Math.PI]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, radius * 0.92, -radius * 0.2]} rotation={[1.2, 0, 0]}>
              <torusGeometry args={[radius * 0.15, 0.02, 12, 32, Math.PI]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.75} />
            </mesh>
          </group>
        </>
      )}

      {/* Saturn & Uranus Rings with Cassini Division */}
      {planet.hasRings && (
        <group rotation={[planet.id === 'uranus' ? 1.45 : 1.15, 0.2, 0]}>
          {planet.id === 'saturn' && textures.ringMap ? (
            <mesh>
              <planeGeometry args={[radius * 4.4, radius * 4.4]} />
              <meshStandardMaterial
                map={textures.ringMap}
                side={THREE.DoubleSide}
                transparent
                roughness={0.55}
                depthWrite={false}
              />
            </mesh>
          ) : (
            <Ring args={[radius * 1.4, radius * 1.9, 64]}>
              <meshStandardMaterial
                color={planet.accentColor}
                side={THREE.DoubleSide}
                transparent
                opacity={0.45}
              />
            </Ring>
          )}
        </group>
      )}

      {/* Earth's Cratered Moon */}
      {planet.id === 'earth' && moonTextures && (
        <group ref={moonGroupRef}>
          <mesh position={[radius * 2.1, radius * 0.25, 0]}>
            <sphereGeometry args={[radius * 0.24, 32, 32]} />
            <meshStandardMaterial
              map={moonTextures.map}
              bumpMap={moonTextures.bumpMap}
              bumpScale={0.03}
              roughness={0.88}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// --- 3D Planet Node in the Solar System Orrery ---
interface OrbitingPlanetProps {
  planet: PlanetData;
  timeSpeed: number;
  showOrbits: boolean;
  isSelected: boolean;
  onSelectAndZoom: (planet: PlanetData) => void;
}

const OrbitingPlanetMesh: React.FC<OrbitingPlanetProps> = ({
  planet,
  timeSpeed,
  showOrbits,
  isSelected,
  onSelectAndZoom,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (planet.orbitRadius > 0) {
      angleRef.current += delta * planet.orbitSpeed * timeSpeed * 0.45;
      const x = Math.cos(angleRef.current) * planet.orbitRadius;
      const z = Math.sin(angleRef.current) * planet.orbitRadius;
      if (groupRef.current) {
        groupRef.current.position.set(x, 0, z);
      }
    }
  });

  return (
    <>
      {showOrbits && planet.orbitRadius > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.orbitRadius - 0.02, planet.orbitRadius + 0.02, 112]} />
          <meshBasicMaterial
            color={isSelected ? '#ff3b21' : '#52525b'}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.85 : 0.32}
          />
        </mesh>
      )}

      <group ref={groupRef} position={[planet.orbitRadius, 0, 0]}>
        <TexturedPlanetSphere
          planet={planet}
          radius={planet.radiusScale}
          isSelected={isSelected}
          onClick={() => onSelectAndZoom(planet)}
        />

        <Html distanceFactor={18} position={[0, planet.radiusScale + 0.58, 0]} center>
          <button
            onClick={() => onSelectAndZoom(planet)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-[#ff3b21] text-white font-bold border-white shadow-lg scale-105'
                : 'bg-black/85 text-zinc-200 border-zinc-700 hover:border-[#ff3b21] hover:text-white'
            }`}
          >
            {planet.name.split(' ')[0]}
          </button>
        </Html>
      </group>
    </>
  );
};

// --- Procedural 3D Spacecraft Mesh with Clickable Hotspots (All 6 Spacecraft) ---
interface Spacecraft3DSceneProps {
  craft: SpacecraftData;
  scannedHotspots: string[];
  activeHotspot: SpacecraftHotspot | null;
  onSelectHotspot: (h: SpacecraftHotspot) => void;
}

const Spacecraft3DModel: React.FC<Spacecraft3DSceneProps> = ({
  craft,
  scannedHotspots,
  activeHotspot,
  onSelectHotspot,
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.18} floatIntensity={0.3}>
      <group ref={groupRef}>
        {craft.id === 'apollo' && (
          <group>
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[1.15, 1.15, 0.85, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, -1.0, 0]}>
              <coneGeometry args={[0.5, 0.7, 24, 1, true]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <dodecahedronGeometry args={[0.85, 0]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.35} />
            </mesh>
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
              <group key={i} rotation={[0, angle, 0]}>
                <mesh position={[1.45, -0.75, 0]} rotation={[0, 0, -0.45]}>
                  <cylinderGeometry args={[0.04, 0.04, 1.5]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
                </mesh>
                <mesh position={[1.75, -1.35, 0]}>
                  <cylinderGeometry args={[0.32, 0.35, 0.08, 16]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {craft.id === 'rover' && (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.6, 0.55, 1.1]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.75} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[2.1, 0.06, 1.6]} />
              <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0.6, 0.75, 0.35]}>
              <cylinderGeometry args={[0.05, 0.05, 0.95]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
            </mesh>
            <mesh position={[0.6, 1.25, 0.35]}>
              <boxGeometry args={[0.32, 0.22, 0.42]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.6} />
            </mesh>
            <mesh position={[1.15, -0.1, 0]} rotation={[0, 0, -0.5]}>
              <cylinderGeometry args={[0.04, 0.04, 0.9]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            {[-0.85, 0, 0.85].map((xPos, idx) => (
              <React.Fragment key={idx}>
                <mesh position={[xPos, -0.65, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.32, 0.32, 0.22, 20]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.5} />
                </mesh>
                <mesh position={[xPos, -0.65, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.32, 0.32, 0.22, 20]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.5} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        )}

        {craft.id === 'voyager' && (
          <group>
            <mesh position={[0, 0.65, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[1.55, 0.45, 32, 1, true]} />
              <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.65, 0.65, 0.55, 10]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0.52, -0.2, 0.42]} rotation={[0, Math.PI / 4, Math.PI / 2]}>
              <cylinderGeometry args={[0.24, 0.24, 0.04, 24]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[-1.25, -0.45, 0]} rotation={[0, 0, Math.PI / 2.3]}>
              <cylinderGeometry args={[0.08, 0.12, 1.6, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
          </group>
        )}

        {craft.id === 'jwst' && (
          <group>
            {[-0.85, -0.75, -0.65].map((yPos, idx) => (
              <mesh key={idx} position={[0, yPos, 0]} rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[1.85 - idx * 0.1, 1.85 - idx * 0.1, 0.03, 4]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            <mesh position={[0, 0.55, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[1.25, 1.25, 0.12, 6]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.55, 1.35]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.95, 0.6]} rotation={[0.95, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.6]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>
        )}

        {craft.id === 'iss' && (
          <group>
            <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 3.6, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 2.2, 24]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
            </mesh>
            {[-1.55, -1.1, 1.1, 1.55].map((xPos, i) => (
              <mesh key={i} position={[xPos, 0.2, 0]}>
                <boxGeometry args={[0.32, 2.3, 0.04]} />
                <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
              </mesh>
            ))}
          </group>
        )}

        {craft.id === 'hubble' && (
          <group>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
              <cylinderGeometry args={[0.52, 0.58, 2.2, 32]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[-1.25, 0, 0]}>
              <boxGeometry args={[1.3, 0.04, 0.55]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[1.25, 0, 0]}>
              <boxGeometry args={[1.3, 0.04, 0.55]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        )}

        {craft.hotspots.map((hotspot) => {
          const isScanned = scannedHotspots.includes(hotspot.id);
          const isActive = activeHotspot?.id === hotspot.id;

          return (
            <Html key={hotspot.id} position={hotspot.position} center distanceFactor={10}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(hotspot);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all shadow-lg border ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-white scale-110'
                    : isScanned
                    ? 'bg-emerald-500/90 text-slate-950 border-emerald-200'
                    : 'bg-cyan-500/90 text-slate-950 border-white animate-pulse'
                }`}
              >
                <span>{isScanned ? '✓' : '🔍'}</span>
                <span className="whitespace-nowrap">{hotspot.name.split(' ')[0]}</span>
              </button>
            </Html>
          );
        })}
      </group>
    </Float>
  );
};

export interface CosmicExplorer3DProps {
  externalPlanetId?: string;
  externalViewMode?: 'solar-system' | 'planet-closeup' | 'spacecraft';
  externalCraftId?: string;
  onViewModeChange?: (mode: 'solar-system' | 'planet-closeup' | 'spacecraft') => void;
  onPlanetSelect?: (planetId: string) => void;
  onCraftSelect?: (craftId: string) => void;
  isBackgroundMode?: boolean;
}

export const CosmicExplorer3D: React.FC<CosmicExplorer3DProps> = ({
  externalPlanetId,
  externalViewMode,
  externalCraftId,
  onViewModeChange,
  onPlanetSelect,
  onCraftSelect,
  isBackgroundMode = false,
}) => {
  // View mode: Full Solar System Overview ('solar-system'), Close-Up Debris/Meteor View ('planet-closeup'), Spacecraft Hangar ('spacecraft')
  const [viewMode, setViewMode] = useState<'solar-system' | 'planet-closeup' | 'spacecraft'>(
    externalViewMode || 'solar-system'
  );
  const [inspectorTab, setInspectorTab] = useState<'debris' | 'overview' | 'encyclopedia' | 'gravity' | 'quiz'>('debris');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(() => {
    if (externalPlanetId) {
      return SOLAR_SYSTEM_PLANETS.find((p) => p.id === externalPlanetId) || SOLAR_SYSTEM_PLANETS[3];
    }
    return SOLAR_SYSTEM_PLANETS[3]; // Earth default
  });
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [earthWeightKg, setEarthWeightKg] = useState<number>(50);

  // Close-Up 3D Orbital Visualization Toggles (Debris, Meteors, Tracers)
  const [showDebris, setShowDebris] = useState<boolean>(true);
  const [showMeteors, setShowMeteors] = useState<boolean>(true);
  const [showTracers, setShowTracers] = useState<boolean>(true);

  // HUD and Inspector Display Toggles
  const [isForensicDeckCollapsed, setIsForensicDeckCollapsed] = useState<boolean>(false);
  const [isTelemetryHidden, setIsTelemetryHidden] = useState<boolean>(false);

  // Multi-Question Quiz State per Planet
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [answeredKeys, setAnsweredKeys] = useState<Record<string, boolean>>({});

  const [selectedCraft, setSelectedCraft] = useState<SpacecraftData>(() => {
    if (externalCraftId) {
      return SPACECRAFT_FLEET.find((c) => c.id === externalCraftId) || SPACECRAFT_FLEET[0];
    }
    return SPACECRAFT_FLEET[0];
  });
  const [activeHotspot, setActiveHotspot] = useState<SpacecraftHotspot | null>(
    SPACECRAFT_FLEET[0].hotspots[0]
  );

  const {
    markPlanetInspected,
    markHotspotScanned,
    scannedHotspots,
    addXp,
  } = useAcademyStore();

  // Sync with external props
  useEffect(() => {
    if (externalPlanetId) {
      const found = SOLAR_SYSTEM_PLANETS.find((p) => p.id === externalPlanetId);
      if (found && found.id !== selectedPlanet.id) {
        setSelectedPlanet(found);
        setQuizIndex(0);
        setSelectedQuizAnswer(null);
      }
    }
  }, [externalPlanetId]);

  useEffect(() => {
    if (externalViewMode && externalViewMode !== viewMode) {
      setViewMode(externalViewMode);
    }
  }, [externalViewMode]);

  useEffect(() => {
    if (externalCraftId) {
      const found = SPACECRAFT_FLEET.find((c) => c.id === externalCraftId);
      if (found && found.id !== selectedCraft.id) {
        setSelectedCraft(found);
        setActiveHotspot(found.hotspots[0]);
      }
    }
  }, [externalCraftId]);

  // Keyboard navigation: ESC to solar system, H to toggle HUD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Escape') {
        if (viewMode !== 'solar-system') {
          handleReturnToSolarSystem();
        }
      }
      if (e.key === 'h' || e.key === 'H') {
        setIsTelemetryHidden((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Clicking any planet transitions immediately into its Close-Up Orbital Debris/Meteor View!
  const handleSelectPlanetAndZoom = (planet: PlanetData) => {
    soundFX.playScanPing();
    setSelectedPlanet(planet);
    setViewMode('planet-closeup');
    setQuizIndex(0);
    setSelectedQuizAnswer(null);
    markPlanetInspected(planet.id);
    if (onPlanetSelect) onPlanetSelect(planet.id);
    if (onViewModeChange) onViewModeChange('planet-closeup');
  };

  const handleReturnToSolarSystem = () => {
    soundFX.playClick();
    setViewMode('solar-system');
    if (onViewModeChange) onViewModeChange('solar-system');
  };

  const handleSelectHotspot = (hotspot: SpacecraftHotspot) => {
    setActiveHotspot(hotspot);
    markHotspotScanned(hotspot.id);
  };

  const handleSelectCraft = (craft: SpacecraftData) => {
    soundFX.playClick();
    setSelectedCraft(craft);
    setActiveHotspot(craft.hotspots[0]);
    if (onCraftSelect) onCraftSelect(craft.id);
  };

  const handleCyclePlanet = (direction: 'next' | 'prev') => {
    soundFX.playClick();
    const currentIndex = SOLAR_SYSTEM_PLANETS.findIndex((p) => p.id === selectedPlanet.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = SOLAR_SYSTEM_PLANETS.length - 1;
    if (nextIndex >= SOLAR_SYSTEM_PLANETS.length) nextIndex = 0;
    const nextPlanet = SOLAR_SYSTEM_PLANETS[nextIndex];
    setSelectedPlanet(nextPlanet);
    setQuizIndex(0);
    setSelectedQuizAnswer(null);
    markPlanetInspected(nextPlanet.id);
    if (onPlanetSelect) onPlanetSelect(nextPlanet.id);
  };

  const selectedPlanetIndex = SOLAR_SYSTEM_PLANETS.findIndex((p) => p.id === selectedPlanet.id);
  const weightOnPlanet = (earthWeightKg * selectedPlanet.gravityRatio).toFixed(1);
  const jumpHeightOnPlanet = (0.5 / selectedPlanet.gravityRatio).toFixed(2);
  const currentQuiz = selectedPlanet.quizQuestions[quizIndex] || selectedPlanet.quizQuestions[0];
  const quizKey = `${selectedPlanet.id}-q-${quizIndex}`;
  const currentDebrisInfo = PLANET_DEBRIS_DATA[selectedPlanet.id] || PLANET_DEBRIS_DATA.earth;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#020306] z-0 select-none">
      {/* 1. Full-Screen WebGL Canvas living edge-to-edge */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          key={`${viewMode}-${selectedPlanet.id}`}
          camera={{
            position:
              viewMode === 'solar-system'
                ? [0, 16, 26]
                : viewMode === 'planet-closeup'
                ? [0, 0.45, 4.6]
                : [0, 1.2, 4.5],
            fov: 42,
          }}
        >
          <color attach="background" args={['#020306']} />
          <ambientLight intensity={viewMode === 'planet-closeup' ? 0.9 : 0.7} />
          <pointLight position={[0, 0, 0]} intensity={2.8} color="#fef08a" />
          <directionalLight position={[12, 16, 14]} intensity={2.0} />
          <Stars radius={95} depth={50} count={2600} factor={3.5} saturation={0} fade speed={0.8} />

          {viewMode === 'solar-system' ? (
            <group>
              <AsteroidBelt3D timeSpeed={timeSpeed} />
              {SOLAR_SYSTEM_PLANETS.map((planet) => (
                <OrbitingPlanetMesh
                  key={planet.id}
                  planet={planet}
                  timeSpeed={timeSpeed}
                  showOrbits={showOrbits}
                  isSelected={selectedPlanet.id === planet.id}
                  onSelectAndZoom={handleSelectPlanetAndZoom}
                />
              ))}
            </group>
          ) : viewMode === 'planet-closeup' ? (
            <group position={typeof window !== 'undefined' && window.innerWidth < 1024 ? [0, 0.25, 0] : [1.45, 0, 0]}>
              <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.1}>
                <TexturedPlanetSphere planet={selectedPlanet} radius={1.42} isSelected={false} />
              </Float>
              <PlanetCloseUpDebrisAndMeteors
                planet={selectedPlanet}
                showDebris={showDebris}
                showMeteors={showMeteors}
                showTracers={showTracers}
              />
            </group>
          ) : (
            <Spacecraft3DModel
              craft={selectedCraft}
              scannedHotspots={scannedHotspots}
              activeHotspot={activeHotspot}
              onSelectHotspot={handleSelectHotspot}
            />
          )}

          <OrbitControls
            enablePan={viewMode === 'solar-system'}
            minDistance={viewMode === 'solar-system' ? 5 : 2.2}
            maxDistance={viewMode === 'solar-system' ? 44 : 9.0}
            target={
              viewMode === 'planet-closeup'
                ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? [0, 0.1, 0] : [0.75, 0, 0])
                : [0, 0, 0]
            }
          />
        </Canvas>
      </div>

      {/* 2. Interactive Zajno Aerospace HUD (rendered when not masked by an overlay deck) */}
      {!isBackgroundMode && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Subtle Corner Technical Markings (+) */}
          <div className="absolute top-4 left-4 text-xs font-mono text-zinc-600 select-none">+</div>
          <div className="absolute top-4 right-4 text-xs font-mono text-zinc-600 select-none">+</div>
          <div className="absolute bottom-4 left-4 text-xs font-mono text-zinc-600 select-none">+</div>
          <div className="absolute bottom-4 right-4 text-xs font-mono text-zinc-600 select-none">+</div>

          {/* Floating Sub-Mode Selector Bar (Top-Center) */}
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-black/85 backdrop-blur-xl border border-zinc-800 shadow-2xl">
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode('solar-system');
                if (onViewModeChange) onViewModeChange('solar-system');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'solar-system'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Orbit className="h-3 w-3" />
              <span>01 // Solar System</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode('planet-closeup');
                if (onViewModeChange) onViewModeChange('planet-closeup');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'planet-closeup'
                  ? 'bg-[#ff3b21] text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Crosshair className="h-3 w-3" />
              <span>02 // {selectedPlanet.name.split(' ')[0]} Orbit</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode('spacecraft');
                if (onViewModeChange) onViewModeChange('spacecraft');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'spacecraft'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Rocket className="h-3 w-3" />
              <span>03 // Fleet</span>
            </button>

            {/* Toggle HUD button */}
            <button
              onClick={() => setIsTelemetryHidden((prev) => !prev)}
              className="p-1 rounded-full text-zinc-400 hover:text-white ml-0.5"
              title={isTelemetryHidden ? 'Show Telemetry HUD (Press H)' : 'Hide Telemetry HUD (Press H)'}
            >
              {isTelemetryHidden ? <Eye className="h-3.5 w-3.5 text-cyan-400" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* LEFT FLOATING TELEMETRY COLUMN */}
          {!isTelemetryHidden && (
            <>
              {viewMode === 'planet-closeup' && (
                <div className="fixed left-4 sm:left-6 top-28 bottom-6 w-80 sm:w-84 max-w-[calc(100vw-2rem)] z-20 pointer-events-auto flex flex-col justify-between overflow-y-auto no-scrollbar gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="holo-panel-3d border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
                    {/* Sector Index & Category */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                          SECTOR 0{selectedPlanetIndex + 1} // ORBITAL STATION
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {selectedPlanet.gravityRatio}g
                        </span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-1">
                        {selectedPlanet.name}
                      </h1>
                      <div className="text-xs font-mono text-[#ff3b21] uppercase tracking-wider font-semibold mt-0.5">
                        {selectedPlanet.category} • {selectedPlanet.moonsCount} MOONS
                      </div>
                    </div>

                    {/* High-Contrast Hazard Red Alert Badge (#ff3b21) */}
                    <div className="bg-[#ff3b21]/15 border border-[#ff3b21]/60 rounded-xl p-3 flex items-center justify-between gap-2 shadow-lg shadow-[#ff3b21]/10">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-[#ff3b21] shrink-0 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase font-bold text-white tracking-wider">
                          ORBITAL RISK:
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#ff3b21] text-white font-black tracking-wider">
                        {currentDebrisInfo.riskLevel}
                      </span>
                    </div>

                    {/* Telemetry Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div className="bg-black/90 border border-zinc-800/90 rounded-xl p-2.5">
                        <div className="text-[9px] text-zinc-400 uppercase">ESCAPE VELOCITY</div>
                        <div className="text-xs font-bold text-emerald-400 mt-0.5">{selectedPlanet.escapeVelocity}</div>
                      </div>
                      <div className="bg-black/90 border border-zinc-800/90 rounded-xl p-2.5">
                        <div className="text-[9px] text-zinc-400 uppercase">SURFACE TEMP</div>
                        <div className="text-xs font-bold text-amber-300 mt-0.5">{selectedPlanet.avgTemp}</div>
                      </div>
                      <div className="bg-black/90 border border-zinc-800/90 rounded-xl p-2.5">
                        <div className="text-[9px] text-zinc-400 uppercase">DAY DURATION</div>
                        <div className="text-xs font-bold text-white mt-0.5 truncate">{selectedPlanet.dayLength}</div>
                      </div>
                      <div className="bg-black/90 border border-zinc-800/90 rounded-xl p-2.5">
                        <div className="text-[9px] text-zinc-400 uppercase">ORBIT VELOCITY</div>
                        <div className="text-xs font-bold text-purple-300 mt-0.5">{selectedPlanet.orbitalSpeed}</div>
                      </div>
                    </div>

                    {/* Atmospheric Mini Bar Preview */}
                    <div className="space-y-1.5 bg-black/90 border border-zinc-800/90 rounded-xl p-3">
                      <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold flex items-center justify-between">
                        <span>Atmosphere Trace</span>
                        <span className="text-[9px] text-zinc-500 font-mono">Forensics</span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {selectedPlanet.atmosphereComposition.slice(0, 3).map((comp) => (
                          <div key={comp.gas}>
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className="text-zinc-300">{comp.gas}</span>
                              <span className="font-mono text-cyan-300">{comp.percent}%</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${Math.max(5, comp.percent)}%`, backgroundColor: comp.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3D Layer Toggles (Debris, Meteors, Tracers) */}
                    <div className="bg-black/90 border border-zinc-800/90 rounded-xl p-3 space-y-2">
                      <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center justify-between">
                        <span>Orbital Optics</span>
                        <span className="text-[9px] font-mono text-[#ff3b21] font-bold">ZAJNO SPEC</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => setShowDebris(!showDebris)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase transition-all font-bold ${
                            showDebris
                              ? 'bg-[#ff3b21] text-white shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          ● Debris
                        </button>
                        <button
                          onClick={() => setShowMeteors(!showMeteors)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase transition-all font-bold ${
                            showMeteors
                              ? 'bg-amber-400 text-black shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          ☄ Meteors
                        </button>
                        <button
                          onClick={() => setShowTracers(!showTracers)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase transition-all font-bold ${
                            showTracers
                              ? 'bg-white text-black shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          ◎ Tracers
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Return to Solar Orbit Button (ESC) */}
                  <button
                    onClick={handleReturnToSolarSystem}
                    className="w-full py-2.5 px-3 rounded-xl bg-black/90 hover:bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-xs font-mono uppercase font-bold text-white flex items-center justify-center gap-2 shadow-2xl transition-all"
                  >
                    <ArrowLeft className="h-4 w-4 text-[#ff3b21]" />
                    <span>Return to Solar Orbit</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] text-zinc-300">ESC</kbd>
                  </button>
                </div>
              )}

              {viewMode === 'solar-system' && (
                <div className="fixed left-4 sm:left-6 top-28 w-80 sm:w-84 max-w-[calc(100vw-2rem)] z-20 pointer-events-auto flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="holo-panel-3d border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#ff3b21] font-bold">
                        ORBITAL OBSERVATORY
                      </div>
                      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white mt-0.5">
                        Solar System
                      </h1>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Real-time 3D planetary orrery. Click any celestial body in space or from the bottom dock to inspect close-up orbital debris, space pollution, and planetary stats.
                      </p>
                    </div>

                    {/* Warp Speed & Controls */}
                    <div className="bg-black/90 border border-zinc-800/90 rounded-xl p-3 space-y-2">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                        <span>Warp Speed</span>
                        <span className="text-cyan-400 font-bold">{timeSpeed}x</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[0.5, 1, 3, 8].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => setTimeSpeed(spd)}
                            className={`flex-1 py-1 rounded-lg text-xs font-mono transition-colors ${
                              timeSpeed === spd
                                ? 'bg-[#ff3b21] text-white font-bold'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                        <button
                          onClick={() => setTimeSpeed(timeSpeed === 0 ? 1 : 0)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800"
                          title={timeSpeed === 0 ? 'Resume Orbit' : 'Pause Orbit'}
                        >
                          {timeSpeed === 0 ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Orbit lines toggle */}
                    <button
                      onClick={() => setShowOrbits(!showOrbits)}
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-mono uppercase flex items-center justify-between transition-all ${
                        showOrbits
                          ? 'bg-zinc-900 border-zinc-700 text-white'
                          : 'bg-black/80 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Eye className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Orbital Plane Traces</span>
                      </span>
                      <span className="text-[10px] font-bold text-cyan-400">{showOrbits ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>
              )}

              {viewMode === 'spacecraft' && (
                <div className="fixed left-4 sm:left-6 top-28 bottom-6 w-80 sm:w-84 max-w-[calc(100vw-2rem)] z-20 pointer-events-auto flex flex-col justify-between overflow-y-auto no-scrollbar gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="holo-panel-3d border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                        FLEET HANGAR // 6 PROBES
                      </div>
                      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white mt-0.5">
                        {selectedCraft.name}
                      </h1>
                      <div className="text-xs text-amber-300/90 font-mono mt-0.5">
                        {selectedCraft.year} • {selectedCraft.destination}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-mono uppercase text-zinc-400">Select Spacecraft:</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {SPACECRAFT_FLEET.map((craft) => {
                          const active = selectedCraft.id === craft.id;
                          return (
                            <button
                              key={craft.id}
                              onClick={() => handleSelectCraft(craft)}
                              className={`p-2 rounded-xl border text-left transition-all ${
                                active
                                  ? 'bg-amber-500/20 border-amber-400 text-white'
                                  : 'bg-black/80 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                              }`}
                            >
                              <div className="text-base">{craft.badgeEmoji}</div>
                              <div className="text-xs font-semibold truncate text-white mt-1">{craft.name}</div>
                              <div className="text-[9px] font-mono text-zinc-400 truncate">{craft.year}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReturnToSolarSystem}
                    className="w-full py-2.5 px-3 rounded-xl bg-black/90 hover:bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-xs font-mono uppercase font-bold text-white flex items-center justify-center gap-2 shadow-2xl transition-all"
                  >
                    <ArrowLeft className="h-4 w-4 text-[#ff3b21]" />
                    <span>Return to Solar Orbit</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] text-zinc-300">ESC</kbd>
                  </button>
                </div>
              )}
            </>
          )}

          {/* RIGHT FLOATING FORENSIC DECK (ZAJNO 5-TAB CARDS) */}
          {!isTelemetryHidden && viewMode !== 'spacecraft' && (
            <>
              {isForensicDeckCollapsed ? (
                <div className="fixed right-4 sm:right-6 top-28 z-20 pointer-events-auto">
                  <button
                    onClick={() => setIsForensicDeckCollapsed(false)}
                    className="px-4 py-2.5 rounded-full bg-black/90 hover:bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-xs font-mono uppercase font-bold text-white flex items-center gap-2 shadow-2xl backdrop-blur-xl"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#ff3b21]" />
                    <span>Forensic Deck ({selectedPlanet.name.split(' ')[0]})</span>
                    <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                  </button>
                </div>
              ) : (
                <div className="fixed right-4 sm:right-6 top-28 bottom-6 w-96 max-w-[calc(100vw-2rem)] z-20 pointer-events-auto flex flex-col justify-start transition-all duration-300">
                  <TiltCard3D intensity={2} className="holo-panel-3d border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex flex-col max-h-full overflow-hidden shadow-2xl">
                    {/* Deck Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: selectedPlanet.color }}
                        />
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff3b21] font-bold">
                            PLANETARY FORENSICS
                          </div>
                          <div className="text-sm font-bold text-white">
                            {selectedPlanet.name.toUpperCase()} // DECK
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsForensicDeckCollapsed(true)}
                          className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
                          title="Minimize Forensic Deck"
                        >
                          <Minimize2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 5-Tab Switcher (Debris first, Zajno-style) */}
                    <div className="grid grid-cols-5 bg-black/90 p-1 rounded-xl border border-zinc-800 gap-1 my-3">
                      <button
                        onClick={() => setInspectorTab('debris')}
                        className={`py-1.5 rounded-lg text-[10px] font-mono uppercase flex items-center justify-center gap-1 transition-all ${
                          inspectorTab === 'debris'
                            ? 'bg-[#ff3b21] text-white font-bold shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        Debris
                      </button>
                      <button
                        onClick={() => setInspectorTab('overview')}
                        className={`py-1.5 rounded-lg text-[10px] font-mono uppercase flex items-center justify-center gap-1 transition-all ${
                          inspectorTab === 'overview'
                            ? 'bg-zinc-800 text-white font-bold shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Info className="h-3 w-3" />
                        Stats
                      </button>
                      <button
                        onClick={() => setInspectorTab('encyclopedia')}
                        className={`py-1.5 rounded-lg text-[10px] font-mono uppercase flex items-center justify-center gap-1 transition-all ${
                          inspectorTab === 'encyclopedia'
                            ? 'bg-zinc-800 text-cyan-300 font-bold shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Layers className="h-3 w-3" />
                        Layers
                      </button>
                      <button
                        onClick={() => setInspectorTab('gravity')}
                        className={`py-1.5 rounded-lg text-[10px] font-mono uppercase flex items-center justify-center gap-1 transition-all ${
                          inspectorTab === 'gravity'
                            ? 'bg-zinc-800 text-amber-300 font-bold shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Scale className="h-3 w-3" />
                        Facts
                      </button>
                      <button
                        onClick={() => setInspectorTab('quiz')}
                        className={`py-1.5 rounded-lg text-[10px] font-mono uppercase flex items-center justify-center gap-1 transition-all ${
                          inspectorTab === 'quiz'
                            ? 'bg-zinc-800 text-emerald-300 font-bold shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <HelpCircle className="h-3 w-3" />
                        Quiz
                      </button>
                    </div>

                    {/* Scrollable Tab Content Container */}
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1">
                      {/* SUB-TAB 0: SPACE POLLUTION, ORBITAL DEBRIS & METEOROID FLUX (ZAJNO SPEC) */}
                      {inspectorTab === 'debris' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-[#ff3b21]/10 border border-[#ff3b21]/40 rounded-xl p-3">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="h-4 w-4 text-[#ff3b21] shrink-0" />
                              <span className="text-[11px] font-mono uppercase text-white font-bold">
                                ORBITAL HAZARD STATUS:
                              </span>
                            </div>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#ff3b21] text-white font-bold">
                              {currentDebrisInfo.riskLevel}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-200 leading-relaxed">
                            {currentDebrisInfo.orbitalObjectsSummary}
                          </p>

                          {/* 2x2 Orbital Debris & Meteoroid Statistics Grid */}
                          <div className="grid grid-cols-2 gap-2 font-mono">
                            <div className="bg-black/90 border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400 uppercase">ARTIFICIAL OBJECTS</div>
                              <div className="text-xs font-bold text-[#ff3b21] mt-0.5">
                                {currentDebrisInfo.trackedDebrisCount}
                              </div>
                            </div>
                            <div className="bg-black/90 border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400 uppercase">MICRO-FRAGMENTS / DUST</div>
                              <div className="text-xs font-bold text-white mt-0.5">
                                {currentDebrisInfo.microFragmentsEstimate}
                              </div>
                            </div>
                            <div className="bg-black/90 border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400 uppercase">DAILY METEOR INFLUX</div>
                              <div className="text-xs font-bold text-amber-400 mt-0.5">
                                {currentDebrisInfo.meteoroidFluxPerDay}
                              </div>
                            </div>
                            <div className="bg-black/90 border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400 uppercase">IMPACT VELOCITY</div>
                              <div className="text-xs font-bold text-cyan-300 mt-0.5">
                                {currentDebrisInfo.avgImpactVelocity}
                              </div>
                            </div>
                          </div>

                          {/* Notable Collisions & Meteor Events */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                              Recorded Collisions & Bolide Impacts
                            </div>
                            {currentDebrisInfo.notableEvents.map((ev, i) => (
                              <div
                                key={i}
                                className="text-xs text-zinc-300 bg-black/80 border border-zinc-800/90 rounded-xl p-2.5 leading-relaxed"
                              >
                                • {ev}
                              </div>
                            ))}
                          </div>

                          {/* Bold Red Solutions Section (Zajno Style) */}
                          <div className="space-y-2 pt-1">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff3b21] font-bold">
                              Active Cleanup & Planetary Defense Solutions
                            </div>
                            {currentDebrisInfo.mitigationAndDefense.map((sol, idx) => (
                              <div
                                key={idx}
                                className="bg-gradient-to-r from-[#ff3b21]/15 to-black border-l-2 border-[#ff3b21] rounded-r-xl p-3"
                              >
                                <div className="text-xs font-bold text-white">{sol.title}</div>
                                <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                                  {sol.detail}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 1: OVERVIEW & TELEMETRY */}
                      {inspectorTab === 'overview' && (
                        <div className="space-y-3.5">
                          <p className="text-xs text-zinc-200 leading-relaxed">
                            {selectedPlanet.beginnerSummary}
                          </p>

                          <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 flex items-start gap-2.5">
                            <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-100 leading-relaxed">
                              <strong className="text-amber-300 font-mono uppercase">Scale Analogy: </strong>
                              {selectedPlanet.kidFriendlyAnalogy}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 font-mono">
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">DISTANCE FROM SUN</div>
                              <div className="text-xs font-bold text-cyan-300 mt-0.5">{selectedPlanet.distanceFromSun}</div>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">SURFACE TEMPERATURE</div>
                              <div className="text-xs font-bold text-amber-300 mt-0.5">{selectedPlanet.avgTemp}</div>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">LENGTH OF 1 DAY</div>
                              <div className="text-xs font-bold text-white mt-0.5">{selectedPlanet.dayLength}</div>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">LENGTH OF 1 YEAR</div>
                              <div className="text-xs font-bold text-white mt-0.5">{selectedPlanet.yearLength}</div>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">ESCAPE VELOCITY</div>
                              <div className="text-xs font-bold text-emerald-300 mt-0.5">{selectedPlanet.escapeVelocity}</div>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">ORBITAL SPEED</div>
                              <div className="text-xs font-bold text-purple-300 mt-0.5">{selectedPlanet.orbitalSpeed}</div>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">AXIAL TILT</div>
                              <div className="text-xs font-bold text-cyan-200 mt-0.5">{selectedPlanet.axialTilt}</div>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-2.5">
                              <div className="text-[9px] text-zinc-400">SUNLIGHT TRAVEL TIME</div>
                              <div className="text-xs font-bold text-amber-200 mt-0.5">{selectedPlanet.lightTimeFromSun}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 2: ENCYCLOPEDIA, ATMOSPHERE & INTERNAL STRUCTURE */}
                      {inspectorTab === 'encyclopedia' && (
                        <div className="space-y-3.5">
                          <div>
                            <div className="text-[11px] font-mono uppercase text-cyan-400 mb-2 font-semibold">
                              Atmospheric Gas Composition
                            </div>
                            <div className="space-y-2 bg-black border border-zinc-800 rounded-xl p-3">
                              {selectedPlanet.atmosphereComposition.map((comp) => (
                                <div key={comp.gas}>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-zinc-200">{comp.gas}</span>
                                    <span className="font-mono text-cyan-300 font-bold">{comp.percent}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{ width: `${Math.max(4, comp.percent)}%`, backgroundColor: comp.color }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-[11px] font-mono uppercase text-amber-400 mb-2 font-semibold">
                              Internal Structure (Core to Surface)
                            </div>
                            <div className="space-y-2">
                              {selectedPlanet.internalLayers.map((l, idx) => (
                                <div key={idx} className="bg-black border border-zinc-800 rounded-xl p-2.5">
                                  <div className="text-xs font-semibold text-white">{l.layer}</div>
                                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">{l.detail}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-black border border-zinc-800 rounded-xl p-3">
                            <div className="text-[10px] font-mono uppercase text-purple-400 mb-1 font-semibold">
                              Origin & Exploration History
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed">{selectedPlanet.deepDiveHistory}</p>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 3: GRAVITY LAB & 8 MIND-BLOWING FUN FACTS */}
                      {inspectorTab === 'gravity' && (
                        <div className="space-y-3.5">
                          <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-zinc-300">Your Earth Weight:</span>
                              <span className="text-cyan-400 font-bold">{earthWeightKg} kg ({selectedPlanet.gravityRatio}g here)</span>
                            </div>
                            <input
                              type="range"
                              min={20}
                              max={120}
                              value={earthWeightKg}
                              onChange={(e) => setEarthWeightKg(Number(e.target.value))}
                              className="w-full accent-[#ff3b21] cursor-pointer"
                            />

                            <div className="grid grid-cols-2 gap-2.5 pt-1">
                              <div className="bg-zinc-950 rounded-xl p-2.5 text-center border border-zinc-800">
                                <div className="text-[10px] text-zinc-400 font-mono">WEIGHT HERE</div>
                                <div className="text-base font-bold text-amber-400 font-mono">{weightOnPlanet} kg</div>
                              </div>
                              <div className="bg-zinc-950 rounded-xl p-2.5 text-center border border-zinc-800">
                                <div className="text-[10px] text-zinc-400 font-mono">JUMP HEIGHT</div>
                                <div className="text-base font-bold text-emerald-400 font-mono">{jumpHeightOnPlanet} m</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold">
                              {selectedPlanet.funFacts.length} Mind-Blowing Fun Facts About {selectedPlanet.name.split(' ')[0]}
                            </div>
                            {selectedPlanet.funFacts.map((fact, i) => (
                              <div key={i} className="text-xs text-zinc-200 bg-black border border-zinc-800 rounded-xl p-2.5 leading-relaxed">
                                <span className="text-[#ff3b21] font-mono font-bold mr-1.5">#{i + 1}</span>
                                {fact}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 4: MULTI-QUESTION PLANETARY QUIZ DECK */}
                      {inspectorTab === 'quiz' && (
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                              Question {quizIndex + 1} of {selectedPlanet.quizQuestions.length}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setQuizIndex((prev) =>
                                    prev > 0 ? prev - 1 : selectedPlanet.quizQuestions.length - 1
                                  );
                                  setSelectedQuizAnswer(null);
                                }}
                                className="p-1 rounded-lg bg-black border border-zinc-800 text-zinc-300 hover:text-white"
                                title="Previous Question"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setQuizIndex((prev) => (prev + 1) % selectedPlanet.quizQuestions.length);
                                  setSelectedQuizAnswer(null);
                                }}
                                className="p-1 rounded-lg bg-black border border-zinc-800 text-zinc-300 hover:text-white"
                                title="Next Question"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-medium text-white leading-snug">
                            {currentQuiz.question}
                          </p>

                          <div className="space-y-2">
                            {currentQuiz.options.map((opt, idx) => {
                              const isChosen = selectedQuizAnswer === idx;
                              const isCorrect = idx === currentQuiz.correctIndex;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (selectedQuizAnswer !== null) return;
                                    setSelectedQuizAnswer(idx);
                                    if (isCorrect) {
                                      soundFX.playSuccessChime();
                                      if (!answeredKeys[quizKey]) {
                                        setAnsweredKeys((prev) => ({ ...prev, [quizKey]: true }));
                                        addXp(30, `Correct answer on ${selectedPlanet.name} Quiz!`);
                                      }
                                    } else {
                                      soundFX.playAlert();
                                    }
                                  }}
                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs border transition-all flex items-center justify-between ${
                                    selectedQuizAnswer === null
                                      ? 'bg-black border-zinc-800 hover:border-[#ff3b21] text-zinc-200'
                                      : isChosen && isCorrect
                                      ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200 font-semibold'
                                      : isChosen && !isCorrect
                                      ? 'bg-rose-950/50 border-rose-400 text-rose-200'
                                      : isCorrect
                                      ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
                                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-500'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {selectedQuizAnswer !== null && isCorrect && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {selectedQuizAnswer !== null && (
                            <div className="space-y-2.5 animate-in fade-in duration-200">
                              <div className="text-xs text-zinc-100 bg-black border border-zinc-700 rounded-xl p-3 leading-relaxed">
                                <div className="font-mono font-bold text-emerald-400 mb-1">
                                  {selectedQuizAnswer === currentQuiz.correctIndex
                                    ? '✅ Correct! +30 Space XP Earned!'
                                    : '💡 Good try! Here is the science:'}
                                </div>
                                {currentQuiz.explanation}
                              </div>

                              <button
                                onClick={() => {
                                  setQuizIndex((prev) => (prev + 1) % selectedPlanet.quizQuestions.length);
                                  setSelectedQuizAnswer(null);
                                }}
                                className="micro-btn w-full py-2 rounded-xl bg-[#ff3b21] hover:bg-[#e03018] text-white text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5"
                              >
                                <span>Next Question ({((quizIndex + 1) % selectedPlanet.quizQuestions.length) + 1}/{selectedPlanet.quizQuestions.length})</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TiltCard3D>
                </div>
              )}
            </>
          )}

          {/* RIGHT SPACECRAFT INSPECTOR (when in Spacecraft Hangar mode) */}
          {!isTelemetryHidden && viewMode === 'spacecraft' && (
            <div className="fixed right-4 sm:right-6 top-28 bottom-6 w-96 max-w-[calc(100vw-2rem)] z-20 pointer-events-auto flex flex-col justify-start transition-all duration-300">
              <TiltCard3D intensity={2} className="holo-panel-3d border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex flex-col max-h-full overflow-y-auto no-scrollbar shadow-2xl space-y-3.5">
                <div className="border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl animate-float-3d">{selectedCraft.badgeEmoji}</span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                        LAUNCHED {selectedCraft.year} • {selectedCraft.destination}
                      </span>
                      <h2 className="text-lg font-bold text-white">{selectedCraft.name}</h2>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{selectedCraft.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-black border border-zinc-800 rounded-lg p-2">
                    <div className="text-[9px] text-zinc-400">LAUNCH VEHICLE</div>
                    <div className="text-[11px] font-bold text-cyan-300 truncate">{selectedCraft.launchVehicle}</div>
                  </div>
                  <div className="bg-black border border-zinc-800 rounded-lg p-2">
                    <div className="text-[9px] text-zinc-400">MAX VELOCITY</div>
                    <div className="text-[11px] font-bold text-amber-300 truncate">{selectedCraft.maxSpeed}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    Hardware Subsystems (Click in 3D to Scan):
                  </div>
                  {selectedCraft.hotspots.map((h) => {
                    const isScanned = scannedHotspots.includes(h.id);
                    const isCurrent = activeHotspot?.id === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => handleSelectHotspot(h)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-400'
                            : 'bg-black border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{h.name}</div>
                          <div className="text-[11px] text-amber-300/90">{h.role}</div>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                            isScanned
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-cyan-500/20 text-cyan-300'
                          }`}
                        >
                          {isScanned ? '✓ Scanned' : 'Scan'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeHotspot && (
                  <div className="bg-black border border-zinc-800 rounded-xl p-3 space-y-2">
                    <div className="text-xs font-mono text-cyan-400 font-semibold">
                      {activeHotspot.name}
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">
                      {activeHotspot.plainEnglish}
                    </p>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[11px] font-mono text-emerald-300">
                      ⚙️ {activeHotspot.technicalFact}
                    </div>
                  </div>
                )}
              </TiltCard3D>
            </div>
          )}

          {/* BOTTOM DOCK */}
          {!isTelemetryHidden && (
            <>
              {/* Solar System View: Full 9-Planet Dock Strip */}
              {viewMode === 'solar-system' && (
                <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-20 pointer-events-auto">
                  <div className="holo-panel-3d border border-zinc-800/90 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
                      {SOLAR_SYSTEM_PLANETS.map((planet) => {
                        const active = selectedPlanet.id === planet.id;
                        return (
                          <button
                            key={planet.id}
                            onClick={() => handleSelectPlanetAndZoom(planet)}
                            className={`micro-card py-2 px-1.5 rounded-xl border text-center transition-all ${
                              active
                                ? 'bg-[#ff3b21]/20 border-[#ff3b21] shadow-md shadow-[#ff3b21]/20'
                                : 'bg-black/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                            }`}
                          >
                            <div
                              className="h-3.5 w-3.5 rounded-full mx-auto mb-1 shadow-sm"
                              style={{ backgroundColor: planet.color }}
                            />
                            <div className="text-[10px] font-semibold text-white truncate">
                              {planet.name.split(' ')[0]}
                            </div>
                            <div className="text-[8px] font-mono text-zinc-400 uppercase">
                              {planet.gravityRatio}g
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Close-Up View: Sleek Floating Bottom Planet Cycler */}
              {viewMode === 'planet-closeup' && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-xl border border-zinc-800 shadow-2xl">
                  <button
                    onClick={() => handleCyclePlanet('prev')}
                    className="p-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    title="Previous Planet"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-1.5 px-2">
                    {SOLAR_SYSTEM_PLANETS.map((p) => {
                      const active = p.id === selectedPlanet.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPlanetAndZoom(p)}
                          className={`h-2.5 rounded-full transition-all ${
                            active ? 'w-6 bg-[#ff3b21]' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                          }`}
                          title={p.name}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleCyclePlanet('next')}
                    className="p-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    title="Next Planet"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

