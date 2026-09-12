import { useEffect, useState } from 'react';
import boltIcon from '@/assets/icons/bolt.png';
import targetIcon from '@/assets/icons/target.png';
import errorIcon from '@/assets/icons/error.png';
import flameIcon from '@/assets/icons/flame.png';
import flowIcon from '@/assets/icons/flow.png';
import crownIcon from '@/assets/icons/crown.png';

interface CoreStatsBarProps {
  wpm: number;
  accuracy: number;
  errors: number;
  maxCombo: number;
  flowScore: number;
}

interface BestStats {
  wpm: number;
  flowScore: number;
}

const BEST_STATS_KEY = 'codestep-best-typing-stats';

/**
 * 核心统计条（打字界面UI）：六张图标数据卡
 * Combo 卡高连击时琥珀描边 + 连击徽章；最佳成绩用皇冠
 */
export function CoreStatsBar({ wpm, accuracy, errors, maxCombo, flowScore }: CoreStatsBarProps) {
  const [best, setBest] = useState<BestStats>({ wpm: 0, flowScore: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_STATS_KEY);
      if (saved) setBest(JSON.parse(saved) as BestStats);
    } catch {
      /* ignore */
    }
  }, []);

  const cards = [
    { icon: boltIcon, value: wpm, label: 'WPM', tone: 'text-text-primary', hot: false },
    { icon: targetIcon, value: `${accuracy}%`, label: '准确率', tone: 'text-success-400', hot: false },
    { icon: errorIcon, value: errors, label: '错误数', tone: errors > 0 ? 'text-error-400' : 'text-text-muted', hot: false },
    { icon: flameIcon, value: `x${maxCombo}`, label: 'Combo', tone: maxCombo >= 20 ? 'text-accent-record' : 'text-primary-300', hot: maxCombo >= 10 },
    { icon: flowIcon, value: flowScore, label: 'Flow', tone: 'text-success-400', hot: false },
    { icon: crownIcon, value: best.wpm > 0 ? best.wpm : '--', label: '最佳成绩', tone: 'text-accent-record', hot: false },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-4 mt-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative flex items-center gap-2.5 rounded-tool border px-3 py-2 ${
            card.hot
              ? 'border-primary-500/50 bg-primary-500/10 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
              : 'border-gray-700/40 bg-bg-panel/60'
          }`}
        >
          {card.hot && (
            <span className="absolute -top-2 right-2 flex items-center gap-0.5 px-1.5 py-px rounded-full bg-primary-500 text-[9px] font-bold text-bg-app shadow-sm shadow-primary-500/40">
              <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
              </svg>
              连击！
            </span>
          )}
          <img src={card.icon} alt="" className="h-6 w-6 object-contain flex-shrink-0" draggable={false} />
          <div className="min-w-0">
            <div className={`text-sm font-bold font-mono leading-none ${card.tone}`}>{card.value}</div>
            <div className="text-[9px] text-text-muted mt-1">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
