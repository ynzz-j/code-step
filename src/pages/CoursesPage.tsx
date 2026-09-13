import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCourseCatalogStore } from '@/stores/courseCatalogStore';
import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { FEATURED_TRAINING_PACKS, DEFAULT_TRAINING_PACK_IDS } from '@/data/trainingPacks';
import { LanguageTile } from '@/components/LanguageIcon';
import { normalizeCourseMode, type CourseMode } from '@/services/courseService';
import { useDbCourseProgress } from '@/hooks/useDbCourseProgress';
import { ALL_CATEGORIES, COURSE_CATEGORY_LABELS, DIFFICULTY_LABELS, type CourseMetadata, type TrainingPack } from '@/types';
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
  advanced: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  hell: 'text-error-400 bg-error-500/10 border-error-500/20',
};

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 1, basic: 2, intermediate: 3, advanced: 4, hell: 5,
};


// 侧栏筛选顺序（mockup 02 左栏）
const LANG_ORDER = ['javascript', 'typescript', 'python', 'java', 'sql', 'vim', 'cpp'];
const LANG_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  sql: 'SQL',
  vim: 'Vim',
  cpp: 'C++',
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
    <div className="rounded-tool border border-primary-500/30 bg-bg-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400/50 hover:shadow-lg hover:shadow-primary-500/10">
      <Link
        to={`/learn/${pack.id}?mode=typing`}
        onClick={() => playSound('click')}
        className="block p-5 pb-3"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary-500/15 text-primary-300 border border-primary-500/20">
              训练包
            </span>
            <span className="text-[10px] text-text-muted">{pack.track}</span>
          </div>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${DIFFICULTY_COLORS[pack.difficulty]}`}>
            {DIFFICULTY_LABELS[pack.difficulty].label}
          </span>
        </div>

        <h3 className="text-base font-semibold text-text-primary mb-1.5 group-hover:text-primary-300 transition-colors">
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
            <div className="text-sm font-bold font-mono text-primary-300">{masteryPercent}%</div>
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

function CourseCard({ course, mode, progress }: { course: CourseMetadata; mode: CourseMode; progress?: { completed: number; total: number; percent: number } }) {
  const completedCount = progress?.completed ?? 0;
  const totalSteps = progress?.total || course.stepsCount;
  const progressPercent = totalSteps > 0 ? Math.min(Math.round((completedCount / totalSteps) * 100), 100) : 0;
  const hasProgress = completedCount > 0;
  const isComplete = progressPercent >= 100;

  return (
    <Link
      to={`/learn/${course.id}?mode=${mode}${isComplete ? '&restart=1' : ''}`}
      onClick={() => playSound('click')}
      className="group flex items-center gap-4 p-4 rounded-tool border border-gray-700/40 bg-bg-panel transition-all duration-200 hover:border-primary-500/40 hover:bg-bg-surface/50 hover:-translate-y-0.5"
    >
      {/* 语言官方图标（devicon） */}
      <LanguageTile language={course.language} size={48} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary-300 transition-colors">
            {course.title}
          </h3>
          <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${DIFFICULTY_COLORS[course.difficulty]}`}>
            {DIFFICULTY_LABELS[course.difficulty].label}
          </span>
          <span className={`flex-shrink-0 ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_TAG[statusOf(progressPercent)].classes}`}>
            {STATUS_TAG[statusOf(progressPercent)].label}
          </span>
        </div>
        <p className="text-xs text-text-muted truncate mt-0.5">{course.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 bg-bg-app/70 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-success-500' : 'bg-primary-500'}`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-text-muted flex-shrink-0 font-mono">
            {completedCount}/{totalSteps} 段
          </span>
        </div>
      </div>

      {/* 动作按钮（mockup 02：继续练习） */}
      <span
        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          hasProgress
            ? 'bg-primary-500 text-white group-hover:bg-primary-400 shadow-sm shadow-primary-500/25'
            : 'border border-gray-600/50 text-text-secondary group-hover:border-primary-500/50 group-hover:text-primary-300'
        }`}
      >
        {isComplete ? '重新练习' : hasProgress ? '继续练习' : '开始练习'}
      </span>
    </Link>
  );
}

// ==================== CodingComingSoon ====================

function CodingComingSoon() {
  return (
    <div className="text-center py-20">
      <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-bg-panel border border-gray-700/50 flex items-center justify-center">
        <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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

// 侧栏筛选按钮样式
function sidebarBtn(active: boolean) {
  return `w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors border ${
    active
      ? 'bg-primary-500/15 text-primary-300 border-primary-500/25'
      : 'text-text-secondary border-transparent hover:bg-bg-surface/60 hover:text-text-primary'
  }`;
}

function chipBtn(active: boolean) {
  return `px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
    active
      ? 'bg-primary-500/15 text-primary-300 border-primary-500/25'
      : 'text-text-muted border-transparent hover:border-gray-600/50 hover:text-text-secondary'
  }`;
}

type StatusFilter = 'all' | 'not_started' | 'in_progress' | 'completed';

// 状态筛选 Tag（线框 3.3-B）
const STATUS_TAG: Record<string, { label: string; classes: string }> = {
  not_started: { label: '未开始', classes: 'bg-bg-surface/60 text-text-muted border-bg-elevated/60' },
  in_progress: { label: '学习中', classes: 'bg-primary-500/15 text-primary-300 border-primary-500/25' },
  completed: { label: '已完成', classes: 'bg-success-500/15 text-success-400 border-success-500/25' },
};

function statusOf(progressPercent: number): Exclude<StatusFilter, 'all'> {
  if (progressPercent >= 100) return 'completed';
  if (progressPercent > 0) return 'in_progress';
  return 'not_started';
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
    setCategory,
    setLanguage,
    setDifficulty,
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

  // 侧栏语言计数（基于完整课程目录，mockup 02 左栏）
  const langCounts: Record<string, number> = {};
  for (const c of courses) {
    langCounts[c.language] = (langCounts[c.language] ?? 0) + 1;
  }

  // 状态筛选 + 搜索（线框 3.3-A）
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const dbProgress = useDbCourseProgress(!isCodingMode);
  const getCourseProgress = useCourseSessionStore((s) => s.getCourseProgress);

  // DB 真实进度 + 会话进度合并（取完成数较大的一方）
  const mergedProgress: Record<string, { completed: number; total: number; percent: number }> = {};
  const putProgress = (id: string, total: number, completed: number) => {
    const cur = mergedProgress[id];
    if (!cur || completed > cur.completed) {
      mergedProgress[id] = { completed, total, percent: total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0 };
    }
  };
  for (const c of courses) putProgress(c.id, c.stepsCount, 0);
  for (const [id, p] of Object.entries(dbProgress)) putProgress(id, p.totalSteps, p.completedSteps);
  for (const c of courses) {
    const s = getCourseProgress(c.id);
    if (s) putProgress(c.id, c.stepsCount, s.completedSteps?.length ?? 0);
  }

  const packStatus = new Map(visibleTrainingPacks.map((pack) => {
    const pct = mergedProgress[pack.id]?.percent ?? 0;
    return [pack.id, statusOf(pct)] as const;
  }));
  const courseStatus = new Map(sortedCourses.map((course) => [course.id, statusOf(mergedProgress[course.id]?.percent ?? 0)] as const));

  const matchStatus = (id: string, map: Map<string, Exclude<StatusFilter, 'all'>>) =>
    statusFilter === 'all' || map.get(id) === statusFilter;
  const matchQuery = (...fields: (string | undefined)[]) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return fields.some((f) => (f ?? '').toLowerCase().includes(q));
  };

  const filteredPacks = visibleTrainingPacks.filter(
    (pack) => matchStatus(pack.id, packStatus) && matchQuery(pack.title, courseById.get(pack.id)?.description),
  );
  const statusFilteredCourses = sortedCourses.filter(
    (course) => matchStatus(course.id, courseStatus) && matchQuery(course.title, course.description),
  );

  // 进行中课程默认排前（线框 3.4）
  const STATUS_ORDER: Record<string, number> = { in_progress: 0, not_started: 1, completed: 2 };
  const sortedFilteredCourses = [...statusFilteredCourses].sort((a, b) => {
    const statusDiff = (STATUS_ORDER[courseStatus.get(a.id) ?? 'not_started'] ?? 1) - (STATUS_ORDER[courseStatus.get(b.id) ?? 'not_started'] ?? 1);
    return statusDiff;
  });

  const visibleResultCount = filteredPacks.length + sortedFilteredCourses.length;

  return (
    <div className="h-full overflow-y-auto px-6 py-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto">

        {/* 页头 */}
        <div className="flex items-center justify-between gap-4 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">{modeLabel.title}</h1>
          <div className="flex items-center gap-3">
            {/* 搜索课程（线框 3.4） */}
            <div className="relative">
              <svg className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索课程..."
                className="w-44 pl-8 pr-3 py-1.5 text-xs bg-bg-panel border border-gray-700/50 rounded-tool text-text-primary placeholder:text-text-disabled focus:border-primary-500/50 focus:outline-none transition-colors"
              />
            </div>
            <Link
              to="/"
              onClick={() => playSound('click')}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
            >
              &larr; 返回首页
            </Link>
          </div>
        </div>
        <p className="text-sm text-text-muted mb-6">
          {modeLabel.subtitle} · 共 {visibleResultCount} 个内容
        </p>

        {isCodingMode ? (
          <CodingComingSoon />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* 左侧筛选栏（线框 3.3-A，240px） */}
            <aside className="w-full lg:w-60 flex-shrink-0 space-y-5 lg:sticky lg:top-0">
              <div>
                <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">模式</h3>
                <div className="flex flex-col gap-1">
                  <Link to="/courses?mode=typing" className={sidebarBtn(true)}>
                    <span>跟敲模式</span>
                    <span className="text-[9px] text-primary-400/80">当前</span>
                  </Link>
                  <span className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-text-disabled border border-transparent cursor-not-allowed" title="后续开放">
                    <span>编程实战</span>
                    <span className="text-[9px] text-text-disabled">后续开放</span>
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">语言</h3>
                <div className="flex lg:flex-col flex-wrap gap-1">
                  <button
                    onClick={() => { setLanguage('all'); playSound('click'); }}
                    className={sidebarBtn(selectedLanguage === 'all')}
                  >
                    <span>全部</span>
                    <span className="text-[10px] text-text-muted">{courses.length}</span>
                  </button>
                  {LANG_ORDER.filter((lang) => (langCounts[lang] ?? 0) > 0).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); playSound('click'); }}
                      className={sidebarBtn(selectedLanguage === lang)}
                    >
                      <span>{LANG_LABELS[lang]}</span>
                      <span className="text-[10px] text-text-muted">{langCounts[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">难度</h3>
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => { setDifficulty('all'); playSound('click'); }} className={chipBtn(selectedDifficulty === 'all')}>
                    全部
                  </button>
                  {(Object.keys(DIFFICULTY_ORDER) as (keyof typeof DIFFICULTY_LABELS)[]).map((diff) => (
                    <button key={diff} onClick={() => { setDifficulty(diff); playSound('click'); }} className={chipBtn(selectedDifficulty === diff)}>
                      {DIFFICULTY_LABELS[diff].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">状态</h3>
                <div className="flex flex-wrap gap-1">
                  {([['all', '全部'], ['not_started', '未开始'], ['in_progress', '学习中'], ['completed', '已完成']] as [StatusFilter, string][]).map(
                    ([value, label]) => (
                      <button key={value} onClick={() => { setStatusFilter(value); playSound('click'); }} className={chipBtn(statusFilter === value)}>
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">分类</h3>
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => { setCategory('all'); playSound('click'); }} className={chipBtn(selectedCategory === 'all')}>
                    全部
                  </button>
                  {ALL_CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => { setCategory(cat); playSound('click'); }} className={chipBtn(selectedCategory === cat)}>
                      {COURSE_CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* 主内容列 */}
            <div className="flex-1 min-w-0 space-y-8">
            {/* === 训练包（置顶，双列网格）=== */}
            {filteredPacks.length > 0 && (
              <section className="mb-8">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-text-primary">推荐训练包</h2>
                  <p className="text-xs text-text-muted mt-0.5">按真实高频代码模式重组，30 秒到 3 分钟反复刷</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredPacks.map((pack) => (
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
            {sortedFilteredCourses.length > 0 && (
              <section>
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-text-primary">全部内容</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {sortedFilteredCourses.length} 门课程
                    {selectedCategory !== 'all' && <> · {COURSE_CATEGORY_LABELS[selectedCategory]}</>}
                    {selectedDifficulty !== 'all' && <> · {DIFFICULTY_LABELS[selectedDifficulty].label}</>}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sortedFilteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} mode={mode} progress={mergedProgress[course.id]} />
                  ))}
                </div>
              </section>
            )}

            {/* 空状态 */}
            {filteredPacks.length === 0 && sortedFilteredCourses.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bg-panel border border-gray-700/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-text-muted">
                  {query.trim() || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedLanguage !== 'all' || statusFilter !== 'all'
                    ? '没有匹配的训练内容，试试调整筛选或搜索词'
                    : '暂无训练内容，敬请期待更多内容'}
                </p>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
