export interface PerformanceBudget {
  id: string;
  name: string;
  metrics: {
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    firstInputDelay?: number;
    cumulativeLayoutShift?: number;
    totalBlockingTime?: number;
    speedIndex?: number;
    bundleSize?: number;
    imageSize?: number;
    fontSize?: number;
  };
  thresholds: {
    warning: number;
    error: number;
  };
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  status: 'success' | 'warning' | 'error';
}

export interface PerformanceReport {
  id: string;
  budgetId: string;
  metrics: PerformanceMetric[];
  timestamp: number;
  score: number;
}