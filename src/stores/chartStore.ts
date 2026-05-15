import { create } from 'zustand';

interface ChartState {
  wpmHistory: number[];
  accuracyHistory: number[];
  /** 追加一个 WPM 数据点（最多保留 40 个） */
  pushWpm: (wpm: number) => void;
  /** 追加一个准确率数据点（最多保留 40 个） */
  pushAccuracy: (accuracy: number) => void;
  /** 重置图表数据（切换步骤时调用） */
  resetChart: () => void;
}

const MAX_POINTS = 40;

export const useChartStore = create<ChartState>((set, get) => ({
  wpmHistory: [],
  accuracyHistory: [],

  pushWpm: (wpm) => {
    const arr = [...get().wpmHistory, Math.min(wpm, 130)];
    if (arr.length > MAX_POINTS) arr.shift();
    set({ wpmHistory: arr });
  },

  pushAccuracy: (accuracy) => {
    const arr = [...get().accuracyHistory, Math.min(accuracy, 100)];
    if (arr.length > MAX_POINTS) arr.shift();
    set({ accuracyHistory: arr });
  },

  resetChart: () => set({ wpmHistory: [], accuracyHistory: [] }),
}));
