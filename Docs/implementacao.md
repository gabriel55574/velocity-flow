# 📘 Guia de Implementação — Velocity Agency OS

**Última atualização:** 10 jan 2026 13:03  
**Propósito:** Documentação técnica COMPLETA para continuidade do projeto sem erros.  
**Documento PDR Base:** `velocity_agency_os_PDR_v1_0.md`

---

## 🎯 Sobre Este Documento

Este documento serve como **fonte única de verdade** para implementação. Contém:

1. **Arquitetura atual** — como o projeto está estruturado
2. **Especificações técnicas detalhadas** — tipos, interfaces, schemas
3. **Padrões e convenções obrigatórios** — como escrever código
4. **Referência de implementação** — código exato para cada funcionalidade
5. **Changelog de implementação** — histórico de mudanças

> [!CAUTION]
> **SEMPRE atualize este documento ao fazer qualquer implementação.**
> **SEMPRE consulte o PDR antes de iniciar qualquer funcionalidade.**

---

## 1. Stack Tecnológica Completa

### 1.1 Frontend (100% Configurado)

| Tecnologia | Versão | Arquivo Config | Uso |
|------------|--------|----------------|-----|
| Vite | 5.4.19 | `vite.config.ts` | Build tool |
| React | 18.3.1 | `package.json` | UI Framework |
| TypeScript | 5.8.3 | `tsconfig.json` | Tipagem estática |
| TailwindCSS | 3.4.17 | `tailwind.config.ts` | Estilização |
| shadcn/ui | — | `components.json` | 51 componentes UI |
| TanStack Query | 5.83.0 | `src/App.tsx` | Data fetching |
| React Router DOM | 6.30.1 | `src/App.tsx` | Roteamento |
| React Hook Form | 7.61.1 | `package.json` | Formulários |
| Zod | 3.25.76 | `package.json` | Validação |
| Recharts | 2.15.4 | `src/pages/Reports.tsx` | Gráficos |
| Framer Motion | 12.25.0 | `package.json` | Animações |
| Lucide React | 0.462.0 | Vários | Ícones |
| date-fns | 3.6.0 | `package.json` | Manipulação datas |

### 1.2 Backend (Supabase)

| Componente | Status | Arquivo | Detalhes |
|------------|--------|---------|----------|
| Supabase Client | ✅ | `src/lib/supabase.ts` | Cliente tipado |
| Database Schema | ✅ | `supabase/migrations/20260109_initial_schema.sql` | 21 tabelas |
| TypeScript Types | ✅ | `src/types/database.ts` | Tipos para todas tabelas |
| RLS Policies | ✅ | Migration SQL | 23 policies multi-tenant |
| Seed Data | ✅ | `supabase/seeds/demo_data.sql` | Dados demo |
| **Auth** | ❌ | Não implementado | Usar `supabase.auth` |
| **Storage** | ❌ | Não configurado | Precisa criar buckets |
| **Edge Functions** | ❌ | Pasta não existe | Criar `/supabase/functions` |

---

## 2. Estrutura de Diretórios Completa

