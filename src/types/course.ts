import type { Step } from './step';

export type Difficulty = 'beginner' | 'basic' | 'intermediate' | 'advanced' | 'hell';

export type CourseCategory =
  | 'fundamentals'
  | 'frontend'
  | 'backend'
  | 'algorithms'
  | 'database'
  | 'devtools';

// 难度等级映射（中文标签和样式）
export const DIFFICULTY_LABELS: Record<Difficulty | 'all', { label: string; color: string }> = {
  all: { label: '全部', color: 'gray' },
  beginner: { label: '入门', color: 'green' },
  basic: { label: '基础', color: 'cyan' },
  intermediate: { label: '中等', color: 'blue' },
  advanced: { label: '困难', color: 'orange' },
  hell: { label: '地狱', color: 'red' },
};

export const ALL_DIFFICULTIES: (Difficulty | 'all')[] = ['all', 'beginner', 'basic', 'intermediate', 'advanced', 'hell'];

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  fundamentals: '编程基础',
  frontend: '前端开发',
  backend: '后端开发',
  algorithms: '数据结构与算法',
  database: '数据库',
  devtools: '开发工具',
};

export const ALL_CATEGORIES: CourseCategory[] = [
  'fundamentals',
  'frontend',
  'backend',
  'algorithms',
  'database',
  'devtools',
];

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  category: CourseCategory;
  difficulty: Difficulty;
  concepts: string[];
  steps: Step[];
  estimatedMinutes: number;
}

export interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  language: string;
  category: CourseCategory;
  difficulty: Difficulty;
  concepts: string[];
  estimatedMinutes: number;
  stepsCount: number;
}
