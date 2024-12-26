import axios from 'axios';

export interface ViewStatistics {
  totalViews: number;
  uniqueVisitors: number;
  averageTimeSpent: number;
  viewsByDate: {
    date: string;
    views: number;
  }[];
  viewsByLocation: {
    location: string;
    views: number;
  }[];
  viewsByDevice: {
    device: string;
    views: number;
  }[];
}

export interface InteractionMetrics {
  totalInteractions: number;
  interactionsByType: {
    type: string;
    count: number;
  }[];
  interactionsByDate: {
    date: string;
    interactions: number;
  }[];
  topInteractors: {
    userId: string;
    name: string;
    interactions: number;
  }[];
}

export interface GrowthTrends {
  followerGrowth: {
    date: string;
    followers: number;
    change: number;
  }[];
  connectionGrowth: {
    date: string;
    connections: number;
    change: number;
  }[];
  engagementRate: {
    date: string;
    rate: number;
  }[];
  profileCompleteness: {
    score: number;
    missingFields: string[];
    recommendations: string[];
  };
}

export interface AnalyticsPeriod {
  startDate: Date;
  endDate: Date;
}

class ProfileAnalyticsService {
  private baseUrl = '/api/profile-analytics';

  // View Statistics
  async getViewStatistics(userId: string, period: AnalyticsPeriod): Promise<ViewStatistics> {
    try {
      const response = await axios.get<ViewStatistics>(`${this.baseUrl}/views/${userId}`, {
        params: {
          startDate: period.startDate.toISOString(),
          endDate: period.endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get view statistics:', error);
      throw error;
    }
  }

  // Interaction Metrics
  async getInteractionMetrics(userId: string, period: AnalyticsPeriod): Promise<InteractionMetrics> {
    try {
      const response = await axios.get<InteractionMetrics>(`${this.baseUrl}/interactions/${userId}`, {
        params: {
          startDate: period.startDate.toISOString(),
          endDate: period.endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get interaction metrics:', error);
      throw error;
    }
  }

  // Growth Trends
  async getGrowthTrends(userId: string, period: AnalyticsPeriod): Promise<GrowthTrends> {
    try {
      const response = await axios.get<GrowthTrends>(`${this.baseUrl}/growth/${userId}`, {
        params: {
          startDate: period.startDate.toISOString(),
          endDate: period.endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get growth trends:', error);
      throw error;
    }
  }

  // Export Analytics Report
  async exportAnalyticsReport(
    userId: string,
    period: AnalyticsPeriod,
    format: 'pdf' | 'csv' | 'excel'
  ): Promise<Blob> {
    try {
      const response = await axios.get<Blob>(`${this.baseUrl}/export/${userId}`, {
        params: {
          startDate: period.startDate.toISOString(),
          endDate: period.endDate.toISOString(),
          format,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export analytics report:', error);
      throw error;
    }
  }

  // Track Custom Event
  async trackEvent(userId: string, eventData: {
    type: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/events/${userId}`, eventData);
    } catch (error) {
      console.error('Failed to track event:', error);
      throw error;
    }
  }

  // Get Analytics Summary
  async getAnalyticsSummary(userId: string): Promise<{
    views: number;
    interactions: number;
    followers: number;
    engagementRate: number;
    profileScore: number;
  }> {
    try {
      const response = await axios.get<{
        views: number;
        interactions: number;
        followers: number;
        engagementRate: number;
        profileScore: number;
      }>(`${this.baseUrl}/summary/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      throw error;
    }
  }
}

export const profileAnalyticsService = new ProfileAnalyticsService(); 