```
velocity-flow/
├── src/
│   ├── App.tsx                         # Roteamento principal
│   ├── main.tsx                        # Entry point
│   ├── index.css                       # Design system + variáveis
│   ├── App.css                         # Estilos App
│   │
│   ├── components/
│   │   ├── ui/                         # 51 componentes shadcn/ui
│   │   │   ├── button.tsx              # Variantes: default, outline, ghost, destructive
│   │   │   ├── card.tsx                # Card básico
│   │   │   ├── dialog.tsx              # Modal dialog
│   │   │   ├── drawer.tsx              # Drawer lateral/bottom
│   │   │   ├── glass-card.tsx          # ⭐ Customizado - glassmorphic
│   │   │   ├── status-badge.tsx        # ⭐ Customizado - ok/warn/risk
│   │   │   ├── tabs.tsx                # Tabs navegação
│   │   │   ├── table.tsx               # Tabela de dados
│   │   │   ├── input.tsx               # Input form
│   │   │   ├── label.tsx               # Label form
│   │   │   ├── textarea.tsx            # Textarea form
│   │   │   ├── select.tsx              # Select dropdown
│   │   │   ├── checkbox.tsx            # Checkbox
│   │   │   ├── badge.tsx               # Badge status
│   │   │   ├── avatar.tsx              # Avatar usuário
│   │   │   ├── progress.tsx            # Progress bar
│   │   │   ├── skeleton.tsx            # Loading skeleton
│   │   │   ├── toast.tsx               # Toast notifications
│   │   │   ├── toaster.tsx             # Toast container
│   │   │   ├── tooltip.tsx             # Tooltip hover
│   │   │   ├── collapsible.tsx         # Collapsible section
│   │   │   ├── accordion.tsx           # Accordion
│   │   │   ├── dropdown-menu.tsx       # Dropdown menu
│   │   │   ├── popover.tsx             # Popover
│   │   │   ├── command.tsx             # Command palette
│   │   │   ├── calendar.tsx            # Calendar picker
│   │   │   ├── slider.tsx              # Slider range
│   │   │   ├── switch.tsx              # Toggle switch
│   │   │   ├── scroll-area.tsx         # Scroll customizado
│   │   │   ├── separator.tsx           # Separator line
│   │   │   ├── sheet.tsx               # Sheet overlay
│   │   │   └── ... (mais 20)
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx           # Layout wrapper (Sidebar + Content)
│   │   │   ├── AppSidebar.tsx          # Sidebar navegação desktop
│   │   │   ├── MobileNav.tsx           # Bottom nav mobile
│   │   │   └── PageHeader.tsx          # Header de páginas
│   │   │
│   │   ├── dashboard/
│   │   │   ├── TodayDashboard.tsx      # Dashboard principal
│   │   │   ├── ActionCard.tsx          # Card de ação pendente
│   │   │   ├── ClientHealthCard.tsx    # Card saúde cliente
│   │   │   └── MetricCard.tsx          # Card métrica
│   │   │
│   │   ├── clients/
│   │   │   ├── ClientsList.tsx         # Lista de clientes
│   │   │   └── ClientWorkspace.tsx     # Workspace 10 abas
│   │   │
│   │   ├── workspace/                  # ⭐ Componentes das 10 abas
│   │   │   ├── index.ts                # Exports centralizados
│   │   │   ├── WorkflowTimeline.tsx    # Timeline visual workflow
│   │   │   ├── ModuleCard.tsx          # Card módulo expansível
│   │   │   ├── GateStatus.tsx          # Indicador gate pass/fail
│   │   │   ├── StrategyTab.tsx         # QFD + Kickoff + Diagnóstico + Blueprint
│   │   │   ├── OperationsTab.tsx       # Kanban + Sprint
│   │   │   ├── CRMTab.tsx              # Pipeline + Templates
│   │   │   ├── ContentTab.tsx          # Criativos + Calendário
│   │   │   ├── MediaTab.tsx            # Campanhas + KPIs
│   │   │   ├── DataTab.tsx             # Tracking + Dashboards
│   │   │   ├── ApprovalsTab.tsx        # Lista aprovações
│   │   │   ├── AssetsTab.tsx           # Inventário + Acessos
│   │   │   └── NotesTab.tsx            # Timeline notas
│   │   │
│   │   ├── client-portal/
│   │   │   └── ClientLayout.tsx        # Layout portal cliente
│   │   │
│   │   ├── auth/
│   │   │   └── AuthLayout.tsx          # Layout auth (login/reset)
│   │   │
│   │   └── shared/
│   │       ├── EmptyState.tsx          # Estado vazio
│   │       └── SkeletonCard.tsx        # Loading skeleton card
│   │
│   ├── pages/
│   │   ├── Index.tsx                   # → TodayDashboard
│   │   ├── Clients.tsx                 # → ClientsList
│   │   ├── ClientDetail.tsx            # → ClientWorkspace
│   │   ├── Calendar.tsx                # Calendário eventos
│   │   ├── Reports.tsx                 # Relatórios + Recharts
│   │   ├── Playbooks.tsx               # Biblioteca playbooks
│   │   ├── Settings.tsx                # Configurações (5 sub-tabs)
│   │   ├── NotFound.tsx                # 404
│   │   ├── auth/
│   │   │   ├── Login.tsx               # ⚠️ Mock - integrar Supabase
│   │   │   └── ResetPassword.tsx       # ⚠️ Mock - integrar Supabase
│   │   └── client/
│   │       ├── Dashboard.tsx           # Portal cliente - dashboard
│   │       ├── Approvals.tsx           # Portal cliente - aprovações
│   │       ├── Assets.tsx              # Portal cliente - ativos
│   │       └── Reports.tsx             # Portal cliente - relatórios
│   │
│   ├── data/
│   │   └── mockData.ts                 # ⭐ 501 linhas - todos dados mock
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx              # Hook: detecta mobile
│   │   └── use-toast.ts                # Hook: toast notifications
│   │
│   ├── lib/
│   │   ├── supabase.ts                 # ⭐ Cliente Supabase tipado
│   │   └── utils.ts                    # Utilitários (cn, etc.)
│   │
│   └── types/
│       └── database.ts                 # ⭐ Tipos TypeScript do DB
│
├── supabase/
│   ├── migrations/
│   │   └── 20260109_initial_schema.sql # ⭐ Schema completo
│   └── seeds/
│       └── demo_data.sql               # ⭐ Dados demo
│
├── Docs/
│   ├── velocity_agency_os_PDR_v1_0.md  # PDR - fonte de verdade
│   ├── conferencia.md                  # Análise PDR vs implementação
│   ├── pendencias_de_implementacao_velocity_agency_os_v2.md # Pendências
│   └── implementacao.md                # ⭐ ESTE DOCUMENTO
│
├── public/
│   ├── logo.svg                        # Logo Velocity
│   └── favicon.svg                     # Favicon
│
├── components.json                     # Config shadcn/ui
├── tailwind.config.ts                  # Config Tailwind
├── vite.config.ts                      # Config Vite
├── tsconfig.json                       # Config TypeScript
├── .env.local                          # ⚠️ Chaves Supabase (não commitar)
├── .env.example                        # Template .env
└── package.json                        # Dependências
```

