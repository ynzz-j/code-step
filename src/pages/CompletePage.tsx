import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTypingStatsStore } from '@/stores/typingStatsStore';
import { useComboStore } from '@/stores/comboStore';
import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { normalizeCourseMode } from '@/services/courseService';
import { playSound, initSound } from '@/utils/soundEffects';
import { useGrowthStore } from '@/stores/growthStore';
import { useChallengeStore } from '@/stores/challengeStore';
import { challengeService } from '@/services/challengeService';
import { ShareCard } from '@/components/learn/ShareCard';
import type { ChallengeMode, ChallengeRunResult } from '@/types';

function buildQuery(modeParam: string | null, restart = false, challenge?: string | null) {
  const params = new URLSearchParams();
  if (modeParam) params.set('mode', normalizeCourseMode(modeParam));
  if (restart) params.set('restart', '1');
  if (challenge) params.set('challenge', challenge);
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

const CHALLENGE_LABELS: Record<string, string> = {
  'speed-30s': '30秒极速',
  'focus-3min': '3分钟训练',
  'perfect-run': 'Perfect Run',
  'combo-rush': 'Combo Rush',
};

export function CompletePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const challengeParam = searchParams.get('challenge') as ChallengeMode | null;
  const runIdParam = searchParams.get('runId');
  const coursesQuery = buildQuery(modeParam);
  const restartQuery = buildQuery(modeParam, true, challengeParam);
  const typingStats = useTypingStatsStore((s) => s.typingStats);
  const { maxCombo } = useComboStore();
  const currentCourse = useCourseSessionStore((s) => s.currentCourse);
  const [showContent, setShowContent] = useState(false);
  const latestResult = useChallengeStore((s) => s.latestResult);

  // Load challenge run result
  const [challengeResult, setChallengeResult] = useState<ChallengeRunResult | null>(latestResult);
  const [leaderboard, setLeaderboard] = useState<ChallengeRunResult[]>([]);

  const isChallenge = Boolean(challengeParam);

  useEffect(() => {
    try { initSound(); } catch (_) { /* ignore */ }
    playSound('complete');

    const timer = setTimeout(() => setShowContent(true), 120);
    return () => clearTimeout(timer);
  }, []);

  // Load challenge data
  useEffect(() => {
    if (!isChallenge || !courseId || !challengeParam) return;

    // Try store first, then load by runId
    const stored = useChallengeStore.getState().latestResult;
    if (stored && stored.challengeMode === challengeParam && stored.packId === courseId) {
      setChallengeResult(stored);
    } else if (runIdParam) {
      challengeService.getRun(Number(runIdParam)).then((run) => {
        if (run && run.challengeMode === challengeParam && run.packId === courseId) {
          setChallengeResult(run);
        }
      });
    }

    // Load leaderboard
    challengeService.getLeaderboard(courseId, challengeParam, 5).then(setLeaderboard);
    // Refresh best
    useChallengeStore.getState().refreshBest(courseId, challengeParam);
  }, [isChallenge, courseId, challengeParam, runIdParam]);

  const trainingStats = useGrowthStore((s) => (courseId ? s.packGrowth[courseId] : null));

  useEffect(() => {
    if (courseId) {
      useGrowthStore.getState().refreshPackGrowth(courseId);
    }
  }, [courseId]);

  const flowScore = isChallenge && challengeResult
    ? challengeResult.flowScore
    : Math.max(
        0,
        Math.round((typingStats.wpm * typingStats.accuracy) / 100 + maxCombo * 0.4 - typingStats.errors * 1.5 + ((typingStats.backspaces === 0 && typingStats.errors === 0) ? 8 : 0)),
      );
  const hasTypingResult = isChallenge ? Boolean(challengeResult) : typingStats.totalKeystrokes > 0;
  const isBestWpm =
    hasTypingResult && trainingStats?.bestWpm ? typingStats.wpm >= trainingStats.bestWpm : false;
  const isBestCombo =
    isChallenge ? (challengeResult?.isNewBest ?? false) : (maxCombo > 0 && trainingStats?.bestCombo ? maxCombo >= trainingStats.bestCombo : false);
  const isBestFlowScore =
    hasTypingResult && trainingStats?.bestFlowScore ? flowScore >= trainingStats.bestFlowScore : false;
  const hasRecord = challengeResult?.isNewBest || (!isChallenge && (isBestWpm || isBestCombo || isBestFlowScore));
  const isTopTen = challengeResult?.isTopTen ?? false;

  const resultWpm = isChallenge && challengeResult ? challengeResult.wpm : typingStats.wpm;
  const resultAccuracy = isChallenge && challengeResult ? challengeResult.accuracy : typingStats.accuracy;
  const resultMaxCombo = isChallenge && challengeResult ? challengeResult.maxCombo : maxCombo;
  const otherModes: ChallengeMode[] = (['speed-30s', 'focus-3min', 'perfect-run', 'combo-rush'] as ChallengeMode[])
    .filter((m) => m !== challengeParam);

  return (
    <div className="min-h-full overflow-y-auto bg-bg-app px-4 py-6 sm:px-6 sm:py-8">
      <div
        className={`mx-auto w-full max-w-5xl space-y-6 pb-8 ${
          showContent ? 'animate-slide-up-fade' : 'opacity-0'
        }`}
      >
        {/* Header */}
        <div className="text-center">
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${
            isChallenge && challengeResult?.isNewBest
              ? 'border-accent-record/40 bg-accent-record/15'
              : 'border-success-500/30 bg-success-500/15'
          }`}>
            {isChallenge && challengeResult?.isNewBest ? (
              <svg className="h-7 w-7 text-accent-record" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="h-7 w-7 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold text-text-primary">
            {isChallenge ? '挑战完成' : '本轮训练完成'}
          </h1>
          {isChallenge && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-accent-record/10 text-accent-record border border-accent-record/20">
              {CHALLENGE_LABELS[challengeParam!]}
            </span>
          )}
          <p className="mt-2 text-sm text-text-muted">
            {isChallenge
              ? `${currentCourse?.title ?? '训练包'} · ${CHALLENGE_LABELS[challengeParam!]}`
              : `${currentCourse?.title ?? '训练包'} 已完成，下面是这轮表现。`}
          </p>

          {/* Flow Score 大号展示 (挑战模式) */}
          {isChallenge && (
            <div className="mt-4">
              <div className="text-5xl font-bold font-mono text-accent-record">{flowScore}</div>
              <div className="mt-1 text-xs text-text-muted">Flow Score</div>
            </div>
          )}

          {(hasRecord || isTopTen) && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {/* Record badge */}
              {hasRecord && (
                <div className="inline-flex items-center gap-1.5 rounded-brand border border-accent-record/30 bg-accent-record/10 px-3 py-1 text-xs font-medium text-accent-record">
                  <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {challengeResult?.isNewBest
                    ? '新纪录！'
                    : isBestWpm && isBestFlowScore ? 'WPM 和 Flow 新纪录'
                    : isBestWpm && isBestCombo ? 'WPM 和 Combo 新纪录'
                    : isBestFlowScore && isBestCombo ? 'Flow 和 Combo 新纪录'
                    : isBestWpm ? 'WPM 新纪录'
                    : isBestFlowScore ? 'Flow 新纪录'
                    : 'Combo 新纪录'}
                </div>
              )}

              {/* Top 10 badge */}
              {isTopTen && (
                <div className="inline-flex items-center gap-1.5 rounded-brand border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                  <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  进入 Top 10
                  {challengeResult?.rank && ` · 第 ${challengeResult.rank} 名`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ResultStat
            label="WPM"
            value={hasTypingResult ? resultWpm : '--'}
            tone={isBestWpm ? 'text-accent-record' : 'text-accent-primary'}
            sub={trainingStats?.bestWpm ? `最佳 ${trainingStats.bestWpm}` : '待记录'}
          />
          <ResultStat
            label="准确率"
            value={hasTypingResult ? `${resultAccuracy}%` : '--'}
            tone={resultAccuracy >= 95 ? 'text-success-400' : 'text-warning-400'}
            sub={isChallenge ? `${challengeResult?.charsTyped ?? 0} 字符` : hasTypingResult ? `${typingStats.totalKeystrokes} 键` : '未记录'}
          />
          <ResultStat
            label="Max Combo"
            value={resultMaxCombo > 0 ? `x${resultMaxCombo}` : '--'}
            tone={isBestCombo ? 'text-accent-record' : 'text-primary-300'}
            sub={trainingStats?.bestCombo ? `最佳 x${trainingStats.bestCombo}` : '待记录'}
          />
          <ResultStat
            label="Flow Score"
            value={hasTypingResult ? flowScore : '--'}
            tone={isBestFlowScore || challengeResult?.isNewBest ? 'text-accent-record' : 'text-success-400'}
            sub={isChallenge
              ? `${challengeResult?.completedSegments ?? 0} 片段 · ${challengeResult?.perfectSegments ?? 0} Perfect`
              : trainingStats?.bestFlowScore ? `最佳 ${trainingStats.bestFlowScore}` : '节奏分'}
          />
        </div>

        {/* Challenge leaderboard */}
        {isChallenge && leaderboard.length > 0 && (
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel/70 p-4">
            <h3 className="text-xs font-semibold text-text-primary mb-3">
              {CHALLENGE_LABELS[challengeParam!]} · Top 5
            </h3>
            <div className="space-y-1.5">
              {leaderboard.map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between px-3 py-1.5 rounded text-xs ${
                    r.id === challengeResult?.id
                      ? 'bg-accent-record/10 border border-accent-record/20'
                      : 'bg-bg-app/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-mono font-bold ${
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-text-muted'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-text-primary font-mono font-bold">{r.flowScore}</span>
                    <span className="text-text-muted">Flow</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-disabled">
                    <span>{r.wpm} WPM</span>
                    <span>{r.accuracy}%</span>
                    <span>x{r.maxCombo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share card (challenge mode) */}
        {isChallenge && challengeResult && (
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel/70 p-4">
            <h3 className="text-xs font-semibold text-text-primary mb-3">分享成绩图</h3>
            <ShareCard
              result={challengeResult}
              packTitle={currentCourse?.title ?? challengeResult.packId}
            />
          </div>
        )}

        {/* Next steps */}
        <div className="rounded-tool border border-gray-700/40 bg-bg-panel/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                {isChallenge ? '再来一局' : '下一步'}
              </h2>
              <p className="mt-1 text-xs text-text-muted">
                {isChallenge
                  ? '挑战相同模式，刷新你的最佳纪录。'
                  : '继续保持手感，优先复刷同一训练包，或去挑下一组高频片段。'}
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2 flex-wrap">
              <Link
                to={courseId ? `/learn/${courseId}${restartQuery}` : `/courses${coursesQuery}`}
                onClick={() => playSound('click')}
                className="rounded-tool bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              >
                {isChallenge ? `再来${CHALLENGE_LABELS[challengeParam!]}` : '再来一轮'}
              </Link>
              {isChallenge && otherModes.length > 0 && (
                <Link
                  to={`/learn/${courseId}?mode=typing&challenge=${otherModes[0]}`}
                  onClick={() => playSound('click')}
                  className="rounded-tool border border-gray-700/50 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary-500/40 hover:text-text-primary"
                >
                  换{CHALLENGE_LABELS[otherModes[0]]}
                </Link>
              )}
              {!isChallenge && (
                <Link
                  to={`/courses${coursesQuery}`}
                  onClick={() => playSound('click')}
                  className="rounded-tool border border-gray-700/50 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary-500/40 hover:text-text-primary"
                >
                  下一组训练
                </Link>
              )}
            </div>
          </div>
          {isChallenge && (
            <div className="mt-3 flex gap-2">
              {otherModes.slice(1).map((m) => (
                <Link
                  key={m}
                  to={`/learn/${courseId}?mode=typing&challenge=${m}`}
                  onClick={() => playSound('click')}
                  className="rounded-tool border border-gray-700/30 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-gray-600/50 hover:text-text-secondary"
                >
                  {CHALLENGE_LABELS[m]}
                </Link>
              ))}
            </div>
          )}
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
