import { invoke } from '@tauri-apps/api/core';
import type { ChallengeRunPayload, ChallengeRunResult } from '@/types';

class ChallengeService {
  async recordRun(payload: ChallengeRunPayload): Promise<ChallengeRunResult | null> {
    try {
      return await invoke<ChallengeRunResult>('record_challenge_run', { payload });
    } catch (error) {
      console.error('[ChallengeService] Failed to record run:', error);
      return null;
    }
  }

  async getLeaderboard(packId: string, challengeMode: string, limit = 10): Promise<ChallengeRunResult[]> {
    try {
      return await invoke<ChallengeRunResult[]>('get_challenge_leaderboard', { packId, challengeMode, limit });
    } catch (error) {
      console.error('[ChallengeService] Failed to get leaderboard:', error);
      return [];
    }
  }

  async getRun(runId: number): Promise<ChallengeRunResult | null> {
    try {
      return await invoke<ChallengeRunResult | null>('get_challenge_run', { runId });
    } catch (error) {
      console.error('[ChallengeService] Failed to get run:', error);
      return null;
    }
  }

  async getBest(packId: string, challengeMode: string): Promise<ChallengeRunResult | null> {
    try {
      return await invoke<ChallengeRunResult | null>('get_challenge_best', { packId, challengeMode });
    } catch (error) {
      console.error('[ChallengeService] Failed to get best:', error);
      return null;
    }
  }

  async getRecentRuns(limit = 10): Promise<ChallengeRunResult[]> {
    try {
      return await invoke<ChallengeRunResult[]>('get_recent_challenge_runs', { limit });
    } catch (error) {
      console.error('[ChallengeService] Failed to get recent runs:', error);
      return [];
    }
  }
}

export const challengeService = new ChallengeService();
