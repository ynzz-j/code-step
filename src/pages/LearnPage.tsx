import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { useTypingStatsStore } from '@/stores/typingStatsStore';
import { useComboStore } from '@/stores/comboStore';
import { normalizeCourseMode } from '@/services/courseService';
import { InstructionPanel } from '@/components/learn/InstructionPanel';
import { ProgressDots } from '@/components/learn/ProgressDots';
import { TypingEditor } from '@/components/editor/TypingEditor';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ComboDisplay } from '@/components/learn/ComboDisplay';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { PerfectStrike } from '@/components/learn/PerfectStrike';
import { WpmChart } from '@/components/learn/WpmChart';
import { useChartStore } from '@/stores/chartStore';
import { useUserStore } from '@/stores/userStore';
import { growthService } from '@/services/growthService';
import { useGrowthStore } from '@/stores/growthStore';
import { challengeService } from '@/services/challengeService';
import { useChallengeStore } from '@/stores/challengeStore';
import { publishObsStats } from '@/services/obsStatsPublisher';
import type { Step, TypingStep, TypingAttemptPayload, ChallengeMode, ChallengeRunPayload, PatternMastery } from '@/types';
import type { TypingCompleteData } from '@/components/editor/TypingEditor';

const AUTO_NEXT_DELAY_MS = 1200;

interface StepSummary {
  wpm: number;
  accuracy: number;
  errors: number;
  maxCombo: number;
  flowScore: number;
  perfectSegments: number;
  durationMs: number;
  backspaces: number;
  perfect: boolean;
}

function getTypingStepPatternId(step: TypingStep) {
  return step.patternId || step.concept.toLowerCase().replace(/\s+/g, '-');
}

function buildWeakFirstStepOrder(steps: Step[], patternMastery: PatternMastery[]) {
  const fallbackOrder = steps.map((_, index) => index);
  if (patternMastery.length === 0) return fallbackOrder;

  const masteryByPattern = new Map(patternMastery.map((item) => [item.patternId, item]));

  return fallbackOrder
    .map((index) => {
      const step = steps[index];
      if (step.type !== 'typing') {
        return { index, bucket: 3, weakness: 100, originalIndex: index };
      }

      const mastery = masteryByPattern.get(getTypingStepPatternId(step));
      if (!mastery) {
        return { index, bucket: 1, weakness: 50, originalIndex: index };
      }

      const masteryPercent = Number.isFinite(mastery.masteryPercent) ? mastery.masteryPercent : 0;
      const bucket = masteryPercent < 70 ? 0 : 2;
      return { index, bucket, weakness: masteryPercent, originalIndex: index };
    })
    .sort((a, b) => a.bucket - b.bucket || a.weakness - b.weakness || a.originalIndex - b.originalIndex)
    .map((item) => item.index);
}

