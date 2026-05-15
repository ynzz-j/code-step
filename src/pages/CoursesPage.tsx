import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCourseCatalogStore } from '@/stores/courseCatalogStore';
import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { CategoryFilter } from '@/components/courses/CategoryFilter';
import { FEATURED_TRAINING_PACKS, DEFAULT_TRAINING_PACK_IDS } from '@/data/trainingPacks';
import { normalizeCourseMode, type CourseMode } from '@/services/courseService';
import { COURSE_CATEGORY_LABELS, DIFFICULTY_LABELS, type CourseMetadata, type TrainingPack } from '@/types';
import { playSound } from '@/utils/soundEffects';

const MODE_LABELS: Record<CourseMode, { title: string; subtitle: string }> = {
  coding: {
    title: '编程实战模式',
    subtitle: '后续开放，当前先专注代码肌肉记忆训练。',
  },
  typing: {
    title: '打字训练',
    subtitle: '逐字跟敲高频代码片段，建立代码肌肉记忆。',
  },
};

const DEFAULT_RECOMMENDED_COURSE_IDS = [
  ...DEFAULT_TRAINING_PACK_IDS,
  'js-array',
  'js-async',
  'python-list',
  'python-dict',
  'python-function',
];

// 难度颜色映射
const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-success-400 bg-success-500/10',
  basic: 'text-cyan-400 bg-cyan-500/10',
  intermediate: 'text-blue-400 bg-blue-500/10',
  advanced: 'text-orange-400 bg-orange-500/10',
  hell: 'text-error-400 bg-error-500/10',
};

interface TrainingPackStats {
  todayDelta: number;
  masteryPercent: number;
  bestWpm: number;
  bestCombo: number;
}

const TRAINING_PACK_STATS_KEY = 'codestep-training-pack-stats';

function readTrainingPackStats(packId: string): TrainingPackStats {
  if (typeof window === 'undefined') {
    return { todayDelta: 0, masteryPercent: 0, bestWpm: 0, bestCombo: 0 };
  }

  try {
    const saved = localStorage.getItem(TRAINING_PACK_STATS_KEY);
    const stats = saved ? JSON.parse(saved) as Record<string, Partial<TrainingPackStats>> : {};
    return {
      todayDelta: stats[packId]?.todayDelta ?? 0,
      masteryPercent: stats[packId]?.masteryPercent ?? 0,
      bestWpm: stats[packId]?.bestWpm ?? 0,
      bestCombo: stats[packId]?.bestCombo ?? 0,
    };
  } catch {
    return { todayDelta: 0, masteryPercent: 0, bestWpm: 0, bestCombo: 0 };
  }
}

function TrainingPackCard({ pack, course }: { pack: TrainingPack; course?: CourseMetadata }) {
  const getCourseProgress = useCourseSessionStore((s) => s.getCourseProgress);
  const [stats, setStats] = useState<TrainingPackStats>(() => readTrainingPackStats(pack.id));

  useEffect(() => {
    setStats(readTrainingPackStats(pack.id));
  }, [pack.id]);

  const progress = getCourseProgress(pack.id);
  const completedCount = progress?.completedSteps?.length || 0;
  const stepCount = course?.stepsCount ?? 0;
  const masteryPercent = Math.max(
    stats.masteryPercent,
    stepCount > 0 ? Math.round((completedCount / stepCount) * 100) : 0,
  );
  const patternLabels = pack.patterns.map((pattern) => pattern.label).join(' · ');

  return (
    <Link
      to={`/learn/${pack.id}?mode=typing`}
      onClick={() => playSound('click')}
      className="group block rounded-xl border border-cyan-500/30 bg-gray-900/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-300">
              Training Pack
            </span>
            <span className="rounded bg-gray-700/50 px-2 py-0.5 text-xs font-medium text-gray-400">
              {pack.track}
            </span>
          </div>
          <h3 className="truncate text-lg font-semibold text-gray-100">{pack.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {patternLabels}
          </p>
        </div>
        <span className={`flex-shrink-0 rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[pack.difficulty]}`}>
          {DIFFICULTY_LABELS[pack.difficulty].label}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 px-2 py-2">
          <div className="text-sm font-semibold text-success-300">
            {stats.todayDelta > 0 ? `+${stats.todayDelta}%` : '0%'}
          </div>
          <div className="mt-0.5 text-[10px] text-gray-500">今日提升</div>
        </div>
        <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 px-2 py-2">
          <div className="text-sm font-semibold text-cyan-300">{masteryPercent}%</div>
          <div className="mt-0.5 text-[10px] text-gray-500">熟练度</div>
        </div>
        <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 px-2 py-2">
          <div className="text-sm font-semibold text-primary-300">{stats.bestWpm || '--'}</div>
          <div className="mt-0.5 text-[10px] text-gray-500">最佳 WPM</div>
        </div>
        <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 px-2 py-2">
          <div className="text-sm font-semibold text-yellow-300">x{stats.bestCombo}</div>
          <div className="mt-0.5 text-[10px] text-gray-500">最佳 Combo</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>{pack.language.toUpperCase()}</span>
        <span>{pack.patterns.length} 个模式</span>
        <span>{pack.durationModes.join(' / ')}</span>
        {course && <span>{course.stepsCount} 段</span>}
      </div>
    </Link>
  );
}

// 难度排序（从低到高）
const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 1,
  basic: 2,
  intermediate: 3,
  advanced: 4,
  hell: 5,
};

