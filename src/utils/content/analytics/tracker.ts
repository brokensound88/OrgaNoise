import { ContentAnalytics, ContentPerformance } from './types';

export class ContentAnalyticsTracker {
  private analytics: Map<string, ContentAnalytics[]> = new Map();

  trackView(contentId: string, isUnique: boolean = false): void {
    const entry = this.getOrCreateAnalytics(contentId);
    entry.views++;
    if (isUnique) entry.uniqueViews++;
    this.updateAnalytics(contentId, entry);
  }

  trackEngagement(contentId: string, type: 'like' | 'share' | 'comment'): void {
    const entry = this.getOrCreateAnalytics(contentId);
    entry.engagement[`${type}s`]++;
    this.updateAnalytics(contentId, entry);
  }

  trackConversion(contentId: string, converted: boolean = false): void {
    const entry = this.getOrCreateAnalytics(contentId);
    entry.conversion.clicks++;
    if (converted) {
      entry.conversion.conversions++;
      entry.conversion.rate = entry.conversion.conversions / entry.conversion.clicks;
    }
    this.updateAnalytics(contentId, entry);
  }

  getPerformance(contentId: string): ContentPerformance {
    const analytics = this.analytics.get(contentId) || [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;
    const monthMs = 30 * dayMs;

    return {
      daily: analytics.filter(a => now - a.timestamp < dayMs),
      weekly: analytics.filter(a => now - a.timestamp < weekMs),
      monthly: analytics.filter(a => now - a.timestamp < monthMs),
      total: this.aggregateAnalytics(analytics)
    };
  }

  private getOrCreateAnalytics(contentId: string): ContentAnalytics {
    return {
      id: crypto.randomUUID(),
      contentId,
      views: 0,
      uniqueViews: 0,
      averageTimeOnPage: 0,
      bounceRate: 0,
      engagement: { likes: 0, shares: 0, comments: 0 },
      conversion: { clicks: 0, conversions: 0, rate: 0 },
      timestamp: Date.now()
    };
  }

  private updateAnalytics(contentId: string, entry: ContentAnalytics): void {
    if (!this.analytics.has(contentId)) {
      this.analytics.set(contentId, []);
    }
    this.analytics.get(contentId)?.push(entry);
  }

  private aggregateAnalytics(analytics: ContentAnalytics[]): ContentAnalytics {
    return analytics.reduce((acc, curr) => ({
      ...curr,
      views: acc.views + curr.views,
      uniqueViews: acc.uniqueViews + curr.uniqueViews,
      averageTimeOnPage: (acc.averageTimeOnPage + curr.averageTimeOnPage) / 2,
      bounceRate: (acc.bounceRate + curr.bounceRate) / 2,
      engagement: {
        likes: acc.engagement.likes + curr.engagement.likes,
        shares: acc.engagement.shares + curr.engagement.shares,
        comments: acc.engagement.comments + curr.engagement.comments
      },
      conversion: {
        clicks: acc.conversion.clicks + curr.conversion.clicks,
        conversions: acc.conversion.conversions + curr.conversion.conversions,
        rate: acc.conversion.conversions / acc.conversion.clicks || 0
      }
    }), this.getOrCreateAnalytics('total'));
  }
}

export const contentAnalyticsTracker = new ContentAnalyticsTracker();