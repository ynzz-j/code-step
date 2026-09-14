/**
 * 生成 Web demo 静态课程数据：src/data/webCourses.json
 *
 * 从 courses/typing 下精选"节奏感强、片段短"的课程，输出为与 Tauri
 * 后端一致的数据形状（snake_case + 内嵌 steps），供浏览器模式降级使用。
 *
 * 运行：node scripts/build-web-courses.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'courses/typing';
const SELECTED = [
  'javascript/js-array',    // 12 段 · 均长 79 字符，数组高阶方法节奏最顺
  'javascript/js-function', // 12 段 · 均长 81 字符，箭头函数手感
  'python/python-list',     // 12 段 · 均长 102 字符
  'python/python-dict',     // 15 段 · 均长 92 字符
];

const courses = SELECTED.map((dir) => {
  const meta = JSON.parse(readFileSync(`${BASE}/${dir}/course.json`, 'utf-8'));
  const steps = meta.steps.map((rel, i) => {
    const step = JSON.parse(readFileSync(`${BASE}/${dir}/${rel}`, 'utf-8'));
    return { ...step, id: `${meta.id}-${i + 1}` };
  });

  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    language: meta.language,
    category: meta.category,
    difficulty: meta.difficulty,
    concepts: meta.concepts,
    estimated_minutes: meta.estimatedMinutes,
    steps_count: steps.length,
    steps,
  };
});

const out = 'src/data/webCourses.json';
writeFileSync(out, JSON.stringify(courses, null, 1));
console.log(`written ${out}: ${courses.map((c) => `${c.id}(${c.steps_count}段)`).join(', ')}`);
