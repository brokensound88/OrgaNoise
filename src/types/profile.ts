export interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    graduationYear: number;
    field?: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  badges: {
    id: string;
    type: 'achievement' | 'skill' | 'verification';
    name: string;
    description: string;
    issuedAt: string;
  }[];
  visibility: ProfileVisibility;
  theme: ProfileTheme;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileVisibility {
  email: 'public' | 'private' | 'connections';
  phone: 'public' | 'private' | 'connections';
  location: 'public' | 'private' | 'connections';
  experience: 'public' | 'private' | 'connections';
  education: 'public' | 'private' | 'connections';
  skills: 'public' | 'private' | 'connections';
  socialLinks: 'public' | 'private' | 'connections';
  badges: 'public' | 'private' | 'connections';
  activity: 'public' | 'private' | 'connections';
}

export interface ProfileTheme {
  colorScheme: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  layout: 'default' | 'compact' | 'expanded';
  customCss?: string;
} 