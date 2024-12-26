import axios from 'axios';

export interface ProfileTemplate {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  isPublic: boolean;
  layout: {
    sections: {
      id: string;
      type: string;
      title: string;
      order: number;
      isRequired: boolean;
      settings: Record<string, unknown>;
    }[];
    theme: {
      colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
      };
      fonts: {
        heading: string;
        body: string;
      };
      spacing: {
        section: string;
        element: string;
      };
    };
    customCSS?: string;
  };
  metadata: {
    tags: string[];
    category: string;
    industry?: string;
    role?: string;
  };
  stats: {
    uses: number;
    rating: number;
    reviews: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateFilter {
  category?: string;
  industry?: string;
  role?: string;
  tags?: string[];
  sortBy?: 'popular' | 'rating' | 'newest';
  isPublic?: boolean;
  createdBy?: string;
}

class ProfileTemplatesService {
  private baseUrl = '/api/profile-templates';

  // Get available templates
  async getTemplates(filters?: TemplateFilter): Promise<ProfileTemplate[]> {
    try {
      const response = await axios.get<ProfileTemplate[]>(this.baseUrl, {
        params: filters,
      });
      return response.data.map(template => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to get templates:', error);
      throw error;
    }
  }

  // Get template by ID
  async getTemplate(templateId: string): Promise<ProfileTemplate> {
    try {
      const response = await axios.get<ProfileTemplate>(`${this.baseUrl}/${templateId}`);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to get template:', error);
      throw error;
    }
  }

  // Create new template
  async createTemplate(template: Omit<ProfileTemplate, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<ProfileTemplate> {
    try {
      const response = await axios.post<ProfileTemplate>(this.baseUrl, template);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  }

  // Update template
  async updateTemplate(
    templateId: string,
    updates: Partial<Omit<ProfileTemplate, 'id' | 'stats' | 'createdAt' | 'updatedAt'>>
  ): Promise<ProfileTemplate> {
    try {
      const response = await axios.put<ProfileTemplate>(`${this.baseUrl}/${templateId}`, updates);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update template:', error);
      throw error;
    }
  }

  // Delete template
  async deleteTemplate(templateId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${templateId}`);
    } catch (error) {
      console.error('Failed to delete template:', error);
      throw error;
    }
  }

  // Apply template to profile
  async applyTemplate(userId: string, templateId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${templateId}/apply`, { userId });
    } catch (error) {
      console.error('Failed to apply template:', error);
      throw error;
    }
  }

  // Rate template
  async rateTemplate(templateId: string, rating: number): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${templateId}/rate`, { rating });
    } catch (error) {
      console.error('Failed to rate template:', error);
      throw error;
    }
  }

  // Share template
  async shareTemplate(templateId: string, targetUserId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${templateId}/share`, { targetUserId });
    } catch (error) {
      console.error('Failed to share template:', error);
      throw error;
    }
  }

  // Get template categories
  async getCategories(): Promise<{
    categories: string[];
    industries: string[];
    roles: string[];
    popularTags: string[];
  }> {
    try {
      const response = await axios.get<{
        categories: string[];
        industries: string[];
        roles: string[];
        popularTags: string[];
      }>(`${this.baseUrl}/categories`);
      return response.data;
    } catch (error) {
      console.error('Failed to get template categories:', error);
      throw error;
    }
  }

  // Clone template
  async cloneTemplate(templateId: string, modifications?: {
    name?: string;
    isPublic?: boolean;
  }): Promise<ProfileTemplate> {
    try {
      const response = await axios.post<ProfileTemplate>(`${this.baseUrl}/${templateId}/clone`, modifications);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to clone template:', error);
      throw error;
    }
  }
}

export const profileTemplatesService = new ProfileTemplatesService(); 