import axios from 'axios';

export interface BaseSection {
  id: string;
  userId: string;
  type: string;
  title: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfoSection extends BaseSection {
  type: 'personal-info';
  data: {
    fullName: string;
    headline: string;
    summary: string;
    location: string;
    website?: string;
    socialLinks: {
      platform: string;
      url: string;
    }[];
  };
}

export interface WorkHistorySection extends BaseSection {
  type: 'work-history';
  data: {
    positions: {
      id: string;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description: string;
      achievements: string[];
    }[];
  };
}

export interface SkillsSection extends BaseSection {
  type: 'skills';
  data: {
    categories: {
      name: string;
      skills: {
        name: string;
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        yearsOfExperience?: number;
        endorsements?: number;
      }[];
    }[];
  };
}

export type ProfileSection = PersonalInfoSection | WorkHistorySection | SkillsSection;

export interface CreateSectionData {
  type: ProfileSection['type'];
  title: string;
  order?: number;
  isVisible?: boolean;
  data: ProfileSection['data'];
}

export interface UpdateSectionData {
  title?: string;
  order?: number;
  isVisible?: boolean;
  data?: Partial<ProfileSection['data']>;
}

export interface SectionOrderUpdate {
  sectionId: string;
  newOrder: number;
}

class ProfileSectionService {
  private baseUrl = '/api/profile-sections';

  async getSections(userId: string): Promise<ProfileSection[]> {
    try {
      const response = await axios.get<ProfileSection[]>(`${this.baseUrl}/${userId}`);
      return response.data.map(section => ({
        ...section,
        createdAt: new Date(section.createdAt),
        updatedAt: new Date(section.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch profile sections:', error);
      throw error;
    }
  }

  async getSection(userId: string, sectionId: string): Promise<ProfileSection> {
    try {
      const response = await axios.get<ProfileSection>(`${this.baseUrl}/${userId}/${sectionId}`);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to fetch profile section:', error);
      throw error;
    }
  }

  async createSection(userId: string, data: CreateSectionData): Promise<ProfileSection> {
    try {
      const response = await axios.post<ProfileSection>(`${this.baseUrl}/${userId}`, data);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to create profile section:', error);
      throw error;
    }
  }

  async updateSection(
    userId: string,
    sectionId: string,
    data: UpdateSectionData
  ): Promise<ProfileSection> {
    try {
      const response = await axios.put<ProfileSection>(
        `${this.baseUrl}/${userId}/${sectionId}`,
        data
      );
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update profile section:', error);
      throw error;
    }
  }

  async deleteSection(userId: string, sectionId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/${sectionId}`);
    } catch (error) {
      console.error('Failed to delete profile section:', error);
      throw error;
    }
  }

  async updateSectionsOrder(userId: string, updates: SectionOrderUpdate[]): Promise<ProfileSection[]> {
    try {
      const response = await axios.put<ProfileSection[]>(
        `${this.baseUrl}/${userId}/order`,
        { updates }
      );
      return response.data.map(section => ({
        ...section,
        createdAt: new Date(section.createdAt),
        updatedAt: new Date(section.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to update sections order:', error);
      throw error;
    }
  }

  async getSectionTemplates(type: ProfileSection['type']): Promise<CreateSectionData[]> {
    try {
      const response = await axios.get<CreateSectionData[]>(
        `${this.baseUrl}/templates/${type}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch section templates:', error);
      throw error;
    }
  }
}

export const profileSectionService = new ProfileSectionService(); 