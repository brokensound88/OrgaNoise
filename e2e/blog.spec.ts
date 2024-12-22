import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test('displays blog posts and allows search', async ({ page }) => {
    await page.goto('/blog');
    
    // Check initial blog posts
    await expect(page.getByText('The Future of Sustainable Technology')).toBeVisible();
    
    // Test search functionality
    const searchInput = page.getByPlaceholder('Search posts...');
    await searchInput.fill('Sustainable');
    
    // Verify filtered results
    await expect(page.getByText('The Future of Sustainable Technology')).toBeVisible();
    await expect(page.getByText('Ethical AI Development')).not.toBeVisible();
  });

  test('blog post navigation works', async ({ page }) => {
    await page.goto('/blog');
    
    await page.click('text=The Future of Sustainable Technology');
    await expect(page).toHaveURL(/.*blog\/.*sustainable-technology/);
  });
});