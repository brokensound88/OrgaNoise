import axios from 'axios';

export interface NotificationAction {
  id: string;
  name: string;
  description: string;
  type: 'button' | 'link' | 'form';
  icon?: string;
  style?: {
    color?: string;
    backgroundColor?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  };
  metadata?: Record<string, unknown>;
  config: {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    target?: '_blank' | '_self';
    confirmationRequired?: boolean;
    confirmationMessage?: string;
    formSchema?: {
      fields: Array<{
        name: string;
        label: string;
        type: 'text' | 'number' | 'boolean' | 'select' | 'date';
        required: boolean;
        options?: string[];
        validation?: {
          pattern?: string;
          min?: number;
          max?: number;
          message?: string;
        };
      }>;
    };
  };
  tracking: {
    enabled: boolean;
    category?: string;
    label?: string;
    properties?: Record<string, unknown>;
  };
  conditions?: {
    userRoles?: string[];
    timeWindow?: {
      start?: string;
      end?: string;
      timezone?: string;
    };
    deviceTypes?: ('desktop' | 'mobile' | 'tablet')[];
    customLogic?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionEvent {
  id: string;
  actionId: string;
  notificationId: string;
  userId: string;
  type: 'click' | 'submit' | 'dismiss';
  data?: Record<string, unknown>;
  timestamp: Date;
  deviceInfo: {
    type: string;
    os: string;
    browser: string;
  };
  metadata?: Record<string, unknown>;
}

export class NotificationActionService {
  private baseUrl = '/api/notifications/actions';

  // Action Management
  async createAction(action: Omit<NotificationAction, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationAction> {
    try {
      const response = await axios.post<NotificationAction>(this.baseUrl, action);
      return response.data;
    } catch (error) {
      console.error('Failed to create notification action:', error);
      throw error;
    }
  }

  async updateAction(
    actionId: string,
    updates: Partial<Omit<NotificationAction, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<NotificationAction> {
    try {
      const response = await axios.put<NotificationAction>(`${this.baseUrl}/${actionId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update notification action:', error);
      throw error;
    }
  }

  async getAction(actionId: string): Promise<NotificationAction> {
    try {
      const response = await axios.get<NotificationAction>(`${this.baseUrl}/${actionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notification action:', error);
      throw error;
    }
  }

  async deleteAction(actionId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${actionId}`);
    } catch (error) {
      console.error('Failed to delete notification action:', error);
      throw error;
    }
  }

  // Action Execution
  async executeAction(actionId: string, notificationId: string, data?: Record<string, unknown>): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${actionId}/execute`, {
        notificationId,
        data,
        timestamp: new Date().toISOString(),
        deviceInfo: this.getDeviceInfo()
      });
    } catch (error) {
      console.error('Failed to execute notification action:', error);
      throw error;
    }
  }

  // Action Tracking
  async trackAction(event: Omit<ActionEvent, 'id' | 'timestamp' | 'deviceInfo'>): Promise<ActionEvent> {
    try {
      const response = await axios.post<ActionEvent>(`${this.baseUrl}/track`, {
        ...event,
        timestamp: new Date().toISOString(),
        deviceInfo: this.getDeviceInfo()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to track notification action:', error);
      throw error;
    }
  }

  async getActionEvents(
    actionId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      type?: ActionEvent['type'];
      userId?: string;
    }
  ): Promise<ActionEvent[]> {
    try {
      const response = await axios.get<ActionEvent[]>(`${this.baseUrl}/${actionId}/events`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get action events:', error);
      throw error;
    }
  }

  // Deep Linking
  async generateDeepLink(actionId: string, params?: Record<string, string>): Promise<string> {
    try {
      const response = await axios.post<{ url: string }>(`${this.baseUrl}/${actionId}/deep-link`, { params });
      return response.data.url;
    } catch (error) {
      console.error('Failed to generate deep link:', error);
      throw error;
    }
  }

  // Action Analytics
  async getActionAnalytics(actionId: string, timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    totalExecutions: number;
    uniqueUsers: number;
    conversionRate: number;
    averageResponseTime: number;
    deviceBreakdown: Record<string, number>;
    timeDistribution: Record<string, number>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/${actionId}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get action analytics:', error);
      throw error;
    }
  }

  // Helper Methods
  private getDeviceInfo(): ActionEvent['deviceInfo'] {
    const userAgent = navigator.userAgent;
    const deviceType = /Mobile|Tablet/i.test(userAgent) ? (/Tablet/i.test(userAgent) ? 'tablet' : 'mobile') : 'desktop';
    const os = this.detectOS(userAgent);
    const browser = this.detectBrowser(userAgent);

    return {
      type: deviceType,
      os,
      browser
    };
  }

  private detectOS(userAgent: string): string {
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Mac OS/i.test(userAgent)) return 'MacOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iOS/i.test(userAgent)) return 'iOS';
    return 'Unknown';
  }

  private detectBrowser(userAgent: string): string {
    if (/Chrome/i.test(userAgent)) return 'Chrome';
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Safari/i.test(userAgent)) return 'Safari';
    if (/Edge/i.test(userAgent)) return 'Edge';
    if (/Opera/i.test(userAgent)) return 'Opera';
    return 'Unknown';
  }
}

export const notificationActionService = new NotificationActionService(); 