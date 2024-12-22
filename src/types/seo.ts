export interface MetaData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export interface StructuredData {
  type: string;
  data: Record<string, any>;
}