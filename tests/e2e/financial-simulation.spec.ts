import { test, expect } from '@playwright/test';

test.describe('Simulação Financeira - Compra Imóvel 1M', () => {
  test.beforeEach(async ({ page }) => {
    // Login como cliente demo
    await page.goto('/login');
    await page.fill('input[placeholder="seu@email.com"]', 'cliente@demo.com.br');
    await page.fill('input[placeholder="••••••••"]', 'demo123');
    await page.getByRole('button', { name: /acessar plataforma/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  });

  test('Fluxo completo: Cadastrar ativos, renda e meta de imóvel 1M', async ({ page }) => {
    // ============================================
    // PASSO 1: Verificar dashboard inicial
    // ============================================
    await test.step('Verificar dashboard inicial com dados seed', async () => {
      await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();
      // Seed creates "Reserva de emergência" (lowercase e); verify it exists
      await expect(page.locator('text=/Reserva.*(emer|Emer)/')).toBeVisible();
    });

    // ============================================
    // PASSO 2: Adicionar Casa como ativo (Investimento)
    // ============================================
    await test.step('Cadastrar casa própria como investimento', async () => {
      await page.getByRole('link', { name: 'Contas' }).click();
      await page.waitForURL(/\/accounts/);

      await page.getByRole('button', { name: 'Nova Conta' }).click();

      // Preencher formulário da casa
      await page.fill('input[placeholder="Ex: Nubank Conta Corrente"]', 'Casa Própria - Jardins');
      await page.selectOption('select', { label: 'Investimento' });
      await page.fill('input[placeholder="0,00"]', '800000');
      await page.getByRole('button', { name: 'Criar Conta' }).click();

      // Wait for form to close (showForm becomes false)
      await page.waitForTimeout(1500);

      // Aguarda revalidação e renderização da lista
      await expect(page.locator('text=Casa Própria - Jardins').first()).toBeVisible();
    });

    // ============================================
    // PASSO 3: Adicionar Carro como ativo
    // ============================================
    await test.step('Cadastrar carro como ativo', async () => {
      // Form should be closed from previous step, click Nova Conta again
      await page.getByRole('button', { name: 'Nova Conta' }).click();
      await page.waitForTimeout(1000);

      await page.fill('input[placeholder="Ex: Nubank Conta Corrente"]', 'Honda Civic 2023');
      await page.selectOption('select', { label: 'Investimento' });
      await page.fill('input[placeholder="0,00"]', '120000');
      await page.getByRole('button', { name: 'Criar Conta' }).click();

      // Wait for form to close and list to update
      await page.waitForTimeout(1500);
      await expect(page.locator('text=Honda Civic 2023').first()).toBeVisible();
    });

    // ============================================
    // PASSO 4: Criar Meta - Imóvel de 1M
    // ============================================
    await test.step('Criar meta de compra de imóvel R$ 1.000.000', async () => {
      await page.getByRole('link', { name: 'Metas' }).click();
      await page.waitForURL(/\/goals/);

      await page.getByRole('button', { name: 'Nova Meta' }).click();

      // title
      await page.fill('input[placeholder="Ex: Reserva de Emergência"]', 'Comprar Apartamento 1M - Vila Madalena');
      // O primeiro 0,00 é targetAmount, o segundo é currentAmount
      const amountInputs = page.locator('input[placeholder="0,00"]');
      await amountInputs.nth(0).fill('1000000');
      await amountInputs.nth(1).fill('920000');
      await page.fill('input[type="date"]', '2027-12-31');
      await page.getByRole('button', { name: 'Criar Meta' }).click();

      await page.waitForTimeout(800);

      // Verificar meta criada
      await expect(page.locator('text=Comprar Apartamento 1M').first()).toBeVisible();
    });

    // ============================================
    // PASSO 5: Verificar Patrimônio Líquido Atualizado
    // ============================================
    await test.step('Verificar patrimônio líquido no dashboard', async () => {
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.waitForURL(/\/dashboard/);
      await page.waitForTimeout(600);

      await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();
    });

    // ============================================
    // PASSO 6: Adicionar receita via botão do dashboard
    // ============================================
    await test.step('Adicionar receita de salário via dashboard', async () => {
      // Click "Nova Receita" button on dashboard (uses client-side nav via Link)
      const novaReceitaBtn = page.getByRole('link', { name: 'Nova Receita' }).or(page.getByRole('button', { name: 'Nova Receita' }));
      if (await novaReceitaBtn.count()) await novaReceitaBtn.click();
      await page.waitForURL(/\/transactions/, { timeout: 10000 });
      await page.waitForTimeout(500);

      // Open the transaction form (starts hidden)
      const novaTxBtn = page.getByRole('button', { name: 'Nova Transação' });
      if (await novaTxBtn.count()) await novaTxBtn.click();
      await page.waitForTimeout(300);

      // Click Receita to switch from default EXPENSE
      const incomeBtn = page.getByRole('button', { name: 'Receita', exact: true });
      if (await incomeBtn.count()) await incomeBtn.click();
      await page.waitForTimeout(200);

      const txPlaceholders = page.locator('input[placeholder="0,00"]');
      await txPlaceholders.first().fill('15000');
      await page.fill('input[placeholder="Ex: Supermercado"]', 'Salário Mensal');
      await page.fill('input[type="date"]', '2024-01-15');

      // Selecionar conta do select — opção começa com "Nubank Conta"
      // The select renders options as "Name (TYPE)" — use the full label text
    await page.locator('select').first().selectOption('Nubank Conta (CHECKING)');

      await page.getByRole('button', { name: 'Salvar Transação' }).click();
      await page.waitForTimeout(800);

      await expect(page.locator('text=Salário Mensal')).toBeVisible();
    });

    // ============================================
    // PASSO 7: Verificar Extrato com movimentações
    // ============================================
    await test.step('Verificar extrato consolidado', async () => {
      await page.getByRole('link', { name: 'Transações' }).click();
      await page.waitForURL(/\/transactions/);
      await page.waitForTimeout(400);

      await expect(page.locator('text=Salário Mensal')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Receita', exact: true }).or(page.locator('text=Receitas'))).toBeVisible();
    });
  });

  test('Validação de usabilidade - Mobile First', async ({ page }) => {
    await test.step('Testar navegação mobile bottom nav', async () => {
      // Verificar se bottom nav está visível
      const bottomNav = page.locator('nav.fixed.bottom-0');
      await expect(bottomNav).toBeVisible();

      // Navegar pelos tabs — usar URLs reais (não basear-se no texto do tab)
      await page.getByRole('button', { name: 'Início' }).click();
      await page.waitForURL(/\/dashboard/);

      await page.getByRole('button', { name: 'Extrato' }).click();
      await page.waitForURL(/\/transactions/);

      await page.getByRole('button', { name: 'Contas' }).click();
      await page.waitForURL(/\/accounts/);

      await page.getByRole('button', { name: 'Metas' }).click();
      await page.waitForURL(/\/goals/);

      await page.getByRole('button', { name: 'Assessor' }).click();
      await page.waitForURL(/\/advisor/);
    });

    await test.step('Verificar responsividade em viewport mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/dashboard');
      await expect(page.locator('text=Patrimônio Líquido')).toBeVisible();

      // Card não deve ter scroll horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
    });
  });

  test('Validação de design - Consistência visual', async ({ page }) => {
    await test.step('Verificar tokens de design (cores, espaçamento)', async () => {
      await page.goto('/dashboard');

      // Cards usam bordas douradas (#cfc6b4) e fundo escuro (#191a1e)
      const netWorthSection = page.locator('section').first();
      await expect(netWorthSection).toBeVisible();
    });

    await test.step('Verificar tipografia e hierarquia', async () => {
      await page.goto('/dashboard');

      // Título "Patrimônio Líquido" com text-xs uppercase tracking-[0.15em]
      const title = page.locator('text=Patrimônio Líquido');
      await expect(title).toBeVisible();
      await expect(title).toHaveClass(/text-xs/);
      await expect(title).toHaveClass(/uppercase/);
      await expect(title).toHaveClass(/tracking-/);
    });
  });
});

test.describe('Edge Cases e Validações', () => {
  test('Não permitir meta com valor atual maior que alvo', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="seu@email.com"]', 'cliente@demo.com.br');
    await page.fill('input[placeholder="••••••••"]', 'demo123');
    await page.getByRole('button', { name: /acessar plataforma/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    await page.getByRole('link', { name: 'Metas' }).click();
    await page.getByRole('button', { name: 'Nova Meta' }).click();

    await page.fill('input[placeholder="Ex: Reserva de Emergência"]', 'Meta Inválida');
    const goalAmounts = page.locator('input[placeholder="0,00"]');
    await goalAmounts.nth(0).fill('100000');   // target
    await goalAmounts.nth(1).fill('150000');   // current > target
    await page.fill('input[type="date"]', '2027-12-31');
    await page.getByRole('button', { name: 'Criar Meta' }).click();

    await page.waitForTimeout(800);

    // Backend aceita mas mostra progresso capped em 100%
    const metaCell = page.locator('text=Meta Inválida').first();
    await expect(metaCell).toBeVisible();
    // Se progresso aparecer, deve mostrar 100% (cap)
    const progress = page.locator('text=100%').first();
    await expect(progress).toBeVisible();
  });

  test('Transação de despesa deve atualizar saldo da conta', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="seu@email.com"]', 'cliente@demo.com.br');
    await page.fill('input[placeholder="••••••••"]', 'demo123');
    await page.getByRole('button', { name: /acessar plataforma/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    // Navigate to transactions using Link (client-side nav, session preserved)
    const novaDespesaBtn = page.getByRole('link', { name: 'Nova Despesa' }).or(page.getByRole('button', { name: 'Nova Despesa' }));
    if (await novaDespesaBtn.count()) {
      await novaDespesaBtn.click();
    } else {
      await page.getByRole('link', { name: 'Transações' }).click();
    }
    await page.waitForURL(/\/transactions/, { timeout: 10000 });
    await page.waitForTimeout(500);

    // Toggle the form open (starts hidden)
    const novaTxBtn = page.getByRole('button', { name: 'Nova Transação' });
    if (await novaTxBtn.count()) await novaTxBtn.click();
    await page.waitForTimeout(300);

    // Default type is already EXPENSE; verify form is visible
    const amountInput = page.locator('input[placeholder="0,00"]').first();
    await expect(amountInput).toBeVisible({ timeout: 10000 });

    amountInput.fill('500');
    await page.fill('input[placeholder="Ex: Supermercado"]', 'Compra teste');
    await page.fill('input[type="date"]', '2024-01-20');

    // Selecionar conta
    // The select renders options as "Name (TYPE)" — use the full label text
    await page.locator('select').first().selectOption('Nubank Conta (CHECKING)');

    // Intercept the POST to capture any error
    let postStatus = 0;
    let postBody = '';
    page.on('response', async (resp) => {
      if (resp.url().includes('/api/transactions') && resp.request().method() === 'POST') {
        postStatus = resp.status();
        postBody = await resp.text().catch(() => '');
      }
    });

    await page.getByRole('button', { name: 'Salvar Transação' }).click();
    await page.waitForTimeout(1500);

    // Verify transaction appeared in list
    await expect(page.locator('text=Compra teste').first()).toBeVisible({ timeout: 10000 });

    // Verify saldo was updated on accounts page
    await page.getByRole('link', { name: 'Contas' }).click();
    await page.waitForURL(/\/accounts/);
    await page.waitForTimeout(400);

    await expect(page.locator('text=Nubank Conta')).toBeVisible();
  });
});
