import axios from 'axios';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  category: 'system' | 'security' | 'performance' | 'user' | 'notification';
  message: string;
  metadata: {
    notificationId?: string;
    userId?: string;
    deviceId?: string;
    channel?: string;
    status?: string;
    duration?: number;
    errorCode?: string;
    stackTrace?: string;
    [key: string]: unknown;
  };
  tags: string[];
}

export interface LogQuery {
  startDate?: Date;
  endDate?: Date;
  levels?: LogEntry['level'][];
  categories?: LogEntry['category'][];
  tags?: string[];
  search?: string;
  metadata?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'level';
  sortOrder?: 'asc' | 'desc';
}

export interface LogStats {
  totalEntries: number;
  entriesByLevel: Record<LogEntry['level'], number>;
  entriesByCategory: Record<LogEntry['category'], number>;
  topTags: Array<{ tag: string; count: number }>;
  timeDistribution: Array<{ timestamp: Date; count: number }>;
}

export class NotificationLogsService {
  private baseUrl = '/api/notifications/logs';

  // Log Entry Management
  async createLogEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<LogEntry> {
    try {
      const response = await axios.post<LogEntry>(`${this.baseUrl}/entries`, entry);
      return response.data;
    } catch (error) {
      console.error('Failed to create log entry:', error);
      throw error;
    }
  }

  async getLogEntry(entryId: string): Promise<LogEntry> {
    try {
      const response = await axios.get<LogEntry>(`${this.baseUrl}/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get log entry:', error);
      throw error;
    }
  }

  async queryLogs(query: LogQuery): Promise<{
    entries: LogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/entries`, {
        params: query
      });
      return response.data;
    } catch (error) {
      console.error('Failed to query logs:', error);
      throw error;
    }
  }

  // Log Analysis
  async getLogStats(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<LogStats> {
    try {
      const response = await axios.get<LogStats>(`${this.baseUrl}/stats`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get log stats:', error);
      throw error;
    }
  }

  async searchLogs(query: string, options?: {
    startDate?: Date;
    endDate?: Date;
    categories?: LogEntry['category'][];
    limit?: number;
  }): Promise<LogEntry[]> {
    try {
      const response = await axios.get<LogEntry[]>(`${this.baseUrl}/search`, {
        params: {
          query,
          ...options
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search logs:', error);
      throw error;
    }
  }

  // Log Export
  async exportLogs(query: LogQuery, format: 'json' | 'csv'): Promise<{
    url: string;
    expiresAt: Date;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/export`, {
        query,
        format
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export logs:', error);
      throw error;
    }
  }

  // Log Retention
  async setRetentionPolicy(policy: {
    duration: number; // in days
    categories?: LogEntry['category'][];
    levels?: LogEntry['level'][];
  }): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/retention`, policy);
    } catch (error) {
      console.error('Failed to set retention policy:', error);
      throw error;
    }
  }

  async getRetentionPolicy(): Promise<{
    duration: number;
    categories?: LogEntry['category'][];
    levels?: LogEntry['level'][];
    nextCleanup: Date;
    affectedEntries: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/retention`);
      return response.data;
    } catch (error) {
      console.error('Failed to get retention policy:', error);
      throw error;
    }
  }

  // Debug Logging
  async setLogLevel(level: LogEntry['level']): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/level`, { level });
    } catch (error) {
      console.error('Failed to set log level:', error);
      throw error;
    }
  }

  async getLogLevel(): Promise<{
    current: LogEntry['level'];
    available: LogEntry['level'][];
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/level`);
      return response.data;
    } catch (error) {
      console.error('Failed to get log level:', error);
      throw error;
    }
  }

  // Error Reporting
  async reportError(error: Error, context?: Record<string, unknown>): Promise<LogEntry> {
    try {
      const response = await axios.post<LogEntry>(`${this.baseUrl}/errors`, {
        message: error.message,
        stack: error.stack,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Failed to report error:', error);
      throw error;
    }
  }

  async getErrorSummary(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    totalErrors: number;
    uniqueErrors: number;
    topErrors: Array<{
      message: string;
      count: number;
      firstSeen: Date;
      lastSeen: Date;
    }>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/errors/summary`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get error summary:', error);
      throw error;
    }
  }
}

export const notificationLogsService = new NotificationLogsService(); 