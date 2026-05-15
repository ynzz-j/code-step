import { useState, useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  delay: number;
}

interface PerfectStrikeProps {
  visible: boolean;
  onComplete: () => void;
}

const EDGE_POSITIONS = [
  // 左边缘
  { x: 0, y: 0.3, dx: 1, dy: 0 },
  { x: 0, y: 0.5, dx: 1, dy: 0 },
  { x: 0, y: 0.7, dx: 1, dy: 0 },
  // 右边缘
  { x: 1, y: 0.3, dx: -1, dy: 0 },
  { x: 1, y: 0.5, dx: -1, dy: 0 },
  { x: 1, y: 0.7, dx: -1, dy: 0 },
  // 上边缘
  { x: 0.35, y: 0, dx: 0, dy: 1 },
  { x: 0.5, y: 0, dx: 0, dy: 1 },
  { x: 0.65, y: 0, dx: 0, dy: 1 },
  // 下边缘
  { x: 0.35, y: 1, dx: 0, dy: -1 },
  { x: 0.5, y: 1, dx: 0, dy: -1 },
  { x: 0.65, y: 1, dx: 0, dy: -1 },
];

const GOLDEN_COLORS = ['#FFD700', '#FF8C00', '#FFFF00', '#FF4500', '#FFA500'];

/** 生成一个粒子组（从某个边缘位置发射 5~7 个粒子）*/
function spawnEdgeParticles(
  base: typeof EDGE_POSITIONS[number],
  count: number,
  startId: number,
): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const dist = 60 + Math.random() * 140;
    return {
      id: startId + i,
      x: base.x,
      y: base.y,
      tx: base.dx * dist + (Math.random() - 0.5) * 50,
      ty: base.dy * dist + (Math.random() - 0.5) * 50,
      size: 3 + Math.random() * 5,
      color: GOLDEN_COLORS[Math.floor(Math.random() * GOLDEN_COLORS.length)],
      delay: i * 0.04,
    };
  });
}

export function PerfectStrike({ visible, onComplete }: PerfectStrikeProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [badgeIn, setBadgeIn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) {
      setParticles([]);
      setBadgeIn(false);
      return;
    }

    // 生成所有边缘粒子
    let id = 0;
    const all: Particle[] = [];
    EDGE_POSITIONS.forEach((pos) => {
      const count = 5 + Math.floor(Math.random() * 3);
      const group = spawnEdgeParticles(pos, count, id);
      id += count;
      all.push(...group);
    });
    setParticles(all);

    // 徽章入场
    const t1 = setTimeout(() => setBadgeIn(true), 100);
    // 自动消失
    timerRef.current = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(t1);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* 金色粒子 */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="perfect-particle"
          style={{
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Perfect Strike 徽章 */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 ${
          badgeIn ? 'perfect-badge-in' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/90 to-amber-500/90 text-gray-900 font-bold text-sm shadow-lg shadow-yellow-500/30">
          ⭐ 完美一击！Perfect Strike! ⭐
        </div>
      </div>
    </div>
  );
}
