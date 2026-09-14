/**
 * Web demo 进度存取：localStorage 替代 SQLite（仅浏览器模式使用）。
 * 数据结构与 Tauri 后端的 get_user_progress / save_progress 对齐。
 */
import webCoursesJson from '@/data/webCourses.json';
import type { UserLearningSummary } from '@/types/user';

const KEY = 'codestep-web-progress';

export interface WebProgressEntry {
  current_step: number;
  completed_steps: number[];
  time_spent: number;
  last_studied_at: string;
}

type WebProgressMap = Record<string, WebProgressEntry>;

interface WebCourseMeta {
  id: string;
  title: string;
  language: string;
  steps_count: number;
}

const WEB_COURSES = webCoursesJson as unknown as WebCourseMeta[];

export function loadWebProgress(): WebProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveWebProgress(
  courseId: string,
  currentStep: number,
  completedSteps: number[],
  timeSpent: number,
): void {
  const map = loadWebProgress();
  const prev = map[courseId];
  map[courseId] = {
    current_step: currentStep,
    completed_steps: completedSteps,
    time_spent: Math.max(timeSpent, prev?.time_spent ?? 0),
    last_studied_at: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore storage failures */
  }
}

export interface WebCourseProgressSummary {
  courseId: string;
  courseTitle: string;
  language: string;
  progressPercent: number;
  completedSteps: number;
  totalSteps: number;
  lastStudiedAt: string | null;
  timeSpentMinutes: number;
  courseMode: string;
}

/** 汇总为学习中心所需的课程进度列表 */
export function buildWebCourseProgress(): WebCourseProgressSummary[] {
  const map = loadWebProgress();
  return WEB_COURSES.filter((c) => map[c.id]).map((c) => {
    const p = map[c.id];
    const percent = c.steps_count > 0 ? Math.min(Math.round((p.completed_steps.length / c.steps_count) * 100), 100) : 0;
    return {
      courseId: c.id,
      courseTitle: c.title,
      language: c.language,
      progressPercent: percent,
      completedSteps: p.completed_steps.length,
      totalSteps: c.steps_count,
      lastStudiedAt: p.last_studied_at,
      timeSpentMinutes: Math.round(p.time_spent / 60),
      courseMode: 'typing',
    };
  });
}

/** 学习中心 Web 版数据源 */
export function buildWebLearningSummary(): UserLearningSummary {
  return { courseProgress: buildWebCourseProgress() };
}
