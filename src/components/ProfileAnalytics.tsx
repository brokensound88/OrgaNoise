import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileAnalyticsService,
  ViewStatistics,
  InteractionMetrics,
  GrowthTrends,
  AnalyticsPeriod,
} from '../services/profileAnalyticsService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ProfileAnalyticsProps {
  userId: string;
}

export const ProfileAnalytics: React.FC<ProfileAnalyticsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<AnalyticsPeriod>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    endDate: new Date(),
  });
  const [viewStats, setViewStats] = useState<ViewStatistics | null>(null);
  const [interactionMetrics, setInteractionMetrics] = useState<InteractionMetrics | null>(null);
  const [growthTrends, setGrowthTrends] = useState<GrowthTrends | null>(null);
  const [summary, setSummary] = useState<{
    views: number;
    interactions: number;
    followers: number;
    engagementRate: number;
    profileScore: number;
  } | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    loadData();
  }, [userId, period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stats, metrics, trends, summaryData] = await Promise.all([
        profileAnalyticsService.getViewStatistics(userId, period),
        profileAnalyticsService.getInteractionMetrics(userId, period),
        profileAnalyticsService.getGrowthTrends(userId, period),
        profileAnalyticsService.getAnalyticsSummary(userId),
      ]);
      setViewStats(stats);
      setInteractionMetrics(metrics);
      setGrowthTrends(trends);
      setSummary(summaryData);
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await profileAnalyticsService.exportAnalyticsReport(userId, period, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${format}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to export report');
      console.error(error);
    }
  };

  const handlePeriodChange = (days: number) => {
    setPeriod({
      startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{summary.views}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Interactions</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{summary.interactions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Followers</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{summary.followers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {(summary.engagementRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Profile Score</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {summary.profileScore}/100
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <button
              onClick={() => handlePeriodChange(7)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                period.startDate.getTime() === Date.now() - 7 * 24 * 60 * 60 * 1000
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => handlePeriodChange(30)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                period.startDate.getTime() === Date.now() - 30 * 24 * 60 * 60 * 1000
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => handlePeriodChange(90)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                period.startDate.getTime() === Date.now() - 90 * 24 * 60 * 60 * 1000
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              90 Days
            </button>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* View Statistics */}
      {viewStats && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">View Statistics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewStats.viewsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Views by Location</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={viewStats.viewsByLocation}
                    dataKey="views"
                    nameKey="location"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {viewStats.viewsByLocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Views by Device</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewStats.viewsByDevice}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Metrics */}
      {interactionMetrics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Interaction Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interactionMetrics.interactionsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="interactions" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Top Interactors</h4>
            <div className="space-y-4">
              {interactionMetrics.topInteractors.map((interactor) => (
                <div
                  key={interactor.userId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{interactor.name}</span>
                  <span className="text-sm text-gray-500">
                    {interactor.interactions} interactions
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Growth Trends */}
      {growthTrends && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Growth Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  data={growthTrends.followerGrowth}
                  dataKey="followers"
                  stroke="#8884d8"
                  name="Followers"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  data={growthTrends.engagementRate}
                  dataKey="rate"
                  stroke="#82ca9d"
                  name="Engagement Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Profile Completeness</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Profile Score</span>
                  <span className="text-sm text-gray-500">
                    {growthTrends.profileCompleteness.score}%
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${growthTrends.profileCompleteness.score}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    />
                  </div>
                </div>
              </div>
              {growthTrends.profileCompleteness.missingFields.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Missing Information</h5>
                  <ul className="list-disc list-inside text-sm text-gray-500">
                    {growthTrends.profileCompleteness.missingFields.map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}
              {growthTrends.profileCompleteness.recommendations.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h5>
                  <ul className="list-disc list-inside text-sm text-gray-500">
                    {growthTrends.profileCompleteness.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
}; 