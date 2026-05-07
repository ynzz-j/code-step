import type { Step } from './step';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
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
  difficulty: Difficulty;
  concepts: string[];
  estimatedMinutes: number;
  stepsCount: number;
}
