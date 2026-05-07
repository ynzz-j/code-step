import { create } from 'zustand';
import type { Course, CourseMetadata, Step, TypingStats } from '@/types';
import { courseService } from '@/services/courseService';

interface CourseStore {
  courses: CourseMetadata[];
  currentCourse: Course | null;
  currentStepIndex: number;
  currentStepCompleted: boolean;
  completedSteps: Set<number>;
  typingStats: TypingStats;
  typingStartTime: number | null;
  isLoading: boolean;
  error: string | null;

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
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  currentCourse: null,
  currentStepIndex: 0,
  currentStepCompleted: false,
  completedSteps: new Set(),
  typingStats: { wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0 },
  typingStartTime: null,
  isLoading: false,
  error: null,

  loadCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const courses = await courseService.getCourses();
      set({ courses, isLoading: false });
    } catch (error) {
      console.error('Failed to load courses:', error);
      set({ error: '加载课程列表失败', isLoading: false });
    }
  },

  startCourse: async (courseId: string) => {
    console.log('startCourse called with:', courseId);
    set({ isLoading: true, error: null });
    try {
      const course = await courseService.getCourse(courseId);
      console.log('Course loaded:', course.title, 'steps:', course.steps.length);
      set({
        currentCourse: course,
        currentStepIndex: 0,
        currentStepCompleted: false,
        completedSteps: new Set(),
        typingStats: { wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0 },
        typingStartTime: Date.now(),
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load course:', error);
      set({ error: `加载课程失败: ${error}`, isLoading: false });
    }
  },

  nextStep: () => {
    const { currentCourse, currentStepIndex, currentStepCompleted } = get();
    if (!currentStepCompleted) return;
    if (currentCourse && currentStepIndex < currentCourse.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1, currentStepCompleted: false });
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

  markStepCompleted: () => set({ currentStepCompleted: true }),

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
      typingStats: { ...typingStats, totalKeystrokes: total, correctKeystrokes: correct, errors, wpm, accuracy },
      typingStartTime: startTime,
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
}));