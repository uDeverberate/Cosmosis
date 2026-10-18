import * as THREE from 'three';

// Deterministic pseudo-random helper for realistic planetary terrain & noise
function seededNoise(x: number, y: number, seed = 1): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.12) * 43758.5453;
  return n - Math.floor(n);
}

function fbmNoise(x: number, y: number, octaves = 5, seed = 1): number {
  let value = 0;
  let amplitude = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    const ix = Math.floor(x * freq);
    const iy = Math.floor(y * freq);
    const fx = x * freq - ix;
    const fy = y * freq - iy;

    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);

    const a = seededNoise(ix, iy, seed + i * 17);
    const b = seededNoise(ix + 1, iy, seed + i * 17);
    const c = seededNoise(ix, iy + 1, seed + i * 17);
    const d = seededNoise(ix + 1, iy + 1, seed + i * 17);

    const res = a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
    value += res * amplitude;
    amplitude *= 0.5;
    freq *= 2.05;
  }
  return value;
}

export interface PlanetTextureBundle {
  map: THREE.Texture;
  bumpMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  cloudsMap?: THREE.Texture;
  ringMap?: THREE.Texture;
  nightMap?: THREE.Texture;
}

const textureCache: Record<string, PlanetTextureBundle> = {};

// Public-domain NASA & USGS spacecraft planetary texture sources (with seamless procedural fallback)
const NASA_TEXTURE_ARCHIVE: Record<string, { map?: string; bump?: string; clouds?: string; specular?: string }> = {
  earth: {
    map: 'https://unpkg.com/three@0.165.0/examples/textures/planets/earth_atmos_2048.jpg',
    clouds: 'https://unpkg.com/three@0.165.0/examples/textures/planets/earth_clouds_1024.png',
    specular: 'https://unpkg.com/three@0.165.0/examples/textures/planets/earth_specular_2048.jpg',
    bump: 'https://unpkg.com/three@0.165.0/examples/textures/planets/earth_normal_2048.jpg',
  },
  moon: {
    map: 'https://unpkg.com/three@0.165.0/examples/textures/planets/moon_1024.jpg',
  },
};

/**
 * Asynchronously checks and applies real NASA satellite maps when online,
 * smoothly enhancing the material without interrupting the scene.
 */
function tryLoadNasaTexture(planetId: string, bundle: PlanetTextureBundle) {
  if (typeof window === 'undefined') return;
  const urls = NASA_TEXTURE_ARCHIVE[planetId];
  if (!urls) return;

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  if (urls.map) {
    loader.load(
      urls.map,
      (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        bundle.map = tex;
      },
      undefined,
      () => {
        // Silent fallback to our ultra-realistic 2K procedural map
      }
    );
  }

  if (urls.clouds) {
    loader.load(
      urls.clouds,
      (cloudTex) => {
        cloudTex.wrapS = THREE.RepeatWrapping;
        cloudTex.wrapT = THREE.ClampToEdgeWrapping;
        bundle.cloudsMap = cloudTex;
      },
      undefined,
      () => {}
    );
  }

  if (urls.specular) {
    loader.load(
      urls.specular,
      (specTex) => {
        specTex.wrapS = THREE.RepeatWrapping;
        specTex.wrapT = THREE.ClampToEdgeWrapping;
        bundle.specularMap = specTex;
      },
      undefined,
      () => {}
    );
  }
}

