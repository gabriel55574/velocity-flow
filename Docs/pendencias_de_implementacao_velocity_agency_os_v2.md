# Pendências de Implementação — Velocity Agency OS (v2)

**Data de referência:** 09 jan 2026  
**Documento anterior:** `pendencias_de_implementacao_velocity_agency_os.md`  
**Documento base:** `prompt_inicial.md` (especificação completa do projeto)  
**Última atualização:** 09 jan 2026 18:33 — Seed data criado

---

## 1) Status Executivo Atualizado

### ✅ O que foi confirmado como IMPLEMENTADO

#### 1.1 Frontend - UI Base
- **Design System**: CSS variables, cores, glassmorphic (`index.css`, `tailwind.config.ts`)
- **51 Componentes UI Base**: (shadcn/ui) em `/src/components/ui/`
  - Incluindo: GlassCard, StatusBadge, Button, Dialog, Drawer, Tabs, etc.
- **4 Componentes de Layout**: `/src/components/layout/`
  - `AppLayout.tsx`, `AppSidebar.tsx`, `MobileNav.tsx`, `PageHeader.tsx`
- **Dados Mock Centralizados**: `src/data/mockData.ts` (501 linhas, 18 interfaces de tipos)
- **2 Hooks Utilitários**: `use-mobile.tsx`, `use-toast.ts`
- **TanStack Query**: Instalado e configurado no `App.tsx`

#### 1.2 Roteamento Implementado
| Rota | Componente | Status |
|------|------------|--------|
| `/login` | Login.tsx | ✅ UI (mock auth) |
| `/reset-password` | ResetPassword.tsx | ✅ UI (mock) |
| `/` | Index.tsx → TodayDashboard | ✅ UI |
| `/clients` | Clients.tsx → ClientsList | ✅ UI |
| `/clients/:id` | ClientDetail → ClientWorkspace | ✅ UI (placeholders) |
| `/calendar` | Calendar.tsx | ✅ UI |
| `/reports` | Reports.tsx | ✅ UI + Recharts |
| `/playbooks` | Playbooks.tsx | ✅ UI |
| `/settings` | Settings.tsx | ✅ UI (subpáginas) |
| `/client/dashboard` | client/Dashboard.tsx | ✅ UI |
| `/client/approvals` | client/Approvals.tsx | ✅ UI |
| `/client/assets` | client/Assets.tsx | ✅ UI |
| `/client/reports` | client/Reports.tsx | ✅ UI |

#### 1.3 ClientWorkspace - 10 Abas ✅ CONCLUÍDAS
O componente `/src/components/clients/ClientWorkspace.tsx` com todas as abas funcionais:
- ✅ Overview (com dados mock)
- ✅ Workflows → `WorkflowTimeline.tsx`, `ModuleCard.tsx`, `GateStatus.tsx`
- ✅ Estratégia → `StrategyTab.tsx` (QFD, Kickoff, Diagnóstico 360, Blueprint)
- ✅ Operations → `OperationsTab.tsx` (Kanban Board)
- ✅ CRM → `CRMTab.tsx` (Pipeline, Templates WhatsApp)
- ✅ Content → `ContentTab.tsx` (Grid de criativos)
- ✅ Media → `MediaTab.tsx` (Campanhas, KPIs)
- ✅ Data → `DataTab.tsx` (Tracking checklist, Dashboards)
- ✅ Approvals → `ApprovalsTab.tsx` (Lista com ações)
- ✅ Assets → `AssetsTab.tsx` (Inventário, Acessos)
- ✅ Notes → `NotesTab.tsx` (Timeline, Filtros, Busca)

**Componentes criados em** `/src/components/workspace/`

### ❌ O que foi confirmado como NÃO IMPLEMENTADO

1. **Supabase**: ✅ Instalado e schema deployed
2. **Autenticação real**: Zero integração (Login.tsx usa setTimeout mock)
3. **Backend/RLS/Edge Functions**: ✅ RLS implementado, Edge Functions 0%
4. **Persistência de dados**: Todos os dados vêm de `mockData.ts` (hooks não migrados)
5. **Integrações n8n**: 0%
6. **Workflow Engine**: 0%

---

## 2) Resumo Quantitativo Revisado

