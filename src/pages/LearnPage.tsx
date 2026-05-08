import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '@/stores/courseStore';
import { InstructionPanel } from '@/components/learn/InstructionPanel';
import { ProgressDots } from '@/components/learn/ProgressDots';
import { TypingEditor } from '@/components/editor/TypingEditor';
import { ComboDisplay } from '@/components/learn/ComboDisplay';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { TypingStep } from '@/types';

export function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);
  const prevComboRef = useRef(0);
  // 步骤输入完成标记（独立于 store 的 currentStepCompleted）
  const [stepInputDone, setStepInputDone] = useState(false);
  const {
    currentCourse,
    currentStepIndex,
    currentStepCompleted,
    combo,
    startCourse,
    nextStep,
    prevStep,
    markStepCompleted,
    recordTypingKeystroke,
    resetTypingStats,
  } = useCourseStore();

  // 进入课程时加载
  useEffect(() => {
    if (courseId) {
      startCourse(courseId);
    }
  }, [courseId, startCourse]);

  // 切换步骤时重置输入完成标记
  useEffect(() => {
    setStepInputDone(false);
  }, [currentStepIndex]);

  // 连击中断时触发屏幕震动
  useEffect(() => {
    if (combo.currentCombo === 0 && prevComboRef.current > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 350);
      return () => clearTimeout(timer);
    }
    prevComboRef.current = combo.currentCombo;
  }, [combo.currentCombo]);

  const currentStep = currentCourse?.steps[currentStepIndex];

  // 一期只做 typing 模式，所有步骤都转换为 typing
  const typingStep: TypingStep | null = useMemo(() => {
    if (!currentStep) return null;
    // 已经是 TypingStep
    if (currentStep.type === 'typing') return currentStep as TypingStep;
    // CodingStep 也转为 TypingStep：用 starter 或 answer 作为 targetCode
    const codingStep = currentStep as { starter?: string; answer?: string; type: string };
    return {
      ...codingStep,
      type: 'typing' as const,
      targetCode: codingStep.starter || codingStep.answer || '',
    } as unknown as TypingStep;
  }, [currentStep]);

  // TypingEditor 打完字时的回调：只标记输入完成，不触发跳转
  const handleTypingComplete = () => {
    setStepInputDone(true);
  };

  // 用户主动确认进入下一步
  const handleGoNext = () => {
    if (!stepInputDone && !currentStepCompleted) return;

    // 标记步骤完成到 store
    if (!currentStepCompleted) {
      markStepCompleted();
    }

    // 判断是否是最后一步（从 store 实时读取，避免闭包问题）
    const { currentCourse: course, currentStepIndex: idx } = useCourseStore.getState();
    const isLast = course && idx === course.steps.length - 1;

    if (isLast) {
      navigate(`/complete/${courseId}`);
    } else {
      nextStep();
    }
  };

  useKeyboardShortcuts(
    {
      arrowup: prevStep,
      pagedown: (stepInputDone || currentStepCompleted) ? handleGoNext : undefined,
      arrowdown: (stepInputDone || currentStepCompleted) ? handleGoNext : undefined,
      pageup: prevStep,
      j: (stepInputDone || currentStepCompleted) ? handleGoNext : undefined,
      k: prevStep,
      tab: undefined,
      escape: () => navigate('/courses'),
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
          onClick={() => navigate('/courses')}
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
          {typingStep && (
            <TypingEditor
              step={typingStep}
              onComplete={handleTypingComplete}
              onKeystroke={recordTypingKeystroke}
              onReset={resetTypingStats}
            />
          )}

          {/* 步骤输入完成提示（覆盖在编辑器上方） */}
          {stepInputDone && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-10 animate-fade-in">
              <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-800/90 border border-success-500/30 shadow-lg">
                <div className="text-4xl">&#10003;</div>
                <h3 className="text-xl font-bold text-success-400">步骤完成！</h3>
                <p className="text-sm text-gray-400">
                  {isLastStep ? '恭喜完成全部课程！' : '按 ↓ 或 J 键继续'}
                </p>
                <button
                  onClick={handleGoNext}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  {isLastStep ? '查看结果' : '下一步 ↓'}
                </button>
              </div>
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
          &uarr; 上一步
        </button>
        <span className="text-xs text-gray-500">
          {currentStepIndex + 1} / {currentCourse.steps.length}
        </span>
        <button
          onClick={handleGoNext}
          disabled={!canGoNext}
          className="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {isLastStep ? '完成' : '下一步 ↓'}
        </button>
      </div>
    </div>
  );
}
