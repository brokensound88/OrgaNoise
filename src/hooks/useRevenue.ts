import { useState, useEffect } from 'react';
import { Revenue, RevenueMetrics } from '../utils/analytics/revenue/types';
import { revenueTracker } from '../utils/analytics/revenue/tracker';

export function useRevenue() {
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    revenueBySource: {}
  });

  useEffect(() => {
    updateMetrics();
  }, []);

  const trackRevenue = (transaction: Revenue) => {
    revenueTracker.trackRevenue(transaction);
    updateMetrics();
  };

  const updateMetrics = () => {
    setMetrics(revenueTracker.getMetrics());
  };

  return {
    metrics,
    trackRevenue
  };
}