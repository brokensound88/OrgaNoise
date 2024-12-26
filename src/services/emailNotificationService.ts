import axios from 'axios';
import { NotificationEvent } from './notificationService';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  htmlBody: string;
  plainTextBody: string;
  variables: string[];
  category: EmailCategory;
  createdAt: Date;
  updatedAt: Date;
}

export type EmailCategory =
  | 'welcome'
  | 'verification'
  | 'reset_password'
  | 'notification'
  | 'marketing'
  | 'system';

export interface EmailNotification {
  id: string;
  templateId: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  htmlContent: string;
  plainTextContent: string;
  variables: Record<string, string>;
  status: 'queued' | 'sent' | 'failed';
  error?: string;
  sentAt?: Date;
  createdAt: Date;
}

class EmailNotificationService {
  private baseUrl = '/api/email-notifications';
  private templates: Map<string, EmailTemplate> = new Map();

  // Template Management
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    try {
      const response = await axios.post<EmailTemplate>(`${this.baseUrl}/templates`, template);
      const newTemplate = response.data;
      this.templates.set(newTemplate.id, newTemplate);
      return newTemplate;
    } catch (error) {
      console.error('Failed to create email template:', error);
      throw error;
    }
  }

  async getTemplate(templateId: string): Promise<EmailTemplate> {
    try {
      // Check cache first
      const cachedTemplate = this.templates.get(templateId);
      if (cachedTemplate) {
        return cachedTemplate;
      }

      const response = await axios.get<EmailTemplate>(`${this.baseUrl}/templates/${templateId}`);
      const template = response.data;
      this.templates.set(template.id, template);
      return template;
    } catch (error) {
      console.error('Failed to get email template:', error);
      throw error;
    }
  }

  async updateTemplate(templateId: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    try {
      const response = await axios.patch<EmailTemplate>(
        `${this.baseUrl}/templates/${templateId}`,
        updates
      );
      const updatedTemplate = response.data;
      this.templates.set(updatedTemplate.id, updatedTemplate);
      return updatedTemplate;
    } catch (error) {
      console.error('Failed to update email template:', error);
      throw error;
    }
  }

  async deleteTemplate(templateId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/templates/${templateId}`);
      this.templates.delete(templateId);
    } catch (error) {
      console.error('Failed to delete email template:', error);
      throw error;
    }
  }

  // Email Sending
  async sendEmail(notification: Omit<EmailNotification, 'id' | 'status' | 'createdAt' | 'sentAt'>): Promise<EmailNotification> {
    try {
      const response = await axios.post<EmailNotification>(`${this.baseUrl}/send`, notification);
      return response.data;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendBulkEmails(notifications: Array<Omit<EmailNotification, 'id' | 'status' | 'createdAt' | 'sentAt'>>): Promise<EmailNotification[]> {
    try {
      const response = await axios.post<EmailNotification[]>(`${this.baseUrl}/send-bulk`, {
        notifications
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send bulk emails:', error);
      throw error;
    }
  }

  // Template Processing
  async processTemplate(templateId: string, variables: Record<string, string>): Promise<{
    subject: string;
    htmlContent: string;
    plainTextContent: string;
  }> {
    try {
      const response = await axios.post<{
        subject: string;
        htmlContent: string;
        plainTextContent: string;
      }>(`${this.baseUrl}/templates/${templateId}/process`, { variables });
      return response.data;
    } catch (error) {
      console.error('Failed to process email template:', error);
      throw error;
    }
  }

  // Notification Event Handler
  async handleNotificationEvent(event: NotificationEvent): Promise<void> {
    if (event.data?.emailNotification) {
      try {
        const template = await this.getTemplate(event.data.emailNotification.templateId as string);
        const processed = await this.processTemplate(template.id, event.data.emailNotification.variables as Record<string, string>);
        
        await this.sendEmail({
          templateId: template.id,
          recipientEmail: event.data.emailNotification.recipientEmail as string,
          recipientName: event.data.emailNotification.recipientName as string,
          subject: processed.subject,
          htmlContent: processed.htmlContent,
          plainTextContent: processed.plainTextContent,
          variables: event.data.emailNotification.variables as Record<string, string>
        });
      } catch (error) {
        console.error('Failed to handle notification event:', error);
        throw error;
      }
    }
  }

  // Analytics
  async getEmailStats(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    total: number;
    sent: number;
    failed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }> {
    try {
      const response = await axios.get<{
        total: number;
        sent: number;
        failed: number;
        openRate: number;
        clickRate: number;
        bounceRate: number;
      }>(`${this.baseUrl}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get email stats:', error);
      throw error;
    }
  }

  // Template Preview
  async previewTemplate(templateId: string, variables: Record<string, string>): Promise<{
    subject: string;
    htmlPreview: string;
    plainTextPreview: string;
  }> {
    try {
      const response = await axios.post<{
        subject: string;
        htmlPreview: string;
        plainTextPreview: string;
      }>(`${this.baseUrl}/templates/${templateId}/preview`, { variables });
      return response.data;
    } catch (error) {
      console.error('Failed to preview email template:', error);
      throw error;
    }
  }
}

export const emailNotificationService = new EmailNotificationService(); 