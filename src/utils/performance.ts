import { performance, PerformanceObserver } from 'perf_hooks';

interface PerformanceMetrics {
  renderTime: number;
  interactionTime: number;
  loadTime: number;
  memoryUsage: number;
  apiLatency: number;
}

interface PerformanceConfig {
  enableLogging?: boolean;
  sampleRate?: number;
  threshold?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    interactionTime: 0,
    loadTime: 0,
    memoryUsage: 0,
    apiLatency: 0
  };

  private config: Required<PerformanceConfig> = {
    enableLogging: true,
    sampleRate: 0.1,
    threshold: 100
  };

  constructor(config?: PerformanceConfig) {
    this.config = { ...this.config, ...config };
    this.setupObserver();
  }

  private setupObserver(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processEntry(entry);
      }
    });

    observer.observe({ entryTypes: ['measure', 'paint', 'navigation'] });
  }

  private processEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'measure':
        this.processMeasure(entry);
        break;
      case 'paint':
        this.processPaint(entry);
        break;
      case 'navigation':
        this.processNavigation(entry);
        break;
    }
  }

  private processMeasure(entry: PerformanceEntry): void {
    if (entry.name.startsWith('render')) {
      this.metrics.renderTime = entry.duration;
    } else if (entry.name.startsWith('interaction')) {
      this.metrics.interactionTime = entry.duration;
    }

    this.logMetric(entry.name, entry.duration);
  }

  private processPaint(entry: PerformanceEntry): void {
    if (entry.name === 'first-contentful-paint') {
      this.metrics.loadTime = entry.startTime;
      this.logMetric('FCP', entry.startTime);
    }
  }

  private processNavigation(entry: PerformanceEntry): void {
    if (entry instanceof PerformanceNavigationTiming) {
      this.metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
      this.logMetric('Page Load', this.metrics.loadTime);
    }
  }

  public measureRender(name: string, callback: () => void): void {
    performance.mark(`${name}-start`);
    callback();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  public measureApi(name: string, promise: Promise<unknown>): Promise<unknown> {
    const startTime = performance.now();
    
    return promise.finally(() => {
      const duration = performance.now() - startTime;
      this.metrics.apiLatency = duration;
      this.logMetric(`API-${name}`, duration);
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  private logMetric(name: string, value: number): void {
    if (!this.config.enableLogging) return;
    if (Math.random() > this.config.sampleRate) return;
    if (value < this.config.threshold) return;

    console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
  }

  public clearMetrics(): void {
    performance.clearMarks();
    performance.clearMeasures();
    this.metrics = {
      renderTime: 0,
      interactionTime: 0,
      loadTime: 0,
      memoryUsage: 0,
      apiLatency: 0
    };
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor({
  enableLogging: process.env.NODE_ENV === 'development',
  sampleRate: 0.1,
  threshold: 100
});

// Usage example:
/*
import { performanceMonitor } from '@/utils/performance';

// Measure render time
performanceMonitor.measureRender('ProfileSections', () => {
  // Render logic
});

// Measure API calls
await performanceMonitor.measureApi('updateSection', api.updateSection(data));

// Get metrics
const metrics = performanceMonitor.getMetrics();
console.log('Current performance:', metrics);
*/ 