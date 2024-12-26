import axios from 'axios';
import type { AxiosResponse } from 'axios';

export interface ProfileNotification {
  id: string;
  userId: string;
  type: 'update_reminder' | 'completion_status' | 'security_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'unread' | 'read' | 'dismissed';
  metadata: {
    category?: string;
    action?: string;
    link?: string;
    expiresAt?: Date;
    completionPercentage?: number;
    securityLevel?: 'info' | 'warning' | 'critical';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  updateReminders: boolean;
  completionAlerts: boolean;
  securityAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // 24-hour format, e.g., "22:00"
    end: string; // 24-hour format, e.g., "07:00"
  };
  createdAt: Date;
  updatedAt: Date;
}

class ProfileNotificationsService {
  private baseUrl = '/api/profile-notifications';

  // Get all notifications for a user
  async getNotifications(userId: string, options?: {
    status?: 'unread' | 'read' | 'dismissed';
    type?: 'update_reminder' | 'completion_status' | 'security_alert';
    limit?: number;
    offset?: number;
  }): Promise<{
    notifications: ProfileNotification[];
    total: number;
    unreadCount: number;
  }> {
    try {
      interface RawNotification {
        id: string;
        userId: string;
        type: 'update_reminder' | 'completion_status' | 'security_alert';
        title: string;
        message: string;
        priority: 'low' | 'medium' | 'high';
        status: 'unread' | 'read' | 'dismissed';
        metadata: {
          category?: string;
          action?: string;
          link?: string;
          expiresAt?: string;
          completionPercentage?: number;
          securityLevel?: 'info' | 'warning' | 'critical';
        };
        createdAt: string;
        updatedAt: string;
      }

      const response: AxiosResponse<{
        notifications: RawNotification[];
        total: number;
        unreadCount: number;
      }> = await axios.get(`${this.baseUrl}/${userId}`, { params: options });

      return {
        ...response.data,
        notifications: response.data.notifications.map((notification: RawNotification) => ({
          ...notification,
          createdAt: new Date(notification.createdAt),
          updatedAt: new Date(notification.updatedAt),
          metadata: {
            ...notification.metadata,
            expiresAt: notification.metadata.expiresAt 
              ? new Date(notification.metadata.expiresAt)
              : undefined,
          },
        })),
      };
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  }

  // Mark notifications as read
  async markAsRead(userId: string, notificationIds: string[]): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${userId}/read`, { notificationIds });
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      throw error;
    }
  }

  // Dismiss notifications
  async dismissNotifications(userId: string, notificationIds: string[]): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${userId}/dismiss`, { notificationIds });
    } catch (error) {
      console.error('Failed to dismiss notifications:', error);
      throw error;
    }
  }

  // Get notification preferences
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const response: AxiosResponse<{
        id: string;
        userId: string;
        updateReminders: boolean;
        completionAlerts: boolean;
        securityAlerts: boolean;
        emailNotifications: boolean;
        pushNotifications: boolean;
        frequency: 'realtime' | 'daily' | 'weekly';
        quietHours: {
          enabled: boolean;
          start: string;
          end: string;
        };
        createdAt: string;
        updatedAt: string;
      }> = await axios.get(`${this.baseUrl}/${userId}/preferences`);

      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to get notification preferences:', error);
      throw error;
    }
  }

  // Update notification preferences
  async updatePreferences(
    userId: string,
    preferences: Partial<Omit<NotificationPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<NotificationPreferences> {
    try {
      const response: AxiosResponse<{
        id: string;
        userId: string;
        updateReminders: boolean;
        completionAlerts: boolean;
        securityAlerts: boolean;
        emailNotifications: boolean;
        pushNotifications: boolean;
        frequency: 'realtime' | 'daily' | 'weekly';
        quietHours: {
          enabled: boolean;
          start: string;
          end: string;
        };
        createdAt: string;
        updatedAt: string;
      }> = await axios.put(`${this.baseUrl}/${userId}/preferences`, preferences);

      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  }

  // Get notification statistics
  async getStatistics(userId: string): Promise<{
    totalNotifications: number;
    unreadCount: number;
    notificationsByType: Record<string, number>;
    notificationsByPriority: Record<string, number>;
    averageResponseTime: number;
    dismissalRate: number;
  }> {
    try {
      const response: AxiosResponse<{
        totalNotifications: number;
        unreadCount: number;
        notificationsByType: Record<string, number>;
        notificationsByPriority: Record<string, number>;
        averageResponseTime: number;
        dismissalRate: number;
      }> = await axios.get(`${this.baseUrl}/${userId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notification statistics:', error);
      throw error;
    }
  }

  // Subscribe to real-time notifications
  async subscribeToNotifications(userId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/subscribe`);
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      throw error;
    }
  }

  // Unsubscribe from real-time notifications
  async unsubscribeFromNotifications(userId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/unsubscribe`);
    } catch (error) {
      console.error('Failed to unsubscribe from notifications:', error);
      throw error;
    }
  }
}

export const profileNotificationsService = new ProfileNotificationsService(); 