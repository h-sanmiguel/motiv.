import React from 'react';
import type { Notification } from '../utils/notifications';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ notifications, onMarkAsRead, onClearAll }) => {
  return (
    <header className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
    </header>
  );
};
