/**
 * Core data models for the Expenses Management System
 */

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export interface ExpenseFormData {
  amount: number;
  description: string;
  category: string;
  date: Date;
}

export interface ExpenseUpdateData {
  id: string;
  amount?: number;
  description?: string;
  category?: string;
  date?: Date;
}

export interface SpendingSummary {
  currentMonthTotal: number;
  allTimeTotal: number;
  expenseCount: number;
  averageAmount: number;
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  total: number;
  percentage: number;
  count: number;
}

export interface SearchFilters {
  query: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApiOperation =
  | 'GET_ALL'
  | 'GET_BY_ID'
  | 'SAVE_NEW'
  | 'UPDATE'
  | 'DELETE';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}
