/**
 * 课程加载配置
 * 一期：Typing 模式，加载 java-typing 目录
 * 二期：Coding 模式，加载 java 目录
 *
 * 通过修改 COURSE_MODE 切换模式
 */
export const COURSE_MODE_CONFIG = {
  // Typing 模式配置
  typing: {
    coursesRoot: 'courses',
    languageDir: 'java-typing',
    // 完整路径: courses/java-typing/courses/{courseId}/course.json
  },

  // Coding 模式配置（预留）
  coding: {
    coursesRoot: 'courses',
    languageDir: 'java',
    // 完整路径: courses/java/{courseId}/course.json
  },
} as const;

export type CourseMode = keyof typeof COURSE_MODE_CONFIG;

/**
 * 当前课程模式
 * 修改此值切换 Typing/Coding 模式
 */
export const CURRENT_COURSE_MODE: CourseMode = 'typing';

/**
 * 获取课程根目录
 */
export function getCoursesRoot(): string {
  return COURSE_MODE_CONFIG[CURRENT_COURSE_MODE].coursesRoot;
}

/**
 * 获取语言课程目录
 */
export function getLanguageDir(): string {
  return COURSE_MODE_CONFIG[CURRENT_COURSE_MODE].languageDir;
}

/**
 * 获取课程完整路径
 * @param courseId 课程 ID
 * @returns 课程 JSON 文件路径
 */
export function getCoursePath(courseId: string): string {
  return `${getCoursesRoot()}/${getLanguageDir()}/${courseId}/course.json`;
}