| Categoria | Status Real | % Concluído |
|-----------|-------------|-------------|
| **UI Components (shadcn)** | 51 componentes + 12 workspace | ✅ 100% |
| **Layout/Navegação** | Sidebar, Mobile, Header | ✅ 100% |
| **Páginas Agência (UI)** | 7 páginas | ✅ 100% |
| **Portal Cliente (UI)** | 4 páginas | ✅ 80% (falta polish) |
| **Workspace - 10 Abas (UI)** | ✅ Todas implementadas | ✅ 100% |
| **Auth UI** | Login + Reset Password | ✅ 100% UI |
| **Auth Real (Supabase)** | Projeto configurado | ⚠️ 10% |
| **Backend/Database** | ✅ 21 tabelas + RLS + Indexes | ✅ 90% |
| **Edge Functions** | Não existe | ❌ 0% |
| **Integrações n8n** | Não existe | ❌ 0% |
| **Workflow Engine** | Não existe | ❌ 0% |

**TOTAL GERAL ESTIMADO:** ~55% (UI completa, backend schema deployed)

---

## 3) Backlog de Pendências Prioritárias

### P0 — ✅ CONCLUÍDO: UI das 10 Abas do Workspace

**Implementado em 09 jan 2026** (atualizado 09 jan 2026 17:40)

Todos os componentes criados em `/src/components/workspace/`:

| Aba | Componente | Funcionalidades |
|-----|------------|-----------------|
| Workflows | `WorkflowTimeline.tsx`, `ModuleCard.tsx`, `GateStatus.tsx` | ✅ Timeline visual, ✅ Status por módulo, ✅ Gates visuais, ✅ Bloqueio visual |
| Strategy | `StrategyTab.tsx` | ✅ Seções colapsáveis (QFD, Kickoff, Diagnóstico 360, Blueprint), ✅ mockQFD |
| Operations | `OperationsTab.tsx` | ✅ Kanban (To Do/Doing/Done/Blocked), ✅ Rotina semanal, ✅ Histórico de sprints |
| CRM | `CRMTab.tsx` | ✅ Pipeline visual (6 estágios), ✅ LeadCard, ✅ Templates WhatsApp |
| Content | `ContentTab.tsx` | ✅ Calendário editorial, ✅ Grid de criativos, ✅ Status de aprovação |
| Media | `MediaTab.tsx` | ✅ Lista de campanhas, ✅ KPIs (CPL/CPA), ✅ Budget |
| Data | `DataTab.tsx` | ✅ Tracking checklist, ✅ Status de configuração, ✅ Links dashboards |
| Approvals | `ApprovalsTab.tsx` | ✅ Lista pendentes + SLA, ✅ Preview, ✅ Histórico |
| Assets | `AssetsTab.tsx` | ✅ Inventário, ✅ Checklist de acessos, [/] Upload UI (botão existe, funcionalidade mock) |
| Notes | `NotesTab.tsx` | ✅ Timeline, ✅ Filtro por tipo, ✅ Busca |

**Pendência restante:** Área de upload funcional no Assets (requer integração Supabase Storage)

---

### P1 — ✅ CONCLUÍDO: Integração Supabase Backend

**Implementado em 09 jan 2026 18:20**

#### Arquivos Criados
| Arquivo | Descrição |
|---------|-----------|
| `/src/lib/supabase.ts` | Cliente Supabase tipado |
| `/src/types/database.ts` | Tipos TypeScript para 21 tabelas |
| `/supabase/migrations/20260109_initial_schema.sql` | Schema SQL completo |

#### Schema Deployed (21 tabelas)
- **Core**: agencies, users_profile, clients
- **Workspace**: workspaces, workflows, modules, steps, gates, checklist_items
- **Operations**: tasks, approvals, assets
- **CRM**: crm_leads, message_templates
- **Campaigns**: campaigns, creatives
- **KPIs**: kpi_definitions, kpi_values, experiments
- **Access**: audit_logs, clients_users

#### Segurança Implementada
- ✅ 16 enums criados
- ✅ 28 indexes criados
- ✅ 5 triggers de `updated_at`
- ✅ RLS habilitado em todas as 21 tabelas
- ✅ 23 policies de multi-tenancy
- ✅ Função helper `user_agency_id()` para policies

