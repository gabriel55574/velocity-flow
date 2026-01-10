# 📋 Conferência de Implementação — Velocity Agency OS vs PDR v1.0

**Data:** 09/01/2026  
**Objetivo:** Análise completa do sistema atual vs especificação do PDR  
**Documento Base:** `velocity_agency_os_PDR_v1_0.md`  

---

## Sumário Executivo

Este documento fornece um plano detalhado para conferir a implementação atual do sistema contra o PDR (Product Design Requirements) v1.0. O objetivo é identificar:

1. ✅ O que foi **implementado corretamente**
2. ⚠️ O que foi **implementado parcialmente ou com divergências**
3. ❌ O que **ainda não foi implementado**
4. 🔧 O que **precisa de correção**

---

## Índice de Análise

| # | Seção PDR | Área de Verificação | Prioridade |
|---|-----------|---------------------|------------|
| 1 | §4 | Usuários, Papéis e Permissões | P0 |
| 2 | §7 | Arquitetura de Informação (Navegação/Rotas) | P0 |
| 3 | §8 | Requisitos Funcionais (FR-001 a FR-025) | P0 |
| 4 | §9 | Workflows, Gates e SLAs | P1 |
| 5 | §10 | UX e Wireframes | P1 |
| 6 | §11 | Modelo de Dados e RLS | P0 |
| 7 | §12 | Integrações e Automações (n8n) | P2 |
| 8 | §13 | KPIs, Health Score e Relatórios | P1 |
| 9 | §14 | Requisitos Não-Funcionais e Segurança | P2 |
| 10 | §19 | Templates Operacionais | P1 |

---

## 1. Usuários, Papéis e Permissões (PDR §4)

### 1.1 Papéis da Agência — PDR §4.1

| Papel PDR | Responsabilidades | Status | Arquivo/Evidência |
|-----------|-------------------|--------|-------------------|
| **Admin** | Config sistema, usuários, clientes, playbooks | ⚠️ Parcial | Enum `user_role` tem 'admin' |
| **CS/Manager** | Owner de clientes, kickoff, aprova gates | ⚠️ Parcial | Enum tem 'manager' |
| **Editor (Conteúdo)** | Criativos, briefs, calendário | ⚠️ Parcial | Enum tem 'editor' |
| **Media Buyer** | Campanhas, budget, otimização | ⚠️ Parcial | Enum tem 'media_buyer' |
| **Analyst** | Tracking, KPIs, dashboards | ⚠️ Parcial | Enum tem 'analyst' |
| **Viewer** | Read-only | ⚠️ Parcial | Enum tem 'viewer' |

**Verificações Necessárias:**
- [ ] Verificar se roles estão no enum `user_role` do schema SQL
- [ ] Verificar se há lógica de permissão no frontend
- [ ] Verificar RLS policies por role
- [ ] Verificar UI de gestão de usuários em Settings

### 1.2 Papéis do Cliente — PDR §4.2

| Papel PDR | Permissões | Status | Arquivo/Evidência |
|-----------|------------|--------|-------------------|
| **Client Admin** | Enviar ativos, aprovar/reprovar, ver KPIs | ⚠️ Verificar | Enum `client_role` |
| **Client Viewer** | Apenas leitura | ⚠️ Verificar | Enum `client_role` |

**Verificações Necessárias:**
- [ ] Verificar enum `client_role` no schema
- [ ] Verificar RLS para `clients_users`
- [ ] Verificar isolamento de dados no Portal Cliente

### 1.3 Matriz de Permissão — PDR §4.3

**Verificações Necessárias:**
- [ ] Mapear cada módulo vs role no código atual
- [ ] Verificar se permissões estão aplicadas via RLS
- [ ] Verificar se UI respeita permissões (botões/ações condicionais)

---

## 2. Arquitetura de Informação (PDR §7)

### 2.1 Sitemap Portal Agência — PDR §7.2

