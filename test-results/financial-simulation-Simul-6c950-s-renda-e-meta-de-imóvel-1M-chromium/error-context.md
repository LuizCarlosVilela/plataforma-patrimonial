# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: financial-simulation.spec.ts >> Simulação Financeira - Compra Imóvel 1M >> Fluxo completo: Cadastrar ativos, renda e meta de imóvel 1M
- Location: tests/e2e/financial-simulation.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Casa Própria - Jardins').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('text=Casa Própria - Jardins').first() with timeout 5000ms
  - waiting for locator('text=Casa Própria - Jardins').first()

```

```yaml
- alert: Origin — Liberdade é fruto de estrutura
- complementary:
  - text: ORIGIN
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
    - link "Diagnóstico MAPA":
      - /url: /diagnostic
    - link "Contas":
      - /url: /accounts
    - link "Metas":
      - /url: /goals
    - link "Transações":
      - /url: /transactions
    - link "Relatórios":
      - /url: /reports
    - link "Origin Design":
      - /url: /design-system
  - button "Sair"
  - paragraph: Carvalho Group · Diagnóstico Patrimonial
- banner:
  - text: Bom dia,
  - heading "João" [level=1]
  - text: client
  - button "3"
  - button "J"
- main:
  - heading "Minhas Contas" [level=1]
  - button "Sync Open Finance"
  - button "Nova Conta"
  - heading "Nova Conta" [level=2]
  - text: Nome da Conta
  - 'textbox "Ex: Nubank Conta Corrente"': Casa Própria - Jardins
  - text: Tipo
  - combobox:
    - option "Conta Corrente"
    - option "Poupança"
    - option "Cartão de Crédito"
    - option "Investimento" [selected]
    - option "Dinheiro"
    - option "Outro"
  - text: Saldo Inicial (R$)
  - spinbutton "0,00": "800000"
  - button "Cancelar"
  - button "Criar Conta"
  - text: Manual
  - heading "Nubank Conta" [level=3]
  - paragraph: Conta Corrente
  - paragraph: R$ 2.500,00
  - text: Manual
  - heading "Cartão XP Visa Infinite" [level=3]
  - paragraph: Cartão de Crédito
  - paragraph: "-R$ 1.250,00"
