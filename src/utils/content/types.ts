export interface ContentVersion {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  changes?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'post' | 'product';
  status: 'draft' | 'scheduled' | 'published';
  author: string;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
  scheduledAt?: number;
  versions: ContentVersion[];
  tags: string[];
  metadata: Record<string, any>;
}

export interface ContentTemplate {
  id: string;
  name: string;
  structure: Record<string, any>;
  defaultMetadata: Record<string, any>;
}

export interface ContentSearchOptions {
  query?: string;
  type?: string;
  status?: string;
  author?: string;
  tags?: string[];
  startDate?: number;
  endDate?: number;
}