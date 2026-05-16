import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playSound } from '@/utils/soundEffects';
import { FEATURED_TRAINING_PACKS } from '@/data/trainingPacks';
import { DIFFICULTY_LABELS } from '@/types';
import { useGrowthStore } from '@/stores/growthStore';
import { growthService } from '@/services/growthService';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-success-400 bg-success-500/15',
  basic: 'text-cyan-400 bg-cyan-500/15',
  intermediate: 'text-blue-400 bg-blue-500/15',
  advanced: 'text-orange-400 bg-orange-500/15',
  hell: 'text-error-400 bg-error-500/15',
};

export function WelcomePage() {
  const growthSummary = useGrowthStore((s) => s.summary);
  const refreshSummary = useGrowthStore((s) => s.refreshSummary);

  useEffect(() => {
    const migrated = localStorage.getItem('codestep-growth-migrated');
    if (!migrated) {
      growthService.importLegacyGrowthData().then(() => {
        localStorage.setItem('codestep-growth-migrated', '1');
        refreshSummary();
      });
    } else {
      refreshSummary();
    }
  }, [refreshSummary]);

  const hasActivity = growthSummary?.hasActivity ?? false;
  const lastWpm = Math.round(growthSummary?.recentWpm ?? 0);
  const lastAccuracy = Math.round(growthSummary?.recentAccuracy ?? 0);
  const bestCombo = growthSummary?.bestCombo ?? 0;
  const todayDelta = growthSummary?.todayDelta ?? 0;
  const totalTimeMin = growthSummary?.totalTimeMin ?? 0;
  const completedCourses = growthSummary?.completedCourses ?? 0;

  const handleButtonClick = (mode: string) => {
    playSound('click');
    console.log(`Selected mode: ${mode}`);
  };

  return (
    <div className="flex flex-col items-center h-full overflow-y-auto px-6 py-8 bg-bg-app">
      <div className="max-w-4xl w-full space-y-10 animate-fade-in">

        {/* === Hero 品牌区 === */}
        <div className="text-center space-y-4 pt-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
              CS
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            CodeStep
          </h1>
          <p className="text-base text-text-secondary">
            用高频代码片段建立编程肌肉记忆
          </p>
        </div>

        {/* === 主 CTA === */}
        <div className="flex items-center justify-center gap-3">
          <Link
            to={hasActivity ? '/courses?mode=typing' : '/courses?mode=typing'}
            onClick={() => handleButtonClick('typing')}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-tool font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.1-2.846a4.5 4.5 0 00-1.7-1.7L5.25 15l2.846-.1a4.5 4.5 0 001.7-1.7L9.75 11l2.846.1a4.5 4.5 0 001.7 1.7L15 14.25l-2.846.1a4.5 4.5 0 00-1.7 1.7z" />
            </svg>
            {hasActivity ? '继续训练' : '开始 30 秒训练'}
          </Link>
          <Link
            to="/about"
            onClick={() => handleButtonClick('about')}
            className="px-6 py-2.5 border border-gray-600 hover:border-gray-500 text-text-secondary hover:text-text-primary rounded-tool font-medium transition-all duration-200 hover:bg-bg-panel active:scale-95"
          >
            了解更多
          </Link>
        </div>

        {/* === 最近表现（有活动记录时显示）=== */}
        {hasActivity && (
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel px-6 py-4">
            <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">最近表现</h2>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-xl font-bold text-primary-300 font-mono">{lastWpm || '--'}</div>
                <div className="text-[10px] text-text-muted mt-0.5">平均 WPM</div>
              </div>
              <div className="w-px h-8 bg-gray-700/50" />
              <div className="text-center">
                <div className={`text-xl font-bold font-mono ${lastAccuracy >= 95 ? 'text-success-400' : 'text-warning-400'}`}>
                  {lastAccuracy || '--'}%
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">准确率</div>
              </div>
              <div className="w-px h-8 bg-gray-700/50" />
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-300 font-mono">x{bestCombo}</div>
                <div className="text-[10px] text-text-muted mt-0.5">最佳 Combo</div>
              </div>
              <div className="w-px h-8 bg-gray-700/50" />
              <div className="text-center">
                <div className="text-xl font-bold text-text-primary font-mono">{totalTimeMin}</div>
                <div className="text-[10px] text-text-muted mt-0.5">训练分钟</div>
              </div>
              <div className="w-px h-8 bg-gray-700/50" />
              <div className="text-center">
                <div className="text-xl font-bold text-text-primary font-mono">{completedCourses}</div>
                <div className="text-[10px] text-text-muted mt-0.5">完成课程</div>
              </div>
              {todayDelta > 0 && (
                <>
                  <div className="w-px h-8 bg-gray-700/50" />
                  <div className="text-center">
                    <div className="text-xl font-bold text-success-400 font-mono">+{todayDelta}%</div>
                    <div className="text-[10px] text-text-muted mt-0.5">今日提升</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* === 推荐训练包 === */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">推荐训练包</h2>
              <p className="text-xs text-text-muted mt-0.5">高频代码模式，30 秒起刷</p>
            </div>
            <Link
              to="/courses?mode=typing"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FEATURED_TRAINING_PACKS.map((pack) => (
              <Link
                key={pack.id}
                to={`/learn/${pack.id}?mode=typing`}
                onClick={() => playSound('click')}
                className="group block rounded-tool border border-gray-700/40 bg-bg-panel p-4 transition-all duration-200 hover:border-primary-500/40 hover:bg-bg-surface hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary-300 transition-colors truncate">
                    {pack.title}
                  </h3>
                  <span className={`flex-shrink-0 ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${DIFFICULTY_COLORS[pack.difficulty] || ''}`}>
                    {DIFFICULTY_LABELS[pack.difficulty]?.label}
                  </span>
                </div>
                <p className="text-xs text-text-muted line-clamp-2 mb-3">
                  {pack.patterns.map((p) => p.label).join(' · ')}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span>{pack.language.toUpperCase()}</span>
                  <span>{pack.patterns.length} 模式</span>
                  <span>{pack.durationModes[0]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* === 传播型爆点内容 === */}
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3">本月爆点内容</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'react-hooks', title: 'React Hooks 30s', desc: 'useState / useEffect / JSX 渲染高频手感', lang: 'React' },
              { id: 'sql-join-speed', title: 'SQL Join 30s', desc: 'SELECT / JOIN / GROUP BY 查询节奏', lang: 'SQL' },
              { id: 'vim-motion-core', title: 'Vim Motion', desc: 'hjkl / ciw / f/t 组合动作训练', lang: 'Vim' },
            ].map((item) => (
              <Link
                key={item.title}
                to={`/learn/${item.id}?mode=typing&challenge=speed-30s`}
                onClick={() => playSound('click')}
                className="group rounded-tool border border-primary-500/20 bg-bg-panel/70 p-4 transition-all duration-200 hover:border-primary-400/50 hover:bg-bg-surface hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-text-secondary group-hover:text-primary-300 transition-colors">{item.title}</h3>
                  <span className="flex-shrink-0 ml-2 px-1.5 py-0.5 rounded text-[10px] bg-accent-record/15 text-accent-record border border-accent-record/20">
                    30s挑战
                  </span>
                </div>
                <p className="text-xs text-text-muted line-clamp-2">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* === 特性介绍（弱化）=== */}
        <div className="flex items-center justify-center gap-6 text-xs text-text-muted pt-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>短片段循环</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>逐字跟敲</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.1-2.846a4.5 4.5 0 00-1.7-1.7L5.25 15l2.846-.1a4.5 4.5 0 001.7-1.7L9.75 11l2.846.1a4.5 4.5 0 001.7 1.7L15 14.25l-2.846.1a4.5 4.5 0 00-1.7 1.7z" />
            </svg>
            <span>即时反馈</span>
          </div>
        </div>

        {/* === 底部：Coding Coming Soon（不与主 CTA 同级竞争）=== */}
        <div className="text-center pt-2 pb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-tool border border-gray-700/30 bg-bg-panel/50 text-xs text-text-disabled cursor-default">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            编程实战模式后续开放
          </span>
        </div>

      </div>
    </div>
  );
}
