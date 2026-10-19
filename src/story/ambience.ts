/**
 * Evolving Cosmic Ambient Music & Harmonic Soundscape Engine for Story Mode.
 *
 * Synthesizes a soothing, cinema-grade space ambient score in real time using
 * Web Audio API:
 *   1. Warm polyphonic Lydian stereo synth pads with slow chorus detuning
 *   2. Dual-feedback stereo cosmic reverb network for deep space resonance
 *   3. Gentle crystalline pentatonic star-chime notes that softly drift in
 *   4. Harmonic discovery & micro-interaction chimes when clicking celestial bodies
 */

type AudioContextCtor = typeof AudioContext;

// Dreamy D Lydian / B minor 9th cosmic frequencies (Hz)
const CHORD_VOICINGS: number[][] = [
  [73.42, 110.0, 146.83, 185.0, 220.0, 277.18],   // D maj9 (D2, A2, D3, F#3, A3, C#4)
  [61.74, 92.5, 138.59, 185.0, 220.0, 246.94],    // Bm11 (B1, F#2, C#3, F#3, A3, B3)
  [82.41, 123.47, 164.81, 207.65, 246.94, 329.63], // E6/9 (E2, B2, E3, G#3, B3, E4)
  [55.0, 110.0, 138.59, 164.81, 220.0, 277.18],   // A add9 (A1, A2, C#3, E3, A3, C#4)
];

// High crystalline star-bell notes (D Lydian pentatonic)
const STAR_CHIME_NOTES = [587.33, 659.25, 739.99, 880.0, 1108.73, 1174.66, 1318.51];

class AmbienceEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private synthGain: GainNode | null = null;
  private trackGain: GainNode | null = null;
  private reverbInput: GainNode | null = null;
  private padOscillators: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode }[] = [];
  private synthNodes: AudioNode[] = [];
  private trackSource: AudioBufferSourceNode | null = null;
  private chordTimer: number | null = null;
  private chimeTimer: number | null = null;
  private chordIndex = 0;
  private started = false;
  private muted = false;
  private ducked = false;
  private visibilityBound = false;

  constructor() {
    try {
      this.muted = window.localStorage.getItem('cosmosis:ambience-muted') === 'true';
    } catch {
      this.muted = false;
    }
  }

  public getMuted(): boolean {
    return this.muted;
  }

  public isStarted(): boolean {
    return this.started;
  }

  public async start(): Promise<boolean> {
    if (this.started) {
      await this.resume();
      this.applyGain();
      return true;
    }

    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return false;

    try {
      const ctx = new Ctor();
      this.ctx = ctx;

      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);
      this.master = master;

      const synthGain = ctx.createGain();
      synthGain.gain.value = 1;
      synthGain.connect(master);
      this.synthGain = synthGain;

      const trackGain = ctx.createGain();
      trackGain.gain.value = 0.0001;
      trackGain.connect(master);
      this.trackGain = trackGain;

      if (ctx.state === 'suspended') await ctx.resume();

      this.started = true;
      this.startSynth();
      void this.loadLicensedTrack();
      this.bindVisibility();
      this.applyGain();
      return true;
    } catch {
      return false;
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      window.localStorage.setItem('cosmosis:ambience-muted', String(this.muted));
    } catch {
      // ignore
    }
    this.applyGain();
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    if (this.muted === muted) return;
    this.muted = muted;
    try {
      window.localStorage.setItem('cosmosis:ambience-muted', String(muted));
    } catch {
      // ignore
    }
    this.applyGain();
  }

  /** Lower the bed while narration or a chapter is reading. */
  public duck(on: boolean): void {
    if (this.ducked === on) return;
    this.ducked = on;
    this.applyGain();
  }

  /**
   * Plays a gentle harmonic celestial chime when zooming into a world or opening the deck.
   */
  public playCelestialPulse(pitchMultiplier = 1): void {
    if (this.muted || !this.ctx || !this.reverbInput) return;
    try {
      const now = this.ctx.currentTime;
      const baseFreq = 440 * pitchMultiplier;
      [1, 1.5, 2].forEach((ratio, idx) => {
        if (!this.ctx || !this.reverbInput) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio, now + idx * 0.06);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.035 / (idx + 1), now + idx * 0.06 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 2.4);
        osc.connect(gain);
        gain.connect(this.reverbInput);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 2.5);
      });
    } catch {
      // ignore
    }
  }

  private applyGain(): void {
    if (!this.ctx || !this.master) return;
    const target = this.muted ? 0.0001 : this.ducked ? 0.12 : 0.34;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(target, now + 1.6);
  }

  private async resume(): Promise<void> {
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
    } catch {
      // ignore
    }
  }

  private startSynth(): void {
    const ctx = this.ctx;
    const out = this.synthGain;
    if (!ctx || !out) return;

    // Lush Stereo Delay-Reverb Network for deep cosmic space tail
    const reverbIn = ctx.createGain();
    reverbIn.gain.value = 1.0;
    this.reverbInput = reverbIn;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 920;
    filter.Q.value = 0.7;

    const delayL = ctx.createDelay(2.0);
    const delayR = ctx.createDelay(2.0);
    delayL.delayTime.value = 0.37;
    delayR.delayTime.value = 0.53;

    const fbL = ctx.createGain();
    const fbR = ctx.createGain();
    fbL.gain.value = 0.46;
    fbR.gain.value = 0.46;

    const dampL = ctx.createBiquadFilter();
    const dampR = ctx.createBiquadFilter();
    dampL.type = 'lowpass';
    dampR.type = 'lowpass';
    dampL.frequency.value = 1400;
    dampR.frequency.value = 1400;

    // Cross-feedback stereo loop
    reverbIn.connect(filter);
    filter.connect(out);
    filter.connect(delayL);
    filter.connect(delayR);

    delayL.connect(dampL);
    dampL.connect(fbL);
    fbL.connect(delayR);
    dampL.connect(out);

    delayR.connect(dampR);
    dampR.connect(fbR);
    fbR.connect(delayL);
    dampR.connect(out);

    // 6-voice dual-detuned warm cosmic pad
    const initialChord = CHORD_VOICINGS[0];
    const voiceGains = [0.065, 0.055, 0.045, 0.038, 0.032, 0.024];

    initialChord.forEach((freq, idx) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = idx < 2 ? 'sine' : 'triangle';
      osc2.type = 'sine';
      osc1.frequency.value = freq;
      osc2.frequency.value = freq;
      osc1.detune.value = -6 + idx * 1.5;
      osc2.detune.value = 6 - idx * 1.2;

      gain.gain.value = voiceGains[idx] ?? 0.03;
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(reverbIn);

      osc1.start();
      osc2.start();
      this.padOscillators.push({ osc1, osc2, gain });
      this.synthNodes.push(osc1, osc2, gain);
    });

    // Slow breathing filter modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.045;
    lfoGain.gain.value = 280;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.synthNodes.push(lfo, lfoGain, reverbIn, filter, delayL, delayR, fbL, fbR, dampL, dampR);

    // Evolve the chord voicing smoothly every 9 seconds
    this.chordTimer = window.setInterval(() => {
      if (!this.ctx || this.muted) return;
      this.chordIndex = (this.chordIndex + 1) % CHORD_VOICINGS.length;
      const nextChord = CHORD_VOICINGS[this.chordIndex];
      const now = this.ctx.currentTime;
      this.padOscillators.forEach((voice, idx) => {
        const targetFreq = nextChord[idx] ?? nextChord[0];
        voice.osc1.frequency.cancelScheduledValues(now);
        voice.osc2.frequency.cancelScheduledValues(now);
        voice.osc1.frequency.setValueAtTime(voice.osc1.frequency.value, now);
        voice.osc2.frequency.setValueAtTime(voice.osc2.frequency.value, now);
        voice.osc1.frequency.exponentialRampToValueAtTime(targetFreq, now + 4.5);
        voice.osc2.frequency.exponentialRampToValueAtTime(targetFreq, now + 4.5);
      });
    }, 9000);

    // Gentle crystalline star-bell shimmer every 3.8 seconds
    this.chimeTimer = window.setInterval(() => {
      if (!this.ctx || !this.reverbInput || this.muted || document.hidden) return;
      const now = this.ctx.currentTime;
      const freq = STAR_CHIME_NOTES[Math.floor(Math.random() * STAR_CHIME_NOTES.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(this.ducked ? 0.008 : 0.018, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
      osc.connect(gain);
      gain.connect(this.reverbInput);
      osc.start(now);
      osc.stop(now + 3.5);
    }, 3800);
  }

  private async loadLicensedTrack(): Promise<void> {
    const ctx = this.ctx;
    const trackGain = this.trackGain;
    const synthGain = this.synthGain;
    if (!ctx || !trackGain || !synthGain) return;

    try {
      const response = await fetch('/audio/ambience.mp3', { cache: 'force-cache' });
      if (!response.ok) return;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) return;
      const data = await response.arrayBuffer();
      const buffer = await ctx.decodeAudioData(data);
      if (!this.ctx) return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(trackGain);
      source.start();
      this.trackSource = source;

      const now = ctx.currentTime;
      trackGain.gain.cancelScheduledValues(now);
      trackGain.gain.setValueAtTime(0.0001, now);
      trackGain.gain.linearRampToValueAtTime(0.85, now + 3);
      synthGain.gain.cancelScheduledValues(now);
      synthGain.gain.setValueAtTime(synthGain.gain.value, now);
      synthGain.gain.linearRampToValueAtTime(0.25, now + 3);
    } catch {
      // Our lush polyphonic Lydian space synth stays active seamlessly.
    }
  }

  private bindVisibility(): void {
    if (this.visibilityBound) return;
    this.visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx || !this.started) return;
      if (document.hidden) {
        void this.ctx.suspend();
      } else {
        void this.ctx.resume();
      }
    });
  }

  /** Adjusts harmonic presence as the camera flies between orbit, focus, and reading. */
  public setDepth(depth: 'orbit' | 'focus' | 'read'): void {
    if (!this.synthGain || !this.ctx) return;
    const target = depth === 'orbit' ? 1 : depth === 'focus' ? 0.85 : 0.55;
    const now = this.ctx.currentTime;
    this.synthGain.gain.cancelScheduledValues(now);
    this.synthGain.gain.setValueAtTime(this.synthGain.gain.value, now);
    this.synthGain.gain.linearRampToValueAtTime(target, now + 1.2);
    this.duck(depth === 'read');
  }

  public stop(): void {
    if (this.chordTimer !== null) {
      window.clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.chimeTimer !== null) {
      window.clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (!this.ctx) return;
    try {
      this.trackSource?.stop();
    } catch {
      // ignore
    }
    this.trackSource = null;
    for (const node of this.synthNodes) {
      try {
        if (node instanceof OscillatorNode) node.stop();
        if (node instanceof AudioBufferSourceNode) node.stop();
      } catch {
        // ignore
      }
    }
    this.synthNodes = [];
    this.padOscillators = [];
    void this.ctx.suspend();
  }
}

export const ambience = new AmbienceEngine();
