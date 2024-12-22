import { Project } from '../types/content';

export const projects: Project[] = [
  {
    id: 'aevum',
    title: 'Aevum Ltd',
    description: 'Advanced technology development for future-ready solutions',
    longDescription: 'Aevum develops cutting-edge technologies that bridge the gap between current capabilities and future needs, focusing on sustainable and scalable solutions.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    technologies: ['Quantum Computing', 'Advanced Materials', 'Renewable Energy'],
    outcomes: [
      'Reduced energy consumption by 40%',
      'Increased processing efficiency by 300%',
      'Developed 5 patent-pending technologies'
    ]
  },
  {
    id: 'alfred-ai',
    title: 'Alfred AI',
    description: 'Ethical AI platforms for responsible automation',
    longDescription: 'Alfred AI creates artificial intelligence solutions that prioritize ethical considerations while delivering powerful automation capabilities.',
    category: 'Artificial Intelligence',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b',
    technologies: ['Machine Learning', 'Natural Language Processing', 'Computer Vision'],
    outcomes: [
      'Achieved 99.9% accuracy in ethical decision making',
      'Reduced bias in AI models by 85%',
      'Implemented in 100+ organizations'
    ]
  }
];