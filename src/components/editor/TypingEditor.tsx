import { useState, useEffect, useRef, useCallback, useMemo, type CSSProperties } from 'react';
import { useTypingStats } from '@/hooks/useTypingStats';
import { useChartStore } from '@/stores/chartStore';
import { initSound, playSound } from '@/utils/soundEffects';
import { computeSyntax } from '@/utils/codeHighlight';
import { resolveTypingKey } from '@/utils/typingEngine';
import type { TypingStep } from '@/types';

interface Spark {
  id: number;
  index: number;
  dx: number;
}

export interface TypingCompleteData {
  backspaces: number;
  perfect: boolean;
  durationMs: number;
}

interface TypingEditorProps {
  step: TypingStep;
  onComplete: (data: TypingCompleteData) => void;
  onKeystroke: (isCorrect: boolean, info?: { expected: string; input: string; position: number }) => void;
  onBackspace?: (info: { position: number }) => void;
  onReset?: () => void;
  /** 无退格完成当前步骤时触发 */
  onPerfectStrike?: () => void;
  /** 代码卡头语言标签（线框 4.5-B） */
  language?: string;
  /** 重置本题 */
  onReplay?: () => void;
  /** 光标位置变化（供外部全宽键盘/进度条使用） */
  onCursorChange?: (position: number) => void;
}

