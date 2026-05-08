import { create } from 'zustand';
import type { Course, CourseMetadata, Step, TypingStats, CourseCategory, Difficulty } from '@/types';
import { courseService } from '@/services/courseService';

// 连击空闲超时（3s 无输入视为中断）
const COMBO_IDLE_TIMEOUT_MS = 3000;
let comboTimeoutId: ReturnType<typeof setTimeout> | null = null;

function clearComboTimeout() {
  if (comboTimeoutId !== null) {
    clearTimeout(comboTimeoutId);
    comboTimeoutId = null;
  }
}

function startComboTimeout(onTimeout: () => void) {
  clearComboTimeout();
  comboTimeoutId = setTimeout(onTimeout, COMBO_IDLE_TIMEOUT_MS);
}

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
  // 课程进度映射
  courseProgress: Record<string, CourseProgressInfo>;
  // 连击状态
  combo: ComboState;

  loadCourses: () => Promise<void>;
  startCourse: (courseId: string) => Promise<void>;
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
  // 连击 actions
  incrementCombo: () => void;
  resetCombo: () => void;
  getMaxCombo: () => number;
  resetAllCombo: () => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  filteredCourses: [],
  selectedCategory: 'all',
  selectedLanguage: 'all',
  selectedDifficulty: 'all',
  currentCourse: null,
  currentStepIndex: 0,
  currentStepCompleted: false,
  completedSteps: new Set(),
  typingStats: { wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0 },
  typingStartTime: null,
  courseStartTime: null,
  isLoading: false,
  error: null,
  courseProgress: {},
  combo: { currentCombo: 0, maxCombo: 0 },

  loadCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const courses = await courseService.getCourses();
      set({ courses, isLoading: false });
      // 初始筛选
      get().setCategory(get().selectedCategory);
    } catch (error) {
      console.error('Failed to load courses:', error);
      set({ error: '加载课程列表失败', isLoading: false });
    }
  },

  setCategory: (category) => {
    const { courses, selectedLanguage, selectedDifficulty } = get();
    const filtered = courses.filter((c) => {
      const matchCategory = category === 'all' || c.category === category;
      const matchLang = selectedLanguage === 'all' || c.language === selectedLanguage;
      const matchDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
      return matchCategory && matchLang && matchDiff;
    });
    set({ selectedCategory: category, filteredCourses: filtered });
  },

  setLanguage: (lang) => {
    const { courses, selectedCategory, selectedDifficulty } = get();
    const filtered = courses.filter((c) => {
      const matchCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchLang = lang === 'all' || c.language === lang;
      const matchDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
      return matchCategory && matchLang && matchDiff;
    });
    set({ selectedLanguage: lang, filteredCourses: filtered });
  },

  setDifficulty: (difficulty) => {
    const { courses, selectedCategory, selectedLanguage } = get();
    const filtered = courses.filter((c) => {
      const matchCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchLang = selectedLanguage === 'all' || c.language === selectedLanguage;
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      return matchCategory && matchLang && matchDiff;
    });
    set({ selectedDifficulty: difficulty, filteredCourses: filtered });
  },

  startCourse: async (courseId: string) => {
    console.log('startCourse called with:', courseId);
    clearComboTimeout();
    set({ isLoading: true, error: null });
    try {
      const course = await courseService.getCourse(courseId);
      console.log('Course loaded:', course.title, 'steps:', course.steps.length);
      // 先尝试从数据库获取已有进度
      const dbProgress = await courseService.getProgress(courseId);
      const existingProgress = dbProgress
        ? { currentStep: dbProgress.currentStep, completedSteps: new Set(dbProgress.completedSteps) }
        : { currentStep: 0, completedSteps: new Set<number>() };

      set({
        currentCourse: course,
        currentStepIndex: existingProgress.currentStep,
        currentStepCompleted: existingProgress.completedSteps.has(existingProgress.currentStep),
        completedSteps: existingProgress.completedSteps,
        typingStats: { wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0 },
        typingStartTime: Date.now(),
        courseStartTime: Date.now(),
        isLoading: false,
        combo: { currentCombo: 0, maxCombo: 0 },
      });
    } catch (error) {
      console.error('Failed to load course:', error);
      set({ error: `加载课程失败: ${error}`, isLoading: false });
    }
  },

  nextStep: () => {
    const { currentCourse, currentStepIndex, currentStepCompleted, courseProgress, courseStartTime } = get();
    if (!currentCourse) return;
    if (!currentStepCompleted) return;
    if (currentCourse && currentStepIndex < currentCourse.steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      // 更新 courseProgress
      const progressKey = currentCourse.id;
      const newCourseProgress = {
        ...courseProgress,
        [progressKey]: {
          ...courseProgress[progressKey],
          currentStep: newIndex,
        },
      };
      set({ currentStepIndex: newIndex, currentStepCompleted: false, courseProgress: newCourseProgress });

      // 异步保存到数据库
      const timeSpent = courseStartTime ? Math.floor((Date.now() - courseStartTime) / 1000) : 0;
      const completedSteps = Array.from(get().completedSteps);
      courseService.saveProgress(currentCourse.id, currentStepIndex, completedSteps, timeSpent);
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  completeStep: (index: number) => {
    const { completedSteps } = get();
    const newCompleted = new Set(completedSteps);
    newCompleted.add(index);
    set({ completedSteps: newCompleted });
  },

  markStepCompleted: () => {
    const { currentCourse, currentStepIndex, completedSteps, courseProgress, courseStartTime } = get();
    if (!currentCourse) return;

    // 更新 completedSteps Set
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStepIndex);

    // 更新 courseProgress
    const progressKey = currentCourse.id;
    const newCourseProgress = {
      ...courseProgress,
      [progressKey]: {
        completedSteps: Array.from(newCompleted),
        currentStep: currentStepIndex,
      },
    };

    // 计算学习时间（秒）
    const timeSpent = courseStartTime ? Math.floor((Date.now() - courseStartTime) / 1000) : 0;

    set({ currentStepCompleted: true, completedSteps: newCompleted, courseProgress: newCourseProgress });

    // 异步保存到数据库
    courseService.saveProgress(currentCourse.id, currentStepIndex, Array.from(newCompleted), timeSpent);
  },

  recordTypingKeystroke: (isCorrect: boolean) => {
    const { typingStats, typingStartTime, combo } = get();
    const now = Date.now();
    const total = typingStats.totalKeystrokes + 1;
    const correct = isCorrect ? typingStats.correctKeystrokes + 1 : typingStats.correctKeystrokes;
    const errors = isCorrect ? typingStats.errors : typingStats.errors + 1;
    const startTime = typingStartTime || now;
    const elapsedMin = (now - startTime) / 60000;
    const wpm = elapsedMin > 0 ? Math.round((correct / 5) / elapsedMin) : 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

    // 更新连击状态
    let newCombo: ComboState;
    if (isCorrect) {
      const nextCombo = combo.currentCombo + 1;
      newCombo = {
        currentCombo: nextCombo,
        maxCombo: Math.max(combo.maxCombo, nextCombo),
      };
      // 正确输入：重置 3s 空闲定时器
      startComboTimeout(() => {
        const current = get().combo;
        if (current.currentCombo > 0) {
          set({ combo: { currentCombo: 0, maxCombo: current.maxCombo } });
        }
      });
    } else {
      newCombo = {
        currentCombo: 0,
        maxCombo: combo.maxCombo,
      };
      // 错误输入：清除空闲定时器
      clearComboTimeout();
    }

    set({
      typingStats: { ...typingStats, totalKeystrokes: total, correctKeystrokes: correct, errors, wpm, accuracy },
      typingStartTime: startTime,
      combo: newCombo,
    });
  },

  resetTypingStats: () => set({
    typingStats: { wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0 },
    typingStartTime: Date.now(),
  }),

  resetProgress: () => {
    set({
      currentStepIndex: 0,
      currentStepCompleted: false,
      completedSteps: new Set(),
    });
  },

  getCurrentStep: () => {
    const { currentCourse, currentStepIndex } = get();
    if (currentCourse && currentCourse.steps[currentStepIndex]) {
      return currentCourse.steps[currentStepIndex];
    }
    return null;
  },

  getCourseProgress: (courseId: string) => {
    const { courseProgress } = get();
    return courseProgress[courseId] || null;
  },

  // 连击 actions
  incrementCombo: () => {
    const { combo } = get();
    const nextCombo = combo.currentCombo + 1;
    set({
      combo: {
        currentCombo: nextCombo,
        maxCombo: Math.max(combo.maxCombo, nextCombo),
      },
    });
  },

  resetCombo: () => {
    const { combo } = get();
    set({ combo: { currentCombo: 0, maxCombo: combo.maxCombo } });
  },

  getMaxCombo: () => {
    return get().combo.maxCombo;
  },

  resetAllCombo: () => {
    clearComboTimeout();
    set({ combo: { currentCombo: 0, maxCombo: 0 } });
  },
}));
