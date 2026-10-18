import { create } from 'zustand';
import { AcademyTab } from '../types/academy';
import { ACADEMY_BADGES } from '../data/spaceAcademyData';
import { soundFX, triggerCelebrationConfetti } from '../utils/soundEffects';

export interface CadetRankInfo {
  title: string;
  level: number;
  minXp: number;
  nextXp: number;
  icon: string;
}

export const CADET_RANKS: CadetRankInfo[] = [
  { title: 'Stargazer Recruit', level: 1, minXp: 0, nextXp: 150, icon: '🌱' },
  { title: 'Orbital Cadet', level: 2, minXp: 150, nextXp: 350, icon: '🛰️' },
  { title: 'Lunar Navigator', level: 3, minXp: 350, nextXp: 650, icon: '🌕' },
  { title: 'Planetary Scientist', level: 4, minXp: 650, nextXp: 1000, icon: '🪐' },
  { title: 'Deep Space Commander', level: 5, minXp: 1000, nextXp: 2500, icon: '🚀' },
];

export function getCadetRank(xp: number): CadetRankInfo {
  for (let i = CADET_RANKS.length - 1; i >= 0; i--) {
    if (xp >= CADET_RANKS[i].minXp) {
      return CADET_RANKS[i];
    }
  }
  return CADET_RANKS[0];
}

interface AcademyStoreState {
  cadetName: string;
  activeTab: AcademyTab;
  xp: number;
  unlockedBadges: string[];
  inspectedPlanets: string[];
  scannedHotspots: string[];
  completedStories: string[];
  completedGuides: string[];
  isWalkthroughOpen: boolean;
  walkthroughStepIndex: number;
  isGlossaryOpen: boolean;
  isProfileModalOpen: boolean;
  recentToast: { title: string; subtitle: string; icon: string } | null;

  // Actions
  setCadetName: (name: string) => void;
  setActiveTab: (tab: AcademyTab) => void;
  addXp: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  markPlanetInspected: (planetId: string) => void;
  markHotspotScanned: (hotspotId: string) => void;
  markStoryCompleted: (storyId: string, badgeId: string) => void;
  markGuideCompleted: (guideId: string, badgeId: string) => void;
  openWalkthrough: (stepIndex?: number) => void;
  closeWalkthrough: () => void;
  nextWalkthroughStep: (totalSteps: number) => void;
  prevWalkthroughStep: () => void;
  setGlossaryOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
  clearToast: () => void;
}

export const useAcademyStore = create<AcademyStoreState>((set, get) => ({
  cadetName: 'Cadet Explorer',
  activeTab: 'explorer',
  xp: 50,
  unlockedBadges: [],
  inspectedPlanets: ['earth'],
  scannedHotspots: [],
  completedStories: [],
  completedGuides: [],
  isWalkthroughOpen: false,
  walkthroughStepIndex: 0,
  isGlossaryOpen: false,
  isProfileModalOpen: false,
  recentToast: null,

  setCadetName: (name: string) => set({ cadetName: name }),

  setActiveTab: (tab: AcademyTab) => {
    soundFX.playClick();
    set({ activeTab: tab });
  },

  addXp: (amount: number, reason?: string) => {
    set((state) => ({
      xp: state.xp + amount,
      recentToast: reason
        ? {
            title: `+${amount} Space XP Earned!`,
            subtitle: reason,
            icon: '✨',
          }
        : state.recentToast,
    }));
  },

  unlockBadge: (badgeId: string) => {
    const state = get();
    if (state.unlockedBadges.includes(badgeId)) return;

    const badge = ACADEMY_BADGES.find((b) => b.id === badgeId);
    if (!badge) return;

    soundFX.playSuccessChime();
    triggerCelebrationConfetti();

    set({
      unlockedBadges: [...state.unlockedBadges, badgeId],
      xp: state.xp + badge.xpValue,
      recentToast: {
        title: `Badge Unlocked: ${badge.title}`,
        subtitle: `+${badge.xpValue} XP // ${badge.description}`,
        icon: badge.icon,
      },
    });
  },

  markPlanetInspected: (planetId: string) => {
    const state = get();
    if (state.inspectedPlanets.includes(planetId)) return;
    const updated = [...state.inspectedPlanets, planetId];
    set({ inspectedPlanets: updated, xp: state.xp + 20 });

    if (updated.length >= 3) {
      get().unlockBadge('badge-planetary-scout');
    }
  },

  markHotspotScanned: (hotspotId: string) => {
    const state = get();
    if (state.scannedHotspots.includes(hotspotId)) return;
    soundFX.playScanPing();
    const updated = [...state.scannedHotspots, hotspotId];
    set({
      scannedHotspots: updated,
      xp: state.xp + 30,
      recentToast: {
        title: '+30 XP // Subsystem Analyzed',
        subtitle: 'Spacecraft forensic data added to your logbook.',
        icon: '🔍',
      },
    });

    if (updated.length >= 3) {
      get().unlockBadge('badge-spacecraft-engineer');
    }
  },

  markStoryCompleted: (storyId: string, badgeId: string) => {
    const state = get();
    if (!state.completedStories.includes(storyId)) {
      set({ completedStories: [...state.completedStories, storyId] });
    }
    get().unlockBadge(badgeId);
  },

  markGuideCompleted: (guideId: string, badgeId: string) => {
    const state = get();
    if (!state.completedGuides.includes(guideId)) {
      set({ completedGuides: [...state.completedGuides, guideId] });
    }
    get().unlockBadge(badgeId);
  },

  openWalkthrough: (stepIndex = 0) => {
    soundFX.playClick();
    set({ isWalkthroughOpen: true, walkthroughStepIndex: stepIndex });
  },

  closeWalkthrough: () => {
    soundFX.playClick();
    set({ isWalkthroughOpen: false });
    get().unlockBadge('badge-orientation');
  },

  nextWalkthroughStep: (totalSteps: number) => {
    soundFX.playClick();
    const current = get().walkthroughStepIndex;
    if (current + 1 >= totalSteps) {
      get().closeWalkthrough();
    } else {
      set({ walkthroughStepIndex: current + 1 });
    }
  },

  prevWalkthroughStep: () => {
    soundFX.playClick();
    const current = get().walkthroughStepIndex;
    if (current > 0) {
      set({ walkthroughStepIndex: current - 1 });
    }
  },

  setGlossaryOpen: (open: boolean) => {
    soundFX.playClick();
    set({ isGlossaryOpen: open });
  },

  setProfileModalOpen: (open: boolean) => {
    soundFX.playClick();
    set({ isProfileModalOpen: open });
  },

  clearToast: () => set({ recentToast: null }),
}));
