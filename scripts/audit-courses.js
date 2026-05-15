import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const coursesRoot = path.resolve(repoRoot, process.argv[2] || 'courses');
const modes = ['typing', 'coding'];

const buckets = {
  micro: { label: '<=80', count: 0 },
  short: { label: '81-160', count: 0 },
  medium: { label: '161-300', count: 0 },
  long: { label: '301-600', count: 0 },
  boss: { label: '>600', count: 0 },
};

const stats = {
  courseCount: 0,
  stepCount: 0,
  byMode: Object.fromEntries(modes.map((mode) => [mode, { courses: 0, steps: 0 }])),
  totalSnippetLength: 0,
  lengthBuckets: buckets,
  longSteps: [],
  issues: [],
};

function readJson(filePath, context) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    stats.issues.push({
      type: 'invalid-json',
      path: path.relative(repoRoot, filePath),
      detail: `${context}: ${error.message}`,
    });
    return null;
  }
}

function bucketFor(length) {
  if (length <= 80) return 'micro';
  if (length <= 160) return 'short';
  if (length <= 300) return 'medium';
  if (length <= 600) return 'long';
  return 'boss';
}

function snippetLength(step) {
  const snippet = step.targetCode ?? step.answer ?? step.starter ?? '';
  return typeof snippet === 'string' ? snippet.length : 0;
}

function auditStep(course, mode, courseDir, stepRef, index) {
  const stepPath = path.resolve(courseDir, stepRef);
  const relStepPath = path.relative(repoRoot, stepPath);

  if (!fs.existsSync(stepPath)) {
    stats.issues.push({
      type: 'missing-step-file',
      path: relStepPath,
      detail: `${course.id} references missing step ${stepRef}`,
    });
    return;
  }

  const step = readJson(stepPath, `step ${index + 1}`);
  if (!step) return;

  stats.stepCount += 1;
  stats.byMode[mode].steps += 1;

  if (!step.type) {
    stats.issues.push({
      type: 'missing-step-type',
      path: relStepPath,
      detail: `${course.id} step ${index + 1} has no type`,
    });
  }

  if (step.type === 'typing' && !step.targetCode) {
    stats.issues.push({
      type: 'missing-target-code',
      path: relStepPath,
      detail: `${course.id} typing step ${index + 1} has no targetCode`,
    });
  }

  const length = snippetLength(step);
  stats.totalSnippetLength += length;
  stats.lengthBuckets[bucketFor(length)].count += 1;

  if (length > 300) {
    stats.longSteps.push({
      courseId: course.id,
      mode,
      step: index + 1,
      length,
      path: relStepPath,
    });
  }
}

function auditCourse(mode, courseDir) {
  const manifestPath = path.join(courseDir, 'course.json');
  const course = readJson(manifestPath, 'course manifest');
  if (!course) return;

  stats.courseCount += 1;
  stats.byMode[mode].courses += 1;

  if (!course.id) {
    stats.issues.push({
      type: 'missing-course-id',
      path: path.relative(repoRoot, manifestPath),
      detail: 'course.json has no id',
    });
  }

  if (!Array.isArray(course.steps)) {
    stats.issues.push({
      type: 'invalid-steps-list',
      path: path.relative(repoRoot, manifestPath),
      detail: `${course.id || courseDir} has no steps array`,
    });
    return;
  }

  course.steps.forEach((stepRef, index) => {
    if (typeof stepRef !== 'string') {
      stats.issues.push({
        type: 'invalid-step-reference',
        path: path.relative(repoRoot, manifestPath),
        detail: `${course.id} step reference ${index + 1} is not a string`,
      });
      return;
    }
    auditStep(course, mode, courseDir, stepRef, index);
  });
}

function auditMode(mode) {
  const modeDir = path.join(coursesRoot, mode);
  if (!fs.existsSync(modeDir)) return;

  for (const langEntry of fs.readdirSync(modeDir, { withFileTypes: true })) {
    if (!langEntry.isDirectory()) continue;
    const langDir = path.join(modeDir, langEntry.name);

    for (const courseEntry of fs.readdirSync(langDir, { withFileTypes: true })) {
      if (!courseEntry.isDirectory()) continue;
      const courseDir = path.join(langDir, courseEntry.name);
      if (fs.existsSync(path.join(courseDir, 'course.json'))) {
        auditCourse(mode, courseDir);
      }
    }
  }
}

for (const mode of modes) {
  auditMode(mode);
}

const averageLength = stats.stepCount
  ? Math.round(stats.totalSnippetLength / stats.stepCount)
  : 0;

console.log('Course audit');
console.log('============');
console.log(`Courses: ${stats.courseCount}`);
console.log(`Steps: ${stats.stepCount}`);
console.log(`Average snippet length: ${averageLength}`);
console.log('');
console.log('By mode:');
for (const mode of modes) {
  const item = stats.byMode[mode];
  console.log(`- ${mode}: ${item.courses} courses, ${item.steps} steps`);
}
console.log('');
console.log('Length distribution:');
for (const [key, bucket] of Object.entries(stats.lengthBuckets)) {
  console.log(`- ${key} (${bucket.label}): ${bucket.count}`);
}
console.log('');
console.log(`Long steps (>300 chars): ${stats.longSteps.length}`);
for (const step of stats.longSteps.slice(0, 20)) {
  console.log(`- ${step.path} (${step.length})`);
}
if (stats.longSteps.length > 20) {
  console.log(`- ...and ${stats.longSteps.length - 20} more`);
}
console.log('');
console.log(`Issues: ${stats.issues.length}`);
for (const issue of stats.issues.slice(0, 30)) {
  console.log(`- [${issue.type}] ${issue.path}: ${issue.detail}`);
}
if (stats.issues.length > 30) {
  console.log(`- ...and ${stats.issues.length - 30} more`);
}

if (stats.issues.length > 0) {
  process.exitCode = 1;
}
