import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Navbar />);
    
    const menuButton = screen.getByRole('button');
    expect(screen.queryByRole('navigation')).not.toBeVisible();
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toBeVisible();
    
    fireEvent.click(menuButton);
    expect(screen.queryByRole('navigation')).not.toBeVisible();
  });
});