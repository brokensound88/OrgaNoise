import React from 'react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';

const posts = [
  {
    title: 'The Future of Sustainable Technology',
    excerpt: 'Exploring how sustainable technology is shaping our future...',
    date: '2024-03-15',
    category: 'Technology',
  },
  {
    title: 'Ethical AI Development',
    excerpt: 'Understanding the importance of ethics in AI development...',
    date: '2024-03-10',
    category: 'AI',
  },
  {
    title: 'Blockchain in Modern Commerce',
    excerpt: 'How blockchain is revolutionizing payment systems...',
    date: '2024-03-05',
    category: 'Blockchain',
  },
];

export function Blog() {
  return (
    <Section className="py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Updates</h1>
      <div className="grid gap-8">
        {posts.map((post) => (
          <Card key={post.title} hover>
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <time className="text-sm text-gray-500">{post.date}</time>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}