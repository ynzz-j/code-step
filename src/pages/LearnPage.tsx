import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '@/stores/courseStore';
import { InstructionPanel } from '@/components/learn/InstructionPanel';
import { ProgressDots } from '@/components/learn/ProgressDots';
import { TypingEditor } from '@/components/editor/TypingEditor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { TypingStep } from '@/types';

export function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    currentCourse,
    currentStepIndex,
    currentStepCompleted,
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

  const currentStep = currentCourse?.steps[currentStepIndex];
  const isLastStep = currentCourse && currentStepIndex === currentCourse.steps.length - 1;

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

  const handleStepComplete = () => {
    if (!currentStepCompleted) {
      markStepCompleted();
    }
    if (isLastStep) {
      navigate(`/complete/${courseId}`);
    } else {
      nextStep();
    }
  };

  useKeyboardShortcuts(
    {
      arrowup: prevStep,
      pagedown: currentStepCompleted ? nextStep : undefined,
      arrowdown: currentStepCompleted ? handleStepComplete : undefined,
      pageup: prevStep,
      j: currentStepCompleted ? handleStepComplete : undefined,
      k: prevStep,
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

  return (
    <div className="flex flex-col h-full animate-fade-in">
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

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        <InstructionPanel step={currentStep} />
        <div className="flex-1 flex flex-col">
          {typingStep && (
            <TypingEditor
              step={typingStep}
              onComplete={markStepCompleted}
              onKeystroke={recordTypingKeystroke}
              onReset={resetTypingStats}
            />
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
          onClick={handleStepComplete}
          disabled={!currentStepCompleted}
          className="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          下一步 ↓
        </button>
      </div>
    </div>
  );
}
