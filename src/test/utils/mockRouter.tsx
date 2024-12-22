import React from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

interface MockRouterProps extends MemoryRouterProps {
  children: React.ReactNode;
}

export function MockRouter({ children, ...props }: MockRouterProps) {
  return <MemoryRouter {...props}>{children}</MemoryRouter>;
}