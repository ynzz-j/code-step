import { isTauri } from '@/services/env';
import { buildWebCourseProgress } from '@/services/webProgress';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { CourseProgressSummary, UserLearningSummary } from '@/types/user';

/**
 * 从 SQLite 加载全部课程的真实进度（courseId → 进度摘要）。
 * 课程页/首页的卡片状态以此为准；会话内的临时进度只做合并补充。
 */
export function useDbCourseProgress(enabled = true) {
  const [map, setMap] = useState<Record<string, CourseProgressSummary>>({});

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    // Web demo：进度来自 localStorage
    if (!isTauri()) {
      const m: Record<string, CourseProgressSummary> = {};
      for (const p of buildWebCourseProgress()) {
        m[p.courseId] = {
          courseId: p.courseId,
          courseTitle: p.courseTitle,
          language: p.language,
          progressPercent: p.progressPercent,
          completedSteps: p.completedSteps,
          totalSteps: p.totalSteps,
          lastStudiedAt: p.lastStudiedAt,
          timeSpentMinutes: p.timeSpentMinutes,
          courseMode: p.courseMode,
        };
      }
      setMap(m);
      return;
    }

    invoke<UserLearningSummary>('get_user_learning_summary')
      .then((data) => {
        if (cancelled) return;
        const m: Record<string, CourseProgressSummary> = {};
        for (const p of data.courseProgress) {
          m[p.courseId] = p;
        }
        setMap(m);
      })
      .catch(() => {
        if (!cancelled) setMap({});
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return map;
}
