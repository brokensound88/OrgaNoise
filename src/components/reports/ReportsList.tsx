import React, { useState, useEffect } from 'react';
import { UpdateReportsService } from '../../services/updateReports';

interface Report {
  id: string;
  title: string;
  content: string;
  projectId: string;
  department: string;
  type: 'manual' | 'automated';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

interface ReportsListProps {
  onReportClick: (report: Report) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ onReportClick }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    projectId: '',
    department: '',
    type: '' as '' | 'manual' | 'automated',
  });

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const reportsService = new UpdateReportsService();
      const data = await reportsService.getReports({
        ...(filters.projectId && { projectId: filters.projectId }),
        ...(filters.department && { department: filters.department }),
        ...(filters.type && { type: filters.type as 'manual' | 'automated' }),
      });
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <select
          name="projectId"
          value={filters.projectId}
          onChange={handleFilterChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Projects</option>
          <option value="aevum">Aevum Ltd</option>
          <option value="shift">Shift</option>
          <option value="alfred">Alfred AI</option>
          <option value="nido">Nido Super</option>
          <option value="koomi">Koomi Farms</option>
        </select>

        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Departments</option>
          <option value="development">Development</option>
          <option value="operations">Operations</option>
          <option value="finance">Finance</option>
          <option value="marketing">Marketing</option>
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="manual">Manual</option>
          <option value="automated">Automated</option>
        </select>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No reports found</div>
        ) : (
          reports.map(report => (
            <div
              key={report.id}
              onClick={() => onReportClick(report)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {report.department} • {report.projectId} • {report.type}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">{report.content}</p>
              {report.attachments && report.attachments.length > 0 && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  {report.attachments.length} attachment{report.attachments.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsList; 