import type { Difficulty } from './course';

export type StepType = 'coding' | 'typing';

export type ValidationType = 'contains' | 'regex' | 'exact' | 'ast';

export interface ValidationRule {
  type: ValidationType;
  value?: string;
  pattern?: string;
  keywords?: string[];
  exactMatch?: boolean;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  execution_time_ms: number;
  error_type: 'None' | 'CompileError' | 'RuntimeError' | 'Timeout' | 'Unsupported';
}

export interface BaseStep {
  id: string;
  type: StepType;
  title: string;
  concept: string;
  difficulty: Difficulty;
  instruction: string;
  hint?: string;
  encouragement?: string;
  expectedOutput?: string;
}

export interface CodingStep extends BaseStep {
  type: 'coding';
  starter?: string;
  answer: string;
  validation: ValidationRule;
  stdin?: string;
}

export interface TypingStep extends BaseStep {
  type: 'typing';
  targetCode: string;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
}

export type Step = CodingStep | TypingStep;