import axios from 'axios';

export interface Integration {
  id: string;
  userId: string;
  provider: 'linkedin' | 'github' | 'portfolio';
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  lastSync: Date;
  nextSync?: Date;
  error?: string;
  metadata: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    scope?: string[];
    profileUrl?: string;
    username?: string;
  };
  settings: {
    autoSync: boolean;
    syncInterval: number; // in minutes
    syncFields: string[];
    visibility: 'public' | 'private' | 'connections';
  };
  stats: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    lastSyncDuration: number; // in seconds
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedInData {
  profile: {
    headline: string;
    summary: string;
    industry: string;
    location: string;
    positions: Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate?: string;
      description?: string;
    }>;
    skills: string[];
    certifications: Array<{
      name: string;
      organization: string;
      issueDate: string;
      expirationDate?: string;
    }>;
  };
  connections: number;
}

export interface GitHubData {
  profile: {
    bio: string;
    company?: string;
    location?: string;
    blog?: string;
    publicRepos: number;
    followers: number;
    following: number;
  };
  stats: {
    totalContributions: number;
    repositories: Array<{
      name: string;
      description?: string;
      language: string;
      stars: number;
      forks: number;
      lastUpdated: Date;
    }>;
    languages: Record<string, number>;
    contributionsByMonth: Array<{
      month: string;
      contributions: number;
    }>;
  };
}

export interface PortfolioData {
  projects: Array<{
    title: string;
    description: string;
    url: string;
    thumbnail?: string;
    technologies: string[];
    category: string;
    startDate: string;
    endDate?: string;
    featured: boolean;
  }>;
  skills: Array<{
    name: string;
    category: string;
    proficiency: number;
  }>;
  testimonials: Array<{
    author: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    date: string;
  }>;
}

class ProfileIntegrationsService {
  private baseUrl = '/api/profile-integrations';

