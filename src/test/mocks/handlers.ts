import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/blog-posts', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        category: 'Technology',
        author: 'Test Author',
        publishedAt: '2024-03-20',
        readTime: 5,
        tags: ['test', 'technology'],
      },
    ]);
  }),
];