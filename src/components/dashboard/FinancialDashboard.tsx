import React, { useState, useEffect } from 'react';
import ProfitabilityChart from '../charts/ProfitabilityChart';
import { FinancialsService } from '../../services/financials';
import { FinancialData, TimeRange } from '../../types/financial';

const FinancialDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [metrics, setMetrics] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const financialsService = new FinancialsService();
        const data = await financialsService.getFinancialMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch financial metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Financial Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {metrics ? formatCurrency(metrics.totalRevenue) : '-'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {metrics ? formatCurrency(metrics.totalExpenses) : '-'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Net Profit</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {metrics ? formatCurrency(metrics.netProfit) : '-'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Profit Margin</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {metrics ? formatPercentage(metrics.profitMargin) : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profitability Trends</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <ProfitabilityChart timeRange={timeRange} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Additional Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Cash Flow</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {metrics ? formatCurrency(metrics.cashFlow) : '-'}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Last Updated</h3>
            <p className="mt-2 text-gray-600">
              {metrics ? new Date(metrics.lastUpdated).toLocaleString() : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard; 