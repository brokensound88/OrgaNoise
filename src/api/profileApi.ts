import axios from 'axios';
import { Profile, ProfileVisibility, ProfileTheme } from '../types/profile';

/**
 * Profile API Documentation
 * 
 * This module provides both public and private endpoints for profile management.
 * Public endpoints are accessible without authentication.
 * Private endpoints require a valid authentication token.
 */

class ProfileApi {
  private baseUrl = '/api/profiles';

  /**
   * Public Endpoints
   * These endpoints are accessible without authentication
   */

  /**
   * Get public profile information
   * @param username - The username of the profile to fetch
   * @returns Public profile data
   */
  async getPublicProfile(username: string): Promise<Profile> {
    try {
      const response = await axios.get<Profile>(`${this.baseUrl}/public/${username}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch public profile:', error);
      throw error;
    }
  }

  /**
   * Search public profiles
   * @param query - Search query parameters
   * @returns Array of matching public profiles
   */
  async searchPublicProfiles(query: {
    keyword?: string;
    skills?: string[];
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{ profiles: Profile[]; total: number }> {
    try {
      const response = await axios.get<{ profiles: Profile[]; total: number }>(
        `${this.baseUrl}/public/search`,
        { params: query }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to search public profiles:', error);
      throw error;
    }
  }

  /**
   * Private Endpoints
   * These endpoints require authentication
   */

  /**
   * Get full profile information
   * @param userId - The ID of the profile to fetch
   * @returns Complete profile data
   */
  async getFullProfile(userId: string): Promise<Profile> {
    try {
      const response = await axios.get<Profile>(`${this.baseUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch full profile:', error);
      throw error;
    }
  }

  /**
   * Update profile information
   * @param userId - The ID of the profile to update
   * @param data - Profile data to update
   * @returns Updated profile data
   */
  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    try {
      const response = await axios.patch<Profile>(`${this.baseUrl}/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  /**
   * Update profile visibility settings
   * @param userId - The ID of the profile
   * @param visibility - New visibility settings
   */
  async updateVisibility(userId: string, visibility: ProfileVisibility): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${userId}/visibility`, visibility);
    } catch (error) {
      console.error('Failed to update profile visibility:', error);
      throw error;
    }
  }

  /**
   * Update profile theme
   * @param userId - The ID of the profile
   * @param theme - New theme settings
   */
  async updateTheme(userId: string, theme: ProfileTheme): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/${userId}/theme`, theme);
    } catch (error) {
      console.error('Failed to update profile theme:', error);
      throw error;
    }
  }

  /**
   * Delete profile
   * @param userId - The ID of the profile to delete
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}`);
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw error;
    }
  }

  /**
   * Export profile data
   * @param userId - The ID of the profile to export
   * @returns Profile data in exportable format
   */
  async exportProfile(userId: string): Promise<Blob> {
    try {
      const response = await axios.get<Blob>(`${this.baseUrl}/${userId}/export`, {
        responseType: 'blob'
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      console.error('Failed to export profile:', error);
      throw error;
    }
  }

  /**
   * Import profile data
   * @param userId - The ID of the profile to import to
   * @param data - Profile data to import
   */
  async importProfile(userId: string, data: FormData): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/import`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Failed to import profile:', error);
      throw error;
    }
  }

  /**
   * Get profile analytics
   * @param userId - The ID of the profile
   * @param period - Time period for analytics
   * @returns Profile analytics data
   */
  async getAnalytics(userId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<{
    views: number;
    interactions: number;
    connections: number;
    timeline: Array<{
      date: string;
      views: number;
      interactions: number;
    }>;
  }> {
    try {
      const response = await axios.get<{
        views: number;
        interactions: number;
        connections: number;
        timeline: Array<{
          date: string;
          views: number;
          interactions: number;
        }>;
      }>(`${this.baseUrl}/${userId}/analytics`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile analytics:', error);
      throw error;
    }
  }

  /**
   * Generate profile report
   * @param userId - The ID of the profile
   * @param type - Type of report to generate
   * @returns Report data
   */
  async generateReport(userId: string, type: 'activity' | 'security' | 'usage'): Promise<Blob> {
    try {
      const response = await axios.get<Blob>(`${this.baseUrl}/${userId}/reports/${type}`, {
        responseType: 'blob'
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      console.error('Failed to generate profile report:', error);
      throw error;
    }
  }
}

export const profileApi = new ProfileApi(); 