import { test, expect } from '@playwright/test';

test('login demo user', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[placeholder="seu@email.com"]', 'cliente@demo.com.br');
  await page.fill('input[placeholder="••••••••"]', 'demo123');
  await page.getByRole('button', { name: /acessar plataforma/i }).click();
  // wait for redirect to dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
});
