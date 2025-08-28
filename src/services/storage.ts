/**
 * Local storage service for data persistence
 * Provides fallback to IndexedDB for larger datasets
 */

import { Expense, ExpenseCategory } from '@/types';
import { STORAGE_KEYS } from '@/constants';

export interface StorageService {
  getExpenses(): Promise<Expense[]>;
  saveExpenses(expenses: Expense[]): Promise<void>;
  getCategories(): Promise<ExpenseCategory[]>;
  saveCategories(categories: ExpenseCategory[]): Promise<void>;
  clearAll(): Promise<void>;
  exportData(): Promise<string>;
  importData(data: string): Promise<void>;
}

class LocalStorageService implements StorageService {
  private readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  /**
   * Get expenses from localStorage
   */
  async getExpenses(): Promise<Expense[]> {
    try {
      const data = this.storage.getItem(STORAGE_KEYS.expenses);
      if (!data) return [];

      const expenses = JSON.parse(data);
      // Convert date strings back to Date objects
      return expenses.map((expense: Expense & { date: string; createdAt: string; updatedAt: string }) => ({
        ...expense,
        date: new Date(expense.date),
        createdAt: new Date(expense.createdAt),
        updatedAt: new Date(expense.updatedAt),
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Save expenses to localStorage
   */
  async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      this.storage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
    } catch (error) {
      throw new Error('Failed to save expenses to localStorage');
    }
  }

  /**
   * Get categories from localStorage
   */
  async getCategories(): Promise<ExpenseCategory[]> {
    try {
      const data = this.storage.getItem(STORAGE_KEYS.categories);
      if (!data) return [];

      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  /**
   * Save categories to localStorage
   */
  async saveCategories(categories: ExpenseCategory[]): Promise<void> {
    try {
      this.storage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    } catch (error) {
      throw new Error('Failed to save categories to localStorage');
    }
  }

  /**
   * Clear all stored data
   */
  async clearAll(): Promise<void> {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.storage.removeItem(key);
      });
    } catch (error) {
      throw new Error('Failed to clear localStorage');
    }
  }

  /**
   * Export all data as JSON string
   */
  async exportData(): Promise<string> {
    try {
      const expenses = await this.getExpenses();
      const categories = await this.getCategories();

      const exportData = {
        expenses,
        categories,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error('Failed to export data');
    }
  }

  /**
   * Import data from JSON string
   */
  async importData(data: string): Promise<void> {
    try {
      const importData = JSON.parse(data);

      if (importData.expenses) {
        await this.saveExpenses(importData.expenses);
      }

      if (importData.categories) {
        await this.saveCategories(importData.categories);
      }
    } catch (error) {
      throw new Error('Failed to import data: Invalid format');
    }
  }

  /**
   * Check if localStorage is available and has sufficient space
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = this.storage.getItem(key);
        if (item) {
          used += new Blob([item]).size;
        }
      });

      // Estimate available space (localStorage typically has 5-10MB limit)
      const available = 5 * 1024 * 1024; // 5MB estimate
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

/**
 * IndexedDB service as fallback for larger datasets
 */
class IndexedDBService implements StorageService {
  private dbName = 'ExpensesDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', {
            keyPath: 'id',
          });
          expenseStore.createIndex('date', 'date', { unique: false });
          expenseStore.createIndex('category', 'category.id', {
            unique: false,
          });
        }

        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
      };
    });
  }

  async getExpenses(): Promise<Expense[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['expenses'], 'readonly');
      const store = transaction.objectStore('expenses');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const expenses = request.result;
        // Convert date strings back to Date objects
        const convertedExpenses = expenses.map((expense: Expense & { date: string; createdAt: string; updatedAt: string }) => ({
          ...expense,
          date: new Date(expense.date),
          createdAt: new Date(expense.createdAt),
          updatedAt: new Date(expense.updatedAt),
        }));
        resolve(convertedExpenses);
      };
    });
  }

  async saveExpenses(expenses: Expense[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['expenses'], 'readwrite');
      const store = transaction.objectStore('expenses');

      // Clear existing data
      store.clear();

      // Add new data
      expenses.forEach(expense => {
        store.add(expense);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getCategories(): Promise<ExpenseCategory[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['categories'], 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async saveCategories(categories: ExpenseCategory[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['categories'], 'readwrite');
      const store = transaction.objectStore('categories');

      // Clear existing data
      store.clear();

      // Add new data
      categories.forEach(category => {
        store.add(category);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ['expenses', 'categories'],
        'readwrite'
      );

      transaction.objectStore('expenses').clear();
      transaction.objectStore('categories').clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async exportData(): Promise<string> {
    const expenses = await this.getExpenses();
    const categories = await this.getCategories();

    const exportData = {
      expenses,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importData(data: string): Promise<void> {
    const importData = JSON.parse(data);

    if (importData.expenses) {
      await this.saveExpenses(importData.expenses);
    }

    if (importData.categories) {
      await this.saveCategories(importData.categories);
    }
  }
}

// Create and export storage service instances
export const localStorageService = new LocalStorageService();
export const indexedDBService = new IndexedDBService();

// Export the main storage service (defaults to localStorage)
export const storageService: StorageService = localStorageService;

// Export types
