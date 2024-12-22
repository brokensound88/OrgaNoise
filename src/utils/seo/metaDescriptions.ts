interface MetaDescription {
  path: string;
  title: string;
  description: string;
  keywords: string[];
}

export const metaDescriptions: MetaDescription[] = [
  {
    path: '/',
    title: 'OrgaNoise - Innovating for a Sustainable Tomorrow',
    description: 'OrgaNoise leads innovation across technology, AI, blockchain, and sustainable farming, creating positive impact through ethical business practices.',
    keywords: ['innovation', 'sustainability', 'technology', 'ethical AI', 'blockchain']
  },
  {
    path: '/about',
    title: 'About OrgaNoise - Our Mission and Vision',
    description: 'Learn about OrgaNoise\'s mission to drive innovation and sustainability across industries through ethical and environmentally-conscious practices.',
    keywords: ['about', 'mission', 'vision', 'values', 'company']
  },
  {
    path: '/projects',
    title: 'OrgaNoise Projects - Innovation in Action',
    description: 'Explore OrgaNoise\'s innovative projects across technology, AI, blockchain, and sustainable farming sectors.',
    keywords: ['projects', 'innovation', 'technology', 'sustainability']
  }
];