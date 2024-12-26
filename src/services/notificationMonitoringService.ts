import axios from 'axios';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  components: Record<string, {
    status: 'healthy' | 'degraded' | 'critical';
    latency: number;
    uptime: number;
    lastCheck: Date;
    message?: string;
  }>;
  metrics: {
    activeConnections: number;
    queueSize: number;
    processingRate: number;
    errorRate: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      disk: number;
      network: {
        in: number;
        out: number;
      };
    };
  };
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  component: string;
  status: 'active' | 'acknowledged' | 'resolved';
  metadata: {
    createdAt: Date;
    acknowledgedAt?: Date;
    resolvedAt?: Date;
    acknowledgedBy?: string;
    resolvedBy?: string;
    relatedAlerts?: string[];
    metrics?: Record<string, number>;
  };
}

export interface PerformanceMetrics {
  period: {
    start: Date;
    end: Date;
    duration: number;
  };
  throughput: {
    total: number;
    successful: number;
    failed: number;
    rate: number;
  };
  latency: {
    avg: number;
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  queues: Record<string, {
    size: number;
    oldestItem: Date;
    processingRate: number;
  }>;
  errors: {
    count: number;
    rate: number;
    byType: Record<string, number>;
  };
}

export class NotificationMonitoringService {
  private baseUrl = '/api/notifications/monitoring';

  // Health Checks
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await axios.get<SystemHealth>(`${this.baseUrl}/health`);
      return response.data;
    } catch (error) {
      console.error('Failed to get system health:', error);
      throw error;
    }
  }

  async checkComponent(componentName: string): Promise<SystemHealth['components'][string]> {
    try {
      const response = await axios.get(`${this.baseUrl}/health/${componentName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to check component ${componentName}:`, error);
      throw error;
    }
  }

  async runHealthCheck(components?: string[]): Promise<{
    overallStatus: SystemHealth['status'];
    results: Record<string, {
      status: SystemHealth['status'];
      details: Record<string, unknown>;
    }>;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/health/check`, { components });
      return response.data;
    } catch (error) {
      console.error('Failed to run health check:', error);
      throw error;
    }
  }

  // Alert System
  async createAlert(alert: Omit<Alert, 'id' | 'status' | 'metadata'>): Promise<Alert> {
    try {
      const response = await axios.post<Alert>(`${this.baseUrl}/alerts`, alert);
      return response.data;
    } catch (error) {
      console.error('Failed to create alert:', error);
      throw error;
    }
  }

  async acknowledgeAlert(alertId: string, note?: string): Promise<Alert> {
    try {
      const response = await axios.post<Alert>(`${this.baseUrl}/alerts/${alertId}/acknowledge`, { note });
      return response.data;
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      throw error;
    }
  }

  async resolveAlert(alertId: string, resolution: {
    note?: string;
    rootCause?: string;
    preventiveMeasures?: string[];
  }): Promise<Alert> {
    try {
      const response = await axios.post<Alert>(`${this.baseUrl}/alerts/${alertId}/resolve`, resolution);
      return response.data;
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      throw error;
    }
  }

  async getActiveAlerts(filters?: {
    type?: Alert['type'];
    severity?: Alert['severity'];
    component?: string;
  }): Promise<Alert[]> {
    try {
      const response = await axios.get<Alert[]>(`${this.baseUrl}/alerts/active`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get active alerts:', error);
      throw error;
    }
  }

  // Performance Monitoring
  async getPerformanceMetrics(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<PerformanceMetrics> {
    try {
      const response = await axios.get<PerformanceMetrics>(`${this.baseUrl}/metrics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      throw error;
    }
  }

  async getComponentMetrics(componentName: string, metrics: string[]): Promise<Record<string, {
    current: number;
    min: number;
    max: number;
    avg: number;
    history: Array<{
      timestamp: Date;
      value: number;
    }>;
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/metrics/${componentName}`, {
        params: { metrics }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get component metrics:', error);
      throw error;
    }
  }

  // Resource Monitoring
  async getResourceUsage(): Promise<{
    cpu: Array<{
      timestamp: Date;
      usage: number;
      processes: number;
    }>;
    memory: Array<{
      timestamp: Date;
      used: number;
      free: number;
      cached: number;
    }>;
    disk: Array<{
      timestamp: Date;
      used: number;
      free: number;
      iops: number;
    }>;
    network: Array<{
      timestamp: Date;
      incoming: number;
      outgoing: number;
      connections: number;
    }>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/resources`);
      return response.data;
    } catch (error) {
      console.error('Failed to get resource usage:', error);
      throw error;
    }
  }

  // System Configuration
  async updateMonitoringConfig(config: {
    checkInterval?: number;
    alertThresholds?: Record<string, number>;
    retentionPeriod?: number;
    enabledChecks?: string[];
  }): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/config`, config);
    } catch (error) {
      console.error('Failed to update monitoring config:', error);
      throw error;
    }
  }

  async getMonitoringConfig(): Promise<{
    checkInterval: number;
    alertThresholds: Record<string, number>;
    retentionPeriod: number;
    enabledChecks: string[];
    lastUpdated: Date;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/config`);
      return response.data;
    } catch (error) {
      console.error('Failed to get monitoring config:', error);
      throw error;
    }
  }
}

export const notificationMonitoringService = new NotificationMonitoringService(); 