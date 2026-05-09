/**
 * courseStore — 兼容层
 *
 * @deprecated 此 store 已拆分为 4 个独立 store：
 *   - useCourseCatalogStore  (课程加载/筛选)
 *   - useCourseSessionStore  (学习会话/进度)
 *   - useTypingStatsStore    (打字统计)
 *   - useComboStore          (连击状态)
 *
 * 此兼容层将所有子 store 的状态合并为旧接口。
 * 新代码请直接使用对应的新 store。
 */

import { create } from 'zustand';
import type { Course, CourseMetadata, Step, TypingStats, CourseCategory, Difficulty } from '@/types';
import { type CourseMode } from '@/services/courseService';
import { useCourseCatalogStore } from './courseCatalogStore';
import { useCourseSessionStore } from './courseSessionStore';
import { useTypingStatsStore } from './typingStatsStore';
import { useComboStore } from './comboStore';

interface CourseProgressInfo {
  completedSteps: number[];
  currentStep: number;
}

interface ComboState {
  currentCombo: number;
  maxCombo: number;
}

interface CourseStore {
  courses: CourseMetadata[];
  filteredCourses: CourseMetadata[];
  selectedCategory: CourseCategory | 'all';
  selectedLanguage: string | 'all';
  selectedDifficulty: Difficulty | 'all';
  currentCourse: Course | null;
  currentStepIndex: number;
  currentStepCompleted: boolean;
  completedSteps: Set<number>;
  typingStats: TypingStats;
  typingStartTime: number | null;
  courseStartTime: number | null;
  isLoading: boolean;
  error: string | null;
  courseProgress: Record<string, CourseProgressInfo>;
  combo: ComboState;

  loadCourses: (mode?: CourseMode) => Promise<void>;
  startCourse: (courseId: string, mode?: CourseMode) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (index: number) => void;
  resetProgress: () => void;
  getCurrentStep: () => Step | null;
  markStepCompleted: () => void;
  recordTypingKeystroke: (isCorrect: boolean) => void;
  resetTypingStats: () => void;
  setCategory: (category: CourseCategory | 'all') => void;
  setLanguage: (lang: string | 'all') => void;
  setDifficulty: (difficulty: Difficulty | 'all') => void;
  getCourseProgress: (courseId: string) => CourseProgressInfo | null;
  incrementCombo: () => void;
  resetCombo: () => void;
  getMaxCombo: () => number;
  resetAllCombo: () => void;
}

export const useCourseStore = create<CourseStore>((set, _get) => {
  // Subscriptions: propagate changes from substores to this legacy store
  useCourseCatalogStore.subscribe((c) => {
    const { selectedCategory, selectedLanguage, selectedDifficulty, courses } = c;
    const filtered = courses.filter((co) => {
      const matchCat = selectedCategory === 'all' || co.category === selectedCategory;
      const matchLang = selectedLanguage === 'all' || co.language === selectedLanguage;
      const matchDiff = selectedDifficulty === 'all' || co.difficulty === selectedDifficulty;
      return matchCat && matchLang && matchDiff;
    });
    set({
      courses: c.courses,
      selectedCategory: c.selectedCategory,
      selectedLanguage: c.selectedLanguage,
      selectedDifficulty: c.selectedDifficulty,
      isLoading: c.isLoading,
      error: c.error,
      filteredCourses: filtered,
    });
  });

  useCourseSessionStore.subscribe((s) => {
    set({
      currentCourse: s.currentCourse,
      currentStepIndex: s.currentStepIndex,
      currentStepCompleted: s.completedSteps.has(s.currentStepIndex),
      completedSteps: s.completedSteps,
      courseProgress: s.courseProgress,
      courseStartTime: s.courseStartTime,
    });
  });

  useTypingStatsStore.subscribe((t) => {
    set({
      typingStats: t.typingStats,
      typingStartTime: t.typingStartTime,
    });
  });

  useComboStore.subscribe((cmb) => {
    set({ combo: { currentCombo: cmb.currentCombo, maxCombo: cmb.maxCombo } });
  });

  const catalogDefaults = useCourseCatalogStore.getState();
  const sessionDefaults = useCourseSessionStore.getState();
  const typingDefaults = useTypingStatsStore.getState();
  const comboDefaults = useComboStore.getState();

  return {
    courses: catalogDefaults.courses,
    filteredCourses: [],
    selectedCategory: catalogDefaults.selectedCategory,
    selectedLanguage: catalogDefaults.selectedLanguage,
    selectedDifficulty: catalogDefaults.selectedDifficulty,
    currentCourse: sessionDefaults.currentCourse,
    currentStepIndex: sessionDefaults.currentStepIndex,
    currentStepCompleted: sessionDefaults.completedSteps.has(sessionDefaults.currentStepIndex),
    completedSteps: sessionDefaults.completedSteps,
    typingStats: typingDefaults.typingStats,
    typingStartTime: typingDefaults.typingStartTime,
    courseStartTime: sessionDefaults.courseStartTime,
    isLoading: catalogDefaults.isLoading,
    error: catalogDefaults.error,
    courseProgress: sessionDefaults.courseProgress,
    combo: { currentCombo: comboDefaults.currentCombo, maxCombo: comboDefaults.maxCombo },

    // Actions delegate to substores
    loadCourses: (mode) => useCourseCatalogStore.getState().loadCourses(mode),
    startCourse: (courseId, mode) => useCourseSessionStore.getState().startCourse(courseId, mode),
    nextStep: () => useCourseSessionStore.getState().nextStep(),
    prevStep: () => useCourseSessionStore.getState().prevStep(),
    completeStep: (index) => {
      const session = useCourseSessionStore.getState();
      const newCompleted = new Set(session.completedSteps);
      newCompleted.add(index);
      useCourseSessionStore.setState({ completedSteps: newCompleted });
    },
    resetProgress: () => useCourseSessionStore.getState().resetProgress(),
    getCurrentStep: () => useCourseSessionStore.getState().getCurrentStep(),
    markStepCompleted: () => useCourseSessionStore.getState().markStepCompleted(),
    recordTypingKeystroke: (isCorrect) => {
      useTypingStatsStore.getState().recordTypingKeystroke(isCorrect);
      if (isCorrect) {
        useComboStore.getState().incrementCombo();
      } else {
        useComboStore.getState().resetCombo();
      }
    },
    resetTypingStats: () => useTypingStatsStore.getState().resetTypingStats(),
    setCategory: (category) => useCourseCatalogStore.getState().setCategory(category),
    setLanguage: (lang) => useCourseCatalogStore.getState().setLanguage(lang),
    setDifficulty: (difficulty) => useCourseCatalogStore.getState().setDifficulty(difficulty),
    getCourseProgress: (courseId) => useCourseSessionStore.getState().getCourseProgress(courseId),
    incrementCombo: () => useComboStore.getState().incrementCombo(),
    resetCombo: () => useComboStore.getState().resetCombo(),
    getMaxCombo: () => useComboStore.getState().maxCombo,
    resetAllCombo: () => useComboStore.getState().resetAllCombo(),
  };
});
