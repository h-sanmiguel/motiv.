import React, { useState, useEffect } from 'react';
import type { Task, Priority } from '../types';
import { generateId } from '../utils/storage';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onUpdateTask?: (tasks: Task[]) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
  onUpdateTask,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedTaskTitle, setCompletedTaskTitle] = useState('');

  useEffect(() => {
    if (showCompletionModal) {
      const timer = setTimeout(() => setShowCompletionModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCompletionModal]);

  const handleAddTask = () => {
    if (title.trim()) {
      const newTask: Task = {
        id: generateId(),
        title: title.trim(),
        priority,
        completed: false,
        createdAt: Date.now(),
        reminderType: 'automatic',
        reminderEnabled: true,
      };
      onAddTask(newTask);
      setTitle('');
      setPriority('medium');
    }
  };

  const handleCompleteTask = (taskId: string, taskTitle: string, isCurrentlyCompleted: boolean) => {
    // Only show modal when marking as complete, not when unchecking
    if (!isCurrentlyCompleted) {
      setCompletedTaskTitle(taskTitle);
      setShowCompletionModal(true);
    }
    onCompleteTask(taskId);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-l-4 border-l-red-500',
          badge: 'bg-red-50 text-red-700',
          hover: 'hover:border-l-red-600',
        };
      case 'medium':
        return {
          border: 'border-l-4 border-l-amber-500',
          badge: 'bg-amber-50 text-amber-700',
          hover: 'hover:border-l-amber-600',
        };
      case 'low':
        return {
          border: 'border-l-4 border-l-green-500',
          badge: 'bg-green-50 text-green-700',
          hover: 'hover:border-l-green-600',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Task Completion Toast */}
      {showCompletionModal && (
        <div className="fixed top-[120px] left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 px-4 py-2">
            <p className="text-sm font-medium text-gray-900">✨ {completedTaskTitle}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">active tasks</p>
          <p className="text-3xl font-light text-gray-900 mt-2">{activeTasks}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">completed</p>
          <p className="text-3xl font-light text-gray-900 mt-2">{completedTasks}</p>
        </div>
      </div>

      {/* Add Task */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="add a new task..."
          className="w-full px-0 py-2 border-b border-gray-200 focus:outline-none focus:border-gray-400 bg-transparent text-sm placeholder:text-gray-400"
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="flex-1 px-0 py-2 border-b border-gray-200 focus:outline-none focus:border-gray-400 bg-transparent text-sm"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition"
          >
            add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs font-medium transition ${
              filter === f
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              {filter === 'completed' ? 'no completed tasks' : 'no tasks to show'}
            </p>
          ) : (
            filteredTasks.map(task => {
              const colors = getPriorityColor(task.priority);
              return (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg transition ${colors.border} ${colors.hover}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCompleteTask(task.id, task.title, task.completed)}
                  className="w-5 h-5 rounded cursor-pointer accent-black"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600 min-w-fit">reminder:</label>
                      <select
                        value={task.reminderType || 'automatic'}
                        onChange={(e) => {
                          const updatedTasks = tasks.map(t =>
                            t.id === task.id
                              ? { ...t, reminderType: e.target.value as any, reminderEnabled: e.target.value !== 'none' }
                              : t
                          );
                          onUpdateTask?.(updatedTasks);
                        }}
                        className="px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                      >
                        <option value="automatic">automatic (4h)</option>
                        <option value="manual">manual</option>
                        <option value="none">none</option>
                      </select>
                    </div>
                    {task.reminderType === 'manual' && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 min-w-fit">time:</label>
                        <input
                          type="time"
                          value={task.reminderTime || '08:00'}
                          onChange={(e) => {
                            const updatedTasks = tasks.map(t =>
                              t.id === task.id
                                ? { ...t, reminderTime: e.target.value, reminderEnabled: true }
                                : t
                            );
                            onUpdateTask?.(updatedTasks);
                          }}
                          className="px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600 min-w-fit">deadline:</label>
                      <input
                        type="date"
                        value={task.deadline || ''}
                        onChange={(e) => {
                          const updatedTasks = tasks.map(t =>
                            t.id === task.id
                              ? { ...t, deadline: e.target.value || undefined }
                              : t
                          );
                          onUpdateTask?.(updatedTasks);
                        }}
                        className="px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                      />
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  ×
                </button>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
