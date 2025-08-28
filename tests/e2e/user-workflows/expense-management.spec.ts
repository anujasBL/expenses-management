import { test, expect } from '@playwright/test';

test.describe('Expense Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the expenses page
    await page.goto('/expenses');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="expenses-page"]');
  });

  test.describe('Add New Expense Workflow', () => {
    test('should add a new expense successfully', async ({ page }) => {
      // Click add expense button
      await page.click('[data-testid="add-expense-button"]');
      
      // Wait for form to appear
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Fill out the form
      await page.fill('[data-testid="amount-input"]', '25.50');
      await page.fill('[data-testid="description-input"]', 'Lunch at Subway');
      await page.selectOption('[data-testid="category-select"]', '1');
      await page.fill('[data-testid="date-input"]', '2024-01-16');
      
      // Submit the form
      await page.click('[data-testid="submit-button"]');
      
      // Wait for success message
      await page.waitForSelector('[data-testid="success-message"]');
      
      // Verify the new expense appears in the list
      await expect(page.locator('text=Lunch at Subway')).toBeVisible();
      await expect(page.locator('text=$25.50')).toBeVisible();
      
      // Verify form is reset
      await expect(page.locator('[data-testid="amount-input"]')).toHaveValue('');
      await expect(page.locator('[data-testid="description-input"]')).toHaveValue('');
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      // Click add expense button
      await page.click('[data-testid="add-expense-button"]');
      
      // Wait for form to appear
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Try to submit without filling required fields
      await page.click('[data-testid="submit-button"]');
      
      // Verify validation errors are shown
      await expect(page.locator('text=Amount is required')).toBeVisible();
      await expect(page.locator('text=Description is required')).toBeVisible();
      
      // Verify form was not submitted
      await expect(page.locator('[data-testid="success-message"]')).not.toBeVisible();
    });

    test('should handle invalid amount format', async ({ page }) => {
      // Click add expense button
      await page.click('[data-testid="add-expense-button"]');
      
      // Wait for form to appear
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Fill amount with invalid value
      await page.fill('[data-testid="amount-input"]', 'invalid');
      await page.fill('[data-testid="description-input"]', 'Test expense');
      await page.selectOption('[data-testid="category-select"]', '1');
      
      // Try to submit
      await page.click('[data-testid="submit-button"]');
      
      // Verify validation error is shown
      await expect(page.locator('text=Amount must be a valid number')).toBeVisible();
    });

    test('should handle negative amount', async ({ page }) => {
      // Click add expense button
      await page.click('[data-testid="add-expense-button"]');
      
      // Wait for form to appear
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Fill amount with negative value
      await page.fill('[data-testid="amount-input"]', '-25.50');
      await page.fill('[data-testid="description-input"]', 'Test expense');
      await page.selectOption('[data-testid="category-select"]', '1');
      
      // Try to submit
      await page.click('[data-testid="submit-button"]');
      
      // Verify validation error is shown
      await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();
    });
  });

  test.describe('Edit Expense Workflow', () => {
    test('should edit an existing expense successfully', async ({ page }) => {
      // Find and click edit button for first expense
      const editButtons = page.locator('[data-testid="edit-button"]');
      await editButtons.first().click();
      
      // Wait for form to appear with expense data
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Verify form is populated with expense data
      await expect(page.locator('[data-testid="amount-input"]')).toHaveValue('25.50');
      await expect(page.locator('[data-testid="description-input"]')).toHaveValue('Lunch at Subway');
      
      // Update the expense
      await page.fill('[data-testid="description-input"]', 'Updated lunch');
      await page.fill('[data-testid="amount-input"]', '30.00');
      
      // Submit the update
      await page.click('[data-testid="submit-button"]');
      
      // Wait for success message
      await page.waitForSelector('[data-testid="success-message"]');
      
      // Verify the expense was updated in the list
      await expect(page.locator('text=Updated lunch')).toBeVisible();
      await expect(page.locator('text=$30.00')).toBeVisible();
    });

    test('should cancel edit and return to list view', async ({ page }) => {
      // Find and click edit button for first expense
      const editButtons = page.locator('[data-testid="edit-button"]');
      await editButtons.first().click();
      
      // Wait for form to appear
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Verify form is in edit mode
      await expect(page.locator('text=Update Expense')).toBeVisible();
      
      // Click cancel button
      await page.click('[data-testid="cancel-button"]');
      
      // Verify form is closed and list is visible
      await expect(page.locator('[data-testid="expense-form"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="expenses-list"]')).toBeVisible();
    });
  });

  test.describe('Delete Expense Workflow', () => {
    test('should delete an expense with confirmation', async ({ page }) => {
      // Get initial expense count
      const initialExpenseCount = await page.locator('[data-testid="expense-item"]').count();
      
      // Find and click delete button for first expense
      const deleteButtons = page.locator('[data-testid="delete-button"]');
      await deleteButtons.first().click();
      
      // Wait for confirmation dialog
      await page.waitForSelector('[data-testid="delete-confirmation-dialog"]');
      
      // Verify confirmation dialog content
      await expect(page.locator('text=Are you sure?')).toBeVisible();
      await expect(page.locator('text=This action cannot be undone')).toBeVisible();
      
      // Confirm deletion
      await page.click('[data-testid="confirm-delete-button"]');
      
      // Wait for success message
      await page.waitForSelector('[data-testid="success-message"]');
      
      // Verify expense count decreased
      const finalExpenseCount = await page.locator('[data-testid="expense-item"]').count();
      expect(finalExpenseCount).toBe(initialExpenseCount - 1);
      
      // Verify confirmation dialog is closed
      await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).not.toBeVisible();
    });

    test('should cancel deletion when cancel button is clicked', async ({ page }) => {
      // Get initial expense count
      const initialExpenseCount = await page.locator('[data-testid="expense-item"]').count();
      
      // Find and click delete button for first expense
      const deleteButtons = page.locator('[data-testid="delete-button"]');
      await deleteButtons.first().click();
      
      // Wait for confirmation dialog
      await page.waitForSelector('[data-testid="delete-confirmation-dialog"]');
      
      // Click cancel button
      await page.click('[data-testid="cancel-button"]');
      
      // Verify confirmation dialog is closed
      await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).not.toBeVisible();
      
      // Verify expense count remains the same
      const finalExpenseCount = await page.locator('[data-testid="expense-item"]').count();
      expect(finalExpenseCount).toBe(initialExpenseCount);
    });
  });

  test.describe('Search and Filter Workflow', () => {
    test('should search expenses by description', async ({ page }) => {
      // Type in search input
      await page.fill('[data-testid="search-input"]', 'lunch');
      
      // Wait for search results
      await page.waitForTimeout(300); // Debounce delay
      
      // Verify only matching expenses are shown
      await expect(page.locator('text=Lunch at Subway')).toBeVisible();
      await expect(page.locator('text=Gas station fill-up')).not.toBeVisible();
      
      // Verify search result count is displayed
      await expect(page.locator('text=1 expense found')).toBeVisible();
    });

    test('should filter expenses by category', async ({ page }) => {
      // Select category filter
      await page.selectOption('[data-testid="category-filter"]', '1'); // Food & Dining
      
      // Wait for filter to apply
      await page.waitForTimeout(100);
      
      // Verify only expenses in selected category are shown
      await expect(page.locator('text=Lunch at Subway')).toBeVisible();
      await expect(page.locator('text=Gas station fill-up')).not.toBeVisible();
      
      // Clear category filter
      await page.selectOption('[data-testid="category-filter"]', '');
      
      // Verify all expenses are shown again
      await expect(page.locator('text=Lunch at Subway')).toBeVisible();
      await expect(page.locator('text=Gas station fill-up')).toBeVisible();
    });

    test('should combine search and category filtering', async ({ page }) => {
      // First, filter by category
      await page.selectOption('[data-testid="category-filter"]', '1'); // Food & Dining
      
      // Then search within that category
      await page.fill('[data-testid="search-input"]', 'lunch');
      
      // Wait for both filters to apply
      await page.waitForTimeout(300);
      
      // Verify only matching expenses in the selected category are shown
      await expect(page.locator('text=Lunch at Subway')).toBeVisible();
      await expect(page.locator('text=Gas station fill-up')).not.toBeVisible();
      
      // Clear search to see all expenses in the category
      await page.fill('[data-testid="search-input"]', '');
      
      // Verify all expenses in category are shown
      await expect(page.locator('text=Lunch at Subway')).toBeVisible();
      await expect(page.locator('text=Gas station fill-up')).not.toBeVisible();
    });
  });

  test.describe('Sorting Workflow', () => {
    test('should sort expenses by date (newest first) by default', async ({ page }) => {
      // Get all expense dates
      const expenseDates = page.locator('[data-testid="expense-date"]');
      
      // Verify expenses are sorted by date (newest first)
      const firstDate = await expenseDates.first().textContent();
      const lastDate = await expenseDates.last().textContent();
      
      expect(new Date(firstDate!)).toBeGreaterThan(new Date(lastDate!));
    });

    test('should sort expenses by amount when amount sort is selected', async ({ page }) => {
      // Select amount sort
      await page.selectOption('[data-testid="sort-select"]', 'amount');
      
      // Wait for sort to apply
      await page.waitForTimeout(100);
      
      // Get all expense amounts
      const expenseAmounts = page.locator('[data-testid="expense-amount"]');
      
      // Verify expenses are sorted by amount (highest first)
      const firstAmount = await expenseAmounts.first().textContent();
      const lastAmount = await expenseAmounts.last().textContent();
      
      const firstValue = parseFloat(firstAmount!.replace('$', ''));
      const lastValue = parseFloat(lastAmount!.replace('$', ''));
      
      expect(firstValue).toBeGreaterThan(lastValue);
    });

    test('should sort expenses by description when description sort is selected', async ({ page }) => {
      // Select description sort
      await page.selectOption('[data-testid="sort-select"]', 'description');
      
      // Wait for sort to apply
      await page.waitForTimeout(100);
      
      // Get all expense descriptions
      const expenseDescriptions = page.locator('[data-testid="expense-description"]');
      
      // Verify expenses are sorted alphabetically by description
      const firstDescription = await expenseDescriptions.first().textContent();
      const lastDescription = await expenseDescriptions.last().textContent();
      
      expect(firstDescription!.localeCompare(lastDescription!)).toBeLessThan(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verify mobile layout elements are visible
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      
      // Test mobile navigation
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      
      // Test mobile form layout
      await page.click('[data-testid="add-expense-button"]');
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Verify form is properly sized for mobile
      const formWidth = await page.locator('[data-testid="expense-form"]').boundingBox();
      expect(formWidth!.width).toBeLessThanOrEqual(375);
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Verify tablet layout elements are visible
      await expect(page.locator('[data-testid="tablet-sidebar"]')).toBeVisible();
      
      // Test tablet navigation
      await page.click('[data-testid="tablet-menu-button"]');
      await expect(page.locator('[data-testid="tablet-menu"]')).toBeVisible();
    });

    test('should work on desktop devices', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Verify desktop layout elements are visible
      await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="desktop-header"]')).toBeVisible();
      
      // Test desktop navigation
      await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Verify form fields have proper labels
      await expect(page.locator('[data-testid="amount-input"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="description-input"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="category-select"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="date-input"]')).toHaveAttribute('aria-label');
      
      // Verify buttons have proper labels
      await expect(page.locator('[data-testid="add-expense-button"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Open add expense form
      await page.click('[data-testid="add-expense-button"]');
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Tab through form fields
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="amount-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="description-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="category-select"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="date-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="submit-button"]')).toBeFocused();
    });

    test('should announce form state changes', async ({ page }) => {
      // Open add expense form
      await page.click('[data-testid="add-expense-button"]');
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Verify form is announced to screen readers
      await expect(page.locator('[role="alert"]')).toContainText('Add new expense');
      
      // Fill and submit form
      await page.fill('[data-testid="amount-input"]', '25.50');
      await page.fill('[data-testid="description-input"]', 'Test expense');
      await page.selectOption('[data-testid="category-select"]', '1');
      await page.click('[data-testid="submit-button"]');
      
      // Verify success message is announced
      await page.waitForSelector('[role="alert"]');
      await expect(page.locator('[role="alert"]')).toContainText('Expense added successfully');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network error
      await page.route('**/api/expenses', route => route.abort());
      
      // Refresh page to trigger error
      await page.reload();
      
      // Wait for error state
      await page.waitForSelector('[data-testid="error-message"]');
      
      // Verify error message is shown
      await expect(page.locator('text=Failed to load expenses')).toBeVisible();
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
      
      // Test retry functionality
      await page.route('**/api/expenses', route => route.fulfill({ status: 200, body: '[]' }));
      await page.click('[data-testid="retry-button"]');
      
      // Verify error is cleared
      await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
    });

    test('should handle validation errors properly', async ({ page }) => {
      // Open add expense form
      await page.click('[data-testid="add-expense-button"]');
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Try to submit without required fields
      await page.click('[data-testid="submit-button"]');
      
      // Verify validation errors are shown
      await expect(page.locator('[role="alert"]')).toContainText('Amount is required');
      await expect(page.locator('[role="alert"]')).toContainText('Description is required');
      
      // Verify form was not submitted
      await expect(page.locator('[data-testid="success-message"]')).not.toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should handle large number of expenses efficiently', async ({ page }) => {
      // Mock large dataset
      const largeExpenses = Array.from({ length: 1000 }, (_, index) => ({
        id: `expense-${index}`,
        amount: Math.random() * 1000,
        description: `Expense ${index}`,
        category: { id: '1', name: 'Food & Dining', color: '#ef4444', icon: 'utensils' },
        date: new Date(2024, 0, 1 + index),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      await page.route('**/api/expenses', route => 
        route.fulfill({ 
          status: 200, 
          body: JSON.stringify({ success: true, data: largeExpenses }) 
        })
      );
      
      // Refresh page
      await page.reload();
      
      // Wait for expenses to load
      await page.waitForSelector('[data-testid="expenses-list"]');
      
      // Verify all expenses are rendered
      const expenseCount = await page.locator('[data-testid="expense-item"]').count();
      expect(expenseCount).toBe(1000);
      
      // Test search performance
      const startTime = Date.now();
      await page.fill('[data-testid="search-input"]', 'Expense 500');
      await page.waitForTimeout(300); // Debounce delay
      const endTime = Date.now();
      
      // Search should complete within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should debounce search input to prevent excessive API calls', async ({ page }) => {
      // Mock API endpoint to track calls
      let apiCallCount = 0;
      await page.route('**/api/expenses', route => {
        apiCallCount++;
        route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) });
      });
      
      // Type quickly in search input
      await page.fill('[data-testid="search-input"]', 'l');
      await page.fill('[data-testid="search-input"]', 'lu');
      await page.fill('[data-testid="search-input"]', 'lun');
      await page.fill('[data-testid="search-input"]', 'lunc');
      await page.fill('[data-testid="search-input"]', 'lunch');
      
      // Wait for debounce delay
      await page.waitForTimeout(300);
      
      // Verify only one API call was made (after debounce)
      expect(apiCallCount).toBe(1);
    });
  });
});
