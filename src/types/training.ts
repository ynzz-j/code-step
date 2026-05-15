import type { Difficulty } from './course';

export interface TrainingPattern {
  id: string;
  label: string;
  snippets: string[];
  targetSkill: string;
  recommendedDuration: number;
}

export interface TrainingPack {
  id: string;
  title: string;
  track: string;
  language: string;
  patterns: TrainingPattern[];
  durationModes: string[];
  difficulty: Difficulty;
  sourceCourseIds: string[];
}

export interface TypingSessionStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  maxCombo: number;
  perfectSegments: number;
  flowScore: number;
  durationMs: number;
}

export interface PatternMastery {
  patternId: string;
  masteryPercent: number;
  bestWpm: number;
  bestFlowScore: number;
  recentTrend: number;
  weakTokens: string[];
}
