import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />);
    expect(screen.getByText(/Innovating for a/)).toBeInTheDocument();
    expect(screen.getByText(/Sustainable Tomorrow/)).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<Hero />);
    expect(screen.getByText('Learn More')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Contact Us')).toHaveAttribute('href', '/contact');
  });
});