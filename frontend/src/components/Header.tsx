import React from 'react';
import type { Notification } from '../utils/notifications';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  currentTab?: 'tasks' | 'habits' | 'pomodoro' | 'about';
  onTabChange?: (tab: 'tasks' | 'habits' | 'pomodoro' | 'about') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onClearAll,
  currentTab = 'tasks',
  onTabChange
}) => {
  const tabs = [
    { id: 'tasks' as const, label: 'tasks' },
    { id: 'habits' as const, label: 'habits' },
    { id: 'pomodoro' as const, label: 'pomodoro' },
    { id: 'about' as const, label: 'about' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight">motiv.</h1>
            <p className="text-xs text-gray-500">productivity, simplified</p>
          </div>
          <NotificationsPanel
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onClearAll={onClearAll}
          />
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-8 border-t border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`px-2 py-3 text-sm font-medium transition border-b-2 rounded-t-md ${
                currentTab === tab.id
                  ? 'text-gray-900 border-b-gray-400'
                  : 'text-gray-600 hover:text-gray-900 border-b-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
