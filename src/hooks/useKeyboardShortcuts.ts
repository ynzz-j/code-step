import { useEffect, useCallback } from 'react';

interface ShortcutMap {
  [key: string]: (() => void) | undefined;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // 如果焦点在输入框中，不触发快捷键
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('.cm-editor')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const handler = shortcuts[key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
