import axios from 'axios';

export interface EncryptionKey {
  id: string;
  name: string;
  algorithm: string;
  status: 'active' | 'inactive' | 'compromised';
  version: number;
  rotationSchedule?: {
    enabled: boolean;
    interval: number; // in days
    lastRotation: Date;
    nextRotation: Date;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastUsed?: Date;
    expiresAt?: Date;
  };
}

export interface EncryptionConfig {
  id: string;
  name: string;
  keyId: string;
  algorithm: string;
  mode: 'gcm' | 'cbc';
  padding?: string;
  ivLength: number;
  tagLength?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityAudit {
  id: string;
  type: 'key_rotation' | 'config_change' | 'security_event';
  severity: 'info' | 'warning' | 'critical';
  description: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

export class NotificationEncryptionService {
  private baseUrl = '/api/notifications/encryption';

  // Key Management
  async createEncryptionKey(params: {
    name: string;
    algorithm: string;
    rotationSchedule?: {
      enabled: boolean;
      interval: number;
    };
  }): Promise<EncryptionKey> {
    try {
      const response = await axios.post<EncryptionKey>(`${this.baseUrl}/keys`, params);
      return response.data;
    } catch (error) {
      console.error('Failed to create encryption key:', error);
      throw error;
    }
  }

  async rotateKey(keyId: string): Promise<EncryptionKey> {
    try {
      const response = await axios.post<EncryptionKey>(`${this.baseUrl}/keys/${keyId}/rotate`);
      return response.data;
    } catch (error) {
      console.error('Failed to rotate key:', error);
      throw error;
    }
  }

  async revokeKey(keyId: string, reason: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/keys/${keyId}/revoke`, { reason });
    } catch (error) {
      console.error('Failed to revoke key:', error);
      throw error;
    }
  }

  async listKeys(includeInactive = false): Promise<EncryptionKey[]> {
    try {
      const response = await axios.get<EncryptionKey[]>(`${this.baseUrl}/keys`, {
        params: { includeInactive }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list keys:', error);
      throw error;
    }
  }

  // Encryption Configuration
  async createEncryptionConfig(config: Omit<EncryptionConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<EncryptionConfig> {
    try {
      const response = await axios.post<EncryptionConfig>(`${this.baseUrl}/configs`, config);
      return response.data;
    } catch (error) {
      console.error('Failed to create encryption config:', error);
      throw error;
    }
  }

  async updateEncryptionConfig(configId: string, updates: Partial<Omit<EncryptionConfig, 'id' | 'createdAt' | 'updatedAt'>>): Promise<EncryptionConfig> {
    try {
      const response = await axios.put<EncryptionConfig>(`${this.baseUrl}/configs/${configId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update encryption config:', error);
      throw error;
    }
  }

  async listConfigs(): Promise<EncryptionConfig[]> {
    try {
      const response = await axios.get<EncryptionConfig[]>(`${this.baseUrl}/configs`);
      return response.data;
    } catch (error) {
      console.error('Failed to list configs:', error);
      throw error;
    }
  }

  // Encryption Operations
  async encrypt(data: string | Buffer, configId: string): Promise<{
    encrypted: string;
    iv: string;
    tag?: string;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/encrypt`, {
        data: data instanceof Buffer ? data.toString('base64') : data,
        configId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      throw error;
    }
  }

  async decrypt(params: {
    encrypted: string;
    iv: string;
    tag?: string;
    configId: string;
  }): Promise<string> {
    try {
      const response = await axios.post<{ decrypted: string }>(`${this.baseUrl}/decrypt`, params);
      return response.data.decrypted;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      throw error;
    }
  }

  // Security Audit
  async getSecurityAudit(filters?: {
    type?: SecurityAudit['type'];
    severity?: SecurityAudit['severity'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<SecurityAudit[]> {
    try {
      const response = await axios.get<SecurityAudit[]>(`${this.baseUrl}/audit`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get security audit:', error);
      throw error;
    }
  }

  async getKeyUsageStats(keyId: string): Promise<{
    totalUsage: number;
    lastUsed: Date;
    usageByOperation: {
      encrypt: number;
      decrypt: number;
    };
    usageByService: Record<string, number>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/keys/${keyId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to get key usage stats:', error);
      throw error;
    }
  }

  // Health Check
  async getEncryptionHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    activeKeys: number;
    pendingRotation: number;
    lastAudit: Date;
    issues: Array<{
      type: string;
      severity: 'warning' | 'critical';
      message: string;
    }>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data;
    } catch (error) {
      console.error('Failed to get encryption health:', error);
      throw error;
    }
  }
}

export const notificationEncryptionService = new NotificationEncryptionService(); 