- navigation:
  - button "Início"
  - button "Extrato"
  - button "Contas"
  - button "Metas"
  - button "Assessor"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Simulação Financeira - Compra Imóvel 1M', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Login como cliente demo
  6   |     await page.goto('/login');
  7   |     await page.fill('input[placeholder="seu@email.com"]', 'cliente@demo.com.br');
  8   |     await page.fill('input[placeholder="••••••••"]', 'demo123');
  9   |     await page.getByRole('button', { name: /acessar plataforma/i }).click();
  10  |     await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  11  |   });
  12  | 
  13  |   test('Fluxo completo: Cadastrar ativos, renda e meta de imóvel 1M', async ({ page }) => {
  14  |     // ============================================
  15  |     // PASSO 1: Verificar dashboard inicial
  16  |     // ============================================
  17  |     await test.step('Verificar dashboard inicial com dados seed', async () => {
  18  |       await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();
  19  |       // Seed creates "Reserva de emergência" (lowercase e); verify it exists
  20  |       await expect(page.locator('text=/Reserva.*(emer|Emer)/')).toBeVisible();
  21  |     });
  22  | 
  23  |     // ============================================
  24  |     // PASSO 2: Adicionar Casa como ativo (Investimento)
  25  |     // ============================================
  26  |     await test.step('Cadastrar casa própria como investimento', async () => {
  27  |       await page.getByRole('link', { name: 'Contas' }).click();
  28  |       await page.waitForURL(/\/accounts/);
  29  | 
  30  |       await page.getByRole('button', { name: 'Nova Conta' }).click();
  31  | 
  32  |       // Preencher formulário da casa
  33  |       await page.fill('input[placeholder="Ex: Nubank Conta Corrente"]', 'Casa Própria - Jardins');
  34  |       await page.selectOption('select', { label: 'Investimento' });
  35  |       await page.fill('input[placeholder="0,00"]', '800000');
  36  |       await page.getByRole('button', { name: 'Criar Conta' }).click();
  37  | 
  38  |       // Wait for form to close (showForm becomes false)
  39  |       await page.waitForTimeout(1500);
  40  | 
  41  |       // Aguarda revalidação e renderização da lista
> 42  |       await expect(page.locator('text=Casa Própria - Jardins').first()).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
  43  |     });
  44  | 
  45  |     // ============================================
  46  |     // PASSO 3: Adicionar Carro como ativo
  47  |     // ============================================
  48  |     await test.step('Cadastrar carro como ativo', async () => {
  49  |       // Form should be closed from previous step, click Nova Conta again
  50  |       await page.getByRole('button', { name: 'Nova Conta' }).click();
  51  |       await page.waitForTimeout(1000);
  52  | 
  53  |       await page.fill('input[placeholder="Ex: Nubank Conta Corrente"]', 'Honda Civic 2023');
  54  |       await page.selectOption('select', { label: 'Investimento' });
  55  |       await page.fill('input[placeholder="0,00"]', '120000');
  56  |       await page.getByRole('button', { name: 'Criar Conta' }).click();
  57  | 
  58  |       // Wait for form to close and list to update
  59  |       await page.waitForTimeout(1500);
  60  |       await expect(page.locator('text=Honda Civic 2023').first()).toBeVisible();
  61  |     });
  62  | 
  63  |     // ============================================
  64  |     // PASSO 4: Criar Meta - Imóvel de 1M
  65  |     // ============================================
  66  |     await test.step('Criar meta de compra de imóvel R$ 1.000.000', async () => {
  67  |       await page.getByRole('link', { name: 'Metas' }).click();
  68  |       await page.waitForURL(/\/goals/);
  69  | 
  70  |       await page.getByRole('button', { name: 'Nova Meta' }).click();
  71  | 
  72  |       // title
  73  |       await page.fill('input[placeholder="Ex: Reserva de Emergência"]', 'Comprar Apartamento 1M - Vila Madalena');
  74  |       // O primeiro 0,00 é targetAmount, o segundo é currentAmount
  75  |       const amountInputs = page.locator('input[placeholder="0,00"]');
  76  |       await amountInputs.nth(0).fill('1000000');
  77  |       await amountInputs.nth(1).fill('920000');
  78  |       await page.fill('input[type="date"]', '2027-12-31');
  79  |       await page.getByRole('button', { name: 'Criar Meta' }).click();
  80  | 
  81  |       await page.waitForTimeout(800);
  82  | 
  83  |       // Verificar meta criada
  84  |       await expect(page.locator('text=Comprar Apartamento 1M').first()).toBeVisible();
  85  |     });
  86  | 
  87  |     // ============================================
  88  |     // PASSO 5: Verificar Patrimônio Líquido Atualizado
  89  |     // ============================================
  90  |     await test.step('Verificar patrimônio líquido no dashboard', async () => {
  91  |       await page.getByRole('link', { name: 'Dashboard' }).click();
  92  |       await page.waitForURL(/\/dashboard/);
  93  |       await page.waitForTimeout(600);
  94  | 
  95  |       await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();
  96  |     });
  97  | 
  98  |     // ============================================
  99  |     // PASSO 6: Adicionar receita via botão do dashboard
  100 |     // ============================================
  101 |     await test.step('Adicionar receita de salário via dashboard', async () => {
  102 |       // Click "Nova Receita" button on dashboard (uses client-side nav via Link)
  103 |       const novaReceitaBtn = page.getByRole('link', { name: 'Nova Receita' }).or(page.getByRole('button', { name: 'Nova Receita' }));
  104 |       if (await novaReceitaBtn.count()) await novaReceitaBtn.click();
  105 |       await page.waitForURL(/\/transactions/, { timeout: 10000 });
  106 |       await page.waitForTimeout(500);
  107 | 
  108 |       // Open the transaction form (starts hidden)
  109 |       const novaTxBtn = page.getByRole('button', { name: 'Nova Transação' });
  110 |       if (await novaTxBtn.count()) await novaTxBtn.click();
  111 |       await page.waitForTimeout(300);
  112 | 
  113 |       // Click Receita to switch from default EXPENSE
  114 |       const incomeBtn = page.getByRole('button', { name: 'Receita', exact: true });
  115 |       if (await incomeBtn.count()) await incomeBtn.click();
  116 |       await page.waitForTimeout(200);
  117 | 
  118 |       const txPlaceholders = page.locator('input[placeholder="0,00"]');
  119 |       await txPlaceholders.first().fill('15000');
  120 |       await page.fill('input[placeholder="Ex: Supermercado"]', 'Salário Mensal');
  121 |       await page.fill('input[type="date"]', '2024-01-15');
  122 | 
  123 |       // Selecionar conta do select — opção começa com "Nubank Conta"
  124 |       // The select renders options as "Name (TYPE)" — use the full label text
  125 |     await page.locator('select').first().selectOption('Nubank Conta (CHECKING)');
  126 | 
  127 |       await page.getByRole('button', { name: 'Salvar Transação' }).click();
  128 |       await page.waitForTimeout(800);
  129 | 
  130 |       await expect(page.locator('text=Salário Mensal')).toBeVisible();
  131 |     });
  132 | 
  133 |     // ============================================
  134 |     // PASSO 7: Verificar Extrato com movimentações
  135 |     // ============================================
  136 |     await test.step('Verificar extrato consolidado', async () => {
  137 |       await page.getByRole('link', { name: 'Transações' }).click();
  138 |       await page.waitForURL(/\/transactions/);
  139 |       await page.waitForTimeout(400);
  140 | 
  141 |       await expect(page.locator('text=Salário Mensal')).toBeVisible();
  142 |       await expect(page.getByRole('button', { name: 'Receita', exact: true }).or(page.locator('text=Receitas'))).toBeVisible();
```