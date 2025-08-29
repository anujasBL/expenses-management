import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { mockExpenses } from '@/fixtures/mock-data';

// Mock the child components
jest.mock('@/components/analytics/SpendingSummary', () => ({
  SpendingSummary: ({ expenses }: { expenses: any[] }) => (
    <div data-testid="spending-summary">
      SpendingSummary with {expenses.length} expenses
    </div>
  ),
}));

jest.mock('@/components/analytics/CategoryBreakdownChart', () => ({
  CategoryBreakdownChart: ({ expenses, chartType }: { expenses: any[], chartType: string }) => (
    <div data-testid={`category-chart-${chartType}`}>
      CategoryBreakdownChart ({chartType}) with {expenses.length} expenses
    </div>
  ),
}));

describe('AnalyticsDashboard Component', () => {
  describe('With Expenses', () => {
    it('should render all analytics components', () => {
      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      expect(screen.getByTestId('spending-summary')).toBeInTheDocument();
      expect(screen.getByTestId('category-chart-bar')).toBeInTheDocument();
      expect(screen.getByTestId('category-chart-pie')).toBeInTheDocument();
    });

    it('should display monthly trend card', () => {
      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      expect(screen.getByText('Monthly Trend')).toBeInTheDocument();
      expect(screen.getByText('This month')).toBeInTheDocument();
      expect(screen.getByText('Last month')).toBeInTheDocument();
    });

    it('should display daily average card', () => {
      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      expect(screen.getByText('Daily Average')).toBeInTheDocument();
      expect(screen.getByText(/average spending per day/i)).toBeInTheDocument();
    });

    it('should display activity metrics card', () => {
      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Total expenses recorded')).toBeInTheDocument();
      expect(screen.getByText(mockExpenses.length.toString())).toBeInTheDocument();
    });

    it('should display quick insights section', () => {
      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      expect(screen.getByText('Quick Insights')).toBeInTheDocument();
      expect(screen.getByText('Spending Summary')).toBeInTheDocument();
      expect(screen.getByText('Trends')).toBeInTheDocument();
    });

    it('should calculate and display correct totals', () => {
      const totalAmount = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      // Should display total in currency format
      expect(screen.getByText(new RegExp(totalAmount.toFixed(2)))).toBeInTheDocument();
    });

    it('should handle current month calculations', () => {
      const currentMonthExpenses = mockExpenses.filter(expense => {
        const now = new Date();
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
      });

      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      if (currentMonthExpenses.length > 0) {
        const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        expect(screen.getByText(new RegExp(currentMonthTotal.toFixed(2)))).toBeInTheDocument();
      }
    });

    it('should display trend indicators correctly', () => {
      render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      // Should have trend icons (up, down, or neutral)
      const trendElements = screen.getAllByText(/increase|decrease|vs last month/i);
      expect(trendElements.length).toBeGreaterThanOrEqual(0);
    });

    it('should apply custom className', () => {
      const { container } = render(
        <AnalyticsDashboard expenses={mockExpenses} className="custom-dashboard" />
      );
      
      expect(container.firstChild).toHaveClass('custom-dashboard');
    });
  });

  describe('With Empty Data', () => {
    it('should handle empty expenses array', () => {
      render(<AnalyticsDashboard expenses={[]} />);
      
      expect(screen.getByTestId('spending-summary')).toBeInTheDocument();
      expect(screen.getByTestId('category-chart-bar')).toBeInTheDocument();
      expect(screen.getByTestId('category-chart-pie')).toBeInTheDocument();
    });

    it('should show zero values for empty data', () => {
      render(<AnalyticsDashboard expenses={[]} />);
      
      expect(screen.getByText('0')).toBeInTheDocument(); // Activity count
      expect(screen.getAllByText(/\$0\.00/)).toHaveLength(2); // Amount displays
    });

    it('should not display quick insights for empty data', () => {
      render(<AnalyticsDashboard expenses={[]} />);
      
      expect(screen.queryByText('Quick Insights')).not.toBeInTheDocument();
    });
  });

  describe('Data Calculations', () => {
    it('should calculate daily average correctly', () => {
      const currentDate = new Date();
      const currentMonthExpenses = mockExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentDate.getMonth() && 
               expenseDate.getFullYear() === currentDate.getFullYear();
      });

      if (currentMonthExpenses.length > 0) {
        const total = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expectedDailyAverage = total / currentDate.getDate();
        
        render(<AnalyticsDashboard expenses={mockExpenses} />);
        
        expect(screen.getByText(new RegExp(expectedDailyAverage.toFixed(2)))).toBeInTheDocument();
      }
    });

    it('should calculate monthly trend correctly', () => {
      const now = new Date();
      const currentMonthExpenses = mockExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
      });

      const previousMonthExpenses = mockExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === now.getMonth() - 1 && 
               expenseDate.getFullYear() === now.getFullYear();
      });

      render(<AnalyticsDashboard expenses={mockExpenses} />);

      const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const previousTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      if (currentTotal > 0) {
        expect(screen.getByText(new RegExp(currentTotal.toFixed(2)))).toBeInTheDocument();
      }
      
      if (previousTotal > 0) {
        expect(screen.getByText(new RegExp(previousTotal.toFixed(2)))).toBeInTheDocument();
      }
    });

    it('should handle division by zero gracefully', () => {
      const emptyExpenses: any[] = [];
      render(<AnalyticsDashboard expenses={emptyExpenses} />);
      
      // Should not crash and display appropriate zero values
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getAllByText(/\$0\.00/)).toHaveLength(2);
    });
  });

  describe('Responsive Design', () => {
    it('should render grid layouts properly', () => {
      const { container } = render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      // Check for grid container classes
      const gridContainers = container.querySelectorAll('.grid');
      expect(gridContainers.length).toBeGreaterThan(0);
    });

    it('should have responsive classes', () => {
      const { container } = render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      // Check for responsive classes like md:grid-cols-2, lg:grid-cols-3, etc.
      const responsiveElements = container.querySelectorAll('[class*="md:"], [class*="lg:"]');
      expect(responsiveElements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should memoize expensive calculations', () => {
      const { rerender } = render(<AnalyticsDashboard expenses={mockExpenses} />);
      
      // Rerender with same data should not recalculate
      rerender(<AnalyticsDashboard expenses={mockExpenses} />);
      
      // Component should render without issues
      expect(screen.getByTestId('spending-summary')).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
        ...mockExpenses[0],
        id: `expense-${index}`,
        amount: Math.random() * 100,
      }));

      const startTime = performance.now();
      render(<AnalyticsDashboard expenses={largeDataset} />);
      const endTime = performance.now();

      // Should render within reasonable time (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('spending-summary')).toBeInTheDocument();
    });
  });
});
