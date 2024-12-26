import axios from 'axios';

export interface BackupSchedule {
  id: string;
  userId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastBackupAt: Date;
  nextBackupAt: Date;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupFile {
  id: string;
  userId: string;
  filename: string;
  size: number;
  type: 'manual' | 'scheduled';
  downloadUrl: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ProfileData {
  profile: {
    id: string;
    userId: string;
    [key: string]: unknown;
  };
  sections: {
    id: string;
    type: string;
    data: Record<string, unknown>;
  }[];
  documents: {
    id: string;
    type: string;
    url: string;
    [key: string]: unknown;
  }[];
  connections: {
    id: string;
    type: string;
    status: string;
    [key: string]: unknown;
  }[];
  settings: {
    id: string;
    [key: string]: unknown;
  };
  activity: {
    id: string;
    type: string;
    timestamp: string;
    [key: string]: unknown;
  }[];
}

class ProfileBackupService {
  private baseUrl = '/api/profile-backup';

  // Manual Backup
  async exportProfile(userId: string): Promise<BackupFile> {
    try {
      const response = await axios.post<BackupFile>(`${this.baseUrl}/export`, { userId });
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        expiresAt: new Date(response.data.expiresAt),
      };
    } catch (error) {
      console.error('Failed to export profile:', error);
      throw error;
    }
  }

  async importProfile(userId: string, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', file);

      await axios.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Failed to import profile:', error);
      throw error;
    }
  }

  // Scheduled Backups
  async getBackupSchedule(userId: string): Promise<BackupSchedule> {
    try {
      const response = await axios.get<BackupSchedule>(`${this.baseUrl}/schedule/${userId}`);
      return {
        ...response.data,
        lastBackupAt: new Date(response.data.lastBackupAt),
        nextBackupAt: new Date(response.data.nextBackupAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to get backup schedule:', error);
      throw error;
    }
  }

  async updateBackupSchedule(
    userId: string,
    schedule: Pick<BackupSchedule, 'frequency' | 'isEnabled'>
  ): Promise<BackupSchedule> {
    try {
      const response = await axios.put<BackupSchedule>(
        `${this.baseUrl}/schedule/${userId}`,
        schedule
      );
      return {
        ...response.data,
        lastBackupAt: new Date(response.data.lastBackupAt),
        nextBackupAt: new Date(response.data.nextBackupAt),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update backup schedule:', error);
      throw error;
    }
  }

  // Backup History
  async getBackupHistory(userId: string): Promise<BackupFile[]> {
    try {
      const response = await axios.get<BackupFile[]>(`${this.baseUrl}/history/${userId}`);
      return response.data.map(backup => ({
        ...backup,
        createdAt: new Date(backup.createdAt),
        expiresAt: new Date(backup.expiresAt),
      }));
    } catch (error) {
      console.error('Failed to get backup history:', error);
      throw error;
    }
  }

  async deleteBackup(userId: string, backupId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/history/${userId}/${backupId}`);
    } catch (error) {
      console.error('Failed to delete backup:', error);
      throw error;
    }
  }

  // Download Backup
  async downloadBackup(userId: string, backupId: string): Promise<void> {
    try {
      const response = await axios.get<Blob>(`${this.baseUrl}/download/${userId}/${backupId}`, {
        responseType: 'blob',
      });

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `profile-backup-${new Date().toISOString()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download backup:', error);
      throw error;
    }
  }

  // Preview Backup Contents
  async previewBackup(file: File): Promise<ProfileData> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<ProfileData>(`${this.baseUrl}/preview`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to preview backup:', error);
      throw error;
    }
  }

  // Validate Backup File
  async validateBackup(file: File): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      interface ValidationResponse {
        isValid: boolean;
        errors: string[];
        warnings: string[];
      }

      const response = await axios.post<ValidationResponse>(
        `${this.baseUrl}/validate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to validate backup:', error);
      throw error;
    }
  }
}

export const profileBackupService = new ProfileBackupService(); 