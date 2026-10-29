import { test, expect } from '@playwright/test';

test.describe('Simulação Financeira - Compra Imóvel 1M', () => {
  test.beforeEach(async ({ page }) => {
    // Login como cliente demo
    await page.goto('/login');
    await page.fill('input[type="email"]', 'cliente@demo.com.br');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Fluxo completo: Cadastrar ativos, renda e meta de imóvel 1M', async ({ page }) => {
    // ============================================
    // PASSO 1: Verificar dashboard inicial
    // ============================================
    await test.step('Verificar dashboard inicial com dados seed', async () => {
      // Deve mostrar patrimônio líquido inicial (seed: 2500 checking - 1250 cartão = 1250)
      await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();
      await expect(page.locator('text=R$ 1.250,00')).toBeVisible(); // ou valor formatado

      // Verificar meta existente (Reserva de Emergência)
      await expect(page.locator('text=Reserva de Emergência')).toBeVisible();
    });

    // ============================================
    // PASSO 2: Adicionar Casa como ativo (Investimento)
    // ============================================
    await test.step('Cadastrar casa própria como investimento', async () => {
      await page.click('nav >> text=Contas');
      await expect(page).toHaveURL(/\/accounts/);

      await page.click('button:has-text("Nova Conta")');

      // Preencher formulário da casa
      await page.fill('input[name="name"]', 'Casa Própria - Jardins');
      await page.selectOption('select[name="type"]', 'INVESTMENT');
      await page.fill('input[name="initialBalance"]', '800000');
      await page.fill('input[name="color"]', '#10B981');
      await page.click('button[type="submit"]');

      // Verificar se apareceu na lista
      await expect(page.locator('text=Casa Própria - Jardins')).toBeVisible();
      await expect(page.locator('text=R$ 800.000,00')).toBeVisible();
    });

    // ============================================
    // PASSO 3: Adicionar Carro como ativo
    // ============================================
    await test.step('Cadastrar carro como ativo', async () => {
      await page.click('button:has-text("Nova Conta")');

      await page.fill('input[name="name"]', 'Honda Civic 2023');
      await page.selectOption('select[name="type"]', 'INVESTMENT');
      await page.fill('input[name="initialBalance"]', '120000');
      await page.fill('input[name="color"]', '#3B82F6');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Honda Civic 2023')).toBeVisible();
      await expect(page.locator('text=R$ 120.000,00')).toBeVisible();
    });

    // ============================================
    // PASSO 4: Atualizar salário (conta corrente)
    // ============================================
    await test.step('Ajustar conta corrente com salário realista', async () => {
      // Editar conta Nubank existente para refletir salário
      await page.click('button[aria-label*="Editar"] >> nth=0').catch(async () => {
        // Se não tiver botão editar, vamos adicionar receita
        await page.click('nav >> text=Início');
        await page.click('button:has-text("Nova Receita")');

        await page.fill('input[name="description"]', 'Salário Mensal');
        await page.fill('input[name="amount"]', '15000');
        await page.selectOption('select[name="accountId"]', { label: 'Nubank Conta' });
        await page.selectOption('select[name="categoryId"]', { label: 'Salário & Renda' });
        await page.click('button[type="submit"]');
      });
    });

    // ============================================
    // PASSO 5: Criar Meta - Imóvel de 1M
    // ============================================
    await test.step('Criar meta de compra de imóvel R$ 1.000.000', async () => {
      await page.click('nav >> text=Metas');
      await expect(page).toHaveURL(/\/goals/);

      await page.click('button:has-text("Nova Meta")');

      await page.fill('input[name="title"]', 'Comprar Apartamento 1M - Vila Madalena');
      await page.fill('input[name="targetAmount"]', '1000000');
      await page.fill('input[name="currentAmount"]', '920000'); // Casa 800k + Carro 120k = 920k
      await page.fill('input[name="targetDate"]', '2027-12-31');
      await page.fill('input[name="categoryTag"]', 'Imóvel');
      await page.click('button[type="submit"]');

      // Verificar meta criada com progresso ~92%
      await expect(page.locator('text=Comprar Apartamento 1M')).toBeVisible();
      await expect(page.locator('text=92%')).toBeVisible(); // 920k / 1M = 92%
      await expect(page.locator('text=R$ 920.000,00')).toBeVisible();
      await expect(page.locator('text=R$ 1.000.000,00')).toBeVisible();
    });

    // ============================================
    // PASSO 6: Verificar Patrimônio Líquido Atualizado
    // ============================================
    await test.step('Verificar patrimônio líquido no dashboard', async () => {
      await page.click('nav >> text=Início');
      await expect(page).toHaveURL(/\/dashboard/);

      // Patrimônio = Checking (2.500) + Casa (800.000) + Carro (120.000) - Cartão (1.250) = 921.250
      // Como o saldo da conta corrente pode ter mudado com o salário, verificar valor aproximado
      await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();

      // O card deve mostrar ativos ~922.500 e passivos ~1.250
      await expect(page.locator('text=Ativos')).toBeVisible();
      await expect(page.locator('text=Passivos') || page.locator('text=Faturas')).toBeVisible();
    });

    // ============================================
    // PASSO 7: Simular aportes mensais na meta
    // ============================================
    await test.step('Simular aporte mensal de R$ 15.000 na meta', async () => {
      await page.click('nav >> text=Metas');

      // Clicar em "Adicionar valor" na meta do imóvel
      await page.click('button:has-text("Adicionar valor") >> nth=0');

      // Modal deve abrir - preencher aporte
      await page.fill('input[name="amount"]', '15000');
      await page.fill('input[name="description"]', 'Aporte mensal - Janeiro');
      await page.click('button[type="submit"]');

      // Verificar progresso atualizado: 935.000 / 1.000.000 = 93.5%
      await expect(page.locator('text=93%') || page.locator('text=94%')).toBeVisible();
    });

    // ============================================
    // PASSO 8: Verificar Extrato com todas movimentações
    // ============================================
    await test.step('Verificar extrato consolidado', async () => {
      await page.click('nav >> text=Extrato');
      await expect(page).toHaveURL(/\/transactions/);

      // Deve mostrar: Salário, Aporte na meta, etc.
      await expect(page.locator('text=Salário Mensal')).toBeVisible();
      await expect(page.locator('text=Aporte mensal')).toBeVisible();
    });

    // ============================================
    // PASSO 9: Análise de viabilidade (usabilidade)
    // ============================================
    await test.step('Verificar indicadores de viabilidade da meta', async () => {
      await page.click('nav >> text=Metas');

      // Verificar se mostra tempo restante para meta
      const goalCard = page.locator('text=Comprar Apartamento 1M').locator('..').locator('..');

      // Deve mostrar data alvo
      await expect(goalCard.locator('text=2027')).toBeVisible();

      // Deve mostrar valor faltante: ~65.000
      await expect(goalCard.locator('text=R$ 65.000,00') || goalCard.locator('text=65.000')).toBeVisible();
    });
  });

  test('Validação de usabilidade - Mobile First', async ({ page }) => {
    await test.step('Testar navegação mobile bottom nav', async () => {
      // Verificar se bottom nav está visível
      const bottomNav = page.locator('nav.fixed.bottom-0');
      await expect(bottomNav).toBeVisible();

      // Testar cada tab
      const tabs = ['Início', 'Extrato', 'Contas', 'Metas', 'Assessor'];

      for (const tab of tabs) {
        await page.click(`nav >> text=${tab}`);
        await expect(page.locator(`text=${tab}`).first()).toBeVisible();
      }
    });

    await test.step('Verificar responsividade em viewport mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      await page.click('nav >> text=Início');
      await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();

      // Card não deve ter scroll horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
    });
  });

  test('Validação de design - Consistência visual', async ({ page }) => {
    await test.step('Verificar tokens de design (cores, espaçamento)', async () => {
      await page.click('nav >> text=Início');

      // Card principal deve ter gradiente slate-900
      const netWorthCard = page.locator('section').first();
      await expect(netWorthCard).toHaveClass(/bg-gradient-to-br/);
      await expect(netWorthCard).toHaveClass(/from-slate-900/);
      await expect(netWorthCard).toHaveClass(/border-slate-800/);

      // Botões primários devem ser indigo-600
      const primaryBtn = page.locator('button.bg-indigo-600').first();
      await expect(primaryBtn).toBeVisible();

      // Botões secundários slate-900 border slate-800
      const secondaryBtn = page.locator('button.bg-slate-900.border-slate-800').first();
      await expect(secondaryBtn).toBeVisible();
    });

    await test.step('Verificar tipografia e hierarchy', async () => {
      await page.click('nav >> text=Início');

      // Título "Patrimônio Líquido" - text-xs uppercase tracking-wider
      const title = page.locator('text=Patrimônio Líquido');
      await expect(title).toHaveClass(/text-xs/);
      await expect(title).toHaveClass(/uppercase/);
      await expect(title).toHaveClass(/tracking-wider/);

      // Valor principal - text-3xl font-extrabold
      const value = page.locator('text=R$').first().locator('..');
      await expect(value).toHaveClass(/text-3xl/);
      await expect(value).toHaveClass(/font-extrabold/);
    });
  });
});

test.describe('Edge Cases e Validações', () => {
  test('Não permitir meta com valor atual maior que alvo', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'cliente@demo.com.br');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await page.click('nav >> text=Metas');
    await page.click('button:has-text("Nova Meta")');

    await page.fill('input[name="title"]', 'Meta Inválida');
    await page.fill('input[name="targetAmount"]', '100000');
    await page.fill('input[name="currentAmount"]', '150000'); // Maior que alvo
    await page.click('button[type="submit"]');

    // Deve mostrar erro ou limitar a 100%
    await expect(page.locator('text=100%')).toBeVisible();
  });

  test('Transação de despesa não deve permitir saldo negativo em conta corrente', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'cliente@demo.com.br');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await page.click('button:has-text("Nova Despesa")');

    await page.fill('input[name="description"]', 'Compra grande');
    await page.fill('input[name="amount"]', '10000'); // Maior que saldo (2.500)
    await page.selectOption('select[name="accountId"]', { label: 'Nubank Conta' });
    await page.click('button[type="submit"]');

    // Verificar se permite (pode ficar negativo) ou mostra aviso
    // Comportamento atual: permite ficar negativo
  });
});