export function getPlanetTextures(planetId: string): PlanetTextureBundle {
  if (textureCache[planetId]) {
    return textureCache[planetId];
  }

  // High-Resolution 2048x1024 generation canvas for photorealistic depth
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  // ==========================================================================
  // 1. THE SUN (SOL) — Dynamic Granulation, Plasma Convection & Magnetic Spots
  // ==========================================================================
  if (planetId === 'sun') {
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = (x / width) * 28;
        const ny = (y / height) * 14;
        const n = fbmNoise(nx, ny, 6, 11);
        const fine = fbmNoise(nx * 4, ny * 4, 3, 29);
        const val = n * 0.62 + fine * 0.38;

        const idx = (y * width + x) * 4;
        // High-energy incandescent solar photosphere (deep fiery orange to incandescent yellow-white)
        data[idx] = Math.min(255, Math.floor(220 + val * 55));
        data[idx + 1] = Math.min(255, Math.floor(70 + val * 175));
        data[idx + 2] = Math.min(255, Math.floor(5 + Math.pow(val, 2.4) * 210));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Realistic Magnetic Sunspot Groups with Umbra, Penumbra & Bright Faculae Rims
    const sunspots = [
      { x: 480, y: 420, r: 28 },
      { x: 535, y: 435, r: 16 },
      { x: 1280, y: 590, r: 35 },
      { x: 1340, y: 570, r: 20 },
      { x: 1640, y: 380, r: 24 },
    ];
    sunspots.forEach((s) => {
      const grad = ctx.createRadialGradient(s.x, s.y, s.r * 0.2, s.x, s.y, s.r * 2.4);
      grad.addColorStop(0, '#120400'); // Dark umbra core
      grad.addColorStop(0.42, '#782508'); // Penumbra filaments
      grad.addColorStop(0.72, 'rgba(254, 240, 138, 0.7)'); // Bright magnetic faculae
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    });

    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 2. MERCURY — Heavily Cratered Silicate Regolith, Caloris Basin & Ejecta Rays
  // ==========================================================================
  if (planetId === 'mercury') {
    const imgData = ctx.createImageData(width, height);
    const bumpData = bumpCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const n = fbmNoise((x / width) * 22, (y / height) * 11, 5, 42);
        const base = Math.floor(92 + n * 78);
        const idx = (y * width + x) * 4;

        imgData.data[idx] = base + 5;
        imgData.data[idx + 1] = base + 2;
        imgData.data[idx + 2] = base - 3;
        imgData.data[idx + 3] = 255;

        bumpData.data[idx] = base;
        bumpData.data[idx + 1] = base;
        bumpData.data[idx + 2] = base;
        bumpData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    bumpCtx.putImageData(bumpData, 0, 0);

    // Paint authentic impact craters and ejecta rays
    for (let i = 0; i < 180; i++) {
      const cx = (i * 347) % width;
      const cy = 60 + ((i * 227) % (height - 120));
      const r = 6 + (i % 7) * 7;

      // Crater floor & raised rim
      const g = ctx.createRadialGradient(cx, cy, r * 0.18, cx, cy, r * 1.3);
      g.addColorStop(0, 'rgba(45, 50, 58, 0.88)');
      g.addColorStop(0.78, 'rgba(195, 200, 210, 0.82)');
      g.addColorStop(1, 'rgba(120, 120, 125, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Bump map depression & rim height
      const bg = bumpCtx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.2);
      bg.addColorStop(0, '#101010');
      bg.addColorStop(0.85, '#ffffff');
      bg.addColorStop(1, 'rgba(128,128,128,0)');
      bumpCtx.fillStyle = bg;
      bumpCtx.beginPath();
      bumpCtx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
      bumpCtx.fill();
    }

    const map = new THREE.CanvasTexture(canvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 3. VENUS — Swirling Sulfuric Acid Cloud Decks & Chevron Wave Patterns
  // ==========================================================================
  if (planetId === 'venus') {
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      const lat = (y / height - 0.5) * 2;
      for (let x = 0; x < width; x++) {
        // High-altitude V-shaped chevron cloud wave
        const chevron = Math.abs(lat) * 3.2;
        const nx = (x / width) * 12 + chevron;
        const ny = (y / height) * 16;
        const n = fbmNoise(nx, ny, 6, 77);

        const idx = (y * width + x) * 4;
        imgData.data[idx] = Math.min(255, Math.floor(205 + n * 50));
        imgData.data[idx + 1] = Math.min(255, Math.floor(155 + n * 65));
        imgData.data[idx + 2] = Math.min(255, Math.floor(75 + n * 65));
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const map = new THREE.CanvasTexture(canvas);
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 4. EARTH — Realistic Continents, Bathymetric Oceans, Specular Water & 3D Clouds
  // ==========================================================================
  if (planetId === 'earth') {
    // 1. Bathymetric deep ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#082f49');
    oceanGrad.addColorStop(0.25, '#0284c7');
    oceanGrad.addColorStop(0.5, '#0369a1');
    oceanGrad.addColorStop(0.75, '#0284c7');
    oceanGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // Specular canvas: pure white (#ffffff) for oceans (reflects sunlight), black for land
    const specCanvas = document.createElement('canvas');
    specCanvas.width = width;
    specCanvas.height = height;
    const specCtx = specCanvas.getContext('2d')!;
    specCtx.fillStyle = '#ffffff'; // Oceans reflect light!
    specCtx.fillRect(0, 0, width, height);

    bumpCtx.fillStyle = '#111111';
    bumpCtx.fillRect(0, 0, width, height);

    // Helper to paint organic multi-toned continents (coastal shelf + lush vegetation + desert interiors)
    const drawContinent = (points: [number, number][], hasDesert = false) => {
      // Coastal shallow turquoise shelf
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      points.forEach(([px, py], i) => {
        const sx = px * 2;
        const sy = py * 2;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Interior biome (desert / mountain ranges)
      if (hasDesert) {
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        const cx = points.reduce((s, p) => s + p[0], 0) / points.length;
        const cy = points.reduce((s, p) => s + p[1], 0) / points.length;
        points.forEach(([px, py], i) => {
          const ix = (cx + (px - cx) * 0.58) * 2;
          const iy = (cy + (py - cy) * 0.58) * 2;
          if (i === 0) ctx.moveTo(ix, iy);
          else ctx.lineTo(ix, iy);
        });
        ctx.closePath();
        ctx.fill();
      }

      // Land is matte in specular map (black)
      specCtx.fillStyle = '#0a0a0a';
      specCtx.beginPath();
      points.forEach(([px, py], i) => {
        if (i === 0) specCtx.moveTo(px * 2, py * 2);
        else specCtx.lineTo(px * 2, py * 2);
      });
      specCtx.closePath();
      specCtx.fill();

      // Elevation bump
      bumpCtx.fillStyle = '#c5c5c5';
      bumpCtx.beginPath();
      points.forEach(([px, py], i) => {
        if (i === 0) bumpCtx.moveTo(px * 2, py * 2);
        else bumpCtx.lineTo(px * 2, py * 2);
      });
      bumpCtx.closePath();
      bumpCtx.fill();
    };

    // Authentic continent coordinates
    // North America & Canada
    drawContinent([
      [110, 75], [230, 60], [280, 115], [240, 185], [195, 225], [160, 195], [105, 130],
    ], true);
    // South America (Amazon Basin & Andes)
    drawContinent([
      [235, 240], [315, 265], [335, 325], [290, 420], [258, 435], [245, 330],
    ], false);
    // Greenland
    drawContinent([
      [310, 40], [385, 36], [370, 88], [320, 82],
    ], false);
    // Eurasia & Mediterranean
    drawContinent([
      [465, 80], [560, 65], [760, 65], [890, 95], [860, 185], [750, 225], [690, 245], [655, 195], [585, 180], [495, 155], [455, 125],
    ], true);
    // Africa (Sahara desert & Savanna)
    drawContinent([
      [460, 175], [570, 175], [625, 235], [600, 345], [560, 398], [515, 340], [455, 245],
    ], true);
    // Australia & New Zealand
    drawContinent([
      [770, 315], [870, 310], [885, 375], [810, 395], [765, 355],
    ], true);

    // Polar Ice Caps (Arctic & Antarctica)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, 48);
    ctx.fillRect(0, height - 76, width, 76);

    // Fine terrain elevation noise
    const imgData = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const n = (fbmNoise((x / width) * 36, (y / height) * 18, 4, 91) - 0.5) * 32;
        const idx = (y * width + x) * 4;
        imgData.data[idx] = Math.min(255, Math.max(0, imgData.data[idx] + n));
        imgData.data[idx + 1] = Math.min(255, Math.max(0, imgData.data[idx + 1] + n));
        imgData.data[idx + 2] = Math.min(255, Math.max(0, imgData.data[idx + 2] + n));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Transparent 3D Atmospheric Cloud Layer with Swirling Cyclonic Storm
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = width;
    cloudCanvas.height = height;
    const cloudCtx = cloudCanvas.getContext('2d')!;
    const cloudImg = cloudCtx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = fbmNoise((x / width) * 16, (y / height) * 8, 5, 303);
        const alpha = c > 0.51 ? Math.min(235, Math.floor((c - 0.51) * 580)) : 0;
        const idx = (y * width + x) * 4;
        cloudImg.data[idx] = 255;
        cloudImg.data[idx + 1] = 255;
        cloudImg.data[idx + 2] = 255;
        cloudImg.data[idx + 3] = alpha;
      }
    }
    cloudCtx.putImageData(cloudImg, 0, 0);

    // Draw realistic swirling hurricane vortex in the Atlantic
    cloudCtx.save();
    cloudCtx.translate(520, 360);
    for (let a = 0; a < 6; a++) {
      cloudCtx.rotate(Math.PI / 3);
      cloudCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      cloudCtx.beginPath();
      cloudCtx.ellipse(32, 0, 48, 14, 0.3, 0, Math.PI * 2);
      cloudCtx.fill();
    }
    cloudCtx.restore();

    const map = new THREE.CanvasTexture(canvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    const cloudsMap = new THREE.CanvasTexture(cloudCanvas);
    const specularMap = new THREE.CanvasTexture(specCanvas);

    textureCache[planetId] = { map, bumpMap, cloudsMap, specularMap };
    tryLoadNasaTexture(planetId, textureCache[planetId]);
    return textureCache[planetId];
  }

  // ==========================================================================
  // 5. EARTH'S MOON — Basaltic Maria, Highlands & Tycho Ray Craters
  // ==========================================================================
  if (planetId === 'moon') {
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const n = fbmNoise((x / width) * 16, (y / height) * 8, 5, 55);
        const isMare = n < 0.45;
        const v = isMare ? Math.floor(70 + n * 95) : Math.floor(138 + n * 95);
        const idx = (y * width + x) * 4;
        imgData.data[idx] = v;
        imgData.data[idx + 1] = v;
        imgData.data[idx + 2] = v + 4;
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const map = new THREE.CanvasTexture(canvas);
    textureCache[planetId] = { map, bumpMap: map };
    tryLoadNasaTexture(planetId, textureCache[planetId]);
    return textureCache[planetId];
  }

  // ==========================================================================
  // 6. MARS — Rusty Iron-Oxide Regolith, Syrtis Major, Valles Marineris & Ice Caps
  // ==========================================================================
  if (planetId === 'mars') {
    const imgData = ctx.createImageData(width, height);
    const bumpData = bumpCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const n = fbmNoise((x / width) * 16, (y / height) * 8, 5, 64);
        const darkBasalt = fbmNoise((x / width) * 6, (y / height) * 4, 3, 19);
        const idx = (y * width + x) * 4;

        // Blend rusty orange-red iron oxide dust with dark volcanic basalt (Syrtis Major)
        const isDarkRegion = darkBasalt < 0.38 && y > 240 && y < 780;
        const r = isDarkRegion ? Math.floor(100 + n * 55) : Math.floor(180 + n * 75);
        const g = isDarkRegion ? Math.floor(48 + n * 35) : Math.floor(76 + n * 52);
        const b = isDarkRegion ? Math.floor(34 + n * 25) : Math.floor(38 + n * 35);

        imgData.data[idx] = Math.min(255, r);
        imgData.data[idx + 1] = Math.min(255, g);
        imgData.data[idx + 2] = Math.min(255, b);
        imgData.data[idx + 3] = 255;

        const bv = Math.floor(n * 255);
        bumpData.data[idx] = bv;
        bumpData.data[idx + 1] = bv;
        bumpData.data[idx + 2] = bv;
        bumpData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    bumpCtx.putImageData(bumpData, 0, 0);

    // Valles Marineris 4,000-km grand canyon rift
    ctx.strokeStyle = 'rgba(58, 18, 10, 0.85)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(720, 530);
    ctx.bezierCurveTo(840, 545, 980, 520, 1110, 535);
    ctx.stroke();

    // Olympus Mons (25km shield volcano) and Tharsis Montes
    [
      { x: 420, y: 430, r: 42 },
      { x: 520, y: 490, r: 26 },
      { x: 560, y: 540, r: 26 },
    ].forEach((v) => {
      const vg = ctx.createRadialGradient(v.x, v.y, 4, v.x, v.y, v.r);
      vg.addColorStop(0, '#381203');
      vg.addColorStop(0.3, '#9a3412');
      vg.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = vg;
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Polar Ice Caps
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, 36);
    ctx.fillRect(0, height - 36, width, 36);

    const map = new THREE.CanvasTexture(canvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 7. JUPITER — Alternating Jet-Stream Cloud Belts & The Great Red Spot
  // ==========================================================================
  if (planetId === 'jupiter') {
    const imgData = ctx.createImageData(width, height);

    // Authentic Jovian latitude band palette from Hubble and Juno
    const bandPalette = [
      [135, 115, 95],  // North Polar Region
      [215, 195, 165], // North Temperate Zone
      [165, 105, 72],  // North Temperate Belt
      [238, 222, 195], // North Tropical Zone
      [178, 92, 52],   // North Equatorial Belt
      [245, 232, 205], // Equatorial Zone
      [168, 78, 45],   // South Equatorial Belt (hosts Great Red Spot)
      [235, 220, 190], // South Tropical Zone
      [150, 115, 90],  // South Temperate Belt
      [130, 110, 95],  // South Polar Region
    ];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Turbulent jet-stream shear wave along latitude
        const turbulence = (fbmNoise((x / width) * 22, (y / height) * 22, 5, 88) - 0.5) * 48;
        const effectiveY = Math.min(height - 1, Math.max(0, y + turbulence));
        const bandPos = (effectiveY / height) * (bandPalette.length - 1);
        const bi = Math.floor(bandPos);
        const frac = bandPos - bi;
        const c1 = bandPalette[bi];
        const c2 = bandPalette[Math.min(bandPalette.length - 1, bi + 1)];

        const idx = (y * width + x) * 4;
        imgData.data[idx] = Math.floor(c1[0] * (1 - frac) + c2[0] * frac);
        imgData.data[idx + 1] = Math.floor(c1[1] * (1 - frac) + c2[1] * frac);
        imgData.data[idx + 2] = Math.floor(c1[2] * (1 - frac) + c2[2] * frac);
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // The Great Red Spot (Anticyclonic Storm Vortex with Concentric Edges)
    ctx.save();
    ctx.translate(1080, 650);
    ctx.scale(1.7, 1.0);
    const grs = ctx.createRadialGradient(0, 0, 8, 0, 0, 68);
    grs.addColorStop(0, '#991b1b');
    grs.addColorStop(0.55, '#dc2626');
    grs.addColorStop(0.82, '#fdba74');
    grs.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = grs;
    ctx.beginPath();
    ctx.arc(0, 0, 68, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const map = new THREE.CanvasTexture(canvas);
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 8. SATURN — Golden Ammonia Bands & Cassini-Division Alpha Ring Texture
  // ==========================================================================
  if (planetId === 'saturn') {
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      const lat = y / height;
      const bandWave = Math.sin(lat * Math.PI * 18) * 14 + Math.cos(lat * Math.PI * 7) * 18;
      for (let x = 0; x < width; x++) {
        const n = (fbmNoise((x / width) * 14, lat * 20, 3, 101) - 0.5) * 20;
        const idx = (y * width + x) * 4;
        imgData.data[idx] = Math.min(255, Math.max(0, Math.floor(222 + bandWave + n)));
        imgData.data[idx + 1] = Math.min(255, Math.max(0, Math.floor(192 + bandWave * 0.85 + n)));
        imgData.data[idx + 2] = Math.min(255, Math.max(0, Math.floor(134 + bandWave * 0.6 + n)));
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Multi-Band Ring Texture with authentic Cassini Division (dark gap) and C-ring transparency
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 1024;
    ringCanvas.height = 1024;
    const rCtx = ringCanvas.getContext('2d')!;
    const cx = 512;
    const cy = 512;

    for (let r = 220; r <= 500; r += 1) {
      const norm = (r - 220) / 280; // 0 = inner C ring, 1 = outer A ring
      // Cassini Division dark gap around norm 0.65 - 0.72
      const isCassiniGap = norm > 0.64 && norm < 0.73;
      const isInnerCRing = norm < 0.22;
      const fineRipple = Math.sin(norm * 220) * 0.16;

      const alpha = isCassiniGap
        ? 0.05
        : isInnerCRing
        ? 0.35
        : Math.min(0.95, 0.78 + fineRipple);

      const brightness = isCassiniGap ? 35 : Math.floor(220 + Math.sin(norm * 95) * 32);
      rCtx.strokeStyle = `rgba(${brightness}, ${Math.floor(brightness * 0.9)}, ${Math.floor(
        brightness * 0.72
      )}, ${alpha})`;
      rCtx.lineWidth = 1.8;
      rCtx.beginPath();
      rCtx.arc(cx, cy, r, 0, Math.PI * 2);
      rCtx.stroke();
    }

    const map = new THREE.CanvasTexture(canvas);
    const ringMap = new THREE.CanvasTexture(ringCanvas);
    textureCache[planetId] = { map, ringMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 9. URANUS — Aquamarine Methane Atmosphere & Subtle Polar Hood
  // ==========================================================================
  if (planetId === 'uranus') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#cffafe');
    grad.addColorStop(0.25, '#67e8f9');
    grad.addColorStop(0.5, '#22d3ee');
    grad.addColorStop(0.75, '#06b6d4');
    grad.addColorStop(1, '#a5f3fc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const map = new THREE.CanvasTexture(canvas);
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 10. NEPTUNE — Deep Cobalt Methane Bands, Great Dark Spot & Cirrus Clouds
  // ==========================================================================
  const imgData = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const lat = y / height;
    const band = Math.sin(lat * Math.PI * 14) * 20;
    for (let x = 0; x < width; x++) {
      const n = (fbmNoise((x / width) * 16, lat * 14, 4, 144) - 0.5) * 28;
      const idx = (y * width + x) * 4;
      imgData.data[idx] = Math.min(255, Math.max(0, Math.floor(25 + band * 0.5 + n)));
      imgData.data[idx + 1] = Math.min(255, Math.max(0, Math.floor(85 + band + n)));
      imgData.data[idx + 2] = Math.min(255, Math.max(0, Math.floor(220 + band + n)));
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Great Dark Spot anticyclone
  ctx.save();
  ctx.translate(920, 580);
  ctx.scale(1.5, 1.0);
  const gds = ctx.createRadialGradient(0, 0, 8, 0, 0, 56);
  gds.addColorStop(0, '#0c1a40');
  gds.addColorStop(0.65, '#1e3a8a');
  gds.addColorStop(1, 'rgba(30, 58, 138, 0)');
  ctx.fillStyle = gds;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // White methane cirrus storm clouds
  ctx.strokeStyle = 'rgba(240, 249, 255, 0.72)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(840, 530);
  ctx.lineTo(1020, 524);
  ctx.moveTo(420, 360);
  ctx.lineTo(620, 368);
  ctx.stroke();

  const map = new THREE.CanvasTexture(canvas);
  textureCache[planetId] = { map };
  return textureCache[planetId];
}
