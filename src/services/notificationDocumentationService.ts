import axios from 'axios';

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue?: unknown;
  }>;
  requestBody?: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      required: boolean;
    }>;
  };
  responses: Record<string, {
    description: string;
    schema: Record<string, unknown>;
    example: unknown;
  }>;
  authentication?: {
    required: boolean;
    type: string;
    scopes?: string[];
  };
}

export interface Integration {
  name: string;
  version: string;
  description: string;
  setup: {
    prerequisites: string[];
    steps: Array<{
      title: string;
      description: string;
      code?: string;
    }>;
    configuration: Record<string, {
      description: string;
      type: string;
      required: boolean;
      defaultValue?: unknown;
    }>;
  };
  examples: Array<{
    title: string;
    description: string;
    code: string;
    output?: unknown;
  }>;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'integration' | 'api' | 'best-practices' | 'troubleshooting';
  content: string; // Markdown content
  metadata: {
    author: string;
    createdAt: Date;
    updatedAt: Date;
    version: string;
    tags: string[];
  };
}

export class NotificationDocumentationService {
  private baseUrl = '/api/notifications/docs';

  // API Reference
  async getApiReference(): Promise<{
    version: string;
    baseUrl: string;
    authentication: {
      types: string[];
      flows: Record<string, unknown>;
    };
    endpoints: ApiEndpoint[];
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/api-reference`);
      return response.data;
    } catch (error) {
      console.error('Failed to get API reference:', error);
      throw error;
    }
  }

  async getEndpointDetails(path: string, method: string): Promise<ApiEndpoint> {
    try {
      const response = await axios.get(`${this.baseUrl}/endpoints/${method}/${path}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get endpoint details:', error);
      throw error;
    }
  }

  // Integration Guides
  async getIntegrationGuides(): Promise<Integration[]> {
    try {
      const response = await axios.get<Integration[]>(`${this.baseUrl}/integrations`);
      return response.data;
    } catch (error) {
      console.error('Failed to get integration guides:', error);
      throw error;
    }
  }

  async getIntegrationDetails(name: string, version?: string): Promise<Integration> {
    try {
      const response = await axios.get(`${this.baseUrl}/integrations/${name}`, {
        params: { version }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get integration details:', error);
      throw error;
    }
  }

  // Documentation Management
  async createGuide(guide: Omit<Guide, 'id' | 'metadata'>): Promise<Guide> {
    try {
      const response = await axios.post<Guide>(`${this.baseUrl}/guides`, guide);
      return response.data;
    } catch (error) {
      console.error('Failed to create guide:', error);
      throw error;
    }
  }

  async updateGuide(guideId: string, updates: Partial<Omit<Guide, 'id' | 'metadata'>>): Promise<Guide> {
    try {
      const response = await axios.put<Guide>(`${this.baseUrl}/guides/${guideId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update guide:', error);
      throw error;
    }
  }

  async deleteGuide(guideId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/guides/${guideId}`);
    } catch (error) {
      console.error('Failed to delete guide:', error);
      throw error;
    }
  }

  async listGuides(filters?: {
    category?: Guide['category'];
    search?: string;
    tags?: string[];
  }): Promise<Guide[]> {
    try {
      const response = await axios.get<Guide[]>(`${this.baseUrl}/guides`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to list guides:', error);
      throw error;
    }
  }

  // Code Examples
  async getCodeExamples(language: string): Promise<Array<{
    title: string;
    description: string;
    code: string;
    language: string;
    tags: string[];
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/examples`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get code examples:', error);
      throw error;
    }
  }

  // Best Practices
  async getBestPractices(): Promise<Array<{
    category: string;
    title: string;
    description: string;
    recommendations: Array<{
      title: string;
      description: string;
      example?: string;
      importance: 'critical' | 'recommended' | 'optional';
    }>;
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/best-practices`);
      return response.data;
    } catch (error) {
      console.error('Failed to get best practices:', error);
      throw error;
    }
  }

  // Troubleshooting
  async getTroubleshootingGuides(): Promise<Array<{
    problem: string;
    symptoms: string[];
    causes: Array<{
      description: string;
      likelihood: 'high' | 'medium' | 'low';
    }>;
    solutions: Array<{
      steps: string[];
      code?: string;
      notes?: string;
    }>;
    preventionTips?: string[];
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/troubleshooting`);
      return response.data;
    } catch (error) {
      console.error('Failed to get troubleshooting guides:', error);
      throw error;
    }
  }

  // Documentation Export
  async exportDocumentation(options: {
    format: 'pdf' | 'html' | 'markdown';
    sections?: string[];
    includeExamples?: boolean;
  }): Promise<{
    url: string;
    expiresAt: Date;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/export`, options);
      return response.data;
    } catch (error) {
      console.error('Failed to export documentation:', error);
      throw error;
    }
  }
}

export const notificationDocumentationService = new NotificationDocumentationService(); 