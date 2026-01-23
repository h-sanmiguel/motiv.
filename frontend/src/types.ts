export type Priority = 'low' | 'medium' | 'high';
export type ReminderType = 'automatic' | 'manual' | 'none';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  deadline?: string; // ISO date string (YYYY-MM-DD)
  reminderType?: ReminderType; // 'automatic' (every 4 hours), 'manual', or 'none'
  reminderTime?: string; // HH:MM format (for manual reminders)
  reminderEnabled?: boolean;
  lastReminderSent?: number; // timestamp of last reminder sent
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  createdAt: number;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  streak: number;
  bestStreak: number;
  reminderType?: ReminderType; // 'automatic', 'manual', or 'none'
  reminderTime?: string; // HH:MM format (e.g., "09:00")
  reminderEnabled?: boolean;
  lastReminderSent?: number; // timestamp of last reminder sent
}

export interface PomodoroSession {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  duration: number; // in minutes
  completed: boolean;
}

export interface PomodoroPreset {
  id: string;
  name: string;
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  isDefault?: boolean;
  reminderTime?: string; // HH:MM format
  reminderEnabled?: boolean;
  lastReminderSent?: number; // timestamp
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  pomodoroSessions: PomodoroSession[];
  pomodoroPresets: PomodoroPreset[];
}
