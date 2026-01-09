# 📘 Guia de Implementação — Velocity Agency OS

**Última atualização:** 09 jan 2026  
**Propósito:** Documentação técnica completa para continuidade do projeto por qualquer AI ou desenvolvedor.

---

## 🎯 Sobre Este Documento

Este documento serve como **fonte única de verdade** para o projeto Velocity Agency OS. Ele contém:

1. **Arquitetura atual** — como o projeto está estruturado
2. **O que já foi implementado** — com detalhes técnicos
3. **Padrões e convenções** — como escrever código neste projeto
4. **Dependências e integrações** — o que está instalado e configurado
5. **Changelog de implementação** — histórico de mudanças

> ⚠️ **IMPORTANTE:** Sempre atualize este documento ao fazer qualquer implementação significativa.

---

## 1) Stack Tecnológica

### Frontend (Implementado)
| Tecnologia | Versão | Status | Uso |
|------------|--------|--------|-----|
| Vite | 5.4.19 | ✅ Configurado | Build tool |
| React | 18.3.1 | ✅ Configurado | UI Framework |
| TypeScript | 5.8.3 | ✅ Configurado | Tipagem estática |
| TailwindCSS | 3.4.17 | ✅ Configurado | Estilização |
| shadcn/ui | - | ✅ 51 componentes | Componentes UI |
| TanStack Query | 5.83.0 | ✅ Configurado | Data fetching |
| React Router DOM | 6.30.1 | ✅ Configurado | Roteamento |
| React Hook Form | 7.61.1 | ✅ Instalado | Formulários |
| Zod | 3.25.76 | ✅ Instalado | Validação |
| Recharts | 2.15.4 | ✅ Usado | Gráficos |
| Framer Motion | 12.25.0 | ✅ Instalado | Animações |
| Lucide React | 0.462.0 | ✅ Usado | Ícones |
| date-fns | 3.6.0 | ✅ Instalado | Datas |

### Backend (Parcialmente Implementado)
| Tecnologia | Status | Próximo passo |
|------------|--------|---------------|
| Supabase Client | ✅ Instalado | — |
| Database Schema | ✅ 21 tabelas deployed | — |
| RLS Policies | ✅ 23 policies ativas | — |
| Supabase Auth | ❌ Não configurado | Integrar no Login.tsx |
| Supabase Storage | ❌ Não configurado | Configurar buckets |
| Edge Functions | ❌ Não existe | Criar pasta `/supabase/functions` |

---

## 2) Estrutura de Diretórios

