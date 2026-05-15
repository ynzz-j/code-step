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

  const items = [
    { label: 'WPM', value: wpm, tone: 'text-primary-300', sub: bestStats.wpm > 0 ? `最佳 ${bestStats.wpm}` : '开始后记录' },
    { label: '准确率', value: `${accuracy}%`, tone: accuracy < 95 ? 'text-warning-400' : 'text-success-400', sub: `${totalKeystrokes} 键` },
    { label: '错误', value: errors, tone: errors > 0 ? 'text-error-400' : 'text-success-400', sub: '越少越稳' },
    { label: '最大连击', value: `x${maxCombo}`, tone: maxCombo >= 20 ? 'text-yellow-300' : 'text-blue-300', sub: '当前课程' },
    { label: 'Flow', value: flowScore, tone: flowScore >= bestStats.flowScore && flowScore > 0 ? 'text-yellow-300' : 'text-cyan-300', sub: bestStats.flowScore > 0 ? `最佳 ${bestStats.flowScore}` : '节奏分' },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 px-6 py-3 bg-gray-800/30 border-b border-gray-700/50">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 rounded-lg bg-gray-900/30 border border-gray-700/40 px-3 py-2 text-center">
          <div className={`text-xl font-bold leading-none ${item.tone}`}>{item.value}</div>
          <div className="mt-1 text-xs text-gray-500">{item.label}</div>
          <div className="mt-0.5 text-[10px] text-gray-600 truncate">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}