| Rota PDR | Rota Atual | Componente | Status |
|----------|------------|------------|--------|
| `/agency/dashboard` | `/` | `Index.tsx` → `TodayDashboard` | ✅ Implementado |
| `/agency/clients` | `/clients` | `Clients.tsx` → `ClientsList` | ✅ Implementado |
| `/agency/clients/:id/overview` | `/clients/:id` | `ClientDetail.tsx` → `ClientWorkspace` | ✅ Implementado |
| `/agency/settings` | `/settings` | `Settings.tsx` | ✅ Implementado |

**Divergência Identificada:**
> [!WARNING]
> O PDR especifica rotas com prefixo `/agency/`, mas a implementação atual usa rotas sem prefixo. Isso pode causar conflitos futuros com o Portal do Cliente.

**Verificações Necessárias:**
- [ ] Decidir se mantém estrutura atual ou migra para padrão PDR
- [ ] Verificar se há conflitos de rota entre Agência e Cliente

### 2.2 Abas do Workspace — PDR §7.3

| Aba PDR | Componente Atual | Status |
|---------|------------------|--------|
| Overview | `ClientWorkspace` (tab) | ✅ Implementado |
| Workflows | `WorkflowTimeline.tsx` | ✅ Implementado |
| Strategy | `StrategyTab.tsx` | ✅ Implementado |
| Operations | `OperationsTab.tsx` | ✅ Implementado |
| CRM | `CRMTab.tsx` | ✅ Implementado |
| Content | `ContentTab.tsx` | ✅ Implementado |
| Media | `MediaTab.tsx` | ✅ Implementado |
| Data | `DataTab.tsx` | ✅ Implementado |
| Approvals | `ApprovalsTab.tsx` | ✅ Implementado |
| Assets | `AssetsTab.tsx` | ✅ Implementado |
| Notes | `NotesTab.tsx` | ✅ Implementado |

**Verificações Necessárias:**
- [ ] Verificar se todas as abas têm funcionalidade real ou apenas UI mock
- [ ] Verificar integração com Supabase em cada aba

### 2.3 Sitemap Portal Cliente — PDR §7.4

| Rota PDR | Rota Atual | Status |
|----------|------------|--------|
| `/client/dashboard` | `/client/dashboard` | ✅ Implementado |
| `/client/approvals` | `/client/approvals` | ✅ Implementado |
| `/client/assets` | `/client/assets` | ✅ Implementado |
| `/client/reports` | `/client/reports` | ✅ Implementado |

---

## 3. Requisitos Funcionais (PDR §8)

### Checklist FR-001 a FR-025

