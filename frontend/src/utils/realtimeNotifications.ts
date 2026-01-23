import { sendBrowserNotification, createHabitReminder, createTaskReminder } from './notifications';
import type { Task, Habit, ReminderType } from '../types';

export interface ReminderCheck {
  habits: Habit[];
  tasks: Task[];
}

// Check if it's time to send an automatic reminder (every 4 hours)
export const shouldSendAutomaticReminder = (
  reminderType: ReminderType | undefined,
  lastReminderSent: number | undefined,
  now: Date
): boolean => {
  if (reminderType !== 'automatic') return false;

  if (lastReminderSent) {
    const timeSinceLastReminder = now.getTime() - lastReminderSent;
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    
    if (timeSinceLastReminder < fourHoursInMs) {
      return false;
    }
  }

  return true;
};

// Check if it's time to send a deadline reminder (1 day before or same day)
export const shouldSendDeadlineReminder = (
  deadline: string | undefined,
  lastReminderSent: number | undefined,
  now: Date
): boolean => {
  if (!deadline) return false;

  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff > 1) return false;

  if (lastReminderSent) {
    const lastReminderDate = new Date(lastReminderSent);
    const todayDate = now.toDateString();
    const lastReminderDateString = lastReminderDate.toDateString();

    if (todayDate === lastReminderDateString) {
      return false;
    }
  }

  return true;
};

// Check if it's time to send a manual reminder at a specific time
export const shouldSendManualReminder = (
  reminderTime: string | undefined,
  lastReminderSent: number | undefined,
  now: Date
): boolean => {
  if (!reminderTime) return false;

  const [hours, minutes] = reminderTime.split(':').map(Number);
  const reminderHour = hours;
  const reminderMinute = minutes;

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isCorrectTime =
    currentHour === reminderHour && currentMinute === reminderMinute;

  if (!isCorrectTime) return false;

  if (lastReminderSent) {
    const lastReminderDate = new Date(lastReminderSent);
    const todayDate = now.toDateString();
    const lastReminderDateString = lastReminderDate.toDateString();

    if (todayDate === lastReminderDateString) {
      return false;
    }
  }

  return true;
};

// Check if it's time to send a reminder (legacy - used for backward compatibility)
export const shouldSendReminder = (
  reminderTime: string | undefined,
  lastReminderSent: number | undefined,
  now: Date
): boolean => {
  return shouldSendManualReminder(reminderTime, lastReminderSent, now);
};

// Get current time in HH:MM format
export const getCurrentTimeString = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Format time for display
export const formatTimeString = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const minute = parseInt(minutes);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`;
};

// Check all reminders and send notifications
export const checkAndSendReminders = (
  habits: Habit[],
  tasks: Task[],
  onAddNotification: (notification: any) => void
): { updatedHabits: Habit[]; updatedTasks: Task[] } => {
  const now = new Date();
  const updatedHabits = habits.map(habit => {
    if (
      habit.reminderEnabled &&
      shouldSendAutomaticReminder(habit.reminderType, habit.lastReminderSent, now)
    ) {
      const notification = createHabitReminder(habit.name);
      onAddNotification(notification);
      sendBrowserNotification('Habit Reminder', {
        body: `Time to complete: ${habit.name}`,
        icon: '🎯',
      });

      return {
        ...habit,
        lastReminderSent: Date.now(),
      };
    }
    return habit;
  });

  const updatedTasks = tasks.map(task => {
    if (!task.completed) {
      // Check automatic reminders (every 4 hours)
      if (
        task.reminderEnabled &&
        task.reminderType === 'automatic' &&
        shouldSendAutomaticReminder(task.reminderType, task.lastReminderSent, now)
      ) {
        const notification = createTaskReminder(task.title);
        onAddNotification(notification);
        sendBrowserNotification('Task Reminder', {
          body: `Don't forget: ${task.title}`,
          icon: '📋',
        });
        return { ...task, lastReminderSent: Date.now() };
      }

      // Check manual reminders (at specific time)
      if (
        task.reminderEnabled &&
        task.reminderType === 'manual' &&
        shouldSendManualReminder(task.reminderTime, task.lastReminderSent, now)
      ) {
        const notification = createTaskReminder(task.title);
        onAddNotification(notification);
        sendBrowserNotification('Task Reminder', {
          body: `Don't forget: ${task.title}`,
          icon: '📋',
        });
        return { ...task, lastReminderSent: Date.now() };
      }

      // Check deadline reminders (1 day before or same day)
      if (task.deadline && shouldSendDeadlineReminder(task.deadline, task.lastReminderSent, now)) {
        const notification = createTaskReminder(`Deadline: ${task.title}`);
        onAddNotification(notification);
        sendBrowserNotification('Task Deadline', {
          body: `Deadline approaching: ${task.title}`,
          icon: '⏰',
        });
        return { ...task, lastReminderSent: Date.now() };
      }
    }
    return task;
  });

  return { updatedHabits, updatedTasks };
};

// Real-time notification service that checks every second
let notificationCheckInterval: ReturnType<typeof setInterval> | null = null;
let lastCheckedMinute = -1;

export const startRealtimeNotificationService = (
  getState: () => { habits: Habit[]; tasks: Task[] },
  onAddNotification: (notification: any) => void,
  onUpdateState: (habits: Habit[], tasks: Task[]) => void
): (() => void) => {
  // Stop any existing interval
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
  }

  notificationCheckInterval = setInterval(() => {
    const now = new Date();
    const currentMinute = now.getHours() * 60 + now.getMinutes();

    // Only check reminders when the minute changes to avoid duplicate checks
    if (currentMinute !== lastCheckedMinute) {
      lastCheckedMinute = currentMinute;
      const { habits, tasks } = getState();
      const { updatedHabits, updatedTasks } = checkAndSendReminders(habits, tasks, onAddNotification);

      // Update state if any habits or tasks changed
      if (
        updatedHabits.some((h, i) => h !== habits[i]) ||
        updatedTasks.some((t, i) => t !== tasks[i])
      ) {
        onUpdateState(updatedHabits, updatedTasks);
      }
    }
  }, 1000); // Check every second, but only process when minute changes

  // Return cleanup function
  return () => {
    if (notificationCheckInterval) {
      clearInterval(notificationCheckInterval);
      notificationCheckInterval = null;
    }
  };
};

// Stop the real-time notification service
export const stopRealtimeNotificationService = () => {
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
    notificationCheckInterval = null;
  }
};
