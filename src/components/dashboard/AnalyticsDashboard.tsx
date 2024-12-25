import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../../services/analytics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Import interfaces from analytics service
interface UserActivity {
  userId: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
}

interface PageView {
  path: string;
  views: number;
  uniqueVisitors: number;
  averageTimeSpent: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  activeUsers: number;
  lastUpdated: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const analyticsService = new AnalyticsService();

        const [activityData, viewsData, metricsData] = await Promise.all([
          analyticsService.getUserActivity(timeRange),
          analyticsService.getPageViews(timeRange),
          analyticsService.getSystemMetrics(),
        ]);

        setUserActivity(activityData);
        setPageViews(viewsData);
        setSystemMetrics(metricsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const userActivityData: ChartData<'line'> = {
    labels: userActivity.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'User Actions',
        data: userActivity.map(item => (item.details.count as number) || 1),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const pageViewsData: ChartData<'bar'> = {
    labels: pageViews.map(item => item.path),
    datasets: [
      {
        label: 'Page Views',
        data: pageViews.map(item => item.views),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Unique Visitors',
        data: pageViews.map(item => item.uniqueVisitors),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            aria-label="Time Range"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {systemMetrics?.activeUsers || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">CPU Usage</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {systemMetrics?.cpuUsage ? `${(systemMetrics.cpuUsage * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Memory Usage</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {systemMetrics?.memoryUsage ? `${(systemMetrics.memoryUsage * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Disk Space</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {systemMetrics?.diskSpace ? `${(systemMetrics.diskSpace * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">User Activity</h2>
            <Line data={userActivityData} options={chartOptions} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Page Views</h2>
            <Bar data={pageViewsData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 