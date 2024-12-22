import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('submits contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill out the form
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('textarea[id="message"]', 'Test message');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.getByText('Message sent successfully')).toBeVisible();
  });

  test('displays validation errors', async ({ page }) => {
    await page.goto('/contact');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Verify error messages
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
  });
});