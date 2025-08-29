import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySelector, CategoryBadge } from '@/components/ui/CategorySelector';
import { mockCategories } from '../../fixtures/mock-data';

describe('CategorySelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CategorySelector', () => {
    it('should render all categories', () => {
      render(<CategorySelector value="" onChange={mockOnChange} />);
      
      mockCategories.forEach(category => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });

    it('should show selected category with visual feedback', () => {
      render(<CategorySelector value="food" onChange={mockOnChange} />);
      
      const foodButton = screen.getByRole('button', { name: /food/i });
      expect(foodButton).toHaveStyle({ 
        borderColor: mockCategories[0].color 
      });
    });

    it('should call onChange when category is selected', async () => {
      const user = userEvent.setup();
      render(<CategorySelector value="" onChange={mockOnChange} />);
      
      await user.click(screen.getByRole('button', { name: /food/i }));
      
      expect(mockOnChange).toHaveBeenCalledWith('food');
    });

    it('should display validation error when provided', () => {
      render(
        <CategorySelector 
          value="" 
          onChange={mockOnChange} 
          error="Category is required"
        />
      );
      
      expect(screen.getByText('Category is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should show required indicator when required=true', () => {
      render(
        <CategorySelector 
          value="" 
          onChange={mockOnChange} 
          label="Category"
          required 
        />
      );
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should be disabled when disabled=true', () => {
      render(<CategorySelector value="" onChange={mockOnChange} disabled />);
      
      mockCategories.forEach(category => {
        const button = screen.getByRole('button', { name: new RegExp(category.name, 'i') });
        expect(button).toBeDisabled();
      });
    });

    it('should display category descriptions', () => {
      render(<CategorySelector value="" onChange={mockOnChange} />);
      
      // Check for specific descriptions that we know are in the actual component
      expect(screen.getByText(/restaurants, groceries, and dining out/i)).toBeInTheDocument();
      expect(screen.getByText(/gas, public transit, and vehicle maintenance/i)).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(
        <CategorySelector 
          value="" 
          onChange={mockOnChange} 
          label="Category"
          required
        />
      );
      
      expect(screen.getByText('Category')).toBeInTheDocument();
      mockCategories.forEach(category => {
        const button = screen.getByRole('button', { name: new RegExp(category.name, 'i') });
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('CategoryBadge', () => {
    const mockCategory = mockCategories[0];

    it('should render category name and icon', () => {
      render(<CategoryBadge category={mockCategory} />);
      
      expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
    });

    it('should apply correct size classes', () => {
      const { rerender } = render(<CategoryBadge category={mockCategory} size="sm" />);
      
      let badge = screen.getByText(mockCategory.name).closest('span');
      expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
      
      rerender(<CategoryBadge category={mockCategory} size="lg" />);
      badge = screen.getByText(mockCategory.name).closest('span');
      expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should hide icon when showIcon=false', () => {
      render(<CategoryBadge category={mockCategory} showIcon={false} />);
      
      expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
      // When showIcon=false, there should be no svg element
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByTestId('category-icon')).not.toBeInTheDocument();
    });

    it('should apply category color styles', () => {
      render(<CategoryBadge category={mockCategory} />);
      
      const badge = screen.getByText(mockCategory.name).closest('span');
      expect(badge).toHaveStyle({
        backgroundColor: `${mockCategory.color}20`,
        color: mockCategory.color,
      });
    });

    it('should apply custom className', () => {
      render(<CategoryBadge category={mockCategory} className="custom-class" />);
      
      const badge = screen.getByText(mockCategory.name).closest('span');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('Integration Tests', () => {
    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<CategorySelector value="" onChange={mockOnChange} />);
      
      const firstButton = screen.getByRole('button', { name: /food/i });
      firstButton.focus();
      
      await user.keyboard('{Tab}');
      
      // Should move focus to next category button
      const secondButton = screen.getByRole('button', { name: /transportation/i });
      expect(secondButton).toHaveFocus();
    });

    it('should handle Enter key selection', async () => {
      const user = userEvent.setup();
      render(<CategorySelector value="" onChange={mockOnChange} />);
      
      const foodButton = screen.getByRole('button', { name: /food/i });
      foodButton.focus();
      
      await user.keyboard('{Enter}');
      
      expect(mockOnChange).toHaveBeenCalledWith('food');
    });

    it('should handle Space key selection', async () => {
      const user = userEvent.setup();
      render(<CategorySelector value="" onChange={mockOnChange} />);
      
      const foodButton = screen.getByRole('button', { name: /food/i });
      foodButton.focus();
      
      await user.keyboard(' ');
      
      expect(mockOnChange).toHaveBeenCalledWith('food');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty category list gracefully', () => {
      // Mock the constants module to return empty categories
      jest.doMock('@/constants', () => ({
        EXPENSE_CATEGORIES: [],
      }));
      
      render(<CategorySelector value="" onChange={mockOnChange} />);
      
      // Should render without crashing and show the helper text
      expect(screen.getByText(/choose the category/i)).toBeInTheDocument();
    });

    it('should handle invalid category value', () => {
      render(<CategorySelector value="invalid-category" onChange={mockOnChange} />);
      
      // Should not crash and no category should be selected
      mockCategories.forEach(category => {
        const button = screen.getByRole('button', { name: new RegExp(category.name, 'i') });
        expect(button).not.toHaveStyle({ borderColor: category.color });
      });
    });

    it('should handle missing icon gracefully', () => {
      const categoryWithoutIcon = {
        ...mockCategories[0],
        icon: 'invalid-icon'
      };
      
      render(<CategoryBadge category={categoryWithoutIcon} />);
      
      // Should render with fallback icon
      expect(screen.getByText(categoryWithoutIcon.name)).toBeInTheDocument();
    });
  });
});
