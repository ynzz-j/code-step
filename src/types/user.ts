export interface User {
  id: string;
  displayName: string;
  createdAt: string;
  lastActive: string;
}

export interface CourseProgress {
  courseId: string;
  completedSteps: number[];
  currentStep: number;
  startedAt: string;
  completedAt?: string;
  timeSpent: number;
}

export interface UserProgress {
  userId: string;
  courseProgress: Record<string, CourseProgress>;
  totalTime: number;
  lastActive: string;
}

export interface StepStats {
  stepId: string;
  attempts: number;
  timeSpent: number;
  errorsCount: number;
  accuracy: number;
  wpm?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'course' | 'streak' | 'stats' | 'special';
  unlockedAt?: string;
}

export interface Settings {
  theme: 'dark' | 'light' | 'system';
  fontSize: number;
  tabSize: number;
  autoValidate: boolean;
  autoValidateDelay: number;
  focusModeShortcut: string;
}
