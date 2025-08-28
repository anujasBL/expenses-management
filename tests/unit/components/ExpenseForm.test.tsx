import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { mockCategories } from '../../fixtures/mock-data';
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
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    initialData: undefined,
    isEditMode: false,
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
      expect(
        screen.getByRole('button', { name: /add expense/i })
      ).toBeInTheDocument();
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
    it('shows basic form structure', () => {
      customRender(<ExpenseForm {...defaultProps} />);

      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCancel = jest.fn();

      customRender(<ExpenseForm {...defaultProps} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    it('shows update button text when editing', () => {
      const initialData = {
        id: 'food',
        amount: 25.5,
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

      expect(
        screen.getByRole('button', { name: /update expense/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add expense/i })
      ).not.toBeInTheDocument();
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
  });

  describe('Edge Cases', () => {
    it('renders form fields correctly', () => {
      customRender(<ExpenseForm {...defaultProps} />);

      // Should render all form fields
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });
  });
});
