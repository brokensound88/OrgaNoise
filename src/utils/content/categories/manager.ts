import { Category, CategoryStats, CategoryAnalytics } from './types';
import { ContentItem } from '../types';

export class CategoryManager {
  private categories: Map<string, Category> = new Map();
  private contentCategories: Map<string, Set<string>> = new Map();

  createCategory(category: Omit<Category, 'slug'>): Category {
    const slug = this.generateSlug(category.name);
    const newCategory: Category = { ...category, slug };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  assignContentToCategory(contentId: string, categoryId: string): void {
    if (!this.contentCategories.has(categoryId)) {
      this.contentCategories.set(categoryId, new Set());
    }
    this.contentCategories.get(categoryId)?.add(contentId);
  }

  getCategoryStats(categoryId: string): CategoryStats {
    const contentIds = this.contentCategories.get(categoryId) || new Set();
    
    return {
      totalItems: contentIds.size,
      publishedItems: 0, // To be implemented with actual content status
      draftItems: 0,
      scheduledItems: 0,
      lastUpdated: Date.now()
    };
  }

  getContentByCategory(categoryId: string): Set<string> {
    return this.contentCategories.get(categoryId) || new Set();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  listCategories(): Category[] {
    return Array.from(this.categories.values());
  }
}

export const categoryManager = new CategoryManager();