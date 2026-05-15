export interface TrainingPackStats {
  todayDelta: number;
  masteryPercent: number;
  bestWpm: number;
  bestCombo: number;
  lastPracticedAt?: string;
}

interface TrainingPackResult {
  wpm: number;
  maxCombo: number;
  masteryPercent: number;
}

const TRAINING_PACK_STATS_KEY = 'codestep-training-pack-stats';

function emptyStats(): TrainingPackStats {
  return { todayDelta: 0, masteryPercent: 0, bestWpm: 0, bestCombo: 0 };
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function readAllStats(): Record<string, Partial<TrainingPackStats>> {
  if (typeof window === 'undefined') return {};

  try {
    const saved = localStorage.getItem(TRAINING_PACK_STATS_KEY);
    return saved ? JSON.parse(saved) as Record<string, Partial<TrainingPackStats>> : {};
  } catch {
    return {};
  }
}

function writeAllStats(stats: Record<string, Partial<TrainingPackStats>>) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TRAINING_PACK_STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage failures; the UI can still render the current session.
  }
}

export function readTrainingPackStats(packId: string): TrainingPackStats {
  const stats = readAllStats();
  const packStats = stats[packId] ?? {};

  return {
    todayDelta: packStats.todayDelta ?? 0,
    masteryPercent: packStats.masteryPercent ?? 0,
    bestWpm: packStats.bestWpm ?? 0,
    bestCombo: packStats.bestCombo ?? 0,
    lastPracticedAt: packStats.lastPracticedAt,
  };
}

export function recordTrainingPackResult(packId: string, result: TrainingPackResult) {
  if (!packId) return;

  const allStats = readAllStats();
  const current = { ...emptyStats(), ...(allStats[packId] ?? {}) };
  const previousBestWpm = current.bestWpm ?? 0;
  const bestWpm = Math.max(previousBestWpm, result.wpm);
  const bestCombo = Math.max(current.bestCombo ?? 0, result.maxCombo);
  const lastPracticedAt = new Date().toISOString();
  const practicedToday = current.lastPracticedAt?.slice(0, 10) === todayKey();
  const todayDelta =
    previousBestWpm > 0 && result.wpm > previousBestWpm
      ? Math.round(((result.wpm - previousBestWpm) / previousBestWpm) * 100)
      : practicedToday
      ? current.todayDelta ?? 0
      : 0;

  allStats[packId] = {
    todayDelta,
    masteryPercent: Math.max(current.masteryPercent ?? 0, result.masteryPercent),
    bestWpm,
    bestCombo,
    lastPracticedAt,
  };

  writeAllStats(allStats);
}
