import { create } from 'zustand';

/**
 * 连击状态 Store
 * 
 * 职责：
 * - 维护 currentCombo（当前连击数）和 maxCombo（最大连击）  
 * - 3s 空闲超时自动中断连击
 * - 课程切换/页面卸载时清理定时器
 */

const COMBO_IDLE_TIMEOUT_MS = 3000;
let comboTimeoutId: ReturnType<typeof setTimeout> | null = null;

function clearComboTimer() {
  if (comboTimeoutId !== null) {
    clearTimeout(comboTimeoutId);
    comboTimeoutId = null;
  }
}

function startComboTimer(onTimeout: () => void) {
  clearComboTimer();
  comboTimeoutId = setTimeout(onTimeout, COMBO_IDLE_TIMEOUT_MS);
}

interface ComboState {
  currentCombo: number;
  maxCombo: number;
}

interface ComboActions {
  incrementCombo: () => void;
  resetCombo: () => void;
  resetAllCombo: () => void;
}

type ComboStore = ComboState & ComboActions;

export const useComboStore = create<ComboStore>((set, get) => ({
  currentCombo: 0,
  maxCombo: 0,

  incrementCombo: () => {
    const { maxCombo } = get();
    const next = get().currentCombo + 1;
    set({
      currentCombo: next,
      maxCombo: Math.max(maxCombo, next),
    });
    startComboTimer(() => {
      if (get().currentCombo > 0) {
        set({ currentCombo: 0 });
      }
    });
  },

  resetCombo: () => {
    clearComboTimer();
    set({ currentCombo: 0 });
  },

  resetAllCombo: () => {
    clearComboTimer();
    set({ currentCombo: 0, maxCombo: 0 });
  },
}));
