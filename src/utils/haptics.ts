/**
 * Tactile Haptic Engine for Mobile Devices (iOS & Android)
 * Leverages the Web Vibration API (navigator.vibrate) with safe fallbacks.
 */
class HapticEngine {
  private enabled: boolean = true;
  // Browsers block vibration until the visitor has interacted with the page
  private hasInteracted: boolean = false;

  constructor() {
    if (typeof window === 'undefined') return;
    const activate = () => {
      this.hasInteracted = true;
      window.removeEventListener('pointerdown', activate, true);
      window.removeEventListener('keydown', activate, true);
    };
    window.addEventListener('pointerdown', activate, true);
    window.addEventListener('keydown', activate, true);
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;
  }

  // Light crisp tick (button tap, chip selection, bottom dock change)
  public light() {
    if (!this.hasInteracted || !this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(12);
    } catch {
      // ignore
    }
  }

  // Subtle selection tick (scrubbing, carousel snapping)
  public selection() {
    if (!this.hasInteracted || !this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(8);
    } catch {
      // ignore
    }
  }

  // Medium solid pulse (view mode transition, drawer sheet toggle, warp speed)
  public medium() {
    if (!this.hasInteracted || !this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(24);
    } catch {
      // ignore
    }
  }

  // Heavy pulse (scanning hotspot lock, landing, impact)
  public heavy() {
    if (!this.hasInteracted || !this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(45);
    } catch {
      // ignore
    }
  }

  // Double-tap pulse for quiz success or badge reward
  public success() {
    if (!this.hasInteracted || !this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([18, 40, 24]);
    } catch {
      // ignore
    }
  }

  // Error pattern (wrong answer, collision risk)
  public error() {
    if (!this.hasInteracted || !this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([40, 30, 40, 30, 50]);
    } catch {
      // ignore
    }
  }

  // Warp acceleration sequence (cinematic tactile ramp)
  public warp() {
    if (!this.hasInteracted || !this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([10, 25, 18, 20, 35]);
    } catch {
      // ignore
    }
  }
}

export const haptics = new HapticEngine();
