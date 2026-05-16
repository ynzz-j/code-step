import { create } from 'zustand';
import type { GrowthSummary, TrainingPackGrowth } from '@/types';
import { growthService } from '@/services/growthService';

interface GrowthStore {
  summary: GrowthSummary | null;
  packGrowth: Record<string, TrainingPackGrowth>;
  isLoading: boolean;

  refreshSummary: () => Promise<void>;
  refreshPackGrowth: (packId: string) => Promise<void>;
  refreshMultiplePackGrowth: (packIds: string[]) => Promise<void>;
}

export const useGrowthStore = create<GrowthStore>((set) => ({
  summary: null,
  packGrowth: {},
  isLoading: false,

  refreshSummary: async () => {
    set({ isLoading: true });
    const summary = await growthService.getGrowthSummary();
    set({ summary, isLoading: false });
  },

  refreshPackGrowth: async (packId: string) => {
    const growth = await growthService.getTrainingPackGrowth(packId);
    if (growth) {
      set((state) => ({
        packGrowth: { ...state.packGrowth, [packId]: growth },
      }));
    }
  },

  refreshMultiplePackGrowth: async (packIds: string[]) => {
    const results = await Promise.all(
      packIds.map((id) => growthService.getTrainingPackGrowth(id)),
    );
    const newPackGrowth: Record<string, TrainingPackGrowth> = {};
    for (let i = 0; i < packIds.length; i++) {
      if (results[i]) {
        newPackGrowth[packIds[i]] = results[i]!;
      }
    }
    set((state) => ({
      packGrowth: { ...state.packGrowth, ...newPackGrowth },
    }));
  },
}));
