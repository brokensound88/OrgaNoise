import { describe, it, expect } from 'vitest';
import { render } from '../../../utils/test-utils';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default size', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('w-8 h-8');
  });

  it('renders with different sizes', () => {
    const { rerender, container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass('w-4 h-4');

    rerender(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass('w-12 h-12');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});