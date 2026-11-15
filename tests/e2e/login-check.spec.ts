import { test, expect } from '@playwright/test';

test('login demo user', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'cliente@demo.com.br');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  // wait a bit
  await page.waitForTimeout(2000);
  console.log('Current URL:', page.url());
  const error = await page.locator('text=E-mail ou senha incorretos').first().innerText().catch(()=>null);
  console.log('Error text:', error);
  await expect(page).toHaveURL(/\/dashboard/);
});
