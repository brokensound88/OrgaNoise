import { AnalyticsProvider, AnalyticsConfig, AnalyticsEvent } from './types';
import { GoogleAnalyticsProvider } from './providers/googleAnalytics';
import { CustomEventsProvider } from './providers/customEvents';

class Analytics {
  private providers: AnalyticsProvider[] = [];
  private initialized = false;

  initialize(config: AnalyticsConfig) {
    if (this.initialized) return;

    const providers = [
      new GoogleAnalyticsProvider(),
      new CustomEventsProvider()
    ];

    providers.forEach(provider => {
      provider.initialize(config);
      this.providers.push(provider);
    });

    this.initialized = true;
  }

  trackEvent(event: AnalyticsEvent) {
    this.providers.forEach(provider => provider.trackEvent(event));
  }

  trackPageView(path: string) {
    this.providers.forEach(provider => provider.trackPageView(path));
  }

  trackError(error: Error) {
    this.providers.forEach(provider => provider.trackError(error));
  }
}

export const analytics = new Analytics();