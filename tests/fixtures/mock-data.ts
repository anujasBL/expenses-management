import { Expense, ExpenseCategory } from '@/types';

export const mockCategories: ExpenseCategory[] = [
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
    id: 'shopping',
    name: 'Shopping',
    color: '#8b5cf6',
    icon: 'shopping-bag',
    description: 'Clothing, electronics, and retail purchases',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: '#10b981',
    icon: 'film',
    description: 'Movies, games, and leisure activities',
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

export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 25.50,
    description: 'Lunch at Subway',
    category: mockCategories[0],
    date: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15T12:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  },
  {
    id: '2',
    amount: 45.00,
    description: 'Gas station fill-up',
    category: mockCategories[1],
    date: new Date('2024-01-14'),
    createdAt: new Date('2024-01-14T08:30:00Z'),
    updatedAt: new Date('2024-01-14T08:30:00Z'),
  },
  {
    id: '3',
    amount: 89.99,
    description: 'New headphones',
    category: mockCategories[2],
    date: new Date('2024-01-13'),
    createdAt: new Date('2024-01-13T15:45:00Z'),
    updatedAt: new Date('2024-01-13T15:45:00Z'),
  },
  {
    id: '4',
    amount: 15.00,
    description: 'Movie ticket',
    category: mockCategories[3],
    date: new Date('2024-01-12'),
    createdAt: new Date('2024-01-12T19:00:00Z'),
    updatedAt: new Date('2024-01-12T19:00:00Z'),
  },
  {
    id: '5',
    amount: 75.00,
    description: 'Doctor appointment',
    category: mockCategories[4],
    date: new Date('2024-01-11'),
    createdAt: new Date('2024-01-11T10:15:00Z'),
    updatedAt: new Date('2024-01-11T10:15:00Z'),
  },
];

export const mockExpenseFormData = {
  amount: 35.00,
  description: 'Coffee and pastry',
  category: 'food',
  date: new Date('2024-01-16'),
};

export const mockApiResponse = {
  success: true,
  data: mockExpenses,
  message: 'Expenses retrieved successfully',
};

export const mockErrorResponse = {
  success: false,
  error: 'Failed to fetch expenses',
  message: 'An error occurred while retrieving expenses',
};

export const mockStorageData = {
  expenses: mockExpenses,
  categories: mockCategories,
};

export const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
};

export const mockPaymentIntent = {
  id: 'pi_test_123',
  client_secret: 'pi_test_secret_123',
  amount: 2500,
  currency: 'usd',
  status: 'requires_payment_method',
};

export const mockEmailData = {
  to: 'user@example.com',
  from: 'noreply@expenses.com',
  subject: 'Expense Report',
  text: 'Your monthly expense report is ready.',
  html: '<p>Your monthly expense report is ready.</p>',
};

export const mockImageUpload = {
  public_id: 'test_image_123',
  secure_url: 'https://res.cloudinary.com/test/image/upload/test_image_123.jpg',
  width: 800,
  height: 600,
  format: 'jpg',
  bytes: 102400,
};
