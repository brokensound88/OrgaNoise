import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { Blog } from '../pages/Blog';
import { server } from '../test/mocks/server';
import { mockBlogPosts } from '../test/mocks/testData';

describe('Blog Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('loads and displays blog posts', async () => {
    render(<Blog />);

    await waitFor(() => {
      mockBlogPosts.forEach(post => {
        expect(screen.getByText(post.title)).toBeInTheDocument();
      });
    });
  });

  it('filters posts by search', async () => {
    render(<Blog />);

    await waitFor(() => {
      expect(screen.getByText(mockBlogPosts[0].title)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholder('Search posts...');
    fireEvent.change(searchInput, { target: { value: 'Ethical AI' } });

    await waitFor(() => {
      expect(screen.queryByText(mockBlogPosts[0].title)).not.toBeInTheDocument();
      expect(screen.getByText('Ethical AI Development')).toBeInTheDocument();
    });
  });

  it('filters posts by category', async () => {
    render(<Blog />);

    await waitFor(() => {
      expect(screen.getByText(mockBlogPosts[0].title)).toBeInTheDocument();
    });

    const categoryButton = screen.getByText('AI');
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.queryByText(mockBlogPosts[0].title)).not.toBeInTheDocument();
      expect(screen.getByText('Ethical AI Development')).toBeInTheDocument();
    });
  });
});