import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-testid',
});

beforeAll(() => {
  if (typeof window === 'undefined') return;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});