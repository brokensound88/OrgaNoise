import React, { useState } from 'react';
import CreateReportForm from '../components/reports/CreateReportForm';
import ReportsList from '../components/reports/ReportsList';

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

const ReportsPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleCreateSuccess = () => {
    setIsCreating(false);
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Update Reports</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Report
        </button>
      </div>

      {isCreating ? (
        <div className="mb-8">
          <CreateReportForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      ) : (
        <ReportsList onReportClick={handleReportClick} />
      )}

      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4 text-sm text-gray-500">
              <p>Project: {selectedReport.projectId}</p>
              <p>Department: {selectedReport.department}</p>
              <p>Type: {selectedReport.type}</p>
              <p>Created: {new Date(selectedReport.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(selectedReport.updatedAt).toLocaleString()}</p>
            </div>
            <div className="prose max-w-none">
              <p>{selectedReport.content}</p>
            </div>
            {selectedReport.attachments && selectedReport.attachments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Attachments</h3>
                <ul className="space-y-2">
                  {selectedReport.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center text-indigo-600 hover:text-indigo-800">
                      <svg
                        className="h-5 w-5 mr-2"
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
                      <a href={attachment} target="_blank" rel="noopener noreferrer">
                        {attachment.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage; 