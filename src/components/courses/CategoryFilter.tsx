import { useState } from 'react';
import { useCourseCatalogStore } from '@/stores/courseCatalogStore';
import {
  ALL_CATEGORIES,
  COURSE_CATEGORY_LABELS,
  ALL_DIFFICULTIES,
  DIFFICULTY_LABELS,
} from '@/types';

const LANGUAGES = [
  { value: 'all', label: '全部' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JS' },
  { value: 'cpp', label: 'C++' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-success-400 border-success-500/30 bg-success-500/10',
  basic: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  intermediate: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  advanced: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  hell: 'text-error-400 border-error-500/30 bg-error-500/10',
};

interface CategoryFilterProps {
  className?: string;
  resultCount: number;
}

export function CategoryFilter({ className = '', resultCount }: CategoryFilterProps) {
  const {
    selectedCategory, selectedLanguage, selectedDifficulty,
    setCategory, setLanguage, setDifficulty,
    courses,
  } = useCourseCatalogStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 统计各分类课程数
  const categoryCounts: Record<string, number> = { all: courses.length };
  for (const cat of ALL_CATEGORIES) {
    categoryCounts[cat] = courses.filter((c) => c.category === cat).length;
  }

  // 统计各语言课程数
  const langCounts: Record<string, number> = { all: courses.length };
  for (const lang of LANGUAGES) {
    if (lang.value !== 'all') {
      langCounts[lang.value] = courses.filter((c) => c.language === lang.value).length;
    }
  }

  // 统计各难度课程数
  const diffCounts: Record<string, number> = { all: courses.length };
  for (const diff of ALL_DIFFICULTIES) {
    if (diff !== 'all') {
      diffCounts[diff] = courses.filter((c) => c.difficulty === diff).length;
    }
  }

  // 活跃筛选标签
  const activeFilters: string[] = [];
  if (selectedCategory !== 'all') activeFilters.push(COURSE_CATEGORY_LABELS[selectedCategory]);
  if (selectedDifficulty !== 'all') activeFilters.push(DIFFICULTY_LABELS[selectedDifficulty].label);
  if (selectedLanguage !== 'all') activeFilters.push(LANGUAGES.find((l) => l.value === selectedLanguage)?.label || selectedLanguage);

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>

      {/* 第一行：分类分段控件 + 结果计数 + 高级筛选切换 */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 分类分段控件 */}
        <div className="flex flex-1 items-center gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedCategory === 'all'
                ? 'border-primary-500/50 bg-primary-500/15 text-primary-300'
                : 'border-transparent text-text-muted hover:text-text-secondary hover:bg-bg-surface'
            }`}
          >
            全部{categoryCounts.all > 0 && ` (${categoryCounts.all})`}
          </button>
          {ALL_CATEGORIES.map((cat) =>
            categoryCounts[cat] > 0 ? (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'border-primary-500/50 bg-primary-500/15 text-primary-300'
                    : 'border-transparent text-text-muted hover:text-text-secondary hover:bg-bg-surface'
                }`}
              >
                {COURSE_CATEGORY_LABELS[cat]}
                <span className="ml-1 opacity-60">({categoryCounts[cat]})</span>
              </button>
            ) : null,
          )}
        </div>

        {/* 结果计数 + 高级筛选按钮 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-text-muted whitespace-nowrap">
            {resultCount} 个结果
          </span>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors border ${
              showAdvanced || hasActiveFilters
                ? 'border-primary-500/30 bg-primary-500/10 text-primary-300'
                : 'border-gray-700/30 text-text-muted hover:text-text-secondary'
            }`}
          >
            <svg className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            筛选
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
          </button>
        </div>
      </div>

      {/* 第二行：语言 + 难度（可折叠） */}
      {showAdvanced && (
        <div className="flex items-center gap-3 py-2 px-3 rounded-tool bg-bg-panel border border-gray-700/30 animate-slide-up-fade">
          {/* 语言筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-text-muted flex-shrink-0">语言</span>
            {LANGUAGES.map((lang) =>
              langCounts[lang.value] > 0 || lang.value === 'all' ? (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                    selectedLanguage === lang.value
                      ? 'border-primary-500/40 bg-primary-500/15 text-primary-300'
                      : 'border-transparent text-text-muted hover:border-gray-600/50'
                  }`}
                >
                  {lang.label}
                </button>
              ) : null,
            )}
          </div>

          <div className="w-px h-4 bg-gray-700/50" />

          {/* 难度筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-text-muted flex-shrink-0">难度</span>
            {ALL_DIFFICULTIES.map((diff) =>
              diffCounts[diff] > 0 || diff === 'all' ? (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                    selectedDifficulty === diff
                      ? DIFFICULTY_COLORS[diff] || 'border-primary-500/40 bg-primary-500/15 text-primary-300'
                      : 'border-transparent text-text-muted hover:border-gray-600/50'
                  }`}
                >
                  {DIFFICULTY_LABELS[diff].label}
                  <span className="ml-0.5 opacity-60">({diffCounts[diff] || 0})</span>
                </button>
              ) : null,
            )}
          </div>

          {/* 清除筛选 */}
          {hasActiveFilters && (
            <>
              <div className="w-px h-4 bg-gray-700/50" />
              <button
                onClick={() => { setCategory('all'); setLanguage('all'); setDifficulty('all'); }}
                className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
              >
                清除
              </button>
            </>
          )}
        </div>
      )}

      {/* 活跃筛选摘要 */}
      {hasActiveFilters && !showAdvanced && (
        <div className="flex items-center gap-1.5">
          {activeFilters.map((label) => (
            <span key={label} className="px-1.5 py-0.5 rounded text-[10px] bg-primary-500/10 text-primary-300 border border-primary-500/20">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
