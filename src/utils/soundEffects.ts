import confetti from 'canvas-confetti';
import { haptics } from './haptics';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private thrusterOsc: OscillatorNode | null = null;
  private thrusterGain: GainNode | null = null;
  private lastClickAt = 0;

  constructor() {
    try {
      this.isMuted = window.localStorage.getItem('cosmosis:muted') === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  private async ensureContext(): Promise<boolean> {
    if (this.isMuted) return false;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    } catch {
      return false;
    }
  }

  public async playClick(): Promise<void> {
    // Collapse duplicate click sounds when a call site and a store action both fire
    const nowMs = performance.now();
    if (nowMs - this.lastClickAt < 70) return;
    this.lastClickAt = nowMs;
    haptics.light();
    if (!(await this.ensureContext()) || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  public async playHover(): Promise<void> {
    if (!(await this.ensureContext()) || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(1120, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.032);
  }

  public async playScanPing(): Promise<void> {
    haptics.medium();
    if (!(await this.ensureContext()) || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(1040, now + 0.14);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public async playSuccessChime(): Promise<void> {
    haptics.success();
    if (!(await this.ensureContext()) || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.075;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.34);
    });
  }

  public async playAlert(): Promise<void> {
    haptics.error();
    if (!(await this.ensureContext()) || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(165, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  public async startThrusterSound(): Promise<void> {
    haptics.warp();
    if (!(await this.ensureContext()) || !this.ctx || !this.masterGain || this.thrusterOsc) return;
    const now = this.ctx.currentTime;
    this.thrusterOsc = this.ctx.createOscillator();
    this.thrusterGain = this.ctx.createGain();

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, now);

    this.thrusterOsc.type = 'sawtooth';
    this.thrusterOsc.frequency.setValueAtTime(58, now);

    this.thrusterGain.gain.setValueAtTime(0.01, now);
    this.thrusterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);

    this.thrusterOsc.connect(filter);
    filter.connect(this.thrusterGain);
    this.thrusterGain.connect(this.masterGain);
    this.thrusterOsc.start(now);
  }

  public stopThrusterSound(): void {
    if (!this.ctx || !this.thrusterOsc || !this.thrusterGain) return;
    const osc = this.thrusterOsc;
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // Ignore already stopped
    }
    this.thrusterOsc = null;
    this.thrusterGain = null;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      window.localStorage.setItem('cosmosis:muted', String(this.isMuted));
    } catch {
      // Storage may be unavailable (private mode); mute still applies for the session
    }
    if (this.isMuted) {
      this.stopThrusterSound();
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const soundFX = new SoundEffectsManager();

export function triggerCelebrationConfetti(): void {
  try {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#38bdf8', '#f59e0b', '#10b981', '#a855f7', '#ffffff'],
    });
  } catch {
    // Fallback if canvas-confetti fails in headless environment
  }
}
