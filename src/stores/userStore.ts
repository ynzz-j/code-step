import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StepStats, Achievement } from '@/types';

interface UserStore {
  userId: string;
  displayName: string;
  totalLearningTime: number;
  completedCourses: string[];
  stepStats: StepStats[];
  achievements: Achievement[];

  updateStats: (stats: Partial<StepStats>) => void;
  addCompletedCourse: (courseId: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  setDisplayName: (name: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: crypto.randomUUID(),
      displayName: '学习者',
      totalLearningTime: 0,
      completedCourses: [],
      stepStats: [],
      achievements: [],

      updateStats: (stats) =>
        set((state) => ({
          stepStats: [...state.stepStats, stats as StepStats],
        })),

      addCompletedCourse: (courseId) =>
        set((state) => ({
          completedCourses: [...state.completedCourses, courseId],
        })),

      unlockAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, achievement],
        })),

      setDisplayName: (name) => set({ displayName: name }),
    }),
    {
      name: 'codestep-user',
    },
  ),
);
