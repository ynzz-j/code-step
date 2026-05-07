import type { TypingStats } from '@/types';

interface StatsPanelProps {
  stats: TypingStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const { wpm, accuracy, errors, totalKeystrokes } = stats;

  return (
    <div className="flex items-center gap-6 px-6 py-3 bg-gray-800/30 border-b border-gray-700/50">
      <div className="text-center">
        <div className="text-xl font-bold text-primary-300">{wpm}</div>
        <div className="text-xs text-gray-500">WPM</div>
      </div>
      <div className="text-center">
        <div className={`text-xl font-bold ${accuracy < 100 ? 'text-warning-400' : 'text-success-400'}`}>
          {accuracy}%
        </div>
        <div className="text-xs text-gray-500">准确率</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-error-400">{errors}</div>
        <div className="text-xs text-gray-500">错误</div>
      </div>
      <div className="text-center text-xs text-gray-500">
        {totalKeystrokes} 键
      </div>
    </div>
  );
}