---

## 3. Roteamento Completo (App.tsx)

### 3.1 Rotas Implementadas

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    {/* ═══════════════════════════════════════════════════════════
        PORTAL DA AGÊNCIA
        Prefixo recomendado pelo PDR: /agency/
        Implementação atual: sem prefixo
    ═══════════════════════════════════════════════════════════ */}
    
    {/* Dashboard - Today View */}
    <Route path="/" element={<Index />} />
    
    {/* Lista de Clientes */}
    <Route path="/clients" element={<Clients />} />
    
    {/* Workspace do Cliente (10 abas) */}
    <Route path="/clients/:id" element={<ClientDetail />} />
    
    {/* Calendário */}
    <Route path="/calendar" element={<CalendarPage />} />
    
    {/* Relatórios */}
    <Route path="/reports" element={<Reports />} />
    
    {/* Playbooks */}
    <Route path="/playbooks" element={<Playbooks />} />
    
    {/* Configurações */}
    <Route path="/settings" element={<Settings />} />
    
    {/* ═══════════════════════════════════════════════════════════
        AUTENTICAÇÃO
    ═══════════════════════════════════════════════════════════ */}
    
    <Route path="/login" element={<Login />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    
    {/* ═══════════════════════════════════════════════════════════
        PORTAL DO CLIENTE
        Prefixo: /client/
    ═══════════════════════════════════════════════════════════ */}
    
    <Route path="/client/dashboard" element={<ClientDashboard />} />
    <Route path="/client/approvals" element={<ClientApprovals />} />
    <Route path="/client/assets" element={<ClientAssets />} />
    <Route path="/client/reports" element={<ClientReports />} />
    
    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### 3.2 Rotas Pendentes (PDR)

| Rota PDR | Status | Ação Necessária |
|----------|--------|-----------------|
| `/agency/clients/:id/workflows` | ⚠️ | Integrar em tab Workflows |
| `/agency/clients/:id/approvals` | ⚠️ | Integrar em tab Approvals |
| `/agency/clients/:id/assets` | ⚠️ | Integrar em tab Assets |

---

## 4. Database Schema Completo

### 4.1 Tabelas por Domínio

#### Core (3 tabelas)

```sql
-- 1. Agencies (tenant raiz)
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users Profile (usuários da agência)
CREATE TABLE users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'viewer',  -- Enum: admin, manager, editor, media_buyer, analyst, viewer
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Clients (clientes da agência)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    niche TEXT,
    status client_status DEFAULT 'lead',  -- Enum: lead, onboarding, active, paused, churned
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    business_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(agency_id, slug)
);
```

#### Workspace (7 tabelas)

```sql
-- 4. Workspaces
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
    current_phase TEXT DEFAULT 'onboarding',
    health workspace_health DEFAULT 'ok',  -- Enum: ok, warn, risk
    owner_id UUID REFERENCES users_profile(id),
    next_mbr DATE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Workflows
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Modules
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    color TEXT DEFAULT '#10B981',
    status module_status DEFAULT 'pending',  -- Enum: pending, in_progress, completed, blocked
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Steps
CREATE TABLE steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status step_status DEFAULT 'pending',
    owner_id UUID REFERENCES users_profile(id),
    sla_hours INTEGER DEFAULT 48,
    due_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 8. Checklist Items
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_required BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES users_profile(id)
);

-- 9. Gates (Definition of Done)
CREATE TABLE gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dod_config JSONB NOT NULL,  -- Regras em JSON
    status gate_status DEFAULT 'pending',  -- Enum: pending, passed, failed
    validated_at TIMESTAMPTZ,
    validated_by UUID REFERENCES users_profile(id)
);
```

#### Operations (3 tabelas)

```sql
-- 10. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    step_id UUID REFERENCES steps(id),
    title TEXT NOT NULL,
    description TEXT,
    status task_status DEFAULT 'todo',  -- Enum: todo, doing, done, blocked
    priority priority_level DEFAULT 'medium',  -- Enum: low, medium, high, urgent
    assignee_id UUID REFERENCES users_profile(id),
    due_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Approvals
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    type approval_type NOT NULL,  -- Enum: creative, copy, strategy, campaign, other
    title TEXT NOT NULL,
    description TEXT,
    status approval_status DEFAULT 'pending',  -- Enum: pending, approved, rejected, revision
    requested_by UUID REFERENCES users_profile(id),
    payload JSONB,
    file_url TEXT,
    sla_hours INTEGER DEFAULT 48,
    due_at TIMESTAMPTZ,  -- ⚠️ Campo para SLA
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);

-- 12. Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    type asset_type NOT NULL,  -- Enum: image, video, document, link, credential
    title TEXT NOT NULL,
    description TEXT,
    status asset_status DEFAULT 'missing',  -- Enum: missing, uploaded, validated, rejected
    file_url TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES users_profile(id),
    validated_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
```

#### CRM (2 tabelas)

```sql
-- 13. CRM Leads
CREATE TABLE crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    stage lead_stage DEFAULT 'new',  -- Enum: new, qualified, scheduled, showed, closed, lost
    source TEXT,
    score INTEGER DEFAULT 0,
    assigned_to UUID REFERENCES users_profile(id),
    notes TEXT,
    last_contact_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Message Templates
CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    channel channel_type DEFAULT 'whatsapp',  -- Enum: whatsapp, email, sms
    content TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Campaigns (2 tabelas)

```sql
-- 15. Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    platform platform_type NOT NULL,  -- Enum: meta, google, tiktok, other
    objective TEXT,
    status campaign_status DEFAULT 'draft',  -- Enum: draft, active, paused, completed
    budget DECIMAL(12, 2) DEFAULT 0,
    spent DECIMAL(12, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 16. Creatives
CREATE TABLE creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id),
    title TEXT NOT NULL,
    type creative_type NOT NULL,  -- Enum: image, video, carousel, story
    status approval_status DEFAULT 'pending',
    file_url TEXT,
    thumbnail_url TEXT,
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
```

#### KPIs (2 tabelas)

```sql
-- 17. KPI Definitions
CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key TEXT NOT NULL,  -- Ex: leads, cpl, show_rate
    unit TEXT DEFAULT 'number',
    target_direction TEXT DEFAULT 'higher' CHECK (target_direction IN ('higher', 'lower')),
    is_default BOOLEAN DEFAULT false,
    UNIQUE(agency_id, key)
);

