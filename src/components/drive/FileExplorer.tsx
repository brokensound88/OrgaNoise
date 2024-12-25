import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleDriveService } from '../../services/googleDrive';

interface File {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const driveService = new GoogleDriveService({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI!,
    refreshToken: process.env.REACT_APP_GOOGLE_REFRESH_TOKEN!,
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const fileList = await driveService.listFiles();
      setFiles(fileList || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await driveService.uploadFile(file);
      await loadFiles(); // Refresh the file list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await driveService.deleteFile(fileId);
      await loadFiles(); // Refresh the file list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {file.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(file.modifiedTime).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {file.size ? `${Math.round(parseInt(file.size) / 1024)} KB` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileExplorer; 