export function TypingEditor({
  step,
  onComplete,
  onKeystroke,
  onBackspace,
  onReset,
  onPerfectStrike,
  language,
  onReplay,
  onCursorChange,
}: TypingEditorProps) {
  const [typed, setTyped] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const backspaceCount = useRef(0);
  const startedAtRef = useRef(Date.now());

  // 打字火花：敲对字符时光标处溅出的小粒子（同屏上限 9 个，自动清理）
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkSeqRef = useRef(0);
  const addSpark = useCallback((index: number) => {
    setSparks((list) => {
      if (list.length > 8) return list;
      const id = ++sparkSeqRef.current;
      const spark: Spark = { id, index, dx: Number((Math.random() * 14 - 7).toFixed(1)) };
      setTimeout(() => setSparks((cur) => cur.filter((s) => s.id !== id)), 460);
      return [...list, spark];
    });
  }, []);

  // 组件挂载时预初始化音效（需用户已交互）
  useEffect(() => {
    const timer = setTimeout(() => initSound(), 0);
    return () => clearTimeout(timer);
  }, []);

  // 使用现成的 useTypingStats hook
  const { wpm, accuracy, recordKeystroke, reset: resetStats } = useTypingStats();

  useEffect(() => {
    setTyped('');
    setCursorPosition(0);
    resetStats();
    completedRef.current = false;
    backspaceCount.current = 0;
    startedAtRef.current = Date.now();
    onReset?.();
    containerRef.current?.focus();
  }, [step, onReset, resetStats]);

  // 上报光标位置（外部键盘/进度条）
  useEffect(() => {
    onCursorChange?.(cursorPosition);
  }, [cursorPosition, onCursorChange, step]);

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
      backspaceCount.current += 1;
      playSound('typing', { variant: 'backspace' });
      onBackspace?.({ position: cursorPosition });
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
          playSound('typing', { variant: 'space' });
          onKeystroke(true, { expected: spaces, input: spaces, position: cursorPosition });
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
          playSound('typing', { variant: 'enter' });
          onKeystroke(true, { expected: newline, input: newline, position: cursorPosition });
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

    const inputChar = e.key;

    // IDE 式自动对齐：空格段由 resolveTypingKey 自动补齐/吞掉，只播一声空格键
    const result = resolveTypingKey(targetCode, cursorPosition, inputChar);

    if (result.consumedSpaces > 0) {
      playSound('typing', { variant: 'space' });
      for (let i = 0; i < result.consumedSpaces; i += 1) {
        recordKeystroke(true);
        onKeystroke(true, { expected: ' ', input: ' ', position: cursorPosition + i });
      }
    }

    if (result.charValidated) {
      const expectedChar = targetCode[result.nextPosition - 1];
      playSound(result.charCorrect ? 'typing' : 'error');
      recordKeystroke(result.charCorrect);
      if (result.charCorrect) {
        addSpark(result.nextPosition - 1);
      }
      onKeystroke(result.charCorrect, {
        expected: expectedChar,
        input: inputChar,
        position: result.nextPosition - 1,
      });
    }

    setTyped((prev) => prev + result.insertText);
    setCursorPosition(result.nextPosition);
  }, [cursorPosition, step.targetCode, onKeystroke, onBackspace]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // 每 3 个字符推送一次图表数据
    if (typed.length > 0 && typed.length % 3 === 0) {
      useChartStore.getState().pushWpm(wpm);
      useChartStore.getState().pushAccuracy(accuracy);
    }
  }, [typed, wpm, accuracy]);

  useEffect(() => {
    if (typed === step.targetCode && typed.length > 0 && !completedRef.current) {
      completedRef.current = true;
      const backspaces = backspaceCount.current;
      const perfect = backspaces === 0;
      const durationMs = Date.now() - startedAtRef.current;
      if (perfect) {
        onPerfectStrike?.();
      }
      playSound(perfect ? 'perfect' : 'success');
      onComplete({ backspaces, perfect, durationMs });
    }
  }, [typed, step.targetCode, onComplete, onPerfectStrike]);

  // 按行拆分目标代码（行号区），保留全局字符索引
  const lines = useMemo(() => {
    const target = step?.targetCode || '';
    const rows: { start: number; text: string }[] = [];
    let start = 0;
    for (let i = 0; i < target.length; i++) {
      if (target[i] === '\n') {
        rows.push({ start, text: target.slice(start, i + 1) });
        start = i + 1;
      }
    }
    if (start < target.length) rows.push({ start, text: target.slice(start) });
    if (rows.length === 0) rows.push({ start: 0, text: '' });
    return rows;
  }, [step.targetCode]);

  const syntaxClasses = useMemo(
    () => computeSyntax(step?.targetCode || '', language),
    [step.targetCode, language],
  );

  const renderChar = (char: string, index: number) => {
    const isTyped = index < typed.length;
    const isCurrent = index === cursorPosition;
    const isWrong = isTyped && typed[index] !== char;
    const syn = syntaxClasses[index] || '';

    const nodes: JSX.Element[] = [];
    // 琥珀色光标（参考打字界面UI：竖条光标）
    if (isCurrent) {
      nodes.push(<span key={`${index}-caret`} className="cs-caret" />);
    }

    let displayChar = char;
    if (char === '\n') displayChar = '↵';
    else if (char === ' ') displayChar = ' ';
    else if (char === '\t') displayChar = '→';

    let cls = syn;
    if (isWrong) cls = `${cls ? cls + ' ' : ''}ch-err`;
    else if (isTyped) cls = `${cls ? cls + ' ' : ''}ch-ok`;
    else cls = `${cls ? cls + ' ' : ''}ch-pending`;

    const idxSparks = sparks.filter((s) => s.index === index);

    nodes.push(
      <span key={index} className={`${cls}${cls ? ' ' : ''}relative`}>
        {displayChar}
        {idxSparks.map((s) => (
          <span key={s.id} className="ch-spark" style={{ '--dx': `${s.dx}px` } as CSSProperties} />
        ))}
      </span>,
    );
    return nodes;
  };

  const currentLineIndex = lines.findIndex(
    (line) => cursorPosition >= line.start && cursorPosition < line.start + line.text.length,
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 代码训练主卡头（线框 4.5-B） */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-panel/50 border-b border-bg-surface/40">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3m-5 5l2-16" />
          </svg>
          <span className="text-xs text-text-secondary">在下方输入以下代码（实时校验 · <span className="text-primary-300">缩进自动对齐</span>，空格无需逐个敲）</span>
        </div>
        <div className="flex items-center gap-2">
          {language && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-bg-surface/70 text-text-secondary border border-bg-elevated/50">
              <span className="px-1 py-px rounded-sm bg-yellow-400/20 text-yellow-300 font-bold text-[9px]">
                {language === 'javascript' ? 'JS' : language === 'python' ? 'Py' : language.slice(0, 2).toUpperCase()}
              </span>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </span>
          )}
          <span className="w-px h-3.5 bg-gray-700/60" />
          {onReplay && (
            <button
              onClick={() => {
                playSound('click');
                onReplay();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-text-secondary hover:text-primary-300 hover:bg-bg-surface/60 border border-transparent hover:border-primary-500/30 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重置本题
            </button>
          )}
        </div>
      </div>

      {/* 代码区：行号 + 语法高亮字符 + 琥珀光标 */}
      <div
        ref={containerRef}
        tabIndex={0}
        className="flex-1 overflow-auto p-4 bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-primary-500/40 cursor-text"
        onClick={() => {
          initSound();
          containerRef.current?.focus();
        }}
      >
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
          点击此处开始打字练习
        </div>
        <div className="font-mono text-base leading-relaxed">
          {lines.map((line, rowIdx) => (
            <div key={rowIdx} className="flex">
              <span
                className={`w-8 flex-shrink-0 pr-2 text-right text-[10px] leading-relaxed select-none ${
                  rowIdx === currentLineIndex ? 'text-primary-300 font-bold' : 'text-gray-600'
                }`}
              >
                {rowIdx + 1}
              </span>
              <span className="whitespace-pre-wrap break-all flex-1 min-w-0">
                {line.text.split('').map((char, offset) => renderChar(char, line.start + offset))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
