import { FinancialData, ProfitabilityData, RevenueData, ExpenseData } from '../types/financial';

export class FinancialsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '';
  }

  async getProfitabilityData(timeRange: string): Promise<ProfitabilityData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/financials/profitability?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profitability data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profitability data:', error);
      throw error;
    }
  }

  async getRevenueData(timeRange: string): Promise<RevenueData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/financials/revenue?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }

  async getExpenseData(timeRange: string): Promise<ExpenseData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/financials/expenses?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expense data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching expense data:', error);
      throw error;
    }
  }

  async getFinancialMetrics(): Promise<FinancialData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/financials/metrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch financial metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw error;
    }
  }
} 