---

### P2 — Backend/Supabase Essencial

#### 5.1 Database (✅ Concluído)
- [x] Criar schema SQL completo
- [x] Implementar Row Level Security (RLS) multi-tenant
- [ ] Configurar Supabase Auth
- [ ] Configurar Storage (assets)
- [x] Criar seeds (dados demo) — `supabase/seeds/demo_data.sql`

**Seeds inseridos (09 jan 2026):**
- 1 Agência, 3 Clientes, 3 Workspaces, 3 Workflows
- 5 Modules, 5 Steps, 6 Tasks, 5 Leads
- 4 Campaigns, 4 Creatives, 4 KPIs

#### 5.2 Hooks de Data
- [ ] Migrar mockData para hooks com TanStack Query
- [ ] Criar hooks por domínio (useClients, useTasks, useLeads, etc.)

---

### P3 — Autenticação Real

- [ ] Integrar Login.tsx com Supabase Auth
- [ ] Implementar refresh token
- [ ] Reset password real
- [ ] Proteção de rotas por role
- [ ] Roles: Admin, Manager/CS, Editor, Media Buyer, Analyst, Viewer
- [ ] Roles cliente: Client Admin, Client Viewer

---

### P4 — Edge Functions

- [ ] `/functions/v1/n8n-webhook-ingest` — receber leads/métricas
- [ ] `/functions/v1/recompute-health` — calcular health e gates
- [ ] `/functions/v1/create-weekly-sprint` — criar tarefas recorrentes
- [ ] `/functions/v1/notify-sla` — disparar notificação via n8n

---

### P5 — Workflow Engine

- [ ] Modules → Steps → Checklist Items
- [ ] Gates com Definition of Done (DoD)
- [ ] Bloqueio de avanço quando gate falhar
- [ ] Criação automática de tarefas por templates
- [ ] SLAs por etapa com alertas
- [ ] Audit trail (aprovações/mudanças)
- [ ] Timeline visual do workflow (dados reais)
- [ ] Focus Mode (wizard por etapa)

---

### P6 — Integrações n8n

- [ ] SLA Approvals — notificar quando expirar
- [ ] Daily CRM Follow-up — listar leads críticos
- [ ] Weekly Sprint — criar sprint toda segunda
- [ ] Metrics Ingest — receber métricas Meta/IG/Google

---

### P7 — Playbook "Clínica Premium — Harmonização"

- [ ] Arquitetura de Mensagem QFD (já tem mock em `mockQFD`)
- [ ] Scripts WhatsApp (já tem mock em `mockMessageTemplates`, falta UI de gestão)
- [ ] Checklist de Go-Live específico (tracking + CRM + criativos + campanhas)
- [ ] Rotina de prova/valor (reviews Google, depoimentos, bastidores, educação)
- [ ] KPIs padrão de clínica (agendamento, show rate, conversão, origem)

---

### P8 — Seeds (Dados Iniciais) — conforme prompt_inicial.md

- [ ] 1 agency: "Velocity"
- [ ] 1 client demo: "Visage Face (demo)" com niche "Harmonização Facial"
- [ ] Usuários demo: Admin, CS, Editor, Media, Analyst
- [ ] Workflow templates: Novo Cliente, Sprint Semanal, MBR Mensal, Offboarding
- [ ] Templates de mensagens WhatsApp
- [ ] Templates de pauta semanal e MBR
- [ ] 10 tarefas padrão de sprint (conteúdo, mídia, CRM, dados)

---

### P9 — UX TDAH-Friendly (Requisitos Essenciais)

Conforme `prompt_inicial.md` (linhas 436-444):

- [ ] Tela "Today" sempre com:
  - [ ] Top 5 ações
  - [ ] Gates bloqueados com botão "Resolver agora"
  - [ ] SLAs vencendo
  - [ ] "Próxima ação" por cliente
- [ ] "Focus Mode" para executar por etapa (wizard) e impedir dispersão
- [ ] Logs e histórico claros (tudo auditável)
- [ ] Menos campos por tela; etapas curtas e progress bar
- [ ] Toasts (sucesso/erro/aviso)
- [ ] Microcelebrações leves quando gates passam ou sprint fecha
- [ ] Skeleton loaders e estados vazios bem desenhados

