export interface Revenue {
  id: string;
  amount: number;
  currency: string;
  timestamp: number;
  source: string;
  customerId?: string;
  metadata?: Record<string, any>;
}

export interface RevenueMetrics {
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueBySource: Record<string, number>;
}

export interface ConversionGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  type: 'revenue' | 'conversion' | 'engagement';
}