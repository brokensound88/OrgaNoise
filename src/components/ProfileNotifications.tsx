import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileNotificationsService,
  ProfileNotification,
  NotificationPreferences,
} from '../services/profileNotificationsService';

interface ProfileNotificationsProps {
  userId: string;
}

export const ProfileNotifications: React.FC<ProfileNotificationsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<ProfileNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [statistics, setStatistics] = useState<{
    totalNotifications: number;
    unreadCount: number;
    notificationsByType: Record<string, number>;
    notificationsByPriority: Record<string, number>;
    averageResponseTime: number;
    dismissalRate: number;
  } | null>(null);

  useEffect(() => {
    loadData();
    loadPreferences();
    loadStatistics();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await profileNotificationsService.getNotifications(userId);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      toast.error('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await profileNotificationsService.getPreferences(userId);
      setPreferences(prefs);
    } catch (error) {
      toast.error('Failed to load notification preferences');
      console.error(error);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await profileNotificationsService.getStatistics(userId);
      setStatistics(stats);
    } catch (error) {
      toast.error('Failed to load notification statistics');
      console.error(error);
    }
  };

  const handleMarkAsRead = async (notificationIds: string[]) => {
    try {
      await profileNotificationsService.markAsRead(userId, notificationIds);
      setNotifications(notifications.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, status: 'read' as const }
          : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
      toast.success('Notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
      console.error(error);
    }
  };

  const handleDismiss = async (notificationIds: string[]) => {
    try {
      await profileNotificationsService.dismissNotifications(userId, notificationIds);
      setNotifications(notifications.filter(notification =>
        !notificationIds.includes(notification.id)
      ));
      if (notifications.some(n => n.status === 'unread' && notificationIds.includes(n.id))) {
        setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
      }
      toast.success('Notifications dismissed');
    } catch (error) {
      toast.error('Failed to dismiss notifications');
      console.error(error);
    }
  };

  const handleUpdatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      const updatedPreferences = await profileNotificationsService.updatePreferences(
        userId,
        newPreferences
      );
      setPreferences(updatedPreferences);
      setShowPreferencesModal(false);
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notification preferences');
      console.error(error);
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getTypeIcon = (type: 'update_reminder' | 'completion_status' | 'security_alert') => {
    switch (type) {
      case 'update_reminder':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'completion_status':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'security_alert':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreferencesModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Preferences
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => handleMarkAsRead(notifications
                .filter(n => n.status === 'unread')
                .map(n => n.id)
              )}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Notifications</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {statistics.totalNotifications}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Response Time</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {Math.round(statistics.averageResponseTime)} min
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dismissal Rate</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {(statistics.dismissalRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white p-6 rounded-lg shadow ${
              notification.status === 'unread' ? 'border-l-4 border-indigo-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {getTypeIcon(notification.type)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getPriorityColor(notification.priority)
                    }`}>
                      {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {notification.status === 'unread' && (
                  <button
                    onClick={() => handleMarkAsRead([notification.id])}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDismiss([notification.id])}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {notification.metadata && (
              <div className="mt-4 border-t pt-4">
                {notification.metadata.completionPercentage !== undefined && (
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Completion</span>
                      <span>{notification.metadata.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 rounded-full h-2"
                        style={{ width: `${notification.metadata.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
                {notification.metadata.action && notification.metadata.link && (
                  <a
                    href={notification.metadata.link}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {notification.metadata.action}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}

        {notifications.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>

      {/* Preferences Modal */}
      {showPreferencesModal && preferences && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="update-reminders" className="text-sm font-medium text-gray-700">
                  Update Reminders
                </label>
                <input
                  type="checkbox"
                  id="update-reminders"
                  checked={preferences.updateReminders}
                  onChange={(e) => handleUpdatePreferences({
                    updateReminders: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="completion-alerts" className="text-sm font-medium text-gray-700">
                  Completion Alerts
                </label>
                <input
                  type="checkbox"
                  id="completion-alerts"
                  checked={preferences.completionAlerts}
                  onChange={(e) => handleUpdatePreferences({
                    completionAlerts: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="security-alerts" className="text-sm font-medium text-gray-700">
                  Security Alerts
                </label>
                <input
                  type="checkbox"
                  id="security-alerts"
                  checked={preferences.securityAlerts}
                  onChange={(e) => handleUpdatePreferences({
                    securityAlerts: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <input
                  type="checkbox"
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handleUpdatePreferences({
                    emailNotifications: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="push-notifications" className="text-sm font-medium text-gray-700">
                  Push Notifications
                </label>
                <input
                  type="checkbox"
                  id="push-notifications"
                  checked={preferences.pushNotifications}
                  onChange={(e) => handleUpdatePreferences({
                    pushNotifications: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                  Notification Frequency
                </label>
                <select
                  id="frequency"
                  value={preferences.frequency}
                  onChange={(e) => handleUpdatePreferences({
                    frequency: e.target.value as 'realtime' | 'daily' | 'weekly',
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiet Hours
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="quiet-hours-enabled"
                      checked={preferences.quietHours.enabled}
                      onChange={(e) => handleUpdatePreferences({
                        quietHours: {
                          ...preferences.quietHours,
                          enabled: e.target.checked,
                        },
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="quiet-hours-enabled" className="ml-2 text-sm text-gray-700">
                      Enable Quiet Hours
                    </label>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <div>
                      <label htmlFor="quiet-hours-start" className="sr-only">
                        Start Time
                      </label>
                      <input
                        id="quiet-hours-start"
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) => handleUpdatePreferences({
                          quietHours: {
                            ...preferences.quietHours,
                            start: e.target.value,
                          },
                        })}
                        className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={!preferences.quietHours.enabled}
                        title="Start Time"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div>
                      <label htmlFor="quiet-hours-end" className="sr-only">
                        End Time
                      </label>
                      <input
                        id="quiet-hours-end"
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) => handleUpdatePreferences({
                          quietHours: {
                            ...preferences.quietHours,
                            end: e.target.value,
                          },
                        })}
                        className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={!preferences.quietHours.enabled}
                        title="End Time"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
}; 