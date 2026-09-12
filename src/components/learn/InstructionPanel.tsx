import { useState } from 'react';
import { DIFFICULTY_LABELS, type Difficulty, type Step } from '@/types';

interface InstructionPanelProps {
  step: Step;
  courseTitle?: string;
  language?: string;
  difficulty?: Difficulty;
  stepIndex?: number;
  totalSteps?: number;
}

const LANG_TILES: Record<string, { label: string; tile: string }> = {
  javascript: { label: 'JS', tile: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/30' },
  typescript: { label: 'TS', tile: 'bg-blue-400/15 text-blue-300 border-blue-400/30' },
  python: { label: 'Py', tile: 'bg-sky-400/15 text-sky-300 border-sky-400/30' },
  java: { label: 'Ja', tile: 'bg-orange-400/15 text-orange-300 border-orange-400/30' },
  cpp: { label: 'C++', tile: 'bg-pink-400/15 text-pink-300 border-pink-400/30' },
  sql: { label: 'SQL', tile: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' },
  vim: { label: 'Vi', tile: 'bg-violet-400/15 text-violet-300 border-violet-400/30' },
};

/**
 * 左侧任务栏（打字界面UI）：当前课程卡 + 章节信息 + 提示卡 + 系列课程入口
 */
export function InstructionPanel({
  step,
  courseTitle,
  language,
  difficulty,
  stepIndex,
  totalSteps,
}: InstructionPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const tile = LANG_TILES[language ?? ''] ?? {
    label: (language ?? 'CS').slice(0, 2).toUpperCase(),
    tile: 'bg-bg-surface text-text-secondary border-gray-600/40',
  };

  return (
    <div className={`flex-shrink-0 flex flex-col border-r border-bg-surface/50 overflow-hidden bg-bg-panel/20 transition-all duration-300 ${collapsed ? 'w-10' : 'w-[270px]'}`}>
      {/* 折叠/展开按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-8 w-full hover:bg-bg-surface/30 transition-colors text-text-muted hover:text-text-primary flex-shrink-0"
        title={collapsed ? '展开任务栏' : '折叠任务栏'}
      >
        <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {collapsed ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-tool bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
            {step.concept.substring(0, 2)}
          </span>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 p-4 overflow-auto">
          {/* 当前课程卡（打字界面UI 左栏） */}
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2">当前课程</div>
          {courseTitle && (
            <div className="flex items-center gap-2.5 mb-3">
              <span className={`w-9 h-9 rounded-lg border flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 ${tile.tile}`}>
                {tile.label}
              </span>
              <span className="text-sm font-semibold text-text-primary truncate flex-1">{courseTitle}</span>
              {difficulty && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary-500/15 text-primary-300 border border-primary-500/25 flex-shrink-0">
                  {DIFFICULTY_LABELS[difficulty].label}
                </span>
              )}
            </div>
          )}

          {/* 章节标题 */}
          <h2 className="text-lg font-bold text-text-primary leading-snug mb-2">{step.title}</h2>

          {/* 章节说明 */}
          <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap mb-4">{step.instruction}</p>

          {/* 提示卡（常显琥珀卡，打字界面UI） */}
          {step.hint && (
            <div className="rounded-tool border border-primary-500/30 bg-primary-500/5 p-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-300 mb-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                提示
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{step.hint}</p>
            </div>
          )}

          {/* 底部：进度 + 系列课程 */}
          <div className="mt-auto pt-3 border-t border-bg-surface/40 flex items-center justify-between text-[10px] text-text-muted">
            {typeof stepIndex === 'number' && typeof totalSteps === 'number' ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {stepIndex + 1}/{totalSteps}
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              系列课程
            </span>
          </div>

          {/* 鼓励文字 */}
          {step.encouragement && (
            <p className="mt-2 text-[11px] text-text-muted italic">{step.encouragement}</p>
          )}
        </div>
      )}
    </div>
  );
}
