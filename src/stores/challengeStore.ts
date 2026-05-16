import { create } from 'zustand';
import type { ChallengeMode, ChallengeRunResult } from '@/types';
import { challengeService } from '@/services/challengeService';

interface ChallengeStore {
  currentMode: ChallengeMode | null;
  activeRunTimer: number | null;
  latestResult: ChallengeRunResult | null;
  leaderboardCache: Record<string, ChallengeRunResult[]>;
  bestCache: Record<string, ChallengeRunResult | null>;

  setMode: (mode: ChallengeMode | null) => void;
  setTimer: (startTime: number | null) => void;
  setLatestResult: (result: ChallengeRunResult | null) => void;

  refreshLeaderboard: (packId: string, challengeMode: ChallengeMode) => Promise<void>;
  refreshBest: (packId: string, challengeMode: ChallengeMode) => Promise<void>;
  clearChallenge: () => void;
}

function cacheKey(packId: string, mode: string) {
  return `${packId}::${mode}`;
}

export const useChallengeStore = create<ChallengeStore>((set) => ({
  currentMode: null,
  activeRunTimer: null,
  latestResult: null,
  leaderboardCache: {},
  bestCache: {},

  setMode: (mode) => set({ currentMode: mode }),

  setTimer: (startTime) => set({ activeRunTimer: startTime }),

  setLatestResult: (result) => set({ latestResult: result }),

  refreshLeaderboard: async (packId, challengeMode) => {
    const key = cacheKey(packId, challengeMode);
    const results = await challengeService.getLeaderboard(packId, challengeMode, 10);
    set((state) => ({
      leaderboardCache: { ...state.leaderboardCache, [key]: results },
    }));
  },

  refreshBest: async (packId, challengeMode) => {
    const key = cacheKey(packId, challengeMode);
    const best = await challengeService.getBest(packId, challengeMode);
    set((state) => ({
      bestCache: { ...state.bestCache, [key]: best },
    }));
  },

  clearChallenge: () =>
    set({
      currentMode: null,
      activeRunTimer: null,
      latestResult: null,
    }),
}));
