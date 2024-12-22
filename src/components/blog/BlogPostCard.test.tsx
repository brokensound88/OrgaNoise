import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { BlogPostCard } from './BlogPostCard';

const mockPost = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'Test excerpt',
  content: 'Test content',
  category: 'Technology',
  author: 'Test Author',
  publishedAt: '2024-03-20',
  readTime: 5,
  tags: ['test'],
  imageUrl: 'https://example.com/image.jpg',
};

describe('BlogPostCard', () => {
  it('renders post information correctly', () => {
    render(<BlogPostCard post={mockPost} />);
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    expect(screen.getByText(mockPost.author)).toBeInTheDocument();
    expect(screen.getByText(`${mockPost.readTime} min read`)).toBeInTheDocument();
  });

  it('links to the full post', () => {
    render(<BlogPostCard post={mockPost} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/blog/${mockPost.slug}`);
  });
});