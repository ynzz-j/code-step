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

      // 检查是否打破最大记录
      if (currentCombo > prevMaxRef.current && prevMaxRef.current > 0) {
        // 先确保淡出状态重置
        setNewBestFadingOut(false);
        setNewBestVisible(true);
        // 1.8s 后开始淡出，0.5s 淡出动画后移除
        addTimer(() => {
          setNewBestFadingOut(true);
          addTimer(() => setNewBestVisible(false), 500);
        }, 1800);
      }
    } else if (currentCombo === 0 && prevComboRef.current > 0) {
      // 连击中断
      setAnimEvent('reset');

      // 抖动动画结束后开始淡出 combo 数字
      addTimer(() => {
        setComboFadingOut(true);
        // 淡出动画 400ms 后移除
        addTimer(() => {
          setComboVisible(false);
          setComboFadingOut(false);
          setAnimEvent(null);
        }, 400);
      }, 400);
    }

    prevComboRef.current = currentCombo;
    prevMaxRef.current = maxCombo;
  }, [currentCombo, maxCombo]);

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
        glow: 'combo-glow-high',
        textClass: 'text-primary-300',
      };
    }
    if (currentCombo >= 10) {
      return {
        scale: 'scale-110',
        glow: 'combo-glow-mid',
        textClass: 'text-primary-400',
      };
    }
    return {
      scale: 'scale-100',
      glow: '',
      textClass: 'text-gray-200',
    };
  };

  const style = getComboStyle();

  // 不显示连击数字的情况
  if (!comboVisible && currentCombo === 0) {
    return (
      <div className="flex items-center justify-center h-16" />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-16 relative">
      {/* NEW BEST! 标签 */}
      {newBestVisible && (
        <div
          className={`absolute -top-2 ${
            newBestFadingOut
              ? 'animate-combo-newbest-out'
              : 'animate-combo-newbest-in'
          }`}
        >
          <span className="px-3 py-1 text-sm font-bold text-warning-400 bg-warning-500/20 rounded-full border border-warning-500/30">
            NEW BEST!
          </span>
        </div>
      )}

      {/* Combo 数字 */}
      <div
        className={`
          flex items-baseline gap-1 font-mono font-bold select-none
          transition-all duration-300
          ${comboFadingOut ? 'opacity-0 scale-75' : 'opacity-100'}
          ${style.scale}
          ${style.textClass}
          ${style.glow}
          ${animEvent === 'increment' ? 'animate-combo-bounce' : ''}
          ${animEvent === 'reset' ? 'animate-combo-shake' : ''}
        `}
      >
        <span className="text-sm opacity-70 tracking-widest">COMBO</span>
        <span className="text-3xl">
          x{currentCombo}
        </span>
      </div>

      {/* 底部状态栏：最大连击 */}
      {maxCombo > 0 && currentCombo > 0 && !comboFadingOut && (
        <div className="text-xs text-gray-500 mt-1 transition-opacity duration-300">
          Combo最大: {maxCombo}
        </div>
      )}
    </div>
  );
}
