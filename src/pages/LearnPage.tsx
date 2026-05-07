import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '@/stores/courseStore';
import { InstructionPanel } from '@/components/learn/InstructionPanel';
import { ProgressDots } from '@/components/learn/ProgressDots';
import { StatsPanel } from '@/components/learn/StatsPanel';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { TypingEditor } from '@/components/editor/TypingEditor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    currentCourse,
    currentStepIndex,
    currentStepCompleted,
    typingStats,
    startCourse,
    nextStep,
    prevStep,
    markStepCompleted,
    recordTypingKeystroke,
    resetTypingStats,
  } = useCourseStore();

  useEffect(() => {
    if (courseId) {
      startCourse(courseId);
    }
  }, [courseId, startCourse]);

  const currentStep = currentCourse?.steps[currentStepIndex];
  const isLastStep = currentCourse && currentStepIndex === currentCourse.steps.length - 1;

  const handleStepComplete = () => {
    // 先标记当前步骤完成
    if (!currentStepCompleted) {
      markStepCompleted();
    }
    if (isLastStep) {
      navigate(`/complete/${courseId}`);
    } else {
      nextStep();
    }
  };

  useKeyboardShortcuts({
    arrowup: prevStep,
    pagedown: nextStep,
    arrowdown: handleStepComplete,
    pageup: prevStep,
    j: nextStep,
    k: prevStep,
    escape: () => navigate('/courses'),
  }, !!currentCourse);

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
      <div className="flex items-center justify-between px-6 py-3 bg-gray-800/30 border-b border-gray-700/50">
        <button
          onClick={() => navigate('/courses')}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          &larr; 退出
        </button>
        <span className="text-sm font-medium text-gray-300">
          {currentCourse.title}
        </span>
        <ProgressDots
          total={currentCourse.steps.length}
          current={currentStepIndex}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <InstructionPanel step={currentStep} />
        <div className="flex-1 flex flex-col">
          {currentStep.type === 'typing' && (
            <StatsPanel stats={typingStats} />
          )}
          {currentStep.type === 'coding' ? (
            <CodeEditor
              step={currentStep}
              onComplete={handleStepComplete}
            />
          ) : (
            <TypingEditor
              step={currentStep}
              onComplete={markStepCompleted}
              onKeystroke={recordTypingKeystroke}
              onReset={resetTypingStats}
            />
          )}
        </div>
      </div>

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