```
velocity-flow/
├── src/
│   ├── App.tsx                    # Roteamento principal (React Router)
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # CSS global + variáveis + design system
│   ├── App.css                    # Estilos específicos do App
│   │
│   ├── components/
│   │   ├── ui/                    # 51 componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── glass-card.tsx     # Componente customizado (glassmorphic)
│   │   │   ├── status-badge.tsx   # Componente customizado (health status)
│   │   │   ├── tabs.tsx
│   │   │   └── ... (48 outros)
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Layout wrapper principal
│   │   │   ├── AppSidebar.tsx     # Sidebar de navegação
│   │   │   ├── MobileNav.tsx      # Navegação mobile (bottom bar)
│   │   │   └── PageHeader.tsx     # Header de páginas
│   │   │
│   │   ├── dashboard/
│   │   │   ├── TodayDashboard.tsx # Dashboard "Today" principal
│   │   │   ├── ActionCard.tsx     # Cards de ação
│   │   │   ├── ClientHealthCard.tsx # Cards de saúde do cliente
│   │   │   └── MetricCard.tsx     # Cards de métricas
│   │   │
│   │   ├── clients/
│   │   │   ├── ClientsList.tsx    # Lista de clientes
│   │   │   └── ClientWorkspace.tsx # Workspace com 10 abas
│   │   │
│   │   ├── client-portal/
│   │   │   └── ClientLayout.tsx   # Layout do portal do cliente
│   │   │
│   │   ├── auth/
│   │   │   └── AuthLayout.tsx     # Layout para páginas de auth
│   │   │
│   │   └── shared/
│   │       ├── EmptyState.tsx     # Estado vazio padrão
│   │       └── SkeletonCard.tsx   # Loading skeleton
│   │
│   ├── pages/
│   │   ├── Index.tsx              # Página inicial (TodayDashboard)
│   │   ├── Clients.tsx            # Lista de clientes
│   │   ├── ClientDetail.tsx       # Detalhe do cliente (ClientWorkspace)
│   │   ├── Calendar.tsx           # Calendário de eventos
│   │   ├── Reports.tsx            # Relatórios e dashboards
│   │   ├── Playbooks.tsx          # Biblioteca de playbooks
│   │   ├── Settings.tsx           # Configurações (com sub-tabs)
│   │   ├── NotFound.tsx           # 404
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.tsx          # Login (mock, sem Supabase)
│   │   │   └── ResetPassword.tsx  # Reset de senha (mock)
│   │   │
│   │   └── client/                # Portal do cliente
│   │       ├── Dashboard.tsx      # Dashboard do cliente
│   │       ├── Approvals.tsx      # Aprovações pendentes
│   │       ├── Assets.tsx         # Upload de ativos
│   │       └── Reports.tsx        # Relatórios do cliente
│   │
│   ├── data/
│   │   └── mockData.ts            # TODOS os dados mock centralizados
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Detecta se é mobile
│   │   └── use-toast.ts           # Hook de toast notifications
│   │
│   └── lib/
│       └── utils.ts               # Utilitários (cn, etc.)
│
├── Docs/
│   ├── prompt_inicial.md          # Especificação completa do projeto
│   ├── pendencias_de_implementacao_velocity_agency_os.md    # Pendências v1
│   ├── pendencias_de_implementacao_velocity_agency_os_v2.md # Pendências v2
│   └── implementacao.md           # ESTE DOCUMENTO
│
├── public/
├── components.json                # Configuração shadcn/ui
├── tailwind.config.ts             # Configuração Tailwind
├── vite.config.ts                 # Configuração Vite
├── tsconfig.json                  # Configuração TypeScript
└── package.json                   # Dependências
```

---

## 3) Rotas Implementadas

### App.tsx — Roteamento Principal

```typescript
// Agency Portal
<Route path="/" element={<Index />} />                    // Dashboard Today
<Route path="/clients" element={<Clients />} />           // Lista de clientes
<Route path="/clients/:id" element={<ClientDetail />} />  // Workspace do cliente
<Route path="/calendar" element={<CalendarPage />} />     // Calendário
<Route path="/reports" element={<Reports />} />           // Relatórios
<Route path="/playbooks" element={<Playbooks />} />       // Playbooks
<Route path="/settings" element={<Settings />} />         // Configurações

// Auth
<Route path="/login" element={<Login />} />
<Route path="/reset-password" element={<ResetPassword />} />

// Client Portal
<Route path="/client/dashboard" element={<ClientDashboard />} />
<Route path="/client/approvals" element={<ClientApprovals />} />
<Route path="/client/assets" element={<ClientAssets />} />
<Route path="/client/reports" element={<ClientReports />} />
```

---

## 4) Design System

### 4.1 CSS Variables (index.css)

```css
:root {
  --background: 220 25% 97%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --primary: 219 85% 51%;
  --secondary: 220 14% 95%;
  --muted: 220 14% 90%;
  --destructive: 0 84% 60%;
  --border: 220 10% 88%;
  --radius: 1rem;

  /* Status / Health */
  --ok: 145 63% 42%;    /* Verde */
  --warn: 38 92% 50%;   /* Amarelo */
  --risk: 0 84% 60%;    /* Vermelho */

  /* Workflow Status */
  --blocked: 0 0% 55%;
  --inprogress: 219 85% 51%;
  --done: 145 63% 42%;
}
```

### 4.2 Componentes Customizados

#### GlassCard (`/components/ui/glass-card.tsx`)
```tsx
// Uso:
<GlassCard>
  <GlassCardHeader>
    <GlassCardTitle>Título</GlassCardTitle>
  </GlassCardHeader>
  <GlassCardContent>
    Conteúdo com efeito glassmorphic
  </GlassCardContent>
</GlassCard>
```

#### StatusBadge (`/components/ui/status-badge.tsx`)
```tsx
// Uso:
<StatusBadge status="ok" />      // Verde
<StatusBadge status="warn" />    // Amarelo
<StatusBadge status="risk" />    // Vermelho
```

---

