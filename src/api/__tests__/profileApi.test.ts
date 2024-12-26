import axios from 'axios';
import { profileApi } from '../profileApi';
import { Profile, ProfileVisibility, ProfileTheme } from '../../types/profile';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProfileApi', () => {
  // Test data
  const mockProfile: Profile = {
    id: '123',
    username: 'testuser',
    email: 'test@example.com',
    fullName: 'Test User',
    bio: 'Test bio',
    skills: ['JavaScript', 'TypeScript'],
    experience: [{
      title: 'Developer',
      company: 'Test Co',
      startDate: '2020-01-01',
      endDate: '2023-01-01',
      description: 'Test role'
    }],
    education: [{
      degree: 'BS',
      institution: 'Test University',
      graduationYear: 2020,
      field: 'Computer Science'
    }],
    socialLinks: [{
      platform: 'GitHub',
      url: 'https://github.com/testuser'
    }],
    badges: [{
      id: 'badge1',
      type: 'skill',
      name: 'JavaScript Expert',
      description: 'Advanced JavaScript skills',
      issuedAt: '2023-01-01'
    }],
    visibility: {
      email: 'private',
      phone: 'private',
      location: 'public',
      experience: 'public',
      education: 'public',
      skills: 'public',
      socialLinks: 'public',
      badges: 'public',
      activity: 'public'
    },
    theme: {
      colorScheme: 'light',
      primaryColor: '#000000',
      accentColor: '#ffffff',
      fontFamily: 'Arial',
      layout: 'default'
    },
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Unit Tests
  describe('Unit Tests', () => {
    describe('getPublicProfile', () => {
      it('should fetch public profile successfully', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockProfile });
        
        const result = await profileApi.getPublicProfile('testuser');
        
        expect(result).toEqual(mockProfile);
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/profiles/public/testuser');
      });

      it('should handle errors when fetching public profile', async () => {
        const error = new Error('Network error');
        mockedAxios.get.mockRejectedValueOnce(error);
        
        await expect(profileApi.getPublicProfile('testuser')).rejects.toThrow('Network error');
      });
    });

    describe('searchPublicProfiles', () => {
      it('should search public profiles with query parameters', async () => {
        const mockResponse = { profiles: [mockProfile], total: 1 };
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
        
        const query = { keyword: 'test', skills: ['JavaScript'] };
        const result = await profileApi.searchPublicProfiles(query);
        
        expect(result).toEqual(mockResponse);
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/profiles/public/search', { params: query });
      });
    });

    describe('updateProfile', () => {
      it('should update profile successfully', async () => {
        mockedAxios.patch.mockResolvedValueOnce({ data: mockProfile });
        
        const updateData = { bio: 'Updated bio' };
        const result = await profileApi.updateProfile('123', updateData);
        
        expect(result).toEqual(mockProfile);
        expect(mockedAxios.patch).toHaveBeenCalledWith('/api/profiles/123', updateData);
      });
    });
  });

  // Integration Tests
  describe('Integration Tests', () => {
    describe('Profile CRUD Operations', () => {
      it('should perform full profile lifecycle', async () => {
        // Get profile
        mockedAxios.get.mockResolvedValueOnce({ data: mockProfile });
        const profile = await profileApi.getFullProfile('123');
        expect(profile).toEqual(mockProfile);

        // Update profile
        const updateData = { bio: 'Updated bio' };
        mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockProfile, ...updateData } });
        const updatedProfile = await profileApi.updateProfile('123', updateData);
        expect(updatedProfile.bio).toBe('Updated bio');

        // Update visibility
        const visibility: ProfileVisibility = { ...mockProfile.visibility, email: 'public' };
        mockedAxios.put.mockResolvedValueOnce({});
        await profileApi.updateVisibility('123', visibility);
        expect(mockedAxios.put).toHaveBeenCalledWith('/api/profiles/123/visibility', visibility);

        // Update theme
        const theme: ProfileTheme = { ...mockProfile.theme, colorScheme: 'dark' };
        mockedAxios.put.mockResolvedValueOnce({});
        await profileApi.updateTheme('123', theme);
        expect(mockedAxios.put).toHaveBeenCalledWith('/api/profiles/123/theme', theme);

        // Delete profile
        mockedAxios.delete.mockResolvedValueOnce({});
        await profileApi.deleteProfile('123');
        expect(mockedAxios.delete).toHaveBeenCalledWith('/api/profiles/123');
      });
    });

    describe('Profile Data Management', () => {
      it('should handle profile export and import', async () => {
        // Export profile
        const mockBlob = new Blob(['test data'], { type: 'application/json' });
        mockedAxios.get.mockResolvedValueOnce({
          data: mockBlob,
          headers: { 'content-type': 'application/json' }
        });
        const exportedData = await profileApi.exportProfile('123');
        expect(exportedData).toBeInstanceOf(Blob);

        // Import profile
        const formData = new FormData();
        formData.append('file', mockBlob);
        mockedAxios.post.mockResolvedValueOnce({});
        await profileApi.importProfile('123', formData);
        expect(mockedAxios.post).toHaveBeenCalledWith(
          '/api/profiles/123/import',
          formData,
          expect.any(Object)
        );
      });
    });
  });

  // E2E Tests
  describe('E2E Tests', () => {
    describe('Profile Analytics Flow', () => {
      it('should fetch analytics and generate reports', async () => {
        // Get analytics
        const mockAnalytics = {
          views: 100,
          interactions: 50,
          connections: 25,
          timeline: [
            { date: '2023-01-01', views: 10, interactions: 5 }
          ]
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockAnalytics });
        const analytics = await profileApi.getAnalytics('123', 'week');
        expect(analytics).toEqual(mockAnalytics);

        // Generate reports
        const mockReport = new Blob(['report data'], { type: 'application/pdf' });
        mockedAxios.get.mockResolvedValueOnce({
          data: mockReport,
          headers: { 'content-type': 'application/pdf' }
        });
        const report = await profileApi.generateReport('123', 'activity');
        expect(report).toBeInstanceOf(Blob);
      });
    });

    describe('Profile Search and Discovery', () => {
      it('should perform profile search with filters', async () => {
        const mockSearchResponse = {
          profiles: [mockProfile],
          total: 1
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockSearchResponse });
        
        const searchResult = await profileApi.searchPublicProfiles({
          keyword: 'developer',
          skills: ['JavaScript'],
          location: 'San Francisco',
          page: 1,
          limit: 10
        });

        expect(searchResult.profiles).toHaveLength(1);
        expect(searchResult.total).toBe(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          '/api/profiles/public/search',
          expect.any(Object)
        );
      });
    });
  });
}); 