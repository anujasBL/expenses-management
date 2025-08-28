import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExpenses } from '@/hooks/useExpenses';
import { mockExpenses, mockCategories } from '../../fixtures/mock-data';
import { mockApiSuccess, mockApiError } from '../../utils/test-utils';

// Mock the API service
const mockApi = {
  expenses: {
    getAll: jest.fn(),
    getById: jest.fn(),
    saveNew: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  categories: {
    getAll: jest.fn(),
    getById: jest.fn(),
    saveNew: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@/services/api', () => ({
  api: mockApi,
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock constants
jest.mock('@/constants', () => ({
  EXPENSE_CATEGORIES: [
    {
      id: '1',
      name: 'Food & Dining',
      color: '#ef4444',
      icon: 'utensils',
      description: 'Food and dining expenses',
    },
  ],
}));

const createWrapper = () => {
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

  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useExpenses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data Fetching', () => {
    it('fetches expenses successfully', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('handles fetch error gracefully', async () => {
      const errorMessage = 'Failed to fetch expenses';
      mockApi.expenses.getAll.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.expenses).toEqual([]);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('shows loading state while fetching', () => {
      mockApi.expenses.getAll.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.expenses).toEqual([]);
    });

    it('refetches expenses when refetchExpenses is called', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      // Mock a different response for refetch
      const newExpenses = [...mockExpenses, { ...mockExpenses[0], id: '6' }];
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(newExpenses));

      await result.current.refetchExpenses();

      await waitFor(() => {
        expect(result.current.expenses).toEqual(newExpenses);
      });
    });
  });

  describe('Adding Expenses', () => {
    it('adds new expense successfully', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      const newExpense = { ...mockExpenses[0], id: 'new-expense' };
      mockApi.expenses.saveNew.mockResolvedValue(mockApiSuccess(newExpense));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 35.00,
        description: 'Coffee and pastry',
        category: '1',
        date: new Date('2024-01-16'),
      };

      await result.current.addExpense(formData);

      await waitFor(() => {
        expect(mockApi.expenses.saveNew).toHaveBeenCalledWith({
          id: 'test-uuid-123',
          amount: 35.00,
          description: 'Coffee and pastry',
          category: expect.objectContaining({
            id: '1',
            name: 'Food & Dining',
          }),
          date: new Date('2024-01-16'),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });
    });

    it('handles add expense error', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      const errorMessage = 'Failed to add expense';
      mockApi.expenses.saveNew.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 35.00,
        description: 'Coffee and pastry',
        category: '1',
        date: new Date('2024-01-16'),
      };

      await expect(result.current.addExpense(formData)).rejects.toThrow(errorMessage);
    });

    it('updates local state optimistically when adding expense', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      const newExpense = { ...mockExpenses[0], id: 'new-expense' };
      mockApi.expenses.saveNew.mockResolvedValue(mockApiSuccess(newExpense));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 35.00,
        description: 'Coffee and pastry',
        category: '1',
        date: new Date('2024-01-16'),
      };

      const addPromise = result.current.addExpense(formData);

      // Check optimistic update
      expect(result.current.expenses).toHaveLength(mockExpenses.length + 1);
      expect(result.current.expenses[mockExpenses.length]).toMatchObject({
        amount: 35.00,
        description: 'Coffee and pastry',
      });

      await addPromise;
    });
  });

  describe('Updating Expenses', () => {
    it('updates existing expense successfully', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      const updatedExpense = { ...mockExpenses[0], description: 'Updated lunch' };
      mockApi.expenses.update.mockResolvedValue(mockApiSuccess(updatedExpense));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 25.50,
        description: 'Updated lunch',
        category: '1',
        date: new Date('2024-01-15'),
      };

      await result.current.updateExpense('1', formData);

      await waitFor(() => {
        expect(mockApi.expenses.update).toHaveBeenCalledWith({
          id: '1',
          amount: 25.50,
          description: 'Updated lunch',
          category: expect.objectContaining({
            id: '1',
            name: 'Food & Dining',
          }),
          date: new Date('2024-01-15'),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });
    });

    it('handles update expense error', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      const errorMessage = 'Failed to update expense';
      mockApi.expenses.update.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 25.50,
        description: 'Updated lunch',
        category: '1',
        date: new Date('2024-01-15'),
      };

      await expect(result.current.updateExpense('1', formData)).rejects.toThrow(errorMessage);
    });

    it('updates local state optimistically when updating expense', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      const updatedExpense = { ...mockExpenses[0], description: 'Updated lunch' };
      mockApi.expenses.update.mockResolvedValue(mockApiSuccess(updatedExpense));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 25.50,
        description: 'Updated lunch',
        category: '1',
        date: new Date('2024-01-15'),
      };

      const updatePromise = result.current.updateExpense('1', formData);

      // Check optimistic update
      const updatedExpenseInList = result.current.expenses.find(exp => exp.id === '1');
      expect(updatedExpenseInList?.description).toBe('Updated lunch');

      await updatePromise;
    });
  });

  describe('Deleting Expenses', () => {
    it('deletes expense successfully', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      mockApi.expenses.delete.mockResolvedValue(mockApiSuccess({}));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      await result.current.deleteExpense('1');

      await waitFor(() => {
        expect(mockApi.expenses.delete).toHaveBeenCalledWith('1');
      });
    });

    it('handles delete expense error', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      const errorMessage = 'Failed to delete expense';
      mockApi.expenses.delete.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      await expect(result.current.deleteExpense('1')).rejects.toThrow(errorMessage);
    });

    it('removes expense from local state optimistically when deleting', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      mockApi.expenses.delete.mockResolvedValue(mockApiSuccess({}));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const deletePromise = result.current.deleteExpense('1');

      // Check optimistic update
      expect(result.current.expenses).toHaveLength(mockExpenses.length - 1);
      expect(result.current.expenses.find(exp => exp.id === '1')).toBeUndefined();

      await deletePromise;
    });
  });

  describe('Category Management', () => {
    it('finds category by ID correctly', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const category = result.current.findCategoryById('1');
      expect(category).toEqual(expect.objectContaining({
        id: '1',
        name: 'Food & Dining',
      }));
    });

    it('returns undefined for non-existent category ID', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const category = result.current.findCategoryById('non-existent');
      expect(category).toBeUndefined();
    });
  });

  describe('Data Calculations', () => {
    it('calculates total expenses correctly', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const total = result.current.totalExpenses;
      const expectedTotal = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      expect(total).toBe(expectedTotal);
    });

    it('calculates current month expenses correctly', async () => {
      const currentMonthExpenses = mockExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        const now = new Date();
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      });

      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const currentMonthTotal = result.current.currentMonthExpenses;
      const expectedTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      expect(currentMonthTotal).toBe(expectedTotal);
    });

    it('calculates average expense correctly', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const average = result.current.averageExpense;
      const total = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const expectedAverage = total / mockExpenses.length;
      expect(average).toBe(expectedAverage);
    });

    it('returns 0 for average when no expenses exist', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess([]));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual([]);
      });

      const average = result.current.averageExpense;
      expect(average).toBe(0);
    });
  });

  describe('Mutation States', () => {
    it('tracks add expense mutation state', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      mockApi.expenses.saveNew.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 35.00,
        description: 'Coffee and pastry',
        category: '1',
        date: new Date('2024-01-16'),
      };

      const addPromise = result.current.addExpense(formData);

      // Check that mutation is pending
      expect(result.current.addExpenseMutation.isPending).toBe(true);

      // Clean up
      addPromise.catch(() => {}); // Suppress unhandled rejection warning
    });

    it('tracks update expense mutation state', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      mockApi.expenses.update.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const formData = {
        amount: 25.50,
        description: 'Updated lunch',
        category: '1',
        date: new Date('2024-01-15'),
      };

      const updatePromise = result.current.updateExpense('1', formData);

      // Check that mutation is pending
      expect(result.current.updateExpenseMutation.isPending).toBe(true);

      // Clean up
      updatePromise.catch(() => {}); // Suppress unhandled rejection warning
    });

    it('tracks delete expense mutation state', async () => {
      mockApi.expenses.getAll.mockResolvedValue(mockApiSuccess(mockExpenses));
      mockApi.expenses.delete.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
      });

      const deletePromise = result.current.deleteExpense('1');

      // Check that mutation is pending
      expect(result.current.deleteExpenseMutation.isPending).toBe(true);

      // Clean up
      deletePromise.catch(() => {}); // Suppress unhandled rejection warning
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const networkError = new Error('Network error');
      mockApi.expenses.getAll.mockRejectedValue(networkError);

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.expenses).toEqual([]);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('handles API errors with custom messages', async () => {
      const apiError = new Error('API Error: Invalid data');
      mockApi.expenses.getAll.mockRejectedValue(apiError);

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBe('API Error: Invalid data');
        expect(result.current.expenses).toEqual([]);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('clears error when successful operation occurs', async () => {
      // First call fails
      mockApi.expenses.getAll.mockRejectedValueOnce(new Error('Initial error'));
      // Second call succeeds
      mockApi.expenses.getAll.mockResolvedValueOnce(mockApiSuccess(mockExpenses));

      const { result } = renderHook(() => useExpenses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Initial error');
      });

      // Trigger refetch
      await result.current.refetchExpenses();

      await waitFor(() => {
        expect(result.current.error).toBe(null);
        expect(result.current.expenses).toEqual(mockExpenses);
      });
    });
  });
});
