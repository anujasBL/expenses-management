/**
 * Analytics utility functions for expense calculations and data processing
 */

import { Expense, SpendingSummary, CategoryBreakdown } from '@/types';
import { EXPENSE_CATEGORIES } from '@/constants';

/**
 * Calculate spending summary from expenses array
 */
export const calculateSpendingSummary = (expenses: Expense[]): SpendingSummary => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Filter current month expenses
  const currentMonthExpenses = expenses.filter(
    expense => expense.date >= startOfMonth && expense.date <= endOfMonth
  );

  // Calculate totals
  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const allTimeTotal = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const expenseCount = expenses.length;
  const averageAmount = expenseCount > 0 ? allTimeTotal / expenseCount : 0;

  return {
    currentMonthTotal,
    allTimeTotal,
    expenseCount,
    averageAmount,
  };
};

/**
 * Calculate category breakdown with totals and percentages
 */
export const calculateCategoryBreakdown = (expenses: Expense[]): CategoryBreakdown[] => {
  const allTimeTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryBreakdown = EXPENSE_CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(
      expense => expense.category.id === category.id
    );
    
    const total = categoryExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const percentage = allTimeTotal > 0 ? (total / allTimeTotal) * 100 : 0;

    return {
      category,
      total,
      percentage,
      count: categoryExpenses.length,
    };
  });

  // Sort by total amount (highest first) and filter out zero amounts
  return categoryBreakdown
    .filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total);
};

/**
 * Get expenses by category ID
 */
export const getExpensesByCategory = (
  expenses: Expense[], 
  categoryId: string
): Expense[] => {
  return expenses.filter(expense => expense.category.id === categoryId);
};

/**
 * Get expenses by date range
 */
export const getExpensesByDateRange = (
  expenses: Expense[],
  startDate: Date,
  endDate: Date
): Expense[] => {
  return expenses.filter(
    expense => expense.date >= startDate && expense.date <= endDate
  );
};

/**
 * Get current month expenses
 */
export const getCurrentMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return getExpensesByDateRange(expenses, startOfMonth, endOfMonth);
};

/**
 * Get previous month expenses for comparison
 */
export const getPreviousMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  return getExpensesByDateRange(expenses, startOfPrevMonth, endOfPrevMonth);
};

/**
 * Calculate monthly spending trend (current vs previous month)
 */
export const calculateMonthlyTrend = (expenses: Expense[]): {
  currentMonthTotal: number;
  previousMonthTotal: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'same';
} => {
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const previousMonthExpenses = getPreviousMonthExpenses(expenses);

  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const previousMonthTotal = previousMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  let changePercentage = 0;
  let trend: 'up' | 'down' | 'same' = 'same';

  if (previousMonthTotal > 0) {
    changePercentage = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    
    if (changePercentage > 0) {
      trend = 'up';
    } else if (changePercentage < 0) {
      trend = 'down';
    }
  } else if (currentMonthTotal > 0) {
    changePercentage = 100; // 100% increase from 0
    trend = 'up';
  }

  return {
    currentMonthTotal,
    previousMonthTotal,
    changePercentage: Math.abs(changePercentage),
    trend,
  };
};

/**
 * Get top spending categories (by amount)
 */
export const getTopSpendingCategories = (
  expenses: Expense[], 
  limit: number = 5
): CategoryBreakdown[] => {
  const categoryBreakdown = calculateCategoryBreakdown(expenses);
  return categoryBreakdown.slice(0, limit);
};

/**
 * Calculate daily average for current month
 */
export const getCurrentMonthDailyAverage = (expenses: Expense[]): number => {
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const now = new Date();
  const currentDay = now.getDate();

  // Calculate average based on days passed in current month
  return currentDay > 0 ? currentMonthTotal / currentDay : 0;
};

/**
 * Format currency amount
 */
export const formatCurrency = (
  amount: number, 
  locale: string = 'en-US', 
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (percentage: number, decimals: number = 1): string => {
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Search expenses by description
 */
export const searchExpenses = (expenses: Expense[], query: string): Expense[] => {
  if (!query.trim()) {
    return expenses;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm) ||
    expense.category.name.toLowerCase().includes(searchTerm)
  );
};

/**
 * Filter expenses by multiple criteria
 */
export const filterExpenses = (
  expenses: Expense[],
  filters: {
    query?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
  }
): Expense[] => {
  let filteredExpenses = [...expenses];

  // Search by query
  if (filters.query) {
    filteredExpenses = searchExpenses(filteredExpenses, filters.query);
  }

  // Filter by category
  if (filters.categoryId) {
    filteredExpenses = filteredExpenses.filter(
      expense => expense.category.id === filters.categoryId
    );
  }

  // Filter by date range
  if (filters.startDate && filters.endDate) {
    filteredExpenses = getExpensesByDateRange(
      filteredExpenses,
      filters.startDate,
      filters.endDate
    );
  }

  // Filter by amount range
  if (filters.minAmount !== undefined) {
    filteredExpenses = filteredExpenses.filter(
      expense => expense.amount >= filters.minAmount!
    );
  }

  if (filters.maxAmount !== undefined) {
    filteredExpenses = filteredExpenses.filter(
      expense => expense.amount <= filters.maxAmount!
    );
  }

  return filteredExpenses;
};
