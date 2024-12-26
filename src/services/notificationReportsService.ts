import axios from 'axios';

export interface ReportConfig {
  id: string;
  name: string;
  description?: string;
  type: 'custom' | 'system';
  metrics: Array<{
    name: string;
    type: 'count' | 'percentage' | 'average' | 'sum';
    field: string;
    filters?: Record<string, unknown>;
    groupBy?: string;
  }>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:mm format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    timezone: string;
  };
  format: 'pdf' | 'csv' | 'json' | 'excel';
  recipients: Array<{
    type: 'email' | 'webhook';
    destination: string;
  }>;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastRun?: Date;
    nextRun?: Date;
  };
}

export interface ReportExecution {
  id: string;
  configId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  metrics: Array<{
    name: string;
    value: number | Record<string, number>;
    trend?: {
      direction: 'up' | 'down' | 'stable';
      percentage: number;
    };
  }>;
  error?: string;
  outputUrl?: string;
}

export interface AnalyticsData {
  deliveryStats: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    byChannel: Record<string, number>;
  };
  engagementStats: {
    openRate: number;
    clickRate: number;
    responseRate: number;
    byType: Record<string, {
      sent: number;
      engaged: number;
      rate: number;
    }>;
  };
  performanceStats: {
    averageDeliveryTime: number;
    p95DeliveryTime: number;
    p99DeliveryTime: number;
    byHour: Record<string, {
      count: number;
      averageTime: number;
    }>;
  };
}

export class NotificationReportsService {
  private baseUrl = '/api/notifications/reports';

  // Report Configuration
  async createReportConfig(config: Omit<ReportConfig, 'id' | 'metadata'>): Promise<ReportConfig> {
    try {
      const response = await axios.post<ReportConfig>(`${this.baseUrl}/configs`, config);
      return response.data;
    } catch (error) {
      console.error('Failed to create report config:', error);
      throw error;
    }
  }

  async updateReportConfig(configId: string, updates: Partial<Omit<ReportConfig, 'id' | 'metadata'>>): Promise<ReportConfig> {
    try {
      const response = await axios.put<ReportConfig>(`${this.baseUrl}/configs/${configId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update report config:', error);
      throw error;
    }
  }

  async deleteReportConfig(configId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/configs/${configId}`);
    } catch (error) {
      console.error('Failed to delete report config:', error);
      throw error;
    }
  }

  async listReportConfigs(filters?: {
    type?: ReportConfig['type'];
    search?: string;
  }): Promise<ReportConfig[]> {
    try {
      const response = await axios.get<ReportConfig[]>(`${this.baseUrl}/configs`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list report configs:', error);
      throw error;
    }
  }

  // Report Generation
  async generateReport(configId: string, params?: {
    startDate?: Date;
    endDate?: Date;
    format?: ReportConfig['format'];
  }): Promise<ReportExecution> {
    try {
      const response = await axios.post<ReportExecution>(`${this.baseUrl}/generate/${configId}`, params);
      return response.data;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  }

  async getReportStatus(executionId: string): Promise<ReportExecution> {
    try {
      const response = await axios.get<ReportExecution>(`${this.baseUrl}/executions/${executionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get report status:', error);
      throw error;
    }
  }

  async listReportExecutions(filters?: {
    configId?: string;
    status?: ReportExecution['status'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<ReportExecution[]> {
    try {
      const response = await axios.get<ReportExecution[]>(`${this.baseUrl}/executions`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list report executions:', error);
      throw error;
    }
  }

  // Analytics Export
  async exportAnalytics(params: {
    startDate: Date;
    endDate: Date;
    metrics: string[];
    format: 'csv' | 'json' | 'excel';
    filters?: Record<string, unknown>;
  }): Promise<{
    url: string;
    expiresAt: Date;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/analytics/export`, params);
      return response.data;
    } catch (error) {
      console.error('Failed to export analytics:', error);
      throw error;
    }
  }

  async getAnalytics(timeframe: 'day' | 'week' | 'month' | 'quarter'): Promise<AnalyticsData> {
    try {
      const response = await axios.get<AnalyticsData>(`${this.baseUrl}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }

  // Schedule Management
  async scheduleReport(configId: string, schedule: ReportConfig['schedule']): Promise<ReportConfig> {
    try {
      const response = await axios.post<ReportConfig>(`${this.baseUrl}/configs/${configId}/schedule`, schedule);
      return response.data;
    } catch (error) {
      console.error('Failed to schedule report:', error);
      throw error;
    }
  }

  async unscheduleReport(configId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/configs/${configId}/schedule`);
    } catch (error) {
      console.error('Failed to unschedule report:', error);
      throw error;
    }
  }

  async getScheduledReports(): Promise<Array<{
    configId: string;
    name: string;
    schedule: NonNullable<ReportConfig['schedule']>;
    lastRun?: Date;
    nextRun: Date;
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/scheduled`);
      return response.data;
    } catch (error) {
      console.error('Failed to get scheduled reports:', error);
      throw error;
    }
  }
}

export const notificationReportsService = new NotificationReportsService(); 