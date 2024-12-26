import axios from 'axios';
import { NotificationEvent } from './notificationService';
import { profileNotificationsService } from './profileNotificationsService';

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  auth: string;
  p256dh: string;
  userAgent: string;
  platform: 'web' | 'android' | 'ios';
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  tag?: string;
  requireInteraction?: boolean;
  renotify?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
}

class PushNotificationService {
  private baseUrl = '/api/push-notifications';
  private swRegistration: ServiceWorkerRegistration | null = null;
  private pushSubscription: PushSubscription | null = null;

  // Service Worker Management
  async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications are not supported');
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      this.swRegistration = registration;
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  async unregisterServiceWorker(): Promise<void> {
    if (this.swRegistration) {
      try {
        await this.swRegistration.unregister();
        this.swRegistration = null;
        console.log('Service Worker unregistered');
      } catch (error) {
        console.error('Service Worker unregistration failed:', error);
        throw error;
      }
    }
  }

  // Push Subscription Management
  async subscribeToPush(userId: string): Promise<PushSubscription> {
    if (!this.swRegistration) {
      await this.registerServiceWorker();
    }

    try {
      const subscription = await this.swRegistration!.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: await this.getVAPIDPublicKey()
      });

      const pushSubscription = await this.saveSubscription(userId, subscription);
      this.pushSubscription = pushSubscription;
      return pushSubscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  async unsubscribeFromPush(): Promise<void> {
    if (!this.swRegistration) return;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await this.deleteSubscription(subscription.endpoint);
        this.pushSubscription = null;
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  private async getVAPIDPublicKey(): Promise<string> {
    try {
      const response = await axios.get<{ publicKey: string }>(`${this.baseUrl}/vapid-public-key`);
      return response.data.publicKey;
    } catch (error) {
      console.error('Failed to get VAPID public key:', error);
      throw error;
    }
  }

  private async saveSubscription(userId: string, subscription: PushSubscriptionJSON): Promise<PushSubscription> {
    try {
      const response = await axios.post<PushSubscription>(`${this.baseUrl}/subscriptions`, {
        userId,
        endpoint: subscription.endpoint,
        auth: subscription.keys?.auth,
        p256dh: subscription.keys?.p256dh,
        userAgent: navigator.userAgent,
        platform: this.detectPlatform()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save push subscription:', error);
      throw error;
    }
  }

  private async deleteSubscription(endpoint: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/subscriptions`, {
        params: { endpoint }
      });
    } catch (error) {
      console.error('Failed to delete push subscription:', error);
      throw error;
    }
  }

  // Platform Detection
  private detectPlatform(): 'web' | 'android' | 'ios' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    }
    return 'web';
  }

  // Permission Management
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported');
    }

    return await Notification.requestPermission();
  }

  async checkPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported');
    }

    return Notification.permission;
  }

  // Notification Handling
  async sendPushNotification(notification: Omit<PushNotification, 'id'>): Promise<PushNotification> {
    try {
      const response = await axios.post<PushNotification>(`${this.baseUrl}/send`, notification);
      return response.data;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw error;
    }
  }

  async handleNotificationEvent(event: NotificationEvent): Promise<void> {
    if (event.data?.pushNotification) {
      try {
        // Check user preferences
        const preferences = await profileNotificationsService.getPreferences(event.userId);
        
        // Skip if push notifications are disabled
        if (!preferences.pushNotifications) {
          console.log('Push notifications disabled for user:', event.userId);
          return;
        }

        // Skip if in quiet hours
        if (preferences.quietHours.enabled) {
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const [startHours, startMinutes] = preferences.quietHours.start.split(':').map(Number);
          const [endHours, endMinutes] = preferences.quietHours.end.split(':').map(Number);
          const startTime = startHours * 60 + startMinutes;
          const endTime = endHours * 60 + endMinutes;

          // Check if current time is within quiet hours
          const isQuietHours = endTime > startTime
            ? currentTime >= startTime && currentTime <= endTime
            : currentTime >= startTime || currentTime <= endTime;

          if (isQuietHours) {
            console.log('Notification skipped due to quiet hours for user:', event.userId);
            return;
          }
        }

        // Check frequency preferences
        if (preferences.frequency !== 'realtime') {
          // Add to batch queue for daily/weekly digest
          await this.addToBatchQueue(event, preferences.frequency);
          return;
        }

        await this.sendPushNotification({
          title: event.title,
          body: event.message,
          data: event.data,
          timestamp: new Date(event.createdAt).getTime(),
          requireInteraction: event.priority === 'high',
          ...event.data.pushNotification as Partial<PushNotification>
        });
      } catch (error) {
        console.error('Failed to handle notification event:', error);
        throw error;
      }
    }
  }

  private async addToBatchQueue(event: NotificationEvent, frequency: 'daily' | 'weekly'): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/batch-queue`, {
        event,
        frequency,
        userId: event.userId
      });
    } catch (error) {
      console.error('Failed to add notification to batch queue:', error);
      throw error;
    }
  }

  // Analytics
  async getPushStats(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    total: number;
    delivered: number;
    clicked: number;
    dismissed: number;
    platforms: Record<'web' | 'android' | 'ios', number>;
  }> {
    try {
      const response = await axios.get<{
        total: number;
        delivered: number;
        clicked: number;
        dismissed: number;
        platforms: Record<'web' | 'android' | 'ios', number>;
      }>(`${this.baseUrl}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get push stats:', error);
      throw error;
    }
  }
}

export const pushNotificationService = new PushNotificationService(); 