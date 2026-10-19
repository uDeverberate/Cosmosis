import React from 'react';
import { WALKTHROUGH_STEPS } from '../data/spaceAcademyData';
import { useAcademyStore } from '../store/useAcademyStore';
import { Modal } from './Modal';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, X, Compass } from 'lucide-react';

export const WalkthroughModal: React.FC = () => {
  const {
    isWalkthroughOpen,
    walkthroughStepIndex,
    cadetName,
    setCadetName,
    closeWalkthrough,
    nextWalkthroughStep,
    prevWalkthroughStep,
    setActiveTab,
  } = useAcademyStore();

  if (!isWalkthroughOpen) return null;

  const step = WALKTHROUGH_STEPS[walkthroughStepIndex] || WALKTHROUGH_STEPS[0];
  const isFirst = walkthroughStepIndex === 0;
  const isLast = walkthroughStepIndex === WALKTHROUGH_STEPS.length - 1;

  const handleNext = () => {
    const nextStep = WALKTHROUGH_STEPS[walkthroughStepIndex + 1];
    if (nextStep?.targetTab) {
      setActiveTab(nextStep.targetTab);
    }
    nextWalkthroughStep(WALKTHROUGH_STEPS.length);
  };

  return (
    <Modal
      open={isWalkthroughOpen}
      onClose={closeWalkthrough}
      labelledBy="walkthrough-title"
      className="relative w-full max-w-xl rounded-2xl bg-space-900 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden"
    >
      {/* Top Glowing Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400" />

      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <Compass className="h-4 w-4 animate-spin" style={{ animationDuration: '10s' }} />
          <span>{step.subtitle}</span>
        </div>
        <button
          onClick={closeWalkthrough}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Skip orientation tour"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-6rem)]">
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-4xl shrink-0 animate-float-slow shadow-inner"
          >
            {step.icon}
          </div>
          <div>
            <h2 id="walkthrough-title" className="text-xl font-bold text-white tracking-tight">
              {step.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Step 1 Special Input: Cadet Callsign */}
        {isFirst && (
          <div className="bg-space-950/90 border border-slate-800 rounded-xl p-4">
            <label
              htmlFor="cadet-callsign"
              className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5"
            >
              Enter your space cadet callsign / name
            </label>
            <input
              id="cadet-callsign"
              type="text"
              value={cadetName}
              onChange={(e) => setCadetName(e.target.value)}
              placeholder="e.g., Cadet Aria, Commander Alex..."
              className="w-full bg-space-900 border border-cyan-500/40 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}

        {/* Pro Tip Box */}
        <div className="bg-cyan-950/25 border border-cyan-500/30 rounded-xl p-3.5 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs text-cyan-100 leading-relaxed">
            <span className="font-semibold text-amber-300 font-mono uppercase mr-1.5">Cadet Tip:</span>
            {step.tip}
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between pt-2">
          <div
            className="flex items-center gap-2"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={WALKTHROUGH_STEPS.length}
            aria-valuenow={walkthroughStepIndex + 1}
            aria-label={`Tour step ${walkthroughStepIndex + 1} of ${WALKTHROUGH_STEPS.length}`}
          >
            {WALKTHROUGH_STEPS.map((s, idx) => (
              <div
                key={s.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === walkthroughStepIndex
                    ? 'w-7 bg-cyan-400'
                    : idx < walkthroughStepIndex
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {!isFirst && (
              <button
                onClick={prevWalkthroughStep}
                className="micro-btn px-3.5 py-2 rounded-lg text-xs font-mono bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="micro-btn px-5 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Launch into the academy (+50 XP)
                </>
              ) : (
                <>
                  Next step
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
