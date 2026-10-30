# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: financial-simulation.spec.ts >> Simulação Financeira - Compra Imóvel 1M >> Fluxo completo: Cadastrar ativos, renda e meta de imóvel 1M
- Location: tests/e2e/financial-simulation.spec.ts:13:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Simulação Financeira - Compra Imóvel 1M', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Login como cliente demo
> 6   |     await page.goto('/login');
      |                ^ Error: page.goto: Target page, context or browser has been closed
  7   |     await page.fill('input[type="email"]', 'cliente@demo.com.br');
  8   |     await page.fill('input[type="password"]', 'demo123');
  9   |     await page.click('button[type="submit"]');
  10  |     await expect(page).toHaveURL(/\/dashboard/);
  11  |   });
  12  | 
  13  |   test('Fluxo completo: Cadastrar ativos, renda e meta de imóvel 1M', async ({ page }) => {
  14  |     // ============================================
  15  |     // PASSO 1: Verificar dashboard inicial
  16  |     // ============================================
  17  |     await test.step('Verificar dashboard inicial com dados seed', async () => {
  18  |       // Deve mostrar patrimônio líquido inicial (seed: 2500 checking - 1250 cartão = 1250)
  19  |       await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();
  20  |       await expect(page.locator('text=R$ 1.250,00')).toBeVisible(); // ou valor formatado
  21  | 
  22  |       // Verificar meta existente (Reserva de Emergência)
  23  |       await expect(page.locator('text=Reserva de Emergência')).toBeVisible();
  24  |     });
  25  | 
  26  |     // ============================================
  27  |     // PASSO 2: Adicionar Casa como ativo (Investimento)
  28  |     // ============================================
  29  |     await test.step('Cadastrar casa própria como investimento', async () => {
  30  |       await page.click('nav >> text=Contas');
  31  |       await expect(page).toHaveURL(/\/accounts/);
  32  | 
  33  |       await page.click('button:has-text("Nova Conta")');
  34  | 
  35  |       // Preencher formulário da casa
  36  |       await page.fill('input[name="name"]', 'Casa Própria - Jardins');
  37  |       await page.selectOption('select[name="type"]', 'INVESTMENT');
  38  |       await page.fill('input[name="initialBalance"]', '800000');
  39  |       await page.fill('input[name="color"]', '#10B981');
  40  |       await page.click('button[type="submit"]');
  41  | 
  42  |       // Verificar se apareceu na lista
  43  |       await expect(page.locator('text=Casa Própria - Jardins')).toBeVisible();
  44  |       await expect(page.locator('text=R$ 800.000,00')).toBeVisible();
  45  |     });
  46  | 
  47  |     // ============================================
  48  |     // PASSO 3: Adicionar Carro como ativo
  49  |     // ============================================
  50  |     await test.step('Cadastrar carro como ativo', async () => {
  51  |       await page.click('button:has-text("Nova Conta")');
  52  | 
  53  |       await page.fill('input[name="name"]', 'Honda Civic 2023');
  54  |       await page.selectOption('select[name="type"]', 'INVESTMENT');
  55  |       await page.fill('input[name="initialBalance"]', '120000');
  56  |       await page.fill('input[name="color"]', '#3B82F6');
  57  |       await page.click('button[type="submit"]');
  58  | 
  59  |       await expect(page.locator('text=Honda Civic 2023')).toBeVisible();
  60  |       await expect(page.locator('text=R$ 120.000,00')).toBeVisible();
  61  |     });
  62  | 
  63  |     // ============================================
  64  |     // PASSO 4: Atualizar salário (conta corrente)
  65  |     // ============================================
  66  |     await test.step('Ajustar conta corrente com salário realista', async () => {
  67  |       // Editar conta Nubank existente para refletir salário
  68  |       await page.click('button[aria-label*="Editar"] >> nth=0').catch(async () => {
  69  |         // Se não tiver botão editar, vamos adicionar receita
  70  |         await page.click('nav >> text=Início');
  71  |         await page.click('button:has-text("Nova Receita")');
  72  | 
  73  |         await page.fill('input[name="description"]', 'Salário Mensal');
  74  |         await page.fill('input[name="amount"]', '15000');
  75  |         await page.selectOption('select[name="accountId"]', { label: 'Nubank Conta' });
  76  |         await page.selectOption('select[name="categoryId"]', { label: 'Salário & Renda' });
  77  |         await page.click('button[type="submit"]');
  78  |       });
  79  |     });
  80  | 
  81  |     // ============================================
  82  |     // PASSO 5: Criar Meta - Imóvel de 1M
  83  |     // ============================================
  84  |     await test.step('Criar meta de compra de imóvel R$ 1.000.000', async () => {
  85  |       await page.click('nav >> text=Metas');
  86  |       await expect(page).toHaveURL(/\/goals/);
  87  | 
  88  |       await page.click('button:has-text("Nova Meta")');
  89  | 
  90  |       await page.fill('input[name="title"]', 'Comprar Apartamento 1M - Vila Madalena');
  91  |       await page.fill('input[name="targetAmount"]', '1000000');
  92  |       await page.fill('input[name="currentAmount"]', '920000'); // Casa 800k + Carro 120k = 920k
  93  |       await page.fill('input[name="targetDate"]', '2027-12-31');
  94  |       await page.fill('input[name="categoryTag"]', 'Imóvel');
  95  |       await page.click('button[type="submit"]');
  96  | 
  97  |       // Verificar meta criada com progresso ~92%
  98  |       await expect(page.locator('text=Comprar Apartamento 1M')).toBeVisible();
  99  |       await expect(page.locator('text=92%')).toBeVisible(); // 920k / 1M = 92%
  100 |       await expect(page.locator('text=R$ 920.000,00')).toBeVisible();
  101 |       await expect(page.locator('text=R$ 1.000.000,00')).toBeVisible();
  102 |     });
  103 | 
  104 |     // ============================================
  105 |     // PASSO 6: Verificar Patrimônio Líquido Atualizado
  106 |     // ============================================
```