export function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const restartParam = searchParams.get('restart');
  const mode = modeParam ? normalizeCourseMode(modeParam) : undefined;
  const coursesQuery = modeParam ? `?mode=${mode}` : '';
  const navigate = useNavigate();
  const prevComboRef = useRef(0);
  // 步骤输入完成标记（独立于 store 的 currentStepCompleted）
  const [stepInputDone, setStepInputDone] = useState(false);
  const [stepSummary, setStepSummary] = useState<StepSummary | null>(null);
  const [autoAdvancePercent, setAutoAdvancePercent] = useState(0);
  const [autoAdvancePaused, setAutoAdvancePaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const autoAdvanceTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stepStartedAtRef = useRef(Date.now());
  const challengeStartedAtRef = useRef(Date.now());
  const weakTokenCountsRef = useRef<Record<string, number>>({});
  // 完美一击
  const [perfectStrikeVisible, setPerfectStrikeVisible] = useState(false);
  const [perfectRunFailed, setPerfectRunFailed] = useState(false);

  // ===== 挑战模式状态 =====
  const challengeParam = searchParams.get('challenge') as ChallengeMode | null;
  const challengeMode: ChallengeMode | null =
    challengeParam && ['speed-30s', 'focus-3min', 'perfect-run', 'combo-rush'].includes(challengeParam)
      ? challengeParam
      : null;
  const challengeRunIdRef = useRef<number | null>(null);
  const challengeStepOrderRef = useRef<number[]>([]);
  const challengeOrderPositionRef = useRef(0);
  const challengeStatsRef = useRef({
    charsTyped: 0,
    correctChars: 0,
    completedSegments: 0,
    perfectSegments: 0,
    perfectFailed: false,
    maxCombo: 0,
    totalErrors: 0,
    totalBackspaces: 0,
  });
  const challengeSettledRef = useRef(false);
  const segmentWeakTokenCountsRef = useRef<Record<string, number>>({});

  // 倒计时 (秒)
  const getInitialCountdown = () => {
    if (challengeMode === 'speed-30s') return 30;
    if (challengeMode === 'focus-3min') return 180;
    return 0;
  };
  const [challengeCountdown, setChallengeCountdown] = useState(getInitialCountdown);
  const challengeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Combo rush idle 计时
  const comboIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearChallengeTimer = useCallback(() => {
    if (challengeTimerRef.current) {
      clearInterval(challengeTimerRef.current);
      challengeTimerRef.current = null;
    }
  }, []);

  const isTimedChallenge = challengeMode === 'speed-30s' || challengeMode === 'focus-3min';
  const wpm = useTypingStatsStore((s) => s.typingStats.wpm);
  const accuracy = useTypingStatsStore((s) => s.typingStats.accuracy);
  const {
    currentCourse,
    currentStepIndex,
    completedSteps,
    startCourse,
    nextStep,
    prevStep,
    markStepCompleted,
    resetProgress,
  } = useCourseSessionStore();
  const recordTypingKeystroke = useTypingStatsStore((s) => s.recordTypingKeystroke);
  const resetTypingStats = useTypingStatsStore((s) => s.resetTypingStats);
  const { currentCombo, maxCombo, incrementCombo, resetCombo } = useComboStore();
  const addCompletedCourse = useUserStore((s) => s.addCompletedCourse);

  // currentStepCompleted 由 completedSteps 推导
  const currentStepCompleted = completedSteps.has(currentStepIndex);

  const clearAutoAdvanceTimers = useCallback(() => {
    autoAdvanceTimersRef.current.forEach(clearTimeout);
    autoAdvanceTimersRef.current = [];
  }, []);

  useEffect(() => {
    challengeRunIdRef.current = null;
    challengeStepOrderRef.current = [];
    challengeOrderPositionRef.current = 0;
    challengeSettledRef.current = false;
    challengeStartedAtRef.current = Date.now();
    segmentWeakTokenCountsRef.current = {};
    challengeStatsRef.current = {
      charsTyped: 0,
      correctChars: 0,
      completedSegments: 0,
      perfectSegments: 0,
      perfectFailed: false,
      maxCombo: 0,
      totalErrors: 0,
      totalBackspaces: 0,
    };
    setPerfectRunFailed(false);
    setChallengeCountdown(getInitialCountdown());
    clearChallengeTimer();
    if (comboIdleTimerRef.current) clearTimeout(comboIdleTimerRef.current);
    useChallengeStore.getState().setMode(challengeMode);
  }, [challengeMode, clearChallengeTimer, courseId]);

  // 进入课程时加载
  useEffect(() => {
    if (courseId) {
      useComboStore.getState().resetAllCombo();
      useTypingStatsStore.getState().resetTypingStats();
      startCourse(courseId, mode);
    }
  }, [courseId, mode, startCourse]);

  useEffect(() => {
    if (restartParam === '1' && currentCourse?.id === courseId) {
      resetProgress();
      useComboStore.getState().resetAllCombo();
      useTypingStatsStore.getState().resetTypingStats();
      useChartStore.getState().resetChart();
      stepStartedAtRef.current = Date.now();
      weakTokenCountsRef.current = {};
    }
  }, [courseId, currentCourse?.id, resetProgress, restartParam]);

  // 切换步骤时重置输入完成标记
  useEffect(() => {
    setStepInputDone(false);
    setStepSummary(null);
    setAutoAdvancePercent(0);
    setAutoAdvancePaused(false);
    clearAutoAdvanceTimers();
    stepStartedAtRef.current = Date.now();
    segmentWeakTokenCountsRef.current = {};
    if (!challengeMode) {
      weakTokenCountsRef.current = {};
    }
  }, [challengeMode, clearAutoAdvanceTimers, currentStepIndex]);

  // 连击中断时更新引用
  useEffect(() => {
    prevComboRef.current = currentCombo;
  }, [currentCombo]);

  // 切换步骤时重置图表
  useEffect(() => {
    useChartStore.getState().resetChart();
  }, [currentStepIndex]);

  // ===== 挑战模式：倒计时 =====
  useEffect(() => {
    if (!isTimedChallenge || !currentCourse || stepInputDone || challengeSettledRef.current) {
      clearChallengeTimer();
      return;
    }

    challengeTimerRef.current = setInterval(() => {
      setChallengeCountdown((prev) => {
        if (prev <= 1) {
          // 时间到，结算挑战
          clearChallengeTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearChallengeTimer;
  }, [clearChallengeTimer, currentCourse, isTimedChallenge, stepInputDone]);

  // 倒计时到 0 自动结算
  useEffect(() => {
    if (challengeCountdown === 0 && isTimedChallenge && !challengeSettledRef.current) {
      handleChallengeSettle();
    }
  }, [challengeCountdown]);

  const currentStep = currentCourse?.steps[currentStepIndex];

  useEffect(() => {
    let cancelled = false;

    if (!challengeMode || !currentCourse || !courseId) {
      challengeStepOrderRef.current = [];
      challengeOrderPositionRef.current = 0;
      return;
    }

    const fallbackOrder = currentCourse.steps.map((_, index) => index);
    challengeStepOrderRef.current = fallbackOrder;
    challengeOrderPositionRef.current = 0;

    const applyOrder = (order: number[]) => {
      if (cancelled || order.length === 0) return;

      challengeStepOrderRef.current = order;
      const liveIndex = useCourseSessionStore.getState().currentStepIndex;
      const livePosition = order.indexOf(liveIndex);

      if (
        challengeStatsRef.current.charsTyped === 0 &&
        !stepInputDone &&
        !challengeSettledRef.current
      ) {
        challengeOrderPositionRef.current = 0;
        useCourseSessionStore.setState({ currentStepIndex: order[0] });
        return;
      }

      challengeOrderPositionRef.current = livePosition >= 0 ? livePosition : 0;
    };

    applyOrder(fallbackOrder);

    growthService.getTrainingPackPatternMastery(courseId).then((patternMastery) => {
      applyOrder(buildWeakFirstStepOrder(currentCourse.steps, patternMastery));
    });

    return () => {
      cancelled = true;
    };
  }, [challengeMode, courseId, currentCourse, stepInputDone]);

  useEffect(() => {
    if (!currentCourse || !currentStep) return;

    publishObsStats({
      wpm,
      accuracy,
      combo: maxCombo,
      lesson: [
        currentCourse.title,
        `${currentStepIndex + 1}/${currentCourse.steps.length}`,
        currentStep.title,
      ].filter(Boolean).join(' - '),
      tagline: stepInputDone
        ? 'Segment complete'
        : challengeMode
        ? `Challenge: ${challengeMode}`
        : 'Live training',
    });
  }, [accuracy, challengeMode, currentCourse, currentStep, currentStepIndex, maxCombo, stepInputDone, wpm]);

  const normalizeWeakToken = (token: string) => {
    if (token === ' ') return 'space';
    if (token === '\n') return 'enter';
    if (token === '\t') return 'tab';
    if (token === '    ') return 'tab spaces';
    return token;
  };

  // 打字按键回调：更新打字统计 + 连击
  const handleKeystroke = (isCorrect: boolean, info?: { expected: string; input: string; position: number }) => {
    recordTypingKeystroke(isCorrect);
    if (challengeMode) {
      challengeStatsRef.current.charsTyped++;
      if (isCorrect) challengeStatsRef.current.correctChars++;
      if (!isCorrect) challengeStatsRef.current.totalErrors++;
    }
    if (isCorrect) {
      incrementCombo();
      if (challengeMode) {
        const latestMaxCombo = useComboStore.getState().maxCombo;
        challengeStatsRef.current.maxCombo = Math.max(challengeStatsRef.current.maxCombo, latestMaxCombo);
      }
      // combo-rush: reset idle timer on correct keystroke
      if (challengeMode === 'combo-rush') {
        if (comboIdleTimerRef.current) clearTimeout(comboIdleTimerRef.current);
        comboIdleTimerRef.current = setTimeout(() => {
          resetCombo();
        }, 3000);
      }
    } else {
      resetCombo();
      // perfect-run: mark failed on first error/backspace
      if (challengeMode === 'perfect-run') {
        challengeStatsRef.current.perfectFailed = true;
        setPerfectRunFailed(true);
      }
      if (info?.expected) {
        const token = normalizeWeakToken(info.expected);
        weakTokenCountsRef.current[token] = (weakTokenCountsRef.current[token] ?? 0) + 1;
        segmentWeakTokenCountsRef.current[token] = (segmentWeakTokenCountsRef.current[token] ?? 0) + 1;
      }
    }
  };

  const handleBackspace = () => {
    if (!challengeMode) return;
    challengeStatsRef.current.totalBackspaces++;
    if (challengeMode === 'perfect-run') {
      challengeStatsRef.current.perfectFailed = true;
      setPerfectRunFailed(true);
    }
  };

  // TypingEditor 打完字时的回调：只标记输入完成，不触发跳转
  const buildStepSummary = (data: TypingCompleteData) => {
    const { typingStats } = useTypingStatsStore.getState();
    const { maxCombo: latestMaxCombo } = useComboStore.getState();
    const perfectBonus = (data.backspaces === 0 && typingStats.errors === 0) ? 8 : 0;
    const flowScore = Math.max(
      0,
      Math.round((typingStats.wpm * typingStats.accuracy) / 100 + latestMaxCombo * 0.4 - typingStats.errors * 1.5 + perfectBonus),
    );

    return {
      wpm: typingStats.wpm,
      accuracy: typingStats.accuracy,
      errors: typingStats.errors,
      maxCombo: latestMaxCombo,
      flowScore,
      perfectSegments: (data.backspaces === 0 && typingStats.errors === 0) ? 1 : 0,
      durationMs: data.durationMs,
      backspaces: data.backspaces,
      perfect: data.backspaces === 0 && typingStats.errors === 0,
    };
  };

  const recordTypingAttemptToDb = async (
    summary: StepSummary,
    weakTokenCounts: Record<string, number> = weakTokenCountsRef.current,
  ) => {
    if (!courseId || !currentCourse || !currentStep) return;

    const weakTokens = Object.entries(weakTokenCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .map(([token]) => token);

    const stepTypingStep = currentStep as TypingStep;
    const patternId = getTypingStepPatternId(stepTypingStep);
    const localDay = new Date().toISOString().slice(0, 10);

    const payload: TypingAttemptPayload = {
      courseId,
      stepIndex: currentStepIndex,
      patternId,
      wpm: summary.wpm,
      rawWpm: Math.round(summary.wpm * 1.05),
      accuracy: summary.accuracy,
      errors: summary.errors,
      backspaces: summary.backspaces,
      maxCombo: summary.maxCombo,
      flowScore: summary.flowScore,
      durationMs: summary.durationMs,
      perfect: summary.perfect,
      weakTokens,
      localDay,
    };

    await growthService.recordTypingAttempt(payload);
    useGrowthStore.getState().refreshPackGrowth(courseId);
    useGrowthStore.getState().refreshSummary();
  };

  const handleTypingComplete = (data: TypingCompleteData) => {
    const summary = buildStepSummary(data);
    setStepInputDone(true);
    setStepSummary(summary);
    if (!challengeMode) {
      recordTypingAttemptToDb(summary);
    }

    // 挑战模式：累加片段统计
    if (challengeMode) {
      recordTypingAttemptToDb(summary, segmentWeakTokenCountsRef.current);
      challengeStatsRef.current.completedSegments++;
      challengeStatsRef.current.maxCombo = Math.max(challengeStatsRef.current.maxCombo, summary.maxCombo);
      if (summary.perfect) challengeStatsRef.current.perfectSegments++;
      // backspace counts as error for perfect-run
      if (challengeMode === 'perfect-run' && (data.backspaces > 0 || summary.errors > 0)) {
        challengeStatsRef.current.perfectFailed = true;
        setPerfectRunFailed(true);
      }
    }
  };

  // 挑战结算：计算 Flow Score，写入 DB，导航到完成页
  const handleChallengeSettle = async () => {
    if (!courseId || challengeSettledRef.current) return;
    challengeSettledRef.current = true;

    clearChallengeTimer();

    const stats = challengeStatsRef.current;
    const totalDurationMs = isTimedChallenge
      ? (getInitialCountdown() - challengeCountdown) * 1000
      : Date.now() - challengeStartedAtRef.current;
    const durationMinutes = Math.max(totalDurationMs / 60000, 1 / 60000);
    const runWpm = Math.round((stats.correctChars / 5) / durationMinutes);
    const runRawWpm = Math.round((stats.charsTyped / 5) / durationMinutes);
    const runAccuracy = stats.charsTyped > 0
      ? Math.round((stats.correctChars / stats.charsTyped) * 100)
      : 100;

    // 计算 Flow Score（含模式加成）
    const base = (runWpm * runAccuracy) / 100;
    const comboBonus = Math.min(stats.maxCombo * 0.45, 35);
    const perfectBonus = stats.perfectSegments * 5;
    const stabilityPenalty = stats.totalErrors * 1.8 + stats.totalBackspaces * 0.8;
    let modeBonus = 0;
    switch (challengeMode) {
      case 'speed-30s':
        modeBonus = stats.completedSegments * 2;
        break;
      case 'focus-3min':
        modeBonus = Math.min(totalDurationMs / 60000, 3) * 3;
        break;
      case 'perfect-run':
        modeBonus = stats.perfectFailed ? -20 : 25;
        break;
      case 'combo-rush':
        modeBonus = Math.min(stats.maxCombo / 10, 8);
        break;
    }
    const flowScore = Math.max(0, Math.round(base + comboBonus + perfectBonus + modeBonus - stabilityPenalty));

    const weakTokens = Object.entries(weakTokenCountsRef.current)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([t]) => t);

    const payload: ChallengeRunPayload = {
      packId: courseId,
      challengeMode: challengeMode!,
      durationMs: totalDurationMs,
      charsTyped: stats.charsTyped,
      correctChars: stats.correctChars,
      completedSegments: stats.completedSegments,
      wpm: runWpm,
      rawWpm: runRawWpm,
      accuracy: runAccuracy,
      errors: stats.totalErrors,
      backspaces: stats.totalBackspaces,
      maxCombo: stats.maxCombo,
      perfectSegments: stats.perfectSegments,
      perfectFailed: stats.perfectFailed,
      flowScore,
      rankScore: flowScore,
      weakTokens,
    };

    const result = await challengeService.recordRun(payload);
    if (result) {
      challengeRunIdRef.current = result.id;
      useChallengeStore.getState().setLatestResult(result);
    }

    // 同时写入成长系统
    await growthService.recordTypingAttempt({
      courseId,
      stepIndex: 0,
      patternId: challengeMode!,
      wpm: runWpm,
      rawWpm: runRawWpm,
      accuracy: runAccuracy,
      errors: stats.totalErrors,
      backspaces: stats.totalBackspaces,
      maxCombo: stats.maxCombo,
      flowScore,
      durationMs: totalDurationMs,
      perfect: stats.perfectSegments > 0 && !stats.perfectFailed,
      weakTokens,
      localDay: new Date().toISOString().slice(0, 10),
    });
    useGrowthStore.getState().refreshPackGrowth(courseId);
    useGrowthStore.getState().refreshSummary();

    const runId = challengeRunIdRef.current;
    navigate(`/complete/${courseId}?mode=typing&challenge=${challengeMode}&runId=${runId}`);
  };

  // CodeEditor 通过时的回调：只标记输入完成，不触发跳转
  const handleCodingComplete = () => {
    const data: TypingCompleteData = { backspaces: 0, perfect: false, durationMs: Date.now() - stepStartedAtRef.current };
    const summary = buildStepSummary(data);
    setStepInputDone(true);
    setStepSummary(summary);
    recordTypingAttemptToDb(summary);
  };

  // 完美一击回调
  const handlePerfectStrike = useCallback(() => {
    setPerfectStrikeVisible(true);
  }, []);

  const handlePerfectStrikeComplete = useCallback(() => {
    setPerfectStrikeVisible(false);
  }, []);

  const resetSegmentInput = (options?: { preserveWeakTokens?: boolean; preserveCombo?: boolean }) => {
    clearAutoAdvanceTimers();
    setStepInputDone(false);
    setStepSummary(null);
    setAutoAdvancePercent(0);
    setAutoAdvancePaused(false);
    stepStartedAtRef.current = Date.now();
    segmentWeakTokenCountsRef.current = {};
    if (!options?.preserveWeakTokens) {
      weakTokenCountsRef.current = {};
    }
    setReplayKey((value) => value + 1);
    resetTypingStats();
    if (!options?.preserveCombo) {
      resetCombo();
    }
    useChartStore.getState().resetChart();
  };

  const advanceChallengeSegment = () => {
    const { currentCourse: course, currentStepIndex: index } = useCourseSessionStore.getState();
    if (!course) return;
    const order = challengeStepOrderRef.current.length > 0
      ? challengeStepOrderRef.current
      : course.steps.map((_, stepIndex) => stepIndex);
    if (order.length === 0) return;
    const currentPosition = order.indexOf(index);
    const nextPosition = currentPosition >= 0
      ? (currentPosition + 1) % order.length
      : (challengeOrderPositionRef.current + 1) % order.length;
    challengeOrderPositionRef.current = nextPosition;
    const nextIndex = order[nextPosition];
    useCourseSessionStore.setState({ currentStepIndex: nextIndex });
    resetSegmentInput({ preserveWeakTokens: true, preserveCombo: true });
  };

  // 用户主动确认进入下一步
  const handleGoNext = (force = false) => {
    clearAutoAdvanceTimers();
    setAutoAdvancePaused(false);

    if (!force && !stepInputDone && !currentStepCompleted) return;

    // 挑战模式：片段完成后进入下一个训练片段，末尾循环回第一段
    if (challengeMode && !challengeSettledRef.current) {
      advanceChallengeSegment();
      return;
    }

    // 标记步骤完成到 store
    if (!currentStepCompleted) {
      markStepCompleted();
    }

    // 判断是否是最后一步（从 store 实时读取，避免闭包问题）
    const { currentCourse: course, currentStepIndex: idx } = useCourseSessionStore.getState();
    const isLast = course && idx === course.steps.length - 1;

    if (isLast) {
      if (courseId) {
        addCompletedCourse(courseId);
      }
      navigate(`/complete/${courseId}${coursesQuery}`);
    } else {
      nextStep();
    }
  };

  const handleReplayStep = () => {
    resetSegmentInput({
      preserveWeakTokens: Boolean(challengeMode),
      preserveCombo: false,
    });
  };

  const handleStopTraining = () => {
    clearAutoAdvanceTimers();
    setAutoAdvancePaused(false);
    clearChallengeTimer();
    if (comboIdleTimerRef.current) clearTimeout(comboIdleTimerRef.current);
    useChallengeStore.getState().clearChallenge();
    navigate(`/courses${coursesQuery}`);
  };

  const handleToggleAutoAdvance = () => {
    if (isLastStep) return;
    if (!autoAdvancePaused) {
      clearAutoAdvanceTimers();
    }
    setAutoAdvancePaused((value) => !value);
  };

  useEffect(() => {
    if (!stepInputDone || !stepSummary) return;

    if (!challengeMode && !currentStepCompleted) {
      markStepCompleted();
    }

    if (autoAdvancePaused) {
      clearAutoAdvanceTimers();
      return;
    }

    const startPercent = autoAdvancePercent;
    const remainingMs = Math.max(
      0,
      Math.round(AUTO_NEXT_DELAY_MS * (1 - startPercent / 100)),
    );
    const startedAt = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const nextPercent = remainingMs === 0
        ? 100
        : startPercent + Math.round((elapsed / remainingMs) * (100 - startPercent));
      setAutoAdvancePercent(Math.min(100, nextPercent));
      if (elapsed < remainingMs) {
        autoAdvanceTimersRef.current.push(setTimeout(tick, 80));
      }
    };

    tick();
    autoAdvanceTimersRef.current.push(setTimeout(() => handleGoNext(true), remainingMs));

    return () => {
      clearAutoAdvanceTimers();
    };
  }, [autoAdvancePaused, challengeMode, clearAutoAdvanceTimers, currentStepCompleted, markStepCompleted, stepInputDone, stepSummary]);

  useKeyboardShortcuts(
    {
      arrowleft: prevStep,
      arrowright: (stepInputDone || currentStepCompleted) ? handleGoNext : undefined,
      escape: () => navigate(`/courses${coursesQuery}`),
    },
    !!currentCourse,
  );

  if (!currentCourse || !currentStep) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-16 h-16 mb-4 rounded-full bg-bg-panel flex items-center justify-center">
          <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">加载课程中...</h3>
        <p className="text-sm text-text-secondary">课程 ID: {courseId || '未知'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-bg-panel rounded-tool transition-colors"
        >
          重新加载
        </button>
      </div>
    );
  }

  const isLastStep = currentCourse && currentStepIndex === currentCourse.steps.length - 1;

  const challengeLabel: Record<string, string> = {
    'speed-30s': '30秒极速',
    'focus-3min': '3分钟训练',
    'perfect-run': 'Perfect Run',
    'combo-rush': 'Combo Rush',
  };

  return (
    <div className="flex flex-col h-full">
      {/* 顶部状态栏：紧凑布局 */}
      <div className="flex items-center gap-3 px-4 py-2 bg-bg-panel/50 border-b border-bg-surface/50">
        <button
          onClick={handleStopTraining}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          退出
        </button>
        {/* 挑战模式标签 */}
        {challengeMode && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-record/15 text-accent-record border border-accent-record/30">
            {challengeLabel[challengeMode]}
          </span>
        )}
        <span className="text-xs font-medium text-text-primary truncate">{currentCourse.title}</span>
        {/* 非挑战模式显示步骤进度 */}
        {!challengeMode && (
          <>
            <ProgressDots total={currentCourse.steps.length} current={currentStepIndex} />
            <span className="text-[10px] text-text-muted ml-auto">
              {currentStepIndex + 1} / {currentCourse.steps.length}
            </span>
          </>
        )}
        {/* 挑战模式：倒计时 + segment 计数 */}
        {challengeMode && (
          <span className="text-[10px] text-text-muted ml-auto">
            {isTimedChallenge && (
              <span className={`font-mono font-bold mr-2 ${challengeCountdown <= 10 ? 'text-error-400' : challengeCountdown <= 30 ? 'text-warning-400' : 'text-primary-300'}`}>
                {Math.floor(challengeCountdown / 60)}:{String(challengeCountdown % 60).padStart(2, '0')}
              </span>
            )}
            片段 {challengeStatsRef.current.completedSegments}
          </span>
        )}
        {/* 紧凑型 Combo 显示 */}
        <ComboDisplay compact />
        {/* perfect-run 状态徽章 */}
        {challengeMode === 'perfect-run' && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
            perfectRunFailed
              ? 'bg-error-500/15 text-error-400 border border-error-500/30'
              : 'bg-success-500/15 text-success-400 border border-success-500/30'
          }`}>
            {perfectRunFailed ? 'PERFECT FAILED' : 'PERFECT'}
          </span>
        )}
      </div>

      {/* 挑战倒计时条 */}
      {isTimedChallenge && (
        <div className="h-1 bg-bg-surface">
          <div
            className={`h-full transition-all duration-1000 ${
              challengeCountdown <= 10 ? 'bg-error-500' : challengeCountdown <= 30 ? 'bg-warning-500' : 'bg-primary-500'
            }`}
            style={{ width: `${(challengeCountdown / getInitialCountdown()) * 100}%` }}
          />
        </div>
      )}

      {/* 主内容区：代码输入区占主要空间 */}
      <div className="flex-1 flex overflow-hidden">
        <InstructionPanel step={currentStep} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* 实时图表区域 - 固定区域，不再覆盖编辑器 */}
          {currentStep?.type === 'typing' && (
            <div className="flex-shrink-0 px-4 py-2 border-b border-bg-surface/30">
              <WpmChart wpm={wpm} accuracy={accuracy} />
            </div>
          )}

          {/* 代码编辑器区域 - 占据剩余所有空间 */}
          <div className="flex-1 min-h-0 overflow-auto">
            {currentStep?.type === 'typing' && (
              <TypingEditor
                key={`${currentStepIndex}-${replayKey}`}
                step={currentStep as TypingStep}
                onComplete={handleTypingComplete}
                onKeystroke={handleKeystroke}
                onBackspace={handleBackspace}
                onReset={resetTypingStats}
                onPerfectStrike={handlePerfectStrike}
              />
            )}
            {currentStep?.type === 'coding' && (
              <CodeEditor
                key={`${currentStepIndex}-${replayKey}`}
                step={currentStep}
                language={currentCourse.language}
                onComplete={handleCodingComplete}
              />
            )}
          </div>

          {/* 完美一击特效 */}
          <PerfectStrike
            visible={perfectStrikeVisible}
            onComplete={handlePerfectStrikeComplete}
          />

          {/* 轻量结算 - 底部固定，限制高度 */}
          {stepInputDone && !challengeSettledRef.current && (
            <div className="flex-shrink-0 border-t border-bg-surface/50 bg-bg-panel/95 backdrop-blur">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success-500/15 text-success-300 flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-success-300">片段完成</h3>
                      <p className="text-[10px] text-text-secondary">
                        {challengeMode
                          ? isTimedChallenge
                            ? `剩余 ${challengeCountdown}秒，继续下一个片段`
                            : '继续下一个片段'
                          : isLastStep
                          ? '正在进入本轮结果'
                          : autoAdvancePaused
                          ? '自动下一段已暂停'
                          : `${AUTO_NEXT_DELAY_MS / 1000}秒后进入下一段`}
                      </p>
                    </div>
                  </div>

                  {stepSummary && (
                    <div className="hidden md:flex items-center gap-4 text-center">
                      <div>
                        <div className="text-base font-bold text-primary-300">{stepSummary.wpm}</div>
                        <div className="text-[10px] text-text-muted">WPM</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-success-300">{stepSummary.accuracy}%</div>
                        <div className="text-[10px] text-text-muted">准确率</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-error-300">{stepSummary.errors}</div>
                        <div className="text-[10px] text-text-muted">错误</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplayStep}
                      className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-surface/70 rounded-tool transition-colors"
                    >
                      再来
                    </button>
                    {challengeMode && (
                      <button
                        onClick={handleChallengeSettle}
                        className="px-3 py-1.5 bg-accent-record hover:bg-accent-record/80 text-white rounded-tool text-xs font-medium transition-colors"
                      >
                        结束挑战
                      </button>
                    )}
                    {!challengeMode && (
                      <>
                        <button
                          onClick={handleStopTraining}
                          className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-surface/70 rounded-tool transition-colors"
                        >
                          停止
                        </button>
                        {!isLastStep && (
                          <button
                            onClick={handleToggleAutoAdvance}
                            className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-surface/70 rounded-tool transition-colors"
                          >
                            {autoAdvancePaused ? '继续自动' : '暂停自动'}
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => handleGoNext(true)}
                      className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-tool text-xs font-medium transition-colors"
                    >
                      {isLastStep && !challengeMode ? '看结果' : '下一段'}
                    </button>
                  </div>
                </div>
                {!challengeMode && (
                  <div className="mt-2 h-0.5 bg-bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success-400 transition-all duration-100"
                      style={{ width: `${autoAdvancePercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
