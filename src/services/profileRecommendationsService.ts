import axios from 'axios';

export interface ProfileRecommendation {
  id: string;
  userId: string;
  recommendedUserId: string;
  recommendationType: 'similar' | 'connection' | 'content';
  score: number;
  reasons: {
    type: string;
    description: string;
    weight: number;
  }[];
  metadata: {
    commonSkills?: string[];
    commonConnections?: number;
    commonInterests?: string[];
    similarIndustries?: string[];
    matchingExperience?: boolean;
    locationProximity?: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

export interface RecommendationFilter {
  type?: 'similar' | 'connection' | 'content';
  minScore?: number;
  status?: 'pending' | 'accepted' | 'rejected' | 'hidden';
  limit?: number;
  offset?: number;
}

class ProfileRecommendationsService {
  private baseUrl = '/api/profile-recommendations';

  // Get recommendations for a user
  async getRecommendations(userId: string, filters?: RecommendationFilter): Promise<{
    recommendations: ProfileRecommendation[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await axios.get<{
        recommendations: ProfileRecommendation[];
        total: number;
        hasMore: boolean;
      }>(`${this.baseUrl}/${userId}`, { params: filters });
      return {
        ...response.data,
        recommendations: response.data.recommendations.map(rec => ({
          ...rec,
          createdAt: new Date(rec.createdAt),
          updatedAt: new Date(rec.updatedAt),
        })),
      };
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      throw error;
    }
  }

  // Update recommendation status
  async updateRecommendationStatus(
    recommendationId: string,
    status: 'accepted' | 'rejected' | 'hidden'
  ): Promise<ProfileRecommendation> {
    try {
      const response = await axios.put<ProfileRecommendation>(
        `${this.baseUrl}/${recommendationId}/status`,
        { status }
      );
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update recommendation status:', error);
      throw error;
    }
  }

  // Get similar profiles
  async getSimilarProfiles(userId: string, options?: {
    limit?: number;
    offset?: number;
    minScore?: number;
  }): Promise<{
    profiles: ProfileRecommendation[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await axios.get<{
        profiles: ProfileRecommendation[];
        total: number;
        hasMore: boolean;
      }>(`${this.baseUrl}/${userId}/similar`, { params: options });
      return {
        ...response.data,
        profiles: response.data.profiles.map(profile => ({
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt),
        })),
      };
    } catch (error) {
      console.error('Failed to get similar profiles:', error);
      throw error;
    }
  }

  // Get connection suggestions
  async getConnectionSuggestions(userId: string, options?: {
    limit?: number;
    offset?: number;
    minCommonConnections?: number;
  }): Promise<{
    suggestions: ProfileRecommendation[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await axios.get<{
        suggestions: ProfileRecommendation[];
        total: number;
        hasMore: boolean;
      }>(`${this.baseUrl}/${userId}/connections`, { params: options });
      return {
        ...response.data,
        suggestions: response.data.suggestions.map(suggestion => ({
          ...suggestion,
          createdAt: new Date(suggestion.createdAt),
          updatedAt: new Date(suggestion.updatedAt),
        })),
      };
    } catch (error) {
      console.error('Failed to get connection suggestions:', error);
      throw error;
    }
  }

  // Get content recommendations
  async getContentRecommendations(userId: string, options?: {
    limit?: number;
    offset?: number;
    contentType?: 'article' | 'post' | 'project';
  }): Promise<{
    content: ProfileRecommendation[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await axios.get<{
        content: ProfileRecommendation[];
        total: number;
        hasMore: boolean;
      }>(`${this.baseUrl}/${userId}/content`, { params: options });
      return {
        ...response.data,
        content: response.data.content.map(content => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
        })),
      };
    } catch (error) {
      console.error('Failed to get content recommendations:', error);
      throw error;
    }
  }

  // Get recommendation insights
  async getInsights(userId: string): Promise<{
    totalRecommendations: number;
    acceptanceRate: number;
    topReasons: {
      type: string;
      count: number;
      successRate: number;
    }[];
    recentActivity: {
      date: Date;
      recommendations: number;
      acceptances: number;
      rejections: number;
    }[];
  }> {
    try {
      const response = await axios.get<{
        totalRecommendations: number;
        acceptanceRate: number;
        topReasons: {
          type: string;
          count: number;
          successRate: number;
        }[];
        recentActivity: {
          date: string;
          recommendations: number;
          acceptances: number;
          rejections: number;
        }[];
      }>(`${this.baseUrl}/${userId}/insights`);
      return {
        ...response.data,
        recentActivity: response.data.recentActivity.map(activity => ({
          ...activity,
          date: new Date(activity.date),
        })),
      };
    } catch (error) {
      console.error('Failed to get recommendation insights:', error);
      throw error;
    }
  }

  // Refresh recommendations
  async refreshRecommendations(userId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/refresh`);
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
      throw error;
    }
  }

  // Update recommendation preferences
  async updatePreferences(userId: string, preferences: {
    enableSimilarProfiles?: boolean;
    enableConnectionSuggestions?: boolean;
    enableContentRecommendations?: boolean;
    minScore?: number;
    maxRecommendationsPerDay?: number;
    excludedTypes?: string[];
  }): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${userId}/preferences`, preferences);
    } catch (error) {
      console.error('Failed to update recommendation preferences:', error);
      throw error;
    }
  }
}

export const profileRecommendationsService = new ProfileRecommendationsService(); 