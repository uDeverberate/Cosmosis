import * as THREE from 'three';

// Deterministic pseudo-random helper for realistic planetary terrain & noise
function seededNoise(x: number, y: number, seed = 1): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.12) * 43758.5453;
  return n - Math.floor(n);
}

function fbmNoise(x: number, y: number, octaves = 4, seed = 1): number {
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
  map: THREE.CanvasTexture;
  bumpMap?: THREE.CanvasTexture;
  cloudsMap?: THREE.CanvasTexture;
  ringMap?: THREE.CanvasTexture;
}

const textureCache: Record<string, PlanetTextureBundle> = {};

export function getPlanetTextures(planetId: string): PlanetTextureBundle {
  if (textureCache[planetId]) {
    return textureCache[planetId];
  }

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  // ==========================================================================
  // 1. THE SUN (SOL) — Boiling Photosphere Granulation, Filaments & Sunspots
  // ==========================================================================
  if (planetId === 'sun') {
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = (x / width) * 18;
        const ny = (y / height) * 9;
        const n = fbmNoise(nx, ny, 5, 11);
        const fine = fbmNoise(nx * 3.5, ny * 3.5, 3, 29);
        const val = n * 0.65 + fine * 0.35;

        const idx = (y * width + x) * 4;
        // Fiery solar photosphere palette (deep orange-red to blinding yellow-white)
        data[idx] = Math.min(255, Math.floor(215 + val * 55));
        data[idx + 1] = Math.min(255, Math.floor(75 + val * 165));
        data[idx + 2] = Math.min(255, Math.floor(10 + Math.pow(val, 2.2) * 190));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Add realistic dark magnetic Sunspots with bright faculae rims
    const spots = [
      { x: 240, y: 210, r: 16 },
      { x: 265, y: 218, r: 9 },
      { x: 640, y: 295, r: 20 },
      { x: 670, y: 285, r: 11 },
      { x: 820, y: 190, r: 14 },
    ];
    spots.forEach((s) => {
      const grad = ctx.createRadialGradient(s.x, s.y, s.r * 0.2, s.x, s.y, s.r * 2.2);
      grad.addColorStop(0, '#1c0a00');
      grad.addColorStop(0.45, '#7c2d12');
      grad.addColorStop(0.75, 'rgba(254, 240, 138, 0.65)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 2. MERCURY — Heavily Cratered Silicate Regolith & Caloris Basin Rays
  // ==========================================================================
  if (planetId === 'mercury') {
    const imgData = ctx.createImageData(width, height);
    const bumpData = bumpCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const n = fbmNoise((x / width) * 14, (y / height) * 7, 5, 42);
        const base = Math.floor(95 + n * 75);
        const idx = (y * width + x) * 4;

        imgData.data[idx] = base + 6;
        imgData.data[idx + 1] = base + 3;
        imgData.data[idx + 2] = base - 2;
        imgData.data[idx + 3] = 255;

        bumpData.data[idx] = base;
        bumpData.data[idx + 1] = base;
        bumpData.data[idx + 2] = base;
        bumpData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    bumpCtx.putImageData(bumpData, 0, 0);

    // Draw 90 realistic impact craters & ejecta rays
    for (let i = 0; i < 95; i++) {
      const cx = (i * 173) % width;
      const cy = 40 + ((i * 113) % (height - 80));
      const r = 4 + (i % 5) * 5;

      // Crater floor & bright rim
      const g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.25);
      g.addColorStop(0, 'rgba(55, 60, 68, 0.85)');
      g.addColorStop(0.78, 'rgba(185, 190, 200, 0.75)');
      g.addColorStop(1, 'rgba(120, 120, 125, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Bump map depression
      const bg = bumpCtx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.15);
      bg.addColorStop(0, '#111111');
      bg.addColorStop(0.85, '#ffffff');
      bg.addColorStop(1, 'rgba(128,128,128,0)');
      bumpCtx.fillStyle = bg;
      bumpCtx.beginPath();
      bumpCtx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      bumpCtx.fill();
    }

    const map = new THREE.CanvasTexture(canvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 3. VENUS — Swirling Sulfuric Acid Cloud Bands & Chevron Waves
  // ==========================================================================
  if (planetId === 'venus') {
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      const lat = (y / height - 0.5) * 2;
      for (let x = 0; x < width; x++) {
        // V-shaped chevron wave distortion
        const chevron = Math.abs(lat) * 2.4;
        const nx = (x / width) * 8 + chevron;
        const ny = (y / height) * 12;
        const n = fbmNoise(nx, ny, 5, 77);

        const idx = (y * width + x) * 4;
        imgData.data[idx] = Math.min(255, Math.floor(195 + n * 58));
        imgData.data[idx + 1] = Math.min(255, Math.floor(140 + n * 70));
        imgData.data[idx + 2] = Math.min(255, Math.floor(55 + n * 65));
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const map = new THREE.CanvasTexture(canvas);
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 4. EARTH — Realistic Continents, Bathymetric Oceans, Polar Ice & 3D Clouds
  // ==========================================================================
  if (planetId === 'earth') {
    // Deep ocean bathymetry gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#0c4a6e');
    oceanGrad.addColorStop(0.25, '#0369a1');
    oceanGrad.addColorStop(0.5, '#0284c7');
    oceanGrad.addColorStop(0.75, '#0369a1');
    oceanGrad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    bumpCtx.fillStyle = '#111111';
    bumpCtx.fillRect(0, 0, width, height);

    // Helper to paint organic multi-toned continents (coastal shelf + lush green + desert/mountain interiors)
    const drawContinent = (points: [number, number][], hasDesert = false) => {
      // Shallow turquoise coastal shelf glow
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      points.forEach(([px, py], i) => {
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Interior vegetation & desert biome shading
      if (hasDesert) {
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        points.forEach(([px, py], i) => {
          const cx = points.reduce((s, p) => s + p[0], 0) / points.length;
          const cy = points.reduce((s, p) => s + p[1], 0) / points.length;
          const ix = cx + (px - cx) * 0.55;
          const iy = cy + (py - cy) * 0.55;
          if (i === 0) ctx.moveTo(ix, iy);
          else ctx.lineTo(ix, iy);
        });
        ctx.closePath();
        ctx.fill();
      }

      // Elevation bump
      bumpCtx.fillStyle = '#b0b0b0';
      bumpCtx.beginPath();
      points.forEach(([px, py], i) => {
        if (i === 0) bumpCtx.moveTo(px, py);
        else bumpCtx.lineTo(px, py);
      });
      bumpCtx.closePath();
      bumpCtx.fill();
    };

    // North America
    drawContinent([
      [120, 75], [230, 65], [275, 115], [235, 185], [195, 225], [160, 195], [110, 130],
    ], true);
    // South America
    drawContinent([
      [235, 240], [315, 265], [335, 325], [290, 420], [260, 430], [245, 330],
    ], false);
    // Greenland
    drawContinent([
      [310, 42], [385, 38], [370, 88], [320, 82],
    ], false);
    // Europe & Eurasia
    drawContinent([
      [465, 80], [560, 65], [760, 65], [880, 95], [855, 185], [745, 225], [690, 245], [655, 195], [585, 180], [495, 155], [455, 125],
    ], true);
    // Africa
    drawContinent([
      [460, 175], [565, 175], [620, 235], [595, 345], [555, 395], [515, 340], [455, 245],
    ], true);
    // Australia
    drawContinent([
      [770, 315], [865, 310], [880, 375], [805, 390], [765, 355],
    ], true);

    // North & South Polar Ice Caps (Arctic & Antarctica)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, 24);
    ctx.fillRect(0, height - 38, width, 38);

    // Add fine terrain noise overlay
    const imgData = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const n = (fbmNoise((x / width) * 24, (y / height) * 12, 3, 91) - 0.5) * 28;
        const idx = (y * width + x) * 4;
        imgData.data[idx] = Math.min(255, Math.max(0, imgData.data[idx] + n));
        imgData.data[idx + 1] = Math.min(255, Math.max(0, imgData.data[idx + 1] + n));
        imgData.data[idx + 2] = Math.min(255, Math.max(0, imgData.data[idx + 2] + n));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Separate Transparent 3D Atmospheric Cloud Layer Texture
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = width;
    cloudCanvas.height = height;
    const cloudCtx = cloudCanvas.getContext('2d')!;
    const cloudImg = cloudCtx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = fbmNoise((x / width) * 12, (y / height) * 6, 4, 303);
        const alpha = c > 0.52 ? Math.min(220, Math.floor((c - 0.52) * 520)) : 0;
        const idx = (y * width + x) * 4;
        cloudImg.data[idx] = 255;
        cloudImg.data[idx + 1] = 255;
        cloudImg.data[idx + 2] = 255;
        cloudImg.data[idx + 3] = alpha;
      }
    }
    cloudCtx.putImageData(cloudImg, 0, 0);

    const map = new THREE.CanvasTexture(canvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    const cloudsMap = new THREE.CanvasTexture(cloudCanvas);
    textureCache[planetId] = { map, bumpMap, cloudsMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 5. EARTH'S MOON — Basaltic Maria, Highlands & Tycho Ray Craters
  // ==========================================================================
  if (planetId === 'moon') {
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const n = fbmNoise((x / width) * 10, (y / height) * 5, 5, 55);
        // Dark basaltic Maria vs bright Lunar Highlands
        const isMare = n < 0.45;
        const v = isMare ? Math.floor(75 + n * 95) : Math.floor(135 + n * 95);
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
        const n = fbmNoise((x / width) * 10, (y / height) * 5, 5, 64);
        const darkBasalt = fbmNoise((x / width) * 4, (y / height) * 3, 3, 19);
        const idx = (y * width + x) * 4;

        // Blend rusty orange-red dust with dark basaltic plains (like Syrtis Major)
        const isDarkRegion = darkBasalt < 0.38 && y > 120 && y < 390;
        const r = isDarkRegion ? Math.floor(105 + n * 55) : Math.floor(175 + n * 75);
        const g = isDarkRegion ? Math.floor(52 + n * 35) : Math.floor(78 + n * 52);
        const b = isDarkRegion ? Math.floor(38 + n * 25) : Math.floor(42 + n * 35);

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

    // Valles Marineris grand canyon scar
    ctx.strokeStyle = 'rgba(68, 24, 15, 0.75)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(360, 265);
    ctx.bezierCurveTo(420, 272, 490, 260, 555, 268);
    ctx.stroke();

    // Olympus Mons & Tharsis Montes volcanic calderas
    [
      { x: 210, y: 215, r: 22 },
      { x: 260, y: 245, r: 14 },
      { x: 280, y: 270, r: 14 },
    ].forEach((v) => {
      const vg = ctx.createRadialGradient(v.x, v.y, 2, v.x, v.y, v.r);
      vg.addColorStop(0, '#451a03');
      vg.addColorStop(0.3, '#9a3412');
      vg.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = vg;
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // North & South Martian Polar Ice Caps
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, 18);
    ctx.fillRect(0, height - 18, width, 18);

    const map = new THREE.CanvasTexture(canvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 7. JUPITER — Alternating Cloud Belts, Zones & The Great Red Spot
  // ==========================================================================
  if (planetId === 'jupiter') {
    const imgData = ctx.createImageData(width, height);

    // Authentic Jovian latitude band palette
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
        // Turbulent jet-stream wave distortion along latitude
        const turbulence = (fbmNoise((x / width) * 14, (y / height) * 14, 4, 88) - 0.5) * 26;
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

    // Draw the Great Red Spot in the South Equatorial Belt
    ctx.save();
    ctx.translate(540, 325);
    ctx.scale(1.65, 1.0);
    const grs = ctx.createRadialGradient(0, 0, 4, 0, 0, 34);
    grs.addColorStop(0, '#b91c1c');
    grs.addColorStop(0.55, '#dc2626');
    grs.addColorStop(0.8, '#fdba74');
    grs.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = grs;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const map = new THREE.CanvasTexture(canvas);
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 8. SATURN — Golden Ammonia Bands & Cassini-Division Ring Texture
  // ==========================================================================
  if (planetId === 'saturn') {
    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      const lat = y / height;
      const bandWave = Math.sin(lat * Math.PI * 18) * 14 + Math.cos(lat * Math.PI * 7) * 18;
      for (let x = 0; x < width; x++) {
        const n = (fbmNoise((x / width) * 10, lat * 16, 3, 101) - 0.5) * 16;
        const idx = (y * width + x) * 4;
        imgData.data[idx] = Math.min(255, Math.max(0, Math.floor(218 + bandWave + n)));
        imgData.data[idx + 1] = Math.min(255, Math.max(0, Math.floor(190 + bandWave * 0.85 + n)));
        imgData.data[idx + 2] = Math.min(255, Math.max(0, Math.floor(132 + bandWave * 0.6 + n)));
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Generate Multi-Band Saturn Ring Texture (with Cassini Division gap)
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 512;
    ringCanvas.height = 512;
    const rCtx = ringCanvas.getContext('2d')!;
    const cx = 256;
    const cy = 256;

    for (let r = 110; r <= 250; r += 1) {
      const norm = (r - 110) / 140; // 0 = inner C ring, 1 = outer A ring
      // Cassini Division dark gap around norm 0.66 - 0.72
      const isCassiniGap = norm > 0.65 && norm < 0.72;
      const isInnerCRing = norm < 0.22;
      const fineRipple = Math.sin(norm * 140) * 0.15;

      const alpha = isCassiniGap
        ? 0.08
        : isInnerCRing
        ? 0.32
        : Math.min(0.92, 0.75 + fineRipple);

      const brightness = isCassiniGap ? 40 : Math.floor(215 + Math.sin(norm * 95) * 30);
      rCtx.strokeStyle = `rgba(${brightness}, ${Math.floor(brightness * 0.9)}, ${Math.floor(
        brightness * 0.72
      )}, ${alpha})`;
      rCtx.lineWidth = 1.5;
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
  // 10. NEPTUNE — Deep Cobalt Methane Bands, White Cirrus Streaks & Great Dark Spot
  // ==========================================================================
  const imgData = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const lat = y / height;
    const band = Math.sin(lat * Math.PI * 14) * 18;
    for (let x = 0; x < width; x++) {
      const n = (fbmNoise((x / width) * 12, lat * 12, 4, 144) - 0.5) * 24;
      const idx = (y * width + x) * 4;
      imgData.data[idx] = Math.min(255, Math.max(0, Math.floor(28 + band * 0.5 + n)));
      imgData.data[idx + 1] = Math.min(255, Math.max(0, Math.floor(88 + band + n)));
      imgData.data[idx + 2] = Math.min(255, Math.max(0, Math.floor(215 + band + n)));
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Great Dark Spot oval storm + white scooter clouds
  ctx.save();
  ctx.translate(460, 290);
  ctx.scale(1.5, 1.0);
  const gds = ctx.createRadialGradient(0, 0, 4, 0, 0, 28);
  gds.addColorStop(0, '#0f172a');
  gds.addColorStop(0.65, '#1e3a8a');
  gds.addColorStop(1, 'rgba(30, 58, 138, 0)');
  ctx.fillStyle = gds;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // High-altitude white methane cirrus streaks
  ctx.strokeStyle = 'rgba(240, 249, 255, 0.65)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(420, 265);
  ctx.lineTo(510, 262);
  ctx.moveTo(210, 180);
  ctx.lineTo(310, 184);
  ctx.stroke();

  const map = new THREE.CanvasTexture(canvas);
  textureCache[planetId] = { map };
  return textureCache[planetId];
}