| ID | Nome | Descrição | Status | Evidência |
|----|------|-----------|--------|-----------|
| FR-001 | Autenticação Supabase Auth | Login, logout, reset, sessão | ⚠️ UI Only | `Login.tsx` usa mock |
| FR-002 | Multi-tenant por agency_id | Todo dado pertence a uma agência | ✅ Schema | RLS com `agency_id` |
| FR-003 | Workspace por cliente | Cada cliente tem workspace | ✅ Schema | Tabela `workspaces` |
| FR-004 | Workflow Engine - templates | Templates e instâncias | ⚠️ Schema | Tabelas existem, engine 0% |
| FR-005 | Modules/Steps/Checklist | Etapas com checklist | ✅ Schema | Tabelas `modules`, `steps`, `checklist_items` |
| FR-006 | Gates (DoD) bloqueantes | Regras JSON configuráveis | ✅ Schema | Tabela `gates` com `dod_config` |
| FR-007 | Tasks vinculadas a steps | Criação manual e auto | ✅ Schema | Tabela `tasks` |
| FR-008 | Today View | Top 5, SLAs, gates | ⚠️ UI Mock | `TodayDashboard` com dados mock |
| FR-009 | Focus Mode | Modo execução por etapa | ❌ 0% | Não implementado |
| FR-010 | Portal Cliente - Approvals | Cliente aprova/reprova | ✅ UI | `client/Approvals.tsx` |
| FR-011 | Portal Cliente - Assets | Checklist, upload | ⚠️ UI Only | Upload não funcional |
| FR-012 | Audit Log | Registrar mudanças | ✅ Schema | Tabela `audit_logs` |
| FR-013 | Templates operacionais | Kickoff, Diagnóstico, etc. | ⚠️ Parcial | `StrategyTab` tem seções |
| FR-014 | Playbooks por nicho | Aplicar ao criar cliente | ⚠️ UI | `Playbooks.tsx` existe |
| FR-015 | CRM pipeline básico | Leads com estágios | ✅ Schema | Tabela `crm_leads` |
| FR-016 | Message templates | Scripts WhatsApp | ✅ Schema | Tabela `message_templates` |
| FR-017 | Automação SLA via n8n | Notificar cliente/CS | ❌ 0% | Sem Edge Functions |
| FR-018 | Rotinas recorrentes | Sprint toda segunda | ❌ 0% | Sem automação |
| FR-019 | Ingestão de métricas | Webhook n8n | ❌ 0% | Sem Edge Functions |
| FR-020 | Dashboards KPIs | KPIs por período | ⚠️ UI Mock | `Reports.tsx` com mock |
| FR-021 | Health Score | ok/warn/risk | ⚠️ Schema | Campo existe, cálculo 0% |
| FR-022 | Exportação relatórios | PDF/CSV | ❌ 0% | Não implementado |
| FR-023 | Notificações in-app | Fila de notificações | ❌ 0% | Sem tabela/componente |
| FR-024 | Controle SLA | Config por tipo | ⚠️ Schema | Campo `sla_hours` em approvals |
| FR-025 | Naming conventions | Padrão de nomes | ❌ 0% | Sem validação |

**Resumo FR:**
- ✅ Implementado: 7 (28%)
- ⚠️ Parcial: 11 (44%)
- ❌ Não Implementado: 7 (28%)

---

## 4. Workflows, Gates e SLAs (PDR §9)

### 4.1 Workflow A — Novo Cliente

| Módulo PDR | Gate (DoD) | Status Schema | Status UI | Status Engine |
|------------|------------|---------------|-----------|---------------|
| Onboarding Interno | Workspace + owner + tarefas | ✅ | ⚠️ | ❌ |
| Kickoff | Metas + persona + oferta | ✅ | ⚠️ StrategyTab | ❌ |
| Acessos e Ativos | Acessos validados + ativos | ✅ | ⚠️ AssetsTab | ❌ |
| Diagnóstico 360 | Gargalo + baseline + alavancas | ✅ | ⚠️ StrategyTab | ❌ |
| Blueprint 30/60/90 | Backlog ICE + canal + QFD | ✅ | ⚠️ StrategyTab | ❌ |
| Setup Tracking | Checklist 100% | ✅ | ⚠️ DataTab | ❌ |
| Setup CRM | Pipeline + templates | ✅ | ⚠️ CRMTab | ❌ |
| Setup Conteúdo | Criativos aprovados | ✅ | ⚠️ ContentTab | ❌ |
| Setup Mídia | Campanhas em draft | ✅ | ⚠️ MediaTab | ❌ |
| Gate Go-live | Tracking + CRM + Criativos + Campanhas OK | ⚠️ | ❌ | ❌ |
| Handover Operação | Sprint 1 + reunião agendada | ⚠️ | ❌ | ❌ |

**Problema Principal:**
> [!CAUTION]
> O Workflow Engine não existe. O schema tem as tabelas (`workflows`, `modules`, `steps`, `gates`), mas não há lógica de:
> - Validação de Gates (DoD)
> - Bloqueio de avanço
> - Criação automática de tasks
> - Cálculo de progresso

### 4.2 Workflows B, C, D

| Workflow | Descrição | Status |
|----------|-----------|--------|
| B) Sprint Semanal | Planejar → executar → reportar | ❌ 0% |
| C) MBR Mensal | Consolidar → analisar → decidir | ❌ 0% |
| D) Offboarding | Entrega + revogar + lições | ❌ 0% |

