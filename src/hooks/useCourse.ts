import { useCourseStore } from '@/stores/courseStore';

export function useCourse() {
  const store = useCourseStore();

  return {
    courses: store.courses,
    currentCourse: store.currentCourse,
    currentStep: store.currentCourse?.steps[store.currentStepIndex] ?? null,
    currentStepIndex: store.currentStepIndex,
    loadCourses: store.loadCourses,
    startCourse: store.startCourse,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    completeStep: store.completeStep,
  };
}
