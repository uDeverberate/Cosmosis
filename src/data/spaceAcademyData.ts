import {
  WalkthroughStep,
  PlanetData,
  SpacecraftData,
  SpaceStory,
  InteractiveGuide,
  GlossaryTerm,
  BadgeAward,
  QuizQuestionItem,
} from '../types/academy';

export const COSMIC_FUN_FACTS_TICKER: string[] = [
  'A single teaspoon of a Neutron Star weighs about 4 billion tons—as much as Mount Everest!',
  'In the vacuum of space, if two pieces of the same pure metal touch, their atoms fuse together permanently ("Cold Welding")!',
  'Footprints left by Apollo astronauts on the Moon will last for at least 100 million years because there is no wind or rain.',
  'There are more trees on Earth (~3 trillion) than there are stars in the entire Milky Way galaxy (~100–400 billion)!',
  'Saturn’s density (0.687 g/cm³) is lower than liquid water—if you found an ocean big enough, Saturn would float!',
  'NASA’s Parker Solar Probe is the fastest human-made object ever, reaching 692,000 km/h (192 km per second)!',
  'On Venus, a sidereal day (243 Earth days) is longer than a Venusian year (225 Earth days), and the Sun rises in the West!',
  'Sunset on Mars appears bluish-white because fine Martian dust scatters blue light forward toward the observer.',
  'The International Space Station orbits Earth every 90 minutes at 28,000 km/h—astronauts witness 16 sunrises and sunsets every single day!',
  'Voyager 1 is over 24.4 billion kilometers away; its 23-watt radio signal takes over 22.5 hours to reach Earth at the speed of light.',
  'Jupiter’s moon Io has over 400 active volcanoes blasting sulfur plumes 500 km high into space.',
  'Saturn’s moon Titan has a thick nitrogen atmosphere and liquid rain, rivers, and seas made of liquid methane and ethane!',
  'If you scaled the Sun down to the size of a white blood cell, the Milky Way galaxy would still be the size of the United States!',
  'Astronauts grow up to 5 cm (2 inches) taller in space because without gravity compressing their spines, their spinal discs expand.',
  'Olympus Mons on Mars is 21.9 km high—nearly 3 times taller than Mount Everest—and its base would cover the entire country of France!',
  'Light from the core of the Sun takes up to 100,000 years to bounce its way to the solar surface, then just 8 minutes and 20 seconds to reach Earth!',
];

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to COSMOSIS Space Academy!',
    subtitle: 'Step 1 of 5 // Cadet Orientation',
    description:
      'COSMOSIS turns complex astrophysics, orbital mechanics, and NASA history into interactive 3D worlds, high-stakes mission stories, physics sandboxes, and playable flight simulators.',
    tip: 'Every planet quiz, story decision, hardware scan, and flight simulator awards XP—and XP is revealed AFTER you make your choice so you can think like a real astronaut!',
    icon: '🌌',
  },
  {
    id: 'explorer-tour',
    title: '3D Solar System, Close-Up Globes & 6 Spacecraft',
    subtitle: 'Step 2 of 5 // 3D Observatory',
    description:
      'Explore realistic 3D surface textures and bump maps on the Sun and all 8 planets, zoom into Close-Up Globe mode, inspect internal planet layers & atmospheres, or scan 6 iconic spacecraft in the 3D Hangar.',
    targetTab: 'explorer',
    tip: 'Each world now features a 4-Question Quiz Deck, an Encyclopedia tab (atmosphere & core layers), and 8+ mind-blowing fun facts!',
    icon: '🪐',
  },
  {
    id: 'stories-tour',
    title: '6 Gripping Interactive Mission Chronicles',
    subtitle: 'Step 3 of 5 // High-Stakes Space Stories',
    description:
      'Step into the cockpit during Apollo 11’s 1202 alarm, Apollo 13’s oxygen tank explosion, Perseverance’s "Seven Minutes of Terror" sky-crane landing, Voyager’s Golden Record, Opportunity’s dust storm, and JWST’s deep-space unfolding.',
    targetTab: 'stories',
    tip: 'Watch live telemetry gauges shift with each chapter and make 3-way mission decisions to test your instincts!',
    icon: '📖',
  },
  {
    id: 'guides-tour',
    title: 'Hands-On 3D Space Science Labs',
    subtitle: 'Step 4 of 5 // Visual Physics Sandboxes',
    description:
      'Fire Sir Isaac Newton’s orbital cannonball, stack 3D multi-stage rockets, detect alien exoplanets via transit light curves, and scan a 3D 14-layer astronaut EVA spacesuit.',
    targetTab: 'guides',
    tip: 'Drag the interactive sliders to see equations and 3D models respond in real time.',
    icon: '🧭',
  },
  {
    id: 'games-tour',
    title: 'Multi-Level Flight Simulators & Trivia Gauntlet',
    subtitle: 'Step 5 of 5 // Cadet Training Arcade',
    description:
      'Pilot Eagle across 3 landing sites with collectible fuel pods, drag-and-launch probes in a 3-level Gravity Slingshot puzzle, rescue hardware in 3D Zero-G with thruster impulses, or lock frequencies in the Signal Decoder & Trivia Gauntlet!',
    targetTab: 'games',
    tip: 'Click your Cadet Rank in the top bar anytime to view your 16 unlockable badges and download your official COSMOSIS PNG Diploma!',
    icon: '🎮',
  },
];

