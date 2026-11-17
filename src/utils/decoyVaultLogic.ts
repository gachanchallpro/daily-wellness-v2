export type WaterGoalMl = 1500 | 2000 | 2500;

export interface WaterLogEntry {
  id: string;
  time: string;
  amountMl: number;
  label: string;
}

export interface DailyHabit {
  id: string;
  label: string;
  completed: boolean;
}

export const WATER_GOAL_OPTIONS: readonly WaterGoalMl[] = [1500, 2000, 2500];
export const DEFAULT_WATER_GOAL_ML: WaterGoalMl = 2000;
export const DEFAULT_VAULT_PIN = '2468';

const INITIAL_HABIT_DEFS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'habit-wake', label: 'Uống 1 ly sau khi thức dậy' },
  { id: 'habit-vitc', label: 'Bổ sung Vitamin C' },
  { id: 'habit-lunch', label: 'Uống nước trước bữa trưa' },
];

export function createInitialHabits(): DailyHabit[] {
  return INITIAL_HABIT_DEFS.map((item) => ({
    id: item.id,
    label: item.label,
    completed: false,
  }));
}

export function formatTimeHHmm(date: Date = new Date()): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function calculateTotalIntakeMl(logs: WaterLogEntry[]): number {
  return logs.reduce((sum, entry) => sum + Math.max(0, entry.amountMl), 0);
}

export function calculateGoalProgress(
  intakeMl: number,
  goalMl: number
): { pct: number; remainingMl: number; reached: boolean } {
  const safeIntake = Math.max(0, intakeMl);
  const safeGoal = Math.max(1, goalMl);
  const pct = Math.min(100, Math.round((safeIntake / safeGoal) * 100));
  const remainingMl = Math.max(0, safeGoal - safeIntake);
  return {
    pct,
    remainingMl,
    reached: safeIntake >= safeGoal,
  };
}

export function addWaterLog(
  logs: WaterLogEntry[],
  amountMl: number,
  timeLabel: string,
  id?: string,
  customLabel?: string
): WaterLogEntry[] {
  if (amountMl <= 0) return logs;
  const label =
    customLabel?.trim() ||
    (amountMl >= 500 ? 'Bình nước lớn' : 'Ly nước lọc');
  const entry: WaterLogEntry = {
    id: id ?? `water-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: timeLabel,
    amountMl,
    label,
  };
  return [entry, ...logs];
}

export function subtractWaterFromLogs(
  logs: WaterLogEntry[],
  subtractMl: number
): WaterLogEntry[] {
  if (subtractMl <= 0 || logs.length === 0) return logs;
  let remainingToSubtract = subtractMl;
  const nextLogs: WaterLogEntry[] = [];

  for (const entry of logs) {
    if (remainingToSubtract <= 0) {
      nextLogs.push(entry);
      continue;
    }
    if (entry.amountMl <= remainingToSubtract) {
      remainingToSubtract -= entry.amountMl;
      // Entry fully subtracted -> omit
    } else {
      nextLogs.push({
        ...entry,
        amountMl: entry.amountMl - remainingToSubtract,
      });
      remainingToSubtract = 0;
    }
  }

  return nextLogs;
}

export function updateWaterLogLabel(
  logs: WaterLogEntry[],
  logId: string,
  nextLabel: string
): WaterLogEntry[] {
  const trimmed = nextLabel.trim();
  if (!trimmed) return logs;
  return logs.map((entry) =>
    entry.id === logId ? { ...entry, label: trimmed } : entry
  );
}

export function removeWaterLogById(
  logs: WaterLogEntry[],
  logId: string
): WaterLogEntry[] {
  return logs.filter((entry) => entry.id !== logId);
}

export function toggleHabitById(
  habits: DailyHabit[],
  habitId: string
): DailyHabit[] {
  return habits.map((habit) =>
    habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
  );
}

export function isValidFourDigitPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export function verifyVaultPin(inputPin: string, activePin: string): boolean {
  if (!isValidFourDigitPin(inputPin) || !isValidFourDigitPin(activePin)) {
    return false;
  }
  return inputPin === activePin;
}
