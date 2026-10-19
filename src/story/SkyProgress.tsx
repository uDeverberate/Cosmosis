import React, { useMemo } from 'react';
import { useAcademyStore } from '../store/useAcademyStore';
import { ACADEMY_BADGES } from '../data/spaceAcademyData';

interface ConstellationPoint {
  x: number;
  y: number;
}

interface Constellation {
  id: string;
  points: ConstellationPoint[];
}

/** Deterministic pseudo-random so a badge always draws the same constellation. */
const seeded = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Every badge owns one constellation. Positions are derived, never stored, so a
 * badge earned offline still draws correctly on the next load.
 */
const buildConstellations = (): Constellation[] =>
  ACADEMY_BADGES.map((badge, index) => {
    const random = seeded(104729 + index * 7919);
    const angle = (index / ACADEMY_BADGES.length) * Math.PI * 2 + 0.6;
    const radiusX = 38 + random() * 6;
    const radiusY = 31 + random() * 6;
    let x = 50 + Math.cos(angle) * radiusX;
    let y = 50 + Math.sin(angle) * radiusY;

    const points: ConstellationPoint[] = [];
    for (let i = 0; i < 5; i += 1) {
      points.push({ x: clamp(x, 4, 96), y: clamp(y, 6, 94) });
      x += (random() - 0.5) * 7;
      y += (random() - 0.5) * 7;
    }

    return { id: badge.id, points };
  });

const CONSTELLATIONS = buildConstellations();

/**
 * Progress lives in the sky. Each unlocked badge lights one constellation;
 * locked ones stay faintly visible as somewhere to go, never as a notification.
 */
export const SkyProgress: React.FC = () => {
  const { unlockedBadges } = useAcademyStore();
  const unlockedCount = unlockedBadges.length;

  const constellations = useMemo(
    () =>
      CONSTELLATIONS.map((constellation) => ({
        ...constellation,
        unlocked: unlockedBadges.includes(constellation.id),
      })),
    [unlockedBadges]
  );

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full transition-opacity duration-1000"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity: unlockedCount > 0 ? 1 : 0.55 }}
    >
      {constellations.map((constellation) => {
        const color = constellation.unlocked ? '#7dd3fc' : '#94a3b8';
        const path = constellation.points
          .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
          .join(' ');

        return (
          <g
            key={constellation.id}
            style={{
              opacity: constellation.unlocked ? 0.6 : 0.1,
              transition: 'opacity 1200ms ease',
              filter: constellation.unlocked
                ? 'drop-shadow(0 0 1.6px rgba(125,211,252,0.9))'
                : 'none',
            }}
          >
            <polyline
              points={path}
              fill="none"
              stroke={color}
              strokeWidth="0.08"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {constellation.points.map((point, index) => (
              <circle
                key={`${constellation.id}-${index}`}
                cx={point.x}
                cy={point.y}
                r={index === 0 ? 0.28 : 0.2}
                fill={color}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
};
