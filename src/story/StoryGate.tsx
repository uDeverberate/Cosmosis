import React, { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';
import { ambience } from './ambience';

interface StoryGateProps {
  onEntered: () => void;
}

/**
 * The one interaction that makes ambient audio legal in a browser.
 * It also gives the solar system time to load behind the curtain.
 */
export const StoryGate: React.FC<StoryGateProps> = ({ onEntered }) => {
  const [soundOn, setSoundOn] = useState(() => !ambience.getMuted());
  const [leaving, setLeaving] = useState(false);
  const { progress, active, total } = useProgress();
  const beginRef = useRef<HTMLButtonElement>(null);

  // The gate is a modal in practice: lock scroll, focus the primary action and
  // keep Tab inside it until the curtain lifts.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    beginRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !beginRef.current) return;
      const panel = beginRef.current.closest('[role="dialog"]');
      const focusable = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled])'))
        : [];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    // Keep the curtain up for at least a beat so it reads as intentional.
    const timer = window.setTimeout(() => {
      if (leaving) onEntered();
    }, 850);
    return () => window.clearTimeout(timer);
  }, [leaving, onEntered]);

  const begin = async () => {
    if (leaving) return;
    try {
      if (soundOn) await ambience.start();
      else ambience.setMuted(true);
    } catch {
      // Audio is optional; the gate must never block entry.
    }
    setLeaving(true);
  };

  const percent = Math.round(progress);
  const showPercent = total > 0 && active;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020306] px-6 text-white transition-opacity duration-700 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ambient starfield */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 18% 24%, rgba(255,255,255,0.75), transparent), radial-gradient(1px 1px at 72% 18%, rgba(255,255,255,0.55), transparent), radial-gradient(1.5px 1.5px at 84% 68%, rgba(56,189,248,0.65), transparent), radial-gradient(1px 1px at 32% 78%, rgba(255,255,255,0.45), transparent), radial-gradient(1px 1px at 55% 46%, rgba(255,255,255,0.35), transparent)',
          backgroundSize: '900px 700px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(245,158,11,0.20) 0%, rgba(56,189,248,0.10) 38%, transparent 68%)',
        }}
      />

      <div className="relative w-full max-w-lg text-center">
        <div className="mb-6 flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-[0.35em] text-cyan-300/80">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>NASA student space academy</span>
        </div>

        <h2
          id="gate-title"
          className="text-5xl font-extrabold tracking-[0.18em] text-white sm:text-6xl"
        >
          COSMOSIS
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
          A quiet solar system. A few stories worth the trip. Everything else is
          waiting behind one key.
        </p>

        <div className="mx-auto mt-10 max-w-xs">
          <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
            <span>{active ? 'Preparing the system' : 'System ready'}</span>
            <span className="text-cyan-300">{showPercent ? `${percent}%` : 'READY'}</span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-300 transition-all duration-500"
              style={{ width: showPercent ? `${Math.max(6, percent)}%` : '100%' }}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            ref={beginRef}
            onClick={begin}
            className="micro-btn group flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-mono font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_40px_-10px_rgba(56,189,248,0.8)] hover:bg-cyan-100"
          >
            Begin the journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>

          <button
            onClick={() => setSoundOn((value) => !value)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:border-white/25 hover:text-slate-200"
            aria-pressed={soundOn}
          >
            {soundOn ? (
              <Volume2 className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            )}
            {soundOn ? 'Ambient sound on' : 'Enter without sound'}
          </button>
        </div>

        <p className="mt-8 text-[10px] font-mono uppercase tracking-widest text-slate-600">
          Headphones recommended
        </p>
      </div>
    </div>
  );
};
