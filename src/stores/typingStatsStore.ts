import { create } from 'zustand';
import type { TypingStats } from '@/types';

interface TypingStatsState {
  typingStats: TypingStats;
  typingStartTime: number | null;
}

interface TypingStatsActions {
  recordTypingKeystroke: (isCorrect: boolean) => void;
  resetTypingStats: () => void;
}

type TypingStatsStore = TypingStatsState & TypingStatsActions;

export const useTypingStatsStore = create<TypingStatsStore>((set, get) => ({
  typingStats: { wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0, backspaces: 0 },
  typingStartTime: null,

  recordTypingKeystroke: (isCorrect: boolean) => {
    const { typingStats, typingStartTime } = get();
    const now = Date.now();
    const total = typingStats.totalKeystrokes + 1;
    const correct = isCorrect ? typingStats.correctKeystrokes + 1 : typingStats.correctKeystrokes;
    const errors = isCorrect ? typingStats.errors : typingStats.errors + 1;
    const startTime = typingStartTime || now;
    const elapsedMin = (now - startTime) / 60000;
    const wpm = elapsedMin > 0 ? Math.round((correct / 5) / elapsedMin) : 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

    set({
      typingStats: { wpm, accuracy, errors, totalKeystrokes: total, correctKeystrokes: correct, backspaces: typingStats.backspaces },
      typingStartTime: startTime,
    });
  },

  resetTypingStats: () =>
    set({
      typingStats: { wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0, backspaces: 0 },
      typingStartTime: Date.now(),
    }),
}));
