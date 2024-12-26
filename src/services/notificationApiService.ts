import axios from 'axios';
import type { NotificationEvent } from './notificationService';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: ('read' | 'write' | 'admin')[];
  status: 'active' | 'revoked';
  expiresAt?: Date;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive';
  retryConfig?: {
    maxAttempts: number;
    backoffDelay: number;
  };
  headers?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: {
    query?: Record<string, {
      type: string;
      required: boolean;
      description: string;
    }>;
    body?: Record<string, {
      type: string;
      required: boolean;
      description: string;
    }>;
  };
  responses: Record<string, {
    description: string;
    schema: Record<string, unknown>;
  }>;
  authentication: {
    required: boolean;
    scopes?: string[];
  };
  rateLimit?: {
    requests: number;
    window: number;
  };
}

export class NotificationApiService {
  private baseUrl = '/api/notifications/api';

  // API Key Management
  async createApiKey(name: string, scopes: ApiKey['scopes']): Promise<ApiKey> {
    try {
      const response = await axios.post<ApiKey>(`${this.baseUrl}/keys`, {
        name,
        scopes
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  }

  async revokeApiKey(keyId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/keys/${keyId}/revoke`);
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      throw error;
    }
  }

  async listApiKeys(): Promise<ApiKey[]> {
    try {
      const response = await axios.get<ApiKey[]>(`${this.baseUrl}/keys`);
      return response.data;
    } catch (error) {
      console.error('Failed to list API keys:', error);
      throw error;
    }
  }

  // Webhook Management
  async createWebhook(config: Omit<WebhookConfig, 'id' | 'secret' | 'createdAt' | 'updatedAt'>): Promise<WebhookConfig> {
    try {
      const response = await axios.post<WebhookConfig>(`${this.baseUrl}/webhooks`, config);
      return response.data;
    } catch (error) {
      console.error('Failed to create webhook:', error);
      throw error;
    }
  }

  async updateWebhook(webhookId: string, updates: Partial<Omit<WebhookConfig, 'id' | 'secret' | 'createdAt' | 'updatedAt'>>): Promise<WebhookConfig> {
    try {
      const response = await axios.put<WebhookConfig>(`${this.baseUrl}/webhooks/${webhookId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/webhooks/${webhookId}`);
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      throw error;
    }
  }

  async listWebhooks(): Promise<WebhookConfig[]> {
    try {
      const response = await axios.get<WebhookConfig[]>(`${this.baseUrl}/webhooks`);
      return response.data;
    } catch (error) {
      console.error('Failed to list webhooks:', error);
      throw error;
    }
  }

  // WebSocket Management
  async createWebSocketToken(userId: string, scopes: string[]): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/websocket/token`, {
        userId,
        scopes
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create WebSocket token:', error);
      throw error;
    }
  }

  // API Documentation
  async getApiDocumentation(): Promise<{
    version: string;
    endpoints: ApiEndpoint[];
    schemas: Record<string, unknown>;
    securitySchemes: Record<string, unknown>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/documentation`);
      return response.data;
    } catch (error) {
      console.error('Failed to get API documentation:', error);
      throw error;
    }
  }

  // API Usage
  async getApiUsage(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    requestsByEndpoint: Record<string, number>;
    errorsByType: Record<string, number>;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/usage`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get API usage:', error);
      throw error;
    }
  }

  // API Health
  async getApiHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    latency: number;
    activeConnections: number;
    lastIncident?: {
      type: string;
      timestamp: Date;
      resolved: boolean;
    };
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data;
    } catch (error) {
      console.error('Failed to get API health:', error);
      throw error;
    }
  }
}

export const notificationApiService = new NotificationApiService(); 