import axios from 'axios';
import type { NotificationEvent } from './notificationService';

export interface NotificationHistory extends NotificationEvent {
  deliveryStatus: {
    channel: 'email' | 'push' | 'in_app';
    status: 'delivered' | 'failed' | 'read' | 'clicked' | 'dismissed';
    timestamp: Date;
    error?: string;
  }[];
  archiveStatus: 'active' | 'archived' | 'deleted';
  archivedAt?: Date;
  deletedAt?: Date;
  retentionPeriod?: number; // in days
}

export interface HistorySearchParams {
  userId?: string;
  type?: string[];
  status?: string[];
  priority?: ('low' | 'medium' | 'high')[];
  channel?: ('email' | 'push' | 'in_app')[];
  startDate?: Date;
  endDate?: Date;
  archiveStatus?: 'active' | 'archived' | 'deleted';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface HistoryExportOptions {
  format: 'csv' | 'json' | 'pdf';
  filters: HistorySearchParams;
  fields?: string[];
  includeMetadata?: boolean;
}

export class NotificationHistoryService {
  private baseUrl = '/api/notifications/history';

  // History Management
  async getHistory(params: HistorySearchParams): Promise<{
    items: NotificationHistory[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await axios.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get notification history:', error);
      throw error;
    }
  }

  async getHistoryItem(notificationId: string): Promise<NotificationHistory> {
    try {
      const response = await axios.get(`${this.baseUrl}/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notification history item:', error);
      throw error;
    }
  }

  // Archive Management
  async archiveNotifications(notificationIds: string[]): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/archive`, { notificationIds });
    } catch (error) {
      console.error('Failed to archive notifications:', error);
      throw error;
    }
  }

  async unarchiveNotifications(notificationIds: string[]): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/unarchive`, { notificationIds });
    } catch (error) {
      console.error('Failed to unarchive notifications:', error);
      throw error;
    }
  }

  async deleteNotifications(notificationIds: string[]): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/delete`, { notificationIds });
    } catch (error) {
      console.error('Failed to delete notifications:', error);
      throw error;
    }
  }

  async restoreNotifications(notificationIds: string[]): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/restore`, { notificationIds });
    } catch (error) {
      console.error('Failed to restore notifications:', error);
      throw error;
    }
  }

  // Search Functionality
  async searchHistory(query: string, params: Omit<HistorySearchParams, 'page' | 'limit'>): Promise<{
    items: NotificationHistory[];
    total: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { query, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search notification history:', error);
      throw error;
    }
  }

  async saveSearch(name: string, params: Omit<HistorySearchParams, 'page' | 'limit'>): Promise<{
    id: string;
    name: string;
    params: HistorySearchParams;
    createdAt: Date;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/saved-searches`, {
        name,
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save search:', error);
      throw error;
    }
  }

  async getSavedSearches(): Promise<Array<{
    id: string;
    name: string;
    params: HistorySearchParams;
    createdAt: Date;
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/saved-searches`);
      return response.data;
    } catch (error) {
      console.error('Failed to get saved searches:', error);
      throw error;
    }
  }

  // Export Functionality
  async exportHistory(options: HistoryExportOptions): Promise<Blob> {
    try {
      const response = await axios.post(`${this.baseUrl}/export`, options, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export notification history:', error);
      throw error;
    }
  }

  // Retention Management
  async setRetentionPolicy(period: number): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/retention`, { period });
    } catch (error) {
      console.error('Failed to set retention policy:', error);
      throw error;
    }
  }

  async getRetentionPolicy(): Promise<{
    period: number;
    lastCleanup: Date;
    nextCleanup: Date;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/retention`);
      return response.data;
    } catch (error) {
      console.error('Failed to get retention policy:', error);
      throw error;
    }
  }

  // Statistics
  async getHistoryStats(params: Omit<HistorySearchParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'>): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byChannel: Record<string, number>;
    averageDeliveryTime: number;
    successRate: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/stats`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get history statistics:', error);
      throw error;
    }
  }
}

export const notificationHistoryService = new NotificationHistoryService(); 