import axios from 'axios';

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'push' | 'in_app';
  subject?: string; // For email templates
  content: {
    html?: string; // For email templates
    text: string;
    variables: {
      name: string;
      description: string;
      defaultValue?: string;
      required: boolean;
      type: 'string' | 'number' | 'boolean' | 'date' | 'object';
      validation?: {
        pattern?: string;
        min?: number;
        max?: number;
        options?: string[];
      };
    }[];
  };
  locales: {
    [locale: string]: {
      subject?: string;
      html?: string;
      text: string;
    };
  };
  metadata?: Record<string, unknown>;
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplatePreview {
  subject?: string;
  html?: string;
  text: string;
}

export class NotificationTemplateService {
  private baseUrl = '/api/notifications/templates';

  // Template Management
  async createTemplate(template: Omit<NotificationTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    try {
      const response = await axios.post<NotificationTemplate>(this.baseUrl, template);
      return response.data;
    } catch (error) {
      console.error('Failed to create notification template:', error);
      throw error;
    }
  }

  async updateTemplate(
    templateId: string,
    updates: Partial<Omit<NotificationTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt'>>
  ): Promise<NotificationTemplate> {
    try {
      const response = await axios.put<NotificationTemplate>(`${this.baseUrl}/${templateId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update notification template:', error);
      throw error;
    }
  }

  async getTemplate(templateId: string, version?: number): Promise<NotificationTemplate> {
    try {
      const response = await axios.get<NotificationTemplate>(`${this.baseUrl}/${templateId}`, {
        params: { version }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get notification template:', error);
      throw error;
    }
  }

  async getAllTemplates(type?: NotificationTemplate['type']): Promise<NotificationTemplate[]> {
    try {
      const response = await axios.get<NotificationTemplate[]>(this.baseUrl, {
        params: { type }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get notification templates:', error);
      throw error;
    }
  }

  async deleteTemplate(templateId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${templateId}`);
    } catch (error) {
      console.error('Failed to delete notification template:', error);
      throw error;
    }
  }

  // Template Versioning
  async getTemplateVersions(templateId: string): Promise<NotificationTemplate[]> {
    try {
      const response = await axios.get<NotificationTemplate[]>(`${this.baseUrl}/${templateId}/versions`);
      return response.data;
    } catch (error) {
      console.error('Failed to get template versions:', error);
      throw error;
    }
  }

  async revertToVersion(templateId: string, version: number): Promise<NotificationTemplate> {
    try {
      const response = await axios.post<NotificationTemplate>(`${this.baseUrl}/${templateId}/revert`, { version });
      return response.data;
    } catch (error) {
      console.error('Failed to revert template version:', error);
      throw error;
    }
  }

  // Template Preview
  async previewTemplate(
    templateId: string,
    variables: Record<string, unknown>,
    locale?: string
  ): Promise<TemplatePreview> {
    try {
      const response = await axios.post<TemplatePreview>(`${this.baseUrl}/${templateId}/preview`, {
        variables,
        locale
      });
      return response.data;
    } catch (error) {
      console.error('Failed to preview template:', error);
      throw error;
    }
  }

  // Template Localization
  async addLocale(templateId: string, locale: string, content: NotificationTemplate['locales'][string]): Promise<NotificationTemplate> {
    try {
      const response = await axios.post<NotificationTemplate>(`${this.baseUrl}/${templateId}/locales/${locale}`, content);
      return response.data;
    } catch (error) {
      console.error('Failed to add template locale:', error);
      throw error;
    }
  }

  async updateLocale(templateId: string, locale: string, content: Partial<NotificationTemplate['locales'][string]>): Promise<NotificationTemplate> {
    try {
      const response = await axios.put<NotificationTemplate>(`${this.baseUrl}/${templateId}/locales/${locale}`, content);
      return response.data;
    } catch (error) {
      console.error('Failed to update template locale:', error);
      throw error;
    }
  }

  async deleteLocale(templateId: string, locale: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${templateId}/locales/${locale}`);
    } catch (error) {
      console.error('Failed to delete template locale:', error);
      throw error;
    }
  }

  // Template Validation
  async validateTemplate(templateId: string): Promise<{
    isValid: boolean;
    errors?: {
      field: string;
      message: string;
    }[];
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/${templateId}/validate`);
      return response.data;
    } catch (error) {
      console.error('Failed to validate template:', error);
      throw error;
    }
  }
}

export const notificationTemplateService = new NotificationTemplateService(); 