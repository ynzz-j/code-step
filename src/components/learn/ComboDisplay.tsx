import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { useComboStore } from '@/stores/comboStore';
import { playSound } from '@/utils/soundEffects';
import flameIcon from '@/assets/icons/flame.webp';
import newBestIcon from '@/assets/icons/new-best.webp';

type ComboEvent = 'increment' | 'reset' | 'new-best';

interface ComboDisplayProps {
  compact?: boolean;
}

interface ComboFlashState {
  combo: number;
  maxCombo: number;
  isNewBest: boolean;
  fadingOut: boolean;
}

export function ComboDisplay({ compact = false }: ComboDisplayProps) {
  const { currentCombo, maxCombo } = useComboStore();
  const [animEvent, setAnimEvent] = useState<ComboEvent | null>(null);
  const [comboVisible, setComboVisible] = useState(false);
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

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (currentCombo > 0 && !comboVisible) {
      setComboVisible(true);
    }

    if (currentCombo > prevComboRef.current) {
      setAnimEvent('increment');

      // 只在里程碑时播放音效和粒子
      if (currentCombo > prevMaxRef.current && prevMaxRef.current > 0) {
        playSound('new-best');
        setNewBestFadingOut(false);
        setNewBestVisible(true);
        addTimer(() => {
          setNewBestFadingOut(true);
          addTimer(() => setNewBestVisible(false), 500);
        }, 1800);
      } else if ([10, 20, 30].includes(currentCombo)) {
        playSound(currentCombo >= 30 ? 'combo-30' : currentCombo >= 20 ? 'combo-20' : 'combo-10');
      }
    } else if (currentCombo === 0 && prevComboRef.current > 0) {
      setAnimEvent('reset');
      playSound('combo-reset');
      const timer = setTimeout(() => {
        setComboVisible(false);
        setAnimEvent(null);
      }, 400);
      timersRef.current.push(timer);
    }

    prevComboRef.current = currentCombo;
    prevMaxRef.current = maxCombo;
  }, [currentCombo, maxCombo, addTimer]);

  useEffect(() => {
    if (animEvent === 'increment') {
      const timer = setTimeout(() => setAnimEvent(null), 300);
      return () => clearTimeout(timer);
    }
  }, [animEvent]);

  // 紧凑模式 - 用于顶部状态栏
  if (compact) {
    if (currentCombo === 0) {
      return <span className="text-[10px] text-text-muted w-16 text-right">COMBO x0</span>;
    }
    const isMilestone = currentCombo >= 10;
    return (
      <div className="flex items-center gap-1.5">
        {newBestVisible && !newBestFadingOut && (
          <span className="text-[10px] text-accent-record animate-pulse">NEW BEST</span>
        )}
        <span
          className={`
            text-xs font-mono font-bold transition-all duration-200
            ${currentCombo >= 20 ? 'text-accent-record' : ''}
            ${currentCombo >= 10 && currentCombo < 20 ? 'text-accent-primary' : ''}
            ${currentCombo < 10 ? 'text-text-primary' : ''}
            ${animEvent === 'increment' ? 'scale-110' : 'scale-100'}
          `}
        >
          COMBO x{currentCombo}
        </span>
        {isMilestone && (
          <span className="text-[10px] text-text-muted">最佳:{maxCombo}</span>
        )}
      </div>
    );
  }

  // 不显示连击的情况
  if (!comboVisible && currentCombo === 0) {
    return null;
  }

  // 完整模式 - 里程碑时显示火焰环徽章（mockup 反馈 01）
  const isMilestone = currentCombo >= 10;
  const tier = currentCombo >= 30 ? 3 : currentCombo >= 20 ? 2 : 1;
  const tierRing =
    tier === 3
      ? 'border-accent-record/70 bg-accent-record/15 text-accent-record shadow-accent-record/30'
      : tier === 2
        ? 'border-primary-500/80 bg-primary-500/15 text-primary-300 shadow-primary-500/25'
        : 'border-primary-500/50 bg-primary-500/10 text-primary-300 shadow-primary-500/15';
  const tierLabel =
    currentCombo >= 30
      ? '超神状态！不可阻挡！'
      : currentCombo >= 20
        ? '状态正热！手感越来越好了！'
        : '状态不错！保持这个节奏！';
  const comboAnim =
    animEvent === 'increment' ? 'animate-combo-bounce' : animEvent === 'reset' ? 'animate-combo-shake' : '';
  // 火焰呼吸：档位越高越躁（30 档额外飘余烬）
  const tierAnim = tier === 3 ? 'combo-breathe-3' : tier === 2 ? 'combo-breathe-2' : 'combo-breathe-1';

  return (
    <div className={`flex flex-col items-center justify-center ${isMilestone ? 'h-28' : 'h-10'}`}>
      {newBestVisible && (
        <div className={`absolute -top-1 ${newBestFadingOut ? 'animate-combo-newbest-out' : 'animate-combo-newbest-in'}`}>
          <span className="px-2 py-0.5 text-xs font-bold text-accent-record bg-accent-record/20 rounded-brand border border-accent-record/30">
            NEW BEST!
          </span>
        </div>
      )}

      {isMilestone ? (
        <div
          className={`
            relative w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-lg
            transition-all duration-300 ${tierRing} ${comboAnim} ${tierAnim}
            ${comboVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <span className="absolute -top-2 px-1.5 py-px text-[9px] font-bold rounded-full bg-bg-panel border border-inherit text-inherit">
            {currentCombo} 连击
          </span>
          {tier === 3 && (
            <>
              <span className="combo-ember" style={{ left: '16%', top: '32%', '--dx': '-7px', '--delay': '0ms' } as CSSProperties} />
              <span className="combo-ember" style={{ left: '76%', top: '26%', '--dx': '6px', '--delay': '460ms' } as CSSProperties} />
              <span className="combo-ember" style={{ left: '48%', top: '10%', '--dx': '2px', '--delay': '920ms' } as CSSProperties} />
            </>
          )}
          <svg className="w-3.5 h-3.5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
          </svg>
          <span className="text-lg font-bold font-mono leading-none">{currentCombo}</span>
        </div>
      ) : (
        <div
          className={`
            flex items-baseline gap-1.5 font-mono font-bold select-none text-text-secondary
            transition-all duration-300 ${comboAnim}
            ${comboVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <span className="text-xs opacity-60 tracking-wider font-normal">COMBO</span>
          <span className="text-xl">x{currentCombo}</span>
        </div>
      )}

      {isMilestone && currentCombo > 0 && (
        <div className="mt-1.5 select-none font-hand text-xs text-primary-200/80 text-center">
          {tierLabel}
        </div>
      )}
    </div>
  );
}

export function ComboFlashOverlay() {
  const { currentCombo, maxCombo } = useComboStore();
  const [flash, setFlash] = useState<ComboFlashState | null>(null);
  const prevComboRef = useRef(0);
  const prevMaxRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (currentCombo === 0) {
      clearTimers();
      setFlash(null);
      prevComboRef.current = 0;
      prevMaxRef.current = maxCombo;
      return;
    }

    if (currentCombo > prevComboRef.current) {
      clearTimers();
      const isNewBest = currentCombo > prevMaxRef.current && prevMaxRef.current > 0;
      setFlash({
        combo: currentCombo,
        maxCombo,
        isNewBest,
        fadingOut: false,
      });

      timersRef.current.push(
        setTimeout(() => {
          setFlash((current) => current ? { ...current, fadingOut: true } : current);
        }, 650),
      );
      timersRef.current.push(
        setTimeout(() => setFlash(null), 950),
      );
    }

    prevComboRef.current = currentCombo;
    prevMaxRef.current = maxCombo;
  }, [clearTimers, currentCombo, maxCombo]);

  if (!flash) return null;

  // 里程碑 / 新纪录：mockup 反馈 04 的里程碑 Toast 卡片
  const isBigMoment = flash.isNewBest || flash.combo === 10 || flash.combo === 20 || flash.combo === 30;

  if (isBigMoment) {
    const title = flash.isNewBest ? '新的最佳成就！' : `${flash.combo} 连击达成！`;
    const subtitle = flash.isNewBest
      ? `Max Combo 提升至 x${flash.combo}，超越昨天的自己`
      : flash.combo >= 30
        ? '超神状态！不可阻挡！'
        : flash.combo >= 20
          ? '状态正热！手感越来越好了！'
          : '状态不错！保持这个节奏！';

    return (
      <div
        className={`
          pointer-events-none absolute inset-x-0 top-14 z-20 flex justify-center
          transition-all duration-300
          ${flash.fadingOut ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}
        `}
        aria-hidden="true"
      >
        <div className="flex items-center gap-3 w-72 rounded-brand border border-primary-500/30 bg-bg-panel/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-md">
          <img
            src={flash.isNewBest ? newBestIcon : flameIcon}
            alt=""
            className="h-11 w-11 object-contain flex-shrink-0 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            draggable={false}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-text-primary truncate">{title}</span>
              {flash.isNewBest && (
                <span className="flex-shrink-0 px-1 py-px text-[9px] font-bold rounded bg-accent-record text-bg-app">NEW</span>
              )}
            </div>
            <p className="text-[10px] text-text-secondary mt-0.5">{subtitle}</p>
          </div>
          <span className="text-2xl font-bold font-mono text-primary-300 flex-shrink-0">{flash.combo}</span>
        </div>
      </div>
    );
  }

  const isRecordTone = flash.combo >= 20 || flash.isNewBest;
  const isMilestone = flash.combo >= 10;

  return (
    <div
      className={`
        pointer-events-none absolute inset-x-0 top-14 z-20 flex justify-center
        transition-all duration-300
        ${flash.fadingOut ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}
      `}
      aria-hidden="true"
    >
      <div
        className={`
          flex items-center gap-3 rounded-brand border px-4 py-2 font-mono font-bold shadow-2xl backdrop-blur-md
          animate-combo-bounce
          ${isRecordTone
            ? 'border-accent-record/50 bg-accent-record/15 text-accent-record shadow-accent-record/20'
            : isMilestone
              ? 'border-accent-primary/50 bg-accent-primary/15 text-accent-primary shadow-accent-primary/20'
              : 'border-bg-surface/70 bg-bg-panel/90 text-text-primary shadow-black/30'}
        `}
      >
        {isMilestone && (
          <svg className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
          </svg>
        )}
        <span className="text-xs tracking-wider opacity-70">COMBO</span>
        <span className={`${isMilestone ? 'text-4xl' : 'text-2xl'} leading-none`}>
          x{flash.combo}
        </span>
        {isMilestone && !flash.isNewBest && (
          <span className="font-hand text-xs font-normal opacity-80">
            {flash.combo >= 30 ? '超神状态！' : flash.combo >= 20 ? '状态正热！' : '状态不错！'}
          </span>
        )}
        {(flash.isNewBest || isMilestone) && (
          <span
            className={`
              rounded-tool border px-2 py-0.5 text-[10px] leading-none
              ${isRecordTone
                ? 'border-accent-record/40 bg-accent-record/15 text-accent-record'
                : 'border-accent-primary/40 bg-accent-primary/15 text-accent-primary'}
            `}
          >
            {flash.isNewBest ? 'NEW BEST' : `BEST x${flash.maxCombo}`}
          </span>
        )}
      </div>
    </div>
  );
}