function CourseCard({ course, mode, recommended }: { course: CourseMetadata; mode: CourseMode; recommended?: boolean }) {
  const getCourseProgress = useCourseSessionStore((s) => s.getCourseProgress);

  const progress = getCourseProgress(course.id);
  const completedCount = progress?.completedSteps?.length || 0;
  const currentStep = progress?.currentStep || 0;
  const progressPercent = course.stepsCount > 0 ? Math.round((completedCount / course.stepsCount) * 100) : 0;
  const hasProgress = completedCount > 0 || currentStep > 0;

  return (
    <Link
      to={`/learn/${course.id}?mode=${mode}`}
      onClick={() => playSound('click')}
      className="group block p-6 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700/50 text-gray-400">
              {COURSE_CATEGORY_LABELS[course.category]}
            </span>
            {recommended && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-success-500/10 text-success-300">
                推荐
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-100 truncate">{course.title}</h3>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${DIFFICULTY_COLORS[course.difficulty]}`}
        >
          {DIFFICULTY_LABELS[course.difficulty].label}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-4">{course.description}</p>

      {/* 进度条 */}
      {hasProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>学习进度</span>
            <span>{completedCount}/{course.stepsCount} 步</span>
          </div>
          <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{course.language.toUpperCase()}</span>
        <span>{course.stepsCount} 步</span>
        <span>~{course.estimatedMinutes} 分钟</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {course.concepts.slice(0, 4).map((concept) => (
          <span
            key={concept}
            className="px-2 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400"
          >
            {concept}
          </span>
        ))}
        {course.concepts.length > 4 && (
          <span className="px-2 py-0.5 text-xs rounded bg-gray-700/30 text-gray-500">
            +{course.concepts.length - 4}
          </span>
        )}
      </div>
    </Link>
  );
}

function CodingComingSoon() {
  return (
    <div className="text-center py-20">
      <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gray-800/70 border border-gray-700/70 flex items-center justify-center">
        <svg className="w-8 h-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-100 mb-3">编程实战模式后续开放</h2>
      <p className="max-w-md mx-auto text-gray-400 leading-relaxed mb-8">
        当前先专注肌肉记忆训练，把常用语法、符号和代码节奏练顺。
      </p>
      <Link
        to="/courses?mode=typing"
        onClick={() => playSound('click')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
      >
        开始打字训练
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export function CoursesPage() {
  const [searchParams] = useSearchParams();
  const mode = normalizeCourseMode(searchParams.get('mode'));
  const modeLabel = MODE_LABELS[mode];
  const isCodingMode = mode === 'coding';

  const {
    courses,
    loadCourses,
    selectedCategory,
    selectedLanguage,
    selectedDifficulty,
  } = useCourseCatalogStore();

  // 背景粒子
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; duration: number; delay: number; size: number; color: string }>>([]);

  useEffect(() => {
    if (isCodingMode) return;
    loadCourses(mode);
  }, [isCodingMode, loadCourses, mode]);

  useEffect(() => {
    const colors = ['bg-blue-400/15', 'bg-cyan-400/15', 'bg-indigo-400/15', 'bg-sky-400/15'];
    const newParticles = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 3,
      size: 1 + Math.random() * 2,
      color: colors[i % colors.length],
    }));
    setParticles(newParticles);
  }, []);

  // 筛选课程（由 courses + filters 计算，不再存状态）
  const filteredCourses = courses.filter((c) => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchLang = selectedLanguage === 'all' || c.language === selectedLanguage;
    const matchDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
    return matchCat && matchLang && matchDiff;
  });

  const displayCourses =
    filteredCourses.length > 0 || (selectedCategory === 'all' && selectedLanguage === 'all' && selectedDifficulty === 'all')
      ? filteredCourses
      : courses;

  const trainingPackIdSet = new Set(DEFAULT_TRAINING_PACK_IDS);
  const displayCourseList = displayCourses.filter((course) => !trainingPackIdSet.has(course.id));

  // 默认先露出高频短循环推荐，再按难度排序（入门→基础→中等→困难→地狱）
  const sortedCourses = [...displayCourseList].sort((a, b) => {
    const recommendedA = DEFAULT_RECOMMENDED_COURSE_IDS.indexOf(a.id);
    const recommendedB = DEFAULT_RECOMMENDED_COURSE_IDS.indexOf(b.id);
    const isRecommendedA = recommendedA >= 0;
    const isRecommendedB = recommendedB >= 0;

    if (isRecommendedA || isRecommendedB) {
      if (isRecommendedA && isRecommendedB) return recommendedA - recommendedB;
      return isRecommendedA ? -1 : 1;
    }

    const orderA = DIFFICULTY_ORDER[a.difficulty] || 0;
    const orderB = DIFFICULTY_ORDER[b.difficulty] || 0;
    return orderA - orderB;
  });

  const courseById = new Map(courses.map((course) => [course.id, course]));
  const visibleTrainingPacks = FEATURED_TRAINING_PACKS.filter((pack) => {
    const matchLang = selectedLanguage === 'all' || pack.language === selectedLanguage;
    const matchDiff = selectedDifficulty === 'all' || pack.difficulty === selectedDifficulty;
    const matchCat = selectedCategory === 'all' || courseById.get(pack.id)?.category === selectedCategory;
    return matchLang && matchDiff && matchCat;
  });

  return (
    <div className="relative h-full overflow-auto px-8 py-8 animate-fade-in">
      {/* 背景粒子 */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full animate-float pointer-events-none ${p.color}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* 微弱渐变光晕 */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{modeLabel.title}</h1>
          <Link
            to="/"
            onClick={() => playSound('click')}
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            &larr; 返回首页
          </Link>
        </div>
        <p className="text-gray-400 mb-6">{modeLabel.subtitle}</p>

        {isCodingMode ? (
          <CodingComingSoon />
        ) : (
          <>
            <CategoryFilter className="mb-8" />

            {visibleTrainingPacks.length > 0 && (
              <section className="mb-8">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-100">训练包</h2>
                    <p className="mt-1 text-sm text-gray-500">按真实高频代码模式重组，适合 30 秒到 3 分钟反复刷。</p>
                  </div>
                  <span className="text-xs text-gray-500">第 4-6 周重组层</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {visibleTrainingPacks.map((pack) => (
                    <TrainingPackCard
                      key={pack.id}
                      pack={pack}
                      course={courseById.get(pack.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {sortedCourses.length === 0 ? (
              visibleTrainingPacks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4 opacity-30">📭</div>
                  <p className="text-gray-400">
                    {selectedCategory !== 'all' || selectedDifficulty !== 'all'
                      ? '该筛选条件下暂无训练内容，敬请期待更多内容'
                      : `${modeLabel.title}暂无课程，敬请期待更多内容`}
                  </p>
                </div>
              ) : null
            ) : (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">课程库</h2>
              <span className="text-xs text-gray-500">保留原课程，训练包作为推荐入口</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  mode={mode}
                  recommended={DEFAULT_RECOMMENDED_COURSE_IDS.includes(course.id)}
                />
              ))}
            </div>
          </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
