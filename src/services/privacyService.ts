import axios from 'axios';

export interface PrivacySettings {
  id: string;
  userId: string;
  profileVisibility: 'public' | 'private' | 'connections';
  dataSharing: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowIndexing: boolean;
  };
  thirdPartyConnections: {
    id: string;
    provider: string;
    connected: boolean;
    permissions: string[];
    lastSync?: Date;
  }[];
}

export interface UpdatePrivacySettingsData {
  profileVisibility?: 'public' | 'private' | 'connections';
  dataSharing?: {
    showEmail?: boolean;
    showPhone?: boolean;
    showLocation?: boolean;
    allowIndexing?: boolean;
  };
}

export interface ThirdPartyConnection {
  provider: string;
  permissions: string[];
}

class PrivacyService {
  private baseUrl = '/api/privacy';

  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const response = await axios.get<PrivacySettings>(`${this.baseUrl}/${userId}/settings`);
      return {
        ...response.data,
        thirdPartyConnections: response.data.thirdPartyConnections.map(conn => ({
          ...conn,
          lastSync: conn.lastSync ? new Date(conn.lastSync) : undefined,
        })),
      };
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
      throw error;
    }
  }

  async updatePrivacySettings(userId: string, settings: UpdatePrivacySettingsData): Promise<PrivacySettings> {
    try {
      const response = await axios.put<PrivacySettings>(`${this.baseUrl}/${userId}/settings`, settings);
      return {
        ...response.data,
        thirdPartyConnections: response.data.thirdPartyConnections.map(conn => ({
          ...conn,
          lastSync: conn.lastSync ? new Date(conn.lastSync) : undefined,
        })),
      };
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw error;
    }
  }

  async connectThirdParty(userId: string, connection: ThirdPartyConnection): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/connections`, connection);
    } catch (error) {
      console.error('Failed to connect third-party service:', error);
      throw error;
    }
  }

  async disconnectThirdParty(userId: string, providerId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/connections/${providerId}`);
    } catch (error) {
      console.error('Failed to disconnect third-party service:', error);
      throw error;
    }
  }

  async getThirdPartyConnections(userId: string): Promise<ThirdPartyConnection[]> {
    try {
      const response = await axios.get<ThirdPartyConnection[]>(`${this.baseUrl}/${userId}/connections`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch third-party connections:', error);
      throw error;
    }
  }
}

export const privacyService = new PrivacyService(); 