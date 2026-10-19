import { ACADEMY_BADGES, SOLAR_SYSTEM_PLANETS } from '../data/spaceAcademyData';

export interface CaptainsLogOptions {
  name: string;
  xp: number;
  rankTitle: string;
  badges: string[];
  visitedWorlds: string[];
}

/**
 * Draws and downloads a 1200x630 captain's log.
 * Returns false when the canvas is unavailable so the caller can fall back.
 */
export function exportCaptainsLog(options: CaptainsLogOptions): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Deep space background
    const bg = ctx.createLinearGradient(0, 0, 1200, 630);
    bg.addColorStop(0, '#02040a');
    bg.addColorStop(0.55, '#060b18');
    bg.addColorStop(1, '#02030a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1200, 630);

    // Deterministic starfield
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 260; i += 1) {
      const x = random() * 1200;
      const y = random() * 630;
      const r = random() * 1.3 + 0.2;
      ctx.fillStyle = `rgba(255,255,255,${0.18 + random() * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Orbit rings with visited worlds lit
    const cx = 855;
    const cy = 330;
    const planets = SOLAR_SYSTEM_PLANETS.filter((planet) => planet.id !== 'sun' && planet.id !== 'moon');
    planets.forEach((planet, index) => {
      const radius = 48 + index * 22;
      const visited = options.visitedWorlds.includes(planet.id);
      ctx.strokeStyle = visited ? 'rgba(56,189,248,0.35)' : 'rgba(148,163,184,0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.62, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (!visited) return;
      const angle = -0.9 + index * 0.42;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius * 0.62;
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sun
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70);
    glow.addColorStop(0, 'rgba(255,214,102,0.95)');
    glow.addColorStop(0.35, 'rgba(245,158,11,0.55)');
    glow.addColorStop(1, 'rgba(245,158,11,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();

    // Left column
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px ui-monospace, Menlo, monospace';
    ctx.fillText('COSMOSIS // CAPTAIN\u2019S LOG', 64, 92);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText(truncate(options.name || 'Cadet Explorer', 22), 64, 158);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px ui-monospace, Menlo, monospace';
    ctx.fillText(`RANK  ${options.rankTitle.toUpperCase()}`, 64, 200);
    ctx.fillText(`XP    ${options.xp}`, 64, 228);
    ctx.fillText(
      `WORLDS ${options.visitedWorlds.length}/${SOLAR_SYSTEM_PLANETS.length}`,
      64,
      256
    );
    ctx.fillText(`BADGES ${options.badges.length}/${ACADEMY_BADGES.length}`, 64, 284);

    // Badge row
    let bx = 64;
    const badgeY = 352;
    ctx.strokeStyle = 'rgba(56,189,248,0.35)';
    ctx.beginPath();
    ctx.moveTo(64, 320);
    ctx.lineTo(520, 320);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '13px ui-monospace, Menlo, monospace';
    ctx.fillText('MISSION PATCHES', 64, 310);

    for (const badgeId of options.badges.slice(0, 10)) {
      const badge = ACADEMY_BADGES.find((item) => item.id === badgeId);
      if (!badge) continue;
      ctx.fillStyle = 'rgba(16,185,129,0.14)';
      ctx.strokeStyle = 'rgba(16,185,129,0.45)';
      ctx.beginPath();
      ctx.roundRect(bx, badgeY - 22, 42, 30, 7);
      ctx.fill();
      ctx.stroke();
      ctx.font = '16px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(badge.icon, bx + 11, badgeY);
      bx += 50;
      if (bx > 500) break;
    }

    if (options.badges.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px ui-monospace, Menlo, monospace';
      ctx.fillText('No patches yet. The sky is waiting.', 64, badgeY);
    }

    // Footer
    ctx.fillStyle = '#475569';
    ctx.font = '13px ui-monospace, Menlo, monospace';
    ctx.fillText(`ISSUED ${new Date().toISOString().slice(0, 10)}`, 64, 560);
    ctx.fillText('EXPLORATION RECORDED ON THIS DEVICE', 64, 582);

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Cosmosis-Captains-Log-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = url;
    link.click();
    return true;
  } catch {
    return false;
  }
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}\u2026` : value;
}
