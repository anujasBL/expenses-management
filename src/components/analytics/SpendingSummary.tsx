import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Expense, SpendingSummary as SpendingSummaryType, CategoryBreakdown } from '@/types';
import { EXPENSE_CATEGORIES, CURRENCY } from '@/constants';
import { CategoryBadge } from '@/components/ui/CategorySelector';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  BarChart3,
  CreditCard,
  Target
} from 'lucide-react';
import { clsx } from 'clsx';

interface SpendingSummaryProps {
  expenses: Expense[];
  className?: string;
}

export const SpendingSummary: React.FC<SpendingSummaryProps> = ({
  expenses,
  className,
}) => {
  // Calculate spending summary
  const summary: SpendingSummaryType = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const currentMonthExpenses = expenses.filter(
      expense => expense.date >= startOfMonth && expense.date <= endOfMonth
    );

    const currentMonthTotal = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const allTimeTotal = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      currentMonthTotal,
      allTimeTotal,
      expenseCount: expenses.length,
      averageAmount: expenses.length > 0 ? allTimeTotal / expenses.length : 0,
    };
  }, [expenses]);

  // Calculate category breakdown
  const categoryBreakdown: CategoryBreakdown[] = useMemo(() => {
    const categoryTotals = EXPENSE_CATEGORIES.map(category => {
      const categoryExpenses = expenses.filter(
        expense => expense.category.id === category.id
      );
      
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const percentage = summary.allTimeTotal > 0 ? (total / summary.allTimeTotal) * 100 : 0;

      return {
        category,
        total,
        percentage,
        count: categoryExpenses.length,
      };
    });

    // Sort by total amount (highest first) and filter out zero amounts
    return categoryTotals
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [expenses, summary.allTimeTotal]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY.locale, {
      style: 'currency',
      currency: CURRENCY.code,
    }).format(amount);
  };

  // Get current month name
  const currentMonthName = new Intl.DateTimeFormat('en-US', { 
    month: 'long' 
  }).format(new Date());

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Month Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {currentMonthName} Total
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.currentMonthTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.currentMonthTotal > 0 ? (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  This month's spending
                </span>
              ) : (
                'No expenses this month'
              )}
            </p>
          </CardContent>
        </Card>

        {/* All Time Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.allTimeTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.expenseCount > 0 ? (
                `Across ${summary.expenseCount} ${summary.expenseCount === 1 ? 'expense' : 'expenses'}`
              ) : (
                'Start tracking expenses'
              )}
            </p>
          </CardContent>
        </Card>

        {/* Expense Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Entries
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {summary.expenseCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.expenseCount > 0 ? (
                'Expense entries recorded'
              ) : (
                'No expenses yet'
              )}
            </p>
          </CardContent>
        </Card>

        {/* Average Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Amount
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.averageAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per expense entry
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryBadge 
                        category={item.category} 
                        size="sm" 
                      />
                      <span className="text-sm text-gray-600">
                        ({item.count} {item.count === 1 ? 'expense' : 'expenses'})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.total)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {summary.expenseCount === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No expense data yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start adding expenses to see your spending analytics and category breakdown.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
