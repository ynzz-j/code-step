import { useEffect, useMemo, useState } from 'react';
import { useComboStore } from '@/stores/comboStore';
import type { TypingStats } from '@/types';

interface StatsPanelProps {
  stats: TypingStats;
}

interface BestStats {
  wpm: number;
  flowScore: number;
}

const BEST_STATS_KEY = 'codestep-best-typing-stats';

export function StatsPanel({ stats }: StatsPanelProps) {
  const { wpm, accuracy, errors, totalKeystrokes } = stats;
  const { maxCombo } = useComboStore();
  const [bestStats, setBestStats] = useState<BestStats>({ wpm: 0, flowScore: 0 });

  const flowScore = useMemo(() => {
    const score = Math.round((wpm * accuracy) / 100 + maxCombo * 0.4 - errors * 1.5);
    return Math.max(0, score);
  }, [accuracy, errors, maxCombo, wpm]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_STATS_KEY);
      if (saved) {
        setBestStats(JSON.parse(saved) as BestStats);
      }
    } catch {
      setBestStats({ wpm: 0, flowScore: 0 });
    }
  }, []);

  useEffect(() => {
    if (totalKeystrokes === 0) return;
    const nextBest = {
      wpm: Math.max(bestStats.wpm, wpm),
      flowScore: Math.max(bestStats.flowScore, flowScore),
    };

    if (nextBest.wpm !== bestStats.wpm || nextBest.flowScore !== bestStats.flowScore) {
      setBestStats(nextBest);
      try {
        localStorage.setItem(BEST_STATS_KEY, JSON.stringify(nextBest));
      } catch {
        // ignore storage failures
      }
    }
  }, [bestStats, flowScore, totalKeystrokes, wpm]);

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-bg-panel/30 border-t border-bg-surface/30">
      {/* 核心三项 - 主要显示 */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-accent-primary font-mono">{wpm}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">WPM</div>
        </div>
        <div className="w-px h-8 bg-bg-surface/50" />
        <div className="text-center">
          <div className={`text-lg font-bold font-mono ${accuracy < 95 ? 'text-warning-400' : 'text-success-400'}`}>{accuracy}%</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">准确率</div>
        </div>
        <div className="w-px h-8 bg-bg-surface/50" />
        <div className="text-center">
          <div className={`text-lg font-bold font-mono ${errors > 0 ? 'text-error-400' : 'text-success-400'}`}>{errors}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">错误</div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="w-px h-8 bg-bg-surface/50" />

      {/* 次级指标 - 更小更轻 */}
      <div className="flex items-center gap-3 text-[10px]">
        <div className="text-center">
          <div className="text-sm font-mono text-accent-primary">x{maxCombo}</div>
          <div className="text-[9px] text-text-disabled">Combo</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-mono text-accent-success">{flowScore}</div>
          <div className="text-[9px] text-text-disabled">Flow</div>
        </div>
        {bestStats.wpm > 0 && (
          <>
            <div className="text-center">
              <div className="text-sm font-mono text-accent-record">{bestStats.wpm}</div>
              <div className="text-[9px] text-text-disabled">最佳</div>
            </div>
          </>
        )}
      </div>

      {/* 键数 */}
      <div className="ml-auto text-[10px] text-text-disabled">
        {totalKeystrokes} 键
      </div>
    </div>
  );
}
