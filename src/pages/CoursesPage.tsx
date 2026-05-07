import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '@/stores/courseStore';
import type { CourseMetadata } from '@/types';

function CourseCard({ course }: { course: CourseMetadata }) {
  const difficultyColors = {
    beginner: 'text-success-400 bg-success-500/10',
    intermediate: 'text-yellow-400 bg-yellow-500/10',
    advanced: 'text-error-400 bg-error-500/10',
  };

  const difficultyLabels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
  };

  return (
    <Link
      to={`/learn/${course.id}`}
      className="block p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/5"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-100">{course.title}</h3>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[course.difficulty]}`}
        >
          {difficultyLabels[course.difficulty]}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-4">{course.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{course.language.toUpperCase()}</span>
        <span>{course.stepsCount} 步</span>
        <span>~{course.estimatedMinutes} 分钟</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {course.concepts.map((concept) => (
          <span
            key={concept}
            className="px-2 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400"
          >
            {concept}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function CoursesPage() {
  const { courses, loadCourses } = useCourseStore();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <div className="h-full overflow-auto px-8 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">选择课程</h1>
        <p className="text-gray-400 mb-8">选择一门课程开始你的编程之旅</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
