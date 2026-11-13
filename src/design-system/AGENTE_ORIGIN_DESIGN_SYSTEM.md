# Origin Design System Agent — Documentação Técnica Completa

## Identidade do Agente

**Nome:** Origin Design System Agent (ODSA)
**Versão:** 1.0.0
**Data de criação:** 2026-11-13
**Responsável:** Luiz Carlos Vilela — S1NC W1

---

## 1. Visão Geral

O **Origin Design System Agent** é o guardião da identidade visual e da consistência UX/UI da plataforma de diagnóstico patrimonial Origin. Ele define, mantém e aplica o sistema de design inspirado no site [origingroup.com.br](https://origingroup.com.br), com foco na estética luxury/wealth management que remete à Carvalho Group mas adaptada ao novo branding Origin.

### Posicionamento da Marca
- **Espectro:** Construtor → Governante (Método MAPA)
- **Valor central:** Transformar faturamento em patrimônio estruturado
- **Tom:** Autoritário, sofisticado, consultivo
- **Público:** Empresários, médicos, advogados e profissionais liberais de alta renda

---

## 2. Tokens de Design

### 2.1 Cores

#### Primary: Gold (Luxo/Dourado)
| Token | Hex | Tailwind Class | Uso |
|-------|-----|----------------|-----|
| `origin-gold` | `#d4a843` | `text-gold-500`, `bg-gold-500`, `border-gold-500` | CTAs primários, destaques, badges premium |
| `origin-gold-light` | `#f5d7c9` | `text-gold-200` | Hover states suaves |
| `origin-gold-dark` | `#8e681c` | `text-gold-700` | Textos sobre fundos dourados |

**Escala completas:**
```css
--gold-50: #fef8e7;
--gold-100: #fdf0c6;
--gold-200: #fce58c;
--gold-300: #f7dc8a;
--gold-400: #f0c938;
--gold-500: #d4a843; /* GOLD PRIMARY */
--gold-600: #b37b1c;
--gold-700: #8e681c;
--gold-800: #634910;
--gold-900: #422f09;
--gold-950: #231802;
```

#### Background: Dark Slate (Rico/Profundo)
| Token | Hex | Tailwind Class | Uso |
|-------|-----|----------------|-----|
| `origin-background` | `#0a0e1a` | `bg-slate-950` | Fundo principal da página |
| `origin-surface` | `#111827` | `bg-slate-900` | Cards, modals, overlays |
| `origin-border` | `#1f2937` | `border-slate-800` | Bordas sutis entre elementos |

**Escala completar:**
```css
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-300: #cbd5e1;
--slate-400: #94a3b8;
--slate-500: #64748b;
--slate-600: #475569;
--slate-700: #334155;
--slate-800: #1e293b;
--slate-900: #0f172a;
--slate-950: #0a0e1a; /* BACKGROUND PRIMARY */
```

#### Accent: Ocean (Tecnologia/Confiança)
| Token | Hex | Tailwind Class | Uso |
|-------|-----|----------------|-----|
| `origin-ocean` | `#0ea5e9` | `text-ocean-500`, `bg-ocean-500`, `border-ocean-500` | Links, gráficos, ações secundárias |

#### Status Colors
| Token | Hex | Uso |
|-------|-----|-----|
| `origin-success` | `#22c55e` | Métricas positivas, confirmações |
| `origin-warning` | `#f59e0b` | Alertas, atenção necessária |
| `origin-error` | `#ef4444` | Erros, valores negativos |
| `origin-info` | `#3b82f6` | Informações neutras |

---

### 2.2 Tipografia

#### Font Families
```css
--font-heading: "Geist Sans", system-ui, sans-serif;
--font-body: "Geist Sans", system-ui, sans-serif;
--font-mono: "Geist Mono", monospace;
```

#### Hierarquia Tipográfica

| Nível | Tamanho | Peso | Tracking | Line Height | Uso |
|-------|---------|------|----------|-------------|-----|
| Display H1 | 60px (clamp 3rem+) | 800 | -0.02em | 1.1 | Hero principal |
| Heading H2 | 44px (clamp 2.5rem+) | 700 | -0.01em | 1.15 | Títulos de seção |
| Heading H3 | 30px (clamp 1.75rem+) | 600 | 0 | 1.25 | Cards headers |
| Body Large | 18px | 400 | 0 | 1.6 | Parágrafos extensos |
| Body | 16px | 400 | 0.01em | 1.5 | Corpo padrão |
| Caption | 14px | 500 | 0.05em | 1.4 | Labels, badges |
| Micro | 12px | 500 | 0.1em | 1.3 | Overlays, footnotes |

#### Classes CSS Utilitárias
```css
.font-display { font-size: clamp(2.25rem, 8vw, 3.75rem); font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; }
.font-heading { font-size: clamp(1.75rem, 5vw, 2.75rem); font-weight: 700; letter-spacing: -0.01em; line-height: 1.15; }
.font-subheading { font-size: 1.5rem; font-weight: 600; line-height: 1.25; }
.font-body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
.font-caption { font-size: 0.875rem; font-weight: 500; letter-spacing: 0.05em; }
.font-micro { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; }
```

---

### 2.3 Espaçamento

Baseado em scale de 4px (`space.1 = 0.25rem`):

| Token | Valor | Uso |
|-------|-------|-----|
| `space.1` | 4px | Padding inline, gaps pequenos |
| `space.2` | 8px | Padding buttons, inputs |
| `space.3` | 12px | Gap cards, listas |
| `space.4` | 16px | Margin sections |
| `space.5` | 24px | Padding componentes internos |
| `space.6` | 32px | Padding páginas |
| `space.8` | 48px | Margin entre seções |
| `space.10` | 64px | Margin hero sections |
| `space.12` | 80px | Padding containers largos |
| `space.16` | 96px | Gap entre módulos |
| `space.20` | 128px | Padding externo máximo |

---

### 2.4 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 4px | Inputs, checkboxes |
| `radius-md` | 8px | Cards, botões padrão |
| `radius-lg` | 12px | Cards premium, modais |
| `radius-xl` | 16px | Containers grandes |
| `radius-full` | 9999px | Badges, avatars, pills |

---

### 2.5 Sombras

```css
shadow-xs: 0 1px 2px rgba(0,0,0,0.3);
shadow-sm: 0 2px 4px rgba(0,0,0,0.4);
shadow-md: 0 4px 12px rgba(0,0,0,0.5);
shadow-lg: 0 10px 30px rgba(0,0,0,0.6);
shadow-xl: 0 20px 50px rgba(0,0,0,0.7);
shadow-gold: 0 0 30px rgba(212,168,67,0.25); /* Glow dourado premium */
```

---

## 3. Componentes Core

### 3.1 Button

#### Estrutura Base
```tsx
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

#### Variants

**Primary (Gold CTA)**
- Background: `linear-gradient(to right, #d4a843, #e8bc51)`
- Color: `#0a0e1a` (texto escuro sobre dourado)
- Hover: Aumenta brilho, leve translateY (-1px)
- Shadow: `shadow-gold` quando ativo/hover

**Secondary (Outline Gold)**
- Background: transparent
- Border: 2px solid `#d4a843`
- Color: `#d4a843`
- Hover: Fill background com `rgba(212,168,67,0.1)`

**Ghost (Subtle)**
- Background: transparent
- Color: `#94a3b8`
- Hover: Background `rgba(255,255,255,0.05)`

**Sizes**
```css
btn-sm: padding px-3 py-1.5, font-size 13px
btn-md: padding px-5 py-2.5, font-size 15px (padrão)
btn-lg: padding px-8 py-4, font-size 18px
```

---

### 3.2 Card

#### Tipos

**Standard Card**
- Background: `#111827` (slate-900)
- Border: 1px `#1f2937` (slate-800)
- Padding: 24px
- Border-radius: 12px
- Hover: border-color muda para `rgba(212,168,67,0.3)`

**Premium Gold Card**
- Background: `#111827`
- Border: 1px `rgba(212,168,67,0.4)`
- Box-shadow: `0 0 40px rgba(212,168,67,0.15)` + glow radial no fundo
- Padding: 32px

**Glass Card**
- Background: `rgba(17,24,39,0.8)` com backdrop-blur(12px)
- Border: 1px `rgba(255,255,255,0.1)`
- Usado para overlays flutuantes

**Header Structure**
```tsx
<div className="card-header">
  <div className="header-icon">{icon}</div>
  <h3 className="header-title">{title}</h3>
  <button className="header-action">{action}</button>
</div>
```

---

### 3.3 Badge

```tsx
type BadgeVariant = 'default' | 'gold' | 'success' | 'warning' | 'error' | 'ocean' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

**Visual Properties**
- Container: pill shape (`rounded-full`)
- Padding vertical: 4px, horizontal: 12px
- Font: Inter medium, 12-13px
- Border: 1px sólido na cor do variant

**Gold Badge**
- Background: `rgba(212,168,67,0.12)`
- Border: `rgba(212,168,67,0.3)`
- Color: `#d4a843`

---

### 3.4 Input & Form Fields

```tsx
interface FieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea';
  error?: string;
  helperText?: string;
  required?: boolean;
}
```

**Styling**
- Background: `#0a0e1a`
- Border: 1px `#1f2937`
- Border-radius: 8px
- Padding: 12px 16px
- Focus: border-color muda para `#d4a843` com box-shadow gold
- Label: font-caption uppercase tracking-wide, color slate-400
- Error state: border red-500, label text red-400

---

### 3.5 Navigation Elements

**Top Nav Bar**
- Height: 64px fixo
- Background: rgba(17,24,39,0.9) com backdrop-blur(16px)
- Border-bottom: 1px solid rgba(255,255,255,0.06)
- Z-index: 100

**Logo Mark**
- Dimensões: 32x32px ou 40x40px
- Background: gradiente linear gold-400 para amber-200
- Ícone letra "O" (Origin) centralizado, bold
- Margin-right: 12px

**Nav Links**
- Active: text-gold-500, bottom border 2px gold-500, bg gold-500/10
- Inactive: text-slate-400, hover text-slate-200

---

### 3.6 Diagnostic Orbits Visuals

Cada item do Método MAPA tem um ícone correspondente:

| Órbita | Ícone | Cor | Descrição |
|--------|-------|-----|-----------|
| 01 Corporativa | Shield | Gold | Holding, caixa empresa, estrutura societária |
| 02 Patrimonial | TrendingUp | Ocean | Ativos, blindagem, proteção jurídica |
| 03 Sucessória | Award | Emerald | Legado, governança familiar, perpetuidade |

---

## 4. Padrões de Layout

### 4.1 Grid Principal

**Container max-width responsivo**
- Mobile: 100% padding-left/right 16px
- Tablet: max-w-2xl
- Desktop: max-w-7xl (1280px)

**Gutter columns**
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3-4 colunas dependendo do conteúdo

### 4.2 Seções Hero

**Estrutura típica do Diagnóstico:**
```
[Badge small gold]
[Display title] — 2-4 linhas, texto grande
[Subtitle body] — 1-2 parágrafos, tamanho md
[CTA Primary button] — centralizado, grande
[Microlabel] — gray, abaixo do CTA
```

**Background hero pattern:**
- Gradient radial sutil no topo: `radial-gradient(ellipse_at_top, rgba(212,168,67,0.08), transparent 60%)`

---

### 4.3 Checklist/Método MAPA Grid

```
Item 01 — Título | Descrição breve
Item 02 — Título | Descrição breve
Item 03 — Título | Descrição breve
```

- Cada item: min-height 72px, align items center, gap 16px
- Número: badge gold com font-mono font-bold
- Texto: font-body, color slate-200 para título, slate-400 para descrição

---

## 5. Animações & Transições

### Durations
- `transition-fast`: 150ms ease-out (micro-interações)
- `transition-base`: 250ms ease-out (hover states padrão)
- `transition-slow`: 400ms ease-out (transições de página/modal)

### Easing Curves
- Default: `ease-in-out`
- Snappy: `cubic-bezier(0.4, 0, 0.2, 1)`
- Spring-like: `cubic-bezier(0.34, 1.56, 0.64, 1)` para feedbacks visuais

### Keyframes Disponíveis
```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes pulse-gold {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 6. Diretrizes Específicas do Método MAPA

### As 3 Órbitas (Navegação de Seções)

**Órbita 01 — Gestão Estratégica (Corporativa)**
- Contexto: Foco em quem tem empresa
- Problema: Caixa misturado com patrimônio pessoal
- Solução Origin: Separar caixa empresarial do patrimônio familiar

**Órbita 02 — Alavancagem (Patrimonial)**
- Contexto: Patrimônio acumulado sem estratégia
- Problema: Rendimentos subindo mas desprotegidos
- Solução Origin: Blindagem jurídica + alocação inteligente

**Órbita 03 — Liberdade Real (Sucessória)**
- Contexto: Quase lá, mas legado inseguro
- Problema: O que acontece após você?
- Solução Origin: Governança familiar + planejamento sucessório

### Linguagem Visual por Fase do Funil

| Fase | Elementos Visuais | Tom |
|------|-------------------|-----|
| Topo (Diagnóstico) | Hero display grande, CTA gold proeminente | Impactante |
| Meio (Conscientização) | Mapa das 3 órbitas, checklist | Educativo |
| Fundo (Decisão) | Prova social, resultados tangíveis | Confiável |

---

## 7. Regras de Implementação

### Para Desenvolvedores Front-end
1. Sempre use as classes Tailwind definidas neste documento (não crie cores manualmente)
2. Use os tokens CSS para customizações específicas fora do Tailwind
3. Adicione novos componentes apenas seguindo este padrão de nomenclatura: `origin-[componente]-[variação]`
4. Mantenha a hierarquia tipográfica rigorosamente
5. Gold é cor de destaque: usar máximo 10-15% da interface ativa

### Para Designer/Criador de Conteúdo
1. Badges de status só usam o espectro definido (gold/ocean/emerald/amber/red)
2. Títulos seguem a hierarquia Display → Heading → Body → Caption
3. Espaçamentos respeitam a escala de 4px base
4. Ilustrações/ícones são outline ou gradient sutil, nunca flat colors saturados

### Checklist de QA antes de Deploy
- [ ] Todas as cores usam tokens definidos
- [ ] Badges de estado têm contrastes válidos WCAG AA
- [ ] Botões primários têm shadow-gold aplicado
- [ ] Responsividade funciona até 375px de largura
- [ ] States de hover/focus/disabled estão implementados
- [ ] Tipografia segue a hierarquia estabelecida
- [ ] Animações respeitam prefers-reduced-motion

---

## 8. Referência Rápida (Cheat Sheet)

```tsx
// BOTÕES
<Button variant="primary">Iniciar Diagnóstico</Button>
<Button variant="secondary">Ver Métodos</Button>
<Button variant="ghost">Cancelar</Button>

// BADGES
<Badge variant="gold">Diagnóstico Patrimonial</Badge>
<Badge variant="success">Em análise</Badge>
<Badge variant="warning">Revisão pendente</Badge>

// CARDS
<Card>Premium card content</Card>
<Card variant="premium">Conteúdo destacado</Card>
<Card variant="glass">Overlay glassmorphism</Card>

// INPUTS
<Field label="Faturamento Mensal" type="number" />
<Field label="Estágio" type="select" options={ [... ] } />

// TIPOGRAFIA
<p className="font-display">Hero Title</p>
<p className="font-heading">Section Title</p>
<p className="font-body">Body copy goes here</p>
<p className="font-caption">Status or metadata</p>
```

---

*Documento mantido pelo agente Origin Design System Agent v1.0.0*
*Última atualização: 2026-11-13*
*Link de referência: https://origingroup.com.br/*