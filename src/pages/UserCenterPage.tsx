import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import type { UserLearningSummary, CourseProgressSummary } from '@/types/user';

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

function ProgressBar({ percent }: { percent: number }) {
  const isComplete = percent >= 100;
  const isStarted = percent > 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>进度</span>
        <span className={isComplete ? 'text-success-400' : ''}>{Math.round(percent)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete
              ? 'bg-success-500'
              : isStarted
              ? 'bg-primary-500'
              : 'bg-gray-600'
          }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function CourseProgressCard({ progress }: { progress: CourseProgressSummary }) {
  const isComplete = progress.progressPercent >= 100;

  const formatLastStudied = (dateStr: string | null) => {
    if (!dateStr) return '从未开始';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

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
      className={`block p-5 rounded-xl border transition-all hover:shadow-lg ${
        isComplete
          ? 'bg-success-500/5 border-success-500/20 hover:border-success-500/40'
          : 'bg-gray-800/50 border-gray-700/50 hover:border-primary-500/40'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                languageColors[progress.language] || 'text-gray-400 bg-gray-700/50'
              }`}
            >
              {progress.language.toUpperCase()}
            </span>
            {isComplete && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-success-500/20 text-success-400">
                已完成
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-100 truncate">{progress.courseTitle}</h3>
        </div>
        <span className="text-2xl">
          {isComplete ? '✅' : progress.progressPercent > 0 ? '📖' : '🔒'}
        </span>
      </div>

      <ProgressBar percent={progress.progressPercent} />

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>
          {progress.completedSteps} / {progress.totalSteps} 步
        </span>
        {progress.timeSpentMinutes > 0 && (
          <span>已学习 {progress.timeSpentMinutes} 分钟</span>
        )}
        <span>{formatLastStudied(progress.lastStudiedAt)}</span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">📚</div>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">还没有学习记录</h3>
      <p className="text-gray-400 mb-6">开始你的第一门课程，开启编程之旅</p>
      <Link
        to="/courses"
        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
      >
        浏览课程
      </Link>
    </div>
  );
}

export function UserCenterPage() {
  const [summary, setSummary] = useState<UserLearningSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await invoke<UserLearningSummary>('get_user_learning_summary');
      console.log('[UserCenter] get_user_learning_summary result:', JSON.stringify(data, null, 2));
      setSummary(data);
    } catch (err) {
      console.error('[UserCenter] Failed to load learning summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400">加载中...</span>
        </div>
      </div>
    );
  }

  const courseProgress = summary?.courseProgress ?? [];

  // 筛选逻辑
  const filteredProgress = courseProgress.filter((p) => {
    if (selectedLanguage !== 'all' && p.language !== selectedLanguage) return false;
    if (selectedStatus === 'in_progress') return p.progressPercent > 0 && p.progressPercent < 100;
    if (selectedStatus === 'completed') return p.progressPercent >= 100;
    return true;
  });

  // 统计各语言数量
  const langCounts: Record<string, number> = { all: courseProgress.length };
  for (const lang of LANGUAGES) {
    if (lang.value !== 'all') {
      langCounts[lang.value] = courseProgress.filter((p) => p.language === lang.value).length;
    }
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">学习中心</h1>
        <p className="text-gray-400">追踪你的学习进度，继续未完成的课程</p>
      </div>

      {/* 筛选栏 */}
      {courseProgress.length > 0 && (
        <div className="mb-6 space-y-3">
          {/* 语言筛选 */}
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) =>
              langCounts[lang.value] > 0 || lang.value === 'all' ? (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
                    selectedLanguage === lang.value
                      ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
                      : 'border-gray-700/50 bg-gray-800/30 text-gray-500 hover:border-gray-600/50 hover:text-gray-400'
                  }`}
                >
                  {lang.label}
                  {lang.value !== 'all' && (
                    <span className="ml-1 opacity-60">({langCounts[lang.value] || 0})</span>
                  )}
                </button>
              ) : null,
            )}
          </div>

          {/* 状态筛选 */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === opt.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredProgress.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredProgress.map((progress) => (
            <CourseProgressCard key={progress.courseId} progress={progress} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
