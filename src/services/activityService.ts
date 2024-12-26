import axios, { AxiosResponse } from 'axios';

export interface ActivityEvent {
  id: string;
  userId: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface ActivityFilter {
  startDate?: Date;
  endDate?: Date;
  types?: string[];
  page?: number;
  limit?: number;
}

export interface ActivityResponse {
  activities: ActivityEvent[];
  total: number;
  page: number;
  totalPages: number;
}

class ActivityService {
  private baseUrl = '/api/activity';

  async trackActivity(userId: string, type: string, description: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/track`, {
        type,
        description,
        metadata,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  }

  async getActivityHistory(userId: string, filter: ActivityFilter = {}): Promise<ActivityResponse> {
    try {
      const response: AxiosResponse<{
        activities: Array<Omit<ActivityEvent, 'timestamp'> & { timestamp: string }>;
        total: number;
        page: number;
        totalPages: number;
      }> = await axios.get(`${this.baseUrl}/${userId}/history`, {
        params: {
          startDate: filter.startDate?.toISOString(),
          endDate: filter.endDate?.toISOString(),
          types: filter.types?.join(','),
          page: filter.page || 1,
          limit: filter.limit || 10,
        },
      });

      return {
        ...response.data,
        activities: response.data.activities.map(activity => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
        })),
      };
    } catch (error) {
      console.error('Failed to fetch activity history:', error);
      throw error;
    }
  }

  async clearActivityHistory(userId: string, before?: Date): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/history`, {
        params: {
          before: before?.toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to clear activity history:', error);
      throw error;
    }
  }
}

export const activityService = new ActivityService(); 