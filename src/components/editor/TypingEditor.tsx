import { useState, useEffect, useRef, useCallback } from 'react';
import { useTypingStats } from '@/hooks/useTypingStats';
import { StatsPanel } from '@/components/learn/StatsPanel';
import type { TypingStep } from '@/types';

let audioCtx: AudioContext | null = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // 确保 AudioContext 处于运行状态（浏览器 autoplay policy 要求用户交互后启动）
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 在模块加载时就尝试初始化（如果已经在用户交互上下文中）
if (typeof window !== 'undefined') {
  document.addEventListener('click', () => {
    initAudioContext();
  }, { once: true });
}

function getAudioContext(): AudioContext {
  return initAudioContext();
}

function playTypeSound(correct: boolean) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = correct ? 'sine' : 'square';
    oscillator.frequency.value = correct ? 880 : 220;
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  } catch {}
}

interface TypingEditorProps {
  step: TypingStep;
  onComplete: () => void;
  onKeystroke: (isCorrect: boolean) => void;
  onReset?: () => void;
}

export function TypingEditor({ step, onComplete, onKeystroke, onReset }: TypingEditorProps) {
  const typedRef = useRef('');
  const [typed, setTyped] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // 组件挂载时预初始化音效（需用户已交互）
  useEffect(() => {
    const timer = setTimeout(() => initAudioContext(), 0);
    return () => clearTimeout(timer);
  }, []);

  // 点击编辑器区域时也确保音效就绪
  const handleContainerClick = useCallback(() => {
    initAudioContext();
  }, []);

  // 使用现成的 useTypingStats hook
  const { wpm, accuracy, errors, totalKeystrokes, correctKeystrokes, recordKeystroke, reset: resetStats } = useTypingStats();

  useEffect(() => {
    setTyped('');
    setCursorPosition(0);
    resetStats();
    completedRef.current = false;
    onReset?.();
    containerRef.current?.focus();
  }, [step, onReset, resetStats]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const targetCode = step?.targetCode || "";

    // 防御性检查：无目标代码时直接返回
    if (!targetCode) {
      return;
    }

    // 只对我们处理的特殊键调用preventDefault
    if (e.key === 'Backspace' || e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
    }

    // CapsLock/Shift等修饰键不处理
    if (e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'Escape') {
      return;
    }

    if (e.key === 'Backspace') {
      if (cursorPosition > 0) {
        setTyped((prev) => prev.slice(0, -1));
        setCursorPosition((prev) => prev - 1);
      }
      return;
    }

    // Tab键：插入4个空格
    if (e.key === 'Tab') {
      const spaces = '    ';
      // 检查当前位置后是否有足够的空格
      if (cursorPosition + spaces.length <= targetCode.length) {
        const expected = targetCode.slice(cursorPosition, cursorPosition + spaces.length);
        if (expected === spaces) {
          playTypeSound(true);
          onKeystroke(true);
          setTyped((prev) => prev + spaces);
          setCursorPosition((prev) => prev + spaces.length);
        }
      }
      return;
    }

    // Enter键：插入换行
    if (e.key === 'Enter') {
      const newline = '\n';
      if (cursorPosition < targetCode.length) {
        const expected = targetCode[cursorPosition];
        if (expected === '\n') {
          playTypeSound(true);
          onKeystroke(true);
          setTyped((prev) => prev + newline);
          setCursorPosition((prev) => prev + 1);
        }
      }
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;

    // 只处理单字符的可打印键
    if (e.key.length !== 1) return;
    
    // 过滤非ASCII字符
    if (/[^\x00-\x7F]/.test(e.key)) return;

    if (cursorPosition >= targetCode.length) return;

    const expectedChar = targetCode[cursorPosition];
    const inputChar = e.key;
    const isCorrect = inputChar === expectedChar;

    playTypeSound(isCorrect);
    recordKeystroke(isCorrect);
    onKeystroke(isCorrect);

    setTyped((prev) => prev + inputChar);
    setCursorPosition((prev) => prev + 1);
  }, [cursorPosition, step.targetCode, onKeystroke]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  useEffect(() => {
    if (typed === step.targetCode && typed.length > 0 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [typed, step.targetCode, onComplete]);

  const renderCode = () => {
    const chars: JSX.Element[] = [];
    const targetCode = step?.targetCode || "";

    // 防御性检查
    if (!targetCode) {
      return <span className="text-gray-500">暂无内容</span>;
    }

    for (let i = 0; i < targetCode.length; i++) {
      const char = targetCode[i];
      const isTyped = i < typed.length;
      const isCurrent = i === cursorPosition;
      const isCorrect = isTyped && typed[i] === char;
      const isWrong = isTyped && typed[i] !== char;

      let className = 'text-gray-500';
      if (isCorrect) {
        className = 'text-success-400';
      } else if (isWrong) {
        className = 'text-error-400 bg-error-500/20';
      } else if (isCurrent) {
        className = 'text-gray-200 bg-primary-500/30';
      }

      let displayChar = char;
      if (char === '\n') {
        displayChar = '↵\n';
      } else if (char === ' ') {
        displayChar = '·';
      } else if (char === '\t') {
        displayChar = '→';
      }

      chars.push(
        <span
          key={i}
          className={`${className} relative ${isCurrent ? 'after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-primary-400 after:animate-pulse' : ''}`}
        >
          {displayChar}
        </span>
      );
    }

    return chars;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={containerRef}
        tabIndex={0}
        className="flex-1 overflow-auto p-6 bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-text"
        onClick={() => {
          initAudioContext();
          containerRef.current?.focus();
        }}
      >
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
          点击此处开始打字练习
        </div>
        <pre className="font-mono text-lg leading-relaxed whitespace-pre-wrap">
          {renderCode()}
        </pre>
      </div>

      <StatsPanel stats={{ wpm, accuracy, errors, totalKeystrokes, correctKeystrokes }} />
      <div className="px-6 py-2 bg-gray-800/50 border-t border-gray-700/50">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>进度: {cursorPosition} / {step.targetCode.length}</span>
          <span>{Math.round((cursorPosition / step.targetCode.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{
              width: `${(cursorPosition / step.targetCode.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}