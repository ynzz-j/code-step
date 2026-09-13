import trophyIcon from '@/assets/icons/trophy.webp';
import pathSummit from '@/assets/backgrounds/path-summit.webp';
import { AmbientLayer } from '@/components/AmbientLayer';

interface SideStatsPanelProps {
  accuracy: number;
}

/**
 * 右侧鼓励卡（打字界面UI）：奖杯 + 情绪文案 + 山顶旗帜插画
 */
export function SideStatsPanel({ accuracy }: SideStatsPanelProps) {
  const mood =
    accuracy >= 98
      ? { title: '状态极佳！', line: '准确又稳定，继续保持这个手感。' }
      : accuracy >= 90
        ? { title: '保持节奏！', line: '你正在稳步前进，别急，稳即是快。' }
        : { title: '慢下来，打准它', line: '先求准，再求快——错误清零速度自然上来。' };

  return (
    <aside className="hidden xl:flex w-[300px] flex-shrink-0 p-3 overflow-hidden">
      <div className="relative flex-1 rounded-brand overflow-hidden border border-primary-500/20 flex flex-col justify-center min-h-[200px]">
        <img
          src={pathSummit}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[82%_center]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-app/90 via-bg-app/45 to-bg-app/15" />
        <AmbientLayer variant="fireflies" count={4} />
        <div className="relative z-10 p-5">
          <img
            src={trophyIcon}
            alt=""
            className="h-12 w-12 object-contain mb-3 drop-shadow-[0_0_14px_rgba(245,158,11,0.45)]"
            draggable={false}
          />
          <div className="text-lg font-bold text-text-primary">{mood.title}</div>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">{mood.line}</p>
          <div className="mt-4 text-[10px] text-text-muted tracking-[0.25em]">专注 · 准确 · 持续进步</div>
        </div>
      </div>
    </aside>
  );
}
