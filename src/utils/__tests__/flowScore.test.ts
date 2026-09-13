import { describe, it, expect } from 'vitest';
import { segmentFlowScore, challengeFlowScore } from '../flowScore';

describe('segmentFlowScore', () => {
  it('基础公式：WPM×准确率 + 连击×0.4 - 错误×1.5', () => {
    expect(segmentFlowScore({ wpm: 100, accuracy: 100, maxCombo: 0, errors: 0, backspaces: 1 })).toBe(100);
    expect(segmentFlowScore({ wpm: 100, accuracy: 100, maxCombo: 10, errors: 2, backspaces: 1 })).toBe(
      Math.round(100 + 4 - 3),
    );
  });

  it('零退格且零错误时 +8 完美加成', () => {
    expect(segmentFlowScore({ wpm: 100, accuracy: 100, maxCombo: 0, errors: 0, backspaces: 0 })).toBe(108);
  });

  it('结果不为负', () => {
    expect(segmentFlowScore({ wpm: 0, accuracy: 0, maxCombo: 0, errors: 100, backspaces: 0 })).toBe(0);
  });
});

describe('challengeFlowScore', () => {
  const base = {
    runWpm: 100,
    runAccuracy: 100,
    maxCombo: 0,
    totalErrors: 0,
    totalBackspaces: 0,
    perfectSegments: 0,
    perfectFailed: false,
    completedSegments: 0,
    durationMs: 60_000,
  };

  it('combo-rush：连击奖励 = min(Combo×0.45, 35) + 模式加成上限 8', () => {
    const high = challengeFlowScore({ ...base, challengeMode: 'combo-rush', maxCombo: 500 });
    const low = challengeFlowScore({ ...base, challengeMode: 'combo-rush', maxCombo: 0 });
    // high: 100 + 35(连击封顶) + 8(模式封顶) = 143
    expect(high).toBe(143);
    expect(low).toBe(100);
    expect(high - low).toBe(43);
  });

  it('perfect-run：失败 -20，成功 +25', () => {
    const failed = challengeFlowScore({ ...base, challengeMode: 'perfect-run', perfectFailed: true });
    const ok = challengeFlowScore({ ...base, challengeMode: 'perfect-run' });
    expect(failed).toBe(Math.round(100 - 20));
    expect(ok).toBe(Math.round(100 + 25));
  });

  it('speed-30s：每完成一段 +2', () => {
    expect(challengeFlowScore({ ...base, challengeMode: 'speed-30s', completedSegments: 5 })).toBe(110);
  });

  it('focus-3min：时长奖励封顶 3 分钟', () => {
    const at3min = challengeFlowScore({ ...base, challengeMode: 'focus-3min', durationMs: 180_000 });
    const at10min = challengeFlowScore({ ...base, challengeMode: 'focus-3min', durationMs: 600_000 });
    expect(at3min).toBe(109);
    expect(at10min).toBe(109);
  });

  it('稳定性惩罚：错误 ×1.8 + 退格 ×0.8，四舍五入', () => {
    const score = challengeFlowScore({ ...base, challengeMode: 'speed-30s', totalErrors: 2, totalBackspaces: 1 });
    // 100 + 0 - (3.6 + 0.8) = 95.6 → 96
    expect(score).toBe(96);
  });

  it('结果不为负', () => {
    const score = challengeFlowScore({
      ...base,
      challengeMode: 'perfect-run',
      perfectFailed: true,
      runWpm: 0,
      runAccuracy: 0,
      totalErrors: 50,
    });
    expect(score).toBe(0);
  });
});
