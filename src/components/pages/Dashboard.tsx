import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useExpenses } from '@/hooks/useExpenses';
import { Plus, TrendingUp, CreditCard, BarChart3 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { expenses } = useExpenses();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your expenses management system. Track, analyze, and
            manage your spending.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/expenses">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add Expense</Button>
          </Link>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard expenses={expenses} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/expenses">
              <Button
                variant="outline"
                className="h-20 flex-col w-full"
                leftIcon={<Plus className="h-6 w-6" />}
              >
                <span className="mt-2">Add Expense</span>
              </Button>
            </Link>
            <Link to="/expenses">
              <Button
                variant="outline"
                className="h-20 flex-col w-full"
                leftIcon={<BarChart3 className="h-6 w-6" />}
              >
                <span className="mt-2">View Expenses</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-20 flex-col"
              leftIcon={<TrendingUp className="h-6 w-6" />}
            >
              <span className="mt-2">Export Data</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              leftIcon={<CreditCard className="h-6 w-6" />}
            >
              <span className="mt-2">Manage Categories</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to start managing your expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Add Your First Expense
                </h4>
                <p className="text-sm text-gray-600">
                  Click the "Add Expense" button to record your first expense
                  entry.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Categorize Your Expenses
                </h4>
                <p className="text-sm text-gray-600">
                  Use the predefined categories to organize your spending.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  View Your Analytics
                </h4>
                <p className="text-sm text-gray-600">
                  Monitor your spending patterns and track your budget.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
