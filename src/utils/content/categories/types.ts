import { ContentItem } from '../types';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  metadata?: Record<string, any>;
}

export interface CategoryStats {
  totalItems: number;
  publishedItems: number;
  draftItems: number;
  scheduledItems: number;
  lastUpdated: number;
}

export interface CategoryAnalytics {
  category: Category;
  stats: CategoryStats;
  trending: ContentItem[];
  performance: {
    views: number;
    engagement: number;
    conversion: number;
  };
}