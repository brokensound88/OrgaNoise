import axios from 'axios';

export interface NotificationAnalytics {
  delivery: {
    total: number;
    delivered: number;
    failed: number;
    pending: number;
    averageDeliveryTime: number;
    deliverySuccessRate: number;
  };
  engagement: {
    totalImpressions: number;
    clickThroughRate: number;
    dismissRate: number;
    averageResponseTime: number;
    interactionsByType: Record<string, number>;
  };
  performance: {
    averageProcessingTime: number;
    queueLatency: number;
    errorRate: number;
    resourceUtilization: number;
    throughput: number;
  };
  channels: {
    email: {
      sent: number;
      opened: number;
      clicked: number;
      bounced: number;
      openRate: number;
      clickRate: number;
    };
    push: {
      sent: number;
      delivered: number;
      clicked: number;
      dismissed: number;
      platforms: Record<'web' | 'android' | 'ios', number>;
    };
    inApp: {
      displayed: number;
      interacted: number;
      dismissed: number;
      interactionRate: number;
    };
  };
}

export class NotificationAnalyticsService {
  private baseUrl = '/api/notifications/analytics';

  // Get comprehensive analytics
  async getAnalytics(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<NotificationAnalytics> {
    try {
      const response = await axios.get<NotificationAnalytics>(this.baseUrl, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get notification analytics:', error);
      throw error;
    }
  }

  // Track user engagement
  async trackEngagement(eventId: string, type: 'impression' | 'click' | 'dismiss', metadata?: Record<string, unknown>): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/engagement`, {
        eventId,
        type,
        metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track notification engagement:', error);
      throw error;
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<NotificationAnalytics['performance']> {
    try {
      const response = await axios.get<NotificationAnalytics['performance']>(`${this.baseUrl}/performance`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      throw error;
    }
  }

  // Get channel-specific analytics
  async getChannelAnalytics(
    channel: 'email' | 'push' | 'inApp',
    timeframe: 'hour' | 'day' | 'week' | 'month'
  ): Promise<NotificationAnalytics['channels'][typeof channel]> {
    try {
      const response = await axios.get(`${this.baseUrl}/channels/${channel}`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get channel analytics:', error);
      throw error;
    }
  }

  // Generate custom report
  async generateReport(options: {
    timeframe: 'hour' | 'day' | 'week' | 'month';
    metrics: Array<keyof NotificationAnalytics>;
    filters?: Record<string, unknown>;
    groupBy?: string[];
  }): Promise<Record<string, unknown>> {
    try {
      const response = await axios.post<Record<string, unknown>>(`${this.baseUrl}/reports`, options);
      return response.data;
    } catch (error) {
      console.error('Failed to generate analytics report:', error);
      throw error;
    }
  }

  // Export analytics data
  async exportData(options: {
    timeframe: 'hour' | 'day' | 'week' | 'month';
    format: 'csv' | 'json' | 'excel';
    metrics: Array<keyof NotificationAnalytics>;
  }): Promise<Blob> {
    try {
      const response = await axios.post(`${this.baseUrl}/export`, options, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      throw error;
    }
  }

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<{
    activeConnections: number;
    messageRate: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
    queueSize: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/realtime`);
      return response.data;
    } catch (error) {
      console.error('Failed to get real-time metrics:', error);
      throw error;
    }
  }
}

export const notificationAnalyticsService = new NotificationAnalyticsService(); 