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
  const mode = modeParam ? normalizeCourseMode(modeParam) : undefined;
  const coursesQuery = modeParam ? `?mode=${mode}` : '';
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);
  const prevComboRef = useRef(0);
  // 步骤输入完成标记（独立于 store 的 currentStepCompleted）
  const [stepInputDone, setStepInputDone] = useState(false);
  const [stepSummary, setStepSummary] = useState<StepSummary | null>(null);
  const [autoAdvancePercent, setAutoAdvancePercent] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const autoAdvanceTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
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
  } = useCourseSessionStore();
  const recordTypingKeystroke = useTypingStatsStore((s) => s.recordTypingKeystroke);
  const resetTypingStats = useTypingStatsStore((s) => s.resetTypingStats);
  const { currentCombo, incrementCombo, resetCombo } = useComboStore();

  // currentStepCompleted 由 completedSteps 推导
  const currentStepCompleted = completedSteps.has(currentStepIndex);

  // 进入课程时加载
  useEffect(() => {
    if (courseId) {
      useComboStore.getState().resetAllCombo();
      useTypingStatsStore.getState().resetTypingStats();
      startCourse(courseId, mode);
    }
  }, [courseId, mode, startCourse]);

  // 切换步骤时重置输入完成标记
  useEffect(() => {
    setStepInputDone(false);
    setStepSummary(null);
    setAutoAdvancePercent(0);
    autoAdvanceTimersRef.current.forEach(clearTimeout);
    autoAdvanceTimersRef.current = [];
  }, [currentStepIndex]);

  // 连击中断时触发屏幕震动
  useEffect(() => {
    if (currentCombo === 0 && prevComboRef.current > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 350);
      return () => clearTimeout(timer);
    }
    prevComboRef.current = currentCombo;
  }, [currentCombo]);

  // 切换步骤时重置图表
  useEffect(() => {
    useChartStore.getState().resetChart();
  }, [currentStepIndex]);

  const currentStep = currentCourse?.steps[currentStepIndex];

  // 打字按键回调：更新打字统计 + 连击
  const handleKeystroke = (isCorrect: boolean) => {
    recordTypingKeystroke(isCorrect);
    if (isCorrect) {
      incrementCombo();
    } else {
      resetCombo();
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

  const handleTypingComplete = () => {
    setStepInputDone(true);
    setStepSummary(buildStepSummary());
  };

  // CodeEditor 通过时的回调：只标记输入完成，不触发跳转
  const handleCodingComplete = () => {
    setStepInputDone(true);
    setStepSummary(buildStepSummary());
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
    autoAdvanceTimersRef.current.forEach(clearTimeout);
    autoAdvanceTimersRef.current = [];

    if (!force && !stepInputDone && !currentStepCompleted) return;

    // 标记步骤完成到 store
    if (!currentStepCompleted) {
      markStepCompleted();
    }

    // 判断是否是最后一步（从 store 实时读取，避免闭包问题）
    const { currentCourse: course, currentStepIndex: idx } = useCourseSessionStore.getState();
    const isLast = course && idx === course.steps.length - 1;

    if (isLast) {
      navigate(`/complete/${courseId}${coursesQuery}`);
    } else {
      nextStep();
    }
  };

  const handleReplayStep = () => {
    autoAdvanceTimersRef.current.forEach(clearTimeout);
    autoAdvanceTimersRef.current = [];
    setStepInputDone(false);
    setStepSummary(null);
    setAutoAdvancePercent(0);
    setReplayKey((value) => value + 1);
    resetTypingStats();
    resetCombo();
    useChartStore.getState().resetChart();
  };

  useEffect(() => {
    if (!stepInputDone || !stepSummary) return;

    if (!currentStepCompleted) {
      markStepCompleted();
    }

    const startedAt = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startedAt;
      setAutoAdvancePercent(Math.min(100, Math.round((elapsed / AUTO_NEXT_DELAY_MS) * 100)));
      if (elapsed < AUTO_NEXT_DELAY_MS) {
        autoAdvanceTimersRef.current.push(setTimeout(tick, 80));
      }
    };

    tick();
    autoAdvanceTimersRef.current.push(setTimeout(() => handleGoNext(true), AUTO_NEXT_DELAY_MS));

    return () => {
      autoAdvanceTimersRef.current.forEach(clearTimeout);
      autoAdvanceTimersRef.current = [];
    };
  }, [currentStepCompleted, markStepCompleted, stepInputDone, stepSummary]);

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
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-200 mb-2">加载课程中...</h3>
        <p className="text-sm text-gray-400">课程 ID: {courseId || '未知'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          重新加载
        </button>
      </div>
    );
  }

  const canGoNext = stepInputDone || currentStepCompleted;
  const isLastStep = currentCourse && currentStepIndex === currentCourse.steps.length - 1;

  return (
    <div className={`flex flex-col h-full animate-fade-in ${isShaking ? 'animate-screen-shake' : ''}`}>
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-800/30 border-b border-gray-700/50">
        <button
          onClick={() => navigate(`/courses${coursesQuery}`)}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          &larr; 退出
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300">{currentCourse.title}</span>
        </div>
        <ProgressDots total={currentCourse.steps.length} current={currentStepIndex} />
      </div>

      {/* 连击展示区 */}
      <ComboDisplay />

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        <InstructionPanel step={currentStep} />
        <div className="flex-1 flex flex-col relative">
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

          {/* 步骤输入完成提示（轻量结算，不打断练习节奏） */}
          {stepInputDone && (
            <div className="absolute inset-x-4 bottom-4 z-10 animate-slide-up-fade">
              <div className="rounded-xl bg-gray-800/95 border border-success-500/30 shadow-lg backdrop-blur px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success-500/15 text-success-300 flex items-center justify-center text-xl font-bold">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-success-300">片段完成</h3>
                      <p className="text-xs text-gray-400">
                        {isLastStep ? '正在进入课程结算' : '默认 1.2 秒后进入下一段'}
                      </p>
                    </div>
                  </div>

                  {stepSummary && (
                    <div className="hidden md:grid grid-cols-5 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary-300">{stepSummary.wpm}</div>
                        <div className="text-[10px] text-gray-500">WPM</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-success-300">{stepSummary.accuracy}%</div>
                        <div className="text-[10px] text-gray-500">准确率</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-error-300">{stepSummary.errors}</div>
                        <div className="text-[10px] text-gray-500">错误</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-300">x{stepSummary.maxCombo}</div>
                        <div className="text-[10px] text-gray-500">Combo</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-300">{stepSummary.flowScore}</div>
                        <div className="text-[10px] text-gray-500">Flow</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplayStep}
                      className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/70 rounded-lg transition-colors"
                    >
                      再来一遍
                    </button>
                    <button
                      onClick={() => handleGoNext(true)}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {isLastStep ? '查看结果' : '下一段'}
                    </button>
                  </div>
                </div>
                <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-400 transition-all duration-100"
                    style={{ width: `${autoAdvancePercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 完美一击特效 */}
          <PerfectStrike
            visible={perfectStrikeVisible}
            onComplete={handlePerfectStrikeComplete}
          />

          {/* 实时表现图表（右上角）- 仅在打字模式下显示 */}
          {currentStep?.type === 'typing' && (
            <div className="absolute top-3 right-3 z-20">
              <WpmChart wpm={wpm} accuracy={accuracy} />
            </div>
          )}
        </div>
      </div>

      {/* 底部导航 */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-800/30 border-t border-gray-700/50">
        <button
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          &larr; 上一步
        </button>
        <span className="text-xs text-gray-500">
          {currentStepIndex + 1} / {currentCourse.steps.length}
        </span>
        <button
          onClick={() => handleGoNext()}
          disabled={!canGoNext}
          className="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {isLastStep ? '完成' : '下一步 →'}
        </button>
      </div>
    </div>
  );
}
