import { create } from 'zustand';
import type { CourseMetadata, CourseCategory, Difficulty } from '@/types';
import { courseService, type CourseMode } from '@/services/courseService';

interface CourseCatalogState {
  courses: CourseMetadata[];
  selectedCategory: CourseCategory | 'all';
  selectedLanguage: string | 'all';
  selectedDifficulty: Difficulty | 'all';
  isLoading: boolean;
  error: string | null;
}

interface CourseCatalogActions {
  loadCourses: (mode?: CourseMode) => Promise<void>;
  setCategory: (category: CourseCategory | 'all') => void;
  setLanguage: (lang: string | 'all') => void;
  setDifficulty: (difficulty: Difficulty | 'all') => void;
}

type CourseCatalogStore = CourseCatalogState & CourseCatalogActions;

export const useCourseCatalogStore = create<CourseCatalogStore>((set) => ({
  courses: [],
  selectedCategory: 'all',
  selectedLanguage: 'all',
  selectedDifficulty: 'all',
  isLoading: false,
  error: null,

  loadCourses: async (mode) => {
    set({ isLoading: true, error: null });
    try {
      const courses = await courseService.getCourses(mode);
      set({ courses, isLoading: false });
    } catch (error) {
      console.error('Failed to load courses:', error);
      set({ error: '加载课程列表失败', isLoading: false });
    }
  },

  setCategory: (category) => set({ selectedCategory: category }),
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
}));
