import axios from 'axios';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  heading: string;
  link: string;
}

export interface ThemeLayout {
  type: 'classic' | 'modern' | 'minimal' | 'custom';
  sidebar: 'left' | 'right' | 'none';
  headerStyle: 'fixed' | 'sticky' | 'static';
  contentWidth: 'full' | 'contained';
  spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface CustomCSS {
  id: string;
  name: string;
  css: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  id: string;
  userId: string;
  name: string;
  colors: ThemeColors;
  layout: ThemeLayout;
  customCSS?: CustomCSS;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateThemeData {
  name: string;
  colors: ThemeColors;
  layout: ThemeLayout;
  customCSS?: {
    name: string;
    css: string;
  };
}

export interface UpdateThemeData {
  name?: string;
  colors?: Partial<ThemeColors>;
  layout?: Partial<ThemeLayout>;
  customCSS?: {
    name?: string;
    css?: string;
  };
}

class ThemeService {
  private baseUrl = '/api/themes';

  async getThemes(userId: string): Promise<Theme[]> {
    try {
      const response = await axios.get<Theme[]>(`${this.baseUrl}/${userId}`);
      return response.data.map(theme => ({
        ...theme,
        createdAt: new Date(theme.createdAt),
        updatedAt: new Date(theme.updatedAt),
        customCSS: theme.customCSS ? {
          ...theme.customCSS,
          createdAt: new Date(theme.customCSS.createdAt),
          updatedAt: new Date(theme.customCSS.updatedAt),
        } : undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch themes:', error);
      throw error;
    }
  }

  async getActiveTheme(userId: string): Promise<Theme | null> {
    try {
      const response = await axios.get<Theme>(`${this.baseUrl}/${userId}/active`);
      const theme = response.data;
      return {
        ...theme,
        createdAt: new Date(theme.createdAt),
        updatedAt: new Date(theme.updatedAt),
        customCSS: theme.customCSS ? {
          ...theme.customCSS,
          createdAt: new Date(theme.customCSS.createdAt),
          updatedAt: new Date(theme.customCSS.updatedAt),
        } : undefined,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Failed to fetch active theme:', error);
      throw error;
    }
  }

  async createTheme(userId: string, data: CreateThemeData): Promise<Theme> {
    try {
      const response = await axios.post<Theme>(`${this.baseUrl}/${userId}`, data);
      const theme = response.data;
      return {
        ...theme,
        createdAt: new Date(theme.createdAt),
        updatedAt: new Date(theme.updatedAt),
        customCSS: theme.customCSS ? {
          ...theme.customCSS,
          createdAt: new Date(theme.customCSS.createdAt),
          updatedAt: new Date(theme.customCSS.updatedAt),
        } : undefined,
      };
    } catch (error) {
      console.error('Failed to create theme:', error);
      throw error;
    }
  }

  async updateTheme(userId: string, themeId: string, data: UpdateThemeData): Promise<Theme> {
    try {
      const response = await axios.put<Theme>(`${this.baseUrl}/${userId}/${themeId}`, data);
      const theme = response.data;
      return {
        ...theme,
        createdAt: new Date(theme.createdAt),
        updatedAt: new Date(theme.updatedAt),
        customCSS: theme.customCSS ? {
          ...theme.customCSS,
          createdAt: new Date(theme.customCSS.createdAt),
          updatedAt: new Date(theme.customCSS.updatedAt),
        } : undefined,
      };
    } catch (error) {
      console.error('Failed to update theme:', error);
      throw error;
    }
  }

  async deleteTheme(userId: string, themeId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${userId}/${themeId}`);
    } catch (error) {
      console.error('Failed to delete theme:', error);
      throw error;
    }
  }

  async setActiveTheme(userId: string, themeId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${userId}/${themeId}/activate`);
    } catch (error) {
      console.error('Failed to set active theme:', error);
      throw error;
    }
  }

  async previewTheme(userId: string, data: CreateThemeData): Promise<string> {
    try {
      const response = await axios.post<{ previewUrl: string }>(
        `${this.baseUrl}/${userId}/preview`,
        data
      );
      return response.data.previewUrl;
    } catch (error) {
      console.error('Failed to generate theme preview:', error);
      throw error;
    }
  }
}

export const themeService = new ThemeService(); 