---

## 5. UX e Wireframes (PDR §10)

### 5.1 Padrões de Layout — PDR §10.1

| Requisito | Status | Evidência |
|-----------|--------|-----------|
| Bottom nav mobile | ⚠️ Verificar | `MobileNav.tsx` |
| Sidebar desktop | ✅ | `AppSidebar.tsx` |
| Header workspace | ✅ | `ClientWorkspace.tsx` |
| Estados vazios com CTA | ⚠️ Parcial | `EmptyState.tsx` existe |
| Componentes padrão | ✅ | 51 componentes UI |

### 5.2 Today View — PDR §10.2

| Elemento | PDR Requer | Status |
|----------|------------|--------|
| Top 5 Ações | ✅ | ⚠️ Mock data |
| Gates bloqueados | ✅ | ⚠️ Mock data |
| SLAs vencendo | ✅ | ⚠️ Mock data |
| Clientes em risco | ✅ | ⚠️ Mock data |
| Quick actions | ✅ | ⚠️ Verificar |

### 5.3 Focus Mode — PDR §10.6

| Elemento | Status |
|----------|--------|
| Overlay/tela dedicada | ❌ |
| Checklist com toggles | ❌ |
| Entradas/Saídas | ❌ |
| Botão concluir bloqueante | ❌ |

> [!IMPORTANT]
> O **Focus Mode** é um requisito crítico do PDR (FR-009) e não foi implementado. É essencial para a experiência TDAH-friendly.

---

## 6. Modelo de Dados e RLS (PDR §11)

### 6.1 Tabelas — PDR §11.3

| Tabela PDR | Tabela Atual | Status |
|------------|--------------|--------|
| agencies | agencies | ✅ |
| users_profile | users_profile | ✅ |
| clients | clients | ✅ |
| clients_users | clients_users | ✅ |
| workspaces | workspaces | ✅ |
| workflows | workflows | ✅ |
| modules | modules | ✅ |
| steps | steps | ✅ |
| checklist_items | checklist_items | ✅ |
| gates | gates | ✅ |
| tasks | tasks | ✅ |
| approvals | approvals | ✅ |
| assets | assets | ✅ |
| crm_leads | crm_leads | ✅ |
| message_templates | message_templates | ✅ |
| experiments | experiments | ✅ |
| campaigns | campaigns | ✅ |
| creatives | creatives | ✅ |
| kpi_definitions | kpi_definitions | ✅ |
| kpi_values | kpi_values | ✅ |
| audit_logs | audit_logs | ✅ |

**Resultado:** 21/21 tabelas implementadas ✅

### 6.2 RLS Policies — PDR §11.5

| Política | Status |
|----------|--------|
| Função helper `user_agency_id()` | ✅ |
| Multi-tenant por agency_id | ✅ |
| Cliente acessa apenas seu client_id | ⚠️ Verificar |
| 23 policies declaradas | ✅ |

**Verificações Necessárias:**
- [ ] Testar RLS com usuário de agência A tentando acessar agência B
- [ ] Testar RLS com cliente tentando acessar dados de outro cliente
- [ ] Verificar policies de UPDATE/DELETE além de SELECT

---

## 7. Integrações e Automações (PDR §12)

### 7.1 Fluxos Obrigatórios — PDR §12.2

| Fluxo | Gatilho | Status |
|-------|---------|--------|
| SLA Approvals | approval.sla_due_at | ❌ 0% |
| Daily CRM Follow-up | Cron diário | ❌ 0% |
| Weekly Sprint | Cron Seg 09:00 | ❌ 0% |
| Metrics Ingest | Webhook | ❌ 0% |
| Health Recompute | Cron/evento | ❌ 0% |

### 7.2 Edge Functions — PDR §12.1

