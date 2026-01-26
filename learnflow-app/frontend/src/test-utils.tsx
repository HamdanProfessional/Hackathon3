"""Test utilities for React components."""

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function with providers if needed
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  // Add any providers here (Theme, Router, etc.)
  return render(ui, options);
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
