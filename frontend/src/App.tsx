import { useState, useEffect } from 'react';
import type { Task, Habit, PomodoroSession, AppState, PomodoroPreset } from './types';
import { loadState, saveState } from './utils/storage';
import { TaskManager } from './components/TaskManager';
import { HabitTracker } from './components/HabitTracker';
import { PomodoroTimer } from './components/PomodoroTimer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { About } from './components/About';
import { DailyQuote } from './components/DailyQuote';
import type { Notification } from './utils/notifications';
import { requestNotificationPermission } from './utils/notifications';
import { startRealtimeNotificationService } from './utils/realtimeNotifications';
import './App.css';

type Tab = 'tasks' | 'habits' | 'pomodoro' | 'about';

function App() {
  const [state, setState] = useState<AppState>({ tasks: [], habits: [], pomodoroSessions: [], pomodoroPresets: [] });
  const [currentTab, setCurrentTab] = useState<Tab>('tasks');
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const loadedState = loadState();
    setState(loadedState);
    setIsMounted(true);
    requestNotificationPermission();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (isMounted) {
      saveState(state);
    }
  }, [state, isMounted]);

  // Add notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
  };

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Check reminders in real-time (every second, processes every minute)
  useEffect(() => {
    if (!isMounted) return;

    const getStateSnapshot = () => ({
      habits: state.habits,
      tasks: state.tasks,
    });

    const handleUpdateState = (habits: Habit[], tasks: Task[]) => {
      setState(prev => ({
        ...prev,
        habits: habits,
        tasks: tasks,
      }));
    };

    const cleanup = startRealtimeNotificationService(
      getStateSnapshot,
      addNotification,
      handleUpdateState
    );

    return cleanup;
  }, [isMounted]);

  // Task handlers
  const handleAddTask = (task: Task) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
  };

  const handleDeleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  };

  const handleCompleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      ),
    }));
  };

  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setState(prev => ({
      ...prev,
      tasks: updatedTasks,
    }));
  };

  // Habit handlers
  const handleAddHabit = (habit: Habit) => {
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, habit],
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
    }));
  };

  const handleUpdateHabits = (updatedHabits: Habit[]) => {
    setState(prev => ({
      ...prev,
      habits: updatedHabits,
    }));
  };  const handleCompleteHabit = (id: string, date: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id === id) {
          const isCompleted = h.completedDates.includes(date);
          const newCompletedDates = isCompleted
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date];
          return {
            ...h,
            completedDates: newCompletedDates,
          };
        }
        return h;
      }),
    }));
  };

  // Pomodoro handlers
  const handleSessionComplete = (session: PomodoroSession) => {
    setState(prev => ({
      ...prev,
      pomodoroSessions: [...prev.pomodoroSessions, session],
    }));
  };

  const handleAddPreset = (preset: PomodoroPreset) => {
    setState(prev => ({
      ...prev,
      pomodoroPresets: [...prev.pomodoroPresets, preset],
    }));
  };

  const handleUpdatePreset = (id: string, updated: Partial<PomodoroPreset>) => {
    setState(prev => ({
      ...prev,
      pomodoroPresets: prev.pomodoroPresets.map(p =>
        p.id === id ? { ...p, ...updated } : p
      ),
    }));
  };

  const handleDeletePreset = (id: string) => {
    setState(prev => ({
      ...prev,
      pomodoroPresets: prev.pomodoroPresets.filter(p => p.id !== id),
    }));
  };

  const getTabColor = (tab: Tab) => {
    switch (tab) {
      case 'tasks':
        return 'border-blue-500 text-blue-600';
      case 'habits':
        return 'border-purple-500 text-purple-600';
      case 'pomodoro':
        return 'border-red-500 text-red-600';
      case 'about':
        return 'border-gray-900 text-gray-900';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onClearAll={clearAllNotifications}
      />

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-100 fixed top-[100px] left-0 right-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'tasks' as const, label: 'tasks' },
              { id: 'habits' as const, label: 'habits' },
              { id: 'pomodoro' as const, label: 'pomodoro' },
              { id: 'about' as const, label: 'about' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-1 py-4 font-medium text-sm transition border-b-2 ${
                  currentTab === tab.id
                    ? `${getTabColor(tab.id)} border-b-2`
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-48 w-full">
        {/* Daily Quote */}
        {currentTab !== 'about' && <DailyQuote />}

        {currentTab === 'tasks' && (
          <div>
            <TaskManager
              tasks={state.tasks}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onCompleteTask={handleCompleteTask}
              onUpdateTask={handleUpdateTasks}
            />
          </div>
        )}

        {currentTab === 'habits' && (
          <div>
            <HabitTracker
              habits={state.habits}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
              onCompleteHabit={handleCompleteHabit}
              onUpdateHabit={handleUpdateHabits}
            />
          </div>
        )}

        {currentTab === 'pomodoro' && (
          <div>
            <PomodoroTimer
              sessions={state.pomodoroSessions}
              presets={state.pomodoroPresets}
              onSessionComplete={handleSessionComplete}
              onAddPreset={handleAddPreset}
              onUpdatePreset={handleUpdatePreset}
              onDeletePreset={handleDeletePreset}
              onAddNotification={addNotification}
            />
          </div>
        )}

        {currentTab === 'about' && (
          <div>
            <About />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
