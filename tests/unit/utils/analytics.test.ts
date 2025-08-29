import {
  calculateSpendingSummary,
  calculateCategoryBreakdown,
  getExpensesByCategory,
  getExpensesByDateRange,
  getCurrentMonthExpenses,
  getPreviousMonthExpenses,
  calculateMonthlyTrend,
  getTopSpendingCategories,
  getCurrentMonthDailyAverage,
  formatCurrency,
  formatPercentage,
  searchExpenses,
  filterExpenses,
} from '@/utils/analytics';
import { mockExpenses, mockCategories } from '../../fixtures/mock-data';
import { Expense } from '@/types';

describe('Analytics Utilities', () => {
  const testExpenses: Expense[] = [
    {
      id: '1',
      amount: 100,
      description: 'Groceries',
      category: mockCategories[0], // Food
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15T12:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
    },
    {
      id: '2',
      amount: 50,
      description: 'Gas',
      category: mockCategories[1], // Transportation
      date: new Date('2024-01-10'),
      createdAt: new Date('2024-01-10T08:30:00Z'),
      updatedAt: new Date('2024-01-10T08:30:00Z'),
    },
    {
      id: '3',
      amount: 25,
      description: 'Coffee',
      category: mockCategories[0], // Food
      date: new Date('2023-12-20'), // Previous month
      createdAt: new Date('2023-12-20T09:00:00Z'),
      updatedAt: new Date('2023-12-20T09:00:00Z'),
    },
  ];

  describe('calculateSpendingSummary', () => {
    it('should calculate total spending correctly', () => {
      const summary = calculateSpendingSummary(testExpenses);
      
      expect(summary.allTimeTotal).toBe(175); // 100 + 50 + 25
      expect(summary.expenseCount).toBe(3);
      expect(summary.averageAmount).toBe(175 / 3);
    });

    it('should calculate current month total correctly', () => {
      const summary = calculateSpendingSummary(testExpenses);
      
      // Assuming current date is in January 2024
      const expectedCurrentMonth = 150; // 100 + 50 (January expenses)
      expect(summary.currentMonthTotal).toBe(expectedCurrentMonth);
    });

    it('should handle empty expenses array', () => {
      const summary = calculateSpendingSummary([]);
      
      expect(summary.allTimeTotal).toBe(0);
      expect(summary.currentMonthTotal).toBe(0);
      expect(summary.expenseCount).toBe(0);
      expect(summary.averageAmount).toBe(0);
    });

    it('should handle single expense', () => {
      const singleExpense = [testExpenses[0]];
      const summary = calculateSpendingSummary(singleExpense);
      
      expect(summary.allTimeTotal).toBe(100);
      expect(summary.expenseCount).toBe(1);
      expect(summary.averageAmount).toBe(100);
    });
  });

  describe('calculateCategoryBreakdown', () => {
    it('should calculate category totals correctly', () => {
      const breakdown = calculateCategoryBreakdown(testExpenses);
      
      const foodCategory = breakdown.find(item => item.category.id === 'food');
      expect(foodCategory?.total).toBe(125); // 100 + 25
      expect(foodCategory?.count).toBe(2);
      expect(foodCategory?.percentage).toBeCloseTo(71.43, 1); // 125/175 * 100

      const transportCategory = breakdown.find(item => item.category.id === 'transportation');
      expect(transportCategory?.total).toBe(50);
      expect(transportCategory?.count).toBe(1);
      expect(transportCategory?.percentage).toBeCloseTo(28.57, 1); // 50/175 * 100
    });

    it('should filter out zero amounts', () => {
      const breakdown = calculateCategoryBreakdown(testExpenses);
      
      // Should only include categories with expenses
      expect(breakdown).toHaveLength(2); // Food and Transportation only
      breakdown.forEach(item => {
        expect(item.total).toBeGreaterThan(0);
      });
    });

    it('should sort by total amount descending', () => {
      const breakdown = calculateCategoryBreakdown(testExpenses);
      
      for (let i = 0; i < breakdown.length - 1; i++) {
        expect(breakdown[i].total).toBeGreaterThanOrEqual(breakdown[i + 1].total);
      }
    });

    it('should handle empty expenses array', () => {
      const breakdown = calculateCategoryBreakdown([]);
      
      expect(breakdown).toHaveLength(0);
    });
  });

  describe('getExpensesByCategory', () => {
    it('should filter expenses by category correctly', () => {
      const foodExpenses = getExpensesByCategory(testExpenses, 'food');
      
      expect(foodExpenses).toHaveLength(2);
      foodExpenses.forEach(expense => {
        expect(expense.category.id).toBe('food');
      });
    });

    it('should return empty array for non-existent category', () => {
      const expenses = getExpensesByCategory(testExpenses, 'non-existent');
      
      expect(expenses).toHaveLength(0);
    });
  });

  describe('getExpensesByDateRange', () => {
    it('should filter expenses by date range correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const januaryExpenses = getExpensesByDateRange(testExpenses, startDate, endDate);
      
      expect(januaryExpenses).toHaveLength(2); // Only January 2024 expenses
      januaryExpenses.forEach(expense => {
        expect(expense.date).toBeInstanceOf(Date);
        expect(expense.date.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(expense.date.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    it('should return empty array for date range with no expenses', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      
      const expenses = getExpensesByDateRange(testExpenses, startDate, endDate);
      
      expect(expenses).toHaveLength(0);
    });
  });

  describe('getCurrentMonthExpenses', () => {
    beforeEach(() => {
      // Mock current date to January 2024
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return current month expenses only', () => {
      const currentExpenses = getCurrentMonthExpenses(testExpenses);
      
      expect(currentExpenses).toHaveLength(2); // January 2024 expenses
      currentExpenses.forEach(expense => {
        expect(expense.date.getMonth()).toBe(0); // January (0-indexed)
        expect(expense.date.getFullYear()).toBe(2024);
      });
    });
  });

  describe('getPreviousMonthExpenses', () => {
    beforeEach(() => {
      // Mock current date to January 2024
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return previous month expenses only', () => {
      const previousExpenses = getPreviousMonthExpenses(testExpenses);
      
      expect(previousExpenses).toHaveLength(1); // December 2023 expense
      previousExpenses.forEach(expense => {
        expect(expense.date.getMonth()).toBe(11); // December (0-indexed)
        expect(expense.date.getFullYear()).toBe(2023);
      });
    });
  });

  describe('calculateMonthlyTrend', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate trend correctly', () => {
      const trend = calculateMonthlyTrend(testExpenses);
      
      expect(trend.currentMonthTotal).toBe(150); // January total
      expect(trend.previousMonthTotal).toBe(25); // December total
      expect(trend.changePercentage).toBe(500); // 500% increase
      expect(trend.trend).toBe('up');
    });

    it('should handle zero previous month total', () => {
      const currentMonthOnly = testExpenses.slice(0, 2); // Only January expenses
      const trend = calculateMonthlyTrend(currentMonthOnly);
      
      expect(trend.previousMonthTotal).toBe(0);
      expect(trend.changePercentage).toBe(100);
      expect(trend.trend).toBe('up');
    });

    it('should handle decreasing trend', () => {
      const testExpensesDecreasing: Expense[] = [
        {
          ...testExpenses[0],
          amount: 25, // Lower current month
          date: new Date('2024-01-15'),
        },
        {
          ...testExpenses[1],
          amount: 100, // Higher previous month
          date: new Date('2023-12-15'),
        },
      ];

      const trend = calculateMonthlyTrend(testExpensesDecreasing);
      
      expect(trend.trend).toBe('down');
      expect(trend.changePercentage).toBe(75); // 75% decrease
    });
  });

  describe('getTopSpendingCategories', () => {
    it('should return top categories by amount', () => {
      const topCategories = getTopSpendingCategories(testExpenses, 2);
      
      expect(topCategories).toHaveLength(2);
      expect(topCategories[0].category.id).toBe('food'); // Highest total
      expect(topCategories[1].category.id).toBe('transportation');
    });

    it('should respect the limit parameter', () => {
      const topCategories = getTopSpendingCategories(testExpenses, 1);
      
      expect(topCategories).toHaveLength(1);
      expect(topCategories[0].category.id).toBe('food');
    });
  });

  describe('getCurrentMonthDailyAverage', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20')); // 20th day of January
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate daily average correctly', () => {
      const dailyAverage = getCurrentMonthDailyAverage(testExpenses);
      
      const expectedAverage = 150 / 20; // 150 total / 20 days
      expect(dailyAverage).toBe(expectedAverage);
    });

    it('should handle empty current month', () => {
      const dailyAverage = getCurrentMonthDailyAverage([]);
      
      expect(dailyAverage).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const formatted = formatCurrency(25.5);
      
      expect(formatted).toBe('$25.50');
    });

    it('should handle large amounts', () => {
      const formatted = formatCurrency(1234567.89);
      
      expect(formatted).toBe('$1,234,567.89');
    });

    it('should handle zero', () => {
      const formatted = formatCurrency(0);
      
      expect(formatted).toBe('$0.00');
    });

    it('should handle custom locale and currency', () => {
      const formatted = formatCurrency(25.5, 'de-DE', 'EUR');
      
      expect(formatted).toMatch(/25,50/); // German format
      expect(formatted).toMatch(/€/); // Euro symbol
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      const formatted = formatPercentage(25.567);
      
      expect(formatted).toBe('25.6%');
    });

    it('should respect decimal places parameter', () => {
      const formatted = formatPercentage(25.567, 2);
      
      expect(formatted).toBe('25.57%');
    });

    it('should handle zero', () => {
      const formatted = formatPercentage(0);
      
      expect(formatted).toBe('0.0%');
    });
  });

  describe('searchExpenses', () => {
    it('should search by description', () => {
      const results = searchExpenses(testExpenses, 'coffee');
      
      expect(results).toHaveLength(1);
      expect(results[0].description.toLowerCase()).toContain('coffee');
    });

    it('should search by category name', () => {
      const results = searchExpenses(testExpenses, 'food');
      
      expect(results).toHaveLength(2); // Both food category expenses
    });

    it('should be case insensitive', () => {
      const results = searchExpenses(testExpenses, 'GROCERIES');
      
      expect(results).toHaveLength(1);
      expect(results[0].description).toBe('Groceries');
    });

    it('should return all expenses for empty query', () => {
      const results = searchExpenses(testExpenses, '');
      
      expect(results).toHaveLength(testExpenses.length);
    });

    it('should trim whitespace', () => {
      const results = searchExpenses(testExpenses, '  coffee  ');
      
      expect(results).toHaveLength(1);
    });
  });

  describe('filterExpenses', () => {
    it('should filter by query', () => {
      const results = filterExpenses(testExpenses, { query: 'coffee' });
      
      expect(results).toHaveLength(1);
    });

    it('should filter by category', () => {
      const results = filterExpenses(testExpenses, { categoryId: 'food' });
      
      expect(results).toHaveLength(2);
    });

    it('should filter by date range', () => {
      const results = filterExpenses(testExpenses, {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      });
      
      expect(results).toHaveLength(2); // January 2024 expenses
    });

    it('should filter by amount range', () => {
      const results = filterExpenses(testExpenses, {
        minAmount: 50,
        maxAmount: 150,
      });
      
      expect(results).toHaveLength(2); // 50 and 100 amount expenses
    });

    it('should combine multiple filters', () => {
      const results = filterExpenses(testExpenses, {
        query: 'groceries',
        categoryId: 'food',
        minAmount: 50,
      });
      
      expect(results).toHaveLength(1); // Only groceries expense
      expect(results[0].description).toBe('Groceries');
    });

    it('should return empty array when no matches', () => {
      const results = filterExpenses(testExpenses, {
        query: 'non-existent',
      });
      
      expect(results).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle expenses with same timestamps', () => {
      const sameTimeExpenses: Expense[] = [
        { ...testExpenses[0], createdAt: new Date('2024-01-15T12:00:00Z') },
        { ...testExpenses[1], createdAt: new Date('2024-01-15T12:00:00Z') },
      ];

      const summary = calculateSpendingSummary(sameTimeExpenses);
      expect(summary.expenseCount).toBe(2);
    });

    it('should handle very large amounts', () => {
      const largeExpense: Expense = {
        ...testExpenses[0],
        amount: 999999999.99,
      };

      const summary = calculateSpendingSummary([largeExpense]);
      expect(summary.allTimeTotal).toBe(999999999.99);
    });

    it('should handle very small amounts', () => {
      const smallExpense: Expense = {
        ...testExpenses[0],
        amount: 0.01,
      };

      const summary = calculateSpendingSummary([smallExpense]);
      expect(summary.allTimeTotal).toBe(0.01);
    });

    it('should handle dates at month boundaries', () => {
      const boundaryExpenses: Expense[] = [
        {
          ...testExpenses[0],
          date: new Date('2024-01-01T00:00:00Z'), // Start of month
        },
        {
          ...testExpenses[1],
          date: new Date('2024-01-31T23:59:59Z'), // End of month
        },
      ];

      const currentMonth = getCurrentMonthExpenses(boundaryExpenses);
      expect(currentMonth).toHaveLength(2);
    });
  });
});
