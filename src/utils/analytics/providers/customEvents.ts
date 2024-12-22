import { AnalyticsProvider, AnalyticsConfig, AnalyticsEvent } from '../types';

export class CustomEventsProvider implements AnalyticsProvider {
  private events: AnalyticsEvent[] = [];
  private config: AnalyticsConfig | null = null;

  initialize(config: AnalyticsConfig) {
    this.config = config;
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.config?.enabled) return;
    
    this.events.push({
      ...event,
      timestamp: Date.now()
    });

    if (this.config.debug) {
      console.log('Custom Event:', event);
    }
  }

  trackPageView(path: string) {
    this.trackEvent({
      name: 'page_view',
      properties: { path }
    });
  }

  trackError(error: Error) {
    this.trackEvent({
      name: 'error',
      properties: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }

  getEvents() {
    return this.events;
  }
}