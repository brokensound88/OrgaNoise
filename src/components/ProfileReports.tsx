import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileReportsService,
  ActivitySummary,
  SecurityReport,
  UsageStatistics,
} from '../services/profileReportsService';

interface ProfileReportsProps {
  userId: string;
}

export const ProfileReports: React.FC<ProfileReportsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStatistics | null>(null);
  const [timeRange, setTimeRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    frequency: 'weekly' as const,
    time: '09:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    recipients: [''],
    reportTypes: ['activity', 'security', 'usage'] as Array<'activity' | 'security' | 'usage'>,
    format: 'pdf' as const,
  });

  useEffect(() => {
    loadData();
  }, [userId, timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [activity, security, usage] = await Promise.all([
        profileReportsService.getActivitySummary(userId, timeRange),
        profileReportsService.getSecurityReport(userId),
        profileReportsService.getUsageStatistics(userId, timeRange),
      ]);

      setActivitySummary(activity);
      setSecurityReport(security);
      setUsageStats(usage);
    } catch (error) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const blob = await profileReportsService.generateReport(userId, {
        includeActivity: true,
        includeSecurity: true,
        includeUsage: true,
        timeRange,
        format: 'pdf',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-report-${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    }
  };

  const handleScheduleReport = async () => {
    try {
      const result = await profileReportsService.scheduleReport(userId, scheduleForm);
      setShowScheduleModal(false);
      toast.success(`Report scheduled. Next run: ${result.nextRun.toLocaleString()}`);
    } catch (error) {
      toast.error('Failed to schedule report');
      console.error(error);
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Reports</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and analyze your profile performance
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Schedule Reports
          </button>
          <button
            onClick={handleGenerateReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={timeRange.start.toISOString().split('T')[0]}
              onChange={(e) => setTimeRange(prev => ({
                ...prev,
                start: new Date(e.target.value),
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={timeRange.end.toISOString().split('T')[0]}
              onChange={(e) => setTimeRange(prev => ({
                ...prev,
                end: new Date(e.target.value),
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      {activitySummary && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Logins</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {activitySummary.totalLogins}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Session Duration</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {Math.round(activitySummary.averageSessionDuration / 60)} min
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {activitySummary.lastLogin.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Top Actions</h4>
            <div className="space-y-2">
              {activitySummary.topActions.map((action, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-500">{action.type}</span>
                  <span className="font-medium">{action.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Report */}
      {securityReport && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Security Report</h3>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Security Score:</span>
              <span className={`text-lg font-semibold ${
                securityReport.securityScore >= 80
                  ? 'text-green-600'
                  : securityReport.securityScore >= 60
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {securityReport.securityScore}%
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent Security Events */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Security Events</h4>
              <div className="space-y-3">
                {securityReport.recentSecurityEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full ${
                      getSeverityColor(event.severity)
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.type}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                      <div className="mt-1 flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">
                          {event.timestamp.toLocaleString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          event.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerabilities */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Vulnerabilities</h4>
              <div className="space-y-3">
                {securityReport.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{vuln.type}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        getSeverityColor(vuln.severity)
                      }`}>
                        {vuln.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{vuln.description}</p>
                    <p className="mt-2 text-sm text-indigo-600">{vuln.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Statistics */}
      {usageStats && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Overview</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Profile Completeness</span>
                    <span>{usageStats.profileCompleteness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 rounded-full h-2"
                      style={{ width: `${usageStats.profileCompleteness}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Engagement Rate</span>
                    <span>{(usageStats.engagementRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 rounded-full h-2"
                      style={{ width: `${usageStats.engagementRate * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Content Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Posts</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {usageStats.contentMetrics.totalPosts}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Comments</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {usageStats.contentMetrics.totalComments}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Reactions</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {usageStats.contentMetrics.totalReactions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Engagement</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {usageStats.contentMetrics.averageEngagement.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Feature Usage</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {usageStats.featureUsage.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{feature.feature}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {feature.usageCount}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Last used: {feature.lastUsed.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Schedule Reports</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select
                  id="frequency"
                  value={scheduleForm.frequency}
                  onChange={(e) => setScheduleForm(prev => ({
                    ...prev,
                    frequency: e.target.value as typeof scheduleForm.frequency,
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm(prev => ({
                    ...prev,
                    time: e.target.value,
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Report Types
                </label>
                <div className="mt-2 space-y-2">
                  {['activity', 'security', 'usage'].map((type) => (
                    <label key={type} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={scheduleForm.reportTypes.includes(type as typeof scheduleForm.reportTypes[number])}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...scheduleForm.reportTypes, type as typeof scheduleForm.reportTypes[number]]
                            : scheduleForm.reportTypes.filter(t => t !== type);
                          setScheduleForm(prev => ({
                            ...prev,
                            reportTypes: newTypes,
                          }));
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                  Format
                </label>
                <select
                  id="format"
                  value={scheduleForm.format}
                  onChange={(e) => setScheduleForm(prev => ({
                    ...prev,
                    format: e.target.value as typeof scheduleForm.format,
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recipients
                </label>
                <div className="mt-2 space-y-2">
                  {scheduleForm.recipients.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const newRecipients = [...scheduleForm.recipients];
                          newRecipients[index] = e.target.value;
                          setScheduleForm(prev => ({
                            ...prev,
                            recipients: newRecipients,
                          }));
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Email address"
                      />
                      <button
                        onClick={() => {
                          const newRecipients = scheduleForm.recipients.filter((_, i) => i !== index);
                          setScheduleForm(prev => ({
                            ...prev,
                            recipients: newRecipients,
                          }));
                        }}
                        className="text-red-600 hover:text-red-700"
                        title="Remove recipient"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setScheduleForm(prev => ({
                      ...prev,
                      recipients: [...prev.recipients, ''],
                    }))}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    + Add recipient
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleReport}
                disabled={!scheduleForm.recipients[0] || !scheduleForm.reportTypes.length}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Report
              </button>
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