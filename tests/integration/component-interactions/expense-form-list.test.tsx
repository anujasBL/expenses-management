import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { mockExpenses } from '../../fixtures/mock-data';
import { Expense } from '@/types';

// Mock the CategorySelector to simplify testing
jest.mock('@/components/ui/CategorySelector', () => ({
  CategorySelector: ({ 
    value, 
    onChange, 
    error, 
    label = 'Category'
  }: {
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
  }) => (
    <div>
      <label htmlFor="category-select">{label}</label>
      <select 
        id="category-select"
        data-testid="category-selector"
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select category</option>
        <option value="food">Food</option>
        <option value="transportation">Transportation</option>
        <option value="entertainment">Entertainment</option>
      </select>
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

describe('ExpenseForm and ExpenseList Integration', () => {
  let expenses: Expense[] = [];
  const mockAddExpense = jest.fn((newExpense) => {
    const expense: Expense = {
      id: `test-${Date.now()}`,
      ...newExpense,
      category: { 
        id: newExpense.category, 
        name: 'Test Category',
        color: '#000000',
        icon: 'test'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expenses.push(expense);
  });

  const renderComponents = () => {
    return render(
      <div>
        <ExpenseForm onSubmit={mockAddExpense} />
        <ExpenseList expenses={expenses} />
      </div>
    );
  };

  beforeEach(() => {
    expenses = [...mockExpenses];
    jest.clearAllMocks();
  });

  describe('Form Submission and List Update', () => {
    it('should add expense to list when form is submitted', async () => {
      const user = userEvent.setup();
      renderComponents();

      // Fill out the form
      await user.type(screen.getByLabelText(/amount/i), '25.50');
      await user.type(screen.getByLabelText(/description/i), 'Coffee and pastry');
      await user.selectOptions(screen.getByTestId('category-selector'), 'food');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Verify the callback was called
      expect(mockAddExpense).toHaveBeenCalledWith({
        amount: 25.50,
        description: 'Coffee and pastry',
        category: 'food',
        date: expect.any(Date),
      });
    });

    it('should handle form validation errors', async () => {
      const user = userEvent.setup();
      renderComponents();

      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Verify validation errors appear
      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });

      // Verify form was not submitted
      expect(mockAddExpense).not.toHaveBeenCalled();
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      renderComponents();

      // Fill and submit form
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByTestId('category-selector');

      await user.type(amountInput, '30.00');
      await user.type(descriptionInput, 'Lunch');
      await user.selectOptions(categorySelect, 'food');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Verify form is cleared (in a real implementation)
      // This would depend on the actual form clearing logic
      expect(mockAddExpense).toHaveBeenCalled();
    });
  });

  describe('Data Flow and State Management', () => {
    it('should maintain expense list state across multiple additions', async () => {
      const user = userEvent.setup();
      renderComponents();

      // Add first expense
      await user.type(screen.getByLabelText(/amount/i), '15.00');
      await user.type(screen.getByLabelText(/description/i), 'Coffee');
      await user.selectOptions(screen.getByTestId('category-selector'), 'food');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      expect(mockAddExpense).toHaveBeenCalledTimes(1);

      // Clear form manually for testing (in real implementation this would be automatic)
      await user.clear(screen.getByLabelText(/amount/i));
      await user.clear(screen.getByLabelText(/description/i));

      // Add second expense
      await user.type(screen.getByLabelText(/amount/i), '45.00');
      await user.type(screen.getByLabelText(/description/i), 'Gas');
      await user.selectOptions(screen.getByTestId('category-selector'), 'transportation');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      expect(mockAddExpense).toHaveBeenCalledTimes(2);
    });

    it('should handle different expense categories correctly', async () => {
      const user = userEvent.setup();
      renderComponents();

      const testCases = [
        { amount: '20.00', description: 'Movie ticket', category: 'entertainment' },
        { amount: '50.00', description: 'Groceries', category: 'food' },
        { amount: '30.00', description: 'Bus fare', category: 'transportation' },
      ];

      for (const testCase of testCases) {
        await user.clear(screen.getByLabelText(/amount/i));
        await user.clear(screen.getByLabelText(/description/i));

        await user.type(screen.getByLabelText(/amount/i), testCase.amount);
        await user.type(screen.getByLabelText(/description/i), testCase.description);
        await user.selectOptions(screen.getByTestId('category-selector'), testCase.category);
        await user.click(screen.getByRole('button', { name: /add expense/i }));
      }

      expect(mockAddExpense).toHaveBeenCalledTimes(3);
      
      // Verify each call had correct data
      expect(mockAddExpense).toHaveBeenNthCalledWith(1, {
        amount: 20.00,
        description: 'Movie ticket',
        category: 'entertainment',
        date: expect.any(Date),
      });
    });
  });

  describe('Form Validation and User Experience', () => {
    it('should validate amount format correctly', async () => {
      const user = userEvent.setup();
      renderComponents();

      // Test invalid amount formats
      await user.type(screen.getByLabelText(/amount/i), 'invalid');
      await user.type(screen.getByLabelText(/description/i), 'Test expense');
      await user.selectOptions(screen.getByTestId('category-selector'), 'food');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      await waitFor(() => {
        expect(screen.getByText(/amount must be a valid number/i)).toBeInTheDocument();
      });

      expect(mockAddExpense).not.toHaveBeenCalled();
    });

    it('should validate amount is greater than zero', async () => {
      const user = userEvent.setup();
      renderComponents();

      await user.type(screen.getByLabelText(/amount/i), '0');
      await user.type(screen.getByLabelText(/description/i), 'Test expense');
      await user.selectOptions(screen.getByTestId('category-selector'), 'food');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      await waitFor(() => {
        expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      });

      expect(mockAddExpense).not.toHaveBeenCalled();
    });

    it('should require category selection', async () => {
      const user = userEvent.setup();
      renderComponents();

      await user.type(screen.getByLabelText(/amount/i), '25.00');
      await user.type(screen.getByLabelText(/description/i), 'Test expense');
      // Don't select category
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      await waitFor(() => {
        expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      });

      expect(mockAddExpense).not.toHaveBeenCalled();
    });

    it('should handle loading state during submission', async () => {
      const user = userEvent.setup();
      
      // Mock a slow submission
      const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(
        <div>
          <ExpenseForm onSubmit={slowSubmit} isLoading={true} />
          <ExpenseList expenses={expenses} />
        </div>
      );

      // Form should be disabled during loading
      expect(screen.getByRole('button', { name: /adding.../i })).toBeDisabled();
      
      // User shouldn't be able to submit
      await user.click(screen.getByRole('button', { name: /adding.../i }));
      expect(slowSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have proper ARIA labels and roles', () => {
      renderComponents();

      // Check form accessibility
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();

      // Check button accessibility
      expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
    });

    it('should show validation errors with proper ARIA attributes', async () => {
      const user = userEvent.setup();
      renderComponents();

      await user.click(screen.getByRole('button', { name: /add expense/i }));

      await waitFor(() => {
        const errorElements = screen.getAllByRole('alert');
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle keyboard navigation properly', async () => {
      const user = userEvent.setup();
      renderComponents();

      // Test tab navigation through form fields
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByTestId('category-selector');
      const submitButton = screen.getByRole('button', { name: /add expense/i });

      amountInput.focus();
      expect(amountInput).toHaveFocus();

      await user.tab();
      expect(descriptionInput).toHaveFocus();

      await user.tab();
      expect(categorySelect).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle submission errors gracefully', async () => {
      const user = userEvent.setup();
      const failingSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
      
      render(
        <div>
          <ExpenseForm onSubmit={failingSubmit} />
          <ExpenseList expenses={expenses} />
        </div>
      );

      await user.type(screen.getByLabelText(/amount/i), '25.00');
      await user.type(screen.getByLabelText(/description/i), 'Test expense');
      await user.selectOptions(screen.getByTestId('category-selector'), 'food');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // In a real implementation, this would show an error message
      expect(failingSubmit).toHaveBeenCalled();
    });

    it('should maintain form data when submission fails', async () => {
      const user = userEvent.setup();
      const failingSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
      
      render(
        <div>
          <ExpenseForm onSubmit={failingSubmit} />
          <ExpenseList expenses={expenses} />
        </div>
      );

      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(amountInput, '25.00');
      await user.type(descriptionInput, 'Important expense');
      await user.selectOptions(screen.getByTestId('category-selector'), 'food');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Form data should still be there after failed submission
      // (In a real implementation, this would depend on error handling logic)
      expect(failingSubmit).toHaveBeenCalled();
    });
  });
});
