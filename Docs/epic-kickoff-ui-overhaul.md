# Guia de Identidade Visual — Velocity Agency OS

> **Versão**: 2.0  
> **Atualizado**: 09 jan 2026  
> **Objetivo**: Design profissional, minimalista e menos colorido

---

## Paleta de Cores Principal

### Cores da Marca (do logo)
```css
--primary: hsl(163, 88%, 25%);        /* Verde Velocity #0e7360 */
--foreground: hsl(215, 25%, 17%);     /* Texto principal - cinza escuro */
--muted-foreground: hsl(220, 9%, 46%);/* Texto secundário */
--border: hsl(214, 32%, 91%);         /* Bordas sutis */
--card: hsl(0, 0%, 100%);             /* Fundo de cards - branco */
--background: hsl(0, 0%, 98%);        /* Fundo da página - off-white */
```

### Regra de Uso de Cores
| Tipo | Quando Usar | Quando NÃO Usar |
|------|-------------|-----------------|
| **Verde Primary** | Ações principais, links, elementos ativos | Decoração, fundos de seção |
| **Cores de Status** | Indicadores de saúde (ok/warn/risk) | Bordas, textos normais |
| **Neutros** | Textos, bordas, fundos | — |

---

## Regras de Estilo Obrigatórias

### 1. Bordas
- ✅ `rounded-lg` (8px) ou `rounded-xl` (12px)
- ❌ NUNCA `rounded-3xl` ou `rounded-full` em cards

### 2. Sombras
- ✅ `shadow-sm` ou nenhuma sombra
- ❌ NUNCA `shadow-xl`, `shadow-2xl` ou glow effects

### 3. Cores Semânticas
- ✅ Usar APENAS para estados (sucesso/erro/warning)
- ❌ NUNCA para decoração visual

### 4. Ícones
- ✅ Lucide icons em cor `muted-foreground`
- ❌ NUNCA emojis como ícones de interface

### 5. Tipografia
- ✅ Pesos: `font-medium` (450) e `font-semibold` (600)
- ❌ NUNCA `font-black` ou `font-extrabold`

### 6. Gradientes
- ✅ Gradientes sutis (10-20% opacity)
- ❌ NUNCA gradientes vibrantes ou rainbow

---

## Responsividade

### Breakpoints
```
sm: 640px   → Smartphones landscape
md: 768px   → Tablets
lg: 1024px  → Laptops
xl: 1280px  → Desktops
```

### Padrões de Grid
```tsx
// Cards de KPIs
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

// Cards de Itens
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Formulários
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

### Tipografia Responsiva
| Elemento | Mobile | Desktop | Classes |
|----------|--------|---------|---------|
| Título página | 20px | 24px | `text-xl lg:text-2xl` |
| Título seção | 16px | 18px | `text-base lg:text-lg` |
| Título card | 14px | 16px | `text-sm lg:text-base` |
| Labels | 10px | 12px | `text-[10px] lg:text-xs` |

---

## Componentes Padrão

### Card Padrão
```tsx
<Card className="rounded-xl border-border bg-card">
  <CardHeader className="p-4 border-b border-border">
    <div className="p-2 rounded-lg bg-muted">
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
    <CardTitle className="text-base font-semibold">Título</CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    {/* Conteúdo */}
  </CardContent>
</Card>
```

### Badge de Status
```tsx
// Usar cores neutras com indicador colorido pequeno
<Badge className="bg-muted text-foreground border-border">
  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
  Status
</Badge>
```

### Ícone de Seção
```tsx
// Uniforme para todos os cards
<div className="p-2 rounded-lg bg-muted">
  <Icon className="h-5 w-5 text-muted-foreground" />
</div>
```

---

## Checklist de Verificação

Antes de finalizar qualquer componente, verificar:

- [ ] Nenhum `rounded-3xl` no código
- [ ] Nenhum `shadow-2xl` ou `shadow-xl`
- [ ] Nenhum emoji como ícone
- [ ] Bordas usando `rounded-lg` ou `rounded-xl`
- [ ] Cores usadas apenas para status, não decoração
- [ ] Ícones em `muted-foreground` (cinza)
- [ ] Tipografia usando `font-medium` ou `font-semibold`

---

## Comandos de Validação

```bash
# Buscar por arredondamentos excessivos
grep -r "rounded-3xl" src/

# Buscar por sombras excessivas
grep -r "shadow-2xl\|shadow-xl" src/

# Buscar por glow effects
grep -r "shadow-\[0_0" src/

# Buscar por emojis
grep -rE "[🎫📊💰📈👥🎯🛒⭐🚀]" src/
```

---

## Resumo: Design Minimalista

> O objetivo é um design **profissional**, **limpo** e **focado em produtividade**.
> 
> - Verde apenas onde necessário (primary actions)
> - Cores de status apenas para indicadores
> - Interface majoritariamente neutra (cinzas e brancos)
> - Sem elementos decorativos desnecessários