export const SOLAR_SYSTEM_PLANETS: PlanetData[] = [
  {
    id: 'sun',
    name: 'The Sun (Sol)',
    subtitle: 'G2V Yellow Dwarf Main-Sequence Star',
    category: 'Star',
    color: '#f59e0b',
    accentColor: '#fef08a',
    radiusScale: 2.2,
    orbitRadius: 0,
    orbitSpeed: 0,
    gravityRatio: 27.9,
    distanceFromSun: '0 km (System Barycenter)',
    dayLength: '25.4 days (equator) / 35 days (poles)',
    yearLength: '225–250 Million years (Galactic Year)',
    avgTemp: '5,500°C photosphere / 15,000,000°C core',
    moonsCount: 0,
    escapeVelocity: '617.7 km/s',
    orbitalSpeed: '230 km/s (around Milky Way center)',
    axialTilt: '7.25°',
    lightTimeFromSun: '0 sec (8 min 20 sec to Earth)',
    atmosphereComposition: [
      { gas: 'Hydrogen (H₂)', percent: 73.4, color: '#f59e0b' },
      { gas: 'Helium (He)', percent: 25.0, color: '#fde047' },
      { gas: 'Oxygen, Carbon, Neon & Iron', percent: 1.6, color: '#38bdf8' },
    ],
    internalLayers: [
      { layer: 'Thermonuclear Core (0–25% radius)', detail: '15 million °C plasma at 265 billion bar pressure; fuses 600 million tons of hydrogen into helium every second.' },
      { layer: 'Radiative Zone (25–70% radius)', detail: 'So dense that gamma-ray photons bounce trillions of times, taking ~100,000 years to escape!' },
      { layer: 'Convective Zone (70–100% radius)', detail: 'Boiling columns of plasma rising and sinking like a lava lamp, creating Texas-sized granulation cells on the surface.' },
      { layer: 'Photosphere, Chromosphere & Corona', detail: 'The visible surface (5,500°C) surrounded by the mysteriously superheated outer Corona (1,000,000 to 2,000,000°C)!' },
    ],
    deepDiveHistory:
      'Born 4.6 billion years ago from the gravitational collapse of a giant molecular cloud, the Sun contains 99.86% of all mass in the Solar System. In about 5 billion years, it will exhaust its core hydrogen, swell into a Red Giant engulfing Mercury and Venus, and finally leave behind a glowing Earth-sized White Dwarf.',
    kidFriendlyAnalogy:
      'If the Sun were as tall as a typical front door, Earth would be the size of a nickel—and you could fit 1.3 million Earths inside the Sun!',
    beginnerSummary:
      'The Sun is a colossal magnetic sphere of glowing plasma that holds the entire Solar System together with its gravity. Every second, nuclear fusion in its core converts 4 million tons of matter into pure radiant energy—warming Earth, driving our weather, and powering photosynthesis.',
    funFacts: [
      'Light takes 8 minutes and 20 seconds to travel 149.6 million km from the Sun to your eyes on Earth.',
      'A photon born in the Sun’s core takes ~100,000 years to zig-zag to the surface before racing to Earth in 8 minutes!',
      'The Sun’s outer atmosphere (the Corona) is 300 times hotter than its surface—over 2,000,000°C—due to magnetic Alfvén waves!',
      'Sunspots look dark only by contrast; an isolated sunspot (3,500°C) would shine brighter than the full Moon!',
      'Every 11 years, the Sun’s North and South magnetic poles completely flip places during the Solar Cycle.',
      'NASA’s Parker Solar Probe flew right through the solar corona at 692,000 km/h, protected by a 11.4 cm carbon-composite shield.',
      'The Sun loses about 1.5 million tons of material every second through the outward-blowing Solar Wind.',
      'Your body would weigh 27.9 times more at the Sun’s photosphere—a 50 kg student would weigh 1,395 kg!',
    ],
    activeMissions: ['Parker Solar Probe', 'Solar Orbiter (ESA/NASA)', 'SDO', 'SOHO'],
    quizQuestions: [
      {
        question: 'How does the Sun generate its colossal output of light and heat?',
        options: [
          'Burning coal and oxygen like a chemical fire',
          'Nuclear fusion squeezing hydrogen nuclei into helium in its core',
          'Radioactive decay of uranium in its crust',
          'Friction from asteroids hitting its surface',
        ],
        correctIndex: 1,
        explanation:
          'Extreme temperature (15 million °C) and pressure in the core fuse 600 million tons of hydrogen into helium every second via the proton-proton chain!',
      },
      {
        question: 'Roughly what percentage of the entire Solar System’s mass is inside the Sun?',
        options: ['50%', '75%', '99.86%', '12.5%'],
        correctIndex: 2,
        explanation:
          'The Sun holds a staggering 99.86% of all matter in the Solar System—all 8 planets, moons, and asteroids combined make up just 0.14%!',
      },
      {
        question: 'Why does the Sun spin faster at its equator (25 days) than at its poles (35 days)?',
        options: [
          'Because it is a fluid ball of plasma rather than a solid rock ("Differential Rotation")',
          'Because Mercury pulls on the equator',
          'Because the poles are frozen solid ice',
          'Because solar wind only blows from the poles',
        ],
        correctIndex: 0,
        explanation:
          'Since the Sun is made of ionized gas (plasma) and not solid rock, different latitudes rotate at different speeds—twisting magnetic field lines until they snap as solar flares!',
      },
      {
        question: 'How long does sunlight take to travel from the Sun’s surface to Earth?',
        options: ['Instantaneously (0 seconds)', '1.3 seconds', '8 minutes and 20 seconds', '4.2 years'],
        correctIndex: 2,
        explanation:
          'At 299,792 km/s, light crosses the 149.6 million km (1 AU) gap between the Sun and Earth in 499 seconds (8 minutes, 19 seconds).',
      },
    ],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    subtitle: 'The Iron-Core Sun-Scorched World',
    category: 'Terrestrial Planet',
    color: '#94a3b8',
    accentColor: '#cbd5e1',
    radiusScale: 0.42,
    orbitRadius: 3.6,
    orbitSpeed: 1.6,
    gravityRatio: 0.38,
    distanceFromSun: '57.9 Million km (0.39 AU)',
    dayLength: '58.6 Earth days (rotation) / 176 days (sunrise-to-sunrise)',
    yearLength: '88 Earth days',
    avgTemp: '+430°C day / -180°C night',
    moonsCount: 0,
    escapeVelocity: '4.25 km/s',
    orbitalSpeed: '47.36 km/s (Fastest planet!)',
    axialTilt: '0.03° (Nearly upright!)',
    lightTimeFromSun: '3.2 minutes',
    atmosphereComposition: [
      { gas: 'Oxygen (Exosphere)', percent: 42.0, color: '#38bdf8' },
      { gas: 'Sodium (Na)', percent: 29.0, color: '#f59e0b' },
      { gas: 'Hydrogen & Helium', percent: 29.0, color: '#94a3b8' },
    ],
    internalLayers: [
      { layer: 'Enormous Metallic Core (85% of radius!)', detail: 'Unlike Earth, Mercury’s iron-nickel core takes up nearly the entire planet—about 4,100 km across!' },
      { layer: 'Thin Silicate Mantle (400 km thick)', detail: 'A relatively thin rocky shell that was likely stripped away by a giant proto-planet collision 4.5 billion years ago.' },
      { layer: 'Cratered Crust & Lobate Scarps', detail: 'Wrinkled cliff ridges up to 3 km high formed as Mercury’s core cooled and the entire planet shrank by ~14 km!' },
    ],
    deepDiveHistory:
      'Named after the swift Roman messenger god because it darts across the sky faster than any other planet (47.4 km/s). NASA’s Mariner 10 and MESSENGER probes revealed that Mercury has a global magnetic field and billions of tons of water ice hidden in permanently shadowed polar craters.',
    kidFriendlyAnalogy:
      'Mercury is basically a giant iron cannonball wrapped in a thin crust of Moon-like rock—slightly smaller than Jupiter’s moon Ganymede!',
    beginnerSummary:
      'Mercury is the smallest and innermost planet of the Solar System. Because solar wind strips away its air (leaving only a whisper-thin exosphere), there is nothing to hold heat overnight—giving Mercury the wildest temperature swing of any planet (610°C difference between day and night)!',
    funFacts: [
      'Despite baking at 430°C in daylight, Mercury has pure water ice inside deep polar craters that never see sunlight!',
      'Mercury is actively shrinking! As its giant iron core cools, the surface wrinkles into mile-high cliffs called "lobate scarps."',
      'Its metallic iron core makes up 85% of the planet’s radius (compared to 55% for Earth).',
      'The Caloris Basin impact crater on Mercury is 1,550 km wide—large enough to fit the entire state of Texas and California combined!',
      'The shockwave from the Caloris impact was so violent it focused through the planet and crumpled the terrain on the exact opposite side ("Weird Terrain")!',
      'Mercury has a comet-like tail of glowing sodium atoms blown millions of kilometers into space by solar radiation pressure.',
      'Because of its eccentric orbit and slow spin, if you stood on Mercury, the Sun would sometimes appear to pause, move backwards, and resume rising!',
      'Mercury has zero moons and zero rings because the Sun’s nearby gravity would destabilize them.',
    ],
    activeMissions: ['BepiColombo (ESA/JAXA Dual Orbiter)', 'MESSENGER (NASA Historic)'],
    quizQuestions: [
      {
        question: 'Why does Mercury plunge to -180°C at night despite being the closest planet to the Sun?',
        options: [
          'It is covered in nitrogen oceans',
          'It lacks a substantial atmosphere to trap and circulate heat',
          'Its iron core absorbs all sunlight',
          'It is shadowed by Venus every night',
        ],
        correctIndex: 1,
        explanation:
          'Without a greenhouse atmosphere to act as a thermal blanket, heat radiates straight back into the vacuum of space as soon as the Sun sets.',
      },
      {
        question: 'How is it possible that water ice exists on scorching-hot Mercury?',
        options: [
          'Because Mercury has almost zero axial tilt (0.03°), deep craters at its poles stay in permanent shadow at -170°C',
          'The ice is made of hot plastic',
          'Underground geysers freeze every afternoon',
          'Astronauts left water tanks there',
        ],
        correctIndex: 0,
        explanation:
          'Confirmed by NASA’s MESSENGER spacecraft, craters at Mercury’s North and South poles never receive direct sunlight, trapping comet-delivered water ice for billions of years!',
      },
      {
        question: 'What unusual structure makes up about 85% of Mercury’s radius?',
        options: [
          'A hollow cavern',
          'A liquid methane ocean',
          'A massive iron-nickel metallic core',
          'Solid diamond',
        ],
        correctIndex: 2,
        explanation:
          'Mercury has the highest iron content of any planet, with an enormous metallic core spanning 85% of its radius.',
      },
      {
        question: 'What are "lobate scarps" on Mercury’s surface?',
        options: [
          'Ancient riverbeds',
          'Giant cliff wrinkles formed as Mercury’s core cooled and the planet contracted',
          'Sand dunes blown by hurricanes',
          'Lava tubes built by volcanoes yesterday',
        ],
        correctIndex: 1,
        explanation:
          'As Mercury’s interior cooled over billions of years, its radius shrank by ~7 km, buckling the brittle crust into long thrust-fault cliffs.',
      },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    subtitle: 'Earth’s Runaway Greenhouse Twin',
    category: 'Terrestrial Planet',
    color: '#eab308',
    accentColor: '#fde047',
    radiusScale: 0.68,
    orbitRadius: 5.2,
    orbitSpeed: 1.15,
    gravityRatio: 0.9,
    distanceFromSun: '108.2 Million km (0.72 AU)',
    dayLength: '243 Earth days (Retrograde—spins backwards!)',
    yearLength: '224.7 Earth days',
    avgTemp: '+475°C (Hottest planet in Solar System!)',
    moonsCount: 0,
    escapeVelocity: '10.36 km/s',
    orbitalSpeed: '35.02 km/s',
    axialTilt: '177.36° (Upside down!)',
    lightTimeFromSun: '6.0 minutes',
    atmosphereComposition: [
      { gas: 'Carbon Dioxide (CO₂)', percent: 96.5, color: '#f59e0b' },
      { gas: 'Nitrogen (N₂)', percent: 3.5, color: '#38bdf8' },
    ],
    internalLayers: [
      { layer: 'Super-Dense CO₂ Atmosphere & Sulfuric Clouds', detail: 'Surface pressure is 92 bar (92 times Earth’s)—equivalent to being 900 meters deep in Earth’s ocean!' },
      { layer: 'Basaltic Volcanic Crust', detail: 'Home to over 85,000 volcanoes, pancake domes, and arachnoid lava structures—more volcanoes than any other planet!' },
      { layer: 'Rocky Silicate Mantle & Iron Core', detail: 'Similar in size and density to Earth’s interior, but lacking plate tectonics.' },
    ],
    deepDiveHistory:
      'Early in Solar System history, Venus may have had shallow liquid water oceans for up to 2 billion years. As the young Sun brightened, water evaporated, triggering a runaway greenhouse effect that baked carbon dioxide out of the rocks. Soviet Venera landers in the 1970s–80s survived up to 127 minutes on its surface, sending back the only photos ever taken from Venusian ground.',
    kidFriendlyAnalogy:
      'Standing on Venus feels like being crushed 900 meters underwater while inside a 475°C self-cleaning pizza oven where the clouds rain battery acid!',
    beginnerSummary:
      'Venus is 95% the width of Earth and 90% our gravity, earning it the title "Earth’s Twin." Yet its choking 96.5% carbon dioxide atmosphere traps solar heat so fiercely that Venus is even hotter than Mercury—hot enough to melt lead, zinc, and tin in the shade!',
    funFacts: [
      'Venus spins backwards (retrograde) so slowly that one sidereal rotation (243 Earth days) takes longer than its entire orbit around the Sun (225 Earth days)!',
      'Venus has more volcanoes than any other planet in the Solar System—over 85,000 mapped by radar!',
      'At 50–55 km altitude above Venus’s clouds, the air pressure (1 bar) and temperature (20–30°C) are the most Earth-like anywhere in the Solar System!',
      'It rains sulfuric acid in Venus’s upper atmosphere, but the intense heat evaporates the acid droplets at 25 km altitude before they ever touch the ground ("virga").',
      'Because the air at the surface is so dense (65 kg/m³), a gentle 3 km/h breeze on Venus pushes with the force of a strong gale and can roll pebbles!',
      'After the Sun and the Moon, Venus is the brightest natural object in Earth’s sky, shining up to magnitude -4.9 ("The Morning/Evening Star").',
      'The Soviet Venera 13 lander survived 127 minutes in 457°C heat and 89 atmospheres of pressure in 1982, recording color panoramas and wind sounds.',
      'Radar from the Magellan spacecraft discovered that high mountain peaks on Venus (like Maxwell Montes) are coated in reflective " metallic snow" made of lead sulfide and bismuth sulfide!',
    ],
    activeMissions: ['Akatsuki (JAXA)', 'DAVINCI & VERITAS (Upcoming NASA)', 'EnVision (ESA)'],
    quizQuestions: [
      {
        question: 'Why is Venus (+475°C) hotter than Mercury (+430°C), even though Venus is nearly twice as far from the Sun?',
        options: [
          'Venus has a nuclear reactor core',
          'Venus’s thick 96.5% carbon dioxide atmosphere creates a runaway greenhouse effect that traps infrared heat',
          'Venus is closer to Jupiter’s radiation belt',
          'Venus spins 100 times faster than Earth',
        ],
        correctIndex: 1,
        explanation:
          'Venus’s ultra-dense CO₂ atmosphere acts like a one-way thermal blanket, trapping solar energy and heating the entire globe—day and night, pole to pole—to ~475°C.',
      },
      {
        question: 'What is strange about the direction Venus rotates on its axis?',
        options: [
          'It rotates backwards (retrograde, East to West), so the Sun rises in the West and sets in the East',
          'It flips upside down every 24 hours',
          'It only rotates when comets hit it',
          'It rotates North to South',
        ],
        correctIndex: 0,
        explanation:
          'Venus has an axial tilt of 177.36°, meaning it spins clockwise (retrograde) when viewed from above its north pole—the opposite of Earth and most other planets.',
      },
      {
        question: 'How strong is the atmospheric pressure on the surface of Venus compared to Earth?',
        options: [
          'Half of Earth’s pressure',
          'Exactly the same as Earth (1 bar)',
          '92 times Earth’s atmospheric pressure (like being 900 meters underwater)',
          'Zero pressure (vacuum)',
        ],
        correctIndex: 2,
        explanation:
          'Venus’s crushing 92-bar atmosphere flattened early unreinforced space probes before they could even reach the ground!',
      },
      {
        question: 'What are the reflective "snowcaps" on Venus’s tallest mountains (Maxwell Montes) actually made of?',
        options: [
          'Frozen water snow',
          'Dry ice (frozen carbon dioxide)',
          'Heavy metal frost (lead sulfide and bismuth sulfide) condensing out of the hot air',
          'White quartz sand',
        ],
        correctIndex: 2,
        explanation:
          'At 475°C, metallic compounds vaporize in the lowlands and condense as shiny, radar-bright metallic frost on the cooler high-altitude mountain peaks!',
      },
    ],
  },
  {
    id: 'earth',
    name: 'Earth & The Moon',
    subtitle: 'The Ocean World & Its Stabilizing Companion',
    category: 'Terrestrial Planet',
    color: '#0ea5e9',
    accentColor: '#38bdf8',
    radiusScale: 0.72,
    orbitRadius: 7.0,
    orbitSpeed: 0.9,
    gravityRatio: 1.0,
    distanceFromSun: '149.6 Million km (1.00 AU)',
    dayLength: '23 hours, 56 minutes, 4 seconds',
    yearLength: '365.256 days',
    avgTemp: '+15°C global average',
    moonsCount: 1,
    escapeVelocity: '11.186 km/s',
    orbitalSpeed: '29.78 km/s (107,200 km/h)',
    axialTilt: '23.44° (Creates our 4 seasons!)',
    lightTimeFromSun: '8 minutes, 20 seconds',
    atmosphereComposition: [
      { gas: 'Nitrogen (N₂)', percent: 78.08, color: '#38bdf8' },
      { gas: 'Oxygen (O₂)', percent: 20.95, color: '#10b981' },
      { gas: 'Argon, CO₂ & Water Vapor', percent: 0.97, color: '#94a3b8' },
    ],
    internalLayers: [
      { layer: 'Solid Inner Iron Core (1,220 km radius)', detail: 'Spins at 5,400°C—as hot as the surface of the Sun—kept solid by 3.6 million atmospheres of pressure.' },
      { layer: 'Liquid Outer Iron-Nickel Core (2,260 km thick)', detail: 'Churning liquid metal currents act as a geodynamo, generating Earth’s protective Magnetic Field (Magnetosphere)!' },
      { layer: 'Convecting Silicate Mantle (2,900 km thick)', detail: 'Slowly flowing hot rock that drives plate tectonics, recycling carbon and building continents and mountains.' },
      { layer: 'Oceanic & Continental Crust + Hydrosphere', detail: '71% covered in liquid water oceans, topped by an oxygen-rich atmosphere and stratospheric ozone shield.' },
    ],
    deepDiveHistory:
      'About 4.5 billion years ago, a Mars-sized proto-planet named Theia slammed into young Earth at a glancing angle, blasting vaporized rock into orbit that coalesced into our Moon. The Moon’s strong gravitational pull stabilizes Earth’s 23.44° axial tilt, preventing chaotic climate swings and driving ocean tides.',
    kidFriendlyAnalogy:
      'Earth is a cosmic spaceship cruising around the Sun at 107,200 km/h—protected by both an invisible magnetic forcefield and a stratospheric ozone umbrella!',
    beginnerSummary:
      'Earth is the largest rocky planet in the Solar System and the only world known to harbor life, active plate tectonics, and stable surface oceans of liquid water. Together with our unusually large Moon (1/4th Earth’s width!), Earth forms a dynamic double-world system.',
    funFacts: [
      'Earth is the densest planet in the entire Solar System at 5.514 grams per cubic centimeter!',
      'Because of centrifugal force from spinning at 1,670 km/h at the equator, Earth bulges slightly—making you 0.5% lighter at the equator than at the poles!',
      'Although Mount Everest is the highest peak above sea level, Chimborazo in Ecuador is the farthest point from Earth’s center due to the equatorial bulge!',
      'Our Moon is spiraling away from Earth at 3.8 centimeters per year—measured to millimeter precision by bouncing lasers off Apollo 11, 14, and 15 mirrors!',
      'Earth’s magnetic field deflects 400 km/s solar wind particles toward the poles, where they excite oxygen and nitrogen atoms to glow as the Aurora Borealis and Aurora Australis.',
      '97% of Earth’s water is salty ocean water; of the remaining 3% freshwater, over two-thirds is locked in glaciers and polar ice caps.',
      'For the first 2 billion years of Earth’s history, there was almost zero oxygen in the air—until photosynthetic cyanobacteria triggered the "Great Oxidation Event"!',
      'The Kármán Line at 100 kilometers altitude is the internationally recognized boundary where Earth’s atmosphere ends and outer space begins.',
    ],
    activeMissions: ['International Space Station (ISS)', 'Artemis Lunar Program', 'SWOT', 'PACE', 'Landsat 9'],
    quizQuestions: [
      {
        question: 'What generates Earth’s protective magnetic shield (the Magnetosphere)?',
        options: [
          'The Moon’s gravity pulling on the oceans',
          'Swirling currents of liquid iron and nickel in Earth’s outer core ("The Geodynamo")',
          'Wind blowing across the Sahara Desert',
          'Solar panels on satellites in orbit',
        ],
        correctIndex: 1,
        explanation:
          'Convection and Coriolis rotation inside Earth’s 2,260-km-thick liquid iron outer core generate electric currents that project a magnetic bubble thousands of kilometers into space.',
      },
      {
        question: 'What causes Earth to experience Spring, Summer, Autumn, and Winter?',
        options: [
          'Earth getting much closer to and farther from the Sun every 3 months',
          'Earth’s 23.44-degree axial tilt tipping each hemisphere toward or away from the Sun during its orbit',
          'The Sun pulsing hotter in July and cooler in January',
          'Jupiter blocking sunlight in winter',
        ],
        correctIndex: 1,
        explanation:
          'Earth’s orbit is nearly circular (in fact, Earth is slightly closer to the Sun in January!). Seasons happen because our 23.44° tilt changes the angle and duration of sunlight hitting each hemisphere.',
      },
      {
        question: 'How do planetary scientists believe Earth’s unusually large Moon formed 4.5 billion years ago?',
        options: [
          'A Mars-sized proto-planet named "Theia" collided with young Earth, ejecting debris that coalesced into the Moon',
          'Earth captured a passing comet from Neptune',
          'Volcanoes on Earth launched the Moon into space',
          'It was built out of asteroids in the 1800s',
        ],
        correctIndex: 0,
        explanation:
          'Apollo lunar rock samples showed oxygen isotope ratios identical to Earth’s mantle, confirming the "Giant Impact Hypothesis" with proto-planet Theia!',
      },
      {
        question: 'Which gas makes up the largest percentage (78%) of Earth’s atmosphere?',
        options: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Hydrogen (H₂)'],
        correctIndex: 2,
        explanation:
          'Earth’s dry air is 78.08% Nitrogen, 20.95% Oxygen, 0.93% Argon, and ~0.04% Carbon Dioxide.',
      },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    subtitle: 'The Red Planet of Rovers, Canyons & Ancient Lakes',
    category: 'Terrestrial Planet',
    color: '#ef4444',
    accentColor: '#fca5a5',
    radiusScale: 0.56,
    orbitRadius: 8.8,
    orbitSpeed: 0.72,
    gravityRatio: 0.38,
    distanceFromSun: '227.9 Million km (1.52 AU)',
    dayLength: '24 hours, 39 minutes, 35 seconds (1 Sol)',
    yearLength: '687 Earth days (1.88 Earth years)',
    avgTemp: '-65°C average (-140°C winter poles to +20°C summer equator)',
    moonsCount: 2,
    escapeVelocity: '5.03 km/s',
    orbitalSpeed: '24.07 km/s',
    axialTilt: '25.19° (Very similar to Earth’s 23.4°!)',
    lightTimeFromSun: '12.7 minutes (3 to 22 minutes from Earth)',
    atmosphereComposition: [
      { gas: 'Carbon Dioxide (CO₂)', percent: 95.3, color: '#ef4444' },
      { gas: 'Nitrogen (N₂)', percent: 2.6, color: '#38bdf8' },
      { gas: 'Argon & Oxygen traces', percent: 2.1, color: '#f59e0b' },
    ],
    internalLayers: [
      { layer: 'Iron-Nickel-Sulfur Liquid Core (~1,830 km radius)', detail: 'Measured by NASA’s InSight seismometer; cooled early on, shutting down Mars’s global magnetic field ~4 billion years ago.' },
      { layer: 'Silicate Mantle', detail: 'Lacks active plate tectonics, allowing single hotspots to build gargantuan shield volcanoes like Olympus Mons over hundreds of millions of years!' },
      { layer: 'Iron-Oxide Regolith & Cryosphere Crust', detail: 'Rich in rusted iron minerals, perchlorate salts, ancient clay river deltas, and vast subsurface water-ice glaciers.' },
    ],
    deepDiveHistory:
      'During the Noachian epoch 3.8 billion years ago, Mars had a thicker atmosphere, a global magnetic shield, rainfall, rivers, and an ocean covering its northern lowlands. After its core cooled and its magnetic field faded, solar wind stripped away 99% of its atmosphere—leaving a cold, arid desert that preserves ancient lakebeds like Jezero Crater.',
    kidFriendlyAnalogy:
      'Mars has the exact same total dry land surface area as Earth (because Earth is 71% covered in ocean)—and you could jump nearly 3 times higher on Mars!',
    beginnerSummary:
      'Mars is the most explored planet beyond Earth and the only known world inhabited entirely by robots! Its rusty red dust, towering volcanoes, 4,000-km-long canyon system, and polar ice caps hold the keys to whether microbial life ever arose on another planet.',
    funFacts: [
      'Olympus Mons on Mars is the tallest volcano in the Solar System at 21.9 km high—nearly 3 times the height of Mount Everest!',
      'Valles Marineris is a canyon system 4,000 km long, 200 km wide, and 7 km deep—it would stretch from New York to Los Angeles and makes the Grand Canyon look like a tiny scratch!',
      'Mars has two potato-shaped moons, Phobos (22 km wide) and Deimos (12 km wide). Phobos orbits so close (6,000 km) that it rises in the West and sets in the East twice a day!',
      'In about 30 to 50 million years, Martian tidal gravity will tear Phobos apart, giving Mars its own rocky ring system!',
      'NASA’s Perseverance rover carries MOXIE, a toaster-sized device that successfully breathed in Martian CO₂ air and converted it into pure breathable oxygen for future astronauts!',
      'The 1.8 kg Ingenuity Mars Helicopter completed 72 autonomous flights over 3 years—even though Martian air is only 1% as dense as Earth’s at sea level!',
      'Mars’s giant Borealis Basin covers 40% of the planet and may be the largest impact crater in the Solar System.',
      'During Martian winter, up to 30% of the entire atmosphere freezes out of the sky as solid dry-ice (CO₂) snow onto the polar cap!',
    ],
    activeMissions: ['Perseverance Rover', 'Curiosity Rover', 'MRO', 'MAVEN', 'Mars Express', 'Hope Orbiter'],
    quizQuestions: [
      {
        question: 'Why was Mars able to grow volcanoes like Olympus Mons nearly 3 times taller than Mount Everest?',
        options: [
          'Mars has lower gravity (0.38g) and no moving tectonic plates, so lava piled up over the exact same hotspot for hundreds of millions of years',
          'Martian lava is made of lightweight styrofoam',
          'Asteroids stacked rocks into a pile',
          'The Sun pulls the volcano upward',
        ],
        correctIndex: 0,
        explanation:
          'On Earth, moving tectonic plates carry the crust away from mantle hotspots (creating chains like Hawaii). On Mars, the stationary crust sat over one giant magma plume for ages!',
      },
      {
        question: 'What happened to most of Mars’s ancient thick atmosphere and liquid surface water?',
        options: [
          'Jupiter sucked it all away last year',
          'When Mars’s smaller core cooled and lost its global magnetic field, the Solar Wind stripped away most of the atmosphere',
          'It turned into gold dust',
          'Phobos drank the oceans',
        ],
        correctIndex: 1,
        explanation:
          'NASA’s MAVEN orbiter confirmed that without a global magnetosphere, solar wind ions sputter and strip gas molecules from Mars’s upper atmosphere into space.',
      },
      {
        question: 'What did NASA’s MOXIE experiment aboard the Perseverance rover prove for future human explorers?',
        options: [
          'That trees can grow outdoors in Martian soil today',
          'That breathable oxygen (O₂) and rocket oxidizer can be manufactured directly from Mars’s 95% carbon dioxide (CO₂) atmosphere',
          'That Mars has underground oil wells',
          'That Martian wind can power steam locomotives',
        ],
        correctIndex: 1,
        explanation:
          'MOXIE used solid-oxide electrolysis to split CO₂ into breathable O₂—essential so future astronauts don’t have to haul all their return-trip rocket oxygen from Earth!',
      },
      {
        question: 'What color is the sky right around the Sun during a Martian sunset?',
        options: ['Bright neon green', 'Bluish-white', 'Pitch black', 'Purple polka-dotted'],
        correctIndex: 1,
        explanation:
          'Fine iron-rich dust suspended in Mars’s atmosphere scatters red light across the daytime sky but scatters blue light in the forward direction around the setting Sun!',
      },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'King of Planets & Gravitational Shield of the Inner Worlds',
    category: 'Gas Giant',
    color: '#d97706',
    accentColor: '#fcd34d',
    radiusScale: 1.45,
    orbitRadius: 11.4,
    orbitSpeed: 0.45,
    gravityRatio: 2.53,
    distanceFromSun: '778.5 Million km (5.20 AU)',
    dayLength: '9 hours, 55 minutes, 30 seconds (Fastest planet spin!)',
    yearLength: '11.86 Earth years',
    avgTemp: '-110°C upper clouds / +24,000°C deep core',
    moonsCount: 95,
    escapeVelocity: '59.5 km/s',
    orbitalSpeed: '13.07 km/s',
    axialTilt: '3.13° (Almost no seasonal tilt)',
    lightTimeFromSun: '43.2 minutes',
    atmosphereComposition: [
      { gas: 'Hydrogen (H₂)', percent: 89.8, color: '#f59e0b' },
      { gas: 'Helium (He)', percent: 10.0, color: '#fde047' },
      { gas: 'Methane, Ammonia & Water', percent: 0.2, color: '#38bdf8' },
    ],
    internalLayers: [
      { layer: 'Ammonia, Ammonium Hydrosulfide & Water Cloud Decks (50 km)', detail: 'Swirling cream Zones (rising gas) and reddish-brown Belts (sinking gas) whipped by 600 km/h jet streams.' },
      { layer: 'Liquid Molecular Hydrogen Layer (20,000 km deep)', detail: 'Increasing pressure gradually squeezes hydrogen gas into a supercritical fluid—there is no solid ground!' },
      { layer: 'Liquid Metallic Hydrogen Ocean (40,000 km deep!)', detail: 'At 2 million bar pressure, electrons are squeezed free from hydrogen atoms, creating a conducting liquid metal ocean that generates the strongest planetary magnetic field in the Solar System!' },
      { layer: 'Fuzzy / Diluted Heavy-Element Core', detail: 'NASA’s Juno probe discovered Jupiter’s core isn’t a small hard rock, but a "diluted" mix of rock, ice, and metallic hydrogen spanning up to half the planet’s radius.' },
    ],
    deepDiveHistory:
      'Jupiter was the very first planet to form after the Sun, sweeping up primordial hydrogen and helium gas before the solar wind could blow it away. In 1610, Galileo Galilei pointed his homemade telescope at Jupiter and discovered its four large moons—Io, Europa, Ganymede, and Callisto—proving for the first time that not everything in the cosmos orbits Earth!',
    kidFriendlyAnalogy:
      'Jupiter is 2.5 times more massive than all the other planets combined—its Great Red Spot storm alone is wider than the entire planet Earth!',
    beginnerSummary:
      'Jupiter is a gargantuan gas giant with 95 known moons, faint dust rings, auroras 100 times brighter than Earth’s, and a deep ocean of liquid metallic hydrogen. Its four Galilean moons form a miniature solar system of volcanic and ocean worlds.',
    funFacts: [
      'Despite being 11 times wider than Earth, Jupiter spins once in just 9 hours and 55 minutes—its equator whips around at 45,300 km/h, flattening the planet by 6.5%!',
      'Jupiter’s Great Red Spot is a high-pressure anticyclone with 650 km/h winds that has been raging for at least 350+ years and extends 300–500 km deep!',
      'Jupiter’s moon Ganymede (5,268 km wide) is the largest moon in the Solar System—bigger than the planet Mercury—and the only moon with its own magnetic field!',
      'Jupiter’s icy moon Europa hides a 100-km-deep global liquid saltwater ocean beneath its ice crust containing twice as much liquid water as all of Earth’s oceans combined!',
      'Jupiter’s innermost large moon, Io, is flexed so violently by tidal gravity that its solid rock surface rises and falls by 100 meters (like ocean tides made of rock!), powering 400+ active volcanoes.',
      'In July 1994, Jupiter’s gravity tore Comet Shoemaker-Levy 9 into 21 fragments that slammed into Jupiter at 60 km/s, leaving dark Earth-sized scars in its clouds.',
      'Jupiter’s magnetosphere is the largest structure in the Solar System (after the Sun’s heliosphere)—if it glowed in visible light, it would look 3 times wider than the full Moon in our night sky!',
      'NASA’s Juno spacecraft orbits Jupiter using three giant tractor-trailer-sized solar arrays—the farthest solar-powered probe in history!',
    ],
    activeMissions: ['Juno Orbiter (NASA)', 'Europa Clipper (NASA)', 'JUICE (ESA Jupiter Icy Moons Explorer)'],
    quizQuestions: [
      {
        question: 'What exotic material inside Jupiter generates its gargantuan magnetic field (20,000 times stronger than Earth’s)?',
        options: [
          'A giant permanent iron bar magnet',
          'A deep ocean of "Liquid Metallic Hydrogen" created where extreme pressure squeezes electrons free from hydrogen atoms',
          'Burning methane clouds',
          'Asteroids stuck in its rings',
        ],
        correctIndex: 1,
        explanation:
          'At pressures above 2 million atmospheres inside Jupiter, hydrogen behaves like an electrically conducting liquid metal. Combined with Jupiter’s 10-hour spin, it powers a monster dynamo!',
      },
      {
        question: 'Why did Galileo’s discovery of Jupiter’s four largest moons (Io, Europa, Ganymede, Callisto) in 1610 revolutionize science?',
        options: [
          'It provided direct observational proof that objects in space can orbit a body other than Earth',
          'It proved Jupiter is made of cheese',
          'It showed that moons are square',
          'It allowed sailors to breathe in space',
        ],
        correctIndex: 0,
        explanation:
          'Seeing four worlds clearly orbiting Jupiter shattered the ancient geocentric belief that every celestial body had to revolve around Earth.',
      },
      {
        question: 'What heats the subsurface ocean of Europa and drives the 400+ volcanoes on Io so far from the Sun?',
        options: [
          'Sunlight magnified by Jupiter’s rings',
          'Tidal flexing—gravitational tug-of-war between Jupiter and its neighboring moons stretching and kneading their interiors',
          'Coal fires inside the moons',
          'Warm winds blowing from Jupiter',
        ],
        correctIndex: 1,
        explanation:
          'Io, Europa, and Ganymede are locked in a 4:2:1 orbital resonance. As Jupiter’s massive gravity flexes their interiors every orbit, internal friction generates enormous geothermal heat!',
      },
      {
        question: 'Which planet in the Solar System has the shortest day (fastest rotation)?',
        options: ['Mercury', 'Earth', 'Jupiter (9 hours, 55 minutes)', 'Neptune'],
        correctIndex: 2,
        explanation:
          'Jupiter completes a full rotation in just under 10 hours, causing a noticeable equatorial bulge.',
      },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    subtitle: 'The Ringed Jewel & Kingdom of 146 Moons',
    category: 'Gas Giant',
    color: '#eab308',
    accentColor: '#fef08a',
    radiusScale: 1.22,
    orbitRadius: 14.2,
    orbitSpeed: 0.32,
    hasRings: true,
    gravityRatio: 1.07,
    distanceFromSun: '1.43 Billion km (9.58 AU)',
    dayLength: '10 hours, 33 minutes, 38 seconds',
    yearLength: '29.45 Earth years',
    avgTemp: '-140°C cloud tops',
    moonsCount: 146,
    escapeVelocity: '35.5 km/s',
    orbitalSpeed: '9.68 km/s',
    axialTilt: '26.73° (Lets us see the rings tilt open and edge-on!)',
    lightTimeFromSun: '79.3 minutes (1 hour 19 min)',
    atmosphereComposition: [
      { gas: 'Hydrogen (H₂)', percent: 96.3, color: '#eab308' },
      { gas: 'Helium (He)', percent: 3.25, color: '#fef08a' },
      { gas: 'Methane & Ammonia', percent: 0.45, color: '#38bdf8' },
    ],
    internalLayers: [
      { layer: 'Golden Ammonia & Water Ice Cloud Decks', detail: 'Driven by 1,800 km/h equatorial winds and crowned by a 30,000-km-wide hexagonal jet stream at the North Pole.' },
      { layer: 'Liquid Hydrogen & Helium Envelope', detail: 'Gradually transitions from gas to liquid under crushing pressure; helium droplets rain downward toward the core!' },
      { layer: 'Metallic Hydrogen & Rocky/Icy Core', detail: 'A dense core 10–20 times the mass of Earth surrounded by metallic hydrogen.' },
      { layer: 'Main Ring System (282,000 km diameter, ~10 meters thick!)', detail: '7 ring groups (D, C, B, Cassini Division, A, F, G, E) made of 99% pure water-ice chunks from dust grains to house-sized icebergs.' },
    ],
    deepDiveHistory:
      'Saturn is the farthest planet easily visible to the naked human eye and was known to ancient civilizations around the world. From 2004 to 2017, the NASA/ESA/ASI Cassini-Huygens mission orbited Saturn 294 times, parachuted the Huygens lander onto the hydrocarbon-lake world of Titan, and flew directly through the icy water plumes of Enceladus!',
    kidFriendlyAnalogy:
      'Saturn’s rings are 282,000 km wide (almost the distance from Earth to the Moon), yet only 10 meters thick—if you made a model of the rings out of a sheet of paper, the paper would be 10,000 times too thick!',
    beginnerSummary:
      'Saturn holds the crown for the most moons in the Solar System (146 confirmed!) and the most spectacular planetary ring system. Its moons Titan (with liquid methane seas and a thick atmosphere) and Enceladus (shooting hydrothermal ocean geysers into space) are two of NASA’s top targets in the search for life.',
    funFacts: [
      'Saturn’s average density is 0.687 g/cm³—less dense than water (1.0 g/cm³)!',
      'At Saturn’s North Pole spins a permanent six-sided jet stream called "The Hexagon"—each side is longer than the diameter of Earth!',
      'Saturn’s rings are surprisingly young! Cassini measurements suggest an icy moon was shredded inside Saturn’s tidal "Roche Limit" just 100 to 400 million years ago (when dinosaurs walked on Earth).',
      'Saturn’s rings are slowly disappearing ("Ring Rain"), draining an Olympic-sized swimming pool worth of water ice into Saturn’s upper atmosphere every 30 minutes!',
      'Saturn’s largest moon, Titan (5,150 km wide), is the only moon in the Solar System with a thick atmosphere (1.45 bar nitrogen) and liquid lakes, rivers, and rain on its surface (made of liquid methane and ethane at -179°C)!',
      'Because Titan has thick air (4x denser than Earth’s) and low gravity (0.14g), NASA is sending "Dragonfly"—a nuclear-powered 8-rotor flying quadcopter—to hop across Titan’s organic sand dunes!',
      'Saturn’s small snowy moon Enceladus blasts supersonic geysers of salty water, silica nanograins, and organic molecules from a warm subsurface ocean, feeding Saturn’s outer E-ring.',
      'Saturn’s moon Mimas has a giant impact crater (Herschel) that makes it look exactly like the Star Wars Death Star!',
    ],
    activeMissions: ['Dragonfly Titan Rotorcraft (Upcoming NASA)', 'Cassini-Huygens (Historic Flagship)'],
    quizQuestions: [
      {
        question: 'How thick are Saturn’s main rings in most places, despite stretching 282,000 km across?',
        options: [
          'About 10,000 kilometers thick',
          'Only about 10 to 30 meters thick (as tall as a 3-story building!)',
          '1 millimeter thick',
          'The same thickness as Earth',
        ],
        correctIndex: 1,
        explanation:
          'Collisions between ring particles damp out vertical motion, flattening the 282,000-km-wide ring disk into an ultra-thin sheet averaging ~10 meters thick!',
      },
      {
        question: 'What makes Saturn’s largest moon, Titan, unique among all 290+ moons in the Solar System?',
        options: [
          'It is the only moon with a dense nitrogen-rich atmosphere and stable liquid lakes, rivers, and rain on its surface (made of liquid methane/ethane)',
          'It is made of solid gold',
          'It orbits the Sun directly without orbiting Saturn',
          'It is hotter than Venus',
        ],
        correctIndex: 0,
        explanation:
          'The European Huygens probe landed on Titan in 2005, revealing river channels carved by liquid methane rain and rounded water-ice cobbles!',
      },
      {
        question: 'What did the Cassini spacecraft discover spraying out of "Tiger Stripe" fractures at the South Pole of Saturn’s moon Enceladus?',
        options: [
          'Molten iron lava',
          'Plumes of salty water vapor, ice grains, molecular hydrogen, and organic compounds from a warm subsurface ocean',
          'Clouds of pure neon',
          'Solid rock boulders',
        ],
        correctIndex: 1,
        explanation:
          'Cassini flew straight through Enceladus’s plumes and detected molecular hydrogen and microscopic silica grains—direct evidence of hydrothermal vents on an alien ocean floor!',
      },
      {
        question: 'What geometric shape is the giant storm permanently spinning at Saturn’s North Pole?',
        options: ['A perfect triangle', 'A six-sided Hexagon wider than two Earths', 'A figure-eight', 'A square'],
        correctIndex: 1,
        explanation:
          'Discovered by Voyager and imaged in detail by Cassini, Saturn’s north polar jet stream forms a standing six-sided Rossby wave—the famous Hexagon!',
      },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'The Sideways-Rolling Ice Giant',
    category: 'Ice Giant',
    color: '#22d3ee',
    accentColor: '#a5f3fc',
    radiusScale: 0.88,
    orbitRadius: 16.8,
    orbitSpeed: 0.22,
    hasRings: true,
    gravityRatio: 0.89,
    distanceFromSun: '2.87 Billion km (19.2 AU)',
    dayLength: '17 hours, 14 minutes, 24 seconds (Retrograde)',
    yearLength: '84.02 Earth years',
    avgTemp: '-195°C (Coldest planetary atmosphere: -224°C!)',
    moonsCount: 28,
    escapeVelocity: '21.3 km/s',
    orbitalSpeed: '6.80 km/s',
    axialTilt: '97.77° (Tilted completely on its side!)',
    lightTimeFromSun: '2 hours, 40 minutes',
    atmosphereComposition: [
      { gas: 'Hydrogen (H₂)', percent: 82.5, color: '#22d3ee' },
      { gas: 'Helium (He)', percent: 15.2, color: '#a5f3fc' },
      { gas: 'Methane (CH₄ — gives cyan color!)', percent: 2.3, color: '#0284c7' },
    ],
    internalLayers: [
      { layer: 'Hydrogen, Helium & Methane Upper Atmosphere', detail: 'Methane gas absorbs red wavelengths of sunlight and reflects serene aquamarine blue-green light back into space.' },
      { layer: 'Hot, Dense "Icy" Fluid Mantle (Water, Ammonia & Methane)', detail: 'Unlike Jupiter and Saturn, 80% of Uranus’s mass is a hot, electrically conducting supercritical fluid of water, ammonia, and methane ("Ice Giant")!' },
      { layer: 'Diamond-Rain Transition & Silicate/Iron Core', detail: 'At millions of bars of pressure, methane molecules split apart and carbon atoms compress into solid diamond crystals that hail down toward the rocky core!' },
    ],
    deepDiveHistory:
      'On March 13, 1781, musician and astronomer William Herschel spotted Uranus from his garden in Bath, England—making it the very first planet discovered with a telescope, doubling the known width of the Solar System overnight! Only one spacecraft, Voyager 2 in January 1986, has ever visited Uranus.',
    kidFriendlyAnalogy:
      'While the other planets spin like upright tops, Uranus was knocked 98 degrees onto its side—so it rolls around the Sun like a bowling ball, giving each pole 42 straight years of daylight followed by 42 years of winter night!',
    beginnerSummary:
      'Uranus is the first of the outer "Ice Giants"—worlds made mostly of heavier volatile compounds (water, ammonia, and methane) rather than pure hydrogen. Tilted 97.77° on its side with 13 dark rings and 28 moons named after Shakespearean characters, it boasts the coldest minimum temperature (-224°C) of any planet.',
    funFacts: [
      'Even though Neptune is farther from the Sun, Uranus holds the record for the coldest temperature ever measured on a planet (-224°C) because it radiates almost no internal heat!',
      'All 28 of Uranus’s moons are named after characters from the plays of William Shakespeare (Titania, Oberon, Miranda, Ariel, Puck, Juliet) and the poetry of Alexander Pope (Umbriel, Belinda)!',
      'Uranus’s moon Miranda has "Verona Rupes"—the tallest known cliff in the Solar System at ~20 kilometers high! In Miranda’s low gravity, a rock dropped from the top would take 12 minutes to hit the bottom!',
      'Uranus’s magnetic field is tilted 59° away from its spin axis and offset from the planet’s center by one-third of its radius, wobbling like a lopsided corkscrew every 17 hours!',
      'Laboratory laser-shock experiments at SLAC confirmed that pressures inside Uranus and Neptune literally squeeze carbon from methane into falling "diamond rain"!',
      'Uranus’s upper clouds smell like rotten eggs because they contain frozen hydrogen sulfide (H₂S) crystals!',
      'Because gravity at Uranus’s cloud tops is 0.89g (slightly weaker than Earth’s despite Uranus being 14.5x more massive, because Uranus is so puffy), a 50 kg person would weigh just 44.5 kg!',
      'The Planetary Science Decadal Survey named a dedicated "Uranus Orbiter and Probe (UOP)" as NASA’s highest-priority new flagship mission for the 2030s!',
    ],
    activeMissions: ['Voyager 2 Flyby (1986)', 'JWST Infrared Ring & Moon Observations', 'Uranus Orbiter & Probe (Planned Flagship)'],
    quizQuestions: [
      {
        question: 'What gas in the upper atmosphere of Uranus and Neptune absorbs red sunlight and gives both planets their striking cyan/blue color?',
        options: ['Oxygen', 'Methane (CH₄)', 'Carbon Monoxide', 'Helium'],
        correctIndex: 1,
        explanation:
          'Methane molecules strongly absorb red and infrared wavelengths of sunlight while scattering blue and green light back into space.',
      },
      {
        question: 'Why do planetary scientists classify Uranus and Neptune as "Ice Giants" rather than "Gas Giants" like Jupiter and Saturn?',
        options: [
          'Because their surfaces are solid skating rinks',
          'Because ~80% of their mass consists of heavier "icy" volatiles (water, ammonia, and methane) in a hot, dense fluid mantle rather than mostly hydrogen/helium',
          'Because they orbit inside a giant snowball',
          'Because they have no hydrogen at all',
        ],
        correctIndex: 1,
        explanation:
          'In astrophysics, water (H₂O), ammonia (NH₃), and methane (CH₄) are called "planetary ices." Inside Uranus and Neptune, these compounds form a deep, hot ionic fluid ocean.',
      },
      {
        question: 'How long does continuous summer daylight last at Uranus’s North Pole due to its extreme 97.77° sideways tilt?',
        options: ['12 hours', '6 months', '42 Earth years (half of Uranus’s 84-year orbit!)', '1,000 years'],
        correctIndex: 2,
        explanation:
          'Because Uranus lies almost flat in its orbital plane, one pole points toward the Sun for half of its 84-year orbit (42 years of non-stop sunlight) while the opposite pole endures 42 years of darkness!',
      },
      {
        question: 'What literary theme is used to name all 28 moons of Uranus?',
        options: [
          'Roman emperors',
          'Characters from the plays of William Shakespeare and poems of Alexander Pope (like Titania, Oberon, Miranda, Puck)',
          'Famous 20th-century physicists',
          'Types of gemstones',
        ],
        correctIndex: 1,
        explanation:
          'Started by John Herschel in 1852, every Uranian moon is named after a spirit or character from Shakespeare (e.g., A Midsummer Night’s Dream, The Tempest) or Pope’s The Rape of the Lock.',
      },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    subtitle: 'The Supersonic Windy Outpost & Mathematical Triumph',
    category: 'Ice Giant',
    color: '#3b82f6',
    accentColor: '#93c5fd',
    radiusScale: 0.85,
    orbitRadius: 19.2,
    orbitSpeed: 0.16,
    gravityRatio: 1.14,
    distanceFromSun: '4.50 Billion km (30.1 AU)',
    dayLength: '16 hours, 6 minutes',
    yearLength: '164.8 Earth years',
    avgTemp: '-200°C cloud tops',
    moonsCount: 16,
    escapeVelocity: '23.5 km/s',
    orbitalSpeed: '5.43 km/s',
    axialTilt: '28.32° (Similar to Earth and Mars)',
    lightTimeFromSun: '4 hours, 10 minutes',
    atmosphereComposition: [
      { gas: 'Hydrogen (H₂)', percent: 80.0, color: '#3b82f6' },
      { gas: 'Helium (He)', percent: 19.0, color: '#93c5fd' },
      { gas: 'Methane (CH₄)', percent: 1.0, color: '#1d4ed8' },
    ],
    internalLayers: [
      { layer: 'Dynamic Methane Cloud Decks & Supersonic Winds', detail: 'Powered by internal heat (radiating 2.6x more energy than it receives from the distant Sun!), driving 2,100 km/h winds.' },
      { layer: 'Superionic Water-Ammonia-Methane Mantle', detail: 'A deep, electrically conductive ocean of hot compressed water, ammonia, and methane.' },
      { layer: 'Rocky & Metallic Core (~1.2 Earth masses)', detail: 'Surrounded by high-pressure carbon/diamond precipitates at 7 million bar.' },
    ],
    deepDiveHistory:
      'In the 1840s, astronomers noticed Uranus was drifting slightly off its predicted orbit. French mathematician Urbain Le Verrier and British mathematician John Couch Adams independently calculated the mass and position of an unseen eighth planet tugging on Uranus. On September 23, 1846, Johann Galle pointed the Berlin Observatory telescope at Le Verrier’s coordinates and found Neptune within 1 degree—the greatest triumph of Newtonian physics!',
    kidFriendlyAnalogy:
      'Neptune is 30 times farther from the Sun than Earth—sunlight there is 900 times dimmer than at home, yet Neptune has the fastest supersonic winds (2,100 km/h) in the entire Solar System!',
    beginnerSummary:
      'Neptune is the outermost major planet of the Solar System, guarding the inner edge of the icy Kuiper Belt. Unlike calm Uranus, Neptune radiates strong internal heat that fuels gigantic dark vortex storms, bright methane-ice cirrus clouds, and supersonic jet streams.',
    funFacts: [
      'Neptune was discovered using pencil, paper, and calculus before anyone knowingly saw it—Urbain Le Verrier predicted its position to within 1° from how its gravity pulled on Uranus!',
      'Wait—Galileo Galilei actually sketched Neptune in his notebook on December 28, 1612 while observing Jupiter, 234 years before its official discovery, but mistook it for a background star!',
      'Neptune has the fastest sustained winds of any planet in the Solar System, reaching 2,100 km/h (1,300 mph)—faster than the speed of sound!',
      'Because its 30-AU orbit takes 164.8 Earth years, Neptune completed its VERY FIRST full orbit since its 1846 discovery on July 11, 2011!',
      'Neptune’s largest moon, Triton (2,706 km wide), orbits backwards (retrograde)! It is a captured Kuiper Belt dwarf planet (a twin of Pluto) that spews 8-km-high nitrogen-ice geysers!',
      'Triton’s surface (-235°C) is one of the coldest places in the Solar System, covered in frozen nitrogen, methane ice, and "cantaloupe terrain."',
      'Neptune has 5 named rings (Galle, Le Verrier, Lassell, Arago, and Adams) featuring strange clumpy bright arcs called Reference Arcs ("Liberté, Égalité, Fraternité")!',
      'Beyond Neptune lies the Kuiper Belt—home to Pluto, Charon, Eris, Makemake, Haumea, and Arrokoth (visited by NASA’s New Horizons probe)!',
    ],
    activeMissions: ['Voyager 2 Flyby (August 1989)', 'James Webb Space Telescope Infrared Imaging'],
    quizQuestions: [
      {
        question: 'How was Neptune first discovered in September 1846?',
        options: [
          'By mathematical calculation—astronomers noticed Uranus being pulled slightly off course and calculated where an unseen planet had to be',
          'By a space probe bumping into it',
          'Ancient Egyptians saw it with the naked eye',
          'A radio signal came from its rings',
        ],
        correctIndex: 0,
        explanation:
          'Urbain Le Verrier and John Couch Adams used Newton’s Law of Universal Gravitation to pinpoint Neptune’s location from tiny perturbations in Uranus’s orbit.',
      },
      {
        question: 'Which planet holds the record for the fastest planetary winds in the Solar System (up to 2,100 km/h)?',
        options: ['Mercury', 'Earth', 'Mars', 'Neptune'],
        correctIndex: 3,
        explanation:
          'Because Neptune’s cold, smooth atmosphere has very little turbulent friction and is driven by strong internal heat, its jet streams reach supersonic speeds of 2,100 km/h!',
      },
      {
        question: 'Why do astronomers know that Neptune’s largest moon, Triton, is actually a captured Kuiper Belt world (like Pluto) rather than a moon that formed alongside Neptune?',
        options: [
          'Because Triton orbits backwards (retrograde) in an inclined orbit opposite to Neptune’s rotation',
          'Because Triton is cube-shaped',
          'Because Triton has a sign written on it',
          'Because Triton is hotter than the Sun',
        ],
        correctIndex: 0,
        explanation:
          'Moons that form naturally in a planet’s circumplanetary disk always orbit in the same direction the planet spins. A large moon in a retrograde orbit could only have been gravitationally captured!',
      },
      {
        question: 'How many full orbits around the Sun has Neptune completed since humans officially discovered it in 1846?',
        options: ['165 orbits', 'Just 1 full orbit (completed in 2011!)', '12 orbits', '0 orbits'],
        correctIndex: 1,
        explanation:
          'At 4.5 billion km from the Sun, one Neptunian year takes 164.8 Earth years—so 1846 + 165 = 2011!',
      },
    ],
  },
  {
    id: 'moon',
    name: 'The Moon (Luna)',
    subtitle: 'Earth’s Natural Satellite & Artemis Outpost',
    category: 'Dwarf Planet / Moon',
    color: '#cbd5e1',
    accentColor: '#f1f5f9',
    radiusScale: 0.65,
    orbitRadius: 0,
    orbitSpeed: 0,
    gravityRatio: 0.166,
    distanceFromSun: '149.6 Million km (384,400 km from Earth)',
    dayLength: '27.3 Earth days (Tidally Locked to Earth)',
    yearLength: '27.3 Earth days (Lunar Synodic Month: 29.5 days)',
    avgTemp: '-130°C to +120°C (Night vs Day)',
    moonsCount: 0,
    escapeVelocity: '2.38 km/s',
    orbitalSpeed: '1.02 km/s (around Earth)',
    axialTilt: '1.54°',
    lightTimeFromSun: '8 min 20 sec (1.3 sec to Earth)',
    atmosphereComposition: [
      { gas: 'Helium, Neon & Hydrogen (Tenuous Exosphere)', percent: 100, color: '#94a3b8' },
    ],
    internalLayers: [
      { layer: 'Anorthositic Regolith & Crust (0–60 km)', detail: 'Pulverized silica glass, titanium-rich basalt, and deep impact craters from billions of years of asteroid strikes.' },
      { layer: 'Rigid Lithospheric Mantle (60–1,000 km)', detail: 'Dense olivine and pyroxene mantle hosting deep tidal moonquakes caused by Earth’s gravitational tug.' },
      { layer: 'Partially Molten Boundary & Metallic Iron Core (<350 km)', detail: 'Small metallic iron-nickel core making up only ~1–2% of the Moon’s total mass.' },
    ],
    deepDiveHistory:
      'Born 4.5 billion years ago when a Mars-sized protoplanet named Theia slammed into proto-Earth. The vaporized crust and mantle debris coalesced into the Moon in only a few months! Today, NASA Artemis and international missions are returning humans to establish permanent research bases at the lunar South Pole.',
    kidFriendlyAnalogy:
      'If Earth were the size of a basketball, the Moon would be the size of a tennis ball about 30 basketballs away—and you can jump 6 times higher on it!',
    beginnerSummary:
      'The Moon is Earth’s constant cosmic companion. Its gravity pulls our ocean tides, stabilizes Earth’s wobble so our seasons stay predictable, and always shows us the exact same face because it is tidally locked.',
    funFacts: [
      'Footprints left by the 12 Apollo astronauts will last at least 100 million years because the Moon has zero wind, rain, or flowing water to erase them!',
      'The Moon is slowly spiraling away from Earth at 3.8 centimeters per year—about the exact speed your fingernails grow!',
      'Deep permanently shadowed craters at the lunar South Pole (like Shackleton) contain hundreds of millions of tons of ancient water ice frozen at -246°C!',
      'Apollo astronauts discovered that the lunar regolith dust smells strongly like spent gunpowder and clung electrostatically to spacesuits and helmets!',
      'Because the Moon has no atmosphere to scatter sunlight into blue sky, daytime shadows on the Moon are jet black and stars are visible in full daylight!',
      'The Moon "rings like a bell" for over an hour when hit by discarded Apollo rocket stages because its dry rocky interior lacks water to damp seismic shockwaves!',
      'Earth’s gravity raises a tidal bulge in the Moon, and the Moon raises tidal bulges in Earth’s oceans, gradually lengthening our day by 1.7 milliseconds per century.',
      'A 50 kg student would weigh only 8.3 kg on the Moon—you could easily carry your refrigerator or jump over a fence with full spacesuit gear!',
    ],
    activeMissions: ['NASA Artemis Program', 'LRO (Lunar Reconnaissance Orbiter)', 'ISRO Chandrayaan-3', 'JAXA SLIM', 'CNSA Chang\'e 6'],
    quizQuestions: [
      {
        question: 'Why do we on Earth always see the exact same side ("The Near Side") of the Moon?',
        options: [
          'Because the Moon takes the exact same amount of time to rotate once on its axis as it does to orbit Earth ("Tidal Locking")',
          'Because the far side of the Moon is permanently covered in dark paint',
          'Because the Moon does not spin at all',
          'Because Earth’s magnetic field holds it frozen in place',
        ],
        correctIndex: 0,
        explanation:
          'Tidal friction over billions of years synchronized the Moon’s spin with its orbital period (27.3 days), locking one face toward Earth forever!',
      },
      {
        question: 'Roughly how strong is the Moon’s gravity compared to Earth’s gravity?',
        options: ['Equal to Earth', 'About 1/6th of Earth gravity (0.166g)', 'Twice as strong', 'Zero gravity'],
        correctIndex: 1,
        explanation:
          'Because the Moon is smaller and less dense, its surface gravity is about 1/6th of Earth’s—meaning a 60 kg person weighs just 10 kg on the Moon!',
      },
      {
        question: 'What crucial resource has been confirmed in deep permanently shadowed craters at the Moon’s South Pole?',
        options: ['Liquid petroleum', 'Millions of tons of frozen water ice', 'Pure gold nuggets', 'Natural diamonds'],
        correctIndex: 1,
        explanation:
          'Craters whose floors never see sunlight act as cold traps preserving water ice that Artemis astronauts can melt into drinking water and split into rocket propellant (O₂ and H₂)!',
      },
      {
        question: 'How did the Moon originally form roughly 4.5 billion years ago according to the leading Giant Impact Hypothesis?',
        options: [
          'A Mars-sized protoplanet named Theia collided with the early molten Earth, and the blasted debris coalesced into the Moon',
          'Earth captured a wandering rogue star',
          'The Moon was ejected from the center of the Sun',
          'An alien megastructure built it in orbit',
        ],
        correctIndex: 0,
        explanation:
          'Computer simulations and Apollo rock samples confirm that a colossal collision with Theia blasted molten rock into orbit that rapidly accreted into our Moon.',
      },
    ],
  },
  {
    id: 'ceres',
    name: '1 Ceres (Asteroid Belt)',
    subtitle: 'Dwarf Planet & Water-Rich Queen of the Asteroid Belt',
    category: 'Dwarf Planet / Moon',
    color: '#a8a29e',
    accentColor: '#e7e5e4',
    radiusScale: 0.62,
    orbitRadius: 10.2,
    orbitSpeed: 0.22,
    gravityRatio: 0.028,
    distanceFromSun: '414 Million km (2.77 AU)',
    dayLength: '9.07 Hours',
    yearLength: '4.6 Earth Years (1,682 Days)',
    avgTemp: '-105°C (Day) to -143°C (Night)',
    moonsCount: 0,
    escapeVelocity: '0.51 km/s (1,850 km/h)',
    orbitalSpeed: '17.9 km/s',
    axialTilt: '4.0°',
    lightTimeFromSun: '23 Minutes',
    atmosphereComposition: [
      { gas: 'Transient Water Vapor Plumes (Sublimated Cryovolcanic Brine)', percent: 100, color: '#38bdf8' },
    ],
    internalLayers: [
      { layer: 'Dark Regolith & Carbonaceous Chondrite Crust', detail: 'Silicate clay crust studded with glowing sodium carbonate salt deposits (Cerealia Facula).' },
      { layer: 'Hydrated Mud & Salty Brine Mantle (Up to 100 km deep)', detail: 'Contains up to 25% water by mass—more fresh water than all lakes and rivers on Earth combined!' },
      { layer: 'Dense Differentiated Silicate Rocky Core', detail: 'Partially differentiated rocky interior with relic radioactive core heat.' },
    ],
    deepDiveHistory:
      'Discovered on New Year’s Day 1801 by Giuseppe Piazzi, Ceres was originally hailed as the 8th planet, then deemed an asteroid for 150 years, and officially classified as a Dwarf Planet by the IAU in 2006. It contains roughly one-third of the total mass of the entire Asteroid Belt!',
    kidFriendlyAnalogy:
      'Ceres is about the size of Texas—a colossal, cratered cosmic ice ball cruising peacefully among millions of jagged asteroid rocks between Mars and Jupiter!',
    beginnerSummary:
      'Ceres is the largest world between Mars and Jupiter and the only dwarf planet located inside Neptune’s orbit. NASA’s Dawn orbiter revealed that Ceres is not just a dead rock, but a brine-rich ocean world with active salt cryovolcanoes like Ahuna Mons!',
    funFacts: [
      'Ceres holds roughly one-third of the entire mass of the Main Asteroid Belt—making it the undisputed giant of the asteroid zone!',
      'Inside Occator Crater, bright glowing spots called Cerealia Facula are made of sodium carbonate salts left behind when subsurface salty brine erupted and evaporated in space!',
      'Ahuna Mons is a 4-kilometer-tall cryovolcano (ice volcano) that erupted cold mud and salty brine instead of molten magma rock!',
      'Ceres contains more fresh water ice locked in its mantle than all of Earth’s freshwater rivers and lakes combined!',
      'Because Ceres’s surface gravity is so feeble (0.028g), a 50 kg student would weigh only 1.4 kg—you could jump 18 meters into the air and throw a baseball into orbit!',
      'NASA’s Dawn probe orbited Ceres from 2015 to 2018 and is now parked in an eternal, stable "graveyard" orbit where it will remain for decades without crashing.',
      'Ceres has almost zero axial tilt (only 4°), meaning its polar craters remain in permanent darkness and act as cold traps for water ice.',
      'Dawn’s infrared spectrometer detected complex aliphatic organic molecules (carbon chains) on Ceres, proving it possesses the chemical building blocks of life.',
    ],
    activeMissions: ['NASA Dawn Mission (Historic Archive / Graveyard Orbit)'],
    quizQuestions: [
      {
        question: 'Where in the Solar System is the dwarf planet 1 Ceres located?',
        options: [
          'In the Main Asteroid Belt between Mars and Jupiter',
          'Beyond Pluto in the Kuiper Belt',
          'Between Mercury and the Sun',
          'In orbit around Neptune',
        ],
        correctIndex: 0,
        explanation:
          'Ceres orbits at 2.77 AU, right in the heart of the Main Asteroid Belt, making it the only dwarf planet in the inner Solar System!',
      },
      {
        question: 'What are the bright, glowing white spots inside Ceres’s Occator Crater made of?',
        options: [
          'Sodium carbonate salts and ammonium chloride left behind by evaporated subsurface brine',
          'Crushed diamond dust from a comet',
          'Alien solar panels',
          'Phosphorescent algae',
        ],
        correctIndex: 0,
        explanation:
          'NASA’s Dawn probe discovered that subsurface salty water welled up through impact fractures and flash-evaporated in the vacuum of space, leaving behind bright reflective salts!',
      },
      {
        question: 'What makes Ahuna Mons on Ceres one of the most unique mountains in the Solar System?',
        options: [
          'It is a 4-km-tall "Cryovolcano" that erupted ice and salty mud slurry rather than molten lava rock',
          'It is made of pure solid iron',
          'It moves around the planet every week',
          'It is taller than Olympus Mons on Mars',
        ],
        correctIndex: 0,
        explanation:
          'Ahuna Mons is an ice volcano created when underground pressurized brine and clay mud domed upward and froze into a 4,000-meter peak!',
      },
      {
        question: 'Roughly how much of the total mass of the entire Asteroid Belt is contained in Ceres alone?',
        options: ['About 1%', 'About 33% (One-third of all asteroid mass!)', '99%', '5%'],
        correctIndex: 1,
        explanation:
          'Even though the asteroid belt contains millions of rocks, Ceres is so massive that it accounts for roughly 33% (one-third) of the belt’s entire mass!',
      },
    ],
  },
];

export const SPACECRAFT_FLEET: SpacecraftData[] = [
  {
    id: 'apollo',
    name: 'Apollo 11 Lunar Module "Eagle"',
    year: '1969',
    destination: 'Sea of Tranquility, The Moon',
    status: 'Historic Touchdown // Descent Stage at Tranquility Base',
    badgeEmoji: '🌕',
    launchVehicle: 'Saturn V Heavy Lift Vehicle (36-story rocket)',
    mass: '15,103 kg (with propellant)',
    powerSystem: 'Silver-Zinc Batteries (28V DC)',
    maxSpeed: '5,800 km/h (Lunar orbital velocity)',
    summary:
      'The first crewed spacecraft engineered to fly solely in the vacuum of space—and the vehicle that carried Neil Armstrong and Buzz Aldrin to the lunar surface on July 20, 1969.',
    whyItMatters:
      'Proved humanity could navigate, land, and launch from another world, leaving behind laser reflectors still used to measure the Moon’s orbit today.',
    funFacts: [
      'To save every kilogram of weight, the Lunar Module had NO seats—Neil Armstrong and Buzz Aldrin flew the entire landing standing up held by cable restraints!',
      'The outer aluminum skin of the crew cabin was only 0.3 millimeters thick (about 3 sheets of heavy Reynolds kitchen foil)—if you dropped a screwdriver inside, it could puncture the wall!',
      'When Buzz Aldrin accidentally snapped off the circuit-breaker switch needed to arm the Ascent Engine to leave the Moon, he jammed a felt-tip pen into the slot to close the circuit and save their lives!',
    ],
    hotspots: [
      {
        id: 'apollo-engine',
        name: 'Throttleable Descent Engine Bell',
        role: 'Soft Lunar Touchdown Thruster',
        plainEnglish:
          'Unlike giant booster rockets that are either 100% ON or OFF, this engine had a gas pedal so astronauts could hover and steer away from dangerous craters.',
        technicalFact:
          'Hypergolic Aerozine 50 / N2O4 engine throttleable between 10% and 60% thrust (45 kN max). Landed with ~25 seconds of fuel remaining.',
        position: [0, -1.1, 0],
      },
      {
        id: 'apollo-foil',
        name: 'Gold Kapton Thermal Blanket',
        role: 'Extreme Radiation & Heat Shield',
        plainEnglish:
          'In space, sunlight heats metal to +120°C while shadows drop to -150°C. These ultra-thin gold-colored foil blankets acted like a thermos to keep the electronics safe.',
        technicalFact:
          'Multi-layer insulation (MLI) made of aluminized Kapton and Mylar sheets only thousandths of an inch thick.',
        position: [0.9, -0.3, 0.9],
      },
      {
        id: 'apollo-cabin',
        name: 'Pressurized Crew Ascent Cabin & Ladder',
        role: 'Astronaut Habitat & Launch Return Craft',
        plainEnglish:
          'Two astronauts stood upright inside this compact cabin and climbed down the 9-rung ladder onto the Moon, then blasted off in the top half while using the bottom half as a launchpad!',
        technicalFact:
          'Pressurized with pure oxygen at 33 kPa (4.8 psi); Ascent Engine delivered 15.6 kN thrust back to Command Module Columbia.',
        position: [0, 0.85, 0],
      },
    ],
  },
  {
    id: 'rover',
    name: 'Mars Perseverance & Opportunity Rover',
    year: '2004 – Present',
    destination: 'Meridiani Planum & Jezero Crater, Mars',
    status: 'Surface Geologist & Astrobiologist // Active',
    badgeEmoji: '🔴',
    launchVehicle: 'Atlas V 541 / Delta II Rocket',
    mass: '1,025 kg (Perseverance) / 185 kg (Opportunity)',
    powerSystem: 'MMRTG Plutonium-238 Nuclear Battery / Triple-Junction Solar',
    maxSpeed: '0.15 km/h (4.2 cm per second over rocky terrain)',
    summary:
      'Six-wheeled robotic geologists packed with stereoscopic cameras, rock-zapping lasers, ground-penetrating radar, and a robotic drill arm to uncover ancient Martian rivers and lakes.',
    whyItMatters:
      'Found definitive mineral evidence ("hematite blueberries", gypsum veins, and ancient river delta mudstones) proving Mars once had warm, habitable liquid water.',
    funFacts: [
      'Perseverance’s supersonic parachute had a secret binary code woven into its red-and-white stripes spelling out "DARE MIGHTY THINGS" along with the GPS coordinates of NASA JPL!',
      'Perseverance carries a small aluminum plate with a 3D model of Earth and Mars and an anodized family portrait of all 5 NASA Mars rovers (Sojourner, Spirit, Opportunity, Curiosity, Perseverance).',
      'Its wheels have Morse-code-like wavy cleats rather than the JPL letters used on Curiosity, so scientists can measure exact wheel slip in Martian sand!',
    ],
    hotspots: [
      {
        id: 'rover-mast',
        name: 'Pancam & SuperCam Mast ("The Head")',
        role: '3D Eyes & Rock-Vaporizing Laser Spectrometer',
        plainEnglish:
          'Standing at human eye-level (2 meters up), this camera mast looks around in 3D and shoots a pulsed red/green laser beam to zap tiny rock spots into plasma and read their mineral elements from 7 meters away!',
        technicalFact:
          'Stereoscopic multispectral imagers + LIBS (Laser-Induced Breakdown Spectroscopy) + microphone that recorded the first sounds of Martian wind and laser zaps.',
        position: [0.6, 1.15, 0.4],
      },
      {
        id: 'rover-wheels',
        name: 'Rocker-Bogie 6-Wheel Suspension',
        role: 'Boulder-Climbing Mobility System',
        plainEnglish:
          'Instead of car springs, these 6 aluminum wheels are linked by a clever seesaw joint so the rover can climb over rocks twice as tall as its wheels while keeping its weight evenly balanced!',
        technicalFact:
          'Springless titanium-tube rocker-bogie linkage keeping all 6 cleated 52.5-cm aluminum wheels in ground contact across 45-degree tilts.',
        position: [-0.8, -0.65, 0.85],
      },
      {
        id: 'rover-arm',
        name: '5-Joint Robotic Turret & Coring Drill',
        role: 'UV Raman Spectrometer & Sample Collector',
        plainEnglish:
          'Just like a human shoulder, elbow, and wrist, this 2.1-meter robotic arm reaches out to abrade dusty rock crusts, scan for organic carbon, and seal chalk-sized rock cores into ultra-clean titanium tubes!',
        technicalFact:
          'Carries SHERLOC & PIXL X-ray/UV spectrometers plus a rotary-percussive coring drill.',
        position: [1.25, -0.1, 0],
      },
    ],
  },
  {
    id: 'voyager',
    name: 'Voyager 1 Interstellar Probe',
    year: '1977 – Present',
    destination: 'Interstellar Space (24.4+ Billion km from Earth)',
    status: 'Active Beyond the Heliopause // Furthest Human Object',
    badgeEmoji: '✨',
    launchVehicle: 'Titan IIIE-Centaur Heavy Rocket',
    mass: '815 kg at launch',
    powerSystem: '3 × MHW-RTG Plutonium-238 Thermoelectric Generators',
    maxSpeed: '61,200 km/h (17.0 km/s through interstellar space)',
    summary:
      'Launched on September 5, 1977 to tour Jupiter and Saturn, Voyager 1 kept flying past the edge of the Sun’s solar wind bubble on August 25, 2012 to become humanity’s first ambassador to the stars.',
    whyItMatters:
      'Carries the Golden Record—a time capsule of Earth’s music, greetings in 55 languages, and 115 encoded images—while still phoning home from over 22.5 light-hours away.',
    funFacts: [
      'Voyager 2 actually launched 16 days BEFORE Voyager 1 (on August 20, 1977), but Voyager 1 flew on a faster, shorter trajectory that overtook its twin before reaching Jupiter!',
      'Voyager 1’s three computers have a combined memory of just 69.63 kilobytes—about 50,000 times less memory than a single modern smartphone photo!',
      'In about 40,000 years, Voyager 1 will pass within 1.6 light-years of the star Gliese 445 in the constellation Camelopardalis.',
    ],
    hotspots: [
      {
        id: 'voyager-dish',
        name: '3.7-Meter High-Gain Parabolic Dish',
        role: 'Deep Space Radio Voice to Earth',
        plainEnglish:
          'Voyager’s radio transmitter is only 23 watts—about as dim as a refrigerator light bulb! This giant white dish focuses that tiny whisper into a tight beam aimed straight at Earth.',
        technicalFact:
          'X-band (8.4 GHz) and S-band (2.3 GHz) parabolic reflector communicating with NASA’s 70-meter Deep Space Network dishes across 163+ Astronomical Units.',
        position: [0, 0.65, 0],
      },
      {
        id: 'voyager-record',
        name: 'The 12-Inch Gold-Plated Phonograph Record',
        role: 'Time Capsule for Extraterrestrial Civilizations',
        plainEnglish:
          'Mounted on the side of Voyager’s core is a real gold record with a needle and picture instructions showing any alien finder how to play sounds of Earth and where our Sun is located.',
        technicalFact:
          'Gold-plated copper LP recorded at 16⅔ RPM with an aluminum cover electroplated with pure Uranium-238 (half-life 4.468 billion years).',
        position: [0.55, -0.25, 0.55],
      },
      {
        id: 'voyager-rtg',
        name: 'Plutonium-238 RTG Power Boom',
        role: '50-Year Nuclear Battery',
        plainEnglish:
          'Billions of kilometers from the Sun, solar panels wouldn’t get enough light to work. Instead, Voyager uses the natural warmth of decaying plutonium pellets to generate electricity!',
        technicalFact:
          'Three MHW-RTGs using silicon-germanium thermocouples; generated 470W at launch and ~220W today.',
        position: [-1.4, -0.5, 0],
      },
    ],
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope (JWST)',
    year: '2021 – Present',
    destination: 'Sun-Earth Lagrange Point L2 (1.5 Million km away)',
    status: 'Operational // Peering 13.5 Billion Years into Cosmic Dawn',
    badgeEmoji: '🔭',
    launchVehicle: 'Ariane 5 ECA Rocket (from Kourou, French Guiana)',
    mass: '6,500 kg',
    powerSystem: '2 kW Tail Solar Array (Sun-facing side)',
    maxSpeed: '3,600 km/h (Halo orbit around L2)',
    summary:
      'The largest and most powerful space telescope ever built, featuring a 6.5-meter golden honeycomb mirror that unfolded 344 single-point-of-failure steps like origami in deep space.',
    whyItMatters:
      'Reads infrared heat light to peer through opaque cosmic dust clouds, watch the very first galaxies ignite after the Big Bang, and detect water, CO₂, and methane in alien exoplanet atmospheres.',
    funFacts: [
      'The total amount of pure 24-karat gold coating all 18 hexagonal mirror segments (25 square meters!) weighs only 48.25 grams—about the weight of a single golf ball!',
      'The European Ariane 5 launch on Christmas Day 2021 was so accurate that JWST saved nearly half its onboard station-keeping propellant—doubling its operational lifespan from 10 years to 20+ years!',
      'JWST’s Mid-Infrared Instrument (MIRI) has to be cooled by a closed-loop liquid helium cryocooler down to -266°C—just 7 degrees above Absolute Zero!',
    ],
    hotspots: [
      {
        id: 'jwst-mirror',
        name: '18 Hexagonal Gold-Coated Beryllium Mirrors',
        role: 'Giant Infrared Light Bucket',
        plainEnglish:
          'Why is the mirror coated in pure gold? Because gold reflects 98% of infrared (heat) light! Each hexagon has 7 tiny motors behind it to focus the mirror to 1/10,000th the thickness of a human hair.',
        technicalFact:
          '6.5m primary mirror made of lightweight beryllium coated with 100 nanometers of vapor-deposited 24k gold.',
        position: [0, 0.6, 0.2],
      },
      {
        id: 'jwst-sunshield',
        name: '5-Layer Tennis-Court-Sized Sunshield',
        role: '300°C Temperature Drop Parasol',
        plainEnglish:
          'Because JWST looks for faint heat from distant stars, the telescope itself must stay freezing cold (-233°C). Five paper-thin silver layers block heat from the Sun, Earth, and Moon!',
        technicalFact:
          '21.2m × 14.2m silicon- and aluminum-coated Kapton membranes providing an equivalent SPF of 1,000,000!',
        position: [0, -0.75, 0],
      },
      {
        id: 'jwst-secondary',
        name: 'Foldable Secondary Mirror Tripod Boom',
        role: 'Precision Optical Focus Point',
        plainEnglish:
          'Starlight bounces off the 18 golden hexagons onto this smaller round mirror held out in front, which directs the focused image into the 4 science cameras behind the main mirror.',
        technicalFact:
          '0.74-meter convex gold-coated secondary mirror supported by 7.6-meter carbon-fiber struts.',
        position: [0, 0.6, 1.45],
      },
    ],
  },
  {
    id: 'iss',
    name: 'International Space Station (ISS)',
    year: '1998 – Present',
    destination: 'Low Earth Orbit (408 km Altitude)',
    status: 'Continuously Inhabited Orbital Laboratory (25+ Years)',
    badgeEmoji: '🛰️',
    launchVehicle: '42 Assembly Flights (Space Shuttle, Proton & Soyuz)',
    mass: '450,000 kg (450 Metric Tons!)',
    powerSystem: '8 Giant Solar Array Wings + 6 Roll-Out iROSA Arrays (240 kW)',
    maxSpeed: '27,600 km/h (7.66 km/s — 1 Orbit every 92 minutes)',
    summary:
      'A football-field-sized microgravity research laboratory built in orbit by 5 space agencies (NASA, Roscosmos, ESA, JAXA, CSA) where astronauts have lived and worked non-stop since November 2000.',
    whyItMatters:
      'Tests closed-loop water/oxygen recycling, zero-G human physiology, protein crystal growth, and autonomous docking needed for deep-space missions to the Moon and Mars.',
    funFacts: [
      'Spanning 109 meters end-to-end, the ISS is the size of an American football field (including the end zones) and has as much pressurized living space as a 6-bedroom house (or a Boeing 747 jumbo jet)!',
      'The ISS recycles 98% of all water aboard—including astronaut sweat, breath moisture, and urine—producing drinking water that is cleaner than municipal tap water on Earth!',
      'You can see the ISS with your naked eyes from your backyard at dawn or dusk! Its solar panels reflect sunlight so brightly it outshines every star in the night sky.',
    ],
    hotspots: [
      {
        id: 'iss-solar',
        name: 'Integrated Truss & 8 Solar Array Wings',
        role: '240-Kilowatt Orbital Power Grid',
        plainEnglish:
          'These giant double-sided solar wings rotate on motorized alpha joints like sunflowers to track the Sun during the 45 minutes of daylight on every 90-minute orbit.',
        technicalFact:
          'Eight 35-meter solar wings upgraded with Boeing iROSA roll-out arrays charging nickel-hydrogen and lithium-ion battery banks.',
        position: [1.5, 0.3, 0],
      },
      {
        id: 'iss-modules',
        name: 'Pressurized Destiny, Harmony & Cupola Modules',
        role: 'Microgravity Science Lab & 360° Earth Observatory',
        plainEnglish:
          'Inside these cylindrical aluminum modules, astronauts float between science racks and look straight down at Earth through the 7-window Cupola dome!',
        technicalFact:
          '916 cubic meters of 1-atm pressurized volume protected by Whipple micrometeoroid armor shields.',
        position: [0, 0.1, 0.35],
      },
      {
        id: 'iss-canadarm',
        name: 'Canadarm2 Robotic Manipulator',
        role: '17-Meter Inchworm Space Crane',
        plainEnglish:
          'This 7-jointed robotic arm can literally walk end-over-end across the outside of the Space Station like an inchworm to catch visiting cargo capsules and carry spacewalking astronauts!',
        technicalFact:
          '17.6-meter Mobile Servicing System capable of moving 116,000 kg payloads in microgravity.',
        position: [-0.8, 0.55, 0.3],
      },
    ],
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope (HST)',
    year: '1990 – Present',
    destination: 'Low Earth Orbit (535 km Altitude)',
    status: 'Operational // 1.6+ Million Scientific Observations',
    badgeEmoji: '🌌',
    launchVehicle: 'Space Shuttle Discovery (STS-31)',
    mass: '11,110 kg (Size of a school bus)',
    powerSystem: 'Twin Gallium-Arsenide Solar Wings (2,800 Watts)',
    maxSpeed: '27,300 km/h (7.59 km/s)',
    summary:
      'Orbiting above the blurring turbulence of Earth’s atmosphere for over three decades, Hubble revolutionized humanity’s view of the universe across ultraviolet, visible, and near-infrared light.',
    whyItMatters:
      'Pinned down the age of the universe (13.8 billion years), helped discover that the expansion of the universe is accelerating (Dark Energy), and captured the iconic Hubble Ultra Deep Field.',
    funFacts: [
      'When Hubble first launched in 1990, engineers discovered its 2.4-meter mirror had been ground too flat at the edges by 2.2 microns (1/50th the width of a human hair), making images blurry—until Space Shuttle astronauts installed corrective "eyeglasses" (COSTAR) during a daring 1993 spacewalk!',
      'Hubble has NO thrusters of its own! To aim at distant galaxies without rocket exhaust clouding its mirror, it spins heavy internal flywheels called "Reaction Wheels" using Newton’s Third Law.',
      'Hubble’s pointing accuracy is 0.007 arcseconds—equivalent to shining a laser beam from Washington, D.C. onto a dime in New York City (320 km away) and holding it steady for 24 hours!',
    ],
    hotspots: [
      {
        id: 'hubble-aperture',
        name: 'Aperture Door & Light Shield Barrel',
        role: 'Stray-Light Baffle & Sun Protector',
        plainEnglish:
          'This angled silver door at the front of the telescope closes automatically if Hubble ever swings too close to the bright Sun or Moon.',
        technicalFact:
          'Aluminum honeycomb light shield lined with matte-black ridges to suppress stray Earthshine.',
        position: [0, 0.85, 0.65],
      },
      {
        id: 'hubble-mirror',
        name: '2.4-Meter Ultra-Low-Expansion Glass Mirror',
        role: 'UV, Visible & Near-IR Ritchey-Chrétien Optics',
        plainEnglish:
          'Polished so smoothly that if Hubble’s mirror were scaled up to the width of the entire Earth, the tallest bump on it would be only 15 centimeters high!',
        technicalFact:
          'Corning ultra-low-expansion glass coated in 65 nm of reflective aluminum and 25 nm of protective magnesium fluoride.',
        position: [0, -0.35, 0],
      },
      {
        id: 'hubble-gyros',
        name: 'Reaction Wheels & Fine Guidance Sensors',
        role: 'Propellantless Precision Aiming System',
        plainEnglish:
          'Instead of burning rocket fuel (which would dirty the mirror), Hubble spins heavy metal wheels inside its belly—when the wheel spins left, the telescope turns right!',
        technicalFact:
          'Four 45-kg reaction wheels spinning up to 3,000 RPM paired with interferometric Fine Guidance Sensors.',
        position: [-0.95, -0.1, 0],
      },
    ],
  },
  {
    id: 'cassini',
    name: 'Cassini-Huygens Saturn Orbiter & Titan Lander',
    year: '1997 – 2017',
    destination: 'Saturn, Rings & Ocean Moons (Titan & Enceladus)',
    status: 'Mission Complete // Grand Finale Atmospheric Disposal (Sept 15, 2017)',
    badgeEmoji: '🪐',
    launchVehicle: 'Titan IVB / Centaur Upper Stage',
    mass: '5,712 kg (Size of a 30-passenger bus)',
    powerSystem: '3 Radioisotope Thermoelectric Generators (GPHS-RTGs, 885 Watts)',
    maxSpeed: '122,000 km/h (During Grand Finale ring dives)',
    summary:
      'A flagship international mission by NASA, ESA, and ASI that spent 13 years orbiting Saturn, discovering hydrothermal geysers on Enceladus, landing the Huygens probe on methane-soaked Titan, and executing 22 daring dives between Saturn and its innermost rings.',
    whyItMatters:
      'Discovered that Enceladus has a global subsurface ocean with organic chemistry, and delivered humanity’s first surface images and audio recordings from the surface of Titan (the only moon with a dense atmosphere and liquid seas).',
    funFacts: [
      'On January 14, 2005, the ESA Huygens probe parachuted down through Titan’s thick nitrogen smog and landed safely on a riverbed of water-ice pebbles!',
      'Cassini flew straight through the icy geyser plumes blasting from Enceladus’s south pole, tasting water, salts, methane, and complex organic molecules with its spectrometers!',
      'During its "Grand Finale" in 2017, Cassini dove 22 times through the 2,000-km gap between Saturn and its rings at 122,000 km/h using its high-gain dish as an ice shield!',
      'To protect Titan and Enceladus from any Earth bacteria, Cassini intentionally plunged into Saturn’s crushing atmosphere on September 15, 2017, transmitting science data until its thrusters could no longer fight the wind.',
    ],
    hotspots: [
      {
        id: 'cassini-dish',
        name: '4-Meter High-Gain Radio Dish & Particle Shield',
        role: 'Deep Space Communications & Whipple Shield',
        plainEnglish:
          'Used as both an ultra-powerful radio transmitter to Earth and as a physical umbrella against ring ice grains during ring crossings.',
        technicalFact: 'High-gain Cassegrain reflector operating at X-band and Ka-band frequencies.',
        position: [0, 1.25, 0],
      },
      {
        id: 'cassini-probe',
        name: 'ESA Huygens Titan Atmospheric Probe',
        role: 'Historic Titan Parachute Lander',
        plainEnglish:
          'A 318-kg flying saucer with a heat shield that decoupled from Cassini to land on Saturn’s giant moon Titan.',
        technicalFact: 'Equipped with heat shield, 3 parachutes, descent imager, and surface science sensors.',
        position: [0.95, -0.2, 0],
      },
      {
        id: 'cassini-rtg',
        name: 'Plutonium-238 Radioisotope Generators (RTGs)',
        role: 'Deep-Space Nuclear Thermocouples',
        plainEnglish:
          'Because sunlight at Saturn is 100 times dimmer than on Earth, solar panels would be too heavy. Cassini used the gentle decay heat of plutonium to generate electricity.',
        technicalFact: 'Three GPHS-RTGs containing 32.7 kg of Plutonium-238 dioxide generating 885 watts of electrical power.',
        position: [-0.95, -0.35, 0],
      },
    ],
  },
  {
    id: 'xwing',
    name: 'Incom T-65B X-Wing Starfighter (Hangar Diorama)',
    year: 'Galactic Civil War Era',
    destination: 'Rebel Alliance Fleet Hangar & Outer Rim',
    status: 'Operational // Flight-Ready on Staging Gantry',
    badgeEmoji: '⭐',
    launchVehicle: 'Quad Incom 4L4 Fusial Thrust Engines',
    mass: '10,000 kg (Empty Hull Weight)',
    powerSystem: 'Cryogenic Power Cell & Novaldex Generator',
    maxSpeed: '1,050 km/h (Atmosphere) // Class 1.0 Hyperdrive',
    summary:
      'The legendary Rebel Alliance space-superiority starfighter renowned for its balanced speed, shielding, hyperdrive mobility, and quad Taim & Bak KX9 laser cannons.',
    whyItMatters:
      'Showcases aerospace concepts in sci-fi: S-foil thermal radiators, variable geometry wings, closed-loop life support, and autonomous astromech navigation.',
    funFacts: [
      'The "S-foils" (Split-Wings) open into an "X" configuration during combat to widen the firing arc of the laser cannons and shed engine heat through thermal radiators!',
      'Unlike Imperial TIE Fighters which lack hyperdrives and shields, the T-65 X-wing features full deflector shields and an onboard hyperdrive for hit-and-run strikes.',
      'An industrial R2 Astromech droid sits in an exposed socket behind the pilot, calculating hyperspace jumps and repairing damaged systems mid-flight!',
      'The model in this hangar includes full ground crew ladders, fuel transfer lines, power generator containers, and access gantries!',
    ],
    hotspots: [
      {
        id: 'xwing-cannons',
        name: 'Quad Taim & Bak KX9 Laser Cannons',
        role: 'Wingtip Plasma Fire Arc',
        plainEnglish: 'Mounted on the tip of each S-foil wing to create a converged 4-point firing pattern.',
        technicalFact: 'High-yield gas plasma lasers capable of single, dual, or quad-burst fire modes.',
        position: [1.3, 0.4, 0.5],
      },
      {
        id: 'xwing-astromech',
        name: 'Astromech Droid Socket (R2 Unit)',
        role: 'Hyperspace Navigation & In-Flight Repairs',
        plainEnglish: 'Houses the pilot’s droid co-pilot to manage shield angling and plot faster-than-light jumps.',
        technicalFact: 'Direct interface with the Incom flight computer and sublight engine governors.',
        position: [0, 0.55, -0.4],
      },
      {
        id: 'xwing-engines',
        name: 'Quad Incom 4L4 Fusial Thrust Engines',
        role: 'Sublight Propulsion & Electromagnetic Nozzles',
        plainEnglish: 'Four high-output fusion engines providing sublight speed and atmospheric flight maneuverability.',
        technicalFact: 'Thrust vectoring vanes with integrated electromagnetic braking for atmospheric turns.',
        position: [0, -0.2, -1.2],
      },
    ],
  },
];

export const SPACE_STORIES: SpaceStory[] = [
  {
    id: 'story-apollo-11',
    title: 'The 45 Seconds of Eagle',
    subtitle: 'How Neil Armstrong & Buzz Aldrin Saved the First Moon Landing',
    era: 'July 20, 1969 // Sea of Tranquility',
    difficulty: 'Beginner',
    readTime: '5 min interactive',
    heroEmoji: '🌕',
    themeColor: 'amber',
    badgeId: 'badge-tranquility',
    badgeTitle: 'Tranquility Base Navigator',
    chapters: [
      {
        id: 'ch1-alarm',
        title: 'Chapter 1: Program Alarm 1202!',
        timestamp: 'T-Minus 04:15 to Touchdown // Altitude: 33,500 ft',
        tensionLevel: 'CRITICAL',
        telemetryMetrics: [
          { label: 'AGC COMPUTER', value: 'ALARM 1202 (OVERFLOW)', status: 'warn' },
          { label: 'ALTITUDE', value: '33,500 FT', status: 'ok' },
          { label: 'ARMSTRONG BPM', value: '110 BPM', status: 'warn' },
        ],
        narrative:
          'You are standing upright inside the cramped Apollo 11 Lunar Module "Eagle" hurtling toward the Moon. Suddenly, a master alarm buzzes in your headset and the computer flashes code "1202". Both the landing radar (pointing down at the Moon) and the rendezvous radar (pointing up at Columbia) are feeding pulses into the tiny 74-kilobyte computer at once—overloading its CPU cycles!',
        quote: 'Give us a reading on the 1202 Program Alarm.',
        quoteAuthor: 'Neil Armstrong to Mission Control Houston',
        scienceTakeaway:
          'Apollo’s flight software—led by Margaret Hamilton at MIT—used revolutionary "asynchronous priority executive scheduling." When overloaded with radar data, the computer automatically rebooted in milliseconds, dropped low-priority display tasks, and kept firing the life-critical descent thrusters without missing a beat!',
        didYouKnowFact:
          'The Apollo Guidance Computer’s Read-Only Memory ("Core Rope Memory") was literally woven by hand by textile workers threading copper wires through magnetic rings—representing a "1" or a "0"!',
        visualType: 'lunar-descent',
        choicePrompt:
          'CADET DECISION: You are 26-year-old Guidance Officer Steve Bales in Houston. The 1202 alarm is flashing, and Flight Director Gene Kranz demands an immediate GO or ABORT call. What do you decide?',
        choices: [
          {
            label: 'Call "GO!" — Trust Margaret Hamilton’s priority-scheduling software to shed extra radar tasks and keep descending.',
            outcomeText:
              'BRILLIANT CALL! Consulting computer specialist Jack Garman’s handwritten cheat sheet, Steve Bales shouted "We’re GO on that alarm!"—saving the landing from an unnecessary abort!',
            isOptimal: true,
            xpBonus: 60,
          },
          {
            label: 'Order the astronauts to turn off the main flight computer and fly the last 33,000 feet completely blind.',
            outcomeText:
              'Too dangerous! Without the computer’s inertial rate damping and throttle calculations at 33,000 feet, a human pilot couldn’t stabilize the descent.',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Hit the Abort Stage button immediately and fire the ascent engine back to orbit.',
            outcomeText:
              'That would have saved the crew, but aborted humanity’s first Moon landing over a benign radar-switch overflow!',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
      {
        id: 'ch2-boulders',
        title: 'Chapter 2: The Crater Full of Boulders',
        timestamp: 'T-Minus 01:30 to Touchdown // Altitude: 1,500 ft',
        tensionLevel: 'EXTREME',
        telemetryMetrics: [
          { label: 'TERRAIN', value: 'WEST CRATER BOULDERS', status: 'crit' },
          { label: 'PROPELLANT', value: '90 SECONDS LEFT', status: 'warn' },
          { label: 'ARMSTRONG BPM', value: '150 BPM', status: 'crit' },
        ],
        narrative:
          'Because slight gravity anomalies ("mascons") inside the Moon tugged Eagle 4 miles downrange early in the orbit, the automatic landing computer is steering straight toward "West Crater"—a steep pit the size of a football field littered with car-sized volcanic boulders that will snap the landing legs and tip the spacecraft over!',
        quote: 'Pretty rocky area... I’m going to take over manually.',
        quoteAuthor: 'Neil Armstrong',
        scienceTakeaway:
          'In the Moon’s 1/6th gravity and zero air resistance, tilting the Lunar Module forward pitches the thrust vector of the descent engine—allowing the spacecraft to skim horizontally like a rocket-powered helicopter while slowing its vertical drop.',
        didYouKnowFact:
          'Just 14 months before Apollo 11, Neil Armstrong had to eject with 1.5 seconds to spare from a crashing jet-powered Lunar Landing Research Vehicle ("The Flying Bedstead") in Houston!',
        visualType: 'lunar-descent',
        choicePrompt:
          'CADET DECISION: Fuel is down to 90 seconds. West Crater’s boulder field is directly below your landing pads. How do you pilot Eagle?',
        choices: [
          {
            label: 'Switch to P66 Manual Attitude Control, arrest vertical sink rate to 3 ft/sec, and skim horizontally past the boulders while Buzz Aldrin calls out altitude and velocity.',
            outcomeText:
              'ACE PILOTING! Armstrong coolly glided right over the rim of West Crater and spotted a flat patch of regolith 400 meters ahead while Aldrin acted as a human HUD!',
            isOptimal: true,
            xpBonus: 70,
          },
          {
            label: 'Throttle the engine to 100% full power to climb back up to 10,000 feet and look for another landing site.',
            outcomeText:
              'Climbing back up would burn all 90 seconds of your remaining descent propellant in moments, forcing an emergency abort!',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Cut the engine right above the boulders and hope the aluminum honeycomb legs absorb the crash.',
            outcomeText:
              'Landing on a boulder tilted more than 12 degrees could tip Eagle on its side, making it impossible to launch back home!',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
      {
        id: 'ch3-contact',
        title: 'Chapter 3: "30 Seconds... Contact Light!"',
        timestamp: '20:17:40 UTC // Sea of Tranquility',
        tensionLevel: 'EXTREME',
        telemetryMetrics: [
          { label: 'PROPELLANT', value: '25 SECONDS TO ABORT', status: 'crit' },
          { label: 'DESCENT RATE', value: '1.7 FT/SEC', status: 'ok' },
          { label: 'CONTACT PROBE', value: 'BLUE LIGHT ON!', status: 'ok' },
        ],
        narrative:
          'In Houston, Capcom Charlie Duke’s voice tightens: "60 seconds!" Then: "30 seconds!" Lunar dust blasted outward by the rocket exhaust obscures the ground like grey fog. Suddenly, one of the 67-inch wire sensing probes hanging beneath Eagle’s footpads brushes the lunar soil, illuminating the blue "CONTACT LIGHT" on the instrument panel!',
        quote: 'Houston, Tranquility Base here. The Eagle has landed.',
        quoteAuthor: 'Neil Armstrong (Followed by Charlie Duke: "You got a bunch of guys about to turn blue. We’re breathing again!")',
        scienceTakeaway:
          'Post-flight analysis showed that fuel sloshing inside the tank triggered the low-level sensor slightly early—Armstrong actually had about 45–50 seconds of usable propellant left when he shut down the engine.',
        didYouKnowFact:
          'The very first words spoken after touching the Moon weren’t "The Eagle has landed"—they were Buzz Aldrin’s technical callout: "Contact light! Okay, engine stop."',
        visualType: 'lunar-descent',
        choicePrompt:
          'CADET DECISION: Six hours later, you step onto the lunar dust. Which passive optical experiment do you deploy that astronomers on Earth still use every week today?',
        choices: [
          {
            label: 'The Laser Ranging Retroreflector (LRRR)—an array of 100 fused-silica corner-cube prisms that bounce Earth laser pulses straight back to their source.',
            outcomeText:
              'MISSION COMPLETE! Requires zero battery power! Observatories on Earth still bounce green laser pulses off Apollo 11’s mirror today, measuring the Moon’s distance to within 1 millimeter!',
            isOptimal: true,
            xpBonus: 80,
          },
          {
            label: 'A weather vane and anemometer to measure the speed of lunar wind gusts.',
            outcomeText:
              'Remember: the Moon has a hard vacuum at the surface with no wind! Instead, Apollo deployed a foil sheet to trap microscopic particles of the Solar Wind.',
            isOptimal: false,
            xpBonus: 30,
          },
          {
            label: 'A compass to locate the Moon’s global magnetic North Pole.',
            outcomeText:
              'Unlike Earth, the Moon lost its global magnetic dynamo billions of years ago, so a magnetic compass wouldn’t point north on the Moon!',
            isOptimal: false,
            xpBonus: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'story-apollo-13',
    title: 'Houston, We’ve Had a Problem',
    subtitle: 'How Ingenuity & Duct Tape Rescued Apollo 13 from 320,000 km Away',
    era: 'April 13–17, 1970 // Cislunar Space',
    difficulty: 'Thrilling',
    readTime: '6 min interactive',
    heroEmoji: '🛠️',
    themeColor: 'rose',
    badgeId: 'badge-apollo13',
    badgeTitle: 'Failure Is Not An Option',
    chapters: [
      {
        id: 'ap13-1',
        title: 'Chapter 1: Bang in the Service Module!',
        timestamp: '55 Hours, 54 Minutes GET // 321,860 km from Earth',
        tensionLevel: 'EXTREME',
        telemetryMetrics: [
          { label: 'O2 TANK 2', value: '0 PSI (RUPTURED)', status: 'crit' },
          { label: 'MAIN BUS B', value: 'UNDERVOLT ALARM', status: 'crit' },
          { label: 'O2 TANK 1', value: 'LEAKING TO SPACE', status: 'crit' },
        ],
        narrative:
          'Fifty-six hours into a routine flight to the Fra Mauro highlands, Jack Swigert flips a switch to stir the cryogenic oxygen tanks. Seconds later, a violent BANG shakes the spacecraft. Damaged Teflon wire insulation inside Oxygen Tank 2 sparked an explosion that blew off the Service Module panel! Looking out the window, Jim Lovell sees a cloud of glittering oxygen gas venting into space—draining the Command Module’s electricity and breathing air!',
        quote: 'Okay, Houston, we’ve had a problem here.',
        quoteAuthor: 'Jack Swigert & Jim Lovell, Apollo 13',
        scienceTakeaway:
          'Apollo’s Command Module relied on Hydrogen-Oxygen Fuel Cells that combined O₂ and H₂ to generate both electricity and drinking water. Losing the oxygen tanks meant the Command Module Odyssey would go completely dead in less than 2 hours!',
        didYouKnowFact:
          'Apollo 13 actually swung around the far side of the Moon at 400,171 km from Earth—setting the Guinness World Record for the farthest distance humans have ever traveled from Earth!',
        visualType: 'apollo-13',
        choicePrompt:
          'CADET DECISION: Command Module Odyssey has only 15 minutes of battery power left needed for Earth re-entry 4 days from now. How do you keep the 3 astronauts alive right now?',
        choices: [
          {
            label: 'Shut down Odyssey to save its re-entry batteries, and move the crew into the attached Lunar Module "Aquarius" to use it as a lifeboat!',
            outcomeText:
              'LIFE-SAVING CALL! Even though the Lunar Module was only built to support 2 astronauts for 45 hours, its independent silver-zinc batteries, oxygen tanks, and descent engine became their lifeboat for 3 astronauts over 4 days!',
            isOptimal: true,
            xpBonus: 70,
          },
          {
            label: 'Fire the damaged Service Module main engine at full throttle to U-turn straight back to Earth immediately.',
            outcomeText:
              'FATAL RISK! If the explosion cracked the Service Module engine bell, firing it could detonate the entire spacecraft—and in orbital mechanics, it takes far less fuel to loop around the Moon’s gravity ("Free-Return Trajectory")!',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Proceed with landing on the Moon anyway to look for spare oxygen.',
            outcomeText:
              'Touching down would use up the Lunar Module descent engine fuel needed to steer the crippled stack back toward Earth!',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
      {
        id: 'ap13-2',
        title: 'Chapter 2: Square Peg in a Round Hole ("The Mailbox")',
        timestamp: '80 Hours GET // Looping Around the Far Side of the Moon',
        tensionLevel: 'CRITICAL',
        telemetryMetrics: [
          { label: 'CABIN CO2', value: '13.2 mmHg (RISING)', status: 'crit' },
          { label: 'CABIN TEMP', value: '3.3°C (FREEZING)', status: 'warn' },
          { label: 'WATER RATION', value: '170 mL / DAY', status: 'warn' },
        ],
        narrative:
          'With 3 astronauts breathing inside a Lunar Module designed for 2, toxic Carbon Dioxide (CO₂) levels climb toward lethal limits (15 mmHg)! The Lunar Module uses ROUND lithium hydroxide (LiOH) scrubber canisters, and they are all full. You have plenty of spare canisters inside the dead Command Module—but those canisters are SQUARE and don’t fit the round Lunar Module slots!',
        quote: 'We’ve got to find a way to make this square peg fit into that round hole—using nothing but this!',
        quoteAuthor: 'Houston Crew Systems Engineers (Ed Smylie’s team)',
        scienceTakeaway:
          'Lithium Hydroxide (2 LiOH + CO₂ → Li₂CO₃ + H₂O) chemically absorbs exhaled carbon dioxide gas and locks it into solid lithium carbonate crystal, preventing CO₂ poisoning (hypercapnia).',
        didYouKnowFact:
          'Because power was cut down to 12 amps (less than a household toaster!), condensation froze on the cabin walls and the astronauts couldn’t dump urine overboard (because the momentum of venting liquid would push them off course!).',
        visualType: 'apollo-13',
        choicePrompt:
          'CADET DECISION: Using only items floating inside the spacecraft, how do you connect a square Command Module LiOH canister to the round Lunar Module air hose?',
        choices: [
          {
            label: 'Build an airtight adapter ("The Mailbox") out of a plastic flight-plan cover, a spare spacesuit hose, a sock, a plastic bag, and gray duct tape!',
            outcomeText:
              'LEGENDARY HACK! Within 30 minutes of taping "The Mailbox" together and turning on the fan, cabin CO₂ plunged from dangerous 13 mmHg down to a safe 0.1 mmHg!',
            isOptimal: true,
            xpBonus: 80,
          },
          {
            label: 'Crack open the cabin hatch window slightly to let the CO₂ float out.',
            outcomeText:
              'Opening the hatch in vacuum would instantly depressurize the entire cabin and vent all breathable oxygen into space!',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Smash the square metal canister with a hammer until it becomes round.',
            outcomeText:
              'Crushing a lithium hydroxide canister would release caustic chemical dust into the zero-G cabin air, burning the astronauts’ lungs and eyes!',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
      {
        id: 'ap13-3',
        title: 'Chapter 3: The Terminator Burn & 6-Minute Blackout',
        timestamp: '105 Hours GET // Approaching Earth’s 2.5° Re-Entry Corridor',
        tensionLevel: 'EXTREME',
        telemetryMetrics: [
          { label: 'ENTRY ANGLE', value: '6.48° (CORRIDOR LOCKED)', status: 'ok' },
          { label: 'PLASMA HEAT', value: '2,760°C SHIELD', status: 'warn' },
          { label: 'RADIO BLACKOUT', value: '6 MIN (LONGEST EVER)', status: 'crit' },
        ],
        narrative:
          'Approaching Earth at 39,000 km/h, Apollo 13 is drifting toward a shallow angle that will make it skip off the atmosphere into space forever! With the computer powered off to save battery amps, how can Jim Lovell aim the engine burn when floating debris from the explosion looks like thousands of fake stars outside the window?',
        quote: 'All right, Jack, watch the pitch attitude; I’ve got the Earth right in the reticle!',
        quoteAuthor: 'Commander Jim Lovell',
        scienceTakeaway:
          'When a spacecraft hits Earth’s atmosphere at Mach 36, air molecules in front of the blunt heat shield compress so violently that they ionize into a glowing sheath of plasma—blocking all radio waves for 4 to 6 minutes ("Ionization Blackout").',
        didYouKnowFact:
          'After Apollo 13 splashed down safely in the South Pacific, Grumman Aerospace (builder of the Lunar Module) playfully sent North American Rockwell (builder of the Command Module) a mock invoice for "$312,421.24 in towing fees ($4.00 for the first mile, $1.00 for each additional 400,000 miles)!"',
        visualType: 'apollo-13',
        choicePrompt:
          'CADET DECISION: You cannot see real stars through the cloud of glittering debris to align your guidance computer. What landmark do you use in your window crosshairs to hold the spacecraft steady during the manual 14-second engine burn?',
        choices: [
          {
            label: 'Align the window crosshairs directly on the crescent "Terminator Line" (the day/night shadow line) on Earth while Fred Haise controls roll and Jack Swigert times 14 seconds on his wristwatch!',
            outcomeText:
              'TRIUMPH! Lovell, Haise, and Swigert nailed the manual burn to within 0.3 feet per second, survived a tense 6-minute plasma blackout, and splashed down safely under three orange-and-white parachutes!',
            isOptimal: true,
            xpBonus: 90,
          },
          {
            label: 'Guess the direction by closing your eyes and firing for a full minute.',
            outcomeText:
              'Missing Earth’s narrow 2.5-degree re-entry corridor by even 1 degree either burns the capsule up (too steep) or bounces it back into space forever (too shallow)!',
            isOptimal: false,
            xpBonus: 30,
          },
          {
            label: 'Power up all computers and heaters for 2 hours to run an automatic star scan.',
            outcomeText:
              'That would drain the last 20% of Odyssey’s re-entry batteries, leaving no power to deploy the parachutes after hitting the atmosphere!',
            isOptimal: false,
            xpBonus: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'story-perseverance',
    title: 'Seven Minutes of Terror',
    subtitle: 'Landing a 1-Ton Rover in Jezero Crater with a Rocket Sky-Crane',
    era: 'February 18, 2021 // Jezero Crater, Mars',
    difficulty: 'Intermediate',
    readTime: '5 min interactive',
    heroEmoji: '🪂',
    themeColor: 'cyan',
    badgeId: 'badge-skycrane',
    badgeTitle: 'Sky-Crane Flight Director',
    chapters: [
      {
        id: 'perc-1',
        title: 'Chapter 1: Slamming into Mars at 19,500 km/h',
        timestamp: 'Entry Interface // 125 km Above Mars',
        tensionLevel: 'EXTREME',
        telemetryMetrics: [
          { label: 'ENTRY SPEED', value: '19,500 KM/H (MACH 25)', status: 'warn' },
          { label: 'HEAT SHIELD', value: '1,300°C PEAK', status: 'warn' },
          { label: 'RADIO DELAY', value: '11 MIN 22 SEC (ONE-WAY)', status: 'crit' },
        ],
        narrative:
          'Perseverance hits the top of the Martian atmosphere at 19,500 km/h. Here is the catch: Mars is so far away right now that radio signals take 11 minutes and 22 seconds to travel to Earth—and the entire descent from the top of the atmosphere to the ground takes only 7 MINUTES! That means when Mission Control receives the signal that entry has begun, the rover has already been alive or dead on the surface for 4 minutes!',
        quote: 'When we get the signal that the spacecraft has touched the top of the atmosphere, the vehicle has actually been on the ground—alive or dead—for four minutes.',
        quoteAuthor: 'Adam Steltzner, Chief Engineer',
        scienceTakeaway:
          'Mars’s atmosphere is the hardest in the Solar System to land in: it is just thick enough to burn your spacecraft to a crisp at 1,300°C, yet 99% thinner than Earth’s air—so a parachute alone can only slow a 1-ton rover down to 320 km/h!',
        didYouKnowFact:
          'Even at Mach 2 on a giant 21.5-meter supersonic parachute, the rover is still falling at 320 km/h—faster than a Formula 1 racecar!',
        visualType: 'mars-skycrane',
        choicePrompt:
          'CADET DECISION: Because of the 11-minute speed-of-light delay, no human in Mission Control can joystick the rover away from Jezero Crater’s cliffs. How do you steer to a safe spot?',
        choices: [
          {
            label: 'Use autonomous "Terrain Relative Navigation (TRN)"—an onboard camera that snaps live photos of the ground, compares them to an orbital hazard map in milliseconds, and diverts toward safe flat ground!',
            outcomeText:
              'BULLSEYE! Perseverance’s TRN computer ("Lander Vision System") spotted steep boulder fields below, diverted 600 meters sideways, and locked onto a flat landing zone in the middle of a hazard field!',
            isOptimal: true,
            xpBonus: 75,
          },
          {
            label: 'Have an engineer in California press the left arrow key when they see a rock on TV.',
            outcomeText:
              'By the time the image takes 11 minutes to reach Earth and your command takes 11 minutes to return (22 minutes round trip!), the rover landed 15 minutes ago!',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Wrap the 1,025-kg nuclear-powered rover in bouncing airbags like Opportunity.',
            outcomeText:
              'At over 1 metric ton (5.5x heavier than Opportunity), airbags big enough to cushion Perseverance would tear apart on impact!',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
      {
        id: 'perc-2',
        title: 'Chapter 2: The Rocket-Powered Sky Crane!',
        timestamp: 'Altitude: 20 Meters Above Jezero Crater',
        tensionLevel: 'EXTREME',
        telemetryMetrics: [
          { label: 'DESCENT STAGE', value: '8 HYDRAZINE ROCKETS ON', status: 'ok' },
          { label: 'NYLON BRIDLES', value: '6.4 METERS DEPLOYED', status: 'ok' },
          { label: 'TOUCHDOWN SPEED', value: '0.75 M/S (WALKING PACE)', status: 'ok' },
        ],
        narrative:
          'At 2.1 km altitude, the backshell cuts loose from the parachute and fires 8 retrorockets! But if the rocket backpack lands all the way on the ground, its powerful exhaust plumes will blast a deep crater in the dust and sandblast the rover’s delicate cameras. With 20 meters left to go, it’s time for the boldest maneuver in planetary exploration!',
        quote: 'Touchdown confirmed! Perseverance is safely on the surface of Mars, ready to begin seeking the signs of past life!',
        quoteAuthor: 'Swati Mohan, GN&C Operations Lead',
        scienceTakeaway:
          'By hovering 20 meters above the ground andwinching the rover down on three 6.4-meter braided nylon cables ("The Sky Crane"), the rocket exhaust stays far above the soil while the rover’s 6 wheels deploy in mid-air to act as its own landing gear!',
        didYouKnowFact:
          'Attached beneath Perseverance’s belly was "Ingenuity"—a 1.8-kg twin-rotor solar helicopter carrying a tiny postage-stamp swatch of fabric from the Wright Brothers’ 1903 Flyer!',
        visualType: 'mars-skycrane',
        choicePrompt:
          'CADET DECISION: The instant Perseverance’s 6 wheels touch the Martian dirt and sense weight-on-wheels, what must happen in the next 0.1 seconds?',
        choices: [
          {
            label: 'Fire pyrotechnic guillotine blades on the rover’s deck to sever the nylon cables, allowing the Sky Crane jetpack to fly away and crash safely 700 meters away!',
            outcomeText:
              'FLAWLESS EXECUTION! The guillotine cutters sliced the cables instantly, and the Sky Crane throttled up and flew off to a safe distance while Perseverance snapped its first image of Jezero Crater!',
            isOptimal: true,
            xpBonus: 85,
          },
          {
            label: 'Leave the cables attached so the rocket jetpack lands right on top of the rover’s cameras.',
            outcomeText:
              'If the cables weren’t cut immediately, the heavy rocket stage would crash right onto Perseverance and crush it!',
            isOptimal: false,
            xpBonus: 30,
          },
          {
            label: 'Reel the rover back up into the Sky Crane and fly back to orbit.',
            outcomeText:
              'The Sky Crane had only a few seconds of hydrazine fuel remaining—its job was a one-way delivery to the ancient river delta!',
            isOptimal: false,
            xpBonus: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'story-voyager',
    title: 'A Message in a Cosmic Bottle',
    subtitle: 'Voyager 1, The Grand Tour & The Golden Record',
    era: '1977 – Present // Beyond the Heliopause',
    difficulty: 'All Ages',
    readTime: '4 min interactive',
    heroEmoji: '✨',
    themeColor: 'cyan',
    badgeId: 'badge-voyager',
    badgeTitle: 'Interstellar Emissary',
    chapters: [
      {
        id: 'voy-1',
        title: 'Chapter 1: The Once-in-176-Years Alignment',
        timestamp: 'August & September 1977 // Cape Canaveral',
        tensionLevel: 'NOMINAL',
        telemetryMetrics: [
          { label: 'TRAJECTORY', value: 'GRAND TOUR SLINGSHOT', status: 'ok' },
          { label: 'GOLDEN RECORD', value: '115 IMAGES + 55 LANGUAGES', status: 'ok' },
          { label: 'ATOMIC CLOCK', value: 'URANIUM-238 (1 BILLION YRS)', status: 'ok' },
        ],
        narrative:
          'In 1965, a 24-year-old student intern at NASA’s Jet Propulsion Laboratory named Gary Flandro calculated something extraordinary using pencil and graph paper: in the late 1970s, all four giant outer planets—Jupiter, Saturn, Uranus, and Neptune—would curve into a rare geometric arc on the same side of the Sun, an alignment that happens only once every 176 years!',
        quote: 'The spacecraft will be encountered and the record played only if there are advanced spacefaring civilizations in interstellar space.',
        quoteAuthor: 'Carl Sagan',
        scienceTakeaway:
          'By flying closely behind a moving planet, a spacecraft steals a tiny fraction of the planet’s orbital momentum—a "Gravity Assist Slingshot" that boosted Voyager’s speed past Solar System escape velocity and cut travel time to Neptune from 30 years down to 12!',
        didYouKnowFact:
          'The last time the outer planets lined up like this before 1977 was in 1801—when Thomas Jefferson was President of the United States and steam locomotives had barely been invented!',
        visualType: 'voyager-record',
        choicePrompt:
          'CADET DECISION: Carl Sagan asks you how to engrave the cover of Voyager’s Golden Record so an alien scientist 500 million years from now can figure out our Sun’s address and playback speed without knowing English. What do you engrave?',
        choices: [
          {
            label: 'A cosmic map showing the exact pulse frequencies of 14 spinning Neutron Stars (Pulsars) pointing to our Sun, calibrated using the universal 21-cm spin-flip transition of the Hydrogen Atom!',
            outcomeText:
              'GENIUS! Hydrogen is the most abundant element in the universe, and its hyperfine transition time (0.704 nanoseconds) serves as a universal cosmic stopwatch for both the record speed and the pulsar map!',
            isOptimal: true,
            xpBonus: 70,
          },
          {
            label: 'Print a paper road map of Florida and include an MP3 player.',
            outcomeText:
              'Paper would degrade and an alien civilization wouldn’t know digital MP3 file headers—whereas an analog grooved metal disc with a physical stylus needle can be decoded mechanically!',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Draw the constellations of the Zodiac as seen from Earth.',
            outcomeText:
              'Constellations only look recognizable from inside our Solar System—from another star system, the stars are in completely different 3D positions!',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
      {
        id: 'voy-2',
        title: 'Chapter 2: The Pale Blue Dot & Crossing the Heliopause',
        timestamp: 'February 14, 1990 & August 25, 2012 // 163+ AU',
        tensionLevel: 'ELEVATED',
        telemetryMetrics: [
          { label: 'DISTANCE', value: '24.4 BILLION KM (163.4 AU)', status: 'ok' },
          { label: 'LIGHT TIME', value: '22 HRS 36 MIN ONE-WAY', status: 'warn' },
          { label: 'RTG POWER', value: 'DECAYING (-4W / YEAR)', status: 'warn' },
        ],
        narrative:
          'On Valentine’s Day 1990, from 6 billion kilometers away, NASA commanded Voyager 1 to turn its camera backward for one final family portrait of the Solar System. Earth appeared as a tiny 0.12-pixel "Pale Blue Dot" suspended in a scattered ray of sunlight. Twenty-two years later, on August 25, 2012, Voyager 1 crossed the Heliopause—becoming the first human-made object to enter the interstellar plasma between the stars!',
        quote: 'Look again at that dot. That’s here. That’s home. That’s us. On it everyone you love, everyone you know, every human being who ever was, lived out their lives.',
        quoteAuthor: 'Carl Sagan, Pale Blue Dot (1994)',
        scienceTakeaway:
          'When Voyager 1 crossed the Heliopause at 121 AU, its sensors detected a sudden 40-fold jump in plasma density and a sharp drop in solar wind particles while Galactic Cosmic Rays surged—confirming it had exited the Sun’s protective bubble.',
        didYouKnowFact:
          'In late 2023, when a single corrupted memory chip caused Voyager 1 to send gibberish from 24 billion km away, JPL engineers rewrote its 1970s assembly code and beamed a fix that took 22.5 hours to arrive—bringing Voyager 1 back online in 2024!',
        visualType: 'voyager-record',
        choicePrompt:
          'CADET DECISION: Voyager 1’s Plutonium-238 nuclear batteries lose ~4 watts of electrical power every year. How do you keep this priceless interstellar explorer transmitting into the late 2020s?',
        choices: [
          {
            label: 'Systematically power down non-essential subsystem heaters and instruments one by one while rewriting software to run inside healthy memory blocks.',
            outcomeText:
              'EXACTLY RIGHT! Even when instruments drop to -60°C after their heaters are turned off, many of Voyager’s solid-state sensors have continued working far below their original design limits!',
            isOptimal: true,
            xpBonus: 80,
          },
          {
            label: 'Unfurl backup solar panels to catch interstellar starlight.',
            outcomeText:
              'At 163 AU from the Sun, sunlight is over 26,500 times dimmer than at Earth—solar panels wouldn’t generate a single milliwatt!',
            isOptimal: false,
            xpBonus: 30,
          },
          {
            label: 'Send a refueling tanker spacecraft next week to top up its tanks.',
            outcomeText:
              'Moving at 61,200 km/h (17 km/s), it took Voyager 1 nearly 50 years to reach 24.4 billion km—no chemical rocket could catch up to it quickly!',
            isOptimal: false,
            xpBonus: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'story-opportunity',
    title: 'The Little Rover That Refused to Quit',
    subtitle: 'Opportunity’s 90-Day Mission That Lasted 5,352 Sols on Mars',
    era: '2004 – 2018 // Meridiani Planum, Mars',
    difficulty: 'Beginner',
    readTime: '4 min interactive',
    heroEmoji: '🔴',
    themeColor: 'rose',
    badgeId: 'badge-opportunity',
    badgeTitle: 'Martian Marathoner',
    chapters: [
      {
        id: 'opp-1',
        title: 'Chapter 1: Bouncing Airbags & Martian "Blueberries"',
        timestamp: 'January 25, 2004 // Eagle Crater, Mars',
        tensionLevel: 'NOMINAL',
        telemetryMetrics: [
          { label: 'WARRANTY', value: '90 SOLS (DAYS)', status: 'ok' },
          { label: 'MINERAL FOUND', value: 'HEMATITE CONCRETIONS', status: 'ok' },
          { label: 'SOLAR POWER', value: '900 WH / SOL', status: 'ok' },
        ],
        narrative:
          'Cocooned inside 24 giant Kevlar airbags, Opportunity slams into Meridiani Planum, bounces 26 times across the dusty plains, and rolls straight into a 22-meter crater—an interplanetary hole-in-one! When its panoramic cameras open, scientists see layered bedrock just meters away studded with thousands of tiny grey spheres nicknamed "blueberries."',
        quote: 'We have hit a hole-in-one! Opportunity has landed in a bizarre alien landscape.',
        quoteAuthor: 'Dr. Steve Squyres, Principal Investigator',
        scienceTakeaway:
          'Opportunity’s Mössbauer and Alpha Particle X-Ray Spectrometers proved those "blueberries" were concretions of Hematite (Fe₂O₃)—and the surrounding rocks contained Jarosite, a sulfate mineral that on Earth ONLY forms in the presence of liquid acidic water!',
        didYouKnowFact:
          'Both Spirit and Opportunity carried metal recovered from the fallen World Trade Center towers in New York, machined into protective cable shields on the rovers’ Rock Abrasion Tools as a tribute.',
        visualType: 'mars-storm',
        choicePrompt:
          'CADET DECISION: Fine red Martian dust is settling on Opportunity’s flat solar panels, cutting power every week. With no astronauts or wipers on Mars, how do you survive for 14+ years?',
        choices: [
          {
            label: 'Park on north-facing crater slopes ("Lily Pads") to angle the panels toward the low winter Sun, and rely on passing Martian wind gusts and "dust devils" to sweep the panels clean!',
            outcomeText:
              'MIRACLE IN THE DUST! Again and again, Martian whirlwinds ("cleaning events") swept the dust off Opportunity’s solar arrays overnight, boosting power back near 100% and extending a 90-day mission past 5,000 days!',
            isOptimal: true,
            xpBonus: 70,
          },
          {
            label: 'Flip the rover upside down to shake the dust off the solar wings.',
            outcomeText:
              'Flipping a 185-kg rover upside down on Mars would snap its camera mast and leave it stranded like a turtle on its back!',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Spray liquid water across the panels during the -70°C Martian night.',
            outcomeText:
              'Any liquid water sprayed outside on Mars would instantly freeze into opaque ice or sublimate into vapor!',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
      {
        id: 'opp-2',
        title: 'Chapter 2: "My Battery Is Low and It Is Getting Dark"',
        timestamp: 'June 10, 2018 // Perseverance Valley, Sol 5111',
        tensionLevel: 'EXTREME',
        telemetryMetrics: [
          { label: 'ODOMETER', value: '45.16 KM (RECORD!)', status: 'ok' },
          { label: 'SKY OPACITY (TAU)', value: '10.8 (99.99% BLOCKED)', status: 'crit' },
          { label: 'SOLAR ARRAY', value: '22 WH (CRITICAL LOW)', status: 'crit' },
        ],
        narrative:
          'After driving 45.16 kilometers—beating the off-Earth driving record and completing a full marathon on another world!—Opportunity reaches Perseverance Valley on the rim of Endeavour Crater. Suddenly, a regional dust storm explodes into a planet-encircling monster. Atmospheric opacity (Tau) hits an unprecedented 10.8, turning noon into pitch-black midnight across the entire planet.',
        quote: 'My battery is low and it is getting dark.',
        quoteAuthor: 'Poetic human translation of Opportunity’s final engineering telemetry packet',
        scienceTakeaway:
          'Opportunity’s final telemetry packet showed solar generation had fallen to just 22 watt-hours (barely enough to power a smartphone!) while atmospheric opacity blocked 99.99% of sunlight—forcing the rover into low-power fault sleep.',
        didYouKnowFact:
          'Before declaring Opportunity’s mission complete in February 2019 after 800+ recovery commands, flight controllers in the JPL Darkroom played one final wake-up song across the Deep Space Network: Billie Holiday’s "I’ll Be Seeing You."',
        visualType: 'mars-storm',
        choicePrompt:
          'CADET DECISION: What engineering upgrade did NASA adopt for the Curiosity and Perseverance rovers so that global Martian dust storms can never cut off their electricity?',
        choices: [
          {
            label: 'Equip them with an MMRTG (Multi-Mission Radioisotope Thermoelectric Generator) nuclear battery powered by Plutonium-238 heat that works 24/7 day, night, and through any dust storm!',
            outcomeText:
              'MISSION LEGACY UNLOCKED! Thanks to nuclear RTG power and Opportunity’s water discoveries, Curiosity and Perseverance can operate continuously through global dust storms while exploring ancient lakebeds!',
            isOptimal: true,
            xpBonus: 80,
          },
          {
            label: 'Attach a 50-meter wind turbine tower on top of the rover.',
            outcomeText:
              'Because Mars’s atmosphere is only 1% as dense as Earth’s, even a 100 km/h Martian wind carries very little kinetic force—and a 50m tower wouldn’t fit inside a rocket fairing!',
            isOptimal: false,
            xpBonus: 30,
          },
          {
            label: 'Only launch rovers that stay active for 24 hours on AA batteries.',
            outcomeText:
              'Spending billions of dollars to land on Mars for just 24 hours would miss years of geological discovery across craters and river deltas!',
            isOptimal: false,
            xpBonus: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'story-jwst',
    title: 'Unfolding the Cosmic Time Machine',
    subtitle: 'How James Webb Conquered 344 Single-Point Failures at L2',
    era: 'December 2021 – Present // Lagrange Point L2',
    difficulty: 'Intermediate',
    readTime: '4 min interactive',
    heroEmoji: '🔭',
    themeColor: 'purple',
    badgeId: 'badge-webb',
    badgeTitle: 'Infrared Time Traveler',
    chapters: [
      {
        id: 'webb-1',
        title: 'Chapter 1: 344 Single-Point Failures in Deep Space',
        timestamp: 'January 2022 // 1.5 Million km from Earth (4x Moon Distance)',
        tensionLevel: 'CRITICAL',
        telemetryMetrics: [
          { label: 'HOT SIDE TEMP', value: '+85°C (SUN-FACING)', status: 'warn' },
          { label: 'COLD SIDE TEMP', value: '-233°C (CRYO LOCK)', status: 'ok' },
          { label: 'DEPLOYMENTS', value: '344 / 344 COMPLETED', status: 'ok' },
        ],
        narrative:
          'Unlike the Hubble Space Telescope orbiting 535 km overhead where Space Shuttle astronauts could fly up and fix it, the James Webb Space Telescope is heading to Sun-Earth Lagrange Point L2—1.5 million kilometers away (nearly 4 times farther than the Moon!). To fit its 6.5-meter golden mirror and tennis-court-sized sunshield inside an Ariane 5 rocket, engineers had to fold the observatory like origami with 178 release pins and 344 single-point-of-failure steps!',
        quote: 'Webb is designed to see the very first stars and galaxies that switched on after the Big Bang.',
        quoteAuthor: 'Dr. John Mather, Nobel Laureate & JWST Senior Project Scientist',
        scienceTakeaway:
          'Because the universe is expanding, ultraviolet and visible light emitted by the earliest stars 13.5 billion years ago has been stretched out during its journey into longer Infrared wavelengths ("Cosmological Redshift"). To see faint infrared heat without being blinded by its own warmth, JWST must stay below -223°C!',
        didYouKnowFact:
          'Each of JWST’s 18 hexagonal mirror segments was carved out of solid Beryllium—a rare metal that is lighter than aluminum, stronger than steel by weight, and holds its exact shape at -233°C!',
        visualType: 'webb-mirror',
        choicePrompt:
          'CADET DECISION: After all 18 gold hexagonal mirrors unfold in space, they act like 18 separate blurry telescopes pointing slightly off-kilter. How do you align them into a single razor-sharp 6.5-meter mirror 1.5 million km from home?',
        choices: [
          {
            label: 'Point at an isolated guide star (HD 84406) and use 126 microscopic stepper motors behind the hexagons to nudge each segment’s tilt and curvature in 10-nanometer steps (1/10,000th of a human hair) until all 18 star images stack into one perfect diffraction spike!',
            outcomeText:
              'OPTICAL PERFECTION! Wavefront sensing engineers aligned JWST’s 18 segments to within 50 nanometers—exceeding every diffraction-limit requirement and unveiling thousands of background galaxies in its very first calibration shot!',
            isOptimal: true,
            xpBonus: 80,
          },
          {
            label: 'Send a Space Shuttle crew out to L2 with a wrench to tighten the bolts.',
            outcomeText:
              'The Space Shuttle could only reach Low Earth Orbit (~600 km), and L2 is 1,500,000 km away—no crewed spacecraft has ever flown that far!',
            isOptimal: false,
            xpBonus: 25,
          },
          {
            label: 'Melt the 18 segments together using focused sunlight.',
            outcomeText:
              'Never let direct sunlight touch JWST’s cold side! Direct solar heat would warp the cryogenic optics and blind the infrared detectors instantly.',
            isOptimal: false,
            xpBonus: 25,
          },
        ],
      },
    ],
  },
];

export const INTERACTIVE_GUIDES: InteractiveGuide[] = [
  {
    id: 'newtons-cannon',
    title: 'How Orbits Actually Work: Newton’s Cannonball',
    subtitle: 'Why astronauts float (Hint: there IS still 90% gravity on the ISS!)',
    category: 'Orbital Mechanics 101',
    difficulty: 'Beginner Friendly',
    emoji: '🛰️',
    bigIdea:
      'One of the biggest myths about space is that astronauts on the International Space Station float because "there is no gravity in space." In reality, gravity at 400 km altitude is still 90% as strong as under your feet right now! Astronauts feel weightless because the station is racing sideways at 28,000 km/h (7.8 km/s)—falling toward Earth at the exact same rate the curved Earth drops away beneath them!',
    realWorldExample:
      'In 1687, Sir Isaac Newton drew a famous thought experiment in his Principia: imagine a cannon on top of a tall mountain above the atmosphere. Fire a cannonball slowly, and gravity pulls it into the ground. Fire it at 7.8 km/s, and as gravity pulls it down, Earth’s round horizon curves away at the exact same rate—so it falls forever around the planet without ever hitting the ground!',
    keyEquationsOrFacts: [
      'Circular Orbital Velocity: v = √(G·M / r) ≈ 7.8 km/s (Low Earth Orbit)',
      'Escape Velocity: v_esc = √2 · v_orbit ≈ 11.2 km/s (40,320 km/h from Earth)',
      'Earth curves downward by 5 meters for every 8 kilometers of horizontal distance!',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Suborbital Hop (< 7.4 km/s)',
        explanation:
          'When horizontal speed is too low, gravity curves the spacecraft’s path downward faster than the planet curves away, causing it to arc back to the surface.',
        tryItPrompt: 'Set the Cannon Launch Velocity slider below 6.5 km/s and click Fire!',
      },
      {
        stepNumber: 2,
        title: 'Circular Orbit (7.8 km/s)',
        explanation:
          'At First Cosmic Velocity (~7.8 km/s), the spacecraft falls 5 meters in the first second while moving 7.8 km sideways—matching Earth’s curvature to form a circle!',
        tryItPrompt: 'Set the slider between 7.5 and 8.2 km/s to lock into a stable circular orbit!',
      },
      {
        stepNumber: 3,
        title: 'Elliptical Orbit & Escape Velocity (8.5 – 11.2+ km/s)',
        explanation:
          'Fire faster (9–10.8 km/s) and the spacecraft swings out into a stretched oval (elliptical) orbit. Reach 11.2 km/s (Escape Velocity) and it breaks free of Earth’s gravity forever!',
        tryItPrompt: 'Crank the slider to 11.2 km/s to escape into deep space!',
      },
    ],
    badgeId: 'badge-newton',
    badgeTitle: 'Orbital Architect',
  },
  {
    id: 'rocket-staging',
    title: 'Why Rockets Drop Pieces: The Staging Lab',
    subtitle: 'Conquering the "Tyranny of the Tsiolkovsky Rocket Equation"',
    category: 'Rocket Propulsion',
    difficulty: 'Beginner Friendly',
    emoji: '🚀',
    bigIdea:
      'To accelerate in the vacuum of space, a rocket throws hot exhaust gas out the back at extreme speed (Newton’s 3rd Law). But fuel is heavy! If you add more fuel, your rocket gets heavier, so you need EVEN MORE fuel just to lift the extra fuel! Worse yet, once half your giant tank is empty, you are wasting energy hauling tons of empty metal tank into space.',
    realWorldExample:
      'Russian pioneer Konstantin Tsiolkovsky proved in 1903 that the only practical way to reach orbital velocity (9.4 km/s Δv including gravity and air drag losses) is "Staging": stacking 2 or 3 rockets on top of each other and discarding empty booster tanks mid-flight so the upper stage pushes only a lightweight capsule!',
    keyEquationsOrFacts: [
      'Tsiolkovsky Rocket Equation: Δv = v_e · ln(m_0 / m_f)',
      'Saturn V was 85% fuel by weight at liftoff; its Crew Command Module was only 0.2% of liftoff mass!',
      'Low Earth Orbit requires ~9.4 km/s of Δv (7.8 km/s orbital speed + ~1.6 km/s gravity/drag loss).',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'The Single-Stage Weight Trap',
        explanation:
          'A single-stage rocket drags 100% of its heavy structural metal all the way to space, struggling to reach 9.4 km/s Delta-V.',
        tryItPrompt: 'Select "1 Stage" in the 3D simulator and notice how hard it is to reach 9.4 km/s.',
      },
      {
        stepNumber: 2,
        title: 'Two & Three Stage Separation',
        explanation:
          'Dropping empty booster stages mid-flight sheds dead weight, letting the smaller upper engine accelerate the capsule past 9.4 km/s into orbit!',
        tryItPrompt: 'Switch to 2 or 3 Stages and adjust Fuel Fraction to break the 9.4 km/s orbital barrier!',
      },
      {
        stepNumber: 3,
        title: 'Reusable Booster Landings',
        explanation:
          'Modern rockets like Falcon 9 drop Stage 1 at ~70 km altitude and relight its engines to land upright on a drone ship rather than sinking in the ocean!',
        tryItPrompt: 'Claim your Chief Rocket Engineer badge once your Δv exceeds 9.40 km/s!',
      },
    ],
    badgeId: 'badge-rocketeer',
    badgeTitle: 'Chief Rocket Engineer',
  },
  {
    id: 'exoplanet-transit',
    title: 'Hunting Alien Worlds: The Transit Light-Curve Lab',
    subtitle: 'How NASA discovers Earth-sized planets orbiting distant stars',
    category: 'Astrophysics & Exoplanets',
    difficulty: 'All Ages',
    emoji: '🪐',
    bigIdea:
      'Stars are billions of times brighter than the planets orbiting them—trying to see an alien planet directly next to its star is like trying to spot a firefly next to a giant stadium searchlight from 1,000 kilometers away! Yet astronomers have confirmed over 5,600 exoplanets. How?',
    realWorldExample:
      'NASA’s Kepler and TESS space telescopes use "Transit Photometry": staring at ratusan of thousands of stars and measuring their exact brightness. Whenever an orbiting planet crosses directly in front of its star, it blocks a tiny fraction of starlight—creating a repeating U-shaped dip in the brightness graph!',
    keyEquationsOrFacts: [
      'Transit Dip Depth = (R_planet / R_star)² — tells you the exact size of the alien planet!',
      'Time Between Dips = Planet’s Year Length (Orbital Period) — tells you its distance from the star via Kepler’s 3rd Law!',
      'JWST reads starlight filtering through the planet’s rim during a transit ("Transmission Spectroscopy") to detect water vapor and CO₂!',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Planet Size = Depth of the Brightness Dip',
        explanation:
          'A giant Jupiter-sized planet blocks ~1% of a Sun-like star’s light (a deep dip), whereas a small Earth-sized rocky world blocks only ~0.01% (a tiny dip).',
        tryItPrompt: 'Drag the "Exoplanet Size" slider and watch the live Light Curve dip deepen!',
      },
      {
        stepNumber: 2,
        title: 'Orbital Speed = Finding the Habitable Zone',
        explanation:
          'How often the dip repeats tells you the planet’s orbital distance—revealing whether it sits in the temperate "Goldilocks Zone" where liquid water can exist!',
        tryItPrompt: 'Adjust the Orbital Speed slider into the green Habitable Zone (1.5–2.5)!',
      },
      {
        stepNumber: 3,
        title: 'Atmospheric Biosignatures',
        explanation:
          'When starlight passes through an exoplanet’s atmosphere during transit, gases like water vapor, methane, and carbon dioxide leave barcode absorption lines.',
        tryItPrompt: 'Claim your Exoplanet Hunter badge after testing both sliders!',
      },
    ],
    badgeId: 'badge-exoplanet',
    badgeTitle: 'Exoplanet Hunter',
  },
  {
    id: 'spacesuit-anatomy',
    title: 'The Personal Spacecraft: Inside an Astronaut’s Suit',
    subtitle: 'How a 14-layer EVA spacesuit keeps you alive in vacuum',
    category: 'Human Spaceflight',
    difficulty: 'Beginner Friendly',
    emoji: '🧑‍🚀',
    bigIdea:
      'An EVA (Extravehicular Activity) spacesuit isn’t just clothing—it is a miniature one-person spacecraft! In the vacuum of space, zero air pressure causes exposed body fluids to boil at human body temperature (37°C, known as "Ebullism"), micrometeoroids fly at 28,000 km/h, and temperatures swing from +120°C in sunlight to -150°C in shadow.',
    realWorldExample:
      'NASA’s EMU and Artemis xEMU spacesuits combine 14 specialized layers—from 90 meters of water-cooling tubes woven into spandex underwear to bulletproof Kevlar armor and a 24k gold-coated visor.',
    keyEquationsOrFacts: [
      'Suit Operating Pressure: 4.3 psi (29.6 kPa) of 100% pure Oxygen (vs 14.7 psi air on Earth) so joints stay flexible!',
      'Why spacesuits are white: White reflects 85%+ of solar radiant heat in vacuum!',
      'Astronauts wear a SAFER mini-jetpack over their PLSS backpack in case their safety tether ever snaps during an ISS spacewalk!',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Liquid Cooling & Pressure Bladder Layers',
        explanation:
          'Astronauts wear 90 meters of chilled water tubes against their skin to carry away body heat, surrounded by an airtight urethane bladder.',
        tryItPrompt: 'Click each of the 5 suit layers next to the 3D EVA Suit to highlight them!',
      },
      {
        stepNumber: 2,
        title: '24K Gold Visor & Micrometeoroid Armor',
        explanation:
          'A microscopic gold coating reflects infrared heat and UV rays, while 7 layers of Mylar and Kevlar stop hypervelocity dust grains.',
        tryItPrompt: 'Rotate the 3D Astronaut Suit model and inspect all 5 subsystems!',
      },
      {
        stepNumber: 3,
        title: 'Primary Life Support Backpack (PLSS)',
        explanation:
          'The backpack supplies 7 hours of oxygen, scrubs exhaled CO₂, circulates cooling water, and powers two-way radio telemetry.',
        tryItPrompt: 'Inspect all 5 layers to unlock the EVA Spacesuit Specialist badge!',
      },
    ],
    badgeId: 'badge-spacesuit',
    badgeTitle: 'EVA Spacesuit Specialist',
  },
];

export const SPACE_GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Astronomical Unit (AU)',
    pronunciation: 'as-truh-NOM-ih-kul YOO-nit',
    category: 'Orbits & Physics',
    simpleDefinition:
      'The average distance between the Earth and the Sun—149,597,870.7 kilometers (about 150 million km or 93 million miles).',
    everydayAnalogy:
      'Instead of measuring road trips in millimeters, astronomers use Earth-to-Sun steps as a cosmic yardstick! Mars is 1.52 AU away; Neptune is 30.1 AU away.',
    funFact: 'Voyager 1 is currently over 163 AU from the Sun—more than 5 times farther out than Neptune!',
    emoji: '📏',
  },
  {
    term: 'Black Hole & Event Horizon',
    pronunciation: 'ee-VENT huh-RY-zun',
    category: 'Stars & Galaxies',
    simpleDefinition:
      'A region of spacetime where gravity is so intense that nothing—not even light traveling at 300,000 km/s—can escape once it crosses the boundary called the Event Horizon.',
    everydayAnalogy:
      'Like a cosmic waterfall where the river flows faster and faster toward the edge; once a boat crosses the brink, no engine is fast enough to paddle back upstream.',
    funFact: 'At the center of our Milky Way galaxy sits "Sagittarius A*"—a supermassive black hole 4.1 million times the mass of our Sun!',
    emoji: '🕳️',
  },
  {
    term: 'Cold Welding',
    pronunciation: 'KOHLD WEL-ding',
    category: 'Rockets & Tech',
    simpleDefinition:
      'When two clean, uncoated pieces of the same metal touch in the vacuum of space and permanently fuse into a single solid piece of metal without any heat!',
    everydayAnalogy:
      'On Earth, air instantly coats metal with a microscopic layer of oxidized rust/air molecules. In space, bare metal atoms don’t know they are in two separate pieces, so they bond immediately!',
    funFact: 'Cold welding jammed the main high-gain antenna on NASA’s Galileo Jupiter probe in 1991—which is why spacecraft gears are carefully coated or made of dissimilar materials!',
    emoji: '🔩',
  },
  {
    term: 'Cosmic Microwave Background (CMB)',
    pronunciation: 'KOZ-mik MY-kroh-wayv',
    category: 'Stars & Galaxies',
    simpleDefinition:
      'The faint, cooled afterglow of light left over from the Big Bang, filling the entire universe at a temperature of 2.725 Kelvin (-270.4°C).',
    everydayAnalogy:
      'Like feeling the warm glow of oven walls hours after a cake was baked—it is the oldest baby picture of the universe from when it was just 380,000 years old!',
    funFact: 'About 1% of the "snow" static on an old analog television tuned between channels is literally radiation from the Big Bang!',
    emoji: '📺',
  },
  {
    term: 'Delta-V (Δv)',
    pronunciation: 'DEL-tuh VEE',
    category: 'Rockets & Tech',
    simpleDefinition:
      'Literally "change in velocity"—the total amount of speed change a spacecraft has enough propellant to perform for maneuvers.',
    everydayAnalogy:
      'Think of Delta-V as your "budget of speed changes." Reaching Low Earth Orbit costs ~9.4 km/s of Δv; heading from Low Earth Orbit to the Moon costs another ~3.9 km/s.',
    funFact: 'A 10,000-kg rocket and a 1,000-kg rocket with the same fuel-to-mass ratio and engine exhaust speed have the exact same Delta-V!',
    emoji: '⚡',
  },
  {
    term: 'Escape Velocity',
    pronunciation: 'eh-SKAYP vuh-LAH-sih-tee',
    category: 'Orbits & Physics',
    simpleDefinition:
      'The minimum speed an unpowered object needs to break completely free from the gravitational pull of a planet or star without falling back.',
    everydayAnalogy:
      'Throw a ball up at 10 m/s and it falls back to your hand. Throw it upward from Earth at 11.2 km/s (40,320 km/h) and Earth’s gravity weakens with distance faster than it can stop the ball!',
    funFact: 'Escape velocity is always exactly √2 (about 1.414) times faster than circular orbital velocity at the same altitude!',
    emoji: '🚀',
  },
  {
    term: 'Exoplanet',
    pronunciation: 'EK-soh-plan-it',
    category: 'Planets & Moons',
    simpleDefinition:
      'Any planet that orbits a star outside our own Solar System.',
    everydayAnalogy:
      'Our Sun has 8 planets, and astronomers estimate there is at least 1 exoplanet on average for every star in the Milky Way—meaning hundreds of billions of alien worlds!',
    funFact: 'The closest known exoplanet to Earth is Proxima Centauri b, orbiting in the Habitable Zone of our nearest neighboring star just 4.24 light-years away!',
    emoji: '🪐',
  },
  {
    term: 'Gravity Assist (Slingshot)',
    pronunciation: 'GRAV-ih-tee uh-SIST',
    category: 'Orbits & Physics',
    simpleDefinition:
      'Flying a spacecraft close behind a moving planet to steal a tiny fraction of the planet’s orbital momentum and boost the spacecraft’s speed relative to the Sun without burning fuel.',
    everydayAnalogy:
      'Like bouncing a tennis ball off the front of an oncoming 100 km/h train—the ball bounces away much faster than you threw it, while the massive train slows down by an unmeasurably tiny amount!',
    funFact: 'Voyager 2 used gravity assists at Jupiter, Saturn, AND Uranus to reach Neptune in 12 years instead of 30 years!',
    emoji: '🪃',
  },
  {
    term: 'Habitable Zone (Goldilocks Zone)',
    pronunciation: 'HAB-ih-tuh-bul ZOHN',
    category: 'Planets & Moons',
    simpleDefinition:
      'The orbital distance belt around a star where surface temperatures allow liquid water to pool on a rocky planet with sufficient atmospheric pressure.',
    everydayAnalogy:
      'Like sitting at just the right distance from a campfire—not close enough to boil water away, not far enough to freeze it solid.',
    funFact: 'Around a cool Red Dwarf star like TRAPPIST-1, the Habitable Zone is closer to the star than Mercury is to our Sun, and 3 planets orbit inside it!',
    emoji: '💧',
  },
  {
    term: 'Heliopause',
    pronunciation: 'HEE-lee-oh-pawz',
    category: 'Stars & Galaxies',
    simpleDefinition:
      'The outer boundary (~120 AU from the Sun) where the outward pressure of the Sun’s solar wind balances against the interstellar medium of the Milky Way.',
    everydayAnalogy:
      'Like the circular ripple where water from a garden hose spraying into a swimming pool slows down and meets the surrounding pool water.',
    funFact: 'Only two human-made objects with working instruments have ever crossed the Heliopause: Voyager 1 (2012) and Voyager 2 (2018).',
    emoji: '🛡️',
  },
  {
    term: 'Kuiper Belt & Oort Cloud',
    pronunciation: 'KY-per belt',
    category: 'Planets & Moons',
    simpleDefinition:
      'The Kuiper Belt is a donut-shaped ring of icy worlds beyond Neptune (30–55 AU, including Pluto), while the Oort Cloud is a gigantic spherical shell of trillions of icy comets surrounding the Solar System up to 100,000 AU out!',
    everydayAnalogy:
      'If the planets are houses in a town, the Kuiper Belt is the suburban ring road and the Oort Cloud is a vast forest stretching halfway to the next town!',
    funFact: 'It will take Voyager 1 about 300 years just to reach the inner edge of the Oort Cloud, and 30,000 years to fly out the other side!',
    emoji: '☄️',
  },
  {
    term: 'Lagrange Points (L1–L5)',
    pronunciation: 'luh-GRAHNJ poynts',
    category: 'Orbits & Physics',
    simpleDefinition:
      'Five mathematical parking spots in space where the combined gravity of two large bodies (like the Sun and Earth) provides the exact centripetal force needed for a small spacecraft to orbit right along with them.',
    everydayAnalogy:
      'Like five calm eddies in a swirling river where a leaf can float in sync with a boulder without drifting away.',
    funFact: 'The James Webb Space Telescope orbits Sun-Earth L2 (1.5 million km behind Earth), while the SOHO solar observatory parks at L1 (1.5 million km in front of Earth)!',
    emoji: '🎯',
  },
  {
    term: 'Light-Year',
    pronunciation: 'LITE-yeer',
    category: 'Stars & Galaxies',
    simpleDefinition:
      'A unit of DISTANCE (not time!): the distance a beam of light travels in vacuum in one Julian year (365.25 days)—equal to 9.46 trillion kilometers (5.88 trillion miles).',
    everydayAnalogy:
      'Saying a star is "4 light-years away" is like saying a friend’s house is "a 10-minute bike ride away"—it measures distance using travel speed!',
    funFact: 'Because light takes time to travel, looking into deep space is literally looking backward in time: we see the Andromeda Galaxy as it looked 2.5 million years ago!',
    emoji: '💡',
  },
  {
    term: 'Microgravity (Zero-G)',
    pronunciation: 'MY-kroh-grav-ih-tee',
    category: 'Orbits & Physics',
    simpleDefinition:
      'The condition of apparent weightlessness experienced when a spacecraft and everything inside it are in continuous free-fall together along an orbit.',
    everydayAnalogy:
      'If an elevator’s cables snapped (in a vacuum shaft), you and your backpack would float next to each other as you both fell at the exact same rate—an orbit is just a sideways free-fall that never hits the ground!',
    funFact: 'Flames in microgravity burn as quiet, blue spheres instead of teardrop shapes because warm air doesn’t rise when everything is weightless!',
    emoji: '🧑‍🚀',
  },
  {
    term: 'Neutron Star & Pulsar',
    pronunciation: 'NOO-tron star / PUL-sar',
    category: 'Stars & Galaxies',
    simpleDefinition:
      'The ultra-dense collapsed core left behind after a massive star explodes in a supernova—packing 1.4+ suns of mass into a city-sized sphere only 20 kilometers wide!',
    everydayAnalogy:
      'Imagine squeezing the mass of 500,000 Earths down until it fits inside the city limits of Manhattan—spinning up to 700 times per second like a cosmic lighthouse ("Pulsar")!',
    funFact: 'When Jocelyn Bell Burnell discovered the first pulsar in 1967, the radio pulses were so clockwork-regular every 1.337 seconds that the team nicknamed the signal "LGM-1" (Little Green Men 1)!',
    emoji: '🌟',
  },
  {
    term: 'Redshift (Cosmological & Doppler)',
    pronunciation: 'RED-shift',
    category: 'Stars & Galaxies',
    simpleDefinition:
      'The stretching of light waves toward longer, redder (and infrared) wavelengths when a light source is moving away from us or as the fabric of space itself expands during the light’s journey.',
    everydayAnalogy:
      'Just like a racecar engine or ambulance siren drops to a lower pitch as it speeds away from you, light waves stretch to "lower-pitched" redder colors!',
    funFact: 'Edwin Hubble’s 1929 discovery that nearly all distant galaxies are redshifted proved that the entire universe is expanding!',
    emoji: '🌈',
  },
  {
    term: 'Roche Limit',
    pronunciation: 'ROHSH LIM-it',
    category: 'Orbits & Physics',
    simpleDefinition:
      'The closest distance a moon or comet can approach a large planet before the planet’s tidal gravity pulls harder on the moon’s near side than the moon’s own gravity can hold it together—shredding it into a ring!',
    everydayAnalogy:
      'Walk too close to a giant gravitational taffy-puller, and the difference in pull between your head and your feet stretches you apart into pieces.',
    funFact: 'Mars’s moon Phobos is spiraling inward and will cross Mars’s Roche Limit in ~30–50 million years, crumbling into a bright Martian ring!',
    emoji: '💍',
  },
  {
    term: 'Sol',
    pronunciation: 'SAWL',
    category: 'Planets & Moons',
    simpleDefinition:
      'One full solar day (sunrise to sunrise) on Mars—lasting 24 hours, 39 minutes, and 35.244 seconds.',
    everydayAnalogy:
      'A Martian day is just 2.7% longer than an Earth day—so NASA Mars rover engineers wear special watches calibrated to "Mars Time" that shift 40 minutes later every day!',
    funFact: 'Opportunity operated for 5,352 Sols on Mars (which equals 5,498 Earth days)!',
    emoji: '☀️',
  },
  {
    term: 'Supernova',
    pronunciation: 'soo-per-NOH-vuh',
    category: 'Stars & Galaxies',
    simpleDefinition:
      'The cataclysmic explosion of a massive star at the end of its life, briefly outshining an entire galaxy of 100 billion stars and forging heavy elements like iron, gold, and calcium.',
    everydayAnalogy:
      'Stars are cosmic alchemy furnaces; when they explode as supernovae, they scatter the chemical ingredients for rocky planets and human beings across the galaxy.',
    funFact: 'As Carl Sagan famously explained: the iron in your blood, the calcium in your bones, and the oxygen you breathe were literally forged inside ancient stars—we are made of starstuff!',
    emoji: '💥',
  },
  {
    term: 'Terminator Line',
    pronunciation: 'TER-mih-nay-ter line',
    category: 'Planets & Moons',
    simpleDefinition:
      'The moving boundary circle on a planet or moon that separates the sunlit daytime hemisphere from the dark nighttime hemisphere.',
    everydayAnalogy:
      'The continuous ring of sunrise and sunset wrapping all the way around a globe—where low-angle sunlight casts the longest, most dramatic crater shadows!',
    funFact: 'Apollo 13 Commander Jim Lovell used Earth’s crescent Terminator Line in his window crosshairs to manually steer their survival engine burn when their computer was powered down!',
    emoji: '🌓',
  },
];

export const TRIVIA_GAUNTLET_QUESTIONS: QuizQuestionItem[] = [
  {
    question: 'If two clean pieces of the same pure metal touch in the vacuum of space, what surprising physical phenomenon can occur?',
    options: [
      'They instantly evaporate into gas',
      'They permanently fuse together into one solid piece without heat ("Cold Welding")',
      'They become magnetic and repel each other',
      'They turn into liquid mercury',
    ],
    correctIndex: 1,
    explanation:
      'Without an atmosphere to form a microscopic oxide barrier layer on metal surfaces, bare metal atoms share electrons on contact and fuse via Cold Welding!',
    xpReward: 40,
  },
  {
    question: 'Why do footprints left by the Apollo astronauts on the Moon remain sharp for millions of years?',
    options: [
      'NASA sprayed superglue over the footprints',
      'The Moon has no atmosphere, wind, or liquid water rain to erode the surface regolith (only slow micrometeoroid gardening)',
      'Lunar soil is magnetic',
      'Robot rovers sweep around them every week',
    ],
    correctIndex: 1,
    explanation:
      'Without wind or liquid water erosion, lunar surface features change only over millions of years from tiny micrometeorite impacts.',
    xpReward: 40,
  },
  {
    question: 'Which spacecraft is the fastest AND closest-to-the-Sun human-made object in history, reaching speeds of 692,000 km/h (192 km/s)?',
    options: [
      'Voyager 1',
      'Apollo 10',
      'NASA’s Parker Solar Probe',
      'The International Space Station',
    ],
    correctIndex: 2,
    explanation:
      'Using repeated Venus gravity assists to dive deeper into the Sun’s intense gravity well, Parker Solar Probe reached 692,000 km/h—fast enough to fly from New York to Tokyo in under 1 minute!',
    xpReward: 40,
  },
  {
    question: 'Why do flames in microgravity aboard the International Space Station burn as round blue spheres instead of elongated yellow teardrops?',
    options: [
      'Because there is no buoyancy convection in weightlessness (hot air doesn’t "rise" when nothing has weight!)',
      'Because space oxygen is painted blue',
      'Because astronauts blow on them from all sides',
      'Because gravity squashes them flat',
    ],
    correctIndex: 0,
    explanation:
      'On Earth, gravity pulls denser cool air down and pushes lighter hot air up, stretching flames into teardrops. In microgravity, oxygen diffuses equally from all directions, creating spherical flames!',
    xpReward: 40,
  },
  {
    question: 'What happens to an astronaut’s height during several months of living in microgravity on the ISS?',
    options: [
      'They shrink by 10 centimeters',
      'They grow up to 5 cm (2 inches) taller as their spinal discs decompress without Earth’s gravity pulling down',
      'Their legs become twice as long permanently',
      'Nothing changes at all',
    ],
    correctIndex: 1,
    explanation:
      'Without Earth’s 1g compression, fluid fills the intervertebral discs of the spine, elongating the torso by up to 5 cm until the astronaut returns to Earth’s gravity.',
    xpReward: 40,
  },
  {
    question: 'Which moon in our Solar System has over 400 active volcanoes, making it the most geologically active world known?',
    options: [
      'Earth’s Moon',
      'Jupiter’s moon Io',
      'Mars’s moon Deimos',
      'Neptune’s moon Proteus',
    ],
    correctIndex: 1,
    explanation:
      'Caught in a gravitational tug-of-war between Jupiter, Europa, and Ganymede, Io’s interior is kneaded by tidal forces that power 400+ active sulfur and silicate volcanoes!',
    xpReward: 40,
  },
  {
    question: 'What does a "Light-Year" measure in astronomy?',
    options: [
      'Time (365 days)',
      'Brightness of a lightbulb',
      'Distance—specifically the 9.46 trillion kilometers that light travels in vacuum in one Earth year',
      'Weight of a star',
    ],
    correctIndex: 2,
    explanation:
      'Despite having "year" in its name, a light-year is strictly a unit of distance (~9.46 × 10¹² km).',
    xpReward: 40,
  },
  {
    question: 'Why did NASA coat the 18 hexagonal mirror segments of the James Webb Space Telescope in pure 24-karat gold?',
    options: [
      'To make the telescope heavier for launch',
      'Because gold reflects 98% of infrared light (far better than aluminum or silver for heat wavelengths)',
      'To pay aliens a toll at Lagrange Point L2',
      'Because gold is transparent to X-rays',
    ],
    correctIndex: 1,
    explanation:
      'JWST observes redshifted infrared light from the early universe, and a 100-nanometer layer of vapor-deposited gold reflects 98% of infrared photons!',
    xpReward: 40,
  },
];

export const ACADEMY_BADGES: BadgeAward[] = [
  {
    id: 'badge-orientation',
    title: 'Sworn Cosmosis Cadet',
    description: 'Completed the interactive COSMOSIS Orientation Walkthrough.',
    icon: '🎖️',
    category: 'Explorer',
    xpValue: 50,
  },
  {
    id: 'badge-planetary-scout',
    title: 'Solar System Scout',
    description: 'Inspected 3+ planets and answered planetary quizzes in the 3D Observatory.',
    icon: '🪐',
    category: 'Explorer',
    xpValue: 100,
  },
  {
    id: 'badge-spacecraft-engineer',
    title: 'Spacecraft Forensic Analyst',
    description: 'Scanned 3+ spacecraft hardware subsystems in the 3D Hangar.',
    icon: '🛰️',
    category: 'Explorer',
    xpValue: 100,
  },
  {
    id: 'badge-tranquility',
    title: 'Tranquility Base Navigator',
    description: 'Completed the interactive Apollo 11 story "The 45 Seconds of Eagle".',
    icon: '🌕',
    category: 'Storyteller',
    xpValue: 120,
  },
  {
    id: 'badge-apollo13',
    title: 'Failure Is Not An Option',
    description: 'Guided the crew of Apollo 13 safely home through their survival thriller.',
    icon: '🛠️',
    category: 'Storyteller',
    xpValue: 140,
  },
  {
    id: 'badge-skycrane',
    title: 'Sky-Crane Flight Director',
    description: 'Mastered Perseverance’s "Seven Minutes of Terror" Mars landing chronicle.',
    icon: '🪂',
    category: 'Storyteller',
    xpValue: 130,
  },
  {
    id: 'badge-voyager',
    title: 'Interstellar Emissary',
    description: 'Completed the Voyager 1 & Golden Record chronicle.',
    icon: '✨',
    category: 'Storyteller',
    xpValue: 120,
  },
  {
    id: 'badge-opportunity',
    title: 'Martian Marathoner',
    description: 'Completed Opportunity Rover’s 5,352-Sol Martian chronicle.',
    icon: '🔴',
    category: 'Storyteller',
    xpValue: 120,
  },
  {
    id: 'badge-webb',
    title: 'Infrared Time Traveler',
    description: 'Completed the James Webb Space Telescope unfolding chronicle.',
    icon: '🔭',
    category: 'Storyteller',
    xpValue: 120,
  },
  {
    id: 'badge-newton',
    title: 'Orbital Architect',
    description: 'Achieved a stable orbit in Sir Isaac Newton’s Cannonball Lab.',
    icon: '🎯',
    category: 'Scientist',
    xpValue: 110,
  },
  {
    id: 'badge-rocketeer',
    title: 'Chief Rocket Engineer',
    description: 'Reached orbital Delta-V (9.4+ km/s) in the Multi-Stage Rocket Lab.',
    icon: '🚀',
    category: 'Scientist',
    xpValue: 110,
  },
  {
    id: 'badge-exoplanet',
    title: 'Exoplanet Hunter',
    description: 'Detected a Habitable Zone planet in the Transit Light-Curve Lab.',
    icon: '🌍',
    category: 'Scientist',
    xpValue: 110,
  },
  {
    id: 'badge-spacesuit',
    title: 'EVA Spacesuit Specialist',
    description: 'Inspected all 5 life-support layers of the astronaut EVA suit.',
    icon: '🧑‍🚀',
    category: 'Scientist',
    xpValue: 110,
  },
  {
    id: 'badge-lunar-ace',
    title: 'Eagle Touchdown Ace',
    description: 'Soft-landed the Lunar Module at under 2.4 m/s in the Flight Simulator!',
    icon: '🏆',
    category: 'Ace Pilot',
    xpValue: 150,
  },
  {
    id: 'badge-slingshot-ace',
    title: 'Gravity Slingshot Master',
    description: 'Successfully curved a space probe around a planet to hit the target relay gate!',
    icon: '☄️',
    category: 'Ace Pilot',
    xpValue: 150,
  },
  {
    id: 'badge-signal-decoder',
    title: 'Deep Space Signal Decoder',
    description: 'Locked onto a deep space telemetry frequency and aced the Cosmic Quiz!',
    icon: '📡',
    category: 'Ace Pilot',
    xpValue: 150,
  },
];
