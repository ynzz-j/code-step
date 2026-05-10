import { useState, useEffect, useRef, useCallback } from 'react';
import { useComboStore } from '@/stores/comboStore';

type ComboEvent = 'increment' | 'reset' | 'new-best';

export function ComboDisplay() {
  const { currentCombo, maxCombo } = useComboStore();
  const [animEvent, setAnimEvent] = useState<ComboEvent | null>(null);
  const [comboVisible, setComboVisible] = useState(false);
  const [comboFadingOut, setComboFadingOut] = useState(false);
  const [newBestVisible, setNewBestVisible] = useState(false);
  const [newBestFadingOut, setNewBestFadingOut] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const prevComboRef = useRef(0);
  const prevMaxRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // 清理所有定时器
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // 生成粒子效果
  const spawnParticles = useCallback((count: number) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  }, []);

  useEffect(() => {
    // 首次有连击时显示
    if (currentCombo > 0 && !comboVisible) {
      setComboVisible(true);
      setComboFadingOut(false);
    }

    // 判断事件类型
    if (currentCombo > prevComboRef.current) {
      // 连击增长
      setAnimEvent('increment');
      spawnParticles(Math.min(currentCombo * 2, 20));

      // 检查是否打破最大记录
      if (currentCombo > prevMaxRef.current && prevMaxRef.current > 0) {
        setNewBestFadingOut(false);
        setNewBestVisible(true);
        addTimer(() => {
          setNewBestFadingOut(true);
          addTimer(() => setNewBestVisible(false), 500);
        }, 1800);
      }
    } else if (currentCombo === 0 && prevComboRef.current > 0) {
      // 连击中断
      setAnimEvent('reset');
      spawnParticles(5);

      // 抖动动画结束后开始淡出 combo 数字
      addTimer(() => {
        setComboFadingOut(true);
        addTimer(() => {
          setComboVisible(false);
          setComboFadingOut(false);
          setAnimEvent(null);
        }, 400);
      }, 400);
    }

    prevComboRef.current = currentCombo;
    prevMaxRef.current = maxCombo;
  }, [currentCombo, maxCombo, spawnParticles]);

  // 重置 animEvent（bounce 完成后）
  useEffect(() => {
    if (animEvent === 'increment') {
      const timer = setTimeout(() => setAnimEvent(null), 300);
      return () => clearTimeout(timer);
    }
  }, [animEvent]);

  // 计算视觉效果等级
  const getComboStyle = () => {
    if (currentCombo >= 30) {
      return {
        scale: 'scale-150',
        glow: 'combo-glow-ultra',
        textClass: 'text-yellow-300',
        particleCount: 20,
      };
    }
    if (currentCombo >= 20) {
      return {
        scale: 'scale-125',
        glow: 'combo-glow-high',
        textClass: 'text-yellow-400',
        particleCount: 15,
      };
    }
    if (currentCombo >= 10) {
      return {
        scale: 'scale-110',
        glow: 'combo-glow-mid',
        textClass: 'text-blue-400',
        particleCount: 10,
      };
    }
    if (currentCombo >= 5) {
      return {
        scale: 'scale-105',
        glow: 'combo-glow-low',
        textClass: 'text-blue-300',
        particleCount: 5,
      };
    }
    return {
      scale: 'scale-100',
      glow: '',
      textClass: 'text-gray-200',
      particleCount: 0,
    };
  };

  const style = getComboStyle();

  // 不显示连击数字的情况
  if (!comboVisible && currentCombo === 0) {
    return (
      <div className="flex items-center justify-center h-20" />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-20 relative">
      {/* 粒子效果 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-particle pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}

      {/* NEW BEST! 标签 */}
      {newBestVisible && (
        <div
          className={`absolute -top-2 ${
            newBestFadingOut
              ? 'animate-combo-newbest-out'
              : 'animate-combo-newbest-in'
          }`}
        >
          <span className="px-3 py-1 text-sm font-bold text-yellow-400 bg-yellow-500/20 rounded-full border border-yellow-500/30 animate-pulse">
            🎯 NEW BEST!
          </span>
        </div>
      )}

      {/* Combo 数字 */}
      <div
        className={`
          flex items-baseline gap-2 font-mono font-bold select-none
          transition-all duration-300
          ${comboFadingOut ? 'opacity-0 scale-75' : 'opacity-100'}
          ${style.scale}
          ${style.textClass}
          ${style.glow}
          ${animEvent === 'increment' ? 'animate-combo-bounce' : ''}
          ${animEvent === 'reset' ? 'animate-combo-shake' : ''}
        `}
      >
        <span className="text-sm opacity-70 tracking-widest font-normal">COMBO</span>
        <span className="text-4xl md:text-5xl">
          x{currentCombo}
        </span>
      </div>

      {/* 底部状态栏：最大连击 + 等级 */}
      {maxCombo > 0 && currentCombo > 0 && !comboFadingOut && (
        <div className="text-xs text-gray-500 mt-1 transition-opacity duration-300 flex items-center gap-2">
          <span>最佳: {maxCombo}</span>
          {currentCombo >= 30 && <span className="text-yellow-400">👑 传奇</span>}
          {currentCombo >= 20 && currentCombo < 30 && <span className="text-purple-400">🔥 大师</span>}
          {currentCombo >= 10 && currentCombo < 20 && <span className="text-blue-400">⚡ 高手</span>}
          {currentCombo >= 5 && currentCombo < 10 && <span className="text-green-400">✨ 进阶</span>}
        </div>
      )}
    </div>
  );
}
