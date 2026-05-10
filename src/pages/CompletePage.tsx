import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTypingStatsStore } from '@/stores/typingStatsStore';
import { useComboStore } from '@/stores/comboStore';
import { normalizeCourseMode } from '@/services/courseService';
import { playSound, initSound } from '@/utils/soundEffects';

interface CelebrationParticle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

export function CompletePage() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const coursesQuery = modeParam ? `?mode=${normalizeCourseMode(modeParam)}` : '';
  const typingStats = useTypingStatsStore((s) => s.typingStats);
  const { maxCombo } = useComboStore();
  const [showCombo, setShowCombo] = useState(false);
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 初始化音效并播放完成音效
    try { initSound(); } catch (_) { /* ignore */ }
    playSound('complete');

    // 延迟显示内容
    const timer = setTimeout(() => setShowContent(true), 200);

    // 生成庆祝粒子
    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const newParticles: CelebrationParticle[] = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      duration: 1.2 + Math.random() * 1.5,
      delay: Math.random() * 0.6,
    }));
    setParticles(newParticles);

    if (maxCombo > 0) setShowCombo(true);
    return () => clearTimeout(timer);
  }, [maxCombo]);

  const statBase =
    'flex flex-col items-center p-4 rounded-xl border transition-all duration-300';

  return (
    <div className="relative flex flex-col items-center justify-center h-full px-8 overflow-hidden animate-fade-in">
      {/* 庆祝粒子 */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-celebrate absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: '60%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* 主内容 */}
      <div
        className={`relative z-10 max-w-md w-full text-center space-y-6 ${
          showContent ? 'animate-slide-up-fade' : 'opacity-0'
        }`}
      >
        {/* 奖杯图标 */}
        <div className="text-7xl">🏆</div>

        <div space-y-2>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            课程完成！
          </h1>
          <p className="text-gray-300 text-lg">
            恭喜你完成了这门课程的所有步骤！继续加油！
          </p>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {showCombo && maxCombo > 0 && (
            <div className={`${statBase} bg-blue-500/10 border-blue-500/20`}>
              <div className="text-2xl font-bold text-blue-400">x{maxCombo}</div>
              <div className="text-xs text-gray-400 mt-1">最大连击</div>
            </div>
          )}
          {typingStats.wpm > 0 && (
            <div className={`${statBase} bg-green-500/10 border-green-500/20`}>
              <div className="text-2xl font-bold text-green-400">{typingStats.wpm}</div>
              <div className="text-xs text-gray-400 mt-1">平均 WPM</div>
            </div>
          )}
          {typingStats.totalKeystrokes > 0 && (
            <div
              className={`${statBase} ${
                typingStats.accuracy >= 90
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div
                className={`text-2xl font-bold ${
                  typingStats.accuracy >= 90 ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                {typingStats.accuracy}%
              </div>
              <div className="text-xs text-gray-400 mt-1">准确率</div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <Link
            to={`/courses${coursesQuery}`}
            onClick={() => playSound('click')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95"
          >
            继续学习
          </Link>
          <Link
            to="/"
            onClick={() => playSound('click')}
            className="px-6 py-3 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 hover:bg-gray-800/40 hover:scale-105 active:scale-95"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
