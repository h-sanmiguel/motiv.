import type { AppState, Habit, PomodoroSession } from '../types';

const STORAGE_KEY = 'prodhub_app_state';
const TIMER_STATE_KEY = 'prodhub_timer_state';

export interface TimerState {
  timeLeft: number; // in seconds
  isRunning: boolean;
  sessionType: 'work' | 'break' | 'longbreak';
  lastUpdateTime: number; // timestamp
  activePresetId: string;
}

export const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { tasks: [], habits: [], pomodoroSessions: [], pomodoroPresets: [] };
  } catch {
    return { tasks: [], habits: [], pomodoroSessions: [], pomodoroPresets: [] };
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export const saveTimerState = (timerState: TimerState): void => {
  try {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(timerState));
  } catch (error) {
    console.error('Failed to save timer state to localStorage:', error);
  }
};

export const loadTimerState = (): TimerState | null => {
  try {
    const stored = localStorage.getItem(TIMER_STATE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as TimerState;
      // Calculate how much time has passed
      const now = Date.now();
      const elapsed = (now - state.lastUpdateTime) / 1000; // in seconds
      
      if (state.isRunning && state.timeLeft > 0) {
        state.timeLeft = Math.max(0, state.timeLeft - elapsed);
        state.lastUpdateTime = now;
      }
      return state;
    }
    return null;
  } catch {
    return null;
  }
};

export const clearTimerState = (): void => {
  try {
    localStorage.removeItem(TIMER_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear timer state:', error);
  }
};

export const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getTodaysPomodoroCount = (sessions: PomodoroSession[]): number => {
  const today = getToday();
  return sessions.filter(s => s.date === today && s.completed).length;
};

export const calculateStreak = (habit: Habit): number => {
  const today = new Date();
  let currentDate = new Date(today);
  let streak = 0;

  const completedDates = new Set(habit.completedDates);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (completedDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
