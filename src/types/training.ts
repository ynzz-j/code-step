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

export interface TypingAttemptPayload {
  courseId: string;
  stepIndex: number;
  patternId: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  maxCombo: number;
  flowScore: number;
  durationMs: number;
  perfect: boolean;
  weakTokens: string[];
  localDay: string;
}

export interface GrowthSummary {
  totalAttempts: number;
  avgWpm: number;
  avgAccuracy: number;
  bestCombo: number;
  totalTimeMin: number;
  completedCourses: number;
  todayImproved: boolean;
  todayDelta: number;
  recentWpm: number;
  recentAccuracy: number;
  hasActivity: boolean;
}

export interface TrainingPackGrowth {
  packId: string;
  masteryPercent: number;
  bestWpm: number;
  bestFlowScore: number;
  bestCombo: number;
  todayDelta: number;
  recentTrend: number;
  lastPracticedAt: string | null;
}

export interface WeakTokenStat {
  token: string;
  count: number;
  packId: string;
  patternId: string;
}

// =========== Challenge System Types ===========

export type ChallengeMode =
  | 'speed-30s'
  | 'focus-3min'
  | 'perfect-run'
  | 'combo-rush';

export interface ChallengeRunPayload {
  packId: string;
  challengeMode: ChallengeMode;
  durationMs: number;
  charsTyped: number;
  correctChars: number;
  completedSegments: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  maxCombo: number;
  perfectSegments: number;
  perfectFailed: boolean;
  flowScore: number;
  rankScore: number;
  weakTokens: string[];
}

export interface ChallengeRunResult extends ChallengeRunPayload {
  id: number;
  createdAt: string;
  rank: number | null;
  isNewBest: boolean;
  isTopTen: boolean;
}
