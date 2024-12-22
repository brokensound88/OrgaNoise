export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  siteId?: string;
  debug?: boolean;
}

export interface AnalyticsProvider {
  initialize: (config: AnalyticsConfig) => void;
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (path: string) => void;
  trackError: (error: Error) => void;
}