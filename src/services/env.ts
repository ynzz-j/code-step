/**
 * 运行环境检测：Tauri 桌面端 vs 纯浏览器（Web demo）。
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}
