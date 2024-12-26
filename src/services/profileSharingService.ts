import axios from 'axios';

export interface ShareOptions {
  platform?: 'facebook' | 'twitter' | 'linkedin' | 'email';
  message?: string;
  recipients?: string[];
  expiresIn?: number; // Time in seconds
  accessLevel?: 'view' | 'edit';
  password?: string;
}

export interface ShareLink {
  id: string;
  userId: string;
  url: string;
  platform: string | null;
  accessLevel: 'view' | 'edit';
  isPasswordProtected: boolean;
  expiresAt: Date | null;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmbedCode {
  html: string;
  width: number;
  height: number;
  theme: 'light' | 'dark';
  showStats: boolean;
}

class ProfileSharingService {
  private baseUrl = '/api/profile-sharing';

  // Share profile on social media or via email
  async shareProfile(userId: string, options: ShareOptions): Promise<ShareLink> {
    try {
      const response = await axios.post<ShareLink>(`${this.baseUrl}/share/${userId}`, options);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        expiresAt: response.data.expiresAt ? new Date(response.data.expiresAt) : null,
      };
    } catch (error) {
      console.error('Failed to share profile:', error);
      throw error;
    }
  }

  // Get share link for profile
  async getShareLink(userId: string, options: Omit<ShareOptions, 'platform' | 'message' | 'recipients'>): Promise<ShareLink> {
    try {
      const response = await axios.post<ShareLink>(`${this.baseUrl}/link/${userId}`, options);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        expiresAt: response.data.expiresAt ? new Date(response.data.expiresAt) : null,
      };
    } catch (error) {
      console.error('Failed to get share link:', error);
      throw error;
    }
  }

  // Get all share links for a profile
  async getShareLinks(userId: string): Promise<ShareLink[]> {
    try {
      const response = await axios.get<ShareLink[]>(`${this.baseUrl}/links/${userId}`);
      return response.data.map(link => ({
        ...link,
        createdAt: new Date(link.createdAt),
        updatedAt: new Date(link.updatedAt),
        expiresAt: link.expiresAt ? new Date(link.expiresAt) : null,
      }));
    } catch (error) {
      console.error('Failed to get share links:', error);
      throw error;
    }
  }

  // Delete a share link
  async deleteShareLink(linkId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/link/${linkId}`);
    } catch (error) {
      console.error('Failed to delete share link:', error);
      throw error;
    }
  }

  // Get embed code for profile
  async getEmbedCode(userId: string, options: {
    width?: number;
    height?: number;
    theme?: 'light' | 'dark';
    showStats?: boolean;
  } = {}): Promise<EmbedCode> {
    try {
      const response = await axios.post<EmbedCode>(`${this.baseUrl}/embed/${userId}`, options);
      return response.data;
    } catch (error) {
      console.error('Failed to get embed code:', error);
      throw error;
    }
  }

  // Share profile via email
  async shareViaEmail(userId: string, options: {
    recipients: string[];
    subject?: string;
    message?: string;
    accessLevel?: 'view' | 'edit';
    expiresIn?: number;
  }): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/email/${userId}`, options);
    } catch (error) {
      console.error('Failed to share via email:', error);
      throw error;
    }
  }

  // Get sharing statistics
  async getShareStats(userId: string): Promise<{
    totalShares: number;
    sharesByPlatform: Record<string, number>;
    totalClicks: number;
    activeLinks: number;
    topPerformingLinks: ShareLink[];
  }> {
    try {
      const response = await axios.get<{
        totalShares: number;
        sharesByPlatform: Record<string, number>;
        totalClicks: number;
        activeLinks: number;
        topPerformingLinks: ShareLink[];
      }>(`${this.baseUrl}/stats/${userId}`);
      return {
        ...response.data,
        topPerformingLinks: response.data.topPerformingLinks.map(link => ({
          ...link,
          createdAt: new Date(link.createdAt),
          updatedAt: new Date(link.updatedAt),
          expiresAt: link.expiresAt ? new Date(link.expiresAt) : null,
        })),
      };
    } catch (error) {
      console.error('Failed to get share stats:', error);
      throw error;
    }
  }

  // Update share link settings
  async updateShareLink(linkId: string, updates: {
    accessLevel?: 'view' | 'edit';
    expiresIn?: number | null;
    password?: string | null;
  }): Promise<ShareLink> {
    try {
      const response = await axios.put<ShareLink>(`${this.baseUrl}/link/${linkId}`, updates);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        expiresAt: response.data.expiresAt ? new Date(response.data.expiresAt) : null,
      };
    } catch (error) {
      console.error('Failed to update share link:', error);
      throw error;
    }
  }

  // Revoke all share links
  async revokeAllLinks(userId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/links/${userId}`);
    } catch (error) {
      console.error('Failed to revoke all links:', error);
      throw error;
    }
  }
}

export const profileSharingService = new ProfileSharingService(); 