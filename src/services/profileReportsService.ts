import axios from 'axios';

export interface ActivitySummary {
  totalLogins: number;
  lastLogin: Date;
  averageSessionDuration: number;
  mostActiveHours: Array<{
    hour: number;
    activity: number;
  }>;
  activityByDay: Array<{
    date: string;
    actions: number;
  }>;
  topActions: Array<{
    type: string;
    count: number;
  }>;
}

export interface SecurityReport {
  lastPasswordChange: Date;
  securityScore: number;
  recentSecurityEvents: Array<{
    type: string;
    timestamp: Date;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'resolved' | 'pending' | 'investigating';
  }>;
  vulnerabilities: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  securityChecklist: Array<{
    item: string;
    status: 'complete' | 'incomplete' | 'not_applicable';
    lastChecked: Date;
  }>;
}

export interface UsageStatistics {
  profileCompleteness: number;
  engagementRate: number;
  connectionGrowth: Array<{
    period: string;
    connections: number;
    growth: number;
  }>;
  featureUsage: Array<{
    feature: string;
    usageCount: number;
    lastUsed: Date;
  }>;
  contentMetrics: {
    totalPosts: number;
    totalComments: number;
    totalReactions: number;
    averageEngagement: number;
  };
}

class ProfileReportsService {
  private baseUrl = '/api/profile-reports';

  // Get activity summary
  async getActivitySummary(userId: string, timeRange?: {
    start: Date;
    end: Date;
  }): Promise<ActivitySummary> {
    try {
      interface RawActivitySummary extends Omit<ActivitySummary, 'lastLogin'> {
        lastLogin: string;
      }

      const response = await axios.get<RawActivitySummary>(`${this.baseUrl}/${userId}/activity`, {
        params: timeRange && {
          start: timeRange.start.toISOString(),
          end: timeRange.end.toISOString(),
        },
      });

      return {
        ...response.data,
        lastLogin: new Date(response.data.lastLogin),
      };
    } catch (error) {
      console.error('Failed to get activity summary:', error);
      throw error;
    }
  }

  // Get security report
  async getSecurityReport(userId: string): Promise<SecurityReport> {
    try {
      interface RawSecurityReport extends Omit<SecurityReport, 'lastPasswordChange' | 'recentSecurityEvents' | 'securityChecklist'> {
        lastPasswordChange: string;
        recentSecurityEvents: Array<{
          type: string;
          timestamp: string;
          description: string;
          severity: 'low' | 'medium' | 'high';
          status: 'resolved' | 'pending' | 'investigating';
        }>;
        securityChecklist: Array<{
          item: string;
          status: 'complete' | 'incomplete' | 'not_applicable';
          lastChecked: string;
        }>;
      }

      const response = await axios.get<RawSecurityReport>(`${this.baseUrl}/${userId}/security`);

      return {
        ...response.data,
        lastPasswordChange: new Date(response.data.lastPasswordChange),
        recentSecurityEvents: response.data.recentSecurityEvents.map(event => ({
          ...event,
          timestamp: new Date(event.timestamp),
        })),
        securityChecklist: response.data.securityChecklist.map(item => ({
          ...item,
          lastChecked: new Date(item.lastChecked),
        })),
      };
    } catch (error) {
      console.error('Failed to get security report:', error);
      throw error;
    }
  }

  // Get usage statistics
  async getUsageStatistics(userId: string, timeRange?: {
    start: Date;
    end: Date;
  }): Promise<UsageStatistics> {
    try {
      interface RawUsageStatistics extends Omit<UsageStatistics, 'featureUsage'> {
        featureUsage: Array<{
          feature: string;
          usageCount: number;
          lastUsed: string;
        }>;
      }

      const response = await axios.get<RawUsageStatistics>(`${this.baseUrl}/${userId}/usage`, {
        params: timeRange && {
          start: timeRange.start.toISOString(),
          end: timeRange.end.toISOString(),
        },
      });

      return {
        ...response.data,
        featureUsage: response.data.featureUsage.map(feature => ({
          ...feature,
          lastUsed: new Date(feature.lastUsed),
        })),
      };
    } catch (error) {
      console.error('Failed to get usage statistics:', error);
      throw error;
    }
  }

  // Generate comprehensive report
  async generateReport(userId: string, options: {
    includeActivity?: boolean;
    includeSecurity?: boolean;
    includeUsage?: boolean;
    timeRange?: {
      start: Date;
      end: Date;
    };
    format?: 'pdf' | 'csv' | 'json';
  }): Promise<Blob> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${userId}/generate`,
        options,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  }

  // Schedule automated reports
  async scheduleReport(userId: string, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:mm format
    timezone: string;
    recipients: string[];
    reportTypes: Array<'activity' | 'security' | 'usage'>;
    format: 'pdf' | 'csv' | 'json';
  }): Promise<{
    id: string;
    nextRun: Date;
    status: 'active' | 'paused';
  }> {
    try {
      const response = await axios.post<{
        id: string;
        nextRun: string;
        status: 'active' | 'paused';
      }>(`${this.baseUrl}/${userId}/schedule`, schedule);

      return {
        ...response.data,
        nextRun: new Date(response.data.nextRun),
      };
    } catch (error) {
      console.error('Failed to schedule report:', error);
      throw error;
    }
  }

  // Cancel scheduled report
  async cancelScheduledReport(userId: string, scheduleId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/schedule/${scheduleId}`);
    } catch (error) {
      console.error('Failed to cancel scheduled report:', error);
      throw error;
    }
  }
}

export const profileReportsService = new ProfileReportsService(); 