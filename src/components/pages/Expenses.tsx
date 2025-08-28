import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { Plus, X, CreditCard } from 'lucide-react';
import { Expense, ExpenseFormData } from '@/types';
import { useExpenses } from '@/hooks/useExpenses';

export const Expenses: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const {
    expenses,
    isLoading,
    error,
    clearError,
    addExpense,
    updateExpense,
    deleteExpense,
    getTotalAmount,
    getCurrentMonthTotal,
  } = useExpenses();

  const handleAddExpense = async (formData: ExpenseFormData) => {
    try {
      await addExpense(formData);
      setShowForm(false);
      clearError();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditExpense = async (formData: ExpenseFormData) => {
    if (!editingExpense) return;

    try {
      await updateExpense({ id: editingExpense.id, formData });
      setEditingExpense(null);
      clearError();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      clearError();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setShowForm(false);
    clearError();
  };

  const handleFormSubmit = (formData: ExpenseFormData) => {
    if (editingExpense) {
      handleEditExpense(formData);
    } else {
      handleAddExpense(formData);
    }
  };

  const getInitialFormData = (): Partial<ExpenseFormData> | undefined => {
    if (editingExpense) {
      return {
        amount: editingExpense.amount,
        description: editingExpense.description,
        category: editingExpense.category.id,
        date: editingExpense.date,
      };
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-2 text-gray-600">
            Track and manage your personal and business expenses.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowForm(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            disabled={showForm}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-destructive text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses List - Takes up 2/3 of the space */}
        <div className="lg:col-span-2">
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditClick}
            onDelete={handleDeleteExpense}
            onAddNew={() => setShowForm(true)}
            isLoading={isLoading}
          />
        </div>

        {/* Form Sidebar - Takes up 1/3 of the space */}
        <div className="lg:col-span-1">
          {showForm ? (
            <div className="sticky top-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg">
                      {editingExpense ? 'Edit Expense' : 'Add Expense'}
                    </CardTitle>
                    <CardDescription>
                      {editingExpense
                        ? 'Update the expense details below'
                        : 'Fill in the expense details below'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ExpenseForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelEdit}
                    initialData={getInitialFormData()}
                    isLoading={false}
                    isEditMode={true}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Add Your First Expense
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start tracking your expenses by adding your first entry.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenses.length}</div>
              <p className="text-xs text-muted-foreground">
                Total expense entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${getTotalAmount().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Combined spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${getCurrentMonthTotal().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Current month spending
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
