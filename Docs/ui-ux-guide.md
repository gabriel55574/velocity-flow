# Master Guide: UI/UX & Design System (v3.0)

> **Visão Integrada**: Unindo os fundamentos teóricos de UX (Heurísticas de Nielsen, Tendências 2026) com a execução prática de alta performance (Linear/Vercel Style).

---

## 1. Manifesto de Design 2026: O Que Buscamos

Nosso objetivo não é apenas "ficar bonito". É criar um sistema **moderno, ético e eficiente** que respeite o tempo e a inteligência do usuário.

### 1.1 Minimalismo Funcional (Tendência 2026)
> *Referência: `docs/fundamento UI e UX`*
- **O que é**: Reduzir a carga cognitiva. Cada elemento na tela deve ter um propósito claro.
- **Ação**: Eliminar "decoração" (ícones de fundo, texturas) que não aporta informação.
- **Benefício**: Sustentabilidade digital (menos dados/processamento) e foco total na tarefa.

### 1.2 Estética "Liquid Glass" & Microinterações Significativas
- **O que é**: Superfícies sutis e feedback tátil que confirmam ações sem gritar.
- **Ação**: Usar `backdrop-blur` (vidro) com moderação e transições suaves (200ms) para hover/active.
- **Regra**: A animação deve informar (ex: botão de salvar vira check), não apenas "enfeitar".

### 1.3 Acessibilidade como Padrão (Não Opcional)
- **O que é**: Design inclusivo desde o código.
- **Ação**: Contraste rigoroso (WCAG AA), suporte a navegação por teclado e labels descritivos.
- **Impacto**: Um produto profissional é um produto que todos podem usar.

---

## 2. Fundamentos Teóricos (Aplicados)

Baseado nas **10 Heurísticas de Nielsen** e princípios de Neurodesign.

### 2.1 Visibilidade do Status do Sistema
*O usuário sempre sabe o que está acontecendo.*
- **Kickoff Atual**: O botão de salvar às vezes não dá feedback claro.
- **Solução**: Botões com estado de `loading` e toast de sucesso imediato.

### 2.2 Correspondência com o Mundo Real
*Fale a linguagem do usuário.*
- **Kickoff Atual**: Termos técnicos de dev mistura com negócio.
- **Solução**: Labels humanizados ("Onde seu cliente está?" vs "Canais de Aquisição").

### 2.3 Estética e Design Minimalista
*Menos é mais.*
- **Kickoff Atual**: "Arco-íris" de cores nos cards de OKR compete pela atenção.
- **Solução**: Paleta monocromática com uso intencional de cor apenas para destacar o atípico/importante.

### 2.4 Reconhecimento em vez de Memorização
*Minimize a carga de memória do usuário.*
- **Kickoff Atual**: Dados truncados (...) forçam o usuário a clicar para ver.
- **Solução**: Layout fluido que sempre mostra o dado completo (Faturamento, Lucro).

---

## 3. Diretrizes de Execução (SaaS Premium)

Para atingir o nível "Stripe/Linear", aplicaremos estas regras visuais estritas:

### 3.1 Sistema de Cores (Semântica Ética)
Evitar a fadiga visual e padrões viciantes.
- **Primary**: `hsl(221, 83%, 53%)` (Foco)
- **Background**: `hsl(var(--background))` (Respiro)
- **Surface**: `hsl(var(--card))` (Conteúdo)
- **Muted**: `hsl(var(--muted-foreground))` (Labels)
- **Erro/Sucesso**: Usados APENAS para estados críticos, não para colorir a tela.

### 3.2 Tipografia & Hierarquia
Legibilidade acima de tudo.
- **H1/H2**: Plus Jakarta Sans (Personalidade)
- **Body/UI**: Inter (Legibilidade técnica)
- **Regra**: Nunca usar `truncate` em dados financeiros. Se não cabe, o design do card deve mudar (quebra de linha ou card maior).

### 3.3 Microinterações & Feedback
- **Hover**: Mudança sutil de background (`bg-muted/50`) ou borda (`border-primary/50`).
- **Active**: Escala imperceptível (`scale-[0.98]`) para sensação tátil.
- **Transition**: `duration-200 ease-out`.

---

## 4. Auditoria & Plano de Ação (Kickoff Module)

### Passo 1: Limpeza "Minimalismo Funcional" (OKRsStep.tsx)
- [ ] **Remover ruído**: Retirar ícones gigantes de fundo e barras laterais coloridas.
- [ ] **Refatorar Cards**: Transformar em superfícies limpas (`bg-card border-border`) com sombra mínima.
- [ ] **Fix de Dados**: Ajustar font-size para garantir leitura total de "R$ 120.000,00".

### Passo 2: Acessibilidade & Layout (PersonasStep.tsx)
- [ ] **Header Semântico**: Alinhar Nome e Badge (outline) verticalmente.
- [ ] **Contraste**: Garantir que textos em badges tenham contraste suficiente (ex: `amber-700` em `amber-50`).
- [ ] **Ícones**: Substituir emojis por ícones Lucide consistentes (`User`, `Target`, `Zap`).

### Passo 3: Consistência Global (BusinessModel & Reviews)
- [ ] **Bordas**: Padronizar `rounded-lg` (8px) ou `rounded-xl` (12px) globalmente. Não misturar.
- [ ] **Botões**: Um único estilo para ações primárias (sem gradientes excessivos).
- [ ] **Scroll**: Garantir `overflow-y-auto` em todos os dialogs para evitar bloqueio.

---

## 5. Exemplo de Código (O "Padrão Ouro")

```tsx
// Exemplo de um Card de Métrica alinhado com 2026 Trends
// - Acessível (cores, contraste)
// - Minimalista Funcional (sem decoração inútil)
// - Microinteração (hover sutil)

export function MetricCard({ label, value, trend }: MetricProps) {
  return (
    <div className="
      group relative overflow-hidden rounded-xl border border-border bg-card p-5
      transition-all duration-200 ease-out
      hover:border-primary/20 hover:shadow-sm
    ">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-xs font-medium",
              trend > 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
      
      {/* Microinteração de feedback visual on hover (Sutil) */}
      <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/[0.02]" />
    </div>
  )
}
```