-- 18. KPI Values
CREATE TABLE kpi_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    kpi_id UUID NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    value DECIMAL(15, 4) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Sistema (3 tabelas)

```sql
-- 19. Experiments (Backlog ICE)
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    hypothesis TEXT,
    impact INTEGER DEFAULT 5 CHECK (impact BETWEEN 1 AND 10),
    confidence INTEGER DEFAULT 5 CHECK (confidence BETWEEN 1 AND 10),
    ease INTEGER DEFAULT 5 CHECK (ease BETWEEN 1 AND 10),
    status experiment_status DEFAULT 'backlog',  -- Enum: backlog, running, completed, cancelled
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 20. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_profile(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 21. Clients Users (Acesso Portal Cliente)
CREATE TABLE clients_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    role client_role DEFAULT 'viewer',  -- Enum: admin, viewer
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(client_id, user_id)
);
```

### 4.2 Enums Disponíveis

```sql
-- Roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'editor', 'media_buyer', 'analyst', 'viewer');
CREATE TYPE client_role AS ENUM ('admin', 'viewer');

-- Status gerais
CREATE TYPE client_status AS ENUM ('lead', 'onboarding', 'active', 'paused', 'churned');
CREATE TYPE workspace_health AS ENUM ('ok', 'warn', 'risk');
CREATE TYPE module_status AS ENUM ('pending', 'in_progress', 'completed', 'blocked');
CREATE TYPE step_status AS ENUM ('pending', 'in_progress', 'completed', 'blocked');
CREATE TYPE gate_status AS ENUM ('pending', 'passed', 'failed');
CREATE TYPE task_status AS ENUM ('todo', 'doing', 'done', 'blocked');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'revision');
CREATE TYPE asset_status AS ENUM ('missing', 'uploaded', 'validated', 'rejected');
CREATE TYPE lead_stage AS ENUM ('new', 'qualified', 'scheduled', 'showed', 'closed', 'lost');
CREATE TYPE experiment_status AS ENUM ('backlog', 'running', 'completed', 'cancelled');

-- Tipos
CREATE TYPE approval_type AS ENUM ('creative', 'copy', 'strategy', 'campaign', 'other');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE platform_type AS ENUM ('meta', 'google', 'tiktok', 'other');
CREATE TYPE asset_type AS ENUM ('image', 'video', 'document', 'link', 'credential');
CREATE TYPE creative_type AS ENUM ('image', 'video', 'carousel', 'story');
CREATE TYPE channel_type AS ENUM ('whatsapp', 'email', 'sms');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
```

