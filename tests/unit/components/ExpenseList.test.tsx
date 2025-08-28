import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { mockExpenses, mockCategories } from '../../fixtures/mock-data';
import { render as customRender } from '../../utils/test-utils';

// Mock the useExpenses hook
jest.mock('@/hooks/useExpenses', () => ({
  useExpenses: () => ({
    expenses: mockExpenses,
    isLoading: false,
    error: null,
    deleteExpenseMutation: {
      mutate: jest.fn(),
      isPending: false,
      error: null,
    },
  }),
}));

describe('ExpenseList', () => {
  const defaultProps = {
    expenses: mockExpenses,
    categories: mockCategories,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders expense list correctly', () => {
      customRender(<ExpenseList {...defaultProps} />);

      // Check that all expenses are displayed
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
      expect(screen.getByText('Gas station fill-up')).toBeInTheDocument();
      expect(screen.getByText('New headphones')).toBeInTheDocument();
      expect(screen.getByText('Movie ticket')).toBeInTheDocument();
      expect(screen.getByText('Doctor appointment')).toBeInTheDocument();
    });

    it('displays expense amounts correctly', () => {
      customRender(<ExpenseList {...defaultProps} />);

      expect(screen.getByText('$25.50')).toBeInTheDocument();
      expect(screen.getByText('$45.00')).toBeInTheDocument();
      expect(screen.getByText('$89.99')).toBeInTheDocument();
      expect(screen.getByText('$15.00')).toBeInTheDocument();
      expect(screen.getByText('$75.00')).toBeInTheDocument();
    });

    it('displays expense categories with correct colors', () => {
      customRender(<ExpenseList {...defaultProps} />);

      // Check that category names are displayed
      expect(screen.getByText('Food & Dining')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('Shopping')).toBeInTheDocument();
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
      expect(screen.getByText('Healthcare')).toBeInTheDocument();
    });

    it('displays expense dates correctly', () => {
      customRender(<ExpenseList {...defaultProps} />);

      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('2024-01-14')).toBeInTheDocument();
      expect(screen.getByText('2024-01-13')).toBeInTheDocument();
      expect(screen.getByText('2024-01-12')).toBeInTheDocument();
      expect(screen.getByText('2024-01-11')).toBeInTheDocument();
    });

    it('renders empty state when no expenses', () => {
      customRender(<ExpenseList {...defaultProps} expenses={[]} />);

      expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
      expect(screen.getByText(/add your first expense to get started/i)).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters expenses by description', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      await user.type(searchInput, 'lunch');

      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();
        expect(screen.queryByText('New headphones')).not.toBeInTheDocument();
      });
    });

    it('filters expenses by partial description', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      await user.type(searchInput, 'gas');

      await waitFor(() => {
        expect(screen.getByText('Gas station fill-up')).toBeInTheDocument();
        expect(screen.queryByText('Lunch at Subway')).not.toBeInTheDocument();
      });
    });

    it('shows no results message for non-matching search', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
        expect(screen.getByText(/try adjusting your search criteria/i)).toBeInTheDocument();
      });
    });

    it('clears search results when search is cleared', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      await user.type(searchInput, 'lunch');

      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();
      });

      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.getByText('Gas station fill-up')).toBeInTheDocument();
        expect(screen.getByText('New headphones')).toBeInTheDocument();
      });
    });
  });

  describe('Category Filtering', () => {
    it('filters expenses by category', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const categoryFilter = screen.getByLabelText(/filter by category/i);
      await user.selectOptions(categoryFilter, '1'); // Food & Dining

      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();
        expect(screen.queryByText('New headphones')).not.toBeInTheDocument();
      });
    });

    it('shows all expenses when "All Categories" is selected', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const categoryFilter = screen.getByLabelText(/filter by category/i);
      await user.selectOptions(categoryFilter, '1'); // Food & Dining

      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();
      });

      await user.selectOptions(categoryFilter, ''); // All Categories

      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.getByText('Gas station fill-up')).toBeInTheDocument();
        expect(screen.getByText('New headphones')).toBeInTheDocument();
      });
    });

    it('combines search and category filters', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      // Filter by category first
      const categoryFilter = screen.getByLabelText(/filter by category/i);
      await user.selectOptions(categoryFilter, '1'); // Food & Dining

      // Then search within that category
      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      await user.type(searchInput, 'lunch');

      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sorting', () => {
    it('sorts expenses by date (newest first) by default', () => {
      customRender(<ExpenseList {...defaultProps} />);

      const expenseItems = screen.getAllByTestId('expense-item');
      expect(expenseItems[0]).toHaveTextContent('2024-01-15'); // Latest date
      expect(expenseItems[expenseItems.length - 1]).toHaveTextContent('2024-01-11'); // Earliest date
    });

    it('sorts expenses by amount when amount sort is selected', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, 'amount');

      await waitFor(() => {
        const expenseItems = screen.getAllByTestId('expense-item');
        expect(expenseItems[0]).toHaveTextContent('$89.99'); // Highest amount
        expect(expenseItems[expenseItems.length - 1]).toHaveTextContent('$15.00'); // Lowest amount
      });
    });

    it('sorts expenses by description when description sort is selected', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, 'description');

      await waitFor(() => {
        const expenseItems = screen.getAllByTestId('expense-item');
        expect(expenseItems[0]).toHaveTextContent('Doctor appointment'); // Alphabetically first
        expect(expenseItems[expenseItems.length - 1]).toHaveTextContent('New headphones'); // Alphabetically last
      });
    });

    it('maintains sort order when filtering', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      // Set sort to amount
      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, 'amount');

      // Filter by category
      const categoryFilter = screen.getByLabelText(/filter by category/i);
      await user.selectOptions(categoryFilter, '1'); // Food & Dining

      await waitFor(() => {
        const expenseItems = screen.getAllByTestId('expense-item');
        expect(expenseItems[0]).toHaveTextContent('$25.50'); // Only expense in category, but sorted
      });
    });
  });

  describe('User Interactions', () => {
    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnEdit = jest.fn();
      
      customRender(<ExpenseList {...defaultProps} onEdit={mockOnEdit} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockExpenses[0]);
    });

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnDelete = jest.fn();
      
      customRender(<ExpenseList {...defaultProps} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledWith(mockExpenses[0].id);
    });

    it('shows confirmation dialog before deleting', async () => {
      const user = userEvent.setup();
      const mockOnDelete = jest.fn();
      
      customRender(<ExpenseList {...defaultProps} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // Check that confirmation dialog is shown
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it('cancels deletion when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnDelete = jest.fn();
      
      customRender(<ExpenseList {...defaultProps} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });

    it('confirms deletion when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnDelete = jest.fn();
      
      customRender(<ExpenseList {...defaultProps} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockExpenses[0].id);
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading state when expenses are loading', () => {
      customRender(<ExpenseList {...defaultProps} expenses={[]} isLoading={true} />);

      expect(screen.getByText(/loading expenses/i)).toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows error state when there is an error', () => {
      const errorMessage = 'Failed to load expenses';
      customRender(<ExpenseList {...defaultProps} expenses={[]} error={errorMessage} />);

      expect(screen.getByText(/error loading expenses/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('calls retry function when retry button is clicked', async () => {
      const user = userEvent.setup();
      const mockRetry = jest.fn();
      const errorMessage = 'Failed to load expenses';
      
      customRender(<ExpenseList {...defaultProps} expenses={[]} error={errorMessage} onRetry={mockRetry} />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for interactive elements', () => {
      customRender(<ExpenseList {...defaultProps} />);

      expect(screen.getByLabelText(/search expenses/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    });

    it('has proper button labels for actions', () => {
      customRender(<ExpenseList {...defaultProps} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('announces search results to screen readers', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      await user.type(searchInput, 'lunch');

      await waitFor(() => {
        expect(screen.getByText(/1 expense found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('handles large number of expenses efficiently', () => {
      const largeExpenses = Array.from({ length: 1000 }, (_, index) => ({
        id: `expense-${index}`,
        amount: Math.random() * 1000,
        description: `Expense ${index}`,
        category: mockCategories[0],
        date: new Date(2024, 0, 1 + index),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const startTime = performance.now();
      customRender(<ExpenseList {...defaultProps} expenses={largeExpenses} />);
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('debounces search input to prevent excessive filtering', async () => {
      const user = userEvent.setup();
      customRender(<ExpenseList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      
      // Type quickly
      await user.type(searchInput, 'l');
      await user.type(searchInput, 'u');
      await user.type(searchInput, 'n');
      await user.type(searchInput, 'c');
      await user.type(searchInput, 'h');

      // Should only show final result
      await waitFor(() => {
        expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
        expect(screen.queryByText('Gas station fill-up')).not.toBeInTheDocument();
      });
    });
  });
});
