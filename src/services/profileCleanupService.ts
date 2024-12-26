import axios from 'axios';

export interface ArchiveOptions {
  dataTypes: Array<'profile' | 'posts' | 'comments' | 'connections' | 'messages'>;
  dateRange?: {
    start: Date;
    end: Date;
  };
  format: 'zip' | 'json';
  includeMedia: boolean;
}

export interface ExportOptions extends ArchiveOptions {
  encryptionKey?: string;
  splitByType: boolean;
}

export interface DeletionOptions {
  dataTypes: Array<'profile' | 'posts' | 'comments' | 'connections' | 'messages'>;
  dateRange?: {
    start: Date;
    end: Date;
  };
  backupBeforeDelete: boolean;
  hardDelete: boolean;
}

export interface CleanupJob {
  id: string;
  userId: string;
  type: 'archive' | 'export' | 'delete';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  options: ArchiveOptions | ExportOptions | DeletionOptions;
  result?: {
    downloadUrl?: string;
    expiresAt?: Date;
    affectedItems?: number;
    errors?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

class ProfileCleanupService {
  private baseUrl = '/api/profile-cleanup';

  // Archive profile data
  async archiveData(userId: string, options: ArchiveOptions): Promise<CleanupJob> {
    try {
      interface RawCleanupJob extends Omit<CleanupJob, 'result' | 'createdAt' | 'updatedAt' | 'completedAt'> {
        result?: {
          downloadUrl?: string;
          expiresAt?: string;
          affectedItems?: number;
          errors?: string[];
        };
        createdAt: string;
        updatedAt: string;
        completedAt?: string;
      }

      const response = await axios.post<RawCleanupJob>(`${this.baseUrl}/${userId}/archive`, {
        ...options,
        dateRange: options.dateRange && {
          start: options.dateRange.start.toISOString(),
          end: options.dateRange.end.toISOString(),
        },
      });

      return {
        ...response.data,
        result: response.data.result && {
          ...response.data.result,
          expiresAt: response.data.result.expiresAt
            ? new Date(response.data.result.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        completedAt: response.data.completedAt
          ? new Date(response.data.completedAt)
          : undefined,
      };
    } catch (error) {
      console.error('Failed to archive data:', error);
      throw error;
    }
  }

  // Export profile data
  async exportData(userId: string, options: ExportOptions): Promise<CleanupJob> {
    try {
      interface RawCleanupJob extends Omit<CleanupJob, 'result' | 'createdAt' | 'updatedAt' | 'completedAt'> {
        result?: {
          downloadUrl?: string;
          expiresAt?: string;
          affectedItems?: number;
          errors?: string[];
        };
        createdAt: string;
        updatedAt: string;
        completedAt?: string;
      }

      const response = await axios.post<RawCleanupJob>(`${this.baseUrl}/${userId}/export`, {
        ...options,
        dateRange: options.dateRange && {
          start: options.dateRange.start.toISOString(),
          end: options.dateRange.end.toISOString(),
        },
      });

      return {
        ...response.data,
        result: response.data.result && {
          ...response.data.result,
          expiresAt: response.data.result.expiresAt
            ? new Date(response.data.result.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        completedAt: response.data.completedAt
          ? new Date(response.data.completedAt)
          : undefined,
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  // Delete profile data
  async deleteData(userId: string, options: DeletionOptions): Promise<CleanupJob> {
    try {
      interface RawCleanupJob extends Omit<CleanupJob, 'result' | 'createdAt' | 'updatedAt' | 'completedAt'> {
        result?: {
          downloadUrl?: string;
          expiresAt?: string;
          affectedItems?: number;
          errors?: string[];
        };
        createdAt: string;
        updatedAt: string;
        completedAt?: string;
      }

      const response = await axios.post<RawCleanupJob>(`${this.baseUrl}/${userId}/delete`, {
        ...options,
        dateRange: options.dateRange && {
          start: options.dateRange.start.toISOString(),
          end: options.dateRange.end.toISOString(),
        },
      });

      return {
        ...response.data,
        result: response.data.result && {
          ...response.data.result,
          expiresAt: response.data.result.expiresAt
            ? new Date(response.data.result.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        completedAt: response.data.completedAt
          ? new Date(response.data.completedAt)
          : undefined,
      };
    } catch (error) {
      console.error('Failed to delete data:', error);
      throw error;
    }
  }

  // Get cleanup job status
  async getJobStatus(userId: string, jobId: string): Promise<CleanupJob> {
    try {
      interface RawCleanupJob extends Omit<CleanupJob, 'result' | 'createdAt' | 'updatedAt' | 'completedAt'> {
        result?: {
          downloadUrl?: string;
          expiresAt?: string;
          affectedItems?: number;
          errors?: string[];
        };
        createdAt: string;
        updatedAt: string;
        completedAt?: string;
      }

      const response = await axios.get<RawCleanupJob>(`${this.baseUrl}/${userId}/jobs/${jobId}`);

      return {
        ...response.data,
        result: response.data.result && {
          ...response.data.result,
          expiresAt: response.data.result.expiresAt
            ? new Date(response.data.result.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        completedAt: response.data.completedAt
          ? new Date(response.data.completedAt)
          : undefined,
      };
    } catch (error) {
      console.error('Failed to get job status:', error);
      throw error;
    }
  }

  // List cleanup jobs
  async listJobs(userId: string, options?: {
    type?: 'archive' | 'export' | 'delete';
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    limit?: number;
    offset?: number;
  }): Promise<{
    jobs: CleanupJob[];
    total: number;
  }> {
    try {
      interface RawCleanupJob extends Omit<CleanupJob, 'result' | 'createdAt' | 'updatedAt' | 'completedAt'> {
        result?: {
          downloadUrl?: string;
          expiresAt?: string;
          affectedItems?: number;
          errors?: string[];
        };
        createdAt: string;
        updatedAt: string;
        completedAt?: string;
      }

      const response = await axios.get<{
        jobs: RawCleanupJob[];
        total: number;
      }>(`${this.baseUrl}/${userId}/jobs`, { params: options });

      return {
        total: response.data.total,
        jobs: response.data.jobs.map(job => ({
          ...job,
          result: job.result && {
            ...job.result,
            expiresAt: job.result.expiresAt
              ? new Date(job.result.expiresAt)
              : undefined,
          },
          createdAt: new Date(job.createdAt),
          updatedAt: new Date(job.updatedAt),
          completedAt: job.completedAt
            ? new Date(job.completedAt)
            : undefined,
        })),
      };
    } catch (error) {
      console.error('Failed to list jobs:', error);
      throw error;
    }
  }

  // Cancel cleanup job
  async cancelJob(userId: string, jobId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/jobs/${jobId}/cancel`);
    } catch (error) {
      console.error('Failed to cancel job:', error);
      throw error;
    }
  }

  // Download archived/exported data
  async downloadData(userId: string, jobId: string): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseUrl}/${userId}/jobs/${jobId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to download data:', error);
      throw error;
    }
  }
}

export const profileCleanupService = new ProfileCleanupService(); 