### 4.3 Indexes Implementados

```sql
-- Core
CREATE INDEX idx_users_agency ON users_profile(agency_id);
CREATE INDEX idx_clients_agency ON clients(agency_id);
CREATE INDEX idx_clients_status ON clients(status);

-- Workspace
CREATE INDEX idx_workspaces_client ON workspaces(client_id);
CREATE INDEX idx_workflows_workspace ON workflows(workspace_id);
CREATE INDEX idx_modules_workflow ON modules(workflow_id);
CREATE INDEX idx_steps_module ON steps(module_id);
CREATE INDEX idx_checklist_step ON checklist_items(step_id);
CREATE INDEX idx_gates_module ON gates(module_id);

-- Operations
CREATE INDEX idx_tasks_client ON tasks(client_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_approvals_client ON approvals(client_id);
CREATE INDEX idx_approvals_status ON approvals(status);

-- CRM
CREATE INDEX idx_leads_client ON crm_leads(client_id);
CREATE INDEX idx_leads_stage ON crm_leads(stage);
CREATE INDEX idx_templates_client ON message_templates(client_id);

-- Campaigns
CREATE INDEX idx_campaigns_client ON campaigns(client_id);
CREATE INDEX idx_creatives_client ON creatives(client_id);
CREATE INDEX idx_creatives_campaign ON creatives(campaign_id);

-- KPIs
CREATE INDEX idx_kpi_defs_agency ON kpi_definitions(agency_id);
CREATE INDEX idx_kpi_values_client ON kpi_values(client_id);
CREATE INDEX idx_kpi_values_kpi ON kpi_values(kpi_id);
CREATE INDEX idx_kpi_values_period ON kpi_values(period_start, period_end);

-- Sistema
CREATE INDEX idx_experiments_client ON experiments(client_id);
CREATE INDEX idx_audit_agency ON audit_logs(agency_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

### 4.4 RLS Policies

```sql
-- Função helper para obter agency_id do usuário logado
CREATE OR REPLACE FUNCTION user_agency_id()
RETURNS UUID AS $$
  SELECT agency_id FROM users_profile WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Exemplo: Policy para clients
CREATE POLICY "agency_select_clients" ON clients
    FOR SELECT USING (agency_id = user_agency_id());

CREATE POLICY "agency_insert_clients" ON clients
    FOR INSERT WITH CHECK (agency_id = user_agency_id());

CREATE POLICY "agency_update_clients" ON clients
    FOR UPDATE USING (agency_id = user_agency_id());

CREATE POLICY "agency_delete_clients" ON clients
    FOR DELETE USING (agency_id = user_agency_id());

-- Total: 23 policies similares para todas as tabelas
```

---

## 5. Cliente Supabase Tipado

### 5.1 Arquivo: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 5.2 Como Usar

```typescript
import { supabase } from '@/lib/supabase';

// SELECT
const { data: clients, error } = await supabase
  .from('clients')
  .select('*')
  .eq('status', 'active');

// INSERT
const { data, error } = await supabase
  .from('tasks')
  .insert({
    client_id: 'uuid-here',
    title: 'Nova tarefa',
    status: 'todo',
    priority: 'high'
  })
  .select()
  .single();

// UPDATE
const { error } = await supabase
  .from('tasks')
  .update({ status: 'done' })
  .eq('id', taskId);

// DELETE
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', taskId);
```

---

## 6. Dados Mock (mockData.ts)

### 6.1 Interfaces Disponíveis

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'media_buyer' | 'analyst' | 'viewer';
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface Client {
  id: string;
  name: string;
  niche: string;
  phase: 'onboarding' | 'estrategia' | 'setup' | 'golive' | 'operacao';
  health: 'ok' | 'warn' | 'risk';
  owner: string;
  progress: number;
  nextMBR: string;
  logo?: string;
  businessData: {
    capacityWeek: number;
    ticketAvg: number;
    showRate: number;
    conversionRate: number;
  };
}

export interface WorkflowModule {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  steps: WorkflowStep[];
  gate?: Gate;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  owner: string;
  slaHours: number;
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  required: boolean;
  done: boolean;
}

export interface Gate {
  id: string;
  title: string;
  status: 'pending' | 'passed' | 'failed';
  conditions: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: string;
  dueAt: string;
  clientId: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  stage: 'new' | 'qualified' | 'scheduled' | 'showed' | 'closed' | 'lost';
  lastContactAt: string;
  notes: string;
  clientId: string;
}

export interface Creative {
  id: string;
  title: string;
  type: 'imagem' | 'video' | 'carrossel' | 'story';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  thumbnail?: string;
  scheduledFor?: string;
  platform: 'instagram' | 'facebook' | 'google' | 'tiktok';
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'tiktok';
  objective: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budgetDaily: number;
  spent: number;
  leads: number;
  cpl: number;
}

export interface Approval {
  id: string;
  type: 'creative' | 'copy' | 'strategy' | 'campaign' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  requestedBy: string;
  requestedAt: string;
  slaDueAt: string;
  preview?: string;
  clientId: string;
}

export interface Asset {
  id: string;
  type: 'logo' | 'foto' | 'video' | 'documento' | 'acesso';
  title: string;
  status: 'missing' | 'uploaded' | 'validated' | 'rejected';
  url?: string;
}

export interface Report {
  id: string;
  type: 'weekly' | 'mbr';
  title: string;
  period: string;
  createdAt: string;
  highlights: string[];
  decisions: string[];
}

export interface Playbook {
  id: string;
  name: string;
  niche: string;
  description: string;
  modules: number;
  scriptsCount: number;
  templatesCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'mbr' | 'sprint' | 'content';
  date: string;
  time?: string;
  clientId?: string;
  clientName?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  type: 'meeting' | 'decision' | 'general';
}
```

