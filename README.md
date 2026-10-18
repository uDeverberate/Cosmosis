# 🌌 COSMOSIS // Interactive 3D Space Exploration & Flight Academy (`v3.0`)

An interactive 3D space encyclopedia, mission chronicle reader, physics lab, and flight simulation academy engineered to ignite curiosity in students discovering astronomy and spaceflight.

---

## 🌟 Key Modules & Upgrades in COSMOSIS v3.0

### 1. 🪐 3D Solar System Observatory, IRL Textures & 6-Spacecraft Hangar (`src/components/CosmicExplorer3D.tsx`)
- **Realistic 2K-Style Equirectangular Planetary Textures & Bump Maps (`src/utils/planetTextures.ts`)**: Solar granulation & sunspots, Mercury's craters, Venus's sulfuric chevrons, Earth's continents + rotating 3D cloud sphere, Mars's Valles Marineris & Olympus Mons, Jupiter's Great Red Spot, Saturn's Cassini Division rings, and Uranus/Neptune methane bands.
- **4-Tab Planetary Encyclopedia**:
  1. **Overview**: Plain-English summary, scale analogy, and 8 core orbital/physical telemetry metrics (Escape Velocity, Orbital Speed, Axial Tilt, Sunlight Travel Time, etc.).
  2. **Interior & Atmosphere**: Visual atmospheric gas bars, 4 internal structure layers from core to crust, and deep-dive formation history.
  3. **Gravity Playground & 8 Fun Facts**: Interactive weight & vertical jump height calculator + 8 curated fun facts per world (72 planetary fun facts!).
  4. **Multi-Question Quiz Deck (36 Questions)**: 4 questions per world with instant science explanations. XP is awarded and displayed only *after* answering!
- **6 Spacecraft in the 3D Hangar**: Inspect **Apollo 11 Eagle**, **Mars Perseverance/Opportunity Rover**, **Voyager 1**, **James Webb Space Telescope**, **International Space Station (ISS)**, and **Hubble Space Telescope**.

### 2. 📖 6 Gripping Interactive Mission Chronicles (`src/components/StoryChronicles.tsx`)
- **6 High-Stakes Multi-Chapter Stories**:
  1. *The 45 Seconds of Eagle* (Apollo 11 Moon Landing)
  2. *Houston, We've Had a Problem* (Apollo 13 Survival Thriller)
  3. *Seven Minutes of Terror* (Mars Perseverance Rocket Sky-Crane)
  4. *A Message in a Cosmic Bottle* (Voyager 1 & The Golden Record)
  5. *The Little Rover That Refused to Quit* (Opportunity's 5,352-Sol Marathon)
  6. *Unfolding the Cosmic Time Machine* (James Webb at Lagrange Point L2)
- Includes live 3D WebGL dioramas, chapter tension gauges, 3 telemetry status metrics per chapter, "Did You Know?" historical secrets, and 3-way Cadet Decisions (where XP is revealed only after choosing!).

### 3. 🔬 4 Interactive 3D & Physics Labs (`src/components/InteractiveGuides.tsx`)
- **Newton's Orbital Cannonball Lab**, **3D Multi-Stage Rocket Equation Calculator**, **Exoplanet Transit Light-Curve Lab**, and **3D Astronaut EVA Spacesuit Scanner**, complete with key physics equations and engineering facts.

### 4. 🎮 5 Interactive Flight Simulators & Cosmic Trivia Gauntlet (`src/components/SpaceGamesArcade.tsx`)
- **Eagle Lunar Touchdown (3 Levels)**: Wide Pad, Solar Wind, and Moving Pad levels with collectible mid-air `+FUEL` pods and RCS attitude plumes across the Moon, Mars, and Europa.
- **Gravity Assist Slingshot (3 Levels)**: Single Jupiter well, Binary Worlds, and Jupiter + Io Moon obstacle with click-on-canvas vector aiming.
- **3D Zero-G Hardware Rescue**: 6 tumbling space artifacts in a `@react-three/cannon` microgravity cage with a **Fire Thruster Wave** impulse button.
- **Deep Space Signal Decoder**: Match frequency (`GHz`) and amplitude (`dB`) to lock onto Voyager 1's carrier wave.
- **Cosmic Trivia Gauntlet**: Multi-question astrophysics challenge with streak multipliers and XP awarded after each answer.

---

## 🛠️ Quick Start

```bash
npm install
npm run dev
```
