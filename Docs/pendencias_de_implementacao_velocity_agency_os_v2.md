# Pendências de Implementação — Velocity Agency OS (v2)

**Data de referência:** 09 jan 2026  
**Documento anterior:** `pendencias_de_implementacao_velocity_agency_os.md`  
**Documento base:** `prompt_inicial.md` (especificação completa do projeto)  
**Revisão:** Verificação completa do repositório realizada para validar status

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

#### 1.3 ClientWorkspace - 10 Abas Definidas
O componente `/src/components/clients/ClientWorkspace.tsx` define as seguintes abas:
- ✅ Overview (com dados mock)
- ⚠️ Workflows (tab existe, conteúdo placeholder)
- ⚠️ Estratégia (tab existe, conteúdo placeholder)
- ⚠️ Operations (tab existe, conteúdo placeholder)
- ⚠️ CRM (tab existe, conteúdo placeholder)
- ⚠️ Content (tab existe, conteúdo placeholder)
- ⚠️ Media (tab existe, conteúdo placeholder)
- ⚠️ Data (tab existe, conteúdo placeholder)
- ⚠️ Approvals (tab existe, conteúdo placeholder)
- ⚠️ Assets (tab existe, conteúdo placeholder)
- ⚠️ Notes (tab existe, conteúdo placeholder)

### ❌ O que foi confirmado como NÃO IMPLEMENTADO

1. **Supabase**: Não instalado (não consta no `package.json`)
2. **Autenticação real**: Zero integração (Login.tsx usa setTimeout mock)
3. **Backend/RLS/Edge Functions**: 0%
4. **Persistência de dados**: Todos os dados vêm de `mockData.ts`
5. **Integrações n8n**: 0%
6. **Workflow Engine**: 0%

---

## 2) Resumo Quantitativo Revisado

| Categoria | Status Real | % Concluído |
|-----------|-------------|-------------|
| **UI Components (shadcn)** | 51 componentes | ✅ 100% |
| **Layout/Navegação** | Sidebar, Mobile, Header | ✅ 100% |
| **Páginas Agência (UI)** | 7 páginas | ✅ 90% (falta polish) |
| **Portal Cliente (UI)** | 4 páginas | ✅ 80% (falta polish) |
| **Workspace - 10 Abas (UI)** | Tabs definidas, 1 com conteúdo | ⚠️ 10% |
| **Auth UI** | Login + Reset Password | ✅ 100% UI |
| **Auth Real (Supabase)** | Não instalado | ❌ 0% |
| **Backend/Database** | Não existe | ❌ 0% |
| **Edge Functions** | Não existe | ❌ 0% |
| **Integrações n8n** | Não existe | ❌ 0% |
| **Workflow Engine** | Não existe | ❌ 0% |

**TOTAL GERAL ESTIMADO:** ~25% (UI base concluída, backend 0%)

---

## 3) Backlog de Pendências Prioritárias

### P0 — Completar UI das 10 Abas do Workspace (PRIORIDADE IMEDIATA)

Cada aba precisa de componentes funcionais (mesmo com dados mock):

#### 3.1 Workflows Tab
- [ ] Timeline visual do workflow (fases/módulos)
- [ ] Status por módulo/step (not_started/in_progress/blocked/done)
- [ ] Gates visuais (pass/fail) com indicadores
- [ ] Bloqueio de avanço quando gate falhar (UI)

**Componentes sugeridos:** `WorkflowTimeline.tsx`, `ModuleCard.tsx`, `GateStatus.tsx`

#### 3.2 Strategy Tab (Kickoff/Diagnóstico/Blueprint/QFD)
- [ ] Seções colapsáveis: Kickoff, Diagnóstico 360, Blueprint 30/60/90 + ICE, QFD
- [ ] Componentes de leitura/edição para cada seção
- [ ] Integração com dados mock existentes (`mockQFD`)

**Componentes sugeridos:** `StrategySection.tsx`, `QFDViewer.tsx`, `BlueprintEditor.tsx`

