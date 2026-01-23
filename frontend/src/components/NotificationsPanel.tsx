import React, { useState } from 'react';
import type { Notification } from '../utils/notifications';
import { formatNotificationTime } from '../utils/notifications';
import { BellIcon } from './BellIcon';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'reminder':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'reminder':
        return '🔔';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-700 hover:text-gray-900 transition"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-gray-600 hover:text-gray-900 transition"
              >
                clear all
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                <p>no notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => onMarkAsRead(notification.id)}
                    className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} cursor-pointer transition hover:opacity-75 ${
                      notification.read ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-700 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatNotificationTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
