import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('renders as a link when "to" prop is provided', () => {
    render(<Button to="/about">About</Button>);
    const link = screen.getByText('About');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
  });
});