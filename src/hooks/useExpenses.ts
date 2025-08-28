import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Expense, ExpenseFormData } from '@/types';
import { api } from '@/services/api';
import { EXPENSE_CATEGORIES } from '@/constants';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing expenses with React Query patterns
 * Provides CRUD operations, caching, and optimistic updates
 */
export const useExpenses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // React Query client for cache management
  const queryClient = useQueryClient();

  // Query key for expenses
  const expensesQueryKey = ['expenses'];

  // Fetch expenses with React Query pattern
  const {
    data: expenses = [],
    isLoading: isFetching,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: expensesQueryKey,
    queryFn: async () => {
      try {
        const response = await api.expenses.getAll();
        // Ensure we return the correct type
        return (response.data || []) as Expense[];
      } catch (err) {
        throw new Error('Failed to load expenses');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (formData: ExpenseFormData) => {
      try {
        setIsLoading(true);
        setError(null);

        // Find the category object
        const category = EXPENSE_CATEGORIES.find(
          cat => cat.id === formData.category
        );
        if (!category) {
          throw new Error('Invalid category selected');
        }

        const newExpense: Expense = {
          id: uuidv4(),
          amount: formData.amount,
          description: formData.description,
          category,
          date: formData.date,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Add via API
        const createdExpense = await api.expenses.saveNew(newExpense);
        return createdExpense as Expense;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add expense';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: newExpense => {
      // Optimistically update the cache
      queryClient.setQueryData(expensesQueryKey, (oldData: Expense[] = []) => [
        ...oldData,
        newExpense,
      ]);

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    },
    onError: err => {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    },
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: ExpenseFormData;
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        // Find the category object
        const category = EXPENSE_CATEGORIES.find(
          cat => cat.id === formData.category
        );
        if (!category) {
          throw new Error('Invalid category selected');
        }

        const updatedExpense: Omit<Expense, 'id'> = {
          amount: formData.amount,
          description: formData.description,
          category,
          date: formData.date,
          createdAt:
            expenses.find(exp => exp.id === id)?.createdAt || new Date(),
          updatedAt: new Date(),
        };

        // Update via API
        const result = await api.expenses.update({ id, ...updatedExpense });
        return result as Expense;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update expense';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: updatedExpense => {
      // Optimistically update the cache
      queryClient.setQueryData(expensesQueryKey, (oldData: Expense[] = []) =>
        oldData.map(expense =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    },
    onError: err => {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Delete via API
        await api.expenses.delete(expenseId);
        return expenseId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete expense';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: deletedExpenseId => {
      // Optimistically update the cache
      queryClient.setQueryData(expensesQueryKey, (oldData: Expense[] = []) =>
        oldData.filter(expense => expense.id !== deletedExpenseId)
      );

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    },
    onError: err => {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    },
  });

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get expense by ID
  const getExpenseById = useCallback(
    (id: string) => {
      return expenses.find(expense => expense.id === id);
    },
    [expenses]
  );

  // Get expenses by category
  const getExpensesByCategory = useCallback(
    (categoryId: string) => {
      return expenses.filter(expense => expense.category.id === categoryId);
    },
    [expenses]
  );

  // Get expenses by date range
  const getExpensesByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return expenses.filter(
        expense => expense.date >= startDate && expense.date <= endDate
      );
    },
    [expenses]
  );

  // Calculate total amount
  const getTotalAmount = useCallback(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  // Calculate average amount
  const getAverageAmount = useCallback(() => {
    return expenses.length > 0 ? getTotalAmount() / expenses.length : 0;
  }, [expenses, getTotalAmount]);

  // Get current month expenses
  const getCurrentMonthExpenses = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return getExpensesByDateRange(startOfMonth, endOfMonth);
  }, [getExpensesByDateRange]);

  // Get current month total
  const getCurrentMonthTotal = useCallback(() => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    return currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  }, [getCurrentMonthExpenses]);

  return {
    // Data
    expenses,

    // Loading states
    isLoading: isLoading || isFetching,
    isFetching,
    isAdding: addExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,

    // Error handling
    error,
    clearError,

    // Mutations
    addExpense: addExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,

    // Queries
    refetchExpenses,

    // Utility functions
    getExpenseById,
    getExpensesByCategory,
    getExpensesByDateRange,
    getTotalAmount,
    getAverageAmount,
    getCurrentMonthExpenses,
    getCurrentMonthTotal,
  };
};
