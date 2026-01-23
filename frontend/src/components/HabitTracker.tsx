import React, { useState } from 'react';
import type { Habit } from '../types';
import { getToday, calculateStreak, generateId } from '../utils/storage';

interface HabitTrackerProps {
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onCompleteHabit: (id: string, date: string) => void;
  onUpdateHabit?: (habits: Habit[]) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onAddHabit,
  onDeleteHabit,
  onCompleteHabit,
  onUpdateHabit,
}) => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleAddHabit = () => {
    if (habitName.trim()) {
      const newHabit: Habit = {
        id: generateId(),
        name: habitName.trim(),
        frequency,
        createdAt: Date.now(),
        completedDates: [],
        streak: 0,
        bestStreak: 0,
        reminderType: 'automatic',
        reminderEnabled: true,
      };
      onAddHabit(newHabit);
      setHabitName('');
      setFrequency('daily');
    }
  };

  const today = getToday();

  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.includes(today);
  };

  const handleToggleHabit = (habit: Habit) => {
    onCompleteHabit(habit.id, today);
  };

  const getStreak = (habit: Habit) => {
    return calculateStreak(habit);
  };

  return (
    <div className="space-y-6">
      {/* Add Habit */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
          placeholder="create a new habit..."
          className="w-full px-0 py-2 border-b border-gray-200 focus:outline-none focus:border-gray-400 bg-transparent text-sm placeholder:text-gray-400"
        />
        <div className="flex gap-2">
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
            className="flex-1 px-0 py-2 border-b border-gray-200 focus:outline-none focus:border-gray-400 bg-transparent text-sm"
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
          </select>
          <button
            onClick={handleAddHabit}
            className="px-4 py-2 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition"
          >
            add
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">no habits yet. create one to get started!</p>
        ) : (
          habits.map(habit => {
            const completed = isCompletedToday(habit);
            const currentStreak = getStreak(habit);

            return (
              <div
                key={habit.id}
                className={`rounded-lg p-4 border transition ${
                  completed
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{habit.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{habit.frequency}</p>
                    
                    {/* Reminder Settings */}
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 min-w-fit">reminder:</label>
                        <select
                          value={habit.reminderType || 'automatic'}
                          onChange={(e) => {
                            const updatedHabits = habits.map(h =>
                              h.id === habit.id
                                ? { ...h, reminderType: e.target.value as any, reminderEnabled: e.target.value !== 'none' }
                                : h
                            );
                            onUpdateHabit?.(updatedHabits);
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        >
                          <option value="automatic">automatic (4h)</option>
                          <option value="manual">manual</option>
                          <option value="none">none</option>
                        </select>
                      </div>
                      {habit.reminderType === 'manual' && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 min-w-fit">time:</label>
                          <input
                            type="time"
                            value={habit.reminderTime || '08:00'}
                            onChange={(e) => {
                              const updatedHabits = habits.map(h =>
                                h.id === habit.id
                                  ? { ...h, reminderTime: e.target.value, reminderEnabled: true }
                                  : h
                              );
                              onUpdateHabit?.(updatedHabits);
                            }}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Streak Display */}
                    <div className="flex gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">current streak</p>
                        <p className="text-lg font-light text-gray-900 mt-1">{currentStreak} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">best streak</p>
                        <p className="text-lg font-light text-gray-900 mt-1">{habit.bestStreak} days</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleHabit(habit)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        completed
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {completed ? '✓' : 'mark'}
                    </button>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