### 6.2 Dados Mock Disponíveis

| Constante | Tipo | Qtd | Uso |
|-----------|------|-----|-----|
| `mockUsers` | User[] | 5 | Usuários agência |
| `mockClients` | Client[] | 5 | Clientes demo |
| `mockWorkflowModules` | WorkflowModule[] | 10 | Módulos workflow |
| `mockTasks` | Task[] | 5 | Tarefas sprint |
| `mockLeads` | Lead[] | 6 | Leads CRM |
| `mockCreatives` | Creative[] | 5 | Criativos |
| `mockCampaigns` | Campaign[] | 4 | Campanhas |
| `mockApprovals` | Approval[] | 4 | Aprovações |
| `mockAssets` | Asset[] | 6 | Ativos |
| `mockReports` | Report[] | 2 | Relatórios |
| `mockPlaybooks` | Playbook[] | 3 | Playbooks |
| `mockCalendarEvents` | CalendarEvent[] | 6 | Eventos |
| `mockNotes` | Note[] | 3 | Notas |
| `mockMessageTemplates` | — | 6 | Templates WhatsApp |
| `mockQFD` | — | 1 | Arquitetura mensagem |
| `mockTrackingChecklist` | — | 7 | Checklist tracking |
| `mockAccessChecklist` | — | 7 | Checklist acessos |
| `mockKPIs` | — | 6 | KPIs |

---

## 7. Design System

### 7.1 CSS Variables (index.css)

```css
:root {
  /* Base colors */
  --background: 220 25% 97%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  
  /* Primary: Velocity Green */
  --primary: 168 80% 25%;  /* #0e7360 */
  --primary-foreground: 0 0% 98%;
  
  /* Secondary */
  --secondary: 220 14% 95%;
  --secondary-foreground: 240 5% 26%;
  
  /* Muted */
  --muted: 220 14% 90%;
  --muted-foreground: 240 5% 46%;
  
  /* Accent */
  --accent: 220 14% 95%;
  --accent-foreground: 240 5% 26%;
  
  /* Destructive */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  
  /* Border/Ring */
  --border: 220 10% 88%;
  --input: 220 10% 88%;
  --ring: 168 80% 25%;
  
  /* Radius */
  --radius: 1rem;

  /* ═══════════════════════════════════════════════════════════
     STATUS COLORS (Health Score)
  ═══════════════════════════════════════════════════════════ */
  --ok: 145 63% 42%;      /* Verde - emerald-500 */
  --warn: 38 92% 50%;     /* Amarelo - amber-500 */
  --risk: 0 84% 60%;      /* Vermelho - red-500 */

  /* ═══════════════════════════════════════════════════════════
     WORKFLOW STATUS
  ═══════════════════════════════════════════════════════════ */
  --blocked: 0 0% 55%;    /* Cinza */
  --inprogress: 219 85% 51%;  /* Azul */
  --done: 145 63% 42%;    /* Verde */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode variables */
}
```

### 7.2 Componentes Customizados

#### GlassCard

```tsx
// Uso
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";

<GlassCard>
  <GlassCardHeader>
    <GlassCardTitle>Título</GlassCardTitle>
  </GlassCardHeader>
  <GlassCardContent>
    Conteúdo com efeito glassmorphic
  </GlassCardContent>
</GlassCard>
```

#### StatusBadge

```tsx
// Uso
import { StatusBadge } from "@/components/ui/status-badge";

<StatusBadge status="ok" />    // Verde
<StatusBadge status="warn" />  // Amarelo
<StatusBadge status="risk" />  // Vermelho
```

---

## 8. Padrões de Código Obrigatórios

### 8.1 Estrutura de Componente de Página

