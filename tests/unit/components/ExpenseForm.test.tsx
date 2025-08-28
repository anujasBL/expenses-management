import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { mockCategories, mockExpenseFormData } from '../../fixtures/mock-data';
import { render as customRender } from '../../utils/test-utils';

// Mock the useExpenses hook
jest.mock('@/hooks/useExpenses', () => ({
  useExpenses: () => ({
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
  }),
}));

describe('ExpenseForm', () => {
  const defaultProps = {
    categories: mockCategories,
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    initialData: undefined,
    isEditing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields correctly', () => {
      customRender(<ExpenseForm {...defaultProps} />);

      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
    });

    it('renders with correct initial values when editing', () => {
      const initialData = {
        id: 'food',
        amount: 25.50,
        description: 'Test expense',
        category: mockCategories[0],
        date: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      customRender(
        <ExpenseForm
          {...defaultProps}
          initialData={initialData}
          isEditMode={true}
        />
      );

      expect(screen.getByDisplayValue('25.50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test expense')).toBeInTheDocument();
      expect(screen.getByDisplayValue('food')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update expense/i })).toBeInTheDocument();
    });

    it('displays all category options', () => {
      customRender(<ExpenseForm {...defaultProps} />);

      const categorySelect = screen.getByLabelText(/category/i);
      expect(categorySelect).toBeInTheDocument();

      // Check that all categories are available
      mockCategories.forEach(category => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('shows validation error for empty amount', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for empty description', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseForm {...defaultProps} />);

      // Fill amount but leave description empty
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '25.50');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for invalid amount format', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseForm {...defaultProps} />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, 'invalid');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/amount must be a valid number/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for negative amount', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseForm {...defaultProps} />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '-25.50');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for zero amount', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseForm {...defaultProps} />);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '0');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      
      customRender(<ExpenseForm {...defaultProps} onSubmit={mockOnSubmit} />);

      // Fill form with valid data
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);
      const dateInput = screen.getByLabelText(/date/i);

      await user.type(amountInput, '25.50');
      await user.type(descriptionInput, 'Lunch');
      await user.selectOptions(categorySelect, 'food');
      await user.type(dateInput, '2024-01-15');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          amount: 25.50,
          description: 'Lunch',
          category: 'food',
          date: expect.any(Date),
        });
      });
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCancel = jest.fn();
      
      customRender(<ExpenseForm {...defaultProps} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      
      customRender(<ExpenseForm {...defaultProps} onSubmit={mockOnSubmit} />);

      // Fill and submit form
      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, '25.50');
      await user.type(descriptionInput, 'Lunch');
      await user.selectOptions(categorySelect, 'food');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      // Check that form is reset
      expect(amountInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(categorySelect).toHaveValue('');
    });
  });

  describe('Edit Mode', () => {
    it('populates form with initial data when editing', () => {
      const initialData = {
        id: 'food',
        amount: 25.50,
        description: 'Test expense',
        category: mockCategories[0],
        date: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      customRender(
        <ExpenseForm
          {...defaultProps}
          initialData={initialData}
          isEditMode={true}
        />
      );

      expect(screen.getByDisplayValue('25.50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test expense')).toBeInTheDocument();
      expect(screen.getByDisplayValue('food')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    });

    it('shows update button text when editing', () => {
      const initialData = {
        id: 'food',
        amount: 25.50,
        description: 'Test expense',
        category: mockCategories[0],
        date: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      customRender(
        <ExpenseForm
          {...defaultProps}
          initialData={initialData}
          isEditMode={true}
        />
      );

      expect(screen.getByRole('button', { name: /update expense/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add expense/i })).not.toBeInTheDocument();
    });

    it('submits updated data when editing', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      const initialData = {
        id: 'food',
        amount: 25.50,
        description: 'Test expense',
        category: mockCategories[0],
        date: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      customRender(
        <ExpenseForm
          {...defaultProps}
          initialData={initialData}
          isEditMode={true}
          onSubmit={mockOnSubmit}
        />
      );

      // Update description
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated expense');

      const updateButton = screen.getByRole('button', { name: /update expense/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          amount: 25.50,
          description: 'Updated expense',
          category: 'food',
          date: expect.any(Date),
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form fields', () => {
      customRender(<ExpenseForm {...defaultProps} />);

      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    it('has proper button types', () => {
      customRender(<ExpenseForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('shows validation errors with proper ARIA attributes', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles very large amounts correctly', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      
      customRender(<ExpenseForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, '999999.99');
      await user.type(descriptionInput, 'Large expense');
      await user.selectOptions(categorySelect, 'food');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          amount: 999999.99,
          description: 'Large expense',
          category: 'food',
          date: expect.any(Date),
        });
      });
    });

    it('handles special characters in description', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      
      customRender(<ExpenseForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categorySelect = screen.getByLabelText(/category/i);

      await user.type(amountInput, '15.00');
      await user.type(descriptionInput, 'Special chars: !@#$%^&*()');
      await user.selectOptions(categorySelect, 'food');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          amount: 15.00,
          description: 'Special chars: !@#$%^&*()',
          category: 'food',
          date: expect.any(Date),
        });
      });
    });

    it('handles empty categories array gracefully', () => {
      customRender(<ExpenseForm {...defaultProps} categories={[]} />);

      // Should still render the form but without category options
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });
  });
});
