import { describe, it, expect } from 'vitest';
import { computeSyntax } from '../codeHighlight';

describe('computeSyntax', () => {
  it('返回数组长度与输入一致', () => {
    const code = "const x = 'hi';";
    expect(computeSyntax(code)).toHaveLength(code.length);
  });

  it('关键字整词着色，标识符不受影响', () => {
    const colors = computeSyntax('const constant = 1;');
    expect(colors.slice(0, 5)).toEqual(Array(5).fill('syn-kw')); // const
    expect(colors.slice(6, 14)).toEqual(Array(8).fill('')); // constant 不是关键字
  });

  it('字符串（单引号）连同引号整体着色', () => {
    const code = "let s = 'abc';";
    const colors = computeSyntax(code);
    const q = code.indexOf("'");
    expect(colors.slice(q, q + 5)).toEqual(Array(5).fill('syn-str')); // 'abc'
    expect(colors[q + 5]).toBe(''); // 分号
  });

  it('字符串内的转义引号不会提前截断', () => {
    const code = "const s = 'a\\'b';";
    const colors = computeSyntax(code);
    const q = code.indexOf("'");
    const closeQ = code.lastIndexOf("'");
    expect(colors.slice(q, closeQ + 1)).toEqual(Array(closeQ - q + 1).fill('syn-str'));
  });

  it('数字着色（含小数点）', () => {
    const colors = computeSyntax('x = 3.14;');
    const d = 'x = 3.14;'.indexOf('3');
    expect(colors.slice(d, d + 4)).toEqual(Array(4).fill('syn-num'));
  });

  it('行注释 // 到行尾', () => {
    const code = 'x++; // done\ny++;';
    const colors = computeSyntax(code);
    const s = code.indexOf('//');
    const nl = code.indexOf('\n');
    expect(colors.slice(s, nl)).toEqual(Array(nl - s).fill('syn-com'));
    expect(colors[code.indexOf('y++')]).toBe(''); // 下一行不受影响
  });

  it('Python 的 # 注解仅在 python 语言下生效', () => {
    const code = 'x = 1  # note';
    expect(computeSyntax(code, 'python')[code.indexOf('#')]).toBe('syn-com');
    expect(computeSyntax(code, 'javascript')[code.indexOf('#')]).toBe('');
  });

  it('大写开头的标识符按类名着色', () => {
    const colors = computeSyntax('new ResizeObserver(fn)');
    const s = 'new ResizeObserver(fn)'.indexOf('Resize');
    expect(colors.slice(s, s + 6)).toEqual(Array(6).fill('syn-type'));
  });
});
