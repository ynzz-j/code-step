/**
 * 格式化时间（秒 -> 可读字符串）
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) return `${secs}s`;
  return `${minutes}m ${secs}s`;
}

/**
 * 根据语言获取文件扩展名
 */
export function getFileExtension(language: string): string {
  switch (language) {
    case 'java':
      return '.java';
    case 'python':
      return '.py';
    case 'javascript':
      return '.js';
    default:
      return '.txt';
  }
}

/**
 * 根据语言获取默认文件名
 */
export function getDefaultFileName(language: string): string {
  switch (language) {
    case 'java':
      return 'Main.java';
    case 'python':
      return 'main.py';
    case 'javascript':
      return 'main.js';
    default:
      return 'code.txt';
  }
}
