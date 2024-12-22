import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LoadingProvider } from '../../contexts/LoadingContext';

interface WrapperProps {
  children: React.ReactNode;
}

export function Providers({ children }: WrapperProps) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: Providers, ...options });
}