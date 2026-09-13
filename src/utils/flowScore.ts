import type { ChallengeMode } from '@/types';

/** 单片段 Flow Score：正确率加成 + 连击奖励 - 错误惩罚，零退格额外 +8 */
export function segmentFlowScore(params: {
  wpm: number;
  accuracy: number;
  maxCombo: number;
  errors: number;
  backspaces: number;
}): number {
  const { wpm, accuracy, maxCombo, errors, backspaces } = params;
  const perfectBonus = backspaces === 0 && errors === 0 ? 8 : 0;
  const score = Math.round((wpm * accuracy) / 100 + maxCombo * 0.4 - errors * 1.5 + perfectBonus);
  return Math.max(0, score);
}

/**
 * 挑战模式 Flow Score：
 * 基础 = WPM × 准确率 / 100，加连击奖励（上限 35）与 Perfect 段奖励，
 * 叠加模式加成，再扣稳定性惩罚（错误 ×1.8 + 退格 ×0.8），下限 0。
 */
export function challengeFlowScore(params: {
  challengeMode: ChallengeMode;
  runWpm: number;
  runAccuracy: number;
  maxCombo: number;
  totalErrors: number;
  totalBackspaces: number;
  perfectSegments: number;
  perfectFailed: boolean;
  completedSegments: number;
  durationMs: number;
}): number {
  const {
    challengeMode,
    runWpm,
    runAccuracy,
    maxCombo,
    totalErrors,
    totalBackspaces,
    perfectSegments,
    perfectFailed,
    completedSegments,
    durationMs,
  } = params;

  const base = (runWpm * runAccuracy) / 100;
  const comboBonus = Math.min(maxCombo * 0.45, 35);
  const perfectBonus = perfectSegments * 5;
  const stabilityPenalty = totalErrors * 1.8 + totalBackspaces * 0.8;

  let modeBonus = 0;
  switch (challengeMode) {
    case 'speed-30s':
      modeBonus = completedSegments * 2;
      break;
    case 'focus-3min':
      modeBonus = Math.min(durationMs / 60000, 3) * 3;
      break;
    case 'perfect-run':
      modeBonus = perfectFailed ? -20 : 25;
      break;
    case 'combo-rush':
      modeBonus = Math.min(maxCombo / 10, 8);
      break;
  }

  const flowScore = Math.max(
    0,
    Math.round(base + comboBonus + perfectBonus + modeBonus - stabilityPenalty),
  );
  return flowScore;
}
