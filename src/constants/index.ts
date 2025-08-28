/**
 * Application constants and configuration
 */

import { ExpenseCategory } from '@/types';

export const APP_CONFIG = {
  name: 'Expenses Management System',
  version: '0.1.0',
  environment: 'development',
  apiBaseUrl: 'https://test-2-enc8.onrender.com',
  apiTimeout: 10000,
} as const;

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'food',
    name: 'Food',
    color: '#ef4444',
    icon: 'utensils',
    description: 'Restaurants, groceries, and dining out',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    color: '#3b82f6',
    icon: 'car',
    description: 'Gas, public transit, and vehicle maintenance',
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
    color: '#f59e0b',
    icon: 'shopping-bag',
    description: 'Clothing, electronics, and retail purchases',
  },
  {
    id: 'bills',
    name: 'Bills',
    color: '#10b981',
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

export const STORAGE_KEYS = {
  expenses: 'expenses',
  categories: 'categories',
  settings: 'settings',
  userPreferences: 'userPreferences',
} as const;

export const API_ENDPOINTS = {
  expenses: '/expenses',
  categories: '/categories',
  analytics: '/analytics',
  export: '/export',
  import: '/import',
} as const;

export const VALIDATION_RULES = {
  amount: {
    min: 0.01,
    max: 999999.99,
  },
  description: {
    minLength: 1,
    maxLength: 200,
  },
  date: {
    max: new Date(),
  },
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  api: 'yyyy-MM-dd',
} as const;

export const CURRENCY = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
} as const;

export const FEATURE_FLAGS = {
  analytics: true,
  exportImport: true,
  charts: true,
} as const;