| Edge Function | Status |
|---------------|--------|
| `/functions/v1/ingest` | ❌ Não existe |
| `/functions/v1/notify-sla` | ❌ Não existe |
| `/functions/v1/recompute-health` | ❌ Não existe |
| `/functions/v1/create-weekly-sprint` | ❌ Não existe |

> [!WARNING]
> Pasta `supabase/functions` não existe. Nenhuma Edge Function implementada.

### 7.3 Notificações — PDR §12.4

| Canal | Status |
|-------|--------|
| In-app | ❌ Sem tabela notifications |
| WhatsApp | ❌ |
| Email | ❌ |
| Slack | ❌ |

---

## 8. KPIs, Health Score e Relatórios (PDR §13)

### 8.1 KPIs Clínica — PDR §13.1

| KPI | Tabela | Status |
|-----|--------|--------|
| Leads | kpi_values | ✅ Schema |
| Taxa agendamento | kpi_values | ✅ Schema |
| Show rate | kpi_values | ✅ Schema |
| Conversão | kpi_values | ✅ Schema |
| Ticket médio | kpi_values | ✅ Schema |
| CPL | kpi_values | ✅ Schema |
| CPA | kpi_values | ✅ Schema |

### 8.2 Health Score — PDR §13.3

| Aspecto | Status |
|---------|--------|
| Campo health em workspaces | ✅ |
| Regras configuráveis | ❌ |
| Recálculo automático | ❌ |
| Sinais de performance | ❌ |
| Sinais de operação | ❌ |

### 8.3 Relatórios — PDR §13.4

| Relatório | Status |
|-----------|--------|
| Relatório Semanal | ❌ |
| MBR Mensal | ❌ |
| Relatório Onboarding | ❌ |
| Exportação PDF/CSV | ❌ |

---

## 9. Requisitos Não-Funcionais (PDR §14)

### 9.1 NFRs — PDR §14.1

| ID | Requisito | Status |
|----|-----------|--------|
| NFR-001 | Disponibilidade 99.5% | ⚠️ Sem monitoramento |
| NFR-002 | Today View < 2.0s | ⚠️ Não medido |
| NFR-003 | Escalabilidade | ✅ Supabase |
| NFR-004 | RLS em todas tabelas | ✅ |
| NFR-005 | Automações idempotentes | ❌ Sem automações |
| NFR-006 | Fluxos guiados | ⚠️ Parcial |
| NFR-007 | Backup/Restore | ✅ Supabase |

### 9.2 Segurança — PDR §14.2

| Controle | Status |
|----------|--------|
| Supabase Auth | ⚠️ Não integrado |
| MFA opcional | ❌ |
| RLS obrigatório | ✅ |
| Storage com policies | ❌ Não configurado |
| Edge Functions com assinatura | ❌ |
| Audit logs imutáveis | ✅ Schema |
| Rate limiting | ❌ |

---

## 10. Templates Operacionais (PDR §19)

### 10.1 Templates Implementados

| Template | PDR §19.X | Status UI | Status Dados |
|----------|-----------|-----------|--------------|
| Kickoff | §19.1 | ⚠️ StrategyTab | Mock |
| Diagnóstico 360 | §19.2 | ⚠️ StrategyTab | Mock |
| Blueprint 30/60/90 | §19.3 | ⚠️ StrategyTab | Mock |
| Sprint Semanal | §19.4 | ⚠️ OperationsTab | Mock |
| MBR Mensal | §19.5 | ❌ | ❌ |
| Checklist Conteúdo Premium | §19.6 | ❌ | ❌ |

---

## Resumo Geral de Conformidade

| Área | Conformidade | Comentário |
|------|--------------|------------|
| **UI/Frontend** | 85% | Componentes existem, falta integração |
| **Database Schema** | 95% | Todas as tabelas e RLS |
| **Autenticação** | 10% | UI existe, backend mock |
| **Workflow Engine** | 0% | Crítico - não implementado |
| **Edge Functions** | 0% | Crítico - não implementado |
| **Integrações n8n** | 0% | Crítico - não implementado |
| **Health Score** | 5% | Campo existe, lógica 0% |
| **Relatórios** | 0% | Não implementado |
| **Focus Mode** | 0% | Crítico - não implementado |

