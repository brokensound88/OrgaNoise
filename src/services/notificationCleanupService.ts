import axios from 'axios';

export interface CleanupConfig {
  id: string;
  name: string;
  description?: string;
  rules: Array<{
    type: 'age' | 'status' | 'size' | 'custom';
    condition: {
      field: string;
      operator: 'older_than' | 'equals' | 'greater_than' | 'less_than';
      value: unknown;
    };
    action: 'archive' | 'delete' | 'compress';
  }>;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:mm format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    timezone: string;
  };
  options: {
    dryRun?: boolean;
    batchSize?: number;
    retryAttempts?: number;
    backupBeforeCleanup?: boolean;
  };
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastRun?: Date;
    nextRun?: Date;
  };
}

export interface CleanupJob {
  id: string;
  configId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  stats: {
    totalProcessed: number;
    archived: number;
    deleted: number;
    compressed: number;
    errors: number;
    spaceFreed: number;
  };
  error?: string;
}

export interface StorageStats {
  totalSize: number;
  usedSize: number;
  availableSize: number;
  notifications: {
    total: number;
    active: number;
    archived: number;
    byAge: Record<string, number>; // e.g., '30d': 1000
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  };
  attachments: {
    total: number;
    totalSize: number;
    byType: Record<string, {
      count: number;
      size: number;
    }>;
  };
}

export class NotificationCleanupService {
  private baseUrl = '/api/notifications/cleanup';

  // Cleanup Configuration
  async createCleanupConfig(config: Omit<CleanupConfig, 'id' | 'metadata'>): Promise<CleanupConfig> {
    try {
      const response = await axios.post<CleanupConfig>(`${this.baseUrl}/configs`, config);
      return response.data;
    } catch (error) {
      console.error('Failed to create cleanup config:', error);
      throw error;
    }
  }

  async updateCleanupConfig(configId: string, updates: Partial<Omit<CleanupConfig, 'id' | 'metadata'>>): Promise<CleanupConfig> {
    try {
      const response = await axios.put<CleanupConfig>(`${this.baseUrl}/configs/${configId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update cleanup config:', error);
      throw error;
    }
  }

  async deleteCleanupConfig(configId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/configs/${configId}`);
    } catch (error) {
      console.error('Failed to delete cleanup config:', error);
      throw error;
    }
  }

  async listCleanupConfigs(): Promise<CleanupConfig[]> {
    try {
      const response = await axios.get<CleanupConfig[]>(`${this.baseUrl}/configs`);
      return response.data;
    } catch (error) {
      console.error('Failed to list cleanup configs:', error);
      throw error;
    }
  }

  // Cleanup Operations
  async startCleanup(configId: string, options?: {
    dryRun?: boolean;
    batchSize?: number;
  }): Promise<CleanupJob> {
    try {
      const response = await axios.post<CleanupJob>(`${this.baseUrl}/jobs`, {
        configId,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Failed to start cleanup:', error);
      throw error;
    }
  }

  async getCleanupStatus(jobId: string): Promise<CleanupJob> {
    try {
      const response = await axios.get<CleanupJob>(`${this.baseUrl}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get cleanup status:', error);
      throw error;
    }
  }

  async listCleanupJobs(filters?: {
    configId?: string;
    status?: CleanupJob['status'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<CleanupJob[]> {
    try {
      const response = await axios.get<CleanupJob[]>(`${this.baseUrl}/jobs`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list cleanup jobs:', error);
      throw error;
    }
  }

  // Storage Management
  async getStorageStats(): Promise<StorageStats> {
    try {
      const response = await axios.get<StorageStats>(`${this.baseUrl}/storage/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      throw error;
    }
  }

  async optimizeStorage(options?: {
    compressAttachments?: boolean;
    deduplicateContent?: boolean;
    removeOrphaned?: boolean;
  }): Promise<{
    spaceFreed: number;
    itemsProcessed: number;
    optimizations: Record<string, number>;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/storage/optimize`, options);
      return response.data;
    } catch (error) {
      console.error('Failed to optimize storage:', error);
      throw error;
    }
  }

  // Archive Management
  async archiveNotifications(criteria: {
    olderThan?: Date;
    status?: string[];
    type?: string[];
  }): Promise<{
    archived: number;
    errors: number;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/archive`, criteria);
      return response.data;
    } catch (error) {
      console.error('Failed to archive notifications:', error);
      throw error;
    }
  }

  async restoreFromArchive(criteria: {
    ids?: string[];
    beforeDate?: Date;
    afterDate?: Date;
  }): Promise<{
    restored: number;
    errors: number;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/restore`, criteria);
      return response.data;
    } catch (error) {
      console.error('Failed to restore from archive:', error);
      throw error;
    }
  }

  // Data Pruning
  async pruneData(options: {
    olderThan: Date;
    types: Array<'notifications' | 'attachments' | 'logs'>;
    preserveImportant?: boolean;
    backupFirst?: boolean;
  }): Promise<{
    prunedItems: number;
    spaceFreed: number;
    backupLocation?: string;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/prune`, options);
      return response.data;
    } catch (error) {
      console.error('Failed to prune data:', error);
      throw error;
    }
  }
}

export const notificationCleanupService = new NotificationCleanupService(); 