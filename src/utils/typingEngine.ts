/**
 * 打字键解析（纯函数）：智能缩进 + 逐字符校验的核心规则。
 *
 * 规则（IDE 式自动对齐）：
 * - 目标位置位于空格段时，不需要逐个敲空格：
 *   - 按空格：一次吞掉整段连续空格；
 *   - 按非空格字符：自动补齐整段空格（视为正确），然后在新位置校验该字符。
 * - 其他情况：普通逐字符校验。
 */

export interface TypingKeyResult {
  /** 需要追加到已输入文本末尾的内容 */
  insertText: string;
  /** 处理完成后的新光标位置 */
  nextPosition: number;
  /** 本此按键自动补齐/吞掉的空格数 */
  consumedSpaces: number;
  /** 是否对 inputChar 本身做了校验 */
  charValidated: boolean;
  /** charValidated 为 true 时的校验结果 */
  charCorrect: boolean;
}

export function resolveTypingKey(
  targetCode: string,
  position: number,
  inputChar: string,
): TypingKeyResult {
  if (position >= targetCode.length) {
    return { insertText: '', nextPosition: position, consumedSpaces: 0, charValidated: false, charCorrect: false };
  }

  let pos = position;

  if (targetCode[pos] === ' ') {
    const runStart = pos;
    while (pos < targetCode.length && targetCode[pos] === ' ') pos += 1;
    const consumedSpaces = pos - runStart;

    // 按的就是空格：一次吞掉整段，不校验额外字符
    if (inputChar === ' ' || pos >= targetCode.length) {
      return {
        insertText: targetCode.slice(runStart, pos),
        nextPosition: pos,
        consumedSpaces,
        charValidated: false,
        charCorrect: true,
      };
    }

    // 按的是非空格字符：补齐空格后在新位置校验
    const charCorrect = targetCode[pos] === inputChar;
    return {
      insertText: targetCode.slice(runStart, pos) + inputChar,
      nextPosition: pos + 1,
      consumedSpaces,
      charValidated: true,
      charCorrect,
    };
  }

  const charCorrect = targetCode[pos] === inputChar;
  return {
    insertText: inputChar,
    nextPosition: pos + 1,
    consumedSpaces: 0,
    charValidated: true,
    charCorrect,
  };
}
