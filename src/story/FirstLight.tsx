import React, { useState } from 'react';
import { ArrowRight, Globe2, Keyboard, Sparkles, X } from 'lucide-react';

interface FirstLightProps {
  onFocusEarth: () => void;
  onOpenDeck: () => void;
  onComplete: () => void;
}

/**
 * A four-beat orientation told inside the fiction, not as a settings tour.
 * Every beat is skippable; skipping still counts as seen.
 */
export const FirstLight: React.FC<FirstLightProps> = ({
  onFocusEarth,
  onOpenDeck,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />,
      eyebrow: 'First light',
      title: 'This is your solar system.',
      body: 'Eleven worlds, one star, no menus in the way. Tap any world to fly to it.',
      action: 'Next',
      run: () => setStep(1),
    },
    {
      icon: <Globe2 className="h-4 w-4 text-cyan-300" aria-hidden="true" />,
      eyebrow: 'Start with home',
      title: 'Earth is already in your logbook.',
      body: 'Take a closer look. The camera does the travelling; the facts arrive when you land.',
      action: 'Show me Earth',
      run: () => {
        onFocusEarth();
        setStep(2);
      },
    },
    {
      icon: <Keyboard className="h-4 w-4 text-cyan-300" aria-hidden="true" />,
      eyebrow: 'Mission control',
      title: 'Everything else is behind one key.',
      body: 'Press K on a keyboard, or tap empty space on a touch screen.',
      action: 'Open mission control',
      run: () => {
        onOpenDeck();
        setStep(3);
      },
    },
    {
      icon: <Sparkles className="h-4 w-4 text-emerald-300" aria-hidden="true" />,
      eyebrow: 'Quiet progress',
      title: 'Your progress lives in the sky.',
      body: 'Visit worlds and earn patches. Constellations appear above the ecliptic, never as popups.',
      action: 'Begin exploring',
      run: onComplete,
    },
  ];

  const current = steps[step];

  return (
    <div
      role="region"
      aria-label="First Light orientation"
      className="fixed inset-x-3 top-20 z-40 animate-in fade-in slide-in-from-top-4 duration-300 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:top-auto sm:w-[27rem] sm:-translate-x-1/2"
    >
      <div className="holo-panel-3d rounded-2xl border border-cyan-500/25 p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-300">
            {current.icon}
            {current.eyebrow}
          </div>
          <button
            onClick={onComplete}
            className="rounded p-0.5 text-slate-500 hover:text-white"
            aria-label="Skip the orientation"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <h2 className="mt-2 text-base font-bold leading-snug text-white">{current.title}</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-300">{current.body}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {steps.map((item, index) => (
              <span
                key={item.eyebrow}
                className={`h-1.5 rounded-full transition-all ${
                  index === step ? 'w-5 bg-cyan-400' : index < step ? 'w-1.5 bg-emerald-400' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onComplete}
              className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-300"
            >
              Skip
            </button>
            <button
              onClick={current.run}
              className="micro-btn flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-cyan-300"
            >
              {current.action}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
