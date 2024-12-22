import { test, expect } from '@playwright/test';

test('basic navigation', async ({ page }) => {
  await page.goto('/');
  
  // Check home page
  await expect(page).toHaveTitle(/OrgaNoise/);
  
  // Navigate to About
  await page.click('text=About');
  await expect(page).toHaveURL(/.*about/);
  
  // Navigate to Projects
  await page.click('text=Projects');
  await expect(page).toHaveURL(/.*projects/);
  
  // Navigate to Blog
  await page.click('text=Blog');
  await expect(page).toHaveURL(/.*blog/);
  
  // Navigate to Contact
  await page.click('text=Contact');
  await expect(page).toHaveURL(/.*contact/);
});