import axios from 'axios';

export interface RateLimit {
  id: string;
  type: 'user' | 'ip' | 'api_key' | 'channel';
  target: string; // userId, IP address, API key, or channel name
  limits: {
    window: number; // time window in seconds
    maxRequests: number; // maximum requests allowed in the window
    burstLimit?: number; // maximum burst allowed
  }[];
  currentUsage: {
    requests: number;
    lastRequest: Date;
    resetAt: Date;
  };
  overrides?: {
    allowlist: boolean;
    customLimits?: {
      window: number;
      maxRequests: number;
      burstLimit?: number;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RateLimitQuota {
  remaining: number;
  reset: Date;
  total: number;
  current: number;
}

export interface ThrottleConfig {
  enabled: boolean;
  strategy: 'fixed' | 'sliding' | 'token_bucket';
  window: number;
  limit: number;
  burstLimit?: number;
}

export class NotificationRateLimitService {
  private baseUrl = '/api/notifications/rate-limits';

  // Rate Limit Management
  async createRateLimit(limit: Omit<RateLimit, 'id' | 'currentUsage' | 'createdAt' | 'updatedAt'>): Promise<RateLimit> {
    try {
      const response = await axios.post<RateLimit>(this.baseUrl, limit);
      return response.data;
    } catch (error) {
      console.error('Failed to create rate limit:', error);
      throw error;
    }
  }

  async updateRateLimit(
    limitId: string,
    updates: Partial<Omit<RateLimit, 'id' | 'currentUsage' | 'createdAt' | 'updatedAt'>>
  ): Promise<RateLimit> {
    try {
      const response = await axios.put<RateLimit>(`${this.baseUrl}/${limitId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update rate limit:', error);
      throw error;
    }
  }

  async getRateLimit(limitId: string): Promise<RateLimit> {
    try {
      const response = await axios.get<RateLimit>(`${this.baseUrl}/${limitId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get rate limit:', error);
      throw error;
    }
  }

  async deleteRateLimit(limitId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${limitId}`);
    } catch (error) {
      console.error('Failed to delete rate limit:', error);
      throw error;
    }
  }

  // Quota Management
  async checkQuota(type: RateLimit['type'], target: string): Promise<RateLimitQuota> {
    try {
      const response = await axios.get<RateLimitQuota>(`${this.baseUrl}/quota`, {
        params: { type, target }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to check quota:', error);
      throw error;
    }
  }

  async resetQuota(type: RateLimit['type'], target: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/quota/reset`, { type, target });
    } catch (error) {
      console.error('Failed to reset quota:', error);
      throw error;
    }
  }

  // Throttling Configuration
  async updateThrottleConfig(channel: string, config: ThrottleConfig): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/throttle/${channel}`, config);
    } catch (error) {
      console.error('Failed to update throttle configuration:', error);
      throw error;
    }
  }

  async getThrottleConfig(channel: string): Promise<ThrottleConfig> {
    try {
      const response = await axios.get<ThrottleConfig>(`${this.baseUrl}/throttle/${channel}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get throttle configuration:', error);
      throw error;
    }
  }

  // Burst Protection
  async configureBurstProtection(type: RateLimit['type'], config: {
    enabled: boolean;
    maxBurst: number;
    recoveryRate: number;
    penaltyThreshold: number;
  }): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/burst-protection/${type}`, config);
    } catch (error) {
      console.error('Failed to configure burst protection:', error);
      throw error;
    }
  }

  // Allowlist Management
  async addToAllowlist(type: RateLimit['type'], target: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/allowlist`, { type, target });
    } catch (error) {
      console.error('Failed to add to allowlist:', error);
      throw error;
    }
  }

  async removeFromAllowlist(type: RateLimit['type'], target: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/allowlist`, {
        params: { type, target }
      });
    } catch (error) {
      console.error('Failed to remove from allowlist:', error);
      throw error;
    }
  }

  // Analytics
  async getRateLimitAnalytics(timeframe: 'hour' | 'day' | 'week'): Promise<{
    totalRequests: number;
    throttledRequests: number;
    throttleRate: number;
    topThrottledTargets: Array<{
      type: RateLimit['type'];
      target: string;
      count: number;
    }>;
    burstEvents: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get rate limit analytics:', error);
      throw error;
    }
  }
}

export const notificationRateLimitService = new NotificationRateLimitService(); 