## 5) Dados Mock (`src/data/mockData.ts`)

### 5.1 Interfaces Disponíveis

```typescript
export interface User { id, name, email, role, avatar?, status }
export interface Client { id, name, niche, phase, health, owner, progress, nextMBR, logo?, businessData }
export interface WorkflowModule { id, title, status, progress, steps, gate? }
export interface WorkflowStep { id, title, description, status, owner, slaHours, checklist }
export interface ChecklistItem { id, title, required, done }
export interface Gate { id, title, status, conditions }
export interface Task { id, title, description, status, priority, owner, dueAt, clientId }
export interface Lead { id, name, phone, source, stage, lastContactAt, notes, clientId }
export interface Creative { id, title, type, status, thumbnail?, scheduledFor?, platform }
export interface Campaign { id, name, platform, objective, status, budgetDaily, spent, leads, cpl }
export interface Approval { id, type, title, description, status, requestedBy, requestedAt, slaDueAt, preview?, clientId }
export interface Asset { id, type, title, status, url? }
export interface Report { id, type, title, period, createdAt, highlights, decisions }
export interface Playbook { id, name, niche, description, modules, scriptsCount, templatesCount }
export interface CalendarEvent { id, title, type, date, time?, clientId?, clientName? }
export interface Note { id, content, createdAt, createdBy, type }
```

### 5.2 Dados Mock Disponíveis

| Constante | Tipo | Quantidade | Uso |
|-----------|------|------------|-----|
| `mockUsers` | User[] | 5 | Usuários da agência |
| `mockClients` | Client[] | 5 | Clientes demo |
| `mockWorkflowModules` | WorkflowModule[] | 10 | Módulos do workflow |
| `mockTasks` | Task[] | 5 | Tarefas do sprint |
| `mockLeads` | Lead[] | 6 | Leads do CRM |
| `mockCreatives` | Creative[] | 5 | Criativos de conteúdo |
| `mockCampaigns` | Campaign[] | 4 | Campanhas de mídia |
| `mockApprovals` | Approval[] | 4 | Aprovações pendentes |
| `mockAssets` | Asset[] | 6 | Ativos do cliente |
| `mockReports` | Report[] | 2 | Relatórios |
| `mockPlaybooks` | Playbook[] | 3 | Playbooks |
| `mockCalendarEvents` | CalendarEvent[] | 6 | Eventos do calendário |
| `mockNotes` | Note[] | 3 | Notas e atas |
| `mockMessageTemplates` | - | 6 | Templates WhatsApp |
| `mockQFD` | - | 1 | Arquitetura de mensagem |
| `mockTrackingChecklist` | - | 7 | Checklist de tracking |
| `mockAccessChecklist` | - | 7 | Checklist de acessos |
| `mockKPIs` | - | 6 | KPIs |

### 5.3 Como Usar os Mocks

```tsx
import { mockClients, mockTasks, mockLeads } from "@/data/mockData";

// Filtrar por cliente
const clientTasks = mockTasks.filter(t => t.clientId === 'cli-001');

// Buscar cliente específico
const client = mockClients.find(c => c.id === clientId);
```

---

## 6) ClientWorkspace — 10 Abas

### Localização: `/src/components/clients/ClientWorkspace.tsx`

### Status de Implementação

| Aba | ID | Ícone | Status | Dados Mock |
|-----|----|-------|--------|------------|
| Overview | `overview` | LayoutDashboard | ✅ Conteúdo | mockKPIs, mockTasks |
| Workflows | `workflows` | GitBranch | ⚠️ Placeholder | mockWorkflowModules |
| Estratégia | `strategy` | Target | ⚠️ Placeholder | mockQFD |
| Operations | `operations` | Play | ⚠️ Placeholder | mockTasks |
| CRM | `crm` | MessageSquare | ⚠️ Placeholder | mockLeads, mockMessageTemplates |
| Content | `content` | Image | ⚠️ Placeholder | mockCreatives |
| Media | `media` | BarChart3 | ⚠️ Placeholder | mockCampaigns |
| Data | `data` | Database | ⚠️ Placeholder | mockTrackingChecklist |
| Approvals | `approvals` | CheckSquare | ⚠️ Placeholder | mockApprovals |
| Assets | `assets` | FolderOpen | ⚠️ Placeholder | mockAssets, mockAccessChecklist |
| Notes | `notes` | FileText | ⚠️ Placeholder | mockNotes |