```tsx
// src/pages/NomeDaPagina.tsx

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { mockClients } from "@/data/mockData";
import { Plus } from "lucide-react";

export default function NomeDaPagina() {
  return (
    <AppLayout>
      <PageHeader 
        title="Título da Página"
        subtitle="Descrição opcional"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ação Principal
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Grid responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockClients.map(client => (
            <GlassCard key={client.id}>
              <GlassCardContent>
                {client.name}
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
```

### 8.2 Estrutura de Hook Supabase

```tsx
// src/hooks/useClients.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (client: ClientInsert) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });
}
```

### 8.3 Importações

```tsx
// ✅ CORRETO - Usar alias @/
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { mockClients } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// ❌ INCORRETO - Caminhos relativos longos
import { Button } from "../../../components/ui/button";
```

### 8.4 Estilização

```tsx
// ✅ CORRETO - Tailwind classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<span className="text-emerald-500">OK</span>
<span className="text-amber-500">Atenção</span>
<span className="text-red-500">Risco</span>

// ✅ CORRETO - Glass effect
<div className="backdrop-blur-lg bg-white/70 border border-white/20 shadow-lg rounded-2xl">

// ❌ INCORRETO - CSS inline
<div style={{ display: 'flex', gap: '16px' }}>
```

---

## 9. Comandos Úteis

```bash
# ═══════════════════════════════════════════════════════════
# DESENVOLVIMENTO
# ═══════════════════════════════════════════════════════════

# Iniciar servidor dev
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# ═══════════════════════════════════════════════════════════
# SHADCN/UI
# ═══════════════════════════════════════════════════════════

# Adicionar componente
npx shadcn@latest add [componente]

# Listar componentes disponíveis
npx shadcn@latest add

# ═══════════════════════════════════════════════════════════
# SUPABASE
# ═══════════════════════════════════════════════════════════

# Gerar tipos TypeScript
npx supabase gen types typescript --project-id cuowpgsuaylnqntwnnur > src/types/database.ts

# Aplicar migration no Supabase Dashboard
# 1. Ir em SQL Editor
# 2. Colar conteúdo de supabase/migrations/*.sql
# 3. Run

# Aplicar seed
# 1. Ir em SQL Editor
# 2. Colar conteúdo de supabase/seeds/*.sql
# 3. Run
```

---

## 10. Changelog de Implementação

### 10 jan 2026 11:27 — Integração de Dialogs P1

- ✅ Integrados `CreateTemplateDialog`/`EditTemplateDialog` no `CRMTab.tsx`
- ✅ Integrados `CreateCreativeDialog`/`EditCreativeDialog` no `ContentTab.tsx`
- ✅ Integrados `CreateCampaignDialog`/`EditCampaignDialog` no `MediaTab.tsx`

### 10 jan 2026 11:19 — Compactação de Números no Mobile

- ✅ Criado `formatCompactNumber`/`formatCompactCurrency` em `src/lib/utils.ts`
- ✅ KPIs do `ClientWorkspace.tsx` com versões compactas no mobile
- ✅ Resumo do `MediaTab.tsx` com valores compactos e 1 coluna no mobile

### 10 jan 2026 13:03 — Client Approvals fix

- ✅ Corrigido `/client/approvals` para usar campos reais do Supabase
- ✅ Adicionado fallback de tipos e estados de erro no portal do cliente

### 10 jan 2026 12:57 — Today Dashboard + CRUD (Clients/Approvals/Assets)

- ✅ TodayDashboard agora usa hooks reais com estados de erro e priorização por SLA
- ✅ Aprovações: criação/edição integradas ao `ApprovalsTab.tsx`
- ✅ Assets: criação/edição integradas ao `AssetsTab.tsx` + correções de campos
- ✅ Clients: edição/exclusão integradas no `ClientWorkspace.tsx`

### 10 jan 2026 12:34 — Reports com dados reais

- ✅ Migrado `Reports.tsx` para hooks reais (`useClients`, `useLeads`, `useCampaigns`)
- ✅ KPIs e gráficos agora calculados por período/cliente
- ✅ Estados de loading, erro e vazio adicionados
- ✅ Origem dos leads agora exibe percentuais corretos

### 10 jan 2026 11:12 — Responsividade CRM/Ops

- ✅ Pipeline do `CRMTab.tsx` agora usa grid responsivo
- ✅ Kanban do `OperationsTab.tsx` agora usa grid responsivo

### 10 jan 2026 11:10 — Ajuste Tabs no Client Workspace

- ✅ Tabs agora fazem wrap em `ClientWorkspace.tsx`
- ✅ Tipografia compacta nos triggers para mobile

### 10 jan 2026 11:06 — Responsividade Tabs do Workspace

