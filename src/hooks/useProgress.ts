import { useCourseStore } from '@/stores/courseStore';

export function useProgress() {
  const { currentCourse, currentStepIndex, completedSteps } = useCourseStore();

  const totalSteps = currentCourse?.steps.length ?? 0;
  const completedCount = completedSteps.size;
  const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return {
    totalSteps,
    currentStep: currentStepIndex + 1,
    completedCount,
    progressPercent,
    isComplete: completedCount === totalSteps && totalSteps > 0,
  };
}