### Estrutura de Cada Aba

```tsx
const workspaceTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "workflows", label: "Workflows", icon: GitBranch },
  { id: "strategy", label: "Estratégia", icon: Target },
  { id: "operations", label: "Operações", icon: Play },
  { id: "crm", label: "CRM", icon: MessageSquare },
  { id: "content", label: "Conteúdo", icon: Image },
  { id: "media", label: "Mídia", icon: BarChart3 },
  { id: "data", label: "Dados", icon: Database },
  { id: "approvals", label: "Aprovações", icon: CheckSquare },
  { id: "assets", label: "Ativos", icon: FolderOpen },
  { id: "notes", label: "Notas", icon: FileText },
];
```

---

## 7) Padrões de Código

### 7.1 Importações

```tsx
// Componentes UI - usar alias @/
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";

// Dados mock
import { mockClients, Client } from "@/data/mockData";

// Hooks
import { useToast } from "@/hooks/use-toast";

// Lucide icons
import { Users, Settings, Check } from "lucide-react";
```

### 7.2 Componentes de Página

```tsx
export default function NomeDaPagina() {
  return (
    <AppLayout>
      <PageHeader 
        title="Título da Página"
        subtitle="Descrição opcional"
      />
      
      <div className="p-6 space-y-6">
        {/* Conteúdo */}
      </div>
    </AppLayout>
  );
}
```

### 7.3 Estilização

```tsx
// Usar Tailwind classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Glass effect
<div className="backdrop-blur-lg bg-white/70 border border-white/20 shadow-lg rounded-2xl">

// Status colors
<span className="text-emerald-500">OK</span>    // health: ok
<span className="text-amber-500">Atenção</span> // health: warn
<span className="text-red-500">Risco</span>     // health: risk
```

---

## 8) Próximas Implementações (Prioridade)

### P0 — Completar UI das 10 Abas

Para cada aba, criar componentes usando dados mock:

1. **Workflows Tab**
   - `WorkflowTimeline.tsx` — Timeline visual
   - `ModuleCard.tsx` — Card de módulo
   - `GateStatus.tsx` — Indicador de gate

2. **Strategy Tab**
   - `StrategySection.tsx` — Seção colapsável
   - `QFDViewer.tsx` — Visualizador de QFD
   - `BlueprintEditor.tsx` — Editor de blueprint

3. **Operations Tab**
   - `KanbanBoard.tsx` — Kanban To Do/Doing/Done
   - `SprintHistory.tsx` — Histórico de sprints
   - `ChecklistView.tsx` — Visualizador de checklist

4. **CRM Tab**
   - `LeadPipeline.tsx` — Pipeline visual
   - `LeadCard.tsx` — Card de lead
   - `MessageTemplates.tsx` — Templates WhatsApp

5. **Content Tab**
   - `ContentCalendar.tsx` — Calendário editorial
   - `CreativeGrid.tsx` — Grid de criativos
   - `CreativeCard.tsx` — Card de criativo

6. **Media Tab**
   - `CampaignList.tsx` — Lista de campanhas
   - `CampaignMetrics.tsx` — KPIs de campanha
   - `BudgetOverview.tsx` — Visão de budget

7. **Data Tab**
   - `TrackingStatus.tsx` — Status de tracking
   - `ChecklistProgress.tsx` — Progresso do checklist

8. **Approvals Tab**
   - `ApprovalsList.tsx` — Lista de aprovações
   - `ApprovalCard.tsx` — Card de aprovação
   - `ApprovalHistory.tsx` — Histórico

9. **Assets Tab**
   - `AssetInventory.tsx` — Inventário
   - `AccessChecklist.tsx` — Checklist de acessos
   - `UploadArea.tsx` — Área de upload

10. **Notes Tab**
    - `NotesTimeline.tsx` — Timeline de notas
    - `NoteCard.tsx` — Card de nota
    - `NotesSearch.tsx` — Busca

---

## 9) Changelog de Implementação

### 09 jan 2026 — Integração Supabase Backend ✅