- ✅ Ajustados grids/headers em `WorkflowTimeline.tsx`, `OperationsTab.tsx`, `CRMTab.tsx`, `ApprovalsTab.tsx`, `ContentTab.tsx`
- ✅ Calendário do `ContentTab.tsx` com scroll no mobile
- ✅ Filtros responsivos em `NotesTab.tsx`

### 10 jan 2026 11:01 — Responsividade Clients/Workspace

- ✅ Ajustado layout responsivo em `ClientsList.tsx`
- ✅ Ajustado header e tabs em `ClientWorkspace.tsx`

### 10 jan 2026 10:56 — Responsividade Clients/Settings

- ✅ Ajustado layout responsivo em `ClientsList.tsx`
- ✅ Ajustado layout responsivo em `Settings.tsx`

### 10 jan 2026 10:50 — Correção de Select nos Dialogs

- ✅ Removido `SelectItem value=""` em dialogs de tasks/leads/steps
- ✅ Valor sentinela para "Não atribuído" evita crash do Radix Select

### 10 jan 2026 10:42 — Integração CRM/Tasks + Portal

- ✅ Integrados `CreateTaskDialog`/`EditTaskDialog` no `OperationsTab.tsx`
- ✅ Integrados `CreateLeadDialog`/`EditLeadDialog` no `CRMTab.tsx`
- ✅ Adicionadas colunas Backlog/Revisão e estado de erro nos tabs
- ✅ Corrigido `ClientDashboard.tsx` para usar `user.id` no vínculo
- ✅ Criados `src/lib/supabase.ts` e `src/types/database.ts` (reexports)

### 09 jan 2026 18:47 — Documentação Atualizada

- ✅ Atualizado `implementacao.md` com detalhes técnicos completos
- ✅ Atualizado `pendencias_de_implementacao_velocity_agency_os_v2.md`
- ✅ Criado `conferencia.md` — análise PDR vs implementação

### 09 jan 2026 18:20 — Integração Supabase Backend

- ✅ Instalado `@supabase/supabase-js`
- ✅ Criado `/src/lib/supabase.ts`
- ✅ Criado `/src/types/database.ts`
- ✅ Criado `/supabase/migrations/20260109_initial_schema.sql`
- ✅ Deployed: 21 tabelas, 16 enums, 28 indexes, 5 triggers
- ✅ Habilitado RLS em todas as tabelas
- ✅ Criadas 23 policies de multi-tenancy
- ✅ Criado `/supabase/seeds/demo_data.sql`

### 09 jan 2026 17:40 — Implementação das 10 Abas

- ✅ Criada pasta `/src/components/workspace/`
- ✅ 12 componentes implementados
- ✅ Atualizado `ClientWorkspace.tsx`

### 09 jan 2026 — Branding & UI

- ✅ Integrado `logo.svg` e `favicon.svg`
- ✅ CSS cor primária Velocity Green (#0e7360)

---

## 11. Status Atual

| Área | Progresso | Próximo Passo |
|------|-----------|---------------|
| UI Components | ✅ 100% | — |
| Layout/Navegação | ✅ 100% | — |
| Páginas Agência | ✅ 100% | — |
| Portal Cliente | ⚠️ 80% | Polish |
| Workspace 10 Abas | ✅ 100% | Conectar Supabase |
| Backend Schema | ✅ 95% | — |
| Auth Real | ❌ 0% | Integrar Supabase Auth |
| Hooks Supabase | ❌ 0% | Criar hooks por domínio |
| Workflow Engine | ❌ 0% | Implementar lógica gates |
| Focus Mode | ❌ 0% | Criar componente |
| Edge Functions | ❌ 0% | Criar pasta e funções |
| n8n Integrações | ❌ 0% | Configurar webhooks |

---

## 12. Regras Obrigatórias

### ✅ SEMPRE

1. **Consultar PDR** antes de implementar qualquer funcionalidade
2. **Usar dados mock** até integrar com Supabase
3. **Atualizar este documento** ao implementar features
4. **Usar componentes shadcn/ui** existentes
5. **Seguir padrão de layout** (AppLayout + PageHeader)
6. **Importar com alias @/**
7. **Testar responsividade** (mobile-first)
8. **Tipar tudo** com TypeScript

### ❌ NUNCA

1. **NÃO criar dados hardcoded** — use mockData.ts
2. **NÃO instalar dependências** sem documentar aqui
3. **NÃO alterar rotas** sem atualizar App.tsx
4. **NÃO usar CSS inline** — use Tailwind
5. **NÃO ignorar TypeScript errors**
6. **NÃO bypassar gates** sem documentar motivo
7. **NÃO criar tabelas** sem atualizar migration

---

> [!TIP]
> 📝 **Mantenha este documento atualizado!** Ao implementar qualquer feature, adicione uma entrada no Changelog e atualize as seções relevantes.
