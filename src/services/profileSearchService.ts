import axios from 'axios';

export interface SearchFilters {
  keywords?: string;
  skills?: string[];
  location?: string;
  experience?: {
    min?: number;
    max?: number;
  };
  availability?: 'full-time' | 'part-time' | 'contract';
  industry?: string[];
  sortBy?: 'relevance' | 'experience' | 'location' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  name: string;
  title: string;
  location: string;
  skills: string[];
  experience: number;
  availability: string;
  industry: string[];
  avatarUrl?: string;
  matchScore: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ProfileSearchService {
  private baseUrl = '/api/profile-search';

  // Search profiles with filters
  async searchProfiles(filters: SearchFilters): Promise<SearchResponse> {
    try {
      const response = await axios.post<SearchResponse>(`${this.baseUrl}/search`, filters);
      return response.data;
    } catch (error) {
      console.error('Failed to search profiles:', error);
      throw error;
    }
  }

  // Get search suggestions based on partial input
  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${this.baseUrl}/suggestions`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get search suggestions:', error);
      throw error;
    }
  }

  // Save a search for later use
  async saveSearch(userId: string, name: string, filters: SearchFilters): Promise<SavedSearch> {
    try {
      const response = await axios.post<SavedSearch>(`${this.baseUrl}/saved`, {
        userId,
        name,
        filters,
      });
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to save search:', error);
      throw error;
    }
  }

  // Get user's saved searches
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
      const response = await axios.get<SavedSearch[]>(`${this.baseUrl}/saved/${userId}`);
      return response.data.map(search => ({
        ...search,
        createdAt: new Date(search.createdAt),
        updatedAt: new Date(search.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to get saved searches:', error);
      throw error;
    }
  }

  // Delete a saved search
  async deleteSavedSearch(userId: string, searchId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/saved/${userId}/${searchId}`);
    } catch (error) {
      console.error('Failed to delete saved search:', error);
      throw error;
    }
  }

  // Get available filter options
  async getFilterOptions(): Promise<{
    skills: string[];
    industries: string[];
    locations: string[];
  }> {
    try {
      const response = await axios.get<{
        skills: string[];
        industries: string[];
        locations: string[];
      }>(`${this.baseUrl}/filter-options`);
      return response.data;
    } catch (error) {
      console.error('Failed to get filter options:', error);
      throw error;
    }
  }
}

export const profileSearchService = new ProfileSearchService(); 