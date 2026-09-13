import { describe, it, expect } from 'vitest';
import { REWARD_PRIORITY } from '../soundEffects';

/**
 * 音效包 manifest 的奖励取合顺序：
 * New Best > Complete > Perfect > Combo30 > Combo20 > Combo10
 */
const EXPECTED_ORDER = ['new-best', 'complete', 'perfect', 'combo-30', 'combo-20', 'combo-10'];

describe('REWARD_PRIORITY（音效奖励取合契约）', () => {
  it('奖励音的优先级顺序与 manifest 一致', () => {
    for (let i = 0; i < EXPECTED_ORDER.length - 1; i += 1) {
      const higher = REWARD_PRIORITY[EXPECTED_ORDER[i] as keyof typeof REWARD_PRIORITY];
      const lower = REWARD_PRIORITY[EXPECTED_ORDER[i + 1] as keyof typeof REWARD_PRIORITY];
      expect(higher, `${EXPECTED_ORDER[i]} 应优先于 ${EXPECTED_ORDER[i + 1]}`).toBeGreaterThan(lower!);
    }
  });

  it('所有奖励音都有优先级', () => {
    for (const name of EXPECTED_ORDER) {
      expect(REWARD_PRIORITY[name as keyof typeof REWARD_PRIORITY]).toBeDefined();
    }
  });
});
