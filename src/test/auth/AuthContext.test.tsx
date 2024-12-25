import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

describe('AuthContext', () => {
  it('provides authentication context', () => {
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <div data-testid="auth-status">{auth.isAuthenticated.toString()}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('auth-status')).toHaveTextContent('false');
  });

  // Add more tests...
}); 