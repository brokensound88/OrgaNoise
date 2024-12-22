import { useState, useEffect } from 'react';
import { Category, CategoryAnalytics } from '../utils/content/categories/types';
import { categoryManager } from '../utils/content/categories/manager';
import { contentAnalyticsTracker } from '../utils/content/analytics/tracker';

export function useContentCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(categoryManager.listCategories());
  }, []);

  const createCategory = (category: Omit<Category, 'slug'>) => {
    const newCategory = categoryManager.createCategory(category);
    setCategories(categoryManager.listCategories());
    return newCategory;
  };

  const assignContent = (contentId: string, categoryId: string) => {
    categoryManager.assignContentToCategory(contentId, categoryId);
  };

  const getCategoryAnalytics = (categoryId: string): CategoryAnalytics => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) throw new Error(`Category ${categoryId} not found`);

    const contentIds = categoryManager.getContentByCategory(categoryId);
    const stats = categoryManager.getCategoryStats(categoryId);
    
    const performance = Array.from(contentIds).reduce((acc, contentId) => {
      const analytics = contentAnalyticsTracker.getPerformance(contentId).total;
      return {
        views: acc.views + analytics.views,
        engagement: acc.engagement + (
          analytics.engagement.likes + 
          analytics.engagement.shares + 
          analytics.engagement.comments
        ),
        conversion: acc.conversion + analytics.conversion.rate
      };
    }, { views: 0, engagement: 0, conversion: 0 });

    return {
      category,
      stats,
      trending: [], // To be implemented with actual trending algorithm
      performance
    };
  };

  return {
    categories,
    createCategory,
    assignContent,
    getCategoryAnalytics
  };
}