import { Expense, ExpenseCategory } from '@/types';

export const testCategories: ExpenseCategory[] = [
  {
    id: 'food',
    name: 'Food',
    color: '#ef4444',
    icon: 'utensils',
    description: 'Restaurants, groceries, and dining expenses',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    color: '#3b82f6',
    icon: 'car',
    description: 'Fuel, public transport, and vehicle expenses',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: '#8b5cf6',
    icon: 'film',
    description: 'Movies, games, and leisure activities',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#10b981',
    icon: 'shopping-bag',
    description: 'Clothing, electronics, and retail purchases',
  },
  {
    id: 'bills',
    name: 'Bills',
    color: '#f59e0b',
    icon: 'file-text',
    description: 'Utilities, rent, and recurring payments',
  },
  {
    id: 'other',
    name: 'Other',
    color: '#6b7280',
    icon: 'more-horizontal',
    description: 'Miscellaneous expenses',
  },
];

// Test scenario: Empty state
export const emptyExpensesScenario = {
  name: 'Empty State',
  expenses: [] as Expense[],
  expectedBehavior: {
    totalAmount: 0,
    expenseCount: 0,
    averageAmount: 0,
    showEmptyState: true,
  },
};

// Test scenario: Single expense
export const singleExpenseScenario = {
  name: 'Single Expense',
  expenses: [
    {
      id: 'single-1',
      amount: 25.50,
      description: 'Coffee and pastry',
      category: testCategories[0],
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15T09:30:00Z'),
      updatedAt: new Date('2024-01-15T09:30:00Z'),
    },
  ] as Expense[],
  expectedBehavior: {
    totalAmount: 25.50,
    expenseCount: 1,
    averageAmount: 25.50,
    showEmptyState: false,
  },
};

// Test scenario: Multiple categories
export const multiCategoryScenario = {
  name: 'Multiple Categories',
  expenses: [
    {
      id: 'multi-1',
      amount: 50.00,
      description: 'Grocery shopping',
      category: testCategories[0], // Food
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
    },
    {
      id: 'multi-2',
      amount: 30.00,
      description: 'Gas fill-up',
      category: testCategories[1], // Transportation
      date: new Date('2024-01-14'),
      createdAt: new Date('2024-01-14T16:00:00Z'),
      updatedAt: new Date('2024-01-14T16:00:00Z'),
    },
    {
      id: 'multi-3',
      amount: 15.00,
      description: 'Movie ticket',
      category: testCategories[2], // Entertainment
      date: new Date('2024-01-13'),
      createdAt: new Date('2024-01-13T20:00:00Z'),
      updatedAt: new Date('2024-01-13T20:00:00Z'),
    },
  ] as Expense[],
  expectedBehavior: {
    totalAmount: 95.00,
    expenseCount: 3,
    averageAmount: 31.67,
    topCategory: 'food',
    showEmptyState: false,
  },
};

// Test scenario: Large dataset
export const largeDatasetScenario = {
  name: 'Large Dataset',
  expenses: Array.from({ length: 100 }, (_, index) => ({
    id: `large-${index + 1}`,
    amount: Math.round((Math.random() * 200 + 10) * 100) / 100, // $10-210 range
    description: `Test expense ${index + 1}`,
    category: testCategories[index % testCategories.length],
    date: new Date(2024, 0, (index % 30) + 1), // Spread across January 2024
    createdAt: new Date(`2024-01-${String((index % 30) + 1).padStart(2, '0')}T${String(index % 24).padStart(2, '0')}:00:00Z`),
    updatedAt: new Date(`2024-01-${String((index % 30) + 1).padStart(2, '0')}T${String(index % 24).padStart(2, '0')}:00:00Z`),
  })) as Expense[],
  expectedBehavior: {
    expenseCount: 100,
    showEmptyState: false,
    hasAllCategories: true,
  },
};

// Test scenario: Monthly trend data
export const monthlyTrendScenario = {
  name: 'Monthly Trend',
  expenses: [
    // Current month (January 2024)
    {
      id: 'trend-current-1',
      amount: 100.00,
      description: 'Current month expense 1',
      category: testCategories[0],
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15T12:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
    },
    {
      id: 'trend-current-2',
      amount: 75.00,
      description: 'Current month expense 2',
      category: testCategories[1],
      date: new Date('2024-01-20'),
      createdAt: new Date('2024-01-20T14:00:00Z'),
      updatedAt: new Date('2024-01-20T14:00:00Z'),
    },
    // Previous month (December 2023)
    {
      id: 'trend-previous-1',
      amount: 50.00,
      description: 'Previous month expense 1',
      category: testCategories[0],
      date: new Date('2023-12-15'),
      createdAt: new Date('2023-12-15T12:00:00Z'),
      updatedAt: new Date('2023-12-15T12:00:00Z'),
    },
    {
      id: 'trend-previous-2',
      amount: 25.00,
      description: 'Previous month expense 2',
      category: testCategories[1],
      date: new Date('2023-12-20'),
      createdAt: new Date('2023-12-20T14:00:00Z'),
      updatedAt: new Date('2023-12-20T14:00:00Z'),
    },
  ] as Expense[],
  expectedBehavior: {
    currentMonthTotal: 175.00,
    previousMonthTotal: 75.00,
    trendDirection: 'up',
    changePercentage: 133.33,
  },
};

