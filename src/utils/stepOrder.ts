import type { PatternMastery, Step, TypingStep } from '@/types';

/** 打字步骤的 patternId：优先显式 patternId，否则由 concept 生成 */
export function getTypingStepPatternId(step: TypingStep): string {
  return step.patternId || step.concept.toLowerCase().replace(/\s+/g, '-');
}

export interface WeakFirstEntry {
  index: number;
  bucket: number;
  weakness: number;
  originalIndex: number;
}

/**
 * 弱项优先排序：按 pattern 熟练度把薄弱片段排到前面。
 *
 * 分桶：< 70% 熟练度 → 0（最优先）；无掌握记录 → 1；≥ 70% → 2；非打字步骤 → 3。
 * 同桶内按薄弱度升序，再按原始顺序保持稳定。
 */
export function buildWeakFirstStepOrder(steps: Step[], patternMastery: PatternMastery[]): number[] {
  const fallbackOrder = steps.map((_, index) => index);
  if (patternMastery.length === 0) return fallbackOrder;

  const masteryByPattern = new Map(patternMastery.map((item) => [item.patternId, item]));

  return fallbackOrder
    .map((index) => {
      const step = steps[index];
      if (step.type !== 'typing') {
        return { index, bucket: 3, weakness: 100, originalIndex: index };
      }

      const mastery = masteryByPattern.get(getTypingStepPatternId(step));
      if (!mastery) {
        return { index, bucket: 1, weakness: 50, originalIndex: index };
      }

      const masteryPercent = Number.isFinite(mastery.masteryPercent) ? mastery.masteryPercent : 0;
      const bucket = masteryPercent < 70 ? 0 : 2;
      return { index, bucket, weakness: masteryPercent, originalIndex: index };
    })
    .sort((a, b) => a.bucket - b.bucket || a.weakness - b.weakness || a.originalIndex - b.originalIndex)
    .map((item) => item.index);
}
