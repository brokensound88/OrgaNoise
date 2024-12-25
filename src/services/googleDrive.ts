import { google } from 'googleapis';

interface DriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

export class GoogleDriveService {
  private drive;

  constructor(config: DriveConfig) {
    const oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: config.refreshToken
    });

    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  async listFiles(folderId?: string) {
    try {
      const query = folderId ? `'${folderId}' in parents` : undefined;
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, modifiedTime, size)',
      });
      return response.data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async uploadFile(file: File, folderId?: string) {
    try {
      const fileMetadata = {
        name: file.name,
        parents: folderId ? [folderId] : undefined,
      };

      const media = {
        mimeType: file.type,
        body: file,
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
} 