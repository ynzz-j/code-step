export interface User {
  id: string;
  displayName: string;
  createdAt: string;
  lastActive: string;
}

// ---------------------------------------------------------------------------
// 课程进度（Phase 3 - 用户中心核心）
// ---------------------------------------------------------------------------

/** 单门课程的学习进度摘要 */
export interface CourseProgressSummary {
  courseId: string;
  courseTitle: string;
  language: string;
  /** 0 ~ 100 */
  progressPercent: number;
  completedSteps: number;
  totalSteps: number;
  lastStudiedAt: string | null;
  /** 总学习时长（分钟） */
  timeSpentMinutes: number;
}

/** 用户学习中心数据 */
export interface UserLearningSummary {
  /** 各课程进度列表 */
  courseProgress: CourseProgressSummary[];
}

// ---------------------------------------------------------------------------
// 原有的进度类型（保留）
// ---------------------------------------------------------------------------

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
