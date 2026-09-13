import { describe, it, expect } from 'vitest';
import { buildWeakFirstStepOrder, getTypingStepPatternId } from '../stepOrder';
import type { PatternMastery, Step, TypingStep } from '@/types';

function typingStep(id: string, concept: string, patternId?: string): TypingStep {
  return {
    id,
    type: 'typing',
    title: id,
    concept,
    difficulty: 'basic',
    instruction: '',
    targetCode: 'x',
    patternId,
  };
}

const steps: Step[] = [
  typingStep('s1', 'map'),
  typingStep('s2', 'filter'),
  typingStep('s3', 'async'),
  { id: 'c1', type: 'coding', title: 'c1', concept: 'coding', difficulty: 'basic', instruction: '', answer: '', validation: { type: 'contains' } },
];

describe('getTypingStepPatternId', () => {
  it('优先使用显式 patternId', () => {
    expect(getTypingStepPatternId(typingStep('a', 'Map & Filter', 'custom-id'))).toBe('custom-id');
  });

  it('否则由 concept 生成 slug', () => {
    expect(getTypingStepPatternId(typingStep('a', 'Map & Filter'))).toBe('map-&-filter');
  });
});

describe('buildWeakFirstStepOrder', () => {
  it('无掌握数据时保持原始顺序', () => {
    expect(buildWeakFirstStepOrder(steps, [])).toEqual([0, 1, 2, 3]);
  });

  it('低熟练度（<70）排在最前，非打字步骤排最后', () => {
    const mastery: PatternMastery[] = [
      { patternId: 'async', attempts: 0, masteryPercent: 40, bestWpm: 0, bestFlowScore: 0, recentTrend: 0, weakTokens: [] },
      { patternId: 'map', attempts: 0, masteryPercent: 90, bestWpm: 0, bestFlowScore: 0, recentTrend: 0, weakTokens: [] },
      { patternId: 'filter', attempts: 0, masteryPercent: 95, bestWpm: 0, bestFlowScore: 0, recentTrend: 0, weakTokens: [] },
    ];
    // s3(async, 40%) → bucket 0；s1/s2 → bucket 2；coding → bucket 3
    expect(buildWeakFirstStepOrder(steps, mastery)).toEqual([2, 0, 1, 3]);
  });

  it('无掌握记录的打字步骤排在中档（bucket 1）', () => {
    const mastery: PatternMastery[] = [
      { patternId: 'map', attempts: 0, masteryPercent: 90, bestWpm: 0, bestFlowScore: 0, recentTrend: 0, weakTokens: [] },
    ];
    // s2/s3 无记录 → bucket 1（同桶按原始顺序）；s1 → bucket 2；coding → bucket 3
    expect(buildWeakFirstStepOrder(steps, mastery)).toEqual([1, 2, 0, 3]);
  });

  it('熟练度数值异常时按 0 处理（仍进薄弱桶）', () => {
    const mastery: PatternMastery[] = [
      { patternId: 'map', attempts: 0, masteryPercent: NaN, bestWpm: 0, bestFlowScore: 0, recentTrend: 0, weakTokens: [] },
    ];
    const order = buildWeakFirstStepOrder(steps, mastery);
    expect(order[0]).toBe(0);
  });
});
