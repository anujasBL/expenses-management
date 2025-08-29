import { test, expect } from '@playwright/test';

test.describe('Dashboard User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
    
    // Wait for the dashboard to load
    await page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 5000 });
  });

  test.describe('Dashboard Overview', () => {
    test('should display dashboard title and description', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Dashboard');
      await expect(page.locator('text=Welcome to your expenses management system')).toBeVisible();
    });

    test('should show Add Expense button in header', async ({ page }) => {
      await expect(page.locator('button:has-text("Add Expense")')).toBeVisible();
      await expect(page.locator('button:has-text("Add Expense") svg')).toBeVisible(); // Plus icon
    });

    test('should navigate to expenses page when Add Expense is clicked', async ({ page }) => {
      await page.click('button:has-text("Add Expense")');
      await expect(page).toHaveURL(/.*\/expenses/);
    });
  });

  test.describe('Analytics Dashboard Display', () => {
    test('should display spending summary cards', async ({ page }) => {
      // Check for main summary cards
      await expect(page.locator('text=This Month')).toBeVisible();
      await expect(page.locator('text=All Time')).toBeVisible();
      await expect(page.locator('text=Total Expenses')).toBeVisible();
      await expect(page.locator('text=Average Amount')).toBeVisible();
    });

    test('should display enhanced analytics cards', async ({ page }) => {
      await expect(page.locator('text=Monthly Trend')).toBeVisible();
      await expect(page.locator('text=Daily Average')).toBeVisible();
      await expect(page.locator('text=Activity')).toBeVisible();
    });

    test('should show category breakdown charts', async ({ page }) => {
      await expect(page.locator('text=Category Breakdown')).toBeVisible();
      
      // Should have both bar and pie chart versions
      const chartCards = page.locator('[data-testid*="category-chart"]');
      await expect(chartCards).toHaveCount(2);
    });

    test('should display monetary values with proper formatting', async ({ page }) => {
      // Look for currency formatted values
      const currencyPattern = /\$[\d,]+\.\d{2}/;
      const currencyElements = page.locator('text=' + currencyPattern.source);
      await expect(currencyElements.first()).toBeVisible();
    });
  });

  test.describe('Empty State Handling', () => {
    test('should show appropriate empty states when no data exists', async ({ page }) => {
      // If no expenses exist, should show empty state
      const noDataText = page.locator('text=No expense data yet');
      const addFirstExpenseButton = page.locator('button:has-text("Add First Expense")');
      
      // Check if either data exists or empty state is shown
      const hasData = await page.locator('[data-testid="spending-summary"]').isVisible();
      
      if (!hasData) {
        await expect(noDataText).toBeVisible();
        await expect(addFirstExpenseButton).toBeVisible();
      }
    });

    test('should navigate to expenses page from empty state', async ({ page }) => {
      const addFirstExpenseButton = page.locator('button:has-text("Add First Expense")');
      
      if (await addFirstExpenseButton.isVisible()) {
        await addFirstExpenseButton.click();
        await expect(page).toHaveURL(/.*\/expenses/);
      }
    });
  });

  test.describe('Quick Actions Section', () => {
    test('should display quick actions grid', async ({ page }) => {
      await expect(page.locator('text=Quick Actions')).toBeVisible();
      await expect(page.locator('text=Common tasks and shortcuts')).toBeVisible();
    });

    test('should have functional quick action buttons', async ({ page }) => {
      const quickActions = [
        'Add Expense',
        'View Expenses', 
        'Export Data',
        'Manage Categories'
      ];

      for (const action of quickActions) {
        await expect(page.locator(`button:has-text("${action}")`)).toBeVisible();
      }
    });

    test('should navigate correctly from quick actions', async ({ page }) => {
      // Test Add Expense navigation
      await page.click('button:has-text("Add Expense")');
      await expect(page).toHaveURL(/.*\/expenses/);
      
      // Navigate back to dashboard
      await page.goto('/');
      
      // Test View Expenses navigation
      await page.click('button:has-text("View Expenses")');
      await expect(page).toHaveURL(/.*\/expenses/);
    });
  });

  test.describe('Getting Started Section', () => {
    test('should display getting started guide', async ({ page }) => {
      await expect(page.locator('text=Getting Started')).toBeVisible();
      await expect(page.locator('text=Follow these steps to start managing')).toBeVisible();
    });

    test('should show numbered steps', async ({ page }) => {
      const steps = [
        'Add Your First Expense',
        'Categorize Your Expenses', 
        'View Your Analytics'
      ];

      for (const step of steps) {
        await expect(page.locator(`text=${step}`)).toBeVisible();
      }

      // Check for step numbers
      await expect(page.locator('text=1')).toBeVisible();
      await expect(page.locator('text=2')).toBeVisible();
      await expect(page.locator('text=3')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt to mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      
      // Dashboard should still be functional
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
      await expect(page.locator('button:has-text("Add Expense")')).toBeVisible();
      
      // Analytics should be stacked vertically
      const summaryCards = page.locator('[data-testid*="summary-card"]');
      await expect(summaryCards.first()).toBeVisible();
    });

    test('should adapt to tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
      
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
      
      // Should show grid layout for analytics
      const gridContainers = page.locator('.grid');
      await expect(gridContainers.first()).toBeVisible();
    });

    test('should work well on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop size
      
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
      
      // Should utilize full width
      const dashboard = page.locator('[data-testid="dashboard-container"]');
      await expect(dashboard).toBeVisible();
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load dashboard within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForSelector('h1:has-text("Dashboard")');
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle navigation between sections smoothly', async ({ page }) => {
      // Navigate to expenses and back
      await page.click('button:has-text("Add Expense")');
      await page.waitForSelector('[data-testid="expense-form"]', { timeout: 2000 });
      
      await page.goBack();
      await page.waitForSelector('h1:has-text("Dashboard")');
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    });
  });

  test.describe('Data Integration', () => {
    test('should reflect expense data in analytics', async ({ page }) => {
      // First, add an expense
      await page.click('button:has-text("Add Expense")');
      await page.waitForSelector('[data-testid="expense-form"]');
      
      // Fill out expense form
      await page.fill('[data-testid="amount-input"]', '25.50');
      await page.fill('[data-testid="description-input"]', 'Test expense for dashboard');
      await page.click('[data-testid="category-food"]');
      await page.click('button:has-text("Add Expense")');
      
      // Navigate back to dashboard
      await page.goto('/');
      
      // Check that analytics reflect the new expense
      await expect(page.locator('text=$25.50')).toBeVisible();
      await expect(page.locator('text=Test expense for dashboard')).toBeVisible();
    });

    test('should update real-time when expenses change', async ({ page }) => {
      // Get initial total
      const initialTotal = await page.locator('[data-testid="all-time-total"]').textContent();
      
      // Add an expense
      await page.click('button:has-text("Add Expense")');
      await page.fill('[data-testid="amount-input"]', '50.00');
      await page.fill('[data-testid="description-input"]', 'Real-time test');
      await page.click('[data-testid="category-food"]');
      await page.click('button:has-text("Add Expense")');
      
      // Go back to dashboard
      await page.goto('/');
      
      // Total should have increased
      const newTotal = await page.locator('[data-testid="all-time-total"]').textContent();
      expect(newTotal).not.toBe(initialTotal);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // Main heading
      await expect(page.locator('h1')).toContainText('Dashboard');
      
      // Section headings should be h2 or h3
      const sectionHeadings = page.locator('h2, h3');
      const headingCount = await sectionHeadings.count();
      expect(headingCount).toBeGreaterThan(0);
    });

    test('should have accessible navigation', async ({ page }) => {
      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check for proper focus indicators
      const addExpenseButton = page.locator('button:has-text("Add Expense")');
      await addExpenseButton.focus();
      await expect(addExpenseButton).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for buttons with proper labels
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        
        // Button should have either aria-label or visible text
        expect(ariaLabel || textContent?.trim()).toBeTruthy();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network error by intercepting requests
      await page.route('**/api/**', route => route.abort());
      
      await page.goto('/');
      
      // Dashboard should still load with local data
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    });

    test('should handle corrupted local storage', async ({ page }) => {
      // Set invalid localStorage data
      await page.addInitScript(() => {
        localStorage.setItem('expenses', 'invalid-json');
      });
      
      await page.goto('/');
      
      // Should handle gracefully and show empty state
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    });
  });
});
