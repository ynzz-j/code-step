import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCourseCatalogStore } from '@/stores/courseCatalogStore';
import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { CategoryFilter } from '@/components/courses/CategoryFilter';
import { FEATURED_TRAINING_PACKS, DEFAULT_TRAINING_PACK_IDS } from '@/data/trainingPacks';
import { normalizeCourseMode, type CourseMode } from '@/services/courseService';
import { COURSE_CATEGORY_LABELS, DIFFICULTY_LABELS, type CourseMetadata, type TrainingPack } from '@/types';
import { playSound } from '@/utils/soundEffects';
import { useGrowthStore } from '@/stores/growthStore';

const MODE_LABELS: Record<CourseMode, { title: string; subtitle: string }> = {
  coding: {
    title: '编程实战模式',
    subtitle: '后续开放，当前先专注代码肌肉记忆训练。',
  },
  typing: {
    title: '训练包发现',
    subtitle: '选择训练包或课程，开始代码肌肉记忆训练',
  },
};

// 难度颜色映射（带 border）
const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-success-400 bg-success-500/10 border-success-500/20',
  basic: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  intermediate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  advanced: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  hell: 'text-error-400 bg-error-500/10 border-error-500/20',
};

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 1, basic: 2, intermediate: 3, advanced: 4, hell: 5,
};

// ==================== TrainingPackCard ====================

function TrainingPackCard({ pack, course }: { pack: TrainingPack; course?: CourseMetadata }) {
  const getCourseProgress = useCourseSessionStore((s) => s.getCourseProgress);
  const packGrowth = useGrowthStore((s) => s.packGrowth[pack.id]);
  const refreshPackGrowth = useGrowthStore((s) => s.refreshPackGrowth);

  useEffect(() => {
    refreshPackGrowth(pack.id);
  }, [pack.id, refreshPackGrowth]);

  const progress = getCourseProgress(pack.id);
  const completedCount = progress?.completedSteps?.length || 0;
  const stepCount = course?.stepsCount ?? 0;
  const masteryPercent = Math.round(Math.max(
    packGrowth?.masteryPercent ?? 0,
    stepCount > 0 ? Math.round((completedCount / stepCount) * 100) : 0,
  ));
  const hasPracticeStats = Boolean(packGrowth?.lastPracticedAt || (packGrowth?.bestWpm ?? 0) > 0 || (packGrowth?.bestCombo ?? 0) > 0 || completedCount > 0);
  const todayDelta = packGrowth?.todayDelta ?? 0;
  const todayDeltaLabel = todayDelta > 0
    ? `+${todayDelta}%`
    : hasPracticeStats
    ? '已训练'
    : '待训练';

  const challengeModes = [
    { mode: 'speed-30s' as const, label: '30s' },
    { mode: 'focus-3min' as const, label: '3min' },
    { mode: 'perfect-run' as const, label: 'Perfect' },
    { mode: 'combo-rush' as const, label: 'Combo' },
  ];

  return (
    <div className="rounded-tool border border-cyan-500/30 bg-bg-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/8">
      <Link
        to={`/learn/${pack.id}?mode=typing`}
        onClick={() => playSound('click')}
        className="block p-5 pb-3"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
              训练包
            </span>
            <span className="text-[10px] text-text-muted">{pack.track}</span>
          </div>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${DIFFICULTY_COLORS[pack.difficulty]}`}>
            {DIFFICULTY_LABELS[pack.difficulty].label}
          </span>
        </div>

        <h3 className="text-base font-semibold text-text-primary mb-1.5 group-hover:text-cyan-300 transition-colors">
          {pack.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-1 mb-4">
          {pack.patterns.map((p) => p.targetSkill).join(' · ')}
        </p>

        {/* 四项关键指标 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center px-1.5 py-2 rounded bg-bg-app/50 border border-gray-700/30">
            <div className={`text-sm font-bold font-mono ${hasPracticeStats || todayDelta > 0 ? 'text-success-400' : 'text-text-muted'}`}>
              {todayDeltaLabel}
            </div>
            <div className="mt-0.5 text-[9px] text-text-muted">今日提升</div>
          </div>
          <div className="text-center px-1.5 py-2 rounded bg-bg-app/50 border border-gray-700/30">
            <div className="text-sm font-bold font-mono text-cyan-300">{masteryPercent}%</div>
            <div className="mt-0.5 text-[9px] text-text-muted">熟练度</div>
          </div>
          <div className="text-center px-1.5 py-2 rounded bg-bg-app/50 border border-gray-700/30">
            <div className={`text-sm font-bold font-mono ${(packGrowth?.bestWpm ?? 0) > 0 ? 'text-primary-300' : 'text-text-muted'}`}>
              {(packGrowth?.bestWpm ?? 0) > 0 ? packGrowth?.bestWpm : '--'}
            </div>
            <div className="mt-0.5 text-[9px] text-text-muted">最佳 WPM</div>
          </div>
          <div className="text-center px-1.5 py-2 rounded bg-bg-app/50 border border-gray-700/30">
            <div className={`text-sm font-bold font-mono ${(packGrowth?.bestCombo ?? 0) > 0 ? 'text-yellow-300' : 'text-text-muted'}`}>
              {(packGrowth?.bestCombo ?? 0) > 0 ? `x${packGrowth.bestCombo}` : '--'}
            </div>
            <div className="mt-0.5 text-[9px] text-text-muted">最佳 Combo</div>
          </div>
        </div>

        {/* 底部元信息 */}
        <div className="flex items-center gap-3 text-[10px] text-text-disabled">
          <span className="uppercase">{pack.language}</span>
          <span>{pack.patterns.length} 个模式</span>
          <span>{pack.durationModes.join(' / ')}</span>
          {course && <span>{course.stepsCount} 段</span>}
        </div>
      </Link>

      {/* 挑战入口按钮 */}
      <div className="px-5 pb-4 pt-0 flex items-center gap-1.5">
        <span className="text-[9px] text-text-disabled mr-1">挑战:</span>
        {challengeModes.map(({ mode, label }) => (
          <Link
            key={mode}
            to={`/learn/${pack.id}?mode=typing&challenge=${mode}`}
            onClick={(e) => { e.stopPropagation(); playSound('click'); }}
            className="px-2 py-1 rounded text-[10px] font-medium border border-gray-600/40 text-text-muted hover:text-text-primary hover:border-gray-500/60 hover:bg-bg-surface/50 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ==================== CourseCard（信息收敛版） ====================

function CourseCard({ course, mode }: { course: CourseMetadata; mode: CourseMode }) {
  const getCourseProgress = useCourseSessionStore((s) => s.getCourseProgress);
  const progress = getCourseProgress(course.id);
  const completedCount = progress?.completedSteps?.length || 0;
  const progressPercent = course.stepsCount > 0 ? Math.round((completedCount / course.stepsCount) * 100) : 0;
  const hasProgress = completedCount > 0;

  return (
    <Link
      to={`/learn/${course.id}?mode=${mode}`}
      onClick={() => playSound('click')}
      className="group block p-4 rounded-tool border border-gray-700/40 bg-bg-panel transition-all duration-200 hover:border-gray-600/60 hover:bg-bg-surface hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary-300 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{course.description}</p>
        </div>
        <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${DIFFICULTY_COLORS[course.difficulty]}`}>
          {DIFFICULTY_LABELS[course.difficulty].label}
        </span>
      </div>

      {/* 进度条 */}
      {hasProgress && (
        <div className="mb-2">
          <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 三项信息 */}
      <div className="flex items-center gap-3 text-[10px] text-text-disabled">
        <span className="uppercase">{course.language}</span>
        <span>{course.stepsCount} 段</span>
        <span>~{course.estimatedMinutes} 分钟</span>
        {hasProgress && (
          <span className="text-primary-400 ml-auto">{progressPercent}%</span>
        )}
      </div>
    </Link>
  );
}

