import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import type { UserLearningSummary, CourseProgressSummary } from '@/types/user';
import { useUserStore } from '@/stores/userStore';
import { FEATURED_TRAINING_PACKS } from '@/data/trainingPacks';
import { DIFFICULTY_LABELS } from '@/types';
import { playSound } from '@/utils/soundEffects';

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

// ==================== 辅助函数 ====================

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

interface WeakTokenSummary {
  token: string;
  count: number;
}

function derivePerformance(
  summary: UserLearningSummary | null,
): PerformanceOverview {
  const user = JSON.parse(localStorage.getItem('codestep-user') || '{}');
  const packStats = JSON.parse(localStorage.getItem('codestep-training-pack-stats') || '{}');

  const stepStats = user?.state?.stepStats || [];
  const totalTimeMin = Math.round((user?.state?.totalLearningTime || 0) / 60);
  const completedCourseIds: string[] = user?.state?.completedCourses || [];

  const recent = stepStats.slice(-10);
  const avgWpm = recent.length > 0
    ? Math.round(recent.reduce((s: number, x: { wpm?: number }) => s + (x.wpm || 0), 0) / recent.length)
    : 0;
  const avgAccuracy = recent.length > 0
    ? Math.round(recent.reduce((s: number, x: { accuracy: number }) => s + (x.accuracy || 0), 0) / recent.length)
    : 0;

  let bestCombo = 0;
  let todayImproved = false;
  for (const key of Object.keys(packStats)) {
    const s = packStats[key];
    if (s?.bestCombo > bestCombo) bestCombo = s.bestCombo;
    if (s?.todayDelta > 0) todayImproved = true;
  }

  const courseProgress = summary?.courseProgress ?? [];
  const totalSegments = courseProgress.reduce((s, c) => s + c.completedSteps, 0);

  return {
    totalTimeMin,
    completedSegments: totalSegments,
    avgWpm,
    avgAccuracy,
    bestCombo,
    completedCourses: completedCourseIds.length,
    totalCourses: courseProgress.length,
    todayImproved,
  };
}

function deriveWeakTokens(): WeakTokenSummary[] {
  try {
    const user = JSON.parse(localStorage.getItem('codestep-user') || '{}');
    const stepStats = user?.state?.stepStats || [];
    const counts: Record<string, number> = {};

    for (const stat of stepStats) {
      for (const token of stat.weakTokens || []) {
        counts[token] = (counts[token] ?? 0) + 1;
      }
    }

    return Object.entries(counts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 6)
      .map(([token, count]) => ({ token, count }));
  } catch {
    return [];
  }
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
              backgroundColor: val > 0 ? '#0ea5e9' : '#334155',
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const displayName = useUserStore((s) => s.displayName);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await invoke<UserLearningSummary>('get_user_learning_summary');
      setSummary(data);
    } catch (err) {
      console.error('[UserCenter] Failed to load learning summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const perf = useMemo(() => derivePerformance(summary), [summary]);
  const courseProgress = summary?.courseProgress ?? [];

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
    try {
      const packStats = JSON.parse(localStorage.getItem('codestep-training-pack-stats') || '{}');
      return FEATURED_TRAINING_PACKS.filter((pack) => {
        const stats = packStats[pack.id];
        return !stats || (stats.masteryPercent || 0) < 50;
      }).slice(0, 2);
    } catch {
      return FEATURED_TRAINING_PACKS.slice(0, 2);
    }
  }, []);

  const weakTokens = useMemo(() => deriveWeakTokens(), [summary]);

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

  const hasActivity = courseProgress.length > 0;

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

        {/* === 表现总览 === */}
        {hasActivity && (
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel p-5">
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

            {/* 7 天趋势 */}
            <div>
              <div className="text-[10px] text-text-muted mb-2 uppercase tracking-wide">近 7 天活动</div>
              <MiniTrend courseProgress={courseProgress} />
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

        {/* === 课程进度列表（降级）=== */}
        {hasActivity && (
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
