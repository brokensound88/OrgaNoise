export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  imageUrl?: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}