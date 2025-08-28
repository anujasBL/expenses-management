import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  Search,
  SortAsc,
  SortDesc,
  CreditCard,
  Calendar,
  Tag,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types';
import { EXPENSE_CATEGORIES, CURRENCY } from '@/constants';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
  onAddNew?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

type SortField = 'date' | 'amount' | 'description' | 'category';
type SortDirection = 'asc' | 'desc';

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    const filtered = expenses.filter(expense => {
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        !categoryFilter || expense.category.id === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort expenses
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          aValue = a.category.name.toLowerCase();
          bValue = b.category.name.toLowerCase();
          break;
        case 'date':
        default:
          aValue = a.date;
          bValue = b.date;
          break;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, searchQuery, categoryFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (expenseId: string) => {
    if (
      onDelete &&
      window.confirm('Are you sure you want to delete this expense?')
    ) {
      onDelete(expenseId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY.locale, {
      style: 'currency',
      currency: CURRENCY.code,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    return category.color || '#6b7280';
  };

  // Category filter options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...EXPENSE_CATEGORIES.map(category => ({
      value: category.id,
      label: category.name,
    })),
  ];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading expenses
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort field options
  const sortFieldOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'description', label: 'Description' },
    { value: 'category', label: 'Category' },
  ];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading expenses
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading expenses...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Expenses</span>
              <span className="text-sm font-normal text-gray-500">
                ({filteredAndSortedExpenses.length} total)
              </span>
            </CardTitle>
            <CardDescription>
              Manage and track your expense records
            </CardDescription>
          </div>

          {onAddNew && (
            <Button onClick={onAddNew} leftIcon={<Plus className="h-4 w-4" />}>
              Add Expense
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <Input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                label="Search expenses"
                aria-label="Search expenses"
              />
            </div>

            {/* Category Filter */}
            <div>
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={setCategoryFilter}
                label="Filter by category"
                placeholder="Filter by category"
                aria-label="Filter by category"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700" id="sort-label">
              Sort by:
            </span>
            <div
              className="flex space-x-2"
              role="group"
              aria-labelledby="sort-label"
            >
              {sortFieldOptions.map(option => (
                <Button
                  key={option.value}
                  variant={sortField === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort(option.value as SortField)}
                  className="flex items-center space-x-1"
                  aria-label={`Sort by ${option.label}`}
                >
                  <span>{option.label}</span>
                  {sortField === option.value &&
                    (sortDirection === 'asc' ? (
                      <SortAsc className="h-3 w-3" />
                    ) : (
                      <SortDesc className="h-3 w-3" />
                    ))}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Announcement for Screen Readers */}
        {searchQuery && (
          <div className="sr-only" aria-live="polite">
            {filteredAndSortedExpenses.length === 1
              ? '1 expense found'
              : `${filteredAndSortedExpenses.length} expenses found`}
          </div>
        )}

        {/* Expenses List */}
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || categoryFilter
                ? 'No matching expenses'
                : 'No expenses yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter
                ? 'Try adjusting your search or filters'
                : 'Start tracking your expenses by adding your first entry.'}
            </p>
            {onAddNew && !searchQuery && !categoryFilter && (
              <Button
                onClick={onAddNew}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add First Expense
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedExpenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Expense Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(expense.category),
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {expense.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>{expense.category.name}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(expense.date)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(expense)}
                        className="h-8 w-8 p-0"
                        aria-label={`Edit ${expense.description}`}
                        title="Edit expense"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        aria-label={`Delete ${expense.description}`}
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
