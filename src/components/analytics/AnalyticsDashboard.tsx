import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Expense } from '@/types';
import { SpendingSummary } from './SpendingSummary';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { 
  calculateSpendingSummary, 
  calculateMonthlyTrend,
  getCurrentMonthDailyAverage,
  formatCurrency
} from '@/utils/analytics';

interface AnalyticsDashboardProps {
  expenses: Expense[];
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  expenses,
  className,
}) => {
  // Calculate analytics data
  const summary = useMemo(() => calculateSpendingSummary(expenses), [expenses]);
  const monthlyTrend = useMemo(() => calculateMonthlyTrend(expenses), [expenses]);
  const dailyAverage = useMemo(() => getCurrentMonthDailyAverage(expenses), [expenses]);

  // Get current month name
  const currentMonthName = new Intl.DateTimeFormat('en-US', { 
    month: 'long' 
  }).format(new Date());

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Main Summary */}
      <SpendingSummary expenses={expenses} />

      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Monthly Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Monthly Trend</span>
              {monthlyTrend.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : monthlyTrend.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : (
                <Activity className="h-4 w-4 text-gray-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>This month</span>
                <span className="font-semibold">
                  {formatCurrency(monthlyTrend.currentMonthTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Last month</span>
                <span className="font-semibold">
                  {formatCurrency(monthlyTrend.previousMonthTotal)}
                </span>
              </div>
              {monthlyTrend.changePercentage > 0 && (
                <div className={clsx(
                  'text-sm font-medium',
                  monthlyTrend.trend === 'up' ? 'text-red-600' : 'text-green-600'
                )}>
                  {monthlyTrend.trend === 'up' ? '↑' : '↓'} {monthlyTrend.changePercentage.toFixed(1)}% 
                  {monthlyTrend.trend === 'up' ? ' increase' : ' decrease'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Average */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Daily Average</span>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(dailyAverage)}
              </div>
              <div className="text-sm text-gray-600">
                Average spending per day this {currentMonthName.toLowerCase()}
              </div>
              {dailyAverage > 0 && (
                <div className="text-xs text-gray-500">
                  Projected monthly: {formatCurrency(dailyAverage * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Frequency */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Activity</span>
              <Target className="h-4 w-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {summary.expenseCount}
              </div>
              <div className="text-sm text-gray-600">
                Total expenses recorded
              </div>
              <div className="text-xs text-gray-500">
                Average: {formatCurrency(summary.averageAmount)} per expense
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownChart 
          expenses={expenses} 
          chartType="bar"
        />
        <CategoryBreakdownChart 
          expenses={expenses} 
          chartType="pie"
        />
      </div>

      {/* Quick Insights */}
      {expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Spending Summary</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• You've spent {formatCurrency(summary.currentMonthTotal)} this {currentMonthName.toLowerCase()}</li>
                  <li>• Your average expense is {formatCurrency(summary.averageAmount)}</li>
                  <li>• Total lifetime spending: {formatCurrency(summary.allTimeTotal)}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Trends</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Daily average: {formatCurrency(dailyAverage)}</li>
                  {monthlyTrend.changePercentage > 0 && (
                    <li>• {monthlyTrend.changePercentage.toFixed(1)}% {monthlyTrend.trend === 'up' ? 'increase' : 'decrease'} vs last month</li>
                  )}
                  <li>• {summary.expenseCount} total expense{summary.expenseCount !== 1 ? 's' : ''} recorded</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
