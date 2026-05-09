import { create } from 'zustand';
import type { Course, Step } from '@/types';
import { courseService, type CourseMode } from '@/services/courseService';

interface CourseProgressInfo {
  completedSteps: number[];
  currentStep: number;
}

interface CourseSessionState {
  currentCourse: Course | null;
  currentStepIndex: number;
  completedSteps: Set<number>;
  courseProgress: Record<string, CourseProgressInfo>;
  courseStartTime: number | null;
  isLoading: boolean;
  error: string | null;
}

interface CourseSessionActions {
  startCourse: (courseId: string, mode?: CourseMode) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  markStepCompleted: () => void;
  resetProgress: () => void;
  getCurrentStep: () => Step | null;
  getCourseProgress: (courseId: string) => CourseProgressInfo | null;
}

type CourseSessionStore = CourseSessionState & CourseSessionActions;

export const useCourseSessionStore = create<CourseSessionStore>((set, get) => ({
  currentCourse: null,
  currentStepIndex: 0,
  completedSteps: new Set(),
  courseProgress: {},
  courseStartTime: null,
  isLoading: false,
  error: null,

  startCourse: async (courseId, mode) => {
    set({ isLoading: true, error: null });
    try {
      const course = await courseService.getCourse(courseId, mode);
      const dbProgress = await courseService.getProgress(courseId);
      const existingProgress = dbProgress
        ? { currentStep: dbProgress.currentStep, completedSteps: new Set(dbProgress.completedSteps) }
        : { currentStep: 0, completedSteps: new Set<number>() };

      set({
        currentCourse: course,
        currentStepIndex: existingProgress.currentStep,
        completedSteps: existingProgress.completedSteps,
        courseStartTime: Date.now(),
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load course:', error);
      set({ error: `加载课程失败: ${error}`, isLoading: false });
    }
  },

  nextStep: () => {
    const { currentCourse, currentStepIndex, completedSteps, courseProgress, courseStartTime } = get();
    if (!currentCourse) return;
    if (!completedSteps.has(currentStepIndex)) return;
    if (currentStepIndex >= currentCourse.steps.length - 1) return;

    const newIndex = currentStepIndex + 1;
    const progressKey = currentCourse.id;
    const newCourseProgress = {
      ...courseProgress,
      [progressKey]: {
        ...courseProgress[progressKey],
        currentStep: newIndex,
      },
    };
    set({ currentStepIndex: newIndex, courseProgress: newCourseProgress });

    const timeSpent = courseStartTime ? Math.floor((Date.now() - courseStartTime) / 1000) : 0;
    const completedArr = Array.from(completedSteps);
    courseService.saveProgress(currentCourse.id, currentStepIndex, completedArr, timeSpent);
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  markStepCompleted: () => {
    const { currentCourse, currentStepIndex, completedSteps, courseProgress, courseStartTime } = get();
    if (!currentCourse) return;

    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStepIndex);

    const progressKey = currentCourse.id;
    const newCourseProgress = {
      ...courseProgress,
      [progressKey]: {
        completedSteps: Array.from(newCompleted),
        currentStep: currentStepIndex,
      },
    };

    const timeSpent = courseStartTime ? Math.floor((Date.now() - courseStartTime) / 1000) : 0;

    set({ completedSteps: newCompleted, courseProgress: newCourseProgress });
    courseService.saveProgress(currentCourse.id, currentStepIndex, Array.from(newCompleted), timeSpent);
  },

  resetProgress: () => {
    set({ currentStepIndex: 0, completedSteps: new Set() });
  },

  getCurrentStep: () => {
    const { currentCourse, currentStepIndex } = get();
    if (currentCourse && currentCourse.steps[currentStepIndex]) {
      return currentCourse.steps[currentStepIndex];
    }
    return null;
  },

  getCourseProgress: (courseId: string) => {
    return get().courseProgress[courseId] || null;
  },
}));
