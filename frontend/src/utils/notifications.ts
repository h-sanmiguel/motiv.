export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  timestamp: number;
  read: boolean;
}

// Request browser notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Send browser notification
export const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, options);
    } catch (e) {
      console.log('Failed to send notification:', e);
    }
  }
};

// Generate notification ID
export const generateNotificationId = (): string => {
  return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create a task reminder notification
export const createTaskReminder = (taskTitle: string): Notification => {
  return {
    id: generateNotificationId(),
    title: 'Task Reminder',
    message: `Don't forget: ${taskTitle}`,
    type: 'reminder',
    timestamp: Date.now(),
    read: false,
  };
};

// Create a habit reminder notification
export const createHabitReminder = (habitName: string): Notification => {
  return {
    id: generateNotificationId(),
    title: 'Habit Reminder',
    message: `Time to complete: ${habitName}`,
    type: 'reminder',
    timestamp: Date.now(),
    read: false,
  };
};

// Create a pomodoro notification
export const createPomodoroNotification = (sessionType: string): Notification => {
  const messages = {
    work: 'Time to focus! Start your work session.',
    break: 'Great work! Time for a break.',
    longbreak: 'You earned a longer break!',
  };

  return {
    id: generateNotificationId(),
    title: 'Pomodoro Session',
    message: messages[sessionType as keyof typeof messages] || 'Session ready!',
    type: 'info',
    timestamp: Date.now(),
    read: false,
  };
};

// Format notification time
export const formatNotificationTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
};
