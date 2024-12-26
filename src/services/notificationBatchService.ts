import axios from 'axios';
import { NotificationEvent } from './notificationService';

export interface BatchConfig {
  id: string;
  userId: string;
  frequency: 'daily' | 'weekly';
  schedule: {
    time: string; // 24-hour format, e.g., "09:00"
    timezone: string; // e.g., "America/New_York"
    days?: number[]; // 0-6 for weekly batches (0 = Sunday)
  };
  filters?: {
    types?: string[];
    priorities?: ('low' | 'medium' | 'high')[];
    categories?: string[];
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BatchQueue {
  id: string;
  configId: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  events: NotificationEvent[];
  scheduledFor: Date;
  processedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationBatchService {
  private baseUrl = '/api/notifications/batch';

  // Batch Configuration Management
  async createBatchConfig(config: Omit<BatchConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<BatchConfig> {
    try {
      const response = await axios.post<BatchConfig>(`${this.baseUrl}/configs`, config);
      return response.data;
    } catch (error) {
      console.error('Failed to create batch configuration:', error);
      throw error;
    }
  }

  async updateBatchConfig(configId: string, updates: Partial<Omit<BatchConfig, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BatchConfig> {
    try {
      const response = await axios.put<BatchConfig>(`${this.baseUrl}/configs/${configId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update batch configuration:', error);
      throw error;
    }
  }

  async getBatchConfig(configId: string): Promise<BatchConfig> {
    try {
      const response = await axios.get<BatchConfig>(`${this.baseUrl}/configs/${configId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get batch configuration:', error);
      throw error;
    }
  }

  async getUserBatchConfigs(userId: string): Promise<BatchConfig[]> {
    try {
      const response = await axios.get<BatchConfig[]>(`${this.baseUrl}/configs/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user batch configurations:', error);
      throw error;
    }
  }

  // Queue Management
  async addToBatchQueue(configId: string, events: NotificationEvent[]): Promise<BatchQueue> {
    try {
      const response = await axios.post<BatchQueue>(`${this.baseUrl}/queues`, {
        configId,
        events
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add events to batch queue:', error);
      throw error;
    }
  }

  async getBatchQueue(queueId: string): Promise<BatchQueue> {
    try {
      const response = await axios.get<BatchQueue>(`${this.baseUrl}/queues/${queueId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get batch queue:', error);
      throw error;
    }
  }

  async getUserBatchQueues(userId: string, status?: BatchQueue['status']): Promise<BatchQueue[]> {
    try {
      const response = await axios.get<BatchQueue[]>(`${this.baseUrl}/queues/user/${userId}`, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get user batch queues:', error);
      throw error;
    }
  }

  // Batch Processing
  async processBatchQueue(queueId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/queues/${queueId}/process`);
    } catch (error) {
      console.error('Failed to process batch queue:', error);
      throw error;
    }
  }

  async retryFailedBatch(queueId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/queues/${queueId}/retry`);
    } catch (error) {
      console.error('Failed to retry failed batch:', error);
      throw error;
    }
  }

  // Scheduled Delivery
  async scheduleDelivery(configId: string, scheduledFor: Date): Promise<BatchQueue> {
    try {
      const response = await axios.post<BatchQueue>(`${this.baseUrl}/schedule`, {
        configId,
        scheduledFor: scheduledFor.toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to schedule batch delivery:', error);
      throw error;
    }
  }

  async cancelScheduledDelivery(queueId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/schedule/${queueId}`);
    } catch (error) {
      console.error('Failed to cancel scheduled delivery:', error);
      throw error;
    }
  }

  // Batch Analytics
  async getBatchStats(timeframe: 'day' | 'week' | 'month'): Promise<{
    totalBatches: number;
    successfulBatches: number;
    failedBatches: number;
    averageProcessingTime: number;
    averageBatchSize: number;
    deliverySuccessRate: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/stats`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get batch statistics:', error);
      throw error;
    }
  }
}

export const notificationBatchService = new NotificationBatchService(); 