// ==================== CodingComingSoon ====================

function CodingComingSoon() {
  return (
    <div className="text-center py-20">
      <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-bg-panel border border-gray-700/50 flex items-center justify-center">
        <svg className="w-8 h-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-3">编程实战模式后续开放</h2>
      <p className="max-w-md mx-auto text-text-secondary leading-relaxed mb-8">
        当前先专注肌肉记忆训练，把常用语法、符号和代码节奏练顺。
      </p>
      <Link
        to="/courses?mode=typing"
        onClick={() => playSound('click')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-tool font-medium transition-colors"
      >
        开始打字训练 <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

// ==================== CoursesPage ====================

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

  useEffect(() => {
    if (isCodingMode) return;
    loadCourses(mode);
  }, [isCodingMode, loadCourses, mode]);

  useEffect(() => {
    if (!isCodingMode) {
      useGrowthStore.getState().refreshMultiplePackGrowth(DEFAULT_TRAINING_PACK_IDS);
    }
  }, [isCodingMode]);

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

  const sortedCourses = [...displayCourseList].sort((a, b) => {
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

  const totalResults = visibleTrainingPacks.length + sortedCourses.length;

  return (
    <div className="h-full overflow-y-auto px-6 py-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">

        {/* 页头 */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-text-primary">{modeLabel.title}</h1>
          <Link
            to="/"
            onClick={() => playSound('click')}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            &larr; 返回首页
          </Link>
        </div>
        <p className="text-sm text-text-muted mb-6">{modeLabel.subtitle}</p>

        {isCodingMode ? (
          <CodingComingSoon />
        ) : (
          <>
            {/* 筛选器 + 结果计数 */}
            <CategoryFilter className="mb-6" resultCount={totalResults} />

            {/* === 训练包（置顶，双列网格）=== */}
            {visibleTrainingPacks.length > 0 && (
              <section className="mb-8">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-text-primary">推荐训练包</h2>
                  <p className="text-xs text-text-muted mt-0.5">按真实高频代码模式重组，30 秒到 3 分钟反复刷</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

            {/* === 全部课程（降级）=== */}
            {sortedCourses.length > 0 && (
              <section>
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-text-primary">全部内容</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {sortedCourses.length} 门课程
                    {selectedCategory !== 'all' && <> · {COURSE_CATEGORY_LABELS[selectedCategory]}</>}
                    {selectedDifficulty !== 'all' && <> · {DIFFICULTY_LABELS[selectedDifficulty].label}</>}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sortedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} mode={mode} />
                  ))}
                </div>
              </section>
            )}

            {/* 空状态 */}
            {visibleTrainingPacks.length === 0 && sortedCourses.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bg-panel border border-gray-700/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-text-muted">
                  {selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedLanguage !== 'all'
                    ? '该筛选条件下暂无训练内容'
                    : '暂无训练内容，敬请期待更多内容'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
