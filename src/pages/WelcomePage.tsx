import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playSound } from '@/utils/soundEffects';
import { FEATURED_TRAINING_PACKS } from '@/data/trainingPacks';
import { DIFFICULTY_LABELS } from '@/types';
import { useGrowthStore } from '@/stores/growthStore';
import { useCourseSessionStore } from '@/stores/courseSessionStore';
import { useDbCourseProgress } from '@/hooks/useDbCourseProgress';
import { growthService } from '@/services/growthService';
import heroBg from '@/assets/backgrounds/dusk-cliff.webp';
import { AmbientLayer } from '@/components/AmbientLayer';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-success-400 bg-success-500/15',
  basic: 'text-cyan-400 bg-cyan-500/15',
  intermediate: 'text-blue-400 bg-blue-500/15',
  advanced: 'text-violet-400 bg-violet-500/15',
  hell: 'text-error-400 bg-error-500/15',
};

export function WelcomePage() {
  const growthSummary = useGrowthStore((s) => s.summary);
  const refreshSummary = useGrowthStore((s) => s.refreshSummary);
  const getCourseProgress = useCourseSessionStore((s) => s.getCourseProgress);
  const dbProgress = useDbCourseProgress();

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
      <div className="max-w-[1400px] w-full space-y-10 animate-fade-in">

        {/* === Hero 品牌区 === */}
        <div className="relative rounded-brand overflow-hidden border border-primary-500/15 shadow-xl shadow-black/40">
          <img
            src={heroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-app/95 via-bg-app/60 to-transparent" />
          <AmbientLayer variant="fireflies" count={7} />
          <div className="absolute inset-0 hero-breathe bg-gradient-to-t from-orange-500/10 via-transparent to-orange-200/5" />
          <span className="absolute right-6 top-4 font-hand text-xl text-primary-100/80 rotate-[-3deg] drop-shadow-md select-none">
            Good Developers Keep Practicing.
          </span>
          <div className="relative z-10 px-8 py-10 md:py-12 space-y-5 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold leading-snug text-text-primary drop-shadow-lg">
              练习代码
              <br />
              遇见更强的自己
            </h1>
            <ul className="space-y-1.5">
              {['精选高频代码片段', '沉浸式敲击练习', '实时反馈与数据统计', '像游戏一样不断升级'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 pt-1">
              <Link
                to="/courses?mode=typing"
                onClick={() => handleButtonClick('typing')}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-400 hover:to-orange-400 text-white rounded-tool font-medium transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 active:scale-95 flex items-center gap-2"
              >
                {hasActivity ? '继续练习' : '开始练习'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 6l6 6-6 6M5 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                to="/courses?mode=typing"
                onClick={() => handleButtonClick('about')}
                className="px-6 py-2.5 border border-white/15 hover:border-white/30 text-text-secondary hover:text-text-primary rounded-tool font-medium transition-all duration-200 hover:bg-white/5 active:scale-95"
              >
                浏览课程
              </Link>
            </div>
            <p className="text-xs text-text-muted">支持多种编程语言 · 完全离线 · 专注高效</p>
          </div>
        </div>

        {/* === 最近学习进展（线框 2.3-D）=== */}
        {hasActivity ? (
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide">最近学习进展</h2>
              <Link
                to="/courses?mode=typing"
                onClick={() => playSound('click')}
                className="px-3 py-1.5 bg-primary-500 hover:bg-primary-400 text-white rounded-lg text-xs font-medium transition-colors"
              >
                继续学习 →
              </Link>
            </div>
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
        ) : (
          <div className="rounded-tool border border-gray-700/40 bg-bg-panel/60 px-6 py-5 text-center">
            <p className="text-sm text-text-secondary">从第一节开始，把高频代码练成手指本能。</p>
            <Link
              to="/courses?mode=typing"
              onClick={() => playSound('click')}
              className="inline-block mt-3 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-lg text-xs font-medium transition-colors"
            >
              从第一节开始 →
            </Link>
          </div>
        )}

        {/* === 今日推荐训练（线框 2.3-B）=== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">今日推荐训练</h2>
              <p className="text-xs text-text-muted mt-0.5">高频代码模式，30 秒起刷</p>
            </div>
            <Link
              to="/courses?mode=typing"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {FEATURED_TRAINING_PACKS.slice(0, 4).map((pack) => {
              const sessionDone = getCourseProgress(pack.id)?.completedSteps?.length || 0;
              const dbDone = dbProgress[pack.id]?.completedSteps ?? 0;
              const completedCount = Math.max(sessionDone, dbDone);
              return (
                <Link
                  key={pack.id}
                  to={`/learn/${pack.id}?mode=typing`}
                  onClick={() => playSound('click')}
                  className="group flex flex-col rounded-tool border border-gray-700/40 bg-bg-panel p-4 transition-all duration-200 hover:border-primary-500/40 hover:bg-bg-surface hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary-300 transition-colors truncate">
                      {pack.title}
                    </h3>
                    <span className={`flex-shrink-0 ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${DIFFICULTY_COLORS[pack.difficulty] || ''}`}>
                      {DIFFICULTY_LABELS[pack.difficulty]?.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2 mb-3 flex-1">
                    {pack.patterns.map((p) => p.label).join(' · ')}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-text-muted mb-3">
                    <span>{pack.language.toUpperCase()} · {pack.durationModes[0]}</span>
                    <span>{completedCount > 0 ? `已练 ${completedCount} 段` : '未开始'}</span>
                  </div>
                  <span
                    className={`self-start px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      completedCount > 0
                        ? 'bg-primary-500 text-white group-hover:bg-primary-400 shadow-sm shadow-primary-500/25'
                        : 'border border-gray-600/50 text-text-secondary group-hover:border-primary-500/50 group-hover:text-primary-300'
                    }`}
                  >
                    {completedCount > 0 ? '继续练习' : '开始练习'}
                  </span>
                </Link>
              );
            })}
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

        {/* === 为什么用 CodeStep（线框 2.3-C）=== */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 pt-2">
          {[
            {
              title: '短时训练',
              desc: '30 秒~3 分钟一局，随时开始随时停',
              icon: (
                <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: '实时纠错',
              desc: '逐字符校验，错在哪一眼看到',
              icon: (
                <svg className="w-4 h-4 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: '连击反馈',
              desc: 'Combo 与 Flow 让手感看得见',
              icon: (
                <svg className="w-4 h-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                </svg>
              ),
            },
            {
              title: '持续成长',
              desc: '最佳纪录与弱点追踪，练了就有数',
              icon: (
                <svg className="w-4 h-4 text-accent-record" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="rounded-tool border border-gray-700/40 bg-bg-panel/60 p-4">
              <div className="w-8 h-8 rounded-lg bg-bg-app/60 border border-gray-700/30 flex items-center justify-center mb-2.5">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
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
