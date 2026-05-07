import type { ValidationRule } from '@/types';

class ValidationService {
  validate(code: string, rule: ValidationRule): boolean {
    switch (rule.type) {
      case 'contains':
        return this.validateContains(code, rule);
      case 'regex':
        return this.validateRegex(code, rule);
      case 'exact':
        return this.validateExact(code, rule);
      default:
        return false;
    }
  }

  private validateContains(code: string, rule: ValidationRule): boolean {
    if (rule.value) {
      return code.includes(rule.value);
    }
    if (rule.keywords) {
      return rule.keywords.every((kw) => code.includes(kw));
    }
    return false;
  }

  private validateRegex(code: string, rule: ValidationRule): boolean {
    if (!rule.pattern) return false;
    try {
      const regex = new RegExp(rule.pattern);
      return regex.test(code);
    } catch {
      return false;
    }
  }

  private validateExact(code: string, rule: ValidationRule): boolean {
    if (!rule.value) return false;
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
    return normalize(code) === normalize(rule.value);
  }
}

export const validationService = new ValidationService();