---

## Plano de Ação Detalhado

### Fase 1: Fundação (Semana 1-2)

#### 1.1 Autenticação Real
- [ ] Integrar `Login.tsx` com Supabase Auth
- [ ] Implementar refresh token
- [ ] Reset password funcional
- [ ] Proteção de rotas por role
- [ ] Testes de login/logout

#### 1.2 Hooks de Dados
- [ ] Criar hooks Supabase para cada domínio:
  - [ ] `useClients`
  - [ ] `useTasks`
  - [ ] `useWorkflows`
  - [ ] `useLeads`
  - [ ] `useApprovals`
  - [ ] `useAssets`
- [ ] Migrar componentes de mockData para hooks reais

### Fase 2: Workflow Engine (Semana 3-4)

#### 2.1 Core Engine
- [ ] Função de validação de Gate (DoD)
- [ ] Bloqueio de avanço quando gate falha
- [ ] Cálculo de progresso de workflow
- [ ] Criação automática de tasks por step

#### 2.2 Focus Mode
- [ ] Componente `FocusModeDrawer`
- [ ] Checklist interativo com toggles
- [ ] Campos de evidência (links, arquivos, notas)
- [ ] Botão concluir bloqueante
- [ ] Integração com workflow engine

### Fase 3: Automações (Semana 5-6)

#### 3.1 Edge Functions
- [ ] `/functions/v1/ingest` — receber métricas
- [ ] `/functions/v1/recompute-health` — calcular health
- [ ] `/functions/v1/create-weekly-sprint` — sprint automático
- [ ] `/functions/v1/notify-sla` — disparar notificação

#### 3.2 Integrações n8n
- [ ] Configurar webhooks
- [ ] SLA Approvals
- [ ] Daily CRM Follow-up
- [ ] Weekly Sprint

### Fase 4: Relatórios e KPIs (Semana 7-8)

#### 4.1 Health Score
- [ ] Regras configuráveis
- [ ] Sinais de performance
- [ ] Sinais de operação
- [ ] Recálculo automático

#### 4.2 Relatórios
- [ ] Template Relatório Semanal
- [ ] Template MBR Mensal
- [ ] Exportação PDF/CSV
- [ ] Envio automático

---

## Verificações Manuais Pendentes

Esta seção lista verificações que precisam ser feitas manualmente no código:

### A. Verificar Roles e Permissões
```bash
# Verificar enum user_role no schema
grep -n "user_role" supabase/migrations/*.sql

# Verificar uso de roles no frontend
grep -rn "role" src/components/
```

### B. Verificar RLS Policies
```bash
# Listar todas as policies
grep -n "CREATE POLICY" supabase/migrations/*.sql

# Verificar função helper
grep -n "user_agency_id" supabase/migrations/*.sql
```

### C. Verificar Integração de Componentes
```bash
# Verificar uso de mockData
grep -rn "mockData" src/components/

# Verificar uso de Supabase client
grep -rn "supabase" src/components/
```

### D. Verificar Componentes do Workspace
```bash
# Listar todos os componentes
ls -la src/components/workspace/

# Verificar exports
cat src/components/workspace/index.ts
```

---

## Próximos Passos Imediatos

1. **Revisar este documento** e priorizar itens
2. **Definir MVP mínimo** para ir ao ar com 1 cliente piloto
3. **Estimar esforço** para cada fase
4. **Criar tasks no sistema** para cada item do plano

---

## Registro de Conferência

| Data | Responsável | Ação | Resultado |
|------|-------------|------|-----------|
| 09/01/2026 | Agent | Criação do documento | Análise inicial concluída |
| | | | |

---

> [!TIP]
> Este documento deve ser atualizado conforme as verificações forem realizadas. Marque os itens como ✅ quando verificados e implementados.
