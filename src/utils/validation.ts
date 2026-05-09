import type { ValidationRule } from '@/types';

export interface ValidationResult {
  passed: boolean;
  message: string;
}

export function evaluateValidation(code: string, rule: ValidationRule): ValidationResult {
  switch (rule.type) {
    case 'contains':
      if (!rule.value) return { passed: true, message: '无校验内容' };
      return code.includes(rule.value)
        ? { passed: true, message: `代码包含 "${rule.value}"` }
        : { passed: false, message: `代码应包含 "${rule.value}"` };

    case 'regex':
      if (!rule.pattern) return { passed: true, message: '无正则模式' };
      try {
        const re = new RegExp(rule.pattern);
        return re.test(code)
          ? { passed: true, message: '正则匹配通过' }
          : { passed: false, message: `正则 /${rule.pattern}/ 未匹配` };
      } catch {
        return { passed: false, message: '正则表达式语法错误' };
      }

    case 'exact':
      if (!rule.value) return { passed: true, message: '无精确匹配内容' };
      return code.trim() === rule.value.trim()
        ? { passed: true, message: '代码精确匹配通过' }
        : { passed: false, message: '代码与预期不完全一致' };

    case 'ast':
      return { passed: false, message: 'AST 校验暂未实现，请联系课程作者' };

    default:
      return { passed: true, message: '未知校验类型，默认通过' };
  }
}

/** 归一化输出：统一换行为 \n，去除末尾空白和尾换行 */
export function normalizeOutput(output: string): string {
  return output.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd();
}

/** 判断 coding 步骤是否通过（双条件） */
export function evaluateCodingStep(params: {
  executionSuccess: boolean;
  stdout: string;
  expectedOutput?: string;
  sourceCode: string;
  validation: ValidationRule;
}): { passed: boolean; reason: string } {
  const { executionSuccess, stdout, expectedOutput, sourceCode, validation } = params;

  // 条件1：执行成功
  if (!executionSuccess) {
    return { passed: false, reason: '代码执行未成功' };
  }

  // 条件2a：expectedOutput 存在时，归一化后精确匹配
  if (expectedOutput && expectedOutput.trim().length > 0) {
    const normalizedExpected = normalizeOutput(expectedOutput);
    const normalizedActual = normalizeOutput(stdout);
    if (normalizedActual !== normalizedExpected) {
      return { passed: false, reason: `输出不匹配\n预期: ${normalizedExpected}\n实际: ${normalizedActual}` };
    }
  }

  // 条件2b：validation 存在时，源码规则校验
  const vr = evaluateValidation(sourceCode, validation);
  if (!vr.passed) {
    return { passed: false, reason: vr.message };
  }

  return { passed: true, reason: '通过' };
}
