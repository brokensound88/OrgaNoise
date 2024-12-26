import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  profileBackupService,
  BackupSchedule,
  BackupFile,
  ProfileData,
} from '../services/profileBackupService';

interface ProfileBackupProps {
  userId: string;
}

export const ProfileBackup: React.FC<ProfileBackupProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<BackupSchedule | null>(null);
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [previewData, setPreviewData] = useState<ProfileData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [scheduleData, backupsData] = await Promise.all([
        profileBackupService.getBackupSchedule(userId),
        profileBackupService.getBackupHistory(userId),
      ]);
      setSchedule(scheduleData);
      setBackups(backupsData);
    } catch (error) {
      toast.error('Failed to load backup data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const backup = await profileBackupService.exportProfile(userId);
      setBackups([backup, ...backups]);
      toast.success('Profile exported successfully');
    } catch (error) {
      toast.error('Failed to export profile');
      console.error(error);
    }
  };

  const handleImport = async (file: File) => {
    try {
      // First validate the backup file
      const validation = await profileBackupService.validateBackup(file);
      
      if (!validation.isValid) {
        toast.error('Invalid backup file: ' + validation.errors.join(', '));
        return;
      }

      if (validation.warnings.length > 0) {
        if (!window.confirm('Warnings found: ' + validation.warnings.join(', ') + '\n\nDo you want to continue?')) {
          return;
        }
      }

      // Preview the backup contents
      const preview = await profileBackupService.previewBackup(file);
      setPreviewData(preview);

      // Confirm import
      if (window.confirm('Are you sure you want to import this backup? This will overwrite your current profile data.')) {
        await profileBackupService.importProfile(userId, file);
        toast.success('Profile imported successfully');
        await loadData();
      }
    } catch (error) {
      toast.error('Failed to import profile');
      console.error(error);
    } finally {
      setPreviewData(null);
    }
  };

  const handleUpdateSchedule = async (frequency: BackupSchedule['frequency'], isEnabled: boolean) => {
    try {
      const updatedSchedule = await profileBackupService.updateBackupSchedule(userId, {
        frequency,
        isEnabled,
      });
      setSchedule(updatedSchedule);
      toast.success('Backup schedule updated successfully');
    } catch (error) {
      toast.error('Failed to update backup schedule');
      console.error(error);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) return;

    try {
      await profileBackupService.deleteBackup(userId, backupId);
      setBackups(backups.filter(b => b.id !== backupId));
      toast.success('Backup deleted successfully');
    } catch (error) {
      toast.error('Failed to delete backup');
      console.error(error);
    }
  };

  const handleDownloadBackup = async (backupId: string) => {
    try {
      await profileBackupService.downloadBackup(userId, backupId);
    } catch (error) {
      toast.error('Failed to download backup');
      console.error(error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Manual Backup Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Backup</h3>
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export Profile
          </button>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              aria-label="Import profile backup file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImport(file);
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Import Profile
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Backup Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Backups</h3>
        {schedule && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Last backup: {schedule.lastBackupAt.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Next backup: {schedule.nextBackupAt.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={schedule.frequency}
                  onChange={(e) => handleUpdateSchedule(
                    e.target.value as BackupSchedule['frequency'],
                    schedule.isEnabled
                  )}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Backup frequency"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={schedule.isEnabled}
                    onChange={(e) => handleUpdateSchedule(schedule.frequency, e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Enable scheduled backups</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backup History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup History</h3>
        <div className="space-y-4">
          {backups.map((backup) => (
            <div
              key={backup.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900">{backup.filename}</h4>
                <div className="mt-1 text-sm text-gray-500 space-x-4">
                  <span>{formatBytes(backup.size)}</span>
                  <span>•</span>
                  <span>{backup.type}</span>
                  <span>•</span>
                  <span>Created {backup.createdAt.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadBackup(backup.id)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDeleteBackup(backup.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {backups.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No backups available</p>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Backup Preview</h3>
              <button
                onClick={() => setPreviewData(null)}
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
                <h4 className="text-sm font-medium text-gray-900">Profile</h4>
                <pre className="mt-1 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  {JSON.stringify(previewData.profile, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Sections</h4>
                <pre className="mt-1 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  {JSON.stringify(previewData.sections, null, 2)}
                </pre>
              </div>
              {/* Add more sections as needed */}
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