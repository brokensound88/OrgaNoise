import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { NotificationEvent } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface NotificationCenterProps {
  userId: string;
  onNotificationClick?: (notification: NotificationEvent) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId, onNotificationClick }) => {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications/users/${userId}`);
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter((n: NotificationEvent) => 
        n.status === 'delivered' && !n.deliveredAt).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Set up real-time updates
  useEffect(() => {
    const eventSource = new EventSource(`/api/notifications/users/${userId}/stream`);

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data) as NotificationEvent;
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.info(newNotification.title);
    };

    eventSource.onerror = () => {
      console.error('EventSource failed. Retrying in 5s...');
      eventSource.close();
      setTimeout(() => {
        eventSource.close();
        new EventSource(`/api/notifications/users/${userId}/stream`);
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  // Handle marking notifications as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, status: 'delivered' as const, deliveredAt: new Date() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`/api/notifications/users/${userId}/read-all`, { method: 'POST' });
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          status: 'delivered' as const,
          deliveredAt: new Date()
        }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Handle clearing all notifications
  const handleClearAll = async () => {
    try {
      await fetch(`/api/notifications/users/${userId}/clear-all`, { method: 'DELETE' });
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: NotificationEvent) => {
    if (!notification.deliveredAt) {
      handleMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Toggle notifications"
        title="Toggle notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                title="Mark all as read"
              >
                <CheckIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleClearAll}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                title="Clear all"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                aria-label="Close notifications"
                title="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No notifications</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`cursor-pointer px-4 py-3 transition hover:bg-gray-50 ${
                      !notification.deliveredAt ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.deliveredAt && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="ml-4 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          aria-label="Mark as read"
                          title="Mark as read"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
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