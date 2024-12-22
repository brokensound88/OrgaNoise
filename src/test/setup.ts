import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import { server } from './mocks/server';
import { setupIntersectionObserverMock } from './utils/mockIntersectionObserver';
import { setupMatchMediaMock } from './utils/mockMatchMedia';
import { setupResizeObserverMock } from './utils/mockResizeObserver';
import { setupStorageMock } from './utils/mockStorage';

// Extend matchers
expect.extend(matchers);

// Setup MSW
beforeAll(() => {
  // Setup all mocks
  setupIntersectionObserverMock();
  setupMatchMediaMock();
  setupResizeObserverMock();
  setupStorageMock();
  
  // Start MSW
  server.listen({ onUnhandledRequest: 'error' });
  
  // Mock console.error and console.warn
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

afterAll(() => {
  server.close();
  vi.restoreAllMocks();
});

// Set timezone for consistent date testing
process.env.TZ = 'UTC';

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock window.matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));