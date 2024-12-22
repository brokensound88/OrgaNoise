import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { Features } from './Features';

describe('Features', () => {
  it('renders section title', () => {
    render(<Features />);
    expect(screen.getByText('Our Innovative Solutions')).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<Features />);
    const features = [
      'Advanced Technology',
      'Ethical AI',
      'Blockchain Solutions',
      'Sustainable Farming',
      'Supply Chain'
    ];
    
    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('renders feature descriptions', () => {
    render(<Features />);
    expect(screen.getByText('Cutting-edge solutions for tomorrow\'s challenges')).toBeInTheDocument();
    expect(screen.getByText('Responsible artificial intelligence development')).toBeInTheDocument();
  });

  it('renders company names', () => {
    render(<Features />);
    const companies = ['Aevum Ltd', 'Alfred AI', 'Shift', 'Koomi Farms', 'Nido Super'];
    companies.forEach(company => {
      expect(screen.getByText(company)).toBeInTheDocument();
    });
  });
});