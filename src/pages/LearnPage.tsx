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
import { recordTrainingPackResult } from '@/utils/trainingPackStats';
import type { TypingStep } from '@/types';

const AUTO_NEXT_DELAY_MS = 1200;

interface StepSummary {
  wpm: number;
  accuracy: number;
  errors: number;
  maxCombo: number;
  flowScore: number;
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
  const weakTokenCountsRef = useRef<Record<string, number>>({});
  // 完美一击
  const [perfectStrikeVisible, setPerfectStrikeVisible] = useState(false);
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
  const { currentCombo, incrementCombo, resetCombo } = useComboStore();
  const updateUserStats = useUserStore((s) => s.updateStats);
  const addCompletedCourse = useUserStore((s) => s.addCompletedCourse);

  // currentStepCompleted 由 completedSteps 推导
  const currentStepCompleted = completedSteps.has(currentStepIndex);

  const clearAutoAdvanceTimers = useCallback(() => {
    autoAdvanceTimersRef.current.forEach(clearTimeout);
    autoAdvanceTimersRef.current = [];
  }, []);

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
    weakTokenCountsRef.current = {};
  }, [clearAutoAdvanceTimers, currentStepIndex]);

  // 连击中断时更新引用
  useEffect(() => {
    prevComboRef.current = currentCombo;
  }, [currentCombo]);

  // 切换步骤时重置图表
  useEffect(() => {
    useChartStore.getState().resetChart();
  }, [currentStepIndex]);

  const currentStep = currentCourse?.steps[currentStepIndex];

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
    if (isCorrect) {
      incrementCombo();
    } else {
      resetCombo();
      if (info?.expected) {
        const token = normalizeWeakToken(info.expected);
        weakTokenCountsRef.current[token] = (weakTokenCountsRef.current[token] ?? 0) + 1;
      }
    }
  };

  // TypingEditor 打完字时的回调：只标记输入完成，不触发跳转
  const buildStepSummary = () => {
    const { typingStats } = useTypingStatsStore.getState();
    const { maxCombo: latestMaxCombo } = useComboStore.getState();
    const flowScore = Math.max(
      0,
      Math.round((typingStats.wpm * typingStats.accuracy) / 100 + latestMaxCombo * 0.4 - typingStats.errors * 1.5),
    );

    return {
      wpm: typingStats.wpm,
      accuracy: typingStats.accuracy,
      errors: typingStats.errors,
      maxCombo: latestMaxCombo,
      flowScore,
    };
  };

  const recordCurrentTrainingPackStats = (summary: StepSummary) => {
    if (!courseId || !currentCourse) return;

    const completed = new Set(completedSteps);
    completed.add(currentStepIndex);
    const masteryPercent = currentCourse.steps.length > 0
      ? Math.round((completed.size / currentCourse.steps.length) * 100)
      : 0;

    recordTrainingPackResult(courseId, {
      wpm: summary.wpm,
      maxCombo: summary.maxCombo,
      masteryPercent,
    });
  };

  const recordCurrentUserStats = (summary: StepSummary) => {
    if (!currentCourse || !currentStep) return;

    const weakTokens = Object.entries(weakTokenCountsRef.current)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([token]) => token);
    const timeSpent = Math.max(1, Math.round((Date.now() - stepStartedAtRef.current) / 1000));

    updateUserStats({
      stepId: currentStep.id,
      courseId: currentCourse.id,
      courseTitle: currentCourse.title,
      concept: currentStep.concept,
      attempts: 1,
      timeSpent,
      errorsCount: summary.errors,
      accuracy: summary.accuracy,
      wpm: summary.wpm,
      maxCombo: summary.maxCombo,
      weakTokens,
      createdAt: new Date().toISOString(),
    });
  };

  const handleTypingComplete = () => {
    const summary = buildStepSummary();
    setStepInputDone(true);
    setStepSummary(summary);
    recordCurrentUserStats(summary);
    recordCurrentTrainingPackStats(summary);
  };

  // CodeEditor 通过时的回调：只标记输入完成，不触发跳转
  const handleCodingComplete = () => {
    const summary = buildStepSummary();
    setStepInputDone(true);
    setStepSummary(summary);
    recordCurrentUserStats(summary);
    recordCurrentTrainingPackStats(summary);
  };

  // 完美一击回调
  const handlePerfectStrike = useCallback(() => {
    setPerfectStrikeVisible(true);
  }, []);

  const handlePerfectStrikeComplete = useCallback(() => {
    setPerfectStrikeVisible(false);
  }, []);

  // 用户主动确认进入下一步
  const handleGoNext = (force = false) => {
    clearAutoAdvanceTimers();
    setAutoAdvancePaused(false);

    if (!force && !stepInputDone && !currentStepCompleted) return;

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
    clearAutoAdvanceTimers();
    setStepInputDone(false);
    setStepSummary(null);
    setAutoAdvancePercent(0);
    setAutoAdvancePaused(false);
    stepStartedAtRef.current = Date.now();
    weakTokenCountsRef.current = {};
    setReplayKey((value) => value + 1);
    resetTypingStats();
    resetCombo();
    useChartStore.getState().resetChart();
  };

  const handleStopTraining = () => {
    clearAutoAdvanceTimers();
    setAutoAdvancePaused(false);
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

    if (!currentStepCompleted) {
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
  }, [autoAdvancePaused, clearAutoAdvanceTimers, currentStepCompleted, markStepCompleted, stepInputDone, stepSummary]);

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

  return (
    <div className="flex flex-col h-full">
      {/* 顶部状态栏：紧凑布局 */}
      <div className="flex items-center gap-3 px-4 py-2 bg-bg-panel/50 border-b border-bg-surface/50">
        <button
          onClick={() => navigate(`/courses${coursesQuery}`)}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          退出
        </button>
        <span className="text-xs font-medium text-text-primary truncate">{currentCourse.title}</span>
        <ProgressDots total={currentCourse.steps.length} current={currentStepIndex} />
        <span className="text-[10px] text-text-muted ml-auto">
          {currentStepIndex + 1} / {currentCourse.steps.length}
        </span>
        {/* 紧凑型 Combo 显示 */}
        <ComboDisplay compact />
      </div>

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
          {stepInputDone && (
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
                        {isLastStep
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
                    <button
                      onClick={() => handleGoNext(true)}
                      className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-tool text-xs font-medium transition-colors"
                    >
                      {isLastStep ? '看结果' : '下一段'}
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-0.5 bg-bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-400 transition-all duration-100"
                    style={{ width: `${autoAdvancePercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
