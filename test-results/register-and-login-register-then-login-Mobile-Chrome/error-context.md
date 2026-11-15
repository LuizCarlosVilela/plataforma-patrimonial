# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register-and-login.spec.ts >> register then login
- Location: tests/e2e/register-and-login.spec.ts:7:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="name"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e8]:
      - generic [ref=e9]: ORIGIN
      - text: Gestão Patrimonial
    - heading "Criar conta" [level=2] [ref=e10]
    - paragraph [ref=e11]: Preencha os dados abaixo para iniciar
    - generic [ref=e12]:
      - button "Continuar com Google" [ref=e13] [cursor=pointer]
      - button "Continuar com Apple" [ref=e19] [cursor=pointer]
    - generic [ref=e22]: ou cadastre-se manualmente
    - generic [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]: Nome completo
        - textbox "João da Silva" [ref=e33]
      - generic [ref=e34]:
        - generic [ref=e35]: E-mail corporativo
        - textbox "seu@email.com" [ref=e40]
      - generic [ref=e41]:
        - generic [ref=e42]: Senha
        - generic [ref=e43]:
          - textbox "Mínimo 8 caracteres" [ref=e47]
          - button [ref=e48] [cursor=pointer]
      - generic [ref=e52]:
        - generic [ref=e53]: Confirmar senha
        - textbox "Repita a senha" [ref=e58]
      - button "Criar conta" [ref=e59] [cursor=pointer]:
        - text: Criar conta
        - generic [aria-hidden] [ref=e60]: →
      - paragraph [ref=e61]:
        - text: Ao criar sua conta, você concorda com nossos
        - link "Termos de Uso" [ref=e62] [cursor=pointer]:
          - /url: /terms
        - text: e
        - link "Política de Privacidade" [ref=e63] [cursor=pointer]:
          - /url: /privacy
    - paragraph [ref=e64]:
      - text: Já tem conta?
      - link "Fazer login" [ref=e65] [cursor=pointer]:
        - /url: /login
  - alert [ref=e66]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const random = Math.random().toString(36).substring(2, 10);
  4  | const email = `test_${random}@example.com`;
  5  | const password = 'TestPass123!';
  6  | 
  7  | test('register then login', async ({ page }) => {
  8  |   // Register
  9  |   await page.goto('/register');
> 10 |   await page.fill('input[name="name"]', 'Test User');
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  11 |   await page.fill('input[name="email"]', email);
  12 |   await page.fill('input[name="password"]', password);
  13 |   await page.fill('input[name="confirmPassword"]', password);
  14 |   await page.click('button[type="submit"]');
  15 |   // Should redirect to login with registered flag
  16 |   await expect(page).toHaveURL(/\/login/);
  17 |   // Login
  18 |   await page.fill('input[type="email"]', email);
  19 |   await page.fill('input[type="password"]', password);
  20 |   await page.click('button[type="submit"]');
  21 |   await expect(page).toHaveURL(/\/dashboard/);
  22 | });
  23 | 
```