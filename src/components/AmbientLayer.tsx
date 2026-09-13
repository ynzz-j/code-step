import { useMemo, type CSSProperties } from 'react';

interface AmbientLayerProps {
  /** fireflies：琥珀光点漂移；stars：细小星星闪烁 */
  variant?: 'fireflies' | 'stars';
  count?: number;
  className?: string;
}

/**
 * 氛围层：叠加在插画上的环境动效（萤火虫漂移 / 星星闪烁）。
 * 纯 CSS 动画 + pointer-events-none，训练中不使用，仅菜单/结算氛围。
 */
export function AmbientLayer({ variant = 'fireflies', count = 6, className = '' }: AmbientLayerProps) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 6 + Math.random() * 86,
        top: variant === 'stars' ? Math.random() * 55 : 12 + Math.random() * 68,
        size: variant === 'stars' ? 1.5 + Math.random() * 1.5 : 3 + Math.random() * 2.5,
        dur: Number((variant === 'stars' ? 2.4 + Math.random() * 2.2 : 7 + Math.random() * 5).toFixed(2)),
        delay: Number((-Math.random() * 10).toFixed(2)),
        dx: Math.round(Math.random() * 70 - 35),
        dy: Math.round(Math.random() * 46 - 23),
      })),
    [variant, count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className={variant === 'stars' ? 'ambient-star' : 'ambient-firefly'}
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              '--dur': `${d.dur}s`,
              '--delay': `${d.delay}s`,
              '--dx': `${d.dx}px`,
              '--dy': `${d.dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
