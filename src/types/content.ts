export interface CompanyHistory {
  year: number;
  title: string;
  description: string;
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  image?: string;
  technologies: string[];
  outcomes: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  image?: string;
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}