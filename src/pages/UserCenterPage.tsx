import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import type { UserLearningSummary, CourseProgressSummary } from '@/types/user';
import type { WeakTokenStat, ChallengeRunResult } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { useGrowthStore } from '@/stores/growthStore';
import { challengeService } from '@/services/challengeService';
import { FEATURED_TRAINING_PACKS, DEFAULT_TRAINING_PACK_IDS } from '@/data/trainingPacks';
import { DIFFICULTY_LABELS } from '@/types';
import { playSound } from '@/utils/soundEffects';
import pathSummit from '@/assets/backgrounds/path-summit.png';
import calendarIcon from '@/assets/icons/calendar.png';

type StatusFilter = 'all' | 'in_progress' | 'completed';

const LANGUAGES = [
  { value: 'all' as const, label: '全部' },
  { value: 'java' as const, label: 'Java' },
  { value: 'python' as const, label: 'Python' },
  { value: 'javascript' as const, label: 'JavaScript' },
  { value: 'cpp' as const, label: 'C++' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
];

// ==================== 辅助类型 ====================

interface PerformanceOverview {
  totalTimeMin: number;
  completedSegments: number;
  avgWpm: number;
  avgAccuracy: number;
  bestCombo: number;
  completedCourses: number;
  totalCourses: number;
  todayImproved: boolean;
}

// ==================== 迷你趋势条 ====================

function MiniTrend({ courseProgress }: { courseProgress: CourseProgressSummary[] }) {
  // 根据 lastStudiedAt 聚合最近 7 天的活动
  const dailyData = useMemo(() => {
    const days: number[] = Array(7).fill(0);
    const now = Date.now();
    for (const p of courseProgress) {
      if (!p.lastStudiedAt) continue;
      const d = new Date(p.lastStudiedAt).getTime();
      const dayIndex = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 7) {
        days[6 - dayIndex] += p.completedSteps || 0;
      }
    }
    return days;
  }, [courseProgress]);

  const maxVal = Math.max(...dailyData, 1);
  const daysOfWeek = ['一', '二', '三', '四', '五', '六', '日'];

  // 调整标签以匹配今天
  const todayDow = new Date().getDay();
  const labels = Array.from({ length: 7 }, (_, i) => {
    const idx = (todayDow - 6 + i + 7) % 7;
    return daysOfWeek[idx];
  });

  return (
    <div className="flex items-end gap-1 h-10">
      {dailyData.map((val, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className="w-full rounded-sm transition-all duration-500"
            style={{
              height: `${Math.max((val / maxVal) * 32, val > 0 ? 3 : 1)}px`,
              backgroundColor: val > 0 ? '#f59e0b' : '#1a2740',
              opacity: val > 0 ? 0.7 + (val / maxVal) * 0.3 : 0.4,
            }}
          />
          <span className="text-[9px] text-text-disabled">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ==================== ProgressBar ====================

function ProgressBar({ percent }: { percent: number }) {
  const isComplete = percent >= 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-text-muted mb-1">
        <span>进度</span>
        <span className={isComplete ? 'text-success-400' : ''}>{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-success-500' : percent > 0 ? 'bg-primary-500' : 'bg-gray-600'
          }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ==================== CourseProgressCard ====================

function CourseProgressCard({ progress }: { progress: CourseProgressSummary }) {
  const isComplete = progress.progressPercent >= 100;

  const formatLastStudied = (dateStr: string | null) => {
    if (!dateStr) return '未开始';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays} 天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const languageColors: Record<string, string> = {
    java: 'text-orange-400 bg-orange-500/10',
    python: 'text-blue-400 bg-blue-500/10',
    javascript: 'text-yellow-400 bg-yellow-500/10',
    cpp: 'text-cyan-400 bg-cyan-500/10',
  };

  return (
    <Link
      to={`/learn/${progress.courseId}?mode=${progress.courseMode}`}
      onClick={() => playSound('click')}
      className={`block p-4 rounded-tool border transition-all duration-200 hover:-translate-y-0.5 ${
        isComplete
          ? 'border-success-500/20 bg-success-500/5 hover:border-success-500/40'
          : 'border-gray-700/40 bg-bg-panel hover:border-primary-500/40'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${languageColors[progress.language] || 'text-gray-400 bg-gray-700/50'}`}>
              {progress.language.toUpperCase()}
            </span>
            {isComplete && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-success-500/15 text-success-400 border border-success-500/20">
                已完成
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-text-primary truncate">{progress.courseTitle}</h3>
        </div>
        <span className="text-lg flex-shrink-0 ml-2">
          {isComplete ? (
            <svg className="w-5 h-5 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : progress.progressPercent > 0 ? (
            <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </span>
      </div>

      <ProgressBar percent={progress.progressPercent} />

      <div className="flex items-center justify-between mt-2 text-[10px] text-text-disabled">
        <span>{progress.completedSteps}/{progress.totalSteps} 步</span>
        {progress.timeSpentMinutes > 0 && <span>{progress.timeSpentMinutes} 分钟</span>}
        <span>{formatLastStudied(progress.lastStudiedAt)}</span>
      </div>
    </Link>
  );
}

// ==================== 语言分布环图（线框 6.2-C） ====================

const LANG_DONUT_COLORS: Record<string, string> = {
  javascript: '#facc15',
  typescript: '#60a5fa',
  python: '#38bdf8',
  java: '#fb923c',
  cpp: '#f472b6',
  sql: '#34d399',
  vim: '#a78bfa',
};

function LanguageDonut({ courseProgress }: { courseProgress: CourseProgressSummary[] }) {
  const data = useMemo(() => {
    const byLang: Record<string, number> = {};
    for (const p of courseProgress) {
      byLang[p.language] = (byLang[p.language] ?? 0) + Math.max(p.timeSpentMinutes, 0);
    }
    const total = Object.values(byLang).reduce((a, b) => a + b, 0);
    if (total === 0) return null;
    let acc = 0;
    const segs = Object.entries(byLang)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, minutes]) => {
        const frac = minutes / total;
        const seg = { lang, frac, offset: acc, color: LANG_DONUT_COLORS[lang] ?? '#94a3b8' };
        acc += frac;
        return seg;
      });
    return segs;
  }, [courseProgress]);

  if (!data) return <p className="text-xs text-text-muted">暂无训练分布，开始练习后生成</p>;
  const R = 15.9155; // 周长=100，方便按百分比绘制

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 42 42" className="w-24 h-24 -rotate-90 flex-shrink-0">
        <circle cx="21" cy="21" r={R} fill="none" stroke="#1a2740" strokeWidth="6" />
        {data.map((s) => (
          <circle
            key={s.lang}
            cx="21"
            cy="21"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth="6"
            strokeDasharray={`${s.frac * 100} ${100 - s.frac * 100}`}
            strokeDashoffset={-s.offset * 100}
          />
        ))}
      </svg>
      <div className="space-y-1 min-w-0 flex-1">
        {data.map((s) => (
          <div key={s.lang} className="flex items-center gap-1.5 text-[10px] text-text-secondary">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="uppercase truncate">{s.lang}</span>
            <span className="text-text-muted ml-auto">{Math.round(s.frac * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== EmptyState ====================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-bg-panel border border-gray-700/50 flex items-center justify-center">
        <svg className="w-8 h-8 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">还没有训练记录</h3>
      <p className="text-sm text-text-muted mb-6">开始第一次训练，建立代码肌肉记忆</p>
      <Link
        to="/courses?mode=typing"
        onClick={() => playSound('click')}
        className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-tool font-medium transition-colors"
      >
        浏览训练
      </Link>
    </div>
  );
}

// ==================== UserCenterPage ====================

export function UserCenterPage() {
  const [summary, setSummary] = useState<UserLearningSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [weakTokenStats, setWeakTokenStats] = useState<WeakTokenStat[]>([]);
  const [recentChallenges, setRecentChallenges] = useState<ChallengeRunResult[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const displayName = useUserStore((s) => s.displayName);
  const growthSummary = useGrowthStore((s) => s.summary);
  const packGrowthMap = useGrowthStore((s) => s.packGrowth);
  const refreshSummary = useGrowthStore((s) => s.refreshSummary);

  useEffect(() => {
    loadSummary();
    refreshSummary();
    useGrowthStore.getState().refreshMultiplePackGrowth(DEFAULT_TRAINING_PACK_IDS);
  }, [refreshSummary]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await invoke<UserLearningSummary>('get_user_learning_summary');
      setSummary(data);
      const tokens = await invoke<WeakTokenStat[]>('get_weak_token_stats');
      setWeakTokenStats(tokens);
      const challenges = await challengeService.getRecentRuns(10);
      setRecentChallenges(challenges);
    } catch (err) {
      console.error('[UserCenter] Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const courseProgress = summary?.courseProgress ?? [];

  const perf: PerformanceOverview = {
    totalTimeMin: growthSummary?.totalTimeMin ?? 0,
    completedSegments: growthSummary?.totalAttempts ?? 0,
    avgWpm: Math.round(growthSummary?.recentWpm ?? 0),
    avgAccuracy: Math.round(growthSummary?.recentAccuracy ?? 0),
    bestCombo: growthSummary?.bestCombo ?? 0,
    completedCourses: growthSummary?.completedCourses ?? 0,
    totalCourses: courseProgress.length,
    todayImproved: growthSummary?.todayImproved ?? false,
  };

  // 筛选
  const filteredProgress = courseProgress.filter((p) => {
    if (selectedLanguage !== 'all' && p.language !== selectedLanguage) return false;
    if (selectedStatus === 'in_progress') return p.progressPercent > 0 && p.progressPercent < 100;
    if (selectedStatus === 'completed') return p.progressPercent >= 100;
    return true;
  });

  // 各语言数量
  const langCounts: Record<string, number> = { all: courseProgress.length };
  for (const lang of LANGUAGES) {
    if (lang.value !== 'all') {
      langCounts[lang.value] = courseProgress.filter((p) => p.language === lang.value).length;
    }
  }

  // 推荐复刷的训练包（低熟练度）
  const suggestedPacks = useMemo(() => {
    return FEATURED_TRAINING_PACKS.filter((pack) => {
      const growth = packGrowthMap[pack.id];
      return !growth || (growth.masteryPercent ?? 0) < 50;
    }).slice(0, 2);
  }, [packGrowthMap]);

  const weakTokens = useMemo(() => {
    return weakTokenStats.slice(0, 6).map((item) => ({
      token: item.token,
      count: item.count,
    }));
  }, [weakTokenStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-text-muted text-sm">加载中...</span>
        </div>
      </div>
    );
  }

  const hasActivity = courseProgress.length > 0 || (growthSummary?.hasActivity ?? false);

  // 等级体系：每 20 个片段升一级（真实数据游戏化呈现）
  const totalAttempts = growthSummary?.totalAttempts ?? 0;
  const level = Math.floor(totalAttempts / 20) + 1;
  const levelRemainder = totalAttempts % 20;
  const levelProgress = (levelRemainder / 20) * 100;

  // 连续训练天数（从最近学习记录推算，今天未练则从昨天回溯；纯计算不用 hook，
  // 因为它位于 loading 早退之后，hook 顺序会不稳定导致 React 崩溃白屏）
  const trainedDays = new Set(
    courseProgress
      .filter((p) => p.lastStudiedAt)
      .map((p) => new Date(p.lastStudiedAt as string).toISOString().slice(0, 10)),
  );
  const streakCursor = new Date();
  if (!trainedDays.has(streakCursor.toISOString().slice(0, 10))) {
    streakCursor.setDate(streakCursor.getDate() - 1);
  }
  let streakDays = 0;
  for (;;) {
    if (trainedDays.has(streakCursor.toISOString().slice(0, 10))) {
      streakDays += 1;
      streakCursor.setDate(streakCursor.getDate() - 1);
    } else break;
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">训练表现</h1>
          <p className="text-sm text-text-muted mt-1">
            {hasActivity ? `${displayName}的训练数据总览` : '开始第一次训练'}
          </p>
        </div>

        {/* === 玩家档案卡 === */}
        {hasActivity && (
          <div className="flex items-center gap-4 rounded-tool border border-gray-700/40 bg-bg-panel p-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-orange-500 flex items-center justify-center text-lg font-bold text-bg-app flex-shrink-0 shadow-md shadow-primary-500/25">
              {(displayName || 'C').slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">{displayName}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-500/15 text-primary-300 border border-primary-500/25">
                  Lv.{level}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 bg-bg-app/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] text-text-muted">
                本级进度 {levelRemainder}/20 段，再练 {20 - levelRemainder} 段升级
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-center flex-shrink-0 pl-4 border-l border-gray-700/40">
              <img src={calendarIcon} alt="" className="h-8 w-8 object-contain" draggable={false} />
              <span className="mt-1 text-[10px] text-text-secondary">
                连续 <span className="font-bold text-accent-record">{streakDays}</span> 天
              </span>
            </div>
          </div>
        )}

        {/* === 表现总览 === */}
        {hasActivity && (
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel p-5 md:flex md:gap-5">
            <div className="flex-1 min-w-0">
            <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-4">表现总览</h2>

            {/* 统计卡片 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              <div className="text-center p-2 rounded bg-bg-app/50 border border-gray-700/30">
                <div className="text-lg font-bold font-mono text-text-primary">{perf.totalTimeMin}</div>
                <div className="text-[9px] text-text-muted mt-0.5">训练分钟</div>
              </div>
              <div className="text-center p-2 rounded bg-bg-app/50 border border-gray-700/30">
                <div className="text-lg font-bold font-mono text-text-primary">{perf.completedSegments}</div>
                <div className="text-[9px] text-text-muted mt-0.5">完成片段</div>
              </div>
              <div className="text-center p-2 rounded bg-bg-app/50 border border-gray-700/30">
                <div className="text-lg font-bold font-mono text-primary-300">{perf.avgWpm || '--'}</div>
                <div className="text-[9px] text-text-muted mt-0.5">平均 WPM</div>
              </div>
              <div className="text-center p-2 rounded bg-bg-app/50 border border-gray-700/30">
                <div className={`text-lg font-bold font-mono ${perf.avgAccuracy >= 95 ? 'text-success-400' : 'text-warning-400'}`}>
                  {perf.avgAccuracy || '--'}%
                </div>
                <div className="text-[9px] text-text-muted mt-0.5">准确率</div>
              </div>
              <div className="text-center p-2 rounded bg-bg-app/50 border border-gray-700/30">
                <div className="text-lg font-bold font-mono text-yellow-300">x{perf.bestCombo}</div>
                <div className="text-[9px] text-text-muted mt-0.5">最佳 Combo</div>
              </div>
              <div className="text-center p-2 rounded bg-bg-app/50 border border-gray-700/30">
                <div className="text-lg font-bold font-mono text-text-primary">{perf.completedCourses}/{perf.totalCourses}</div>
                <div className="text-[9px] text-text-muted mt-0.5">完成课程</div>
              </div>
            </div>

            {/* 今日提升标记 */}
            {perf.todayImproved && (
              <div className="flex items-center gap-1.5 text-xs text-success-400 mb-4">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                今日有提升！
              </div>
            )}

            {/* 图表区：近 7 天趋势 + 语言分布环图（线框 6.2-C） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseProgress.length > 0 && (
                <div>
                  <div className="text-[10px] text-text-muted mb-2 uppercase tracking-wide">近 7 天活动</div>
                  <MiniTrend courseProgress={courseProgress} />
                </div>
              )}
              {courseProgress.length > 0 && (
                <div>
                  <div className="text-[10px] text-text-muted mb-2 uppercase tracking-wide">语言分布（按训练时长）</div>
                  <LanguageDonut courseProgress={courseProgress} />
                </div>
              )}
            </div>
          </div>

          {/* 成长之路插画（mockup 05 右侧栏） */}
            <div className="hidden md:block relative w-44 rounded-tool overflow-hidden border border-gray-700/40 flex-shrink-0">
              <img src={pathSummit} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-app/85 via-bg-app/20 to-transparent" />
              <span className="absolute bottom-2.5 left-0 right-0 text-center font-hand text-base text-primary-100/85 rotate-[-2deg] select-none">
                Keep Practicing, Keep Growing.
              </span>
            </div>
          </div>
        )}

        {/* === 弱点与建议 === */}
        {hasActivity && (weakTokens.length > 0 || suggestedPacks.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 薄弱 token */}
            {weakTokens.length > 0 && (
              <div className="rounded-tool border border-warning-500/20 bg-warning-500/5 p-4">
                <h3 className="text-xs font-semibold text-warning-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  薄弱 token
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {weakTokens.map((item) => (
                    <div
                      key={item.token}
                      className="flex items-center justify-between p-2 rounded bg-bg-app/50 border border-gray-700/30"
                    >
                      <code className="text-xs text-text-primary font-mono truncate">{item.token}</code>
                      <span className="text-[10px] text-warning-400 flex-shrink-0 ml-2">{item.count} 次</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-text-muted">
                  来自最近训练中的错误输入，优先复刷相关训练包。
                </p>
              </div>
            )}

            {/* 建议复刷训练包 */}
            {suggestedPacks.length > 0 && (
              <div className="rounded-tool border border-primary-500/20 bg-primary-500/5 p-4">
                <h3 className="text-xs font-semibold text-primary-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.1-2.846a4.5 4.5 0 00-1.7-1.7L5.25 15l2.846-.1a4.5 4.5 0 001.7-1.7L9.75 11l2.846.1a4.5 4.5 0 001.7 1.7L15 14.25l-2.846.1a4.5 4.5 0 00-1.7 1.7zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 11-1.676-1.676L14.25 9l1.035-.259a3.375 3.375 0 111.676-1.676L17.25 6l-.259 1.035a3.375 3.375 0 011.676 1.68z" />
                  </svg>
                  建议复刷
                </h3>
                <div className="space-y-2">
                  {suggestedPacks.map((pack) => (
                    <Link
                      key={pack.id}
                      to={`/learn/${pack.id}?mode=typing`}
                      onClick={() => playSound('click')}
                      className="flex items-center justify-between p-2 rounded bg-bg-app/50 border border-gray-700/30 hover:border-primary-500/30 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-xs text-text-primary truncate">{pack.title}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{pack.patterns.length} 个模式 · {DIFFICULTY_LABELS[pack.difficulty].label}</div>
                      </div>
                      <span className="text-[10px] text-primary-400 flex-shrink-0 ml-2">开始 →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === 本地挑战纪录 === */}
        {recentChallenges.length > 0 && (
          <div className="rounded-tool border border-accent-record/20 bg-bg-panel/70 p-4">
            <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">最近挑战</h2>
            <div className="space-y-2">
              {recentChallenges.slice(0, 6).map((r) => (
                <Link
                  key={r.id}
                  to={`/complete/${r.packId}?mode=typing&challenge=${r.challengeMode}&runId=${r.id}`}
                  onClick={() => playSound('click')}
                  className="flex items-center justify-between px-3 py-2 rounded bg-bg-app/50 border border-gray-700/30 hover:border-accent-record/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-record/10 text-accent-record border border-accent-record/20 flex-shrink-0">
                      {({ 'speed-30s': '30s', 'focus-3min': '3min', 'perfect-run': 'Perfect', 'combo-rush': 'Combo' } as Record<string, string>)[r.challengeMode]}
                    </span>
                    <span className="text-xs text-text-primary truncate">
                      {FEATURED_TRAINING_PACKS.find((p) => p.id === r.packId)?.title ?? r.packId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-xs font-mono font-bold text-accent-record">{r.flowScore} Flow</span>
                    <span className="text-[10px] text-text-muted">{r.wpm} WPM</span>
                    {r.isNewBest && (
                      <span className="text-[10px] text-yellow-400">新纪录</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* === 课程进度列表 === */}
        {courseProgress.length > 0 && (
          <div>
            {/* 筛选栏 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary">课程进度</h2>
              <div className="flex items-center gap-1.5">
                {/* 状态筛选 */}
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSelectedStatus(opt.value); playSound('click'); }}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors border ${
                      selectedStatus === opt.value
                        ? 'border-primary-500/40 bg-primary-500/15 text-primary-300'
                        : 'border-transparent text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 语言筛选 */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {LANGUAGES.map((lang) =>
                langCounts[lang.value] > 0 || lang.value === 'all' ? (
                  <button
                    key={lang.value}
                    onClick={() => { setSelectedLanguage(lang.value); playSound('click'); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                      selectedLanguage === lang.value
                        ? 'border-primary-500/40 bg-primary-500/15 text-primary-300'
                        : 'border-transparent text-text-muted hover:border-gray-600/50'
                    }`}
                  >
                    {lang.label}
                    {lang.value !== 'all' && <span className="ml-0.5 opacity-60">({langCounts[lang.value] || 0})</span>}
                  </button>
                ) : null,
              )}
            </div>

            {filteredProgress.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                该筛选条件下暂无课程
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProgress.map((progress) => (
                  <CourseProgressCard key={progress.courseId} progress={progress} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 空状态 */}
        {!hasActivity && <EmptyState />}

      </div>
    </div>
  );
}
