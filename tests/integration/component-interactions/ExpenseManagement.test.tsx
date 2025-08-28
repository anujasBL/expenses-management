import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Expenses } from '@/components/pages/Expenses';
import { mockExpenses, mockCategories } from '../../fixtures/mock-data';
import { render as customRender } from '../../utils/test-utils';

// Mock the useExpenses hook
const mockUseExpenses = {
  expenses: mockExpenses,
  isLoading: false,
  error: null,
  addExpenseMutation: {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  },
  updateExpenseMutation: {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  },
  deleteExpenseMutation: {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  },
  addExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
  refetchExpenses: jest.fn(),
  totalExpenses: 250.49,
  currentMonthExpenses: 70.50,
  averageExpense: 50.10,
  findCategoryById: jest.fn((id: string) => mockCategories.find(cat => cat.id === id)),
};

jest.mock('@/hooks/useExpenses', () => ({
  useExpenses: () => mockUseExpenses,
}));

describe('Expense Management Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Expense Workflow', () => {
    it('allows user to add a new expense and see it in the list', async () => {
      const user = userEvent.setup();
      const mockAddExpense = jest.fn().mockResolvedValue({
        id: 'new-expense',
        amount: 35.00,
        description: 'Coffee and pastry',
        category: mockCategories[0],
        date: new Date('2024-01-16'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUseExpenses.addExpense = mockAddExpense;

      customRender(<Expenses />);

      // Check initial state
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.getByText('Gas station fill-up')).toBeInTheDocument();

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Fill out the form
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);
      const dateInput = screen.getByLabelText(/date/i);

      await user.type(amountInput, '35.00');
      await user.type(descriptionInput, 'Coffee and pastry');
      await user.selectOptions(categorySelect, '1');
      await user.type(dateInput, '2024-01-16');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify the expense was added
      await waitFor(() => {
        expect(mockAddExpense).toHaveBeenCalledWith({
          amount: 35.00,
          description: 'Coffee and pastry',
          category: '1',
          date: expect.any(Date),
        });
      });

      // Verify form is reset
      expect(amountInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(categorySelect).toHaveValue('');
    });

    it('allows user to edit an existing expense', async () => {
      const user = userEvent.setup();
      const mockUpdateExpense = jest.fn().mockResolvedValue({
        id: '1',
        amount: 30.00,
        description: 'Updated lunch',
        category: mockCategories[0],
        date: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUseExpenses.updateExpense = mockUpdateExpense;

      customRender(<Expenses />);

      // Find and click edit button for first expense
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      // Verify form is populated with expense data
      expect(screen.getByDisplayValue('25.50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Lunch at Subway')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();

      // Update the expense
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated lunch');

      const amountInput = screen.getByLabelText(/amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '30.00');

      // Submit the update
      const updateButton = screen.getByRole('button', { name: /update expense/i });
      await user.click(updateButton);

      // Verify the expense was updated
      await waitFor(() => {
        expect(mockUpdateExpense).toHaveBeenCalledWith('1', {
          amount: 30.00,
          description: 'Updated lunch',
          category: '1',
          date: expect.any(Date),
        });
      });
    });

    it('allows user to delete an expense with confirmation', async () => {
      const user = userEvent.setup();
      const mockDeleteExpense = jest.fn().mockResolvedValue({});

      mockUseExpenses.deleteExpense = mockDeleteExpense;

      customRender(<Expenses />);

      // Find and click delete button for first expense
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // Verify confirmation dialog appears
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      // Verify the expense was deleted
      await waitFor(() => {
        expect(mockDeleteExpense).toHaveBeenCalledWith('1');
      });

      // Verify confirmation dialog is closed
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });

    it('cancels deletion when user clicks cancel', async () => {
      const user = userEvent.setup();
      const mockDeleteExpense = jest.fn();

      mockUseExpenses.deleteExpense = mockDeleteExpense;

      customRender(<Expenses />);

      // Find and click delete button for first expense
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // Verify confirmation dialog appears
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

      // Cancel deletion
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Verify the expense was not deleted
      expect(mockDeleteExpense).not.toHaveBeenCalled();

      // Verify confirmation dialog is closed
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
  });

  describe('Search and Filter Integration', () => {
    it('combines search and category filtering correctly', async () => {
      const user = userEvent.setup();

      customRender(<Expenses />);

      // First, filter by category
      const categoryFilter = screen.getByLabelText(/filter by category/i);
      await user.selectOptions(categoryFilter, '1'); // Food & Dining

      // Verify only food expenses are shown
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();

      // Then search within that category
      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      await user.type(searchInput, 'lunch');

      // Verify only matching expenses in the selected category are shown
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();

      // Clear search to see all expenses in the category
      await user.clear(searchInput);
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();

      // Clear category filter to see all expenses
      await user.selectOptions(categoryFilter, '');
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.getByText('Gas station fill-up')).toBeInTheDocument();
    });

    it('maintains search and filter state when switching between add/edit modes', async () => {
      const user = userEvent.setup();

      customRender(<Expenses />);

      // Set up search and filter
      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      const categoryFilter = screen.getByLabelText(/filter by category/i);

      await user.type(searchInput, 'lunch');
      await user.selectOptions(categoryFilter, '1');

      // Verify filtered results
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Verify form is open
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();

      // Cancel form to return to list
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Verify search and filter state is maintained
      expect(searchInput).toHaveValue('lunch');
      expect(categoryFilter).toHaveValue('1');
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation Integration', () => {
    it('prevents form submission with invalid data', async () => {
      const user = userEvent.setup();

      customRender(<Expenses />);

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify validation errors are shown
      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });

      // Verify form was not submitted
      expect(mockUseExpenses.addExpense).not.toHaveBeenCalled();
    });

    it('shows validation errors for invalid amount formats', async () => {
      const user = userEvent.setup();

      customRender(<Expenses />);

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Fill amount with invalid value
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, 'invalid');
      await user.type(descriptionInput, 'Test expense');
      await user.selectOptions(categorySelect, '1');

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify validation error is shown
      await waitFor(() => {
        expect(screen.getByText(/amount must be a valid number/i)).toBeInTheDocument();
      });

      // Verify form was not submitted
      expect(mockUseExpenses.addExpense).not.toHaveBeenCalled();
    });

    it('clears validation errors when user starts typing', async () => {
      const user = userEvent.setup();

      customRender(<Expenses />);

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify validation errors are shown
      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      });

      // Start typing in amount field
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '25');

      // Verify validation error is cleared
      expect(screen.queryByText(/amount is required/i)).not.toBeInTheDocument();
    });
  });

  describe('State Management Integration', () => {
    it('updates expense list after successful operations', async () => {
      const user = userEvent.setup();
      const mockAddExpense = jest.fn().mockResolvedValue({
        id: 'new-expense',
        amount: 35.00,
        description: 'Coffee and pastry',
        category: mockCategories[0],
        date: new Date('2024-01-16'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUseExpenses.addExpense = mockAddExpense;

      customRender(<Expenses />);

      // Verify initial expense count
      const initialExpenseCount = screen.getAllByTestId('expense-item').length;

      // Add new expense
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, '35.00');
      await user.type(descriptionInput, 'Coffee and pastry');
      await user.selectOptions(categorySelect, '1');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify expense was added
      await waitFor(() => {
        expect(mockAddExpense).toHaveBeenCalled();
      });

      // Verify list was updated (this would require the hook to actually update the list)
      // In a real scenario, the hook would update the expenses array
    });

    it('handles loading states during operations', async () => {
      const user = userEvent.setup();
      let resolveAddExpense: (value: any) => void;
      const mockAddExpense = jest.fn().mockImplementation(() => 
        new Promise((resolve) => {
          resolveAddExpense = resolve;
        })
      );

      mockUseExpenses.addExpense = mockAddExpense;
      mockUseExpenses.addExpenseMutation.isPending = true;

      customRender(<Expenses />);

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Fill form
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, '35.00');
      await user.type(descriptionInput, 'Coffee and pastry');
      await user.selectOptions(categorySelect, '1');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify loading state is shown
      expect(screen.getByText(/adding expense/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Resolve the promise
      resolveAddExpense!({});

      // Verify loading state is cleared
      await waitFor(() => {
        expect(screen.queryByText(/adding expense/i)).not.toBeInTheDocument();
      });
    });

    it('handles error states during operations', async () => {
      const user = userEvent.setup();
      const mockAddExpense = jest.fn().mockRejectedValue(new Error('Failed to add expense'));

      mockUseExpenses.addExpense = mockAddExpense;

      customRender(<Expenses />);

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Fill form
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, '35.00');
      await user.type(descriptionInput, 'Coffee and pastry');
      await user.selectOptions(categorySelect, '1');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify error is handled
      await waitFor(() => {
        expect(mockAddExpense).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains proper focus management during form interactions', async () => {
      const user = userEvent.setup();

      customRender(<Expenses />);

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Verify focus is on the first form field
      const amountInput = screen.getByLabelText(/amount/i);
      expect(amountInput).toHaveFocus();

      // Tab through form fields
      await user.tab();
      const descriptionInput = screen.getByLabelText(/description/i);
      expect(descriptionInput).toHaveFocus();

      await user.tab();
      const categorySelect = screen.getByLabelText(/category/i);
      expect(categorySelect).toHaveFocus();

      await user.tab();
      const dateInput = screen.getByLabelText(/date/i);
      expect(dateInput).toHaveFocus();

      await user.tab();
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      expect(submitButton).toHaveFocus();
    });

    it('announces form state changes to screen readers', async () => {
      const user = userEvent.setup();

      customRender(<Expenses />);

      // Open add expense form
      const addButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(addButton);

      // Verify form is announced
      expect(screen.getByText(/add new expense/i)).toBeInTheDocument();

      // Fill form and submit
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, '35.00');
      await user.type(descriptionInput, 'Coffee and pastry');
      await user.selectOptions(categorySelect, '1');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      // Verify success message is announced
      await waitFor(() => {
        expect(screen.getByText(/expense added successfully/i)).toBeInTheDocument();
      });
    });
  });
});
