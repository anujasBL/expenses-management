import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/components/pages/Dashboard';
import { Expenses } from '@/components/pages/Expenses';
import { EXPENSE_CATEGORIES } from '@/constants';
import { api } from '@/services/api';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize categories via API if they don't exist
        const existingCategories = await api.categories.getAll();
        if (!existingCategories.data || existingCategories.data.length === 0) {
          await api.categories.saveNew(EXPENSE_CATEGORIES[0]); // Save first category to initialize
          // Note: In a real app, you might want to save all categories or handle this differently
        }

        setIsInitialized(true);
      } catch (error) {
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
          <p className="text-gray-600">
            Initializing Expenses Management System...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
