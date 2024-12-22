import { describe, it, expect } from 'vitest';
import { render } from '../../utils/test-utils';
import { MetaTags } from './MetaTags';

describe('MetaTags', () => {
  const metadata = {
    title: 'Test Page',
    description: 'Test description',
    keywords: ['test', 'seo'],
    ogImage: 'https://example.com/image.jpg',
  };

  it('renders meta tags correctly', () => {
    const { container } = render(<MetaTags metadata={metadata} />);
    
    // Title
    const title = container.querySelector('title');
    expect(title?.textContent).toBe('Test Page | OrgaNoise');

    // Meta tags
    const metaTags = container.querySelectorAll('meta');
    const metaContent = Array.from(metaTags).map(tag => ({
      name: tag.getAttribute('name') || tag.getAttribute('property'),
      content: tag.getAttribute('content'),
    }));

    expect(metaContent).toContainEqual({
      name: 'description',
      content: metadata.description,
    });

    expect(metaContent).toContainEqual({
      name: 'keywords',
      content: metadata.keywords.join(', '),
    });

    expect(metaContent).toContainEqual({
      name: 'og:image',
      content: metadata.ogImage,
    });
  });
});