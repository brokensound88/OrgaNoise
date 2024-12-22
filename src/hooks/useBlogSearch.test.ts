import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBlogSearch } from './useBlogSearch';

const mockPosts = [
  {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    excerpt: 'Test excerpt',
    content: 'Test content',
    category: 'Technology',
    author: 'Test Author',
    publishedAt: '2024-03-20',
    readTime: 5,
    tags: ['test', 'technology'],
  },
  {
    id: '2',
    title: 'Another Post',
    slug: 'another-post',
    excerpt: 'Another excerpt',
    content: 'Another content',
    category: 'AI',
    author: 'Another Author',
    publishedAt: '2024-03-21',
    readTime: 3,
    tags: ['ai', 'future'],
  },
];

describe('useBlogSearch', () => {
  it('returns all posts when query is empty', () => {
    const { result } = renderHook(() => useBlogSearch(mockPosts, ''));
    expect(result.current).toHaveLength(mockPosts.length);
  });

  it('filters posts based on search query', () => {
    const { result } = renderHook(() => useBlogSearch(mockPosts, 'technology'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('1');
  });

  it('searches across multiple fields', () => {
    const { result } = renderHook(() => useBlogSearch(mockPosts, 'ai'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].category).toBe('AI');
  });
});