  // Get all integrations for a user
  async getIntegrations(userId: string): Promise<Integration[]> {
    try {
      interface RawIntegration extends Omit<Integration, 'lastSync' | 'nextSync' | 'metadata' | 'createdAt' | 'updatedAt'> {
        lastSync: string;
        nextSync?: string;
        metadata: {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: string;
          scope?: string[];
          profileUrl?: string;
          username?: string;
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.get<RawIntegration[]>(`${this.baseUrl}/${userId}`);

      return response.data.map(integration => ({
        ...integration,
        lastSync: new Date(integration.lastSync),
        nextSync: integration.nextSync ? new Date(integration.nextSync) : undefined,
        metadata: {
          ...integration.metadata,
          expiresAt: integration.metadata.expiresAt
            ? new Date(integration.metadata.expiresAt)
            : undefined,
        },
        createdAt: new Date(integration.createdAt),
        updatedAt: new Date(integration.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to get integrations:', error);
      throw error;
    }
  }

  // Connect LinkedIn
  async connectLinkedIn(userId: string, authCode: string): Promise<Integration> {
    try {
      interface RawIntegration extends Omit<Integration, 'lastSync' | 'nextSync' | 'metadata' | 'createdAt' | 'updatedAt'> {
        lastSync: string;
        nextSync?: string;
        metadata: {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: string;
          scope?: string[];
          profileUrl?: string;
          username?: string;
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.post<RawIntegration>(`${this.baseUrl}/${userId}/linkedin/connect`, {
        authCode,
      });

      return {
        ...response.data,
        lastSync: new Date(response.data.lastSync),
        nextSync: response.data.nextSync ? new Date(response.data.nextSync) : undefined,
        metadata: {
          ...response.data.metadata,
          expiresAt: response.data.metadata.expiresAt
            ? new Date(response.data.metadata.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to connect LinkedIn:', error);
      throw error;
    }
  }

  // Connect GitHub
  async connectGitHub(userId: string, authCode: string): Promise<Integration> {
    try {
      interface RawIntegration extends Omit<Integration, 'lastSync' | 'nextSync' | 'metadata' | 'createdAt' | 'updatedAt'> {
        lastSync: string;
        nextSync?: string;
        metadata: {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: string;
          scope?: string[];
          profileUrl?: string;
          username?: string;
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.post<RawIntegration>(`${this.baseUrl}/${userId}/github/connect`, {
        authCode,
      });

      return {
        ...response.data,
        lastSync: new Date(response.data.lastSync),
        nextSync: response.data.nextSync ? new Date(response.data.nextSync) : undefined,
        metadata: {
          ...response.data.metadata,
          expiresAt: response.data.metadata.expiresAt
            ? new Date(response.data.metadata.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      throw error;
    }
  }

  // Add portfolio link
  async addPortfolioLink(userId: string, data: {
    url: string;
    username?: string;
  }): Promise<Integration> {
    try {
      interface RawIntegration extends Omit<Integration, 'lastSync' | 'nextSync' | 'metadata' | 'createdAt' | 'updatedAt'> {
        lastSync: string;
        nextSync?: string;
        metadata: {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: string;
          scope?: string[];
          profileUrl?: string;
          username?: string;
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.post<RawIntegration>(`${this.baseUrl}/${userId}/portfolio/add`, data);

      return {
        ...response.data,
        lastSync: new Date(response.data.lastSync),
        nextSync: response.data.nextSync ? new Date(response.data.nextSync) : undefined,
        metadata: {
          ...response.data.metadata,
          expiresAt: response.data.metadata.expiresAt
            ? new Date(response.data.metadata.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to add portfolio link:', error);
      throw error;
    }
  }

  // Update integration settings
  async updateSettings(
    userId: string,
    integrationId: string,
    settings: Partial<Integration['settings']>
  ): Promise<Integration> {
    try {
      interface RawIntegration extends Omit<Integration, 'lastSync' | 'nextSync' | 'metadata' | 'createdAt' | 'updatedAt'> {
        lastSync: string;
        nextSync?: string;
        metadata: {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: string;
          scope?: string[];
          profileUrl?: string;
          username?: string;
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.put<RawIntegration>(
        `${this.baseUrl}/${userId}/settings/${integrationId}`,
        settings
      );

      return {
        ...response.data,
        lastSync: new Date(response.data.lastSync),
        nextSync: response.data.nextSync ? new Date(response.data.nextSync) : undefined,
        metadata: {
          ...response.data.metadata,
          expiresAt: response.data.metadata.expiresAt
            ? new Date(response.data.metadata.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update integration settings:', error);
      throw error;
    }
  }

  // Sync integration data
  async syncIntegration(userId: string, integrationId: string): Promise<Integration> {
    try {
      interface RawIntegration extends Omit<Integration, 'lastSync' | 'nextSync' | 'metadata' | 'createdAt' | 'updatedAt'> {
        lastSync: string;
        nextSync?: string;
        metadata: {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: string;
          scope?: string[];
          profileUrl?: string;
          username?: string;
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.post<RawIntegration>(
        `${this.baseUrl}/${userId}/sync/${integrationId}`
      );

      return {
        ...response.data,
        lastSync: new Date(response.data.lastSync),
        nextSync: response.data.nextSync ? new Date(response.data.nextSync) : undefined,
        metadata: {
          ...response.data.metadata,
          expiresAt: response.data.metadata.expiresAt
            ? new Date(response.data.metadata.expiresAt)
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to sync integration:', error);
      throw error;
    }
  }

  // Disconnect integration
  async disconnectIntegration(userId: string, integrationId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/${integrationId}`);
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      throw error;
    }
  }

  // Get LinkedIn data
  async getLinkedInData(userId: string): Promise<LinkedInData> {
    try {
      const response = await axios.get<LinkedInData>(`${this.baseUrl}/${userId}/linkedin/data`);
      return response.data;
    } catch (error) {
      console.error('Failed to get LinkedIn data:', error);
      throw error;
    }
  }

  // Get GitHub data
  async getGitHubData(userId: string): Promise<GitHubData> {
    try {
      interface RawGitHubData extends Omit<GitHubData, 'stats'> {
        stats: {
          totalContributions: number;
          repositories: Array<{
            name: string;
            description?: string;
            language: string;
            stars: number;
            forks: number;
            lastUpdated: string;
          }>;
          languages: Record<string, number>;
          contributionsByMonth: Array<{
            month: string;
            contributions: number;
          }>;
        };
      }

      const response = await axios.get<RawGitHubData>(`${this.baseUrl}/${userId}/github/data`);

      return {
        ...response.data,
        stats: {
          ...response.data.stats,
          repositories: response.data.stats.repositories.map(repo => ({
            ...repo,
            lastUpdated: new Date(repo.lastUpdated),
          })),
        },
      };
    } catch (error) {
      console.error('Failed to get GitHub data:', error);
      throw error;
    }
  }

  // Get portfolio data
  async getPortfolioData(userId: string): Promise<PortfolioData> {
    try {
      const response = await axios.get<PortfolioData>(`${this.baseUrl}/${userId}/portfolio/data`);
      return response.data;
    } catch (error) {
      console.error('Failed to get portfolio data:', error);
      throw error;
    }
  }
}

export const profileIntegrationsService = new ProfileIntegrationsService(); 