---

## 4) Correções ao Documento Anterior

| Item | Documento v1 | Status Real |
|------|--------------|-------------|
| "10 abas do Workspace pendentes" | Correto | Tabs definidas, conteúdo placeholder |
| "Auth UI concluída" | Correto | Login + ResetPassword existem |
| "Backend 0%" | Correto | Supabase não instalado |
| "mockData centralizados" | Correto | 501 linhas em mockData.ts |
| "Edge Functions 0%" | Correto | Não existe pasta de functions |
| "Workflow Engine 0%" | Correto | Nenhum hook/componente |

---

## 5) Próximos Passos Recomendados

### Fase 1 (Imediata): UI das 10 Abas
1. Criar componentes para cada aba usando dados mock existentes
2. Garantir navegação e estados (loading, empty, error)
3. Responsividade em todas as abas

### Fase 2: Infraestrutura Backend
1. Instalar e configurar Supabase
2. Criar schema SQL
3. Configurar RLS e Auth
4. Migrar hooks de mock para Supabase

### Fase 3: Funcionalidades Core
1. Auth real
2. CRUD em todas as entidades
3. Workflow Engine básico

---

## 8) Registro de Decisões

- **09 jan 2026:** Documento v1 criado
- **09 jan 2026 (v2):** Verificação completa do repositório.
- **09 jan 2026 (v2.1):** Cruzamento com `prompt_inicial.md`. Identificadas diferenças de stack.
- **09 jan 2026 (v2.2):** ✅ Implementadas todas as 10 abas do Workspace (12 componentes)
- **09 jan 2026 (v2.3):** Configurado projeto Supabase `cuowpgsuaylnqntwnnur`
- **09 jan 2026 (v2.4):** Criados `.env.local` e `.env.example`
- **09 jan 2026 (v2.5):** Criados `AGENT_RULES.md` e `implementacao.md`

**Decisão sobre Stack:** Manter Vite (não Next.js).
**Supabase Project ID:** `cuowpgsuaylnqntwnnur` (App_v1 Project, us-east-2)

---

## 9) Gates Obrigatórios (conforme prompt_inicial.md)

Gates que precisam ser implementados no Workflow Engine:

| Gate | Definition of Done (DoD) |
|------|-------------------------|
| Gate Estratégia | Metas numéricas + persona + oferta + capacidade documentadas |
| Gate Tracking | UTMs + eventos essenciais OK |
| Gate Go-Live | Tracking OK + scripts CRM OK + criativos aprovados + campanhas estruturadas |
| Gate Sprint | Backlog ICE priorizado + donos definidos + SLAs claros |

---

## 10) Workflows Obrigatórios (conforme prompt_inicial.md)

| Workflow | Descrição |
|----------|----------|
| A) Novo Cliente | Comercial → Onboarding → Estratégia → Setup → Go-Live |
| B) Sprint Semanal | Planejar → executar → reportar → decidir |
| C) MBR Mensal | Consolidar → analisar → decidir correção/escala |
| D) Offboarding | Entrega final + revogar acessos + lições |

---

## 11) Arquivos Principais do Projeto

```
velocity-flow/
├── src/
│   ├── App.tsx                    # Roteamento principal
│   ├── components/
│   │   ├── ui/                    # 51 componentes shadcn
│   │   ├── layout/                # Layout components
│   │   ├── dashboard/             # Dashboard components
│   │   ├── clients/               # ClientWorkspace, ClientsList
│   │   ├── client-portal/         # ClientLayout
│   │   ├── auth/                  # AuthLayout
│   │   └── shared/                # EmptyState, etc.
│   ├── pages/
│   │   ├── auth/                  # Login, ResetPassword
│   │   ├── client/                # Portal do cliente (4 páginas)
│   │   └── *.tsx                  # Páginas da agência
│   ├── data/
│   │   └── mockData.ts            # Dados mock centralizados
│   └── hooks/
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── Docs/
│   ├── pendencias_de_implementacao_velocity_agency_os.md
│   └── pendencias_de_implementacao_velocity_agency_os_v2.md  # ESTE DOCUMENTO
└── package.json                   # Sem Supabase instalado
```
