import { useCallback, useRef, useState } from 'react';

interface TypingStatsData {
  wpm: number;
  accuracy: number;
  errors: number;
  progress: number;
}

export function useTypingStats() {
  const [stats, setStats] = useState<TypingStatsData>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    progress: 0,
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
      progress: 0,
    });
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    errorsRef.current = 0;
    setStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
  }, []);

  return {
    ...stats,
    recordKeystroke,
    reset,
  };
}
