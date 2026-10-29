# 📊 Análise de Usabilidade & Design - S1NC (W1 Consultoria)

> Análise baseada no plano de execução e código implementado. Identifica gaps entre o especificado e o implementado, além de oportunidades de melhoria.

---

## ✅ **O que está ALINHADO com o Plano**

| Item | Plano | Implementado | Status |
|------|-------|--------------|--------|
| **Mobile-First** | `max-w-md mx-auto`, bottom nav fixa | ✅ Layout client com 375px max, bottom nav 5 tabs | ✅ |
| **Net Worth Card** | Ativos - Passivos (Cartão = liability) | ✅ Cálculo correto em `dashboard.ts` | ✅ |
| **Metas W1** | Reserva emergência + metas curto/médio prazo | ✅ GoalProgressCard com barra %, categoriaTag | ✅ |
| **Advisor Mode** | Visualizar carteira + auditoria | ✅ Dashboard com KPIs + tabela clientes | ✅ |
| **Stack** | Next.js 15, TS, Tailwind, Prisma, Zod | ✅ Todas configuradas | ✅ |
| **Seed BR** | Categorias PT-BR (Alimentação, Moradia, etc) | ✅ 7 categorias com ícones Lucide | ✅ |

---

## ⚠️ **GAPS CRÍTICOS (Funcionais)**

### 1. **Auth Inexistente** 🔴
```typescript
// ATUAL: Hardcoded no dashboard
const demoUserEmail = "cliente@demo.com.br";

// NECESSÁRIO: NextAuth + Middleware
// - src/lib/auth.ts com providers (credentials, github, google)
// - src/middleware.ts protegendo (client)/(advisor)
// - getServerSession() nas Server Actions
```

### 2. **Server Actions não conectadas ao UI** 🔴
```typescript
// EXEMPLO: Botão "Nova Despesa" no dashboard não abre modal
<button className="...">Nova Despesa</button>
// FALTA: onClick -> abrir TransactionModal

// MESMO PARA: "Nova Receita", "Nova Conta", "Nova Meta"
```

### 3. **TransactionModal não integrada** 🔴
- Componente existe mas **não é chamado** em lugar nenhum
- Precisa de `useState` no layout/client para controlar `isOpen`
- Precisa receber `accounts` e `categories` como props (Server Component → Client Component)

### 4. **Formulários CRUD ausentes nas páginas** 🔴
| Página | Botão | Ação Esperada | Implementado |
|--------|-------|---------------|--------------|
| `/accounts` | "Nova Conta" | Modal/Page create | ❌ Só botão |
| `/goals` | "Nova Meta" | Modal/Page create | ❌ Só botão |
| `/transactions` | "Nova Transação" | Modal create | ❌ Só botão |

### 5. **Cálculo de viabilidade da meta ausente** 🟡
```typescript
// PLANO: "Meta de 1M - mostrar meses restantes com aporte X"
// IMPLEMENTADO: Só mostra % progresso
// FALTANDO:
// - Meses para atingir meta (targetDate - now / monthlyContribution)
// - Projeção com juros compostos (opcional Fase 2)
// - Alerta se aporte atual não atinge meta na data
```

---

## 🎨 **GAPS DE DESIGN & USABILIDADE**

### 1. **Design System Incompleto** 🟡

| Componente Shadcn | Necessário? | Status |
|-------------------|-------------|--------|
| `Button` | ✅ Primário, secundário, outline, ghost, destructive | ❌ Não instalado |
| `Input` | ✅ Com label, error, helper text | ❌ |
| `Select` | ✅ Com search, multi-select | ❌ |
| `Dialog` | ✅ Para modais (Nova Conta, Nova Meta, Transação) | ❌ |
| `Toast` | ✅ Feedback success/error | ❌ |
| `Tooltip` | ✅ Ícones de ajuda | ❌ |
| `Tabs` | ✅ Para alternar vistas (Lista/Gráfico) | ❌ |
| `Progress` | ✅ Barra de meta (já feito custom) | ⚠️ Custom OK |
| `Avatar` | ✅ Header do usuário | ⚠️ Custom OK |
| `DropdownMenu` | ✅ Menu do usuário no header | ⚠️ Custom OK |

**Ação:** `npx shadcn@latest add button input select dialog toast dropdown-menu avatar tooltip tabs`

### 2. **Estados de Loading/Empty/Error Ausentes** 🟡

```tsx
// ATUAL: Só tem empty state básico
{goals.length === 0 ? <EmptyState /> : <List />}

// NECESSÁRIO:
<Suspense fallback={<Skeleton />}>
  <GoalsList />
</Suspense>

// Error Boundary por feature
<ErrorBoundary fallback={<ErrorState onRetry={refetch} />}>
  <GoalsList />
</ErrorBoundary>
```

