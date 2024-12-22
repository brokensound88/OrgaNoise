import { AnalyticsProvider, AnalyticsConfig, AnalyticsEvent } from '../types';

export class GoogleAnalyticsProvider implements AnalyticsProvider {
  private initialized = false;

  initialize(config: AnalyticsConfig) {
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.siteId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.siteId);

    this.initialized = true;
  }

  trackEvent({ name, properties }: AnalyticsEvent) {
    if (!this.initialized) return;
    window.gtag('event', name, properties);
  }

  trackPageView(path: string) {
    if (!this.initialized) return;
    window.gtag('config', window.GA_MEASUREMENT_ID, { page_path: path });
  }

  trackError(error: Error) {
    if (!this.initialized) return;
    window.gtag('event', 'error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack
    });
  }
}