#### 3.3 Operations Tab (Sprints)
- [ ] Kanban simples (To Do/Doing/Done) usando `mockTasks`
- [ ] Lista de rotinas/checklists
- [ ] Histórico de sprints

**Componentes sugeridos:** `KanbanBoard.tsx`, `SprintHistory.tsx`, `ChecklistView.tsx`

#### 3.4 CRM Tab
- [ ] Pipeline visual (Novo → Qualificado → Agendado → Compareceu → Fechado/Perdido)
- [ ] Cards de leads usando `mockLeads`
- [ ] Templates de WhatsApp (`mockMessageTemplates`)

**Componentes sugeridos:** `LeadPipeline.tsx`, `LeadCard.tsx`, `MessageTemplates.tsx`

#### 3.5 Content Tab
- [ ] Calendário editorial com cards de posts
- [ ] Grid de criativos usando `mockCreatives`
- [ ] Status de aprovação inline

**Componentes sugeridos:** `ContentCalendar.tsx`, `CreativeGrid.tsx`, `CreativeCard.tsx`

#### 3.6 Media Tab
- [ ] Lista de campanhas usando `mockCampaigns`
- [ ] KPIs (CPL/CPA) com indicadores
- [ ] Budget (diário/mensal) com visualização

**Componentes sugeridos:** `CampaignList.tsx`, `CampaignMetrics.tsx`, `BudgetOverview.tsx`

#### 3.7 Data Tab
- [ ] Tracking checklist usando `mockTrackingChecklist`
- [ ] Status de configuração (Pixel/GTM/eventos/UTMs)
- [ ] Links para dashboards externos

**Componentes sugeridos:** `TrackingStatus.tsx`, `ChecklistProgress.tsx`

#### 3.8 Approvals Tab
- [ ] Lista de aprovações pendentes usando `mockApprovals`
- [ ] Preview de item + SLA
- [ ] Histórico de aprovações

**Componentes sugeridos:** `ApprovalsList.tsx`, `ApprovalCard.tsx`, `ApprovalHistory.tsx`

#### 3.9 Assets Tab
- [ ] Inventário usando `mockAssets`
- [ ] Checklist de acessos usando `mockAccessChecklist`
- [ ] Área de upload (UI)

**Componentes sugeridos:** `AssetInventory.tsx`, `AccessChecklist.tsx`, `UploadArea.tsx`

#### 3.10 Notes Tab
- [ ] Timeline de notas usando `mockNotes`
- [ ] Filtro por tipo (note/decision/ata)
- [ ] Busca no histórico

**Componentes sugeridos:** `NotesTimeline.tsx`, `NoteCard.tsx`, `NotesSearch.tsx`

---

### P1 — Preparar Integração Backend

#### 4.1 Instalar Supabase
```bash
npm install @supabase/supabase-js
```

#### 4.2 Criar estrutura de integração
- [ ] Criar `/src/lib/supabase.ts` (client)
- [ ] Criar `/src/types/database.ts` (tipos gerados)
- [ ] Configurar variáveis de ambiente (`.env`)

#### 4.3 Definir schema do banco
**21 tabelas conforme documento original:**
- agencies, users_profile, clients, workspaces, workflows, modules, steps
- checklist_items, gates, tasks, approvals, assets, crm_leads
- message_templates, experiments, campaigns, creatives
- kpi_definitions, kpi_values, audit_logs, clients_users

---

### P2 — Backend/Supabase Essencial

#### 5.1 Database
- [ ] Criar schema SQL completo
- [ ] Implementar Row Level Security (RLS) multi-tenant
- [ ] Configurar Supabase Auth
- [ ] Configurar Storage (assets)
- [ ] Criar seeds (dados demo)

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
- **09 jan 2026 (v2.1):** Cruzamento com `prompt_inicial.md`. Identificadas diferenças de stack (Vite vs Next.js) e rotas faltando (`/onboarding`). Adicionadas pendências de Seeds e UX TDAH-friendly.

**Decisão sobre Stack:** O projeto usa Vite e não Next.js conforme especificado originalmente. Recomenda-se manter Vite a menos que SSR/ISR seja requisito.

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
