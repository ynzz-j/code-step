import { useCallback, useRef, useState } from 'react';
import type { TypingStats } from '@/types';

export function useTypingStats() {
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    backspaces: 0,
  });

  const startTimeRef = useRef<number | null>(null);
  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const errorsRef = useRef(0);

  const recordKeystroke = useCallback((isCorrect: boolean) => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    totalKeystrokesRef.current += 1;
    if (isCorrect) {
      correctKeystrokesRef.current += 1;
    } else {
      errorsRef.current += 1;
    }

    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    const wpm = elapsedMinutes > 0
      ? Math.round((correctKeystrokesRef.current / 5) / elapsedMinutes)
      : 0;

    const accuracy = totalKeystrokesRef.current > 0
      ? Math.round((correctKeystrokesRef.current / totalKeystrokesRef.current) * 100)
      : 100;

    setStats({
      wpm,
      accuracy,
      errors: errorsRef.current,
      totalKeystrokes: totalKeystrokesRef.current,
      correctKeystrokes: correctKeystrokesRef.current,
      backspaces: 0,
    });
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    errorsRef.current = 0;
    setStats({ wpm: 0, accuracy: 100, errors: 0, totalKeystrokes: 0, correctKeystrokes: 0, backspaces: 0 });
  }, []);

  return {
    ...stats,
    recordKeystroke,
    reset,
  };
}
