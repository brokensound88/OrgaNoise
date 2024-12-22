import { Revenue, RevenueMetrics } from './types';

export class RevenueTracker {
  private transactions: Revenue[] = [];

  trackRevenue(transaction: Revenue): void {
    this.transactions.push({
      ...transaction,
      timestamp: transaction.timestamp || Date.now()
    });
  }

  getMetrics(startDate?: number, endDate?: number): RevenueMetrics {
    const filteredTransactions = this.transactions.filter(t => 
      (!startDate || t.timestamp >= startDate) &&
      (!endDate || t.timestamp <= endDate)
    );

    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageOrderValue = totalRevenue / filteredTransactions.length || 0;

    const revenueBySource = filteredTransactions.reduce((acc, t) => ({
      ...acc,
      [t.source]: (acc[t.source] || 0) + t.amount
    }), {} as Record<string, number>);

    return {
      totalRevenue,
      averageOrderValue,
      conversionRate: this.calculateConversionRate(),
      revenueBySource
    };
  }

  private calculateConversionRate(): number {
    // Simulate conversion rate calculation
    return Math.random() * 100;
  }
}

export const revenueTracker = new RevenueTracker();