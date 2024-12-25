export interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: number;
  lastUpdated: string;
}

export interface ProfitabilityData {
  date: string;
  profit: number;
  margin: number;
  growth: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  source: string;
  category: string;
}

export interface ExpenseData {
  date: string;
  amount: number;
  category: string;
  description: string;
}

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all'; 