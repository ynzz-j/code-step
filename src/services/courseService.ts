import { invoke } from '@tauri-apps/api/core';
import type { Course, CourseMetadata, CourseCategory, Difficulty, Step } from '@/types';

interface CourseFromBackend {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  difficulty: string;
  concepts: string[];
  steps: Step[];
  estimated_minutes: number;
}

interface CourseMetadataFromBackend {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  difficulty: string;
  concepts: string[];
  estimated_minutes: number;
  steps_count: number;
}

function parseDifficulty(diffStr: string): Difficulty {
  switch (diffStr.toLowerCase()) {
    case 'beginner': return 'beginner';
    case 'basic': return 'basic';
    case 'intermediate': return 'intermediate';
    case 'advanced': return 'advanced';
    case 'hell': return 'hell';
    default: return 'beginner';
  }
}

function parseCategory(catStr: string | undefined): CourseCategory {
  if (!catStr) return 'fundamentals';
  const validCategories: CourseCategory[] = ['fundamentals', 'frontend', 'backend', 'algorithms', 'database', 'devtools'];
  return validCategories.includes(catStr as CourseCategory) ? catStr as CourseCategory : 'fundamentals';
}

function transformCourseMetadata(backend: CourseMetadataFromBackend): CourseMetadata {
  return {
    id: backend.id,
    title: backend.title,
    description: backend.description,
    language: backend.language,
    category: parseCategory(backend.category),
    difficulty: parseDifficulty(backend.difficulty),
    concepts: backend.concepts || [],
    estimatedMinutes: backend.estimated_minutes || 15,
    stepsCount: backend.steps_count || 0,
  };
}

function transformCourse(backend: CourseFromBackend): Course {
  return {
    id: backend.id,
    title: backend.title,
    description: backend.description,
    language: backend.language,
    category: parseCategory(backend.category),
    difficulty: parseDifficulty(backend.difficulty),
    concepts: backend.concepts || [],
    estimatedMinutes: backend.estimated_minutes || 15,
    steps: backend.steps || [],
  };
}

class CourseService {
  // 直接调用 Tauri 后端，不再使用 mock 数据
  async getCourses(): Promise<CourseMetadata[]> {
    try {
      const debug = await invoke<any>('debug_courses');
      console.log('[DEBUG] Course paths:', JSON.stringify(debug, null, 2));

      const result = await invoke<CourseMetadataFromBackend[]>('get_courses');
      console.log('[DEBUG] get_courses returned:', result.length, 'courses');
      return result.map(transformCourseMetadata);
    } catch (error) {
      console.error('Failed to get courses from Tauri:', error);
      return [];
    }
  }

  async getCourse(courseId: string): Promise<Course> {
    try {
      const result = await invoke<CourseFromBackend>('get_course', { courseId });
      return transformCourse(result);
    } catch (error) {
      console.error('Failed to get course from Tauri:', error);
      throw new Error(`Course not found: ${courseId}`);
    }
  }

  async getStep(courseId: string, stepIndex: number): Promise<Step> {
    try {
      const result = await invoke<Step>('get_step', { courseId, stepIndex });
      return {
        ...result,
        id: `${courseId}-${stepIndex + 1}`,
      };
    } catch (error) {
      console.error('Failed to get step from Tauri:', error);
      throw new Error(`Step ${stepIndex} not found in course ${courseId}`);
    }
  }

  async saveProgress(courseId: string, currentStep: number, completedSteps: number[], timeSpent: number): Promise<void> {
    try {
      await invoke('save_progress', {
        courseId,
        currentStep,
        completedSteps,
        timeSpent,
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  async getProgress(courseId: string): Promise<{ currentStep: number; completedSteps: number[]; timeSpent: number } | null> {
    try {
      const result = await invoke<any>('get_user_progress', { courseId });
      if (result) {
        return {
          currentStep: result.current_step,
          completedSteps: result.completed_steps,
          timeSpent: result.time_spent,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get progress:', error);
      return null;
    }
  }

  async checkCourseUpdates(): Promise<CourseUpdate[]> {
    try {
      return await invoke<CourseUpdate[]>('check_course_updates');
    } catch (error) {
      console.error('Failed to check updates:', error);
      return [];
    }
  }
}

export interface CourseUpdate {
  course_id: string;
  current_version: string;
  latest_version: string;
  changelog: string;
  download_url?: string;
}

export const courseService = new CourseService();
