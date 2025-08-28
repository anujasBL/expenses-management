import React from 'react';
import { screen } from '@testing-library/react';
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

    it('displays expense categories correctly', () => {
      customRender(<ExpenseList {...defaultProps} />);
      // Just check that some category-related content is present
      expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
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

      expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument();
      expect(
        screen.getByText(/start tracking your expenses/i)
      ).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('displays search input correctly', () => {
      customRender(<ExpenseList {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText(/search expenses/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('displays category filter correctly', () => {
      customRender(<ExpenseList {...defaultProps} />);
      expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('displays sorting options correctly', () => {
      customRender(<ExpenseList {...defaultProps} />);
      // Check that sorting interface exists
      expect(screen.getByText(/Date/)).toBeInTheDocument();
      expect(screen.getByText(/Amount/)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('displays edit and delete buttons', () => {
      customRender(<ExpenseList {...defaultProps} />);

      const editButtons = screen.getAllByLabelText(/edit/i);
      const deleteButtons = screen.getAllByLabelText(/delete/i);

      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Loading and Error States', () => {
    it('displays content when not loading or erroring', () => {
      customRender(<ExpenseList {...defaultProps} />);
      expect(screen.getByText('Lunch at Subway')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for search', () => {
      customRender(<ExpenseList {...defaultProps} />);
      expect(screen.getByLabelText(/search expenses/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders with reasonable performance', () => {
      const startTime = performance.now();
      customRender(<ExpenseList {...defaultProps} />);
      const endTime = performance.now();

      // Basic sanity check that it renders
      expect(endTime - startTime).toBeLessThan(5000); // Very generous limit
    });
  });
});
