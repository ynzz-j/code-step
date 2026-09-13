import { describe, it, expect } from 'vitest';
import { resolveTypingKey } from '../typingEngine';

describe('resolveTypingKey（智能缩进核心规则）', () => {
  it('普通字符：正确输入逐位前进', () => {
    const r = resolveTypingKey('const', 0, 'c');
    expect(r).toMatchObject({ insertText: 'c', nextPosition: 1, consumedSpaces: 0, charValidated: true, charCorrect: true });
  });

  it('普通字符：错误输入仍前进但标记错误', () => {
    const r = resolveTypingKey('const', 0, 'x');
    expect(r).toMatchObject({ insertText: 'x', nextPosition: 1, charValidated: true, charCorrect: false });
  });

  it('按一次空格吞掉整段连续空格（缩进 4 格）', () => {
    const r = resolveTypingKey('    return x;', 0, ' ');
    expect(r).toMatchObject({
      insertText: '    ',
      nextPosition: 4,
      consumedSpaces: 4,
      charValidated: false,
      charCorrect: true,
    });
  });

  it('按非空格字符时自动补齐缩进并直接校验该字符', () => {
    const r = resolveTypingKey('    return x;', 0, 'r');
    expect(r).toMatchObject({
      insertText: '    r',
      nextPosition: 5,
      consumedSpaces: 4,
      charValidated: true,
      charCorrect: true,
    });
  });

  it('自动补齐后按错的字符标记为错误', () => {
    const r = resolveTypingKey('    return x;', 0, 'x');
    expect(r).toMatchObject({ insertText: '    x', nextPosition: 5, consumedSpaces: 4, charValidated: true, charCorrect: false });
  });

  it('行中单词间的单个空格：按空格一次通过', () => {
    const r = resolveTypingKey('a b', 1, ' ');
    expect(r).toMatchObject({ insertText: ' ', nextPosition: 2, consumedSpaces: 1, charValidated: false });
  });

  it('空格段恰好延伸到字符串末尾时不越界', () => {
    const r = resolveTypingKey('ab  ', 2, ' ');
    expect(r).toMatchObject({ insertText: '  ', nextPosition: 4, consumedSpaces: 2, charValidated: false });
  });

  it('光标已在末尾时返回空结果', () => {
    const r = resolveTypingKey('ab', 2, 'c');
    expect(r).toMatchObject({ insertText: '', nextPosition: 2, consumedSpaces: 0, charValidated: false });
  });
});
