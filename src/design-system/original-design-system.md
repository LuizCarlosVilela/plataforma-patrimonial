# Origin Design System

## Brand Overview
**Origin** — Plataforma de Diagnóstico e Gestão Patrimonial
- **Posicionamento**: Construtor → Governante (Método MAPA)
- **Aesthetic**: Luxury wealth management, dark mode premium, gold accents
- **Target**: Empresários e profissionais de alta renda

---

## Design Tokens

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `origin-background` | `#0a0e1a` | Fundos principais, dark slate |
| `origin-surface` | `#111827` | Cards, surfaces overlay |
| `origin-border` | `#1f2937` | Bordas, divisórias |
| `origin-gold` | `#d4a843` | Acentos premium, hover states |
| `origin-gold-light` | `#f5e9e4` | Estados claros, hover |
| `origin-ocean` | `#0ea5e9` | Ações, links, highlights |
| `origin-ocean-light` | `#e0f2fe` | Fundos de estado leve |
| `origin-success` | `#22c55e` | Métricas positivas |
| `origin-warning` | `#f59e0b` | Avisos, alerts |
| `origin-error` | `#ef4444` | Erros, valores negativos |

### Typography
| Token | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| `font-display` | "Geist Sans", system-ui | 3xl (2xl+) | 700 | 1.1 |
| `font-heading` | "Geist Sans", system-ui | 2xl (1.5xl+) | 600 | 1.2 |
| `font-body` | "Geist Sans", system-ui | base (1rem) | 400 | 1.5 |
| `font-small` | "Geist Sans", system-ui | sm (0.875rem) | 500 | 1.4 |
| `font-mono` | "Geist Mono", monospace | - | - | - |

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `space.0` | 0.25rem (4px) | - |
| `space.1` | 0.5rem (8px) | - |
| `space.2` | 1rem (16px) | Section padding |
| `space.3` | 1.5rem (24px) | Component spacing |
| `space.4` | 2rem (32px) | Large gaps |
| `space.5` | 3rem (48px) | Section margins |
| `space.6` | 4rem (64px) | Page gaps |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius.sm` | 0.125rem (2px) | Inputs, small elements |
| `radius.md` | 0.25rem (4px) | Cards, buttons |
| `radius.lg` | 0.5rem (8px) | Modals, premium cards |
| `radius.full` | 9999px | Avatars, badges |

### Shadow Scale
| Token | CSS | Usage |
|-------|-----|-------|
| `shadow.sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Hover states |
| `shadow.md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Cards |
| `shadow.lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Modals |
| `shadow.gold` | `0 0 20px rgba(212, 168, 67, 0.3)` | Gold glow effects |

---

## Component Library

### 1. Button

#### Primary
```tsx
<button className="origin-button origin-button-primary">
  Caminhar para Diagnóstico
</button>
```

**Styles**:
- Background: `origin-gold`
- Color: `#0a0e1a` (slate-950)
- Hover: `origin-gold-light`
- Active: `shadow-gold` + transform scale(0.98)
- Disabled: `opacity-50`, cursor-not-allowed

#### Secondary
```tsx
<button className="origin-button origin-button-secondary">
  Voltar
</button>
```

**Styles**:
- Background: transparent
- Border: 2px solid `origin-gold`
- Color: `origin-gold`
- Hover: background `origin-gold/5`
- Active: `shadow-gold`

#### Tertiary
```tsx
<button className="origin-button origin-button-text">
  Fechar
</button>
```

**Styles**:
- Background: transparent
- Color: `origin-border`
- Hover: `origin-gold/20`

#### Sizes
| Class | Padding | Font |
|-------|---------|------|
| `btn-sm` | `px-3 py-1.5` | `font-small` |
| `btn-md` | `px-5 py-2` | `font-body` |
| `btn-lg` | `px-8 py-3` | `font-heading` |

### 2. Card

#### Base
```tsx
<div className="origin-card">
  Conteúdo do card
</div>
```

**Styles**:
- Background: `origin-surface`
- Border: 1px solid `origin-border`
- Border radius: `radius.md`
- Padding: `space.4`
- Shadow: `shadow.md`

