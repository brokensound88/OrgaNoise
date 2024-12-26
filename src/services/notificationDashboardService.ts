import axios from 'axios';

export interface DashboardMetrics {
  overview: {
    totalNotifications: number;
    activeNotifications: number;
    deliveryRate: number;
    errorRate: number;
  };
  status: {
    email: 'operational' | 'degraded' | 'outage';
    push: 'operational' | 'degraded' | 'outage';
    inApp: 'operational' | 'degraded' | 'outage';
  };
  errors: {
    total: number;
    byType: Record<string, number>;
  };
}

export class NotificationDashboardService {
  private baseUrl = '/api/notifications/dashboard';

  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await axios.get<DashboardMetrics>(`${this.baseUrl}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Failed to get dashboard metrics:', error);
      throw error;
    }
  }

  async getSystemStatus(): Promise<{
    status: 'operational' | 'degraded' | 'outage';
    lastUpdated: Date;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get system status:', error);
      throw error;
    }
  }

  async getErrorLogs(): Promise<Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/errors`);
      return response.data;
    } catch (error) {
      console.error('Failed to get error logs:', error);
      throw error;
    }
  }
}

export const notificationDashboardService = new NotificationDashboardService(); 