### 3. **Feedback Visual Fraco** 🟡
- **Success toast** ao criar conta/meta/transação → **NÃO EXISTE**
- **Confirmação de exclusão** (modal "Tem certeza?") → **NÃO EXISTE**
- **Validação inline** (Zod errors no formulário) → **PARCIAL** (só no modal transação)

### 4. **Acessibilidade (a11y)** 🟡
| Critério | Status | Ação |
|----------|--------|------|
| `aria-label` em botões só com ícone | ⚠️ Parcial | Adicionar em BottomNav, Header |
| Contraste WCAG AA | ✅ Slate/Indigo/Emerald/Rose OK | Verificar com ferramenta |
| Navegação por teclado (Tab) | ✅ Nativo | Testar modais |
| Focus visible | ✅ `focus-visible` no globals.css | OK |
| Screen reader labels | ❌ Faltando em selects/inputs | Adicionar `id` + `htmlFor` |

### 5. **Micro-interactions Ausentes** 🟢 (Nice to have)
- Animação de contador no Net Worth (count-up)
- Shimmer loading nos cards
- Transição suave ao alternar tabs
- Hover states mais ricos nos cards

---

## 📱 **ANÁLISE DO FLUXO "COMPRA IMÓVEL 1M"**

### Jornada Atual (com gaps):

```
1. Login ✅ (mock)
   ↓
2. Dashboard vê Net Worth R$ 1.250 ❌ (dados seed irrelevantes)
   ↓
3. Contas → "Nova Conta" ❌ (botão não funciona)
   ↓
4. Adicionar Casa R$ 800k ❌ (sem modal/form)
   ↓
5. Adicionar Carro R$ 120k ❌ (sem modal/form)
   ↓
6. Metas → "Nova Meta" ❌ (botão não funciona)
   ↓
7. Criar "Apt 1M" com current R$ 920k ❌ (sem form)
   ↓
8. Dashboard mostra 92% progresso ⚠️ (só se dados existirem)
   ↓
9. "Adicionar valor" na meta ❌ (botão não conectado)
   ↓
10. Extrato mostra histórico ⚠️ (só seed)
```

### Jornada Ideal (com usabilidade):

```
1. Login real (NextAuth) → Redirect para /dashboard
   ↓
2. Onboarding (first visit):
   - "Bem-vindo! Vamos configurar suas contas?"
   - Wizard: Conta corrente → Cartão → Investimentos
   ↓
3. Dashboard personalizado:
   - Net Worth real calculado
   - Cards de ação rápida FUNCIONAIS
   ↓
4. Meta "Imóvel 1M" com assistente:
   - "Qual valor do imóvel?" → 1.000.000
   - "Quanto já tem?" → 920.000 (sugere base contas)
   - "Quando quer comprar?" → Date picker
   - "Quanto pode aportar/mês?" → 15.000
   → CÁLCULO AUTOMÁTICO: "Com R$ 15k/mês, atinge em 5 meses (Maio/2026)"
   ↓
5. Acompanhamento mensal:
   - Notificação: "Hora do aporte mensal!"
   - One-click: "Aportar R$ 15k agora"
   - Progresso animado
```

---

## 🔧 **PLANO DE AÇÃO PRIORIZADO**

### **Sprint 1 - Funcionalidade Core (P0)**
| Task | Esforço | Arquivos |
|------|---------|----------|
| 1. NextAuth + Middleware | 4h | `src/lib/auth.ts`, `src/middleware.ts`, `src/app/api/auth/[...nextauth]` |
| 2. Instalar Shadcn UI components | 1h | `npx shadcn add button input select dialog toast dropdown-menu avatar` |
| 3. Conectar Botões → Modais (Contas, Metas, Transações) | 3h | `src/app/(client)/layout.tsx` (state), components |
| 4. Forms CRUD com Zod + Server Actions | 4h | `src/components/forms/*.tsx`, actions |
| 5. Toast notifications | 1h | `src/components/ui/toast.tsx`, provider no layout |

### **Sprint 2 - Experiência Meta 1M (P1)**
| Task | Esforço | Arquivos |
|------|---------|----------|
| 6. Wizard "Nova Meta" com cálculo viabilidade | 3h | `src/components/forms/goal-wizard.tsx` |
| 7. Projeção temporal (meses para atingir) | 2h | `src/lib/goal-calculations.ts` |
| 8. Aporte rápido na meta (one-click) | 2h | `src/components/shared/quick-deposit.tsx` |
| 9. Gráfico de projeção (Recharts) | 3h | `src/components/charts/goal-projection.tsx` |

