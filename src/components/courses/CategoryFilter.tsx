import { useCourseCatalogStore } from '@/stores/courseCatalogStore';
import {
  ALL_CATEGORIES,
  COURSE_CATEGORY_LABELS,
  ALL_DIFFICULTIES,
  DIFFICULTY_LABELS,
} from '@/types';

const LANGUAGES = [
  { value: 'all', label: '全部语言' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'cpp', label: 'C++' },
];

// 难度按钮样式
const DIFFICULTY_COLORS: Record<string, { active: string; inactive: string }> = {
  all: {
    active: 'bg-gray-500 text-white',
    inactive: 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50',
  },
  beginner: {
    active: 'bg-green-500/80 text-white',
    inactive: 'bg-green-900/30 text-green-400/70 hover:bg-green-900/50',
  },
  intermediate: {
    active: 'bg-blue-500/80 text-white',
    inactive: 'bg-blue-900/30 text-blue-400/70 hover:bg-blue-900/50',
  },
  advanced: {
    active: 'bg-orange-500/80 text-white',
    inactive: 'bg-orange-900/30 text-orange-400/70 hover:bg-orange-900/50',
  },
  hell: {
    active: 'bg-red-600/90 text-white',
    inactive: 'bg-red-900/30 text-red-400/70 hover:bg-red-900/50',
  },
};

interface CategoryFilterProps {
  className?: string;
}

export function CategoryFilter({ className = '' }: CategoryFilterProps) {
  const { selectedCategory, selectedLanguage, selectedDifficulty, setCategory, setLanguage, setDifficulty, courses } =
    useCourseCatalogStore();

  // 统计各分类的课程数量
  const categoryCounts: Record<string, number> = { all: courses.length };
  for (const cat of ALL_CATEGORIES) {
    categoryCounts[cat] = courses.filter((c) => c.category === cat).length;
  }

  // 统计各语言的课程数量
  const langCounts: Record<string, number> = { all: courses.length };
  for (const lang of LANGUAGES) {
    if (lang.value !== 'all') {
      langCounts[lang.value] = courses.filter((c) => c.language === lang.value).length;
    }
  }

  // 统计各难度的课程数量
  const diffCounts: Record<string, number> = { all: courses.length };
  for (const diff of ALL_DIFFICULTIES) {
    if (diff !== 'all') {
      diffCounts[diff] = courses.filter((c) => c.difficulty === diff).length;
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 学科分类 Tab */}
      <div className="flex flex-wrap gap-2">
        {/* 全部 */}
        <button
          onClick={() => setCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
          }`}
        >
          全部
          {categoryCounts.all > 0 && (
            <span className="ml-1.5 text-xs opacity-70">({categoryCounts.all})</span>
          )}
        </button>

        {/* 各分类 Tab */}
        {ALL_CATEGORIES.map((cat) =>
          categoryCounts[cat] > 0 ? (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
              }`}
            >
              {COURSE_CATEGORY_LABELS[cat]}
              <span className="ml-1.5 text-xs opacity-70">({categoryCounts[cat]})</span>
            </button>
          ) : null,
        )}
      </div>

      {/* 难度筛选 */}
      <div className="flex flex-wrap gap-2">
        {ALL_DIFFICULTIES.map((diff) =>
          diffCounts[diff] > 0 || diff === 'all' ? (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                DIFFICULTY_COLORS[diff]?.[selectedDifficulty === diff ? 'active' : 'inactive']
              }`}
            >
              {DIFFICULTY_LABELS[diff].label}
              <span className="ml-1 opacity-70">({diffCounts[diff] || 0})</span>
            </button>
          ) : null,
        )}
      </div>

      {/* 编程语言筛选 */}
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) =>
          langCounts[lang.value] > 0 ? (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
                selectedLanguage === lang.value
                  ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
                  : 'border-gray-700/50 bg-gray-800/30 text-gray-500 hover:border-gray-600/50 hover:text-gray-400'
              }`}
            >
              {lang.label}
              <span className="ml-1 opacity-60">({langCounts[lang.value]})</span>
            </button>
          ) : null,
        )}
      </div>
    </div>
  );
}
