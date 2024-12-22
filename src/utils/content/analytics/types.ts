export interface ContentAnalytics {
  id: string;
  contentId: string;
  views: number;
  uniqueViews: number;
  averageTimeOnPage: number;
  bounceRate: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  conversion: {
    clicks: number;
    conversions: number;
    rate: number;
  };
  timestamp: number;
}

export interface ContentPerformance {
  daily: ContentAnalytics[];
  weekly: ContentAnalytics[];
  monthly: ContentAnalytics[];
  total: ContentAnalytics;
}