import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileCleanupService,
  CleanupJob,
  ArchiveOptions,
  ExportOptions,
  DeletionOptions,
} from '../services/profileCleanupService';

interface ProfileCleanupProps {
  userId: string;
}

export const ProfileCleanup: React.FC<ProfileCleanupProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<CleanupJob[]>([]);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [archiveForm, setArchiveForm] = useState<ArchiveOptions>({
    dataTypes: ['profile'],
    format: 'zip',
    includeMedia: true,
  });

  const [exportForm, setExportForm] = useState<ExportOptions>({
    dataTypes: ['profile'],
    format: 'zip',
    includeMedia: true,
    splitByType: true,
  });

  const [deleteForm, setDeleteForm] = useState<DeletionOptions>({
    dataTypes: ['profile'],
    backupBeforeDelete: true,
    hardDelete: false,
  });

  useEffect(() => {
    loadJobs();
  }, [userId]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await profileCleanupService.listJobs(userId);
      setJobs(response.jobs);
    } catch (error) {
      toast.error('Failed to load cleanup jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveData = async () => {
    try {
      const job = await profileCleanupService.archiveData(userId, archiveForm);
      setJobs([job, ...jobs]);
      setShowArchiveModal(false);
      toast.success('Archive job started successfully');
    } catch (error) {
      toast.error('Failed to start archive job');
      console.error(error);
    }
  };

  const handleExportData = async () => {
    try {
      const job = await profileCleanupService.exportData(userId, exportForm);
      setJobs([job, ...jobs]);
      setShowExportModal(false);
      toast.success('Export job started successfully');
    } catch (error) {
      toast.error('Failed to start export job');
      console.error(error);
    }
  };

  const handleDeleteData = async () => {
    try {
      const job = await profileCleanupService.deleteData(userId, deleteForm);
      setJobs([job, ...jobs]);
      setShowDeleteModal(false);
      toast.success('Delete job started successfully');
    } catch (error) {
      toast.error('Failed to start delete job');
      console.error(error);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await profileCleanupService.cancelJob(userId, jobId);
      setJobs(jobs.map(job =>
        job.id === jobId
          ? { ...job, status: 'failed' as const }
          : job
      ));
      toast.success('Job cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel job');
      console.error(error);
    }
  };

  const handleDownloadData = async (job: CleanupJob) => {
    if (!job.result?.downloadUrl) return;

    try {
      const blob = await profileCleanupService.downloadData(userId, job.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-data-${job.type}-${new Date().toISOString()}.${
        (job.options as ArchiveOptions | ExportOptions).format
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download data');
      console.error(error);
    }
  };

  const getStatusColor = (status: CleanupJob['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Cleanup</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile data
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowArchiveModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Archive Data
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Export Data
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Delete Data
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <li key={job.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {job.type} Job
                    </p>
                    <span className={`ml-2 text-sm ${getStatusColor(job.status)}`}>
                      • {job.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {job.status === 'processing' && (
                      <button
                        onClick={() => handleCancelJob(job.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                    {job.status === 'completed' && job.result?.downloadUrl && (
                      <button
                        onClick={() => handleDownloadData(job)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Download
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Created {new Date(job.createdAt).toLocaleString()}</span>
                    {job.completedAt && (
                      <span className="ml-2">
                        • Completed {new Date(job.completedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {job.status === 'processing' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 rounded-full h-2"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {job.result?.errors && job.result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600">
                        {job.result.errors.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}

          {jobs.length === 0 && !loading && (
            <li className="px-4 py-8">
              <div className="text-center text-gray-500">
                No cleanup jobs found
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Archive Data</h3>
              <button
                onClick={() => setShowArchiveModal(false)}
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
                <label className="block text-sm font-medium text-gray-700">
                  Data Types
                </label>
                <div className="mt-2 space-y-2">
                  {['profile', 'posts', 'comments', 'connections', 'messages'].map((type) => (
                    <label key={type} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={archiveForm.dataTypes.includes(type as typeof archiveForm.dataTypes[number])}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...archiveForm.dataTypes, type as typeof archiveForm.dataTypes[number]]
                            : archiveForm.dataTypes.filter(t => t !== type);
                          setArchiveForm(prev => ({
                            ...prev,
                            dataTypes: newTypes,
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
                <label htmlFor="archive-format" className="block text-sm font-medium text-gray-700">
                  Format
                </label>
                <select
                  id="archive-format"
                  value={archiveForm.format}
                  onChange={(e) => setArchiveForm(prev => ({
                    ...prev,
                    format: e.target.value as typeof archiveForm.format,
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="zip">ZIP</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-media"
                  checked={archiveForm.includeMedia}
                  onChange={(e) => setArchiveForm(prev => ({
                    ...prev,
                    includeMedia: e.target.checked,
                  }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="include-media" className="ml-2 text-sm text-gray-700">
                  Include Media Files
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveData}
                disabled={archiveForm.dataTypes.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
              <button
                onClick={() => setShowExportModal(false)}
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
                <label className="block text-sm font-medium text-gray-700">
                  Data Types
                </label>
                <div className="mt-2 space-y-2">
                  {['profile', 'posts', 'comments', 'connections', 'messages'].map((type) => (
                    <label key={type} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={exportForm.dataTypes.includes(type as typeof exportForm.dataTypes[number])}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...exportForm.dataTypes, type as typeof exportForm.dataTypes[number]]
                            : exportForm.dataTypes.filter(t => t !== type);
                          setExportForm(prev => ({
                            ...prev,
                            dataTypes: newTypes,
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
                <label htmlFor="export-format" className="block text-sm font-medium text-gray-700">
                  Format
                </label>
                <select
                  id="export-format"
                  value={exportForm.format}
                  onChange={(e) => setExportForm(prev => ({
                    ...prev,
                    format: e.target.value as typeof exportForm.format,
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="zip">ZIP</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-media-export"
                    checked={exportForm.includeMedia}
                    onChange={(e) => setExportForm(prev => ({
                      ...prev,
                      includeMedia: e.target.checked,
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-media-export" className="ml-2 text-sm text-gray-700">
                    Include Media Files
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="split-by-type"
                    checked={exportForm.splitByType}
                    onChange={(e) => setExportForm(prev => ({
                      ...prev,
                      splitByType: e.target.checked,
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="split-by-type" className="ml-2 text-sm text-gray-700">
                    Split Files by Type
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="encryption-key" className="block text-sm font-medium text-gray-700">
                  Encryption Key (Optional)
                </label>
                <input
                  type="password"
                  id="encryption-key"
                  value={exportForm.encryptionKey || ''}
                  onChange={(e) => setExportForm(prev => ({
                    ...prev,
                    encryptionKey: e.target.value || undefined,
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter encryption key"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExportData}
                disabled={exportForm.dataTypes.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Delete Data</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Warning
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This action cannot be undone. Please be certain before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Types to Delete
                </label>
                <div className="mt-2 space-y-2">
                  {['profile', 'posts', 'comments', 'connections', 'messages'].map((type) => (
                    <label key={type} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={deleteForm.dataTypes.includes(type as typeof deleteForm.dataTypes[number])}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...deleteForm.dataTypes, type as typeof deleteForm.dataTypes[number]]
                            : deleteForm.dataTypes.filter(t => t !== type);
                          setDeleteForm(prev => ({
                            ...prev,
                            dataTypes: newTypes,
                          }));
                        }}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="backup-before-delete"
                    checked={deleteForm.backupBeforeDelete}
                    onChange={(e) => setDeleteForm(prev => ({
                      ...prev,
                      backupBeforeDelete: e.target.checked,
                    }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="backup-before-delete" className="ml-2 text-sm text-gray-700">
                    Create Backup Before Deletion
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hard-delete"
                    checked={deleteForm.hardDelete}
                    onChange={(e) => setDeleteForm(prev => ({
                      ...prev,
                      hardDelete: e.target.checked,
                    }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hard-delete" className="ml-2 text-sm text-gray-700">
                    Permanent Deletion (Cannot be Recovered)
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                disabled={deleteForm.dataTypes.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Data
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