import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test data helpers
export const createMockExpense = (overrides = {}) => ({
  id: 'test-expense-1',
  amount: 25.50,
  description: 'Test expense',
  category: {
    id: '1',
    name: 'Food & Dining',
    color: '#ef4444',
    icon: 'utensils',
    description: 'Test category',
  },
  date: new Date('2024-01-15'),
  createdAt: new Date('2024-01-15T12:00:00Z'),
  updatedAt: new Date('2024-01-15T12:00:00Z'),
  ...overrides,
});

export const createMockCategory = (overrides = {}) => ({
  id: '1',
  name: 'Test Category',
  color: '#ef4444',
  icon: 'test-icon',
  description: 'Test category description',
  ...overrides,
});

// Async utilities
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

export const waitForElementToBeRemoved = (element: HTMLElement) =>
  new Promise(resolve => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve(undefined);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

// Form testing helpers
export const fillExpenseForm = async (user: any, formData: any) => {
  const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement;
  const descriptionInput = document.querySelector('input[name="description"]') as HTMLInputElement;
  const categorySelect = document.querySelector('select[name="category"]') as HTMLSelectElement;
  const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;

  if (amountInput) await user.type(amountInput, formData.amount.toString());
  if (descriptionInput) await user.type(descriptionInput, formData.description);
  if (categorySelect) await user.selectOptions(categorySelect, formData.category);
  if (dateInput) await user.type(dateInput, formData.date.toISOString().split('T')[0]);
};

// Mock API responses
export const mockApiSuccess = (data: any) => ({
  success: true,
  data,
  message: 'Operation successful',
});

export const mockApiError = (error: string) => ({
  success: false,
  error,
  message: 'Operation failed',
});

// Storage mocking
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};