#### Gold-featured
```tsx
<div className="origin-card origin-card-gold">
  Conteúdo premium
</div>
```

**Additional Styles**:
- Border: 1px solid `origin-gold/30`
- Box shadow: `shadow-gold` (soft glow)

### 3. Badge

#### Default
```tsx
<span className="origin-badge">
  Em análise
</span>
```

**Styles**:
- Background: `origin-surface/50`
- Color: `origin-gold`
- Border: 1px solid `origin-gold/30`
- Border radius: `radius.full`
- Font size: `font-small`
- Padding: `px-3 py-1`

#### Status Variants
| Variant | Background | Border |
|---------|-----------|--------|
| `success` | `rgba(34, 197, 94, 0.15)` | `rgba(34, 197, 94, 0.3)` |
| `warning` | `rgba(245, 158, 11, 0.15)` | `rgba(245, 158, 11, 0.3)` |
| `error` | `rgba(239, 68, 68, 0.15)` | `rgba(239, 68, 68, 0.3)` |
| `gold` | `rgba(212, 168, 67, 0.15)` | `rgba(212, 168, 67, 0.3)` |
| `ocean` | `rgba(14, 165, 233, 0.15)` | `rgba(14, 165, 233, 0.3)` |

### 4. NavLink

```tsx
<NavLink to="/diagnostico" className="origin-nav-link">
  Diagnóstico
</NavLink>
```

**Styles**:
- Active: `text-origin-gold`, `border-b origin-gold`, `origin-gold/20` bg bottom
- Inactive: `text-origin-border`, hover: `text-origin-gold`
- Padding: `py-3`, border bottom transparent by default

### 5. Input

```tsx
<input type="number" className="origin-input" />
```

**Styles**:
- Background: `origin-surface`
- Border: 1px solid `origin-border`
- Color: `origin-foreground`
- Padding: `space.3`
- Border radius: `radius.sm`
- Focus: `outline-none`, border `origin-gold`, box `shadow-gold`

### 6. Header Hero

```tsx
<header className="origin-hero">
  <h1>Quanto do que você fatura virou patrimônio seu?</h1>
  <p>Diagnóstico em 3 minutos</p>
  <NavLink to="/diagnostico" className="origin-button origin-button-primary">
    Começar diagnóstico
  </NavLink>
</header>
```

**Layout**:
- Max width: `max-w-5xl`
- Margin: `auto`
- Padding: `space.6` no topo, `space.4` base
- Text alignment: center
- Text color: `text-origin-foreground`
- Heading size: `font-display`, `font-heading` respectively

### 7. Checklist Item

```tsx
<div className="origin-checklist-item">
  <span className="origin-badge origin-badge-gold">✓</span>
  <span>Gestão estratégica da empresa</span>
</div>
```

**Layout**:
- Min height: `min-h-16`
- Align items: center
- Gap: `space.2`
- Padding: `space.3`
- Background: `origin-surface/50`
- Border radius: `radius.md`

### 8. Calculator Form

```tsx
<form className="origin-calculator">
  <div className="origin-input-group">
    <label>Faturamento mensal</label>
    <input type="number" className="origin-input" />
  </div>
  <div className="origin-input-group">
    <label>Tempo de empresa (anos)</label>
    <input type="number" className="origin-input" />
  </div>
  <button type="submit" className="origin-button origin-button-primary">
    Calcular diagnóstico
  </button>
</form>
```

**Layout**:
- Gap: `space.4` between groups
- Max width: `max-w-2xl`
- Margin: `auto`

---

## Layout Structure

### Page Skeleton
```html
<body className="font-origin origin-background origin-text-foreground">
  <header className="origin-header">
    <NavLink ...>...</NavLink>
    <NavLink ...>...</NavLink>
  </header>
  
  <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
    <!-- Conteúdo da página -->
  </main>
  
  <footer className="origin-footer pt-12 pb-8">
    <!-- Footer -->
  </footer>
</body>
```

### Section Pattern
```tsx
<section className="origin-section">
  <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
    <!-- Conteúdo -->
  </div>
</section>
```

### Section Spacing
- Above: `py-12` (space.6)
- Below: `py-12` (space.6)
- Inner: `px-4 md:px-6 lg:px-8`

