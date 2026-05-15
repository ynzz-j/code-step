import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTypingStatsStore } from '@/stores/typingStatsStore';
import { useComboStore } from '@/stores/comboStore';
import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { normalizeCourseMode } from '@/services/courseService';
import { playSound, initSound } from '@/utils/soundEffects';
import { readTrainingPackStats } from '@/utils/trainingPackStats';

function buildQuery(modeParam: string | null, restart = false) {
  const params = new URLSearchParams();
  if (modeParam) params.set('mode', normalizeCourseMode(modeParam));
  if (restart) params.set('restart', '1');
  const query = params.toString();
  return query ? `?${query}` : '';
}

function ResultStat({
  label,
  value,
  tone = 'text-text-primary',
  sub,
}: {
  label: string;
  value: string | number;
  tone?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-tool border border-gray-700/40 bg-bg-panel p-4 text-center">
      <div className={`text-2xl font-bold font-mono ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-text-muted">{label}</div>
      {sub && <div className="mt-0.5 text-[10px] text-text-disabled">{sub}</div>}
    </div>
  );
}

export function CompletePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const coursesQuery = buildQuery(modeParam);
  const restartQuery = buildQuery(modeParam, true);
  const typingStats = useTypingStatsStore((s) => s.typingStats);
  const { maxCombo } = useComboStore();
  const currentCourse = useCourseSessionStore((s) => s.currentCourse);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    try { initSound(); } catch (_) { /* ignore */ }
    playSound('complete');

    const timer = setTimeout(() => setShowContent(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const trainingStats = useMemo(
    () => (courseId ? readTrainingPackStats(courseId) : null),
    [courseId],
  );

  const flowScore = Math.max(
    0,
    Math.round((typingStats.wpm * typingStats.accuracy) / 100 + maxCombo * 0.4 - typingStats.errors * 1.5),
  );
  const hasTypingResult = typingStats.totalKeystrokes > 0;
  const isBestWpm =
    hasTypingResult && trainingStats?.bestWpm ? typingStats.wpm >= trainingStats.bestWpm : false;
  const isBestCombo =
    maxCombo > 0 && trainingStats?.bestCombo ? maxCombo >= trainingStats.bestCombo : false;
  const hasRecord = isBestWpm || isBestCombo;

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-6 py-8">
      <div
        className={`w-full max-w-3xl space-y-6 ${
          showContent ? 'animate-slide-up-fade' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-success-500/30 bg-success-500/15">
            <svg className="h-7 w-7 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary">本轮训练完成</h1>
          <p className="mt-2 text-sm text-text-muted">
            {currentCourse?.title ?? '训练包'} 已完成，下面是这轮表现。
          </p>
          {hasRecord && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-brand border border-accent-record/30 bg-accent-record/10 px-3 py-1 text-xs font-medium text-accent-record">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {isBestWpm && isBestCombo ? 'WPM 和 Combo 当前最佳' : isBestWpm ? 'WPM 当前最佳' : 'Combo 当前最佳'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ResultStat
            label="WPM"
            value={hasTypingResult ? typingStats.wpm : '--'}
            tone={isBestWpm ? 'text-accent-record' : 'text-accent-primary'}
            sub={trainingStats?.bestWpm ? `最佳 ${trainingStats.bestWpm}` : '待记录'}
          />
          <ResultStat
            label="准确率"
            value={hasTypingResult ? `${typingStats.accuracy}%` : '--'}
            tone={typingStats.accuracy >= 95 ? 'text-success-400' : 'text-warning-400'}
            sub={hasTypingResult ? `${typingStats.totalKeystrokes} 键` : '未记录'}
          />
          <ResultStat
            label="Max Combo"
            value={maxCombo > 0 ? `x${maxCombo}` : '--'}
            tone={isBestCombo ? 'text-accent-record' : 'text-primary-300'}
            sub={trainingStats?.bestCombo ? `最佳 x${trainingStats.bestCombo}` : '待记录'}
          />
          <ResultStat
            label="Flow Score"
            value={hasTypingResult ? flowScore : '--'}
            tone="text-success-400"
            sub="节奏分"
          />
        </div>

        <div className="rounded-tool border border-gray-700/40 bg-bg-panel/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">下一步</h2>
              <p className="mt-1 text-xs text-text-muted">
                继续保持手感，优先复刷同一训练包，或去挑下一组高频片段。
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <Link
                to={courseId ? `/learn/${courseId}${restartQuery}` : `/courses${coursesQuery}`}
                onClick={() => playSound('click')}
                className="rounded-tool bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              >
                再来一轮
              </Link>
              <Link
                to={`/courses${coursesQuery}`}
                onClick={() => playSound('click')}
                className="rounded-tool border border-gray-700/50 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary-500/40 hover:text-text-primary"
              >
                下一组训练
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            onClick={() => playSound('click')}
            className="text-xs text-text-muted transition-colors hover:text-text-secondary"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
