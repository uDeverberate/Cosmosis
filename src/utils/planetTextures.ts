import * as THREE from 'three';

// ============================================================================
// ULTRA-REALISTIC 3D SPHERICAL FRACTAL NOISE & PLANETARY TEXTURE ENGINE
// ============================================================================
// Evaluates noise in 3D Cartesian space (x, y, z on the unit sphere) so there
// is ZERO longitude seam and no polar pinching across equirectangular maps.

function hash3(ix: number, iy: number, iz: number, seed: number): number {
  let n = (ix * 374761393 + iy * 668265263 + iz * 2147483647 + seed * 1610612741) | 0;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

function noise3D(x: number, y: number, z: number, seed = 1): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  // Quintic C2 smoothstep for artifact-free normal/bump derivatives
  const u = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const v = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
  const w = fz * fz * fz * (fz * (fz * 6 - 15) + 10);

  const n000 = hash3(ix, iy, iz, seed);
  const n100 = hash3(ix + 1, iy, iz, seed);
  const n010 = hash3(ix, iy + 1, iz, seed);
  const n110 = hash3(ix + 1, iy + 1, iz, seed);
  const n001 = hash3(ix, iy, iz + 1, seed);
  const n101 = hash3(ix + 1, iy, iz + 1, seed);
  const n011 = hash3(ix, iy + 1, iz + 1, seed);
  const n111 = hash3(ix + 1, iy + 1, iz + 1, seed);

  const nx00 = n000 + u * (n100 - n000);
  const nx10 = n010 + u * (n110 - n010);
  const nx01 = n001 + u * (n101 - n001);
  const nx11 = n011 + u * (n111 - n011);

  const nxy0 = nx00 + v * (nx10 - nx00);
  const nxy1 = nx01 + v * (nx11 - nx01);

  return nxy0 + w * (nxy1 - nxy0);
}

export function fbm3D(x: number, y: number, z: number, octaves = 5, seed = 1): number {
  let value = 0;
  let amplitude = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise3D(x * freq, y * freq, z * freq, seed + i * 31) * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    freq *= 2.07;
  }
  return value / norm;
}

export function ridged3D(x: number, y: number, z: number, octaves = 5, seed = 1): number {
  let value = 0;
  let amplitude = 0.5;
  let freq = 1;
  let weight = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    let signal = noise3D(x * freq, y * freq, z * freq, seed + i * 47);
    signal = 1.0 - Math.abs(signal * 2.0 - 1.0);
    signal *= signal * weight;
    weight = Math.min(1, Math.max(0, signal * 1.8));
    value += signal * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    freq *= 2.12;
  }
  return value / norm;
}

export interface PlanetTextureBundle {
  map: THREE.CanvasTexture;
  bumpMap?: THREE.CanvasTexture;
  specularMap?: THREE.CanvasTexture;
  cloudsMap?: THREE.CanvasTexture;
  ringMap?: THREE.CanvasTexture;
  nightMap?: THREE.CanvasTexture;
}

const textureCache: Record<string, PlanetTextureBundle> = {};
let asteroidTextureCache: { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } | null = null;

// Public-domain spacecraft & observatory maps that seamlessly paint onto the active CanvasTexture
const NASA_TEXTURE_ARCHIVE: Record<
  string,
  { map?: string; bump?: string; clouds?: string; specular?: string }
> = {
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
 * Loads real spacecraft imagery into the ALREADY-BOUND HTMLCanvasElement and sets
 * `texture.needsUpdate = true`, so Three.js updates the live GPU material in place!
 */
function upgradeCanvasTextureFromUrl(url: string, targetTexture: THREE.CanvasTexture, invertForRoughness = false) {
  if (typeof window === 'undefined') return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = targetTexture.image as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (invertForRoughness) {
      // Three.js earth_specular has white=ocean(shiny), black=land(rough).
      // For PBR roughnessMap, we want ocean=dark(0.12 smooth) and land=bright(0.88 rough).
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const spec = d[i] / 255;
        const rough = Math.floor((1.0 - spec * 0.82) * 255);
        d[i] = rough;
        d[i + 1] = rough;
        d[i + 2] = rough;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    targetTexture.needsUpdate = true;
  };
  img.onerror = () => {
    // Keep our 3D spherical fractal procedural map
  };
  img.src = url;
}

function tryLoadNasaTexture(planetId: string, bundle: PlanetTextureBundle) {
  const urls = NASA_TEXTURE_ARCHIVE[planetId];
  if (!urls) return;
  if (urls.map && bundle.map) {
    upgradeCanvasTextureFromUrl(urls.map, bundle.map, false);
  }
  if (urls.clouds && bundle.cloudsMap) {
    upgradeCanvasTextureFromUrl(urls.clouds, bundle.cloudsMap, false);
  }
  if (urls.specular && bundle.specularMap) {
    upgradeCanvasTextureFromUrl(urls.specular, bundle.specularMap, true);
  }
}

function configureSphericalTexture(tex: THREE.CanvasTexture, isColor = true): THREE.CanvasTexture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
}

