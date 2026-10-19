import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  // Persisted answer logs: they stop XP from being farmed by re-answering
  answeredChoices: string[];
  answeredQuizKeys: string[];
  answeredTriviaKeys: string[];
  hasSeenTour: boolean;
  firstLight: 'unseen' | 'in-progress' | 'complete';
  isWalkthroughOpen: boolean;
  walkthroughStepIndex: number;
  isGlossaryOpen: boolean;
  isProfileModalOpen: boolean;
  recentToast: { title: string; subtitle: string; icon: string } | null;

  // Actions
  setCadetName: (name: string) => void;
  setFirstLight: (status: 'unseen' | 'in-progress' | 'complete') => void;
  setActiveTab: (tab: AcademyTab) => void;
  addXp: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  markPlanetInspected: (planetId: string, planetName?: string) => void;
  markHotspotScanned: (hotspotId: string) => void;
  markStoryCompleted: (storyId: string, badgeId: string) => void;
  markGuideCompleted: (guideId: string, badgeId: string) => void;
  /** Returns true the first time a story choice is answered (and awards XP). */
  recordChoice: (choiceKey: string, xp: number, reason: string) => boolean;
  /** Returns true the first time a quiz question is answered correctly. */
  recordQuizCorrect: (quizKey: string, xp: number, reason: string) => boolean;
  /** Returns true the first time a trivia question is answered correctly. */
  recordTriviaCorrect: (triviaKey: string, xp: number, reason: string) => boolean;
  openWalkthrough: (stepIndex?: number) => void;
  closeWalkthrough: () => void;
  completeWalkthrough: () => void;
  nextWalkthroughStep: (totalSteps: number) => void;
  prevWalkthroughStep: () => void;
  setGlossaryOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
  clearToast: () => void;
  resetProgress: () => void;
}

const INITIAL_PROGRESS = {
  cadetName: 'Cadet Explorer',
  xp: 50,
  unlockedBadges: [] as string[],
  inspectedPlanets: ['earth'],
  scannedHotspots: [] as string[],
  completedStories: [] as string[],
  completedGuides: [] as string[],
  answeredChoices: [] as string[],
  answeredQuizKeys: [] as string[],
  answeredTriviaKeys: [] as string[],
  hasSeenTour: false,
  firstLight: 'unseen' as const,
};

export const useAcademyStore = create<AcademyStoreState>()(
  persist(
    (set, get) => ({
      ...INITIAL_PROGRESS,
      activeTab: 'explorer',
      isWalkthroughOpen: false,
      walkthroughStepIndex: 0,
      isGlossaryOpen: false,
      isProfileModalOpen: false,
      recentToast: null,

      setCadetName: (name: string) => set({ cadetName: name }),

      setFirstLight: (status) => set({ firstLight: status }),

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

      markPlanetInspected: (planetId: string, planetName?: string) => {
        const state = get();
        if (state.inspectedPlanets.includes(planetId)) return;
        const updated = [...state.inspectedPlanets, planetId];
        set({
          inspectedPlanets: updated,
          xp: state.xp + 20,
          recentToast: {
            title: '+20 Space XP // World Surveyed',
            subtitle: planetName ? `${planetName} added to your logbook.` : 'Added to your logbook.',
            icon: '🪐',
          },
        });

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

      recordChoice: (choiceKey, xp, reason) => {
        const state = get();
        if (state.answeredChoices.includes(choiceKey)) return false;
        set({
          answeredChoices: [...state.answeredChoices, choiceKey],
          xp: state.xp + xp,
          recentToast: { title: `+${xp} Space XP Earned!`, subtitle: reason, icon: '✨' },
        });
        return true;
      },

      recordQuizCorrect: (quizKey, xp, reason) => {
        const state = get();
        if (state.answeredQuizKeys.includes(quizKey)) return false;
        set({
          answeredQuizKeys: [...state.answeredQuizKeys, quizKey],
          xp: state.xp + xp,
          recentToast: { title: `+${xp} Space XP Earned!`, subtitle: reason, icon: '✨' },
        });
        return true;
      },

      recordTriviaCorrect: (triviaKey, xp, reason) => {
        const state = get();
        if (state.answeredTriviaKeys.includes(triviaKey)) return false;
        set({
          answeredTriviaKeys: [...state.answeredTriviaKeys, triviaKey],
          xp: state.xp + xp,
          recentToast: { title: `+${xp} Space XP Earned!`, subtitle: reason, icon: '✨' },
        });
        return true;
      },

      openWalkthrough: (stepIndex = 0) => {
        soundFX.playClick();
        set({ isWalkthroughOpen: true, walkthroughStepIndex: stepIndex });
      },

      // Dismissing the tour is not the same as finishing it: no badge for skipping.
      closeWalkthrough: () => {
        soundFX.playClick();
        set({ isWalkthroughOpen: false, hasSeenTour: true });
      },

      completeWalkthrough: () => {
        soundFX.playClick();
        set({ isWalkthroughOpen: false, hasSeenTour: true });
        get().unlockBadge('badge-orientation');
      },

      nextWalkthroughStep: (totalSteps: number) => {
        soundFX.playClick();
        const current = get().walkthroughStepIndex;
        if (current + 1 >= totalSteps) {
          get().completeWalkthrough();
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

      resetProgress: () => {
        set({
          ...INITIAL_PROGRESS,
          hasSeenTour: true,
          recentToast: { title: 'Fresh start', subtitle: 'Cadet progress reset.', icon: '🌱' },
        });
      },
    }),
    {
      name: 'cosmosis-academy-v1',
      partialize: (state) => ({
        cadetName: state.cadetName,
        xp: state.xp,
        unlockedBadges: state.unlockedBadges,
        inspectedPlanets: state.inspectedPlanets,
        scannedHotspots: state.scannedHotspots,
        completedStories: state.completedStories,
        completedGuides: state.completedGuides,
        answeredChoices: state.answeredChoices,
        answeredQuizKeys: state.answeredQuizKeys,
        answeredTriviaKeys: state.answeredTriviaKeys,
        hasSeenTour: state.hasSeenTour,
        firstLight: state.firstLight,
      }),
    }
  )
);
