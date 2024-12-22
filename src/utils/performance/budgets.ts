import { PerformanceBudget, PerformanceReport, PerformanceMetric } from './types';

export class PerformanceBudgetManager {
  private budgets: Map<string, PerformanceBudget> = new Map();
  private reports: Map<string, PerformanceReport[]> = new Map();

  createBudget(budget: Omit<PerformanceBudget, 'id'>): PerformanceBudget {
    const id = crypto.randomUUID();
    const newBudget: PerformanceBudget = { ...budget, id };
    this.budgets.set(id, newBudget);
    return newBudget;
  }

  checkMetrics(budgetId: string, metrics: Record<string, number>): PerformanceReport {
    const budget = this.budgets.get(budgetId);
    if (!budget) throw new Error(`Budget ${budgetId} not found`);

    const performanceMetrics: PerformanceMetric[] = Object.entries(metrics)
      .filter(([name]) => name in budget.metrics)
      .map(([name, value]) => {
        const threshold = budget.metrics[name as keyof typeof budget.metrics];
        const status = this.getMetricStatus(value, threshold!, budget.thresholds);
        return { name, value, timestamp: Date.now(), status };
      });

    const report: PerformanceReport = {
      id: crypto.randomUUID(),
      budgetId,
      metrics: performanceMetrics,
      timestamp: Date.now(),
      score: this.calculateScore(performanceMetrics)
    };

    if (!this.reports.has(budgetId)) {
      this.reports.set(budgetId, []);
    }
    this.reports.get(budgetId)?.push(report);

    return report;
  }

  private getMetricStatus(
    value: number,
    threshold: number,
    thresholds: PerformanceBudget['thresholds']
  ): PerformanceMetric['status'] {
    if (value <= threshold) return 'success';
    if (value <= threshold * (1 + thresholds.warning)) return 'warning';
    return 'error';
  }

  private calculateScore(metrics: PerformanceMetric[]): number {
    const weights = {
      firstContentfulPaint: 0.15,
      largestContentfulPaint: 0.25,
      firstInputDelay: 0.2,
      cumulativeLayoutShift: 0.15,
      totalBlockingTime: 0.15,
      speedIndex: 0.1
    };

    return metrics.reduce((score, metric) => {
      const weight = weights[metric.name as keyof typeof weights] || 0;
      const metricScore = metric.status === 'success' ? 1 :
                         metric.status === 'warning' ? 0.5 : 0;
      return score + (metricScore * weight);
    }, 0) * 100;
  }

  getBudget(id: string): PerformanceBudget | undefined {
    return this.budgets.get(id);
  }

  getReports(budgetId: string): PerformanceReport[] {
    return this.reports.get(budgetId) || [];
  }

  listBudgets(): PerformanceBudget[] {
    return Array.from(this.budgets.values());
  }
}

export const performanceBudgetManager = new PerformanceBudgetManager();