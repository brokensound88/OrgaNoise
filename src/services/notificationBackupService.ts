import axios from 'axios';

export interface BackupConfig {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  schedule?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string; // HH:mm format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
  };
  retention: {
    count: number;
    duration: number; // in days
  };
  encryption: {
    enabled: boolean;
    algorithm?: string;
    keyId?: string;
  };
  compression: {
    enabled: boolean;
    algorithm?: string;
    level?: number;
  };
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupJob {
  id: string;
  configId: string;
  type: 'full' | 'incremental';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  size?: number;
  itemCount?: number;
  error?: string;
  metadata: Record<string, unknown>;
}

export interface RestoreJob {
  id: string;
  backupId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  itemCount?: number;
  error?: string;
  options: {
    selective?: boolean;
    filters?: Record<string, unknown>;
    dryRun?: boolean;
  };
}

export class NotificationBackupService {
  private baseUrl = '/api/notifications/backup';

  // Backup Configuration
  async createBackupConfig(config: Omit<BackupConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<BackupConfig> {
    try {
      const response = await axios.post<BackupConfig>(`${this.baseUrl}/configs`, config);
      return response.data;
    } catch (error) {
      console.error('Failed to create backup config:', error);
      throw error;
    }
  }

  async updateBackupConfig(configId: string, updates: Partial<Omit<BackupConfig, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BackupConfig> {
    try {
      const response = await axios.put<BackupConfig>(`${this.baseUrl}/configs/${configId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update backup config:', error);
      throw error;
    }
  }

  async listBackupConfigs(): Promise<BackupConfig[]> {
    try {
      const response = await axios.get<BackupConfig[]>(`${this.baseUrl}/configs`);
      return response.data;
    } catch (error) {
      console.error('Failed to list backup configs:', error);
      throw error;
    }
  }

  // Backup Operations
  async startBackup(configId: string, options?: {
    type?: 'full' | 'incremental';
    metadata?: Record<string, unknown>;
  }): Promise<BackupJob> {
    try {
      const response = await axios.post<BackupJob>(`${this.baseUrl}/jobs`, {
        configId,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Failed to start backup:', error);
      throw error;
    }
  }

  async getBackupStatus(jobId: string): Promise<BackupJob> {
    try {
      const response = await axios.get<BackupJob>(`${this.baseUrl}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get backup status:', error);
      throw error;
    }
  }

  async listBackups(filters?: {
    configId?: string;
    type?: 'full' | 'incremental';
    status?: BackupJob['status'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<BackupJob[]> {
    try {
      const response = await axios.get<BackupJob[]>(`${this.baseUrl}/jobs`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list backups:', error);
      throw error;
    }
  }

  // Restore Operations
  async startRestore(backupId: string, options?: {
    selective?: boolean;
    filters?: Record<string, unknown>;
    dryRun?: boolean;
  }): Promise<RestoreJob> {
    try {
      const response = await axios.post<RestoreJob>(`${this.baseUrl}/restore`, {
        backupId,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Failed to start restore:', error);
      throw error;
    }
  }

  async getRestoreStatus(jobId: string): Promise<RestoreJob> {
    try {
      const response = await axios.get<RestoreJob>(`${this.baseUrl}/restore/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get restore status:', error);
      throw error;
    }
  }

  // Data Retention
  async applyRetentionPolicy(configId: string): Promise<{
    deletedBackups: number;
    freedSpace: number;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/retention/${configId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to apply retention policy:', error);
      throw error;
    }
  }

  async getRetentionStatus(configId: string): Promise<{
    totalBackups: number;
    totalSize: number;
    oldestBackup: Date;
    newestBackup: Date;
    nextCleanup?: Date;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/retention/${configId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get retention status:', error);
      throw error;
    }
  }
}

export const notificationBackupService = new NotificationBackupService(); 