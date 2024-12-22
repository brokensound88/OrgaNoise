import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label and children', () => {
    render(
      <FormField label="Test Field">
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(
      <FormField label="Test Field" required>
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error and touched are true', () => {
    const errorMessage = 'This field is required';
    render(
      <FormField label="Test Field" error={errorMessage} touched>
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});