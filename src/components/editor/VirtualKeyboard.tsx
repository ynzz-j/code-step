import { useEffect, useRef, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import keyboardIcon from '@/assets/icons/keyboard.png';

export interface KeyStrokeInfo {
  /** 实际字符：'\n' Enter、'\t' Tab、'\b' Backspace、' ' 空格 */
  char: string;
  correct: boolean;
  seq: number;
}

interface VirtualKeyboardProps {
  /** 下一个待输入字符 */
  nextChar: string;
  /** 最近一次真实击键（用于正确/错误闪烁反馈） */
  lastInput?: KeyStrokeInfo | null;
  /** 全宽布局：精简顶行（图例由外部左右侧板承担） */
  wide?: boolean;
}

// 符号 → (主键, 是否需要 Shift)
const SHIFT_MAP: Record<string, string> = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\',
  ':': ';', '"': "'", '<': ',', '>': '.', '?': '/',
};

// 布局里的按钮名（小写/无 shift 形态）——用于指法分区匹配
// （按钮名与 LAYOUT.default 中的字符键一致）

function shiftNeeded(ch: string): boolean {
  if (!ch) return false;
  if (/[a-z]/.test(ch)) return false;
  if (/[A-Z]/.test(ch)) return true;
  return Boolean(SHIFT_MAP[ch]);
}

/** 字符 → 当前布局下的按钮名 */
function toButton(ch: string, isShiftLayout: boolean): string {
  if (!ch) return '';
  if (ch === '\n') return '{enter}';
  if (ch === ' ') return '{space}';
  if (ch === '\t') return '{tab}';
  if (ch === '\b') return '{bksp}';
  if (/[a-zA-Z0-9]/.test(ch)) return isShiftLayout ? ch.toUpperCase() : ch.toLowerCase();
  return isShiftLayout ? ch : (SHIFT_MAP[ch] ?? ch);
}