### **Sprint 3 - Polish & A11y (P2)**
| Task | Esforço |
|------|---------|
| 10. Loading states (Suspense + Skeleton) | 2h |
| 11. Error Boundaries por feature | 2h |
| 12. Validação a11y completa (axe-core) | 2h |
| 13. Micro-animações (Framer Motion) | 3h |
| 14. Testes E2E completos (Playwright) | 4h |

---

## 📐 **MELHORIAS DE DESIGN ESPECÍFICAS**

### 1. **Net Worth Card - Adicionar:**
```tsx
// Tendência (vs mês anterior)
<div className="flex items-center gap-1 text-xs mt-2">
  <TrendingUp className="w-3 h-3 text-emerald-400" />
  <span className="text-emerald-400">+12,5% vs mês passado</span>
</div>

// Breakdown visual (donut chart mini)
<DonutChart data={[{label: 'Casa', value: 800k}, {label: 'Carro', value: 120k}]} />
```

### 2. **Goal Card - Adicionar:**
```tsx
// Tempo restante calculado
<div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
  <Clock className="w-3 h-3" />
  <span>~5 meses (Maio 2026) com aporte atual</span>
</div>

// Cenários
<details className="mt-2">
  <summary className="text-xs text-indigo-400 cursor-pointer">Ver cenários</summary>
  <div className="text-xs text-slate-400 space-y-1 mt-1">
    <div>R$ 10k/mês → 8 meses</div>
    <div>R$ 15k/mês → 5 meses ← ATUAL</div>
    <div>R$ 20k/mês → 4 meses</div>
  </div>
</details>
```

### 3. **Dashboard - Reorganizar Prioridade Visual:**
```
ATUAL: Net Worth → Ações → Metas → Transações
IDEAL: Net Worth → Meta Principal (CTA) → Ações Rápidas → Resumo Contas → Transações Recentes
```

### 4. **Empty States Inteligentes:**
```tsx
// Em vez de "Nenhuma meta"
<EmptyState 
  icon={Target}
  title="Sua primeira meta"
  description="Que tal uma reserva de emergência ou a entrada do apê?"
  primaryAction={<Button>Criar meta guiada</Button>}
  secondaryAction={<Button variant="ghost">Ver exemplos</Button>}
/>
```

---

## 🧪 **TESTES E2E - COBERTURA NECESSÁRIA**

| Cenário | Arquivo | Status |
|---------|---------|--------|
| Login → Dashboard | `financial-simulation.spec.ts` | ✅ Criado |
| Criar conta (casa/carro) | `financial-simulation.spec.ts` | ✅ Criado |
| Criar meta 1M | `financial-simulation.spec.ts` | ✅ Criado |
| Aporte na meta | `financial-simulation.spec.ts` | ✅ Criado |
| Verificar Net Worth | `financial-simulation.spec.ts` | ✅ Criado |
| Mobile viewport (375px) | `financial-simulation.spec.ts` | ✅ Criado |
| Design tokens | `financial-simulation.spec.ts` | ✅ Criado |
| **Validação Zod errors** | ❌ FALTANDO | 🔴 |
| **Loading states** | ❌ FALTANDO | 🔴 |
| **Auth redirect não logado** | ❌ FALTANDO | 🔴 |
| **Advisor fluxo cliente** | ❌ FALTANDO | 🔴 |

---

## 📋 **CHECKLIST PARA PRÓXIMO DEPLOY**

### Obrigatório (Blocking)
- [ ] NextAuth configurado e funcional
- [ ] Middleware protegendo rotas (client)/(advisor)
- [ ] Botões "Nova X" abrem modais/forms funcionais
- [ ] Server Actions conectadas + Toast feedback
- [ ] Seed roda sem erro no Supabase

### Importante (P1)
- [ ] Shadcn UI components instalados
- [ ] Wizard "Nova Meta" com cálculo viabilidade
- [ ] Loading/Empty/Error states em todas listas
- [ ] Testes E2E passando no CI

### Desejável (P2)
- [ ] Gráfico projeção meta (Recharts)
- [ ] Animações Framer Motion
- [ ] PWA manifest + service worker
- [ ] Dark/Light mode toggle

---

## 🎯 **CONCLUSÃO**

A **estrutura técnica está sólida** (Prisma, Actions, Types, Layout), mas a **camada de interação está desconectada**. O usuário **não consegue executar o fluxo principal** (cadastrar ativos → criar meta → acompanhar).

**Prioridade máxima:** Conectar UI → Server Actions → Feedback visual. O resto é polimento.

> **Referência do Plano:** Seção 3 (Passos 1-7) + Seção 4 (Deploy). O plano assume que cada passo gera código funcional testável - estamos no Passo 7 sem ter completado Passos 5-6 (Auth, UI Components).