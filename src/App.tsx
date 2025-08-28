import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/components/pages/Dashboard';
import { EXPENSE_CATEGORIES } from '@/constants';
import { storageService } from '@/services/storage';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize categories if they don't exist
        const existingCategories = await storageService.getCategories();
        if (existingCategories.length === 0) {
          await storageService.saveCategories(EXPENSE_CATEGORIES);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Expenses Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
