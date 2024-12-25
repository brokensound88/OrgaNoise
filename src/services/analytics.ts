interface UserActivity {
  userId: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
}

interface PageView {
  path: string;
  views: number;
  uniqueVisitors: number;
  averageTimeSpent: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  activeUsers: number;
  lastUpdated: string;
}

interface TrackEventData {
  eventName: string;
  eventData: Record<string, unknown>;
  timestamp: string;
}

export class AnalyticsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '';
  }

  async getUserActivity(timeRange: string): Promise<UserActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/user-activity?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user activity data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  async getPageViews(timeRange: string): Promise<PageView[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/page-views?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch page views data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching page views:', error);
      throw error;
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/system-metrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw error;
    }
  }

  async trackEvent(eventName: string, eventData: Record<string, unknown>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          eventName,
          eventData,
          timestamp: new Date().toISOString(),
        } as TrackEventData),
      });

      if (!response.ok) {
        throw new Error('Failed to track event');
      }
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }
} 