// Test scenario: Edge cases
export const edgeCasesScenario = {
  name: 'Edge Cases',
  scenarios: {
    verySmallAmount: {
      id: 'edge-small',
      amount: 0.01,
      description: 'Smallest possible amount',
      category: testCategories[0],
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15T12:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
    } as Expense,
    
    veryLargeAmount: {
      id: 'edge-large',
      amount: 999999.99,
      description: 'Largest possible amount',
      category: testCategories[0],
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15T12:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
    } as Expense,
    
    longDescription: {
      id: 'edge-long-desc',
      amount: 25.00,
      description: 'This is a very long description that tests how the system handles extended text input for expense descriptions that might exceed normal length expectations',
      category: testCategories[0],
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15T12:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
    } as Expense,
    
    futureDate: {
      id: 'edge-future',
      amount: 50.00,
      description: 'Future dated expense',
      category: testCategories[0],
      date: new Date('2025-01-15'),
      createdAt: new Date('2024-01-15T12:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
    } as Expense,
    
    oldDate: {
      id: 'edge-old',
      amount: 30.00,
      description: 'Very old expense',
      category: testCategories[0],
      date: new Date('2020-01-15'),
      createdAt: new Date('2020-01-15T12:00:00Z'),
      updatedAt: new Date('2020-01-15T12:00:00Z'),
    } as Expense,
  },
};

// Test scenario: Form validation
export const formValidationScenarios = {
  name: 'Form Validation',
  validInputs: {
    amount: '25.50',
    description: 'Valid expense description',
    category: 'food',
    date: '2024-01-15',
  },
  invalidInputs: {
    emptyAmount: {
      amount: '',
      description: 'Valid description',
      category: 'food',
      date: '2024-01-15',
      expectedError: 'Amount is required',
    },
    invalidAmount: {
      amount: 'not-a-number',
      description: 'Valid description',
      category: 'food',
      date: '2024-01-15',
      expectedError: 'Amount must be a valid number',
    },
    zeroAmount: {
      amount: '0',
      description: 'Valid description',
      category: 'food',
      date: '2024-01-15',
      expectedError: 'Amount must be greater than 0',
    },
    negativeAmount: {
      amount: '-25.50',
      description: 'Valid description',
      category: 'food',
      date: '2024-01-15',
      expectedError: 'Amount must be greater than 0',
    },
    emptyDescription: {
      amount: '25.50',
      description: '',
      category: 'food',
      date: '2024-01-15',
      expectedError: 'Description is required',
    },
    noCategory: {
      amount: '25.50',
      description: 'Valid description',
      category: '',
      date: '2024-01-15',
      expectedError: 'Category is required',
    },
    emptyDate: {
      amount: '25.50',
      description: 'Valid description',
      category: 'food',
      date: '',
      expectedError: 'Date is required',
    },
  },
};

// Test scenario: Analytics calculations
export const analyticsScenarios = {
  name: 'Analytics Calculations',
  testCases: [
    {
      name: 'Simple calculation',
      expenses: [
        {
          id: 'calc-1',
          amount: 100,
          description: 'Test 1',
          category: testCategories[0],
          date: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15T12:00:00Z'),
          updatedAt: new Date('2024-01-15T12:00:00Z'),
        },
        {
          id: 'calc-2',
          amount: 50,
          description: 'Test 2',
          category: testCategories[1],
          date: new Date('2024-01-16'),
          createdAt: new Date('2024-01-16T12:00:00Z'),
          updatedAt: new Date('2024-01-16T12:00:00Z'),
        },
      ] as Expense[],
      expected: {
        total: 150,
        average: 75,
        count: 2,
        categoryBreakdown: {
          food: { total: 100, percentage: 66.67 },
          transportation: { total: 50, percentage: 33.33 },
        },
      },
    },
    {
      name: 'Decimal precision',
      expenses: [
        {
          id: 'decimal-1',
          amount: 33.33,
          description: 'Decimal test 1',
          category: testCategories[0],
          date: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15T12:00:00Z'),
          updatedAt: new Date('2024-01-15T12:00:00Z'),
        },
        {
          id: 'decimal-2',
          amount: 33.34,
          description: 'Decimal test 2',
          category: testCategories[0],
          date: new Date('2024-01-16'),
          createdAt: new Date('2024-01-16T12:00:00Z'),
          updatedAt: new Date('2024-01-16T12:00:00Z'),
        },
      ] as Expense[],
      expected: {
        total: 66.67,
        average: 33.335,
        count: 2,
      },
    },
  ],
};

// Export all scenarios for easy import
export const allTestScenarios = {
  emptyExpensesScenario,
  singleExpenseScenario,
  multiCategoryScenario,
  largeDatasetScenario,
  monthlyTrendScenario,
  edgeCasesScenario,
  formValidationScenarios,
  analyticsScenarios,
};
