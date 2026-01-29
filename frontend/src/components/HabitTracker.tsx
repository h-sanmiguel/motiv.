import React, { useState, useEffect } from 'react';
import type { Habit } from '../types';
import { getToday, calculateStreak, generateId } from '../utils/storage';
import { HabitListSkeleton } from './SkeletonLoaders';

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
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

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
        {loading ? (
          <HabitListSkeleton count={3} />
        ) : habits.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">no habits yet. create one to get started!</p>
        ) : (
          habits.map(habit => {
            const completed = isCompletedToday(habit);
            const currentStreak = getStreak(habit);

            return (
              <div
                key={habit.id}
                className={`rounded-lg border p-4 flex items-center justify-between gap-3 transition ${
                  completed
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{habit.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{habit.frequency} • streak: {currentStreak}</p>
                  {habit.description && (
                    <p className="text-xs text-gray-600 mt-1 truncate">{habit.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleToggleHabit(habit)}
                  className={`px-3 py-1 rounded text-xs font-medium transition flex-shrink-0 ${
                    completed
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {completed ? '✓' : 'mark'}
                </button>
                <button
                  onClick={() => setEditingHabitId(habit.id)}
                  className="text-gray-400 hover:text-gray-900 transition flex-shrink-0"
                  title="edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                  title="delete"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Habit Modal */}
      {editingHabitId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4">
            <h2 className="text-lg font-medium">edit habit</h2>
            
            {habits.find(h => h.id === editingHabitId) && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 font-medium block mb-2">description</label>
                  <textarea
                    value={habits.find(h => h.id === editingHabitId)?.description || ''}
                    onChange={(e) => {
                      const updatedHabits = habits.map(h =>
                        h.id === editingHabitId ? { ...h, description: e.target.value } : h
                      );
                      onUpdateHabit?.(updatedHabits);
                    }}
                    placeholder="add description..."
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 font-medium block mb-2">reminder</label>
                  <select
                    value={habits.find(h => h.id === editingHabitId)?.reminderType || 'automatic'}
                    onChange={(e) => {
                      const updatedHabits = habits.map(h =>
                        h.id === editingHabitId
                          ? { ...h, reminderType: e.target.value as any, reminderEnabled: e.target.value !== 'none' }
                          : h
                      );
                      onUpdateHabit?.(updatedHabits);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                  >
                    <option value="automatic">automatic (4h)</option>
                    <option value="manual">manual</option>
                    <option value="none">none</option>
                  </select>
                </div>

                {habits.find(h => h.id === editingHabitId)?.reminderType === 'manual' && (
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-2">time</label>
                    <input
                      type="time"
                      value={habits.find(h => h.id === editingHabitId)?.reminderTime || '08:00'}
                      onChange={(e) => {
                        const updatedHabits = habits.map(h =>
                          h.id === editingHabitId
                            ? { ...h, reminderTime: e.target.value, reminderEnabled: true }
                            : h
                        );
                        onUpdateHabit?.(updatedHabits);
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setEditingHabitId(null)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
