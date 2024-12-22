import { TeamMember } from '../types/content';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Chief Executive Officer',
    bio: 'With over 15 years of experience in technology and sustainable business practices, Sarah leads OrgaNoise\'s mission to drive innovation across industries.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen'
    }
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Chief Technology Officer',
    bio: 'Marcus brings extensive experience in AI and blockchain technology, leading our technical initiatives across all subsidiaries.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/marcusrodriguez',
      github: 'https://github.com/marcusrodriguez'
    }
  },
  {
    id: '3',
    name: 'Dr. Amara Patel',
    role: 'Head of AI Ethics',
    bio: 'Dr. Patel ensures our AI developments maintain the highest ethical standards while pushing technological boundaries.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/amarapatel'
    }
  }
];