import React, { useState } from 'react';
import { UpdateReportsService } from '../../services/updateReports';

interface CreateReportFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    projectId: '',
    department: '',
    type: 'manual' as 'manual' | 'automated',
    attachments: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reportsService = new UpdateReportsService();
      await reportsService.createReport(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={4}
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
          Project
        </label>
        <select
          id="projectId"
          name="projectId"
          required
          value={formData.projectId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a project</option>
          <option value="aevum">Aevum Ltd</option>
          <option value="shift">Shift</option>
          <option value="alfred">Alfred AI</option>
          <option value="nido">Nido Super</option>
          <option value="koomi">Koomi Farms</option>
        </select>
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          id="department"
          name="department"
          required
          value={formData.department}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a department</option>
          <option value="development">Development</option>
          <option value="operations">Operations</option>
          <option value="finance">Finance</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Report Type
        </label>
        <select
          id="type"
          name="type"
          required
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="manual">Manual</option>
          <option value="automated">Automated</option>
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Report'}
        </button>
      </div>
    </form>
  );
};

export default CreateReportForm; 