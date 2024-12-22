import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders company info', () => {
    render(<Footer />);
    expect(screen.getByText('OrgaNoise')).toBeInTheDocument();
    expect(screen.getByText('Innovating for a Sustainable Tomorrow')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Footer />);
    const links = ['About Us', 'Projects', 'Blog', 'Contact'];
    links.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders contact information', () => {
    render(<Footer />);
    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('contact@organoise.com')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole('link', { name: '' });
    expect(socialLinks).toHaveLength(3); // LinkedIn, Twitter, GitHub
  });
});