// 指法分区（线框：建议手指）
const FINGER_ZONES: [string, string[]][] = [
  ['左手小指', ['`', '1', 'q', 'a', 'z']],
  ['左手无名指', ['2', 'w', 's', 'x']],
  ['左手中指', ['3', 'e', 'd', 'c']],
  ['左手食指', ['4', '5', 'r', 't', 'f', 'g', 'v', 'b']],
  ['右手食指', ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm']],
  ['右手中指', ['8', 'i', 'k', ',']],
  ['右手无名指', ['9', 'o', 'l', '.']],
  ['右手小指', ['0', '-', '=', 'p', '[', ']', '\\', ';', "'", '/']],
];

function fingerFor(key: string): string {
  if (key === 'space') return '双手拇指';
  for (const [finger, keys] of FINGER_ZONES) {
    if (keys.includes(key)) return finger;
  }
  return '—';
}

const LAYOUT = {
  default: [
    '{escape} 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
    '{tab} q w e r t y u i o p [ ] \\',
    '{lock} a s d f g h j k l ; \' {enter}',
    '{shift} z x c v b n m , . / {shift}',
    '{ctrl} {win} {alt} {space} {alt} {fn} {menu} {ctrl}',
  ],
  shift: [
    '{escape} ! @ # $ % ^ & * ( ) _ + {bksp}',
    '{tab} Q W E R T Y U I O P { } |',
    '{lock} A S D F G H J K L : " {enter}',
    '{shift} Z X C V B N M < > ? {shift}',
    '{ctrl} {win} {alt} {space} {alt} {fn} {menu} {ctrl}',
  ],
};

// 键帽显示：字母统一大写（参考图样式），按钮名保持小写以便匹配
const UPPERCASE_DISPLAY = Object.fromEntries(
  'qwertyuiopasdfghjklzxcvbnm'.split('').map((k) => [k, k.toUpperCase()]),
);

const DISPLAY = {
  ...UPPERCASE_DISPLAY,
  '{escape}': 'Esc',
  '{bksp}': 'Backspace',
  '{tab}': 'Tab',
  '{lock}': 'Caps Lock',
  '{enter}': 'Enter',
  '{shift}': 'Shift',
  '{ctrl}': 'Ctrl',
  '{win}': 'Win',
  '{alt}': 'Alt',
  '{fn}': 'Fn',
  '{menu}': '☰',
  '{space}': 'Space',
};

const COMMAND_BUTTONS = ['{enter}', '{tab}', '{bksp}', '{lock}', '{shift}', '{ctrl}', '{alt}', '{win}', '{fn}', '{menu}'];

/**
 * 虚拟键盘（react-simple-keyboard 骨架 + CodeStep 皮肤，参考 键位视觉参考.png）
 * - 当前应按键：金橙 glow + 轻微上浮
 * - 正确输入：绿色短闪；错误输入：红光 + shake
 * - 物理键盘按下时虚拟键同步下沉（physicalKeyboardHighlight）
 */
export function VirtualKeyboard({ nextChar, lastInput, wide = false }: VirtualKeyboardProps) {
  const [view, setView] = useState<'keyboard' | 'fingers'>('keyboard');
  const [hidden, setHidden] = useState(false);
  const [flash, setFlash] = useState<{ button: string; ok: boolean } | null>(null);

  const needShift = shiftNeeded(nextChar);
  const layoutName = needShift ? 'shift' : 'default';
  const nextButton = toButton(nextChar, needShift);
  const baseKey = nextChar ? nextChar.toLowerCase() : '';
  const finger = nextChar
    ? fingerFor(nextChar === ' ' ? 'space' : baseKey === "'" || baseKey === '\\' ? baseKey : baseKey)
    : '';

  // 正确 / 错误闪烁（短反馈后自动恢复）
  const lastSeqRef = useRef(0);
  useEffect(() => {
    if (!lastInput || lastInput.seq === lastSeqRef.current) return;
    lastSeqRef.current = lastInput.seq;
    setFlash({ button: toButton(lastInput.char, needShift), ok: lastInput.correct });
    const t = setTimeout(() => setFlash(null), 260);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInput?.seq]);

  const buttonTheme: { class: string; buttons: string }[] = [];
  const nextButtons = [nextButton];
  if (needShift) nextButtons.push('{shift}');
  if (nextButton) buttonTheme.push({ class: 'cs-next', buttons: nextButtons.join(' ') });
  if (flash) {
    buttonTheme.push({ class: flash.ok ? 'cs-ok' : 'cs-err', buttons: flash.button });
  }
  buttonTheme.push({ class: 'cs-command', buttons: COMMAND_BUTTONS.join(' ') });

  if (hidden) {
    return (
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-bg-surface/40 bg-bg-panel/40">
        <span className="text-[10px] text-text-muted">键盘反馈已收起</span>
        <button
          onClick={() => setHidden(false)}
          className="text-[10px] text-primary-400 hover:text-primary-300 transition-colors"
        >
          展开键盘视图
        </button>
      </div>
    );
  }

  const displayCharLabel =
    nextChar === ' ' ? '␣' : nextChar === '\n' ? '⏎' : nextChar === '\t' ? '⇥' : nextChar.toUpperCase();

  const viewToggles = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setView('keyboard')}
        className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${view === 'keyboard' ? 'bg-primary-500/15 text-primary-300 border-primary-500/25' : 'text-text-muted border-transparent hover:text-text-secondary'}`}
      >
        键盘视图
      </button>
      <button
        onClick={() => setView('fingers')}
        className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${view === 'fingers' ? 'bg-primary-500/15 text-primary-300 border-primary-500/25' : 'text-text-muted border-transparent hover:text-text-secondary'}`}
      >
        指法提示
      </button>
      {!wide && (
        <button
          onClick={() => setHidden(true)}
          className="px-2 py-0.5 rounded text-[10px] text-text-muted border border-transparent hover:text-text-secondary"
        >
          收起
        </button>
      )}
    </div>
  );

  // 全宽模式（打字界面UI）：精简顶行，图例由外部左右侧板承担
  if (wide) {
    return (
      <div className="px-4 py-2.5 select-none min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 text-[10px] text-text-muted min-w-0">
            <span className="flex-shrink-0">当前按键</span>
            <span className={`cs-keycap-preview ${nextChar ? 'cs-next' : ''} inline-flex items-center justify-center flex-shrink-0`}>
              {displayCharLabel || '·'}
            </span>
            {nextChar && (
              <span className="hidden lg:inline truncate">
                建议使用：<span className="text-primary-300 font-medium">{finger}</span>
              </span>
            )}
          </div>
          {viewToggles}
        </div>

        {view === 'keyboard' ? (
          <Keyboard
            baseClass="cs-keyboard"
            theme="hg-theme-default cs-keyboard"
            layout={LAYOUT}
            display={DISPLAY}
            layoutName={layoutName}
            buttonTheme={buttonTheme}
            physicalKeyboardHighlight
            physicalKeyboardHighlightPress
            disableButtonHold
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 py-1">
            {FINGER_ZONES.map(([zone, keys]) => (
              <div key={zone} className="flex items-center gap-2 text-[10px]">
                <span className="text-primary-300 flex-shrink-0 w-16">{zone}</span>
                <code className="font-mono text-text-secondary truncate">{keys.join(' ').toUpperCase()}</code>
              </div>
            ))}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-primary-300 flex-shrink-0 w-16">双手拇指</span>
              <code className="font-mono text-text-secondary">SPACE</code>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-bg-surface/40 bg-bg-panel/40 px-4 py-2 select-none">
      {/* 指引栏（参考图顶部） */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <img src={keyboardIcon} alt="" className="h-6 w-6 object-contain flex-shrink-0" draggable={false} />
          <div className="min-w-0">
            <span className="text-xs font-bold text-text-primary">键盘指引</span>
            <span className="ml-2 text-[10px] text-text-muted hidden md:inline">跟随高亮按键，使用正确指法，建立肌肉记忆。</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[10px] text-text-muted">当前按键</span>
          <span
            className={`cs-keycap-preview ${nextChar ? 'cs-next' : ''} inline-flex items-center justify-center`}
          >
            {displayCharLabel || '·'}
          </span>
          <span className="text-[10px] text-text-muted hidden lg:inline">
            建议使用：<span className="text-primary-300 font-medium">{nextChar ? finger : '—'}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView('keyboard')}
              className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${view === 'keyboard' ? 'bg-primary-500/15 text-primary-300 border-primary-500/25' : 'text-text-muted border-transparent hover:text-text-secondary'}`}
            >
              键盘视图
            </button>
            <button
              onClick={() => setView('fingers')}
              className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${view === 'fingers' ? 'bg-primary-500/15 text-primary-300 border-primary-500/25' : 'text-text-muted border-transparent hover:text-text-secondary'}`}
            >
              指法提示
            </button>
            <button
              onClick={() => setHidden(true)}
              className="px-2 py-0.5 rounded text-[10px] text-text-muted border border-transparent hover:text-text-secondary"
            >
              收起
            </button>
          </div>
        </div>
      </div>

      {view === 'keyboard' ? (
        <>
          <Keyboard
            baseClass="cs-keyboard"
            theme="hg-theme-default cs-keyboard"
            layout={LAYOUT}
            display={DISPLAY}
            layoutName={layoutName}
            buttonTheme={buttonTheme}
            physicalKeyboardHighlight
            physicalKeyboardHighlightPress
            disableButtonHold
          />
          {/* 图例 */}
          <div className="flex items-center gap-4 mt-1.5 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-400" /> 当前按键
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success-500" /> 已输入正确
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error-500" /> 输入错误
            </span>
            <span className="hidden md:inline ml-auto">按错会红光抖动一下——目标是让手指记住正确路径。</span>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 py-1">
          {FINGER_ZONES.map(([zone, keys]) => (
            <div key={zone} className="flex items-center gap-2 text-[10px]">
              <span className="text-primary-300 flex-shrink-0 w-16">{zone}</span>
              <code className="font-mono text-text-secondary truncate">{keys.join(' ').toUpperCase()}</code>
            </div>
          ))}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-primary-300 flex-shrink-0 w-16">双手拇指</span>
            <code className="font-mono text-text-secondary">SPACE</code>
          </div>
        </div>
      )}
    </div>
  );
}
