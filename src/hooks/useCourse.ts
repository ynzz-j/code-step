import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { useCourseCatalogStore } from '@/stores/courseCatalogStore';

export function useCourse() {
  const courseCatalog = useCourseCatalogStore();
  const session = useCourseSessionStore();

  return {
    courses: courseCatalog.courses,
    currentCourse: session.currentCourse,
    currentStep: session.currentCourse?.steps[session.currentStepIndex] ?? null,
    currentStepIndex: session.currentStepIndex,
    loadCourses: courseCatalog.loadCourses,
    startCourse: session.startCourse,
    nextStep: session.nextStep,
    prevStep: session.prevStep,
    completeStep: (index: number) => {
      const newCompleted = new Set(session.completedSteps);
      newCompleted.add(index);
      useCourseSessionStore.setState({ completedSteps: newCompleted });
    },
  };
}
