import React, { useRef } from 'react';
import { useAcademyStore, getCadetRank, CADET_RANKS } from '../store/useAcademyStore';
import { ACADEMY_BADGES } from '../data/spaceAcademyData';
import { Modal } from './Modal';
import { Award, Download, X, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { soundFX, triggerCelebrationConfetti } from '../utils/soundEffects';

export const CadetProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setProfileModalOpen,
    cadetName,
    setCadetName,
    xp,
    unlockedBadges,
    inspectedPlanets,
    scannedHotspots,
    completedStories,
    completedGuides,
    resetProgress,
  } = useAcademyStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentRank = getCadetRank(xp);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    soundFX.playSuccessChime();
    triggerCelebrationConfetti();

    const cleanName = cadetName.trim() || 'Cadet Explorer';

    const grad = ctx.createLinearGradient(0, 0, 900, 640);
    grad.addColorStop(0, '#040711');
    grad.addColorStop(0.5, '#0b132b');
    grad.addColorStop(1, '#050814');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 640);

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (let i = 0; i < 60; i++) {
      const x = (i * 137) % 880;
      const y = (i * 97) % 620;
      ctx.beginPath();
      ctx.arc(x, y, (i % 2) + 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.strokeRect(24, 24, 852, 592);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, 828, 568);

    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(36, 36, 828, 54);

    ctx.fillStyle = '#040711';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('COSMOSIS // NASA STUDENT SPACE ACADEMY CREDENTIAL', 450, 69);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillText('OFFICIAL DIPLOMA OF SPACE EXPLORATION', 450, 155);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillText('PRESENTED FOR EXCELLENCE IN ASTROPHYSICS, ORBITAL MECHANICS & FLIGHT SIMULATION', 450, 188);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 215);
    ctx.lineTo(720, 215);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px "Courier New", monospace';
    ctx.fillText('THIS CERTIFIES THAT', 450, 255);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 38px "Courier New", monospace';
    ctx.fillText(cleanName.toUpperCase(), 450, 305);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText(`RANK ACHIEVED: ${currentRank.title.toUpperCase()} (${xp} XP)`, 450, 355);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText(
      `BADGES EARNED: ${unlockedBadges.length}/${ACADEMY_BADGES.length}   |   WORLDS SURVEYED: ${inspectedPlanets.length}   |   CHRONICLES COMPLETED: ${completedStories.length}`,
      450,
      410
    );

    const dateStr = new Date().toISOString().split('T')[0];
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText(`DATE ISSUED: ${dateStr}`, 65, 535);
    ctx.fillText(`ACADEMY ID: COSMOSIS-${Math.floor(100000 + Math.random() * 900000)}`, 65, 558);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillText('AUTHORIZED BY COSMOSIS MISSION CONTROL', 835, 535);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 16px "Courier New", monospace';
    ctx.fillText('Cosmosis Flight Director', 835, 560);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `Cosmosis-Diploma-${cleanName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.href = dataUrl;
    a.click();
  };

  return (
    <Modal
      open={isProfileModalOpen}
      onClose={() => setProfileModalOpen(false)}
      labelledBy="profile-title"
      className="w-full max-w-4xl bg-space-900 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
        <canvas ref={canvasRef} width={900} height={640} className="hidden" />

        {/* Header */}
        <div className="px-6 py-4 bg-space-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-2xl">
              {currentRank.icon}
            </div>
            <div>
              <h2 id="profile-title" className="text-base font-bold text-white">
                COSMOSIS Service Record & Mission Badges
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                CURRENT RANK: <span className="text-amber-400 font-bold">{currentRank.title}</span> // TOTAL XP: <span className="text-cyan-400 font-bold">{xp}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setProfileModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close service record"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-space-950/80 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Cadet Rank Progression Ladder
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {CADET_RANKS.map((r) => {
                  const unlocked = xp >= r.minXp;
                  return (
                    <div
                      key={r.level}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        unlocked
                          ? 'bg-cyan-500/10 border-cyan-400/40 text-white'
                          : 'bg-space-900/40 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="text-xl mb-1">{r.icon}</div>
                      <div className="text-[10px] font-bold leading-tight">{r.title}</div>
                      <div className="text-[10px] font-mono text-cyan-400 mt-1">{r.minXp} XP</div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
                <div className="bg-space-900 rounded-lg p-2">
                  <div className="text-sm font-bold text-cyan-400 font-mono">{inspectedPlanets.length}/9</div>
                  <div className="text-[10px] text-slate-400">Worlds Visited</div>
                </div>
                <div className="bg-space-900 rounded-lg p-2">
                  <div className="text-sm font-bold text-amber-400 font-mono">{scannedHotspots.length}/18</div>
                  <div className="text-[10px] text-slate-400">Parts Scanned</div>
                </div>
                <div className="bg-space-900 rounded-lg p-2">
                  <div className="text-sm font-bold text-emerald-400 font-mono">{completedStories.length}/6</div>
                  <div className="text-[10px] text-slate-400">Stories Read</div>
                </div>
                <div className="bg-space-900 rounded-lg p-2">
                  <div className="text-sm font-bold text-purple-400 font-mono">{completedGuides.length}/4</div>
                  <div className="text-[10px] text-slate-400">Labs Mastered</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-cyan-950/40 via-space-950 to-amber-950/20 border border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    Official COSMOSIS Diploma
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Customize your Cadet Name below and export a personalized high-resolution PNG certificate showing your rank, XP, and mission badges!
                </p>
                <input
                  type="text"
                  value={cadetName}
                  onChange={(e) => setCadetName(e.target.value)}
                  placeholder="Enter Cadet Name..."
                  className="w-full bg-space-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 mb-3"
                />
              </div>
              <button
                onClick={downloadCertificate}
                className="micro-btn w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Download className="h-4 w-4" />
                Download Official Diploma (.PNG)
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
              Mission Patches & Achievement Badges ({unlockedBadges.length} / {ACADEMY_BADGES.length} Unlocked)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ACADEMY_BADGES.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`rounded-xl p-3.5 border transition-all flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-space-950/50 border-slate-800/80 opacity-65'
                    }`}
                  >
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                        isUnlocked
                          ? 'bg-emerald-500/15 border-emerald-400/40'
                          : 'bg-space-900 border-slate-800 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{badge.title}</h4>
                        {isUnlocked ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="h-3 w-3 text-slate-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {badge.description}
                      </p>
                      <span className="inline-block mt-1.5 text-[10px] font-mono text-amber-400">
                        {badge.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">
              Progress saves automatically on this device.
            </span>
            <button
              onClick={() => {
                if (window.confirm('Reset all XP, badges and mission progress on this device?')) {
                  resetProgress();
                }
              }}
              className="text-[11px] font-mono uppercase text-slate-400 hover:text-rose-300 underline underline-offset-2"
            >
              Reset progress
            </button>
          </div>
        </div>
    </Modal>
  );
};