// Helper to stamp 3D-projected impact craters with ejecta rays onto equirectangular maps
function stampRealisticCraters(
  ctx: CanvasRenderingContext2D,
  bumpCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number,
  seed: number,
  hasRays = true
) {
  for (let i = 0; i < count; i++) {
    const h1 = hash3(i, seed, 11, seed);
    const h2 = hash3(i, seed, 29, seed);
    const h3 = hash3(i, seed, 47, seed);

    const cx = h1 * width;
    const cy = (0.08 + h2 * 0.84) * height;
    const r = 4 + Math.pow(h3, 2.6) * 44;

    // Ejecta blanket & bright rays for major young impact craters
    if (hasRays && r > 22 && i % 4 === 0) {
      ctx.save();
      ctx.translate(cx, cy);
      const rayCount = 12 + (i % 10);
      for (let ray = 0; ray < rayCount; ray++) {
        const ang = (ray / rayCount) * Math.PI * 2 + (h1 - 0.5) * 0.3;
        const rayLen = r * (2.2 + hash3(i, ray, 99, seed) * 2.5);
        const grad = ctx.createLinearGradient(0, 0, Math.cos(ang) * rayLen, Math.sin(ang) * rayLen);
        grad.addColorStop(0, 'rgba(235, 240, 248, 0.32)');
        grad.addColorStop(0.4, 'rgba(215, 222, 232, 0.14)');
        grad.addColorStop(1, 'rgba(200, 205, 215, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 + (ray % 3);
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r * 0.8, Math.sin(ang) * r * 0.8);
        ctx.lineTo(Math.cos(ang) * rayLen, Math.sin(ang) * rayLen);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Albedo crater bowl + sunlit/shadowed rim + central peak
    const g = ctx.createRadialGradient(cx - r * 0.12, cy - r * 0.1, r * 0.05, cx, cy, r * 1.25);
    g.addColorStop(0, 'rgba(185, 190, 200, 0.55)'); // Central rebound peak
    g.addColorStop(0.18, 'rgba(38, 42, 48, 0.78)'); // Deep shadowed floor
    g.addColorStop(0.68, 'rgba(55, 60, 68, 0.65)'); // Inner wall
    g.addColorStop(0.84, 'rgba(220, 225, 235, 0.75)'); // Raised rim crest
    g.addColorStop(1, 'rgba(128, 128, 128, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // Bump elevation: deep bowl (black), sharp raised rim (white), central peak (bright)
    const bg = bumpCtx.createRadialGradient(cx, cy, r * 0.04, cx, cy, r * 1.22);
    bg.addColorStop(0, '#d8d8d8'); // Central rebound peak
    bg.addColorStop(0.16, '#0a0a0a'); // Deep basin floor
    bg.addColorStop(0.66, '#1c1c1c');
    bg.addColorStop(0.86, '#ffffff'); // High sharp rim wall
    bg.addColorStop(1, 'rgba(128, 128, 128, 0)');
    bumpCtx.fillStyle = bg;
    bumpCtx.beginPath();
    bumpCtx.arc(cx, cy, r * 1.22, 0, Math.PI * 2);
    bumpCtx.fill();
  }
}

/**
 * Dedicated photorealistic chondrite/silicate asteroid rock & crater bump texture
 */
export function getAsteroidRockTextures(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  if (asteroidTextureCache) return asteroidTextureCache;

  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  const imgData = ctx.createImageData(width, height);
  const bumpData = bumpCtx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    const phi = (y / height - 0.5) * Math.PI;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    for (let x = 0; x < width; x++) {
      const theta = (x / width) * Math.PI * 2;
      const sx = cosPhi * Math.cos(theta);
      const sy = sinPhi;
      const sz = cosPhi * Math.sin(theta);

      const base = fbm3D(sx * 4.5, sy * 4.5, sz * 4.5, 5, 601);
      const ridge = ridged3D(sx * 9.0, sy * 9.0, sz * 9.0, 4, 619);
      const grain = noise3D(sx * 28, sy * 28, sz * 28, 631);

      const lithic = base * 0.52 + ridge * 0.33 + grain * 0.15;
      const v = Math.floor(52 + lithic * 135);
      const idx = (y * width + x) * 4;

      // Carbonaceous & silicate warm-grey mineral variation
      imgData.data[idx] = Math.min(255, v + 6);
      imgData.data[idx + 1] = Math.min(255, v + 3);
      imgData.data[idx + 2] = Math.min(255, v - 2);
      imgData.data[idx + 3] = 255;

      const bv = Math.min(255, Math.max(0, Math.floor(lithic * 255)));
      bumpData.data[idx] = bv;
      bumpData.data[idx + 1] = bv;
      bumpData.data[idx + 2] = bv;
      bumpData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  bumpCtx.putImageData(bumpData, 0, 0);

  // Stamp micro-craters and regolith pits onto the asteroid surface
  stampRealisticCraters(ctx, bumpCtx, width, height, 65, 709, false);

  asteroidTextureCache = {
    map: configureSphericalTexture(new THREE.CanvasTexture(canvas), true),
    bumpMap: configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false),
  };
  return asteroidTextureCache;
}

export function getPlanetTextures(planetId: string): PlanetTextureBundle {
  if (textureCache[planetId]) {
    return textureCache[planetId];
  }

  // 1024x512 3D-spherical equirectangular canvas (fast generation + seamless NASA 2K upgrade)
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

  // Helper to iterate over 3D unit sphere coordinates (sx, sy, sz) for zero-seam mapping
  const generateSphericalPixels = (
    pixelFn: (
      sx: number,
      sy: number,
      sz: number,
      lon: number,
      lat: number
    ) => { r: number; g: number; b: number; bump: number; spec?: number }
  ): { specCanvas?: HTMLCanvasElement } => {
    const imgData = ctx.createImageData(width, height);
    const bumpData = bumpCtx.createImageData(width, height);
    let specCanvas: HTMLCanvasElement | undefined;
    let specCtx: CanvasRenderingContext2D | undefined;
    let specData: ImageData | undefined;

    for (let y = 0; y < height; y++) {
      const lat = 0.5 - y / height; // +0.5 (North Pole) to -0.5 (South Pole)
      const phi = lat * Math.PI;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      for (let x = 0; x < width; x++) {
        const lon = (x / width - 0.5) * Math.PI * 2; // -PI to +PI
        const sx = cosPhi * Math.cos(lon);
        const sy = sinPhi;
        const sz = cosPhi * Math.sin(lon);

        const res = pixelFn(sx, sy, sz, lon, lat);
        const idx = (y * width + x) * 4;

        imgData.data[idx] = Math.min(255, Math.max(0, Math.floor(res.r)));
        imgData.data[idx + 1] = Math.min(255, Math.max(0, Math.floor(res.g)));
        imgData.data[idx + 2] = Math.min(255, Math.max(0, Math.floor(res.b)));
        imgData.data[idx + 3] = 255;

        const bv = Math.min(255, Math.max(0, Math.floor(res.bump)));
        bumpData.data[idx] = bv;
        bumpData.data[idx + 1] = bv;
        bumpData.data[idx + 2] = bv;
        bumpData.data[idx + 3] = 255;

        if (res.spec !== undefined) {
          if (!specCanvas) {
            specCanvas = document.createElement('canvas');
            specCanvas.width = width;
            specCanvas.height = height;
            specCtx = specCanvas.getContext('2d')!;
            specData = specCtx.createImageData(width, height);
          }
          const sv = Math.min(255, Math.max(0, Math.floor(res.spec)));
          specData!.data[idx] = sv;
          specData!.data[idx + 1] = sv;
          specData!.data[idx + 2] = sv;
          specData!.data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
    bumpCtx.putImageData(bumpData, 0, 0);
    if (specCtx && specData) {
      specCtx.putImageData(specData, 0, 0);
    }
    return { specCanvas };
  };

  // ==========================================================================
  // 1. THE SUN (SOL) — High-Resolution Convective Granulation & Sunspot Map
  // (Supplemented in CosmicExplorer3D by a live animated GLSL Photosphere Shader)
  // ==========================================================================
  if (planetId === 'sun') {
    generateSphericalPixels((sx, sy, sz) => {
      const qx = fbm3D(sx * 6, sy * 6, sz * 6, 4, 11);
      const qy = fbm3D(sx * 6 + 5.2, sy * 6 + 1.3, sz * 6 + 2.8, 4, 23);
      const cells = ridged3D(sx * 14 + qx * 2.2, sy * 14 + qy * 2.2, sz * 14, 5, 37);
      const supergranules = fbm3D(sx * 4, sy * 4, sz * 4, 4, 51);
      const val = cells * 0.65 + supergranules * 0.35;

      // Magnetic sunspot active regions near +/- 15-25 deg solar latitude
      const spotNoise = fbm3D(sx * 5.5, sy * 5.5, sz * 5.5, 4, 89);
      const spotMask = Math.abs(sy) > 0.12 && Math.abs(sy) < 0.48 && spotNoise < 0.24
        ? Math.max(0, (0.24 - spotNoise) * 6.5)
        : 0;

      const r = (235 + val * 45) * (1 - spotMask * 0.85);
      const g = (65 + Math.pow(val, 1.15) * 185) * (1 - spotMask * 0.92);
      const b = (8 + Math.pow(val, 2.6) * 235) * (1 - spotMask * 0.95);
      return { r, g, b, bump: val * 255 };
    });

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 2. MERCURY — Silicate Regolith, Caloris Impact Basin, Scarps & Ray Craters
  // ==========================================================================
  if (planetId === 'mercury') {
    generateSphericalPixels((sx, sy, sz) => {
      const warp = fbm3D(sx * 3.5, sy * 3.5, sz * 3.5, 4, 101);
      const highlands = fbm3D(sx * 7 + warp, sy * 7 + warp, sz * 7, 5, 113);
      const ridges = ridged3D(sx * 12, sy * 12, sz * 12, 4, 127);

      // Caloris Basin giant impact plain
      const distCaloris = Math.hypot(sx - 0.65, sy - 0.28, sz - 0.68);
      const calorisMask = distCaloris < 0.42 ? Math.cos((distCaloris / 0.42) * Math.PI * 0.5) : 0;

      const h = highlands * 0.58 + ridges * 0.42 - calorisMask * 0.18;
      const base = 76 + h * 108;
      // Subtle warm bronze-slate MESSENGER color calibration
      return {
        r: base + 7,
        g: base + 3,
        b: base - 4,
        bump: Math.max(0, Math.min(255, h * 245)),
      };
    });

    stampRealisticCraters(ctx, bumpCtx, width, height, 240, 202, true);

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 3. VENUS — Super-Rotating Sulfuric Acid Cloud Decks & Polar Vortex Chevrons
  // ==========================================================================
  if (planetId === 'venus') {
    generateSphericalPixels((_sx, sy, _sz, lon, lat) => {
      // Akatsuki UV/Visible chevron wave distortion along equator
      const chevron = Math.abs(lat) * 4.2 + Math.sin(lat * Math.PI * 3) * 0.6;
      const rotLon = lon + chevron;
      const wx = Math.cos(lat * Math.PI) * Math.cos(rotLon);
      const wz = Math.cos(lat * Math.PI) * Math.sin(rotLon);

      const warp = fbm3D(wx * 3.2, sy * 5.5, wz * 3.2, 5, 307);
      const streaks = fbm3D(wx * 5.5 + warp * 1.8, sy * 14, wz * 5.5 + warp * 1.8, 6, 319);
      const bands = Math.cos(lat * Math.PI * 2.2) * 0.15;
      const c = Math.min(1, Math.max(0, streaks * 0.82 + bands + 0.08));

      // Creamy golden-amber sulfur dioxide cloud palette
      const r = 185 + c * 68;
      const g = 132 + Math.pow(c, 1.15) * 88;
      const b = 58 + Math.pow(c, 1.45) * 82;
      return { r, g, b, bump: c * 180 };
    });

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 4. EARTH — Blue Marble Continents, Bathymetry, Roughness Map & 3D Cyclones
  // (Automatically upgrades in-place to 2K NASA Blue Marble when online)
  // ==========================================================================
  if (planetId === 'earth') {
    // Seeded continental landmass centers on the 3D unit sphere
    const continentSeeds = [
      // North America
      { x: -0.18, y: 0.68, z: 0.71, r: 0.46, weight: 0.48 },
      { x: -0.05, y: 0.42, z: 0.90, r: 0.34, weight: 0.38 },
      // South America
      { x: 0.32, y: -0.28, z: 0.90, r: 0.38, weight: 0.46 },
      { x: 0.25, y: -0.58, z: 0.77, r: 0.28, weight: 0.38 },
      // Eurasia
      { x: 0.68, y: 0.62, z: -0.38, r: 0.56, weight: 0.52 },
      { x: 0.25, y: 0.55, z: -0.79, r: 0.58, weight: 0.54 },
      { x: -0.35, y: 0.48, z: -0.80, r: 0.48, weight: 0.45 },
      // Africa
      { x: 0.82, y: 0.12, z: -0.55, r: 0.46, weight: 0.50 },
      { x: 0.78, y: -0.32, z: -0.53, r: 0.34, weight: 0.44 },
      // Australia
      { x: -0.68, y: -0.42, z: -0.60, r: 0.28, weight: 0.44 },
      // Antarctica
      { x: 0.0, y: -0.98, z: 0.0, r: 0.45, weight: 0.55 },
    ];

    const { specCanvas } = generateSphericalPixels((sx, sy, sz, _lon, lat) => {
      const warpX = fbm3D(sx * 3.8, sy * 3.8, sz * 3.8, 4, 401) - 0.5;
      const warpY = fbm3D(sx * 3.8 + 4.1, sy * 3.8 + 2.3, sz * 3.8, 4, 419) - 0.5;
      const detail = fbm3D((sx + warpX * 0.35) * 7.5, (sy + warpY * 0.35) * 7.5, sz * 7.5, 6, 433);
      const mountains = ridged3D(sx * 16, sy * 16, sz * 16, 5, 449);

      let mask = 0;
      for (const c of continentSeeds) {
        const d = Math.hypot(sx - c.x, sy - c.y, sz - c.z);
        if (d < c.r) {
          const falloff = Math.cos((d / c.r) * Math.PI * 0.5);
          mask = Math.max(mask, falloff * c.weight);
        }
      }

      const elevation = mask + detail * 0.58 - 0.48;
      const absLat = Math.abs(lat) * 2; // 0 at equator, 1 at poles

      // Polar ice caps with fractal sea-ice edge
      if (absLat + (detail - 0.5) * 0.18 > 0.84) {
        return {
          r: 242 + detail * 12,
          g: 248 + detail * 7,
          b: 255,
          bump: 145 + mountains * 60,
          spec: 110, // Moderately reflective ice
        };
      }

      if (elevation < 0) {
        // Bathymetric Ocean: Deep abyssal trenches to turquoise coral continental shelves
        const depth = Math.min(1, Math.max(0, -elevation * 3.8));
        const shelf = Math.pow(1 - depth, 3.2);
        const r = 4 + shelf * 28;
        const g = 28 + (1 - depth) * 52 + shelf * 85;
        const b = 68 + (1 - depth) * 95 + shelf * 55;
        return {
          r,
          g,
          b,
          bump: 10, // Smooth ocean surface
          spec: 32, // Low roughness (0.12) => shiny sun-glint ocean!
        };
      }

      // Land Biomes: Coastal lowlands, tropical forests, deserts/savannas, and snow-capped mountain ranges
      const h = Math.min(1, elevation * 2.6 + mountains * 0.38);
      const aridity = fbm3D(sx * 5.2, sy * 5.2, sz * 5.2, 4, 467) + Math.exp(-Math.pow((absLat - 0.28) * 5.5, 2)) * 0.42;

      let r = 34;
      let g = 98;
      let b = 42;

      if (h > 0.72) {
        // High Alpine Snow & Exposed Granite Peaks
        const snow = Math.min(1, (h - 0.72) * 3.5);
        r = 115 + snow * 130;
        g = 110 + snow * 135;
        b = 105 + snow * 145;
      } else if (aridity > 0.78 && absLat < 0.58) {
        // Sahara / Arabian / Australian ochre sand & sandstone desert
        const dTone = (aridity - 0.78) * 2.5;
        r = Math.min(225, 165 + dTone * 55 + mountains * 25);
        g = Math.min(190, 122 + dTone * 42 + mountains * 15);
        b = Math.min(135, 68 + dTone * 28);
      } else {
        // Boreal / Temperate / Rainforest vegetation gradient
        const lush = 1 - absLat * 0.65;
        r = 26 + (1 - lush) * 48 + mountains * 32;
        g = 68 + lush * 56 + detail * 28;
        b = 24 + (1 - lush) * 25;
      }

      return {
        r,
        g,
        b,
        bump: Math.min(255, 65 + h * 190),
        spec: 228, // High roughness (0.89) => matte continental land
      };
    });

    // High-altitude dynamic 3D cloud deck with spiral typhoons & trade-wind bands
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = width;
    cloudCanvas.height = height;
    const cloudCtx = cloudCanvas.getContext('2d')!;
    const cloudImg = cloudCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      const phi = (0.5 - y / height) * Math.PI;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      for (let x = 0; x < width; x++) {
        const lon = (x / width - 0.5) * Math.PI * 2;
        const sx = cosPhi * Math.cos(lon);
        const sy = sinPhi;
        const sz = cosPhi * Math.sin(lon);

        const qx = fbm3D(sx * 4.5, sy * 4.5, sz * 4.5, 4, 503);
        const qy = fbm3D(sx * 4.5 + 3.1, sy * 4.5 + 1.7, sz * 4.5, 4, 521);
        const c = fbm3D(sx * 6.5 + qx * 1.6, sy * 9.5 + qy * 1.6, sz * 6.5, 5, 547);
        const alpha = c > 0.47 ? Math.min(245, Math.floor(Math.pow((c - 0.47) / 0.53, 1.15) * 320)) : 0;

        const idx = (y * width + x) * 4;
        cloudImg.data[idx] = 255;
        cloudImg.data[idx + 1] = 255;
        cloudImg.data[idx + 2] = 255;
        cloudImg.data[idx + 3] = alpha;
      }
    }
    cloudCtx.putImageData(cloudImg, 0, 0);

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
    const cloudsMap = configureSphericalTexture(new THREE.CanvasTexture(cloudCanvas), true);
    const specularMap = configureSphericalTexture(new THREE.CanvasTexture(specCanvas!), false);

    textureCache[planetId] = { map, bumpMap, cloudsMap, specularMap };
    tryLoadNasaTexture(planetId, textureCache[planetId]);
    return textureCache[planetId];
  }

  // ==========================================================================
  // 5. EARTH'S MOON — Basaltic Maria, Anorthosite Highlands & Tycho Ray Craters
  // ==========================================================================
  if (planetId === 'moon') {
    generateSphericalPixels((sx, sy, sz) => {
      const maria = fbm3D(sx * 2.8, sy * 2.8, sz * 2.8, 5, 557);
      const detail = fbm3D(sx * 12, sy * 12, sz * 12, 5, 569);
      const ridge = ridged3D(sx * 9, sy * 9, sz * 9, 4, 577);

      const isMare = maria < 0.46;
      const base = isMare
        ? 58 + maria * 85 + detail * 28
        : 125 + maria * 75 + ridge * 42 + detail * 22;

      return {
        r: base,
        g: base - 1,
        b: base - 3,
        bump: isMare ? 45 + detail * 65 : 110 + ridge * 135,
      };
    });

    stampRealisticCraters(ctx, bumpCtx, width, height, 220, 593, true);

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
    textureCache[planetId] = { map, bumpMap };
    tryLoadNasaTexture(planetId, textureCache[planetId]);
    return textureCache[planetId];
  }

  // ==========================================================================
  // 6. MARS — Hematite/Iron-Oxide Regolith, Syrtis Major Basalt, Valles Marineris
  // ==========================================================================
  if (planetId === 'mars') {
    generateSphericalPixels((sx, sy, sz, _lon, lat) => {
      const warp = fbm3D(sx * 3.5, sy * 3.5, sz * 3.5, 4, 641);
      const terrain = fbm3D(sx * 6.5 + warp, sy * 6.5 + warp, sz * 6.5, 6, 653);
      const basaltRegion = fbm3D(sx * 2.6, sy * 2.6, sz * 2.6, 4, 661);
      const ridges = ridged3D(sx * 14, sy * 14, sz * 14, 5, 673);

      // Polar CO2 & Water Ice Caps with layered spiral troughs
      const absLat = Math.abs(lat) * 2;
      if (absLat + (terrain - 0.5) * 0.14 > 0.89) {
        return {
          r: 245,
          g: 238,
          b: 232,
          bump: 210 + ridges * 45,
        };
      }

      // Valles Marineris equatorial tectonic canyon system
      const canyonDist = Math.abs(sy + 0.11 + Math.sin(sx * 4.5) * 0.035);
      const inCanyon = sx > 0.15 && sx < 0.88 && canyonDist < 0.042;
      const canyonDepth = inCanyon ? Math.cos((canyonDist / 0.042) * Math.PI * 0.5) : 0;

      // Dark basaltic albedo features (Syrtis Major / Acidalia Planitia) vs bright ochre dust (Arabia Terra)
      const darkFactor = basaltRegion < 0.43 ? Math.min(1, (0.43 - basaltRegion) * 4.2) : 0;
      const h = terrain * 0.62 + ridges * 0.38 - canyonDepth * 0.55;

      const r = (182 + h * 72) * (1 - darkFactor * 0.42) - canyonDepth * 65;
      const g = (78 + h * 54) * (1 - darkFactor * 0.48) - canyonDepth * 35;
      const b = (42 + h * 34) * (1 - darkFactor * 0.45) - canyonDepth * 20;

      return {
        r,
        g,
        b,
        bump: Math.max(0, Math.min(255, h * 245)),
      };
    });

    // Stamp Martian impact craters & Tharsis shield volcano calderas
    stampRealisticCraters(ctx, bumpCtx, width, height, 145, 683, false);

    // Olympus Mons & Tharsis Montes mega-volcanoes
    const volcanoes = [
      { x: width * 0.22, y: height * 0.39, r: 28 },
      { x: width * 0.28, y: height * 0.46, r: 18 },
      { x: width * 0.31, y: height * 0.51, r: 18 },
      { x: width * 0.34, y: height * 0.56, r: 18 },
    ];
    volcanoes.forEach((v) => {
      const vg = ctx.createRadialGradient(v.x, v.y, 2, v.x, v.y, v.r);
      vg.addColorStop(0, '#2a0f05'); // Summit caldera
      vg.addColorStop(0.22, '#9a3412');
      vg.addColorStop(0.65, 'rgba(154, 52, 18, 0.45)');
      vg.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = vg;
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.fill();

      const bg = bumpCtx.createRadialGradient(v.x, v.y, 2, v.x, v.y, v.r);
      bg.addColorStop(0, '#404040');
      bg.addColorStop(0.2, '#ffffff');
      bg.addColorStop(1, 'rgba(128,128,128,0)');
      bumpCtx.fillStyle = bg;
      bumpCtx.beginPath();
      bumpCtx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      bumpCtx.fill();
    });

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 7. JUPITER — Juno/Cassini Turbulent Zonal Belts, Festoons & Great Red Spot
  // ==========================================================================
  if (planetId === 'jupiter') {
    const bandPalette = [
      [118, 104, 88],  // North Polar Cyclonic Hood
      [198, 178, 148], // North North Temperate Zone
      [148, 94, 62],   // North Temperate Belt
      [232, 216, 188], // North Tropical Zone
      [168, 82, 44],   // North Equatorial Belt (deep rust-brown with blue-grey festoons)
      [242, 228, 202], // Equatorial Zone (ammonia ice plumes)
      [158, 72, 38],   // South Equatorial Belt (hosts the Great Red Spot)
      [236, 222, 196], // South Tropical Zone
      [146, 102, 74],  // South Temperate Belt (hosts White Ovals)
      [212, 196, 172], // South Temperate Zone
      [116, 102, 88],  // South Polar Hood
    ];

    generateSphericalPixels((sx, sy, sz, lon, lat) => {
      // Kelvin-Helmholtz zonal jet stream shear & vortex turbulence
      const jetShear = Math.sin(lat * Math.PI * 16) * 0.45;
      const turb1 = fbm3D(sx * 8 + jetShear, sy * 22, sz * 8, 5, 701) - 0.5;
      const turb2 = ridged3D(sx * 14, sy * 32, sz * 14, 4, 719) - 0.5;

      // Great Red Spot anticyclonic displacement around (lon = 0.35, lat = -0.16)
      const dLon = Math.atan2(Math.sin(lon - 0.35), Math.cos(lon - 0.35));
      const dLat = lat + 0.16;
      const grsDist = Math.hypot(dLon * 0.62, dLat * 1.45);

      if (grsDist < 0.14) {
        const norm = grsDist / 0.14;
        const swirl = Math.sin(norm * Math.PI * 5 + Math.atan2(dLat, dLon) * 2) * 0.12;
        const core = 1 - norm + swirl;
        return {
          r: Math.min(255, 165 + core * 78),
          g: Math.min(255, 42 + Math.pow(1 - core * 0.65, 2) * 125),
          b: Math.min(255, 28 + Math.pow(1 - core * 0.75, 2) * 95),
          bump: 160 + core * 85,
        };
      }

      const wakeDeflection = grsDist < 0.26 ? Math.exp(-grsDist * 10) * 0.06 : 0;
      const effectiveLat = Math.min(
        0.999,
        Math.max(0, 0.5 - lat + turb1 * 0.065 + turb2 * 0.025 + wakeDeflection)
      );

      const bandPos = effectiveLat * (bandPalette.length - 1);
      const bi = Math.floor(bandPos);
      const frac = bandPos - bi;
      const fSmooth = frac * frac * (3 - 2 * frac);
      const c1 = bandPalette[bi];
      const c2 = bandPalette[Math.min(bandPalette.length - 1, bi + 1)];

      const fineWave = (turb2 + 0.5) * 18;
      return {
        r: c1[0] * (1 - fSmooth) + c2[0] * fSmooth + fineWave,
        g: c1[1] * (1 - fSmooth) + c2[1] * fSmooth + fineWave * 0.8,
        b: c1[2] * (1 - fSmooth) + c2[2] * fSmooth + fineWave * 0.6,
        bump: 110 + (turb1 + 0.5) * 90,
      };
    });

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
    textureCache[planetId] = { map, bumpMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 8. SATURN — Butterscotch Ammonia Bands, North Polar Hexagon & Cassini Rings
  // ==========================================================================
  if (planetId === 'saturn') {
    generateSphericalPixels((sx, sy, sz, _lon, lat) => {
      const turb = (fbm3D(sx * 7, sy * 24, sz * 7, 4, 809) - 0.5) * 0.035;
      const l = 0.5 - lat + turb;

      const z1 = Math.sin(l * Math.PI * 16) * 14;
      const z2 = Math.cos(l * Math.PI * 7) * 18;
      const polarDarkening = Math.abs(lat) > 0.38 ? (Math.abs(lat) - 0.38) * 115 : 0;

      const r = 224 + z1 + z2 - polarDarkening * 0.7;
      const g = 194 + (z1 + z2) * 0.85 - polarDarkening * 0.45;
      const b = 138 + (z1 + z2) * 0.55 + polarDarkening * 0.25;
      return { r, g, b, bump: 128 + z1 * 2 };
    });

    // High-Definition Radial Ring System (D, C, B, Cassini Division, A, Encke Gap, F Ring)
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 1024;
    ringCanvas.height = 1024;
    const rCtx = ringCanvas.getContext('2d')!;
    const cx = 512;
    const cy = 512;

    for (let r = 195; r <= 504; r += 0.75) {
      const norm = (r - 195) / 309; // 0 = inner D/C ring, 1 = outer F ring

      // Authentic Cassini ring structure
      const isCassiniDivision = norm > 0.635 && norm < 0.705;
      const isEnckeGap = norm > 0.895 && norm < 0.912;
      const isCRing = norm < 0.24;
      const isBRing = norm >= 0.24 && norm <= 0.635;

      const highFreqWave =
        Math.sin(norm * 340) * 0.08 +
        Math.cos(norm * 890) * 0.05 +
        Math.sin(norm * 140) * 0.1;

      let alpha = 0.75;
      let red = 225;
      let green = 204;
      let blue = 166;

      if (isCassiniDivision) {
        alpha = 0.04;
        red = 40;
        green = 36;
        blue = 32;
      } else if (isEnckeGap) {
        alpha = 0.06;
      } else if (isCRing) {
        alpha = 0.18 + (norm / 0.24) * 0.24 + highFreqWave * 0.3;
        red = 165;
        green = 152;
        blue = 135;
      } else if (isBRing) {
        alpha = Math.min(0.96, 0.82 + highFreqWave);
        const tone = Math.floor(232 + Math.sin(norm * 110) * 22);
        red = tone;
        green = Math.floor(tone * 0.9);
        blue = Math.floor(tone * 0.73);
      } else {
        // Outer A Ring
        alpha = Math.min(0.85, 0.64 + highFreqWave * 0.7);
        const tone = Math.floor(208 + Math.cos(norm * 150) * 18);
        red = tone;
        green = Math.floor(tone * 0.89);
        blue = Math.floor(tone * 0.75);
      }

      rCtx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha))})`;
      rCtx.lineWidth = 1.35;
      rCtx.beginPath();
      rCtx.arc(cx, cy, r, 0, Math.PI * 2);
      rCtx.stroke();
    }

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
    const ringMap = configureSphericalTexture(new THREE.CanvasTexture(ringCanvas), true);
    textureCache[planetId] = { map, bumpMap, ringMap };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 9. URANUS — Cyan-Aquamarine Methane Ice Haze, Zonal Bands & Polar Hood
  // ==========================================================================
  if (planetId === 'uranus') {
    generateSphericalPixels((sx, sy, sz, _lon, lat) => {
      const haze = fbm3D(sx * 5, sy * 14, sz * 5, 4, 907);
      const polarHood = Math.max(0, (lat - 0.15) * 1.45);
      const band = Math.cos(lat * Math.PI * 8) * 8 + (haze - 0.5) * 12;

      return {
        r: 122 + polarHood * 85 + band,
        g: 222 + polarHood * 28 + band,
        b: 236 + polarHood * 18 + band * 0.6,
        bump: 128 + band * 2,
      };
    });

    const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
    textureCache[planetId] = { map };
    return textureCache[planetId];
  }

  // ==========================================================================
  // 10. NEPTUNE — Deep Azure Methane Atmosphere, Great Dark Spot & Scooter Cirrus
  // ==========================================================================
  generateSphericalPixels((sx, sy, sz, lon, lat) => {
    const turb = fbm3D(sx * 7, sy * 18, sz * 7, 5, 953) - 0.5;
    const cirrus = ridged3D(sx * 16, sy * 38, sz * 16, 4, 971);
    const band = Math.sin((lat + turb * 0.04) * Math.PI * 12) * 18;

    // Great Dark Spot anticyclonic oval
    const dLon = Math.atan2(Math.sin(lon + 0.4), Math.cos(lon + 0.4));
    const dLat = lat + 0.18;
    const gdsDist = Math.hypot(dLon * 0.65, dLat * 1.5);
    const gdsFactor = gdsDist < 0.13 ? Math.cos((gdsDist / 0.13) * Math.PI * 0.5) : 0;

    // High-altitude bright white methane-ice cirrus streaks near GDS companion
    const cirrusStreak =
      cirrus > 0.78 && Math.abs(lat + 0.14) < 0.22 ? Math.pow((cirrus - 0.78) / 0.22, 1.4) * 165 : 0;

    const r = (24 + band * 0.6 + turb * 22) * (1 - gdsFactor * 0.55) + cirrusStreak;
    const g = (78 + band * 1.1 + turb * 32) * (1 - gdsFactor * 0.48) + cirrusStreak;
    const b = (212 + band * 1.2 + turb * 38) * (1 - gdsFactor * 0.32) + cirrusStreak * 0.8;

    return {
      r,
      g,
      b,
      bump: 120 + cirrusStreak * 0.6,
    };
  });

  const map = configureSphericalTexture(new THREE.CanvasTexture(canvas), true);
  const bumpMap = configureSphericalTexture(new THREE.CanvasTexture(bumpCanvas), false);
  textureCache[planetId] = { map, bumpMap };
  return textureCache[planetId];
}
