import axios from 'axios';

export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  priority: 'low' | 'medium' | 'high';
  isSystem: boolean; // true for system-defined categories
  metadata?: Record<string, unknown>;
  parentId?: string; // for hierarchical categories
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFilter {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
    value: unknown;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationCategoryService {
  private baseUrl = '/api/notifications/categories';

  // Category Management
  async createCategory(category: Omit<NotificationCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationCategory> {
    try {
      const response = await axios.post<NotificationCategory>(this.baseUrl, category);
      return response.data;
    } catch (error) {
      console.error('Failed to create notification category:', error);
      throw error;
    }
  }

  async updateCategory(
    categoryId: string,
    updates: Partial<Omit<NotificationCategory, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<NotificationCategory> {
    try {
      const response = await axios.put<NotificationCategory>(`${this.baseUrl}/${categoryId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update notification category:', error);
      throw error;
    }
  }

  async getCategory(categoryId: string): Promise<NotificationCategory> {
    try {
      const response = await axios.get<NotificationCategory>(`${this.baseUrl}/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notification category:', error);
      throw error;
    }
  }

  async getAllCategories(includeSystem = true): Promise<NotificationCategory[]> {
    try {
      const response = await axios.get<NotificationCategory[]>(this.baseUrl, {
        params: { includeSystem }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get notification categories:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${categoryId}`);
    } catch (error) {
      console.error('Failed to delete notification category:', error);
      throw error;
    }
  }

  async reorderCategories(categoryIds: string[]): Promise<NotificationCategory[]> {
    try {
      const response = await axios.put<NotificationCategory[]>(`${this.baseUrl}/reorder`, { categoryIds });
      return response.data;
    } catch (error) {
      console.error('Failed to reorder notification categories:', error);
      throw error;
    }
  }

  // Category Filters
  async createFilter(filter: Omit<CategoryFilter, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoryFilter> {
    try {
      const response = await axios.post<CategoryFilter>(`${this.baseUrl}/filters`, filter);
      return response.data;
    } catch (error) {
      console.error('Failed to create category filter:', error);
      throw error;
    }
  }

  async updateFilter(
    filterId: string,
    updates: Partial<Omit<CategoryFilter, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<CategoryFilter> {
    try {
      const response = await axios.put<CategoryFilter>(`${this.baseUrl}/filters/${filterId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update category filter:', error);
      throw error;
    }
  }

  async getFilters(categoryId: string): Promise<CategoryFilter[]> {
    try {
      const response = await axios.get<CategoryFilter[]>(`${this.baseUrl}/${categoryId}/filters`);
      return response.data;
    } catch (error) {
      console.error('Failed to get category filters:', error);
      throw error;
    }
  }

  async deleteFilter(filterId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/filters/${filterId}`);
    } catch (error) {
      console.error('Failed to delete category filter:', error);
      throw error;
    }
  }

  // Priority Management
  async updatePriority(categoryId: string, priority: NotificationCategory['priority']): Promise<NotificationCategory> {
    try {
      const response = await axios.put<NotificationCategory>(`${this.baseUrl}/${categoryId}/priority`, { priority });
      return response.data;
    } catch (error) {
      console.error('Failed to update category priority:', error);
      throw error;
    }
  }

  async getCategoriesByPriority(priority: NotificationCategory['priority']): Promise<NotificationCategory[]> {
    try {
      const response = await axios.get<NotificationCategory[]>(`${this.baseUrl}/priority/${priority}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get categories by priority:', error);
      throw error;
    }
  }

  // Category Hierarchy
  async getSubcategories(parentId: string): Promise<NotificationCategory[]> {
    try {
      const response = await axios.get<NotificationCategory[]>(`${this.baseUrl}/${parentId}/subcategories`);
      return response.data;
    } catch (error) {
      console.error('Failed to get subcategories:', error);
      throw error;
    }
  }

  async moveCategory(categoryId: string, newParentId?: string): Promise<NotificationCategory> {
    try {
      const response = await axios.put<NotificationCategory>(`${this.baseUrl}/${categoryId}/move`, { parentId: newParentId });
      return response.data;
    } catch (error) {
      console.error('Failed to move category:', error);
      throw error;
    }
  }
}

export const notificationCategoryService = new NotificationCategoryService(); 