---

## Color Application Examples

### Gold Accent (Primary)
```css
.text-origin-gold { color: #d4a843; }
.bg-origin-gold { background: #d4a843; }
.border-origin-gold { border: 1px solid #d4a843; }
```

### Ocean Accent (Secondary)
```css
.text-origin-ocean { color: #0ea5e9; }
.bg-origin-ocean { background: #0ea5e9; }
```

### Neutral States
```css
.text-origin-foreground { color: #f1f5f9; } /* slate-100 */
.text-origin-muted { color: #6b7280; } /* slate-400 */
.bg-origin-background { background: #0a0e1a; }
-bg-origin-surface { background: #111827; }
```

### Glass Effect
```css
.backdrop-blur-xl bg-slate-900/80 border border-slate-700/50
```

### Gradient Text (Gold)
```css
.gold-gradient-text {
  background: linear-gradient(135deg, #d4a843, #f5d7c9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Component Specification Table

| Component | Variants | Key Styles |
|-----------|----------|------------|
| `origin-button` | primary, secondary, tertiary, text | gold bg, ocean accent, glass states |
| `origin-card` | base, gold, elevated | surface, gold border, shadows |
| `origin-badge` | default, success, warning, error, gold, ocean | rounded-full, surface bg |
| `origin-nav-link` | active, inactive, hover | border-bottom, text color |
| `origin-input` | default, focused | surface, gold focus ring |
| `origin-hero` | center, left | display typography, CTA button |
| `origin-checklist` | numbered, icon+text | surface/50, gold accent |
| `origin-calculator` | form layout | grid inputs, primary CTA |

---

## Usage Guidelines

### Color Usage
- **Gold**: Primary actions, highlights, premium elements - use sparingly (max 10% of UI)
- **Ocean**: Secondary actions, links, supports - 15% of UI
- **Neutral**: Backgrounds, surfaces, text - 75% of UI
- Never use pure white (#fff) on dark backgrounds - always use warm off-white

### Typography Hierarchy
- Headings: `font-display` (700 weight) for primary, `font-heading` (600) for secondary
- Body: `font-body` (400) for readability at small sizes
- Captions/labels: `font-small` (500) with tracking

### Spacing System
- Use the scale consistently - never arbitrary values
- Page layout: `space.6` between major sections
- Component: `space.3` to `space.4` internal spacing
- Inline: `space.1` to `space.2` between related elements

### Interaction States
- **Hover**: Background opacity + subtle shadow
- **Active**: Scale 0.98 + inset shadow
- **Focus**: Outline removal + gold ring + shadow
- **Disabled**: 50% opacity + cursor-not-allowed

---

## Origin Design System Agent

This design system is now available as a reusable agent for the Origin brand. The agent can:

1. **Generate new components** following Origin tokens and patterns
2. **Audit existing code** for design system compliance
3. **Convert Figma designs** to Origin-compliant code
4. **Update design tokens** when brand evolution occurs
5. **Create new page layouts** using the established section patterns

### Agent Invocation
```bash
# Create a new Origin-branded component
orca agent create --type design-system --brand Origin --task "Create premium dashboard component with gold accents"

# Audit current codebase for compliance
orca agent run --type design-system --brand Origin --check-compliance

# Generate a new page following Origin patterns
orca agent run --type design-system --brand Origin --generate-page "/accounts" "Lista de contas"
```

### Design Token Reference File
The complete design tokens are available in `/src/design-system/`:
- `tokens.css` - CSS custom properties
- `tokens.json` - JSON format for tooling
- `components/` - Component specifications
- `patterns/` - Layout patterns and section structures

---

## Migration from Carvalho Group

This Origin design system evolved from the Carvalho Group luxury aesthetic previously implemented, adapting the dark-slate/gold/ocean palette to the new brand positioning of **Construtor → Governante** with the **Método MAPA** framework.

**Key adaptations:**
- Darker background (`#0a0e1a` vs previous slate)
- Richer gold with warm tones (`#d4a843`)
- Ocean accent for technological/modern feel (`#0ea5e9`)
- Added MAPA orbit visual language
- Diagnostic-focused component suite

---