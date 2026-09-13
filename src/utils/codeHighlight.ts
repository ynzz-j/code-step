/**
 * 轻量代码语法着色：对目标代码逐字符标注 Tailwind 颜色类。
 *
 * 支持：字符串（含转义）、行注释（// 与 Python 的 #）、关键字、大写开头类名、数字。
 * 返回数组长度与目标代码长度一致，未命中的字符为空串（使用默认色）。
 */

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'import', 'from', 'export', 'default', 'class', 'extends', 'new', 'delete',
  'async', 'await', 'typeof', 'instanceof', 'in', 'of', 'try', 'catch', 'finally',
  'throw', 'switch', 'case', 'break', 'continue', 'yield', 'void', 'super', 'this',
]);

const PY_KEYWORDS = new Set([
  'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as',
  'class', 'print', 'lambda', 'with', 'try', 'except', 'finally', 'raise',
  'and', 'or', 'not', 'in', 'is', 'pass', 'break', 'continue', 'global', 'del',
]);

export function computeSyntax(target: string, language?: string): string[] {
  const keywords = language === 'python' ? PY_KEYWORDS : JS_KEYWORDS;
  const colors: string[] = new Array(target.length).fill('');
  let i = 0;
  while (i < target.length) {
    const ch = target[i];

    // 字符串（含转义字符跨越）
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      while (j < target.length && target[j] !== ch) {
        if (target[j] === '\\') j += 1;
        j += 1;
      }
      const end = Math.min(j, target.length - 1);
      for (let k = i; k <= end; k++) colors[k] = 'syn-str';
      i = j + 1;
      continue;
    }
    // 行注释：// 或 Python 的 #
    if ((ch === '/' && target[i + 1] === '/') || (ch === '#' && language === 'python')) {
      let j = i;
      while (j < target.length && target[j] !== '\n') {
        colors[j] = 'syn-com';
        j += 1;
      }
      i = j;
      continue;
    }
    // 标识符 / 关键字 / 类名
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < target.length && /[A-Za-z0-9_$]/.test(target[j])) j += 1;
      const word = target.slice(i, j);
      const cls = keywords.has(word)
        ? 'syn-kw'
        : /^[A-Z]/.test(word)
          ? 'syn-type'
          : '';
      for (let k = i; k < j; k++) colors[k] = cls;
      i = j;
      continue;
    }
    // 数字
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < target.length && /[0-9.]/.test(target[j])) {
        colors[j] = 'syn-num';
        j += 1;
      }
      i = j;
      continue;
    }
    i += 1;
  }
  return colors;
}
