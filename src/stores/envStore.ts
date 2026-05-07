import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { EnvCheckResult } from '@/types';

interface EnvStore {
  /** 各语言环境状态 */
  envStatus: Record<string, EnvCheckResult>;
  isChecking: Record<string, boolean>;

  checkEnv: (language: string) => Promise<EnvCheckResult>;
  clearCache: (language: string) => void;
  getEnv: (language: string) => EnvCheckResult | undefined;
}

export const useEnvStore = create<EnvStore>((set, get) => ({
  envStatus: {},
  isChecking: {},

  checkEnv: async (language: string) => {
    const lang = language.toLowerCase();

    // 已经在检测中，直接返回当前状态
    if (get().isChecking[lang]) {
      return get().envStatus[lang] ?? {
        language: lang,
        available: false,
        version: null,
        runtime_path: null,
        error_message: '检测中...',
        checked_at: new Date().toISOString(),
      };
    }

    set((state) => ({
      isChecking: { ...state.isChecking, [lang]: true },
    }));

    try {
      const result = (await invoke('check_env', { language: lang })) as EnvCheckResult;
      set((state) => ({
        envStatus: { ...state.envStatus, [lang]: result },
        isChecking: { ...state.isChecking, [lang]: false },
      }));
      return result;
    } catch (err) {
      const errorResult: EnvCheckResult = {
        language: lang,
        available: false,
        version: null,
        runtime_path: null,
        error_message: String(err),
        checked_at: new Date().toISOString(),
      };
      set((state) => ({
        envStatus: { ...state.envStatus, [lang]: errorResult },
        isChecking: { ...state.isChecking, [lang]: false },
      }));
      return errorResult;
    }
  },

  clearCache: (language: string) => {
    const lang = language.toLowerCase();
    set((state) => {
      const { [lang]: _, ...rest } = state.envStatus;
      return { envStatus: rest };
    });
  },

  getEnv: (language: string) => {
    return get().envStatus[language.toLowerCase()];
  },
}));
