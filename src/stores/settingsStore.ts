import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@/types';

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 14,
  tabSize: 4,
  autoValidate: true,
  autoValidateDelay: 500,
  focusModeShortcut: 'f',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'codestep-settings',
    },
  ),
);
