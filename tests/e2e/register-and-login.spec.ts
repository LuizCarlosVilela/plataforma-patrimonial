import { test, expect } from '@playwright/test';

const random = Math.random().toString(36).substring(2, 10);
const email = `test_${random}@example.com`;
const password = 'TestPass123!';

test('register then login', async ({ page }) => {
  // Register
  await page.goto('/register');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
  // Should redirect to login with registered flag
  await expect(page).toHaveURL(/\/login/);
  // Login
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);
});
