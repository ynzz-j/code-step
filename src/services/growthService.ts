import { invoke } from '@tauri-apps/api/core';
import type { TypingAttemptPayload, GrowthSummary, TrainingPackGrowth, PatternMastery, WeakTokenStat } from '@/types';

class GrowthService {
  async recordTypingAttempt(payload: TypingAttemptPayload): Promise<void> {
    try {
      await invoke('record_typing_attempt', { payload });
    } catch (error) {
      console.error('[GrowthService] Failed to record typing attempt:', error);
    }
  }

  async getGrowthSummary(): Promise<GrowthSummary | null> {
    try {
      return await invoke<GrowthSummary>('get_growth_summary');
    } catch (error) {
      console.error('[GrowthService] Failed to get growth summary:', error);
      return null;
    }
  }

  async getTrainingPackGrowth(packId: string): Promise<TrainingPackGrowth | null> {
    try {
      return await invoke<TrainingPackGrowth>('get_training_pack_growth', { packId });
    } catch (error) {
      console.error('[GrowthService] Failed to get training pack growth:', error);
      return null;
    }
  }

  async getTrainingPackPatternMastery(packId: string): Promise<PatternMastery[]> {
    try {
      return await invoke<PatternMastery[]>('get_training_pack_pattern_mastery', { packId });
    } catch (error) {
      console.error('[GrowthService] Failed to get training pack pattern mastery:', error);
      return [];
    }
  }

  async getWeakTokenStats(): Promise<WeakTokenStat[]> {
    try {
      return await invoke<WeakTokenStat[]>('get_weak_token_stats');
    } catch (error) {
      console.error('[GrowthService] Failed to get weak token stats:', error);
      return [];
    }
  }

  async importLegacyGrowthData(): Promise<void> {
    try {
      const packStats = localStorage.getItem('codestep-training-pack-stats') || '{}';
      const userStats = localStorage.getItem('codestep-user') || '{}';
      await invoke('import_legacy_growth_data', {
        packStatsJson: packStats,
        userStatsJson: userStats,
      });
      console.log('[GrowthService] Legacy data imported');
    } catch (error) {
      console.error('[GrowthService] Failed to import legacy data:', error);
    }
  }
}

export const growthService = new GrowthService();
