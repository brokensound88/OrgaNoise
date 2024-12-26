import axios from 'axios';

export interface Badge {
  id: string;
  userId: string;
  type: 'achievement' | 'skill' | 'verification';
  name: string;
  description: string;
  icon: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  category?: string;
  criteria: {
    type: string;
    value: number;
    current: number;
  };
  metadata: {
    dateEarned: Date;
    progress?: number;
    expiresAt?: Date;
    issuedBy?: string;
    verificationDetails?: {
      method: string;
      verifier: string;
      date: Date;
      status: 'pending' | 'verified' | 'rejected';
    };
  };
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  badges: Badge[];
}

class ProfileBadgesService {
  private baseUrl = '/api/profile-badges';

  // Get all badges for a user
  async getBadges(userId: string, options?: {
    type?: 'achievement' | 'skill' | 'verification';
    category?: string;
    isVisible?: boolean;
  }): Promise<{
    badges: Badge[];
    totalCount: number;
    earnedCount: number;
  }> {
    try {
      interface RawBadge extends Omit<Badge, 'metadata' | 'createdAt' | 'updatedAt'> {
        metadata: {
          dateEarned: string;
          progress?: number;
          expiresAt?: string;
          issuedBy?: string;
          verificationDetails?: {
            method: string;
            verifier: string;
            date: string;
            status: 'pending' | 'verified' | 'rejected';
          };
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.get<{
        badges: RawBadge[];
        totalCount: number;
        earnedCount: number;
      }>(`${this.baseUrl}/${userId}`, { params: options });

      return {
        ...response.data,
        badges: response.data.badges.map(badge => ({
          ...badge,
          metadata: {
            ...badge.metadata,
            dateEarned: new Date(badge.metadata.dateEarned),
            expiresAt: badge.metadata.expiresAt ? new Date(badge.metadata.expiresAt) : undefined,
            verificationDetails: badge.metadata.verificationDetails
              ? {
                  ...badge.metadata.verificationDetails,
                  date: new Date(badge.metadata.verificationDetails.date),
                }
              : undefined,
          },
          createdAt: new Date(badge.createdAt),
          updatedAt: new Date(badge.updatedAt),
        })),
      };
    } catch (error) {
      console.error('Failed to get badges:', error);
      throw error;
    }
  }

  // Get badge categories
  async getBadgeCategories(): Promise<BadgeCategory[]> {
    try {
      interface RawBadgeCategory extends Omit<BadgeCategory, 'badges'> {
        badges: Array<Omit<Badge, 'metadata' | 'createdAt' | 'updatedAt'> & {
          metadata: {
            dateEarned: string;
            progress?: number;
            expiresAt?: string;
            issuedBy?: string;
            verificationDetails?: {
              method: string;
              verifier: string;
              date: string;
              status: 'pending' | 'verified' | 'rejected';
            };
          };
          createdAt: string;
          updatedAt: string;
        }>;
      }

      const response = await axios.get<RawBadgeCategory[]>(`${this.baseUrl}/categories`);

      return response.data.map(category => ({
        ...category,
        badges: category.badges.map(badge => ({
          ...badge,
          metadata: {
            ...badge.metadata,
            dateEarned: new Date(badge.metadata.dateEarned),
            expiresAt: badge.metadata.expiresAt ? new Date(badge.metadata.expiresAt) : undefined,
            verificationDetails: badge.metadata.verificationDetails
              ? {
                  ...badge.metadata.verificationDetails,
                  date: new Date(badge.metadata.verificationDetails.date),
                }
              : undefined,
          },
          createdAt: new Date(badge.createdAt),
          updatedAt: new Date(badge.updatedAt),
        })),
      }));
    } catch (error) {
      console.error('Failed to get badge categories:', error);
      throw error;
    }
  }

  // Update badge visibility
  async updateBadgeVisibility(userId: string, badgeId: string, isVisible: boolean): Promise<Badge> {
    try {
      interface RawBadge extends Omit<Badge, 'metadata' | 'createdAt' | 'updatedAt'> {
        metadata: {
          dateEarned: string;
          progress?: number;
          expiresAt?: string;
          issuedBy?: string;
          verificationDetails?: {
            method: string;
            verifier: string;
            date: string;
            status: 'pending' | 'verified' | 'rejected';
          };
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.put<RawBadge>(
        `${this.baseUrl}/${userId}/${badgeId}/visibility`,
        { isVisible }
      );

      return {
        ...response.data,
        metadata: {
          ...response.data.metadata,
          dateEarned: new Date(response.data.metadata.dateEarned),
          expiresAt: response.data.metadata.expiresAt
            ? new Date(response.data.metadata.expiresAt)
            : undefined,
          verificationDetails: response.data.metadata.verificationDetails
            ? {
                ...response.data.metadata.verificationDetails,
                date: new Date(response.data.metadata.verificationDetails.date),
              }
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update badge visibility:', error);
      throw error;
    }
  }

  // Get badge statistics
  async getBadgeStatistics(userId: string): Promise<{
    totalBadges: number;
    badgesByType: Record<string, number>;
    badgesByLevel: Record<string, number>;
    recentlyEarned: Badge[];
    nextAvailableBadges: Badge[];
    completionRate: number;
  }> {
    try {
      interface RawBadge extends Omit<Badge, 'metadata' | 'createdAt' | 'updatedAt'> {
        metadata: {
          dateEarned: string;
          progress?: number;
          expiresAt?: string;
          issuedBy?: string;
          verificationDetails?: {
            method: string;
            verifier: string;
            date: string;
            status: 'pending' | 'verified' | 'rejected';
          };
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.get<{
        totalBadges: number;
        badgesByType: Record<string, number>;
        badgesByLevel: Record<string, number>;
        recentlyEarned: RawBadge[];
        nextAvailableBadges: RawBadge[];
        completionRate: number;
      }>(`${this.baseUrl}/${userId}/statistics`);

      const processBadge = (badge: RawBadge): Badge => ({
        ...badge,
        metadata: {
          ...badge.metadata,
          dateEarned: new Date(badge.metadata.dateEarned),
          expiresAt: badge.metadata.expiresAt
            ? new Date(badge.metadata.expiresAt)
            : undefined,
          verificationDetails: badge.metadata.verificationDetails
            ? {
                ...badge.metadata.verificationDetails,
                date: new Date(badge.metadata.verificationDetails.date),
              }
            : undefined,
        },
        createdAt: new Date(badge.createdAt),
        updatedAt: new Date(badge.updatedAt),
      });

      return {
        ...response.data,
        recentlyEarned: response.data.recentlyEarned.map(processBadge),
        nextAvailableBadges: response.data.nextAvailableBadges.map(processBadge),
      };
    } catch (error) {
      console.error('Failed to get badge statistics:', error);
      throw error;
    }
  }

  // Request badge verification
  async requestVerification(userId: string, badgeId: string, verificationData: {
    method: string;
    evidence: string;
  }): Promise<Badge> {
    try {
      interface RawBadge extends Omit<Badge, 'metadata' | 'createdAt' | 'updatedAt'> {
        metadata: {
          dateEarned: string;
          progress?: number;
          expiresAt?: string;
          issuedBy?: string;
          verificationDetails?: {
            method: string;
            verifier: string;
            date: string;
            status: 'pending' | 'verified' | 'rejected';
          };
        };
        createdAt: string;
        updatedAt: string;
      }

      const response = await axios.post<RawBadge>(
        `${this.baseUrl}/${userId}/${badgeId}/verify`,
        verificationData
      );

      return {
        ...response.data,
        metadata: {
          ...response.data.metadata,
          dateEarned: new Date(response.data.metadata.dateEarned),
          expiresAt: response.data.metadata.expiresAt
            ? new Date(response.data.metadata.expiresAt)
            : undefined,
          verificationDetails: response.data.metadata.verificationDetails
            ? {
                ...response.data.metadata.verificationDetails,
                date: new Date(response.data.metadata.verificationDetails.date),
              }
            : undefined,
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to request badge verification:', error);
      throw error;
    }
  }
}

export const profileBadgesService = new ProfileBadgesService(); 