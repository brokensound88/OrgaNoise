import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>Current theme: {theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default theme', () => {
    render(<TestComponent />, { wrapper: ThemeProvider });
    expect(screen.getByText(/Current theme:/)).toBeInTheDocument();
  });

  it('toggles theme', () => {
    render(<TestComponent />, { wrapper: ThemeProvider });
    
    const initialTheme = screen.getByText(/Current theme:/).textContent;
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    const newTheme = screen.getByText(/Current theme:/).textContent;
    expect(newTheme).not.toBe(initialTheme);
  });
});