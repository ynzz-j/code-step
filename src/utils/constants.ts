export function isTauri(): boolean {
  return !!(window as any).__TAURI__ || !!(window as any).__TAURI_INTERNALS__;
}