- ✅ Instalado `@supabase/supabase-js`
- ✅ Criado `/src/lib/supabase.ts` — Cliente tipado
- ✅ Criado `/src/types/database.ts` — Tipos para 21 tabelas
- ✅ Criado `/supabase/migrations/20260109_initial_schema.sql`
- ✅ Deployed: 21 tabelas, 16 enums, 28 indexes, 5 triggers
- ✅ Habilitado RLS em todas as tabelas
- ✅ Criadas 23 policies de multi-tenancy
- ✅ Função helper `user_agency_id()` para policies
- ✅ Criado `/supabase/seeds/demo_data.sql` (1 agência, 3 clientes, 38 registros)

### 09 jan 2026 — Branding & UI Refinement ✅

- ✅ Integrado `logo.svg` no AppSidebar e AuthLayout
- ✅ Integrado `favicon.svg` no index.html
- ✅ Atualizado CSS para cor primária Velocity Green (#0e7360)
- ✅ Refinado bordas e sombras conforme design guide
- ✅ Criado `Docs/epic-kickoff-ui-overhaul.md` — Guia de design

### 09 jan 2026 — Implementação das 10 Abas do Workspace ✅

- ✅ Criada pasta `/src/components/workspace/`
- ✅ Criado `WorkflowTimeline.tsx` — Timeline visual dos módulos
- ✅ Criado `ModuleCard.tsx` — Card expansível de módulo
- ✅ Criado `GateStatus.tsx` — Indicador de gate pass/fail
- ✅ Criado `StrategyTab.tsx` — QFD, Kickoff, Diagnóstico 360, Blueprint 30/60/90
- ✅ Criado `OperationsTab.tsx` — Kanban Board com TaskCard
- ✅ Criado `CRMTab.tsx` — Pipeline de leads + Templates WhatsApp
- ✅ Criado `ContentTab.tsx` — Grid de criativos + Calendário editorial
- ✅ Criado `MediaTab.tsx` — Cards de campanhas + métricas
- ✅ Criado `DataTab.tsx` — Tracking checklist + dashboards externos
- ✅ Criado `ApprovalsTab.tsx` — Lista de aprovações com ações
- ✅ Criado `AssetsTab.tsx` — Inventário de ativos + checklist de acessos
- ✅ Criado `NotesTab.tsx` — Timeline com busca e filtros
- ✅ Atualizado `ClientWorkspace.tsx` para usar todos os componentes

### Status Atual do Projeto
| Área | Progresso |
|------|-----------|
| UI Components | ✅ 100% |
| Layout/Navegação | ✅ 100% |
| Páginas Agência | ✅ 100% |
| Portal Cliente | ✅ 80% |
| Workspace 10 Abas | ✅ 100% |
| Backend Schema | ✅ 90% |
| Auth Real | ❌ 0% |
| Edge Functions | ❌ 0% |
| n8n Integrações | ❌ 0% |

---

## 10) Regras para Continuar o Projeto

### ✅ FAÇA

1. **Sempre use dados mock** até o backend estar implementado
2. **Atualize este documento** ao implementar qualquer feature
3. **Use componentes shadcn/ui** existentes
4. **Siga o padrão de layout** (AppLayout + PageHeader)
5. **Importe com alias @/** para caminhos
6. **Teste responsividade** (mobile-first)

### ❌ NÃO FAÇA

1. **NÃO crie dados hardcoded** — use mockData.ts
2. **NÃO instale dependências** sem documentar aqui
3. **NÃO altere estrutura de rotas** sem atualizar App.tsx
4. **NÃO crie CSS inline** — use Tailwind classes
5. **NÃO ignore TypeScript errors** — sempre tipar

---

## 11) Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Lint
npm run lint

# Preview do build
npm run preview

# Adicionar componente shadcn
npx shadcn@latest add [componente]
```

---

## 12) Documentos Relacionados

| Documento | Descrição |
|-----------|-----------|
| `prompt_inicial.md` | Especificação completa do projeto |
| `pendencias_de_implementacao_velocity_agency_os.md` | Pendências v1 |
| `pendencias_de_implementacao_velocity_agency_os_v2.md` | Pendências v2 (atualizado) |
| `implementacao.md` | **ESTE DOCUMENTO** — Guia de implementação |

---

> 📝 **Mantenha este documento atualizado!** Ao implementar qualquer feature, adicione uma entrada no Changelog e atualize as seções relevantes.
