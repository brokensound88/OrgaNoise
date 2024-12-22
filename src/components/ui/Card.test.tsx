import { describe, it, expect } from 'vitest';
import { render } from '../../utils/test-utils';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(getByText('Card content')).toBeInTheDocument();
  });

  it('applies hover styles when hover prop is true', () => {
    const { container } = render(<Card hover>Content</Card>);
    expect(container.firstChild).toHaveClass('hover:shadow-lg');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});