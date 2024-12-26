import axios, { AxiosResponse, isAxiosError } from 'axios';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileUpdateData {
  username?: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
}

class ProfileService {
  private baseUrl = '/api/profile';

  async getProfile(id: string): Promise<UserProfile> {
    try {
      const response: AxiosResponse<UserProfile> = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(id: string, data: ProfileUpdateData): Promise<UserProfile> {
    try {
      const response: AxiosResponse<UserProfile> = await axios.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadAvatar(id: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response: AxiosResponse<{ avatarUrl: string }> = await axios.post(`${this.baseUrl}/${id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.avatarUrl;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'An error occurred with the profile service');
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

export const profileService = new ProfileService();
export type { UserProfile, ProfileUpdateData }; 