import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Expense, CategoryBreakdown } from '@/types';
import { EXPENSE_CATEGORIES, CURRENCY } from '@/constants';
import { CategoryBadge } from '@/components/ui/CategorySelector';
import { BarChart3, PieChart } from 'lucide-react';
import { clsx } from 'clsx';

interface CategoryBreakdownChartProps {
  expenses: Expense[];
  className?: string;
  chartType?: 'bar' | 'pie';
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  expenses,
  className,
  chartType = 'bar',
}) => {
  // Calculate category breakdown
  const categoryBreakdown: CategoryBreakdown[] = useMemo(() => {
    const allTimeTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryTotals = EXPENSE_CATEGORIES.map(category => {
      const categoryExpenses = expenses.filter(
        expense => expense.category.id === category.id
      );
      
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const percentage = allTimeTotal > 0 ? (total / allTimeTotal) * 100 : 0;

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
  }, [expenses]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY.locale, {
      style: 'currency',
      currency: CURRENCY.code,
    }).format(amount);
  };

  // Get the maximum total for calculating bar widths
  const maxTotal = categoryBreakdown.length > 0 ? categoryBreakdown[0].total : 0;

  return (
    <Card className={clsx('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {chartType === 'bar' ? (
            <BarChart3 className="h-5 w-5" />
          ) : (
            <PieChart className="h-5 w-5" />
          )}
          <span>Category Breakdown</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {categoryBreakdown.length > 0 ? (
          <div className="space-y-4">
            {chartType === 'bar' ? (
              // Bar Chart View
              <div className="space-y-4">
                {categoryBreakdown.map((item) => (
                  <div key={item.category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CategoryBadge category={item.category} size="sm" />
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.percentage.toFixed(1)}% • {item.count} expense{item.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${(item.total / maxTotal) * 100}%`,
                            backgroundColor: item.category.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Pie Chart View (Visual representation with segments)
              <div className="space-y-4">
                {/* Simple visual pie representation */}
                <div className="relative w-48 h-48 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {categoryBreakdown.map((item, index) => {
                      const startAngle = categoryBreakdown
                        .slice(0, index)
                        .reduce((acc, curr) => acc + (curr.percentage * 3.6), 0);
                      const endAngle = startAngle + (item.percentage * 3.6);
                      
                      const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                      const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                      
                      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                      
                      const pathData = [
                        `M 50 50`,
                        `L ${x1} ${y1}`,
                        `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        'Z'
                      ].join(' ');

                      return (
                        <path
                          key={item.category.id}
                          d={pathData}
                          fill={item.category.color}
                          className="hover:opacity-80 transition-opacity"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {categoryBreakdown.map((item) => (
                    <div key={item.category.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.category.color }}
                        />
                        <span className="font-medium text-gray-900">
                          {item.category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No spending data
            </h3>
            <p className="text-gray-500">
              Add some expenses to see your category breakdown.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
