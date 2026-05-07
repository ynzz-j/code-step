import type { StepStats } from '@/types';

class StatsService {
  async recordStepAttempt(stats: StepStats): Promise<void> {
    // TODO: 后续替换为 Tauri invoke
    // return await invoke('record_step_stats', { stats });
    console.log('recordStepAttempt', stats);
  }

  calculateWPM(correctChars: number, elapsedMs: number): number {
    const minutes = elapsedMs / 60000;
    if (minutes === 0) return 0;
    return Math.round((correctChars / 5) / minutes);
  }

  calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 100;
    return Math.round((correct / total) * 100);
  }
}

export const statsService = new StatsService();
