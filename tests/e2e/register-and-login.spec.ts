import { test, expect } from '@playwright/test';

test('register then login', async ({ page }) => {
  const random = Math.random().toString(36).substring(2, 10);
  const email = `test_${random}@example.com`;
  const password = 'TestPass123!';

  // Register
  await page.goto('/register');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[placeholder="seu@email.com"]', email);
  await page.fill('input[placeholder="Mínimo 8 caracteres"]', password);
  await page.fill('input[placeholder="Repita a senha"]', password);
  await page.getByRole('button', { name: /criar conta/i }).click();

  // Should redirect to dashboard after auto-login
  await expect(page).toHaveURL(/\/dashboard/);
});

test('login with demo user', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[placeholder="seu@email.com"]', 'cliente@demo.com.br');
  await page.fill('input[placeholder="••••••••"]', 'demo123');
  await page.getByRole('button', { name: /acessar plataforma/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});

test('login with wrong password fails', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[placeholder="seu@email.com"]', 'cliente@demo.com.br');
  await page.fill('input[placeholder="••••••••"]', 'wrongpassword');
  await page.getByRole('button', { name: /acessar plataforma/i }).click();
  await expect(page.getByText('E-mail ou senha incorretos')).toBeVisible();
});
