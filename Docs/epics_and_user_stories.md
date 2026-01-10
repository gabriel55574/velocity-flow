# 🎯 Epics & User Stories — Velocity Agency OS

**Documento Base:** `velocity_agency_os_PDR_v1_0.md`  
**Data:** 09/01/2026  
**Status Legend:** ✅ Implementado | ⚠️ Parcial | ❌ Pendente

---

## ⚠️ PRIORIDADE ABSOLUTA: USABILIDADE

> [!CAUTION]
> **O sistema atualmente NÃO possui CRUD funcional em nenhuma entidade.**  
> Todos os dados vêm de `mockData.ts`. Sem CRUD, o sistema não é usável.  
> O **Epic 0** deve ser implementado PRIMEIRO antes de qualquer outra funcionalidade.

---

## Visão Geral

Este documento organiza todos os requisitos do PDR em **Epics** e **User Stories** estruturadas, considerando o estado atual da implementação.

### Resumo de Epics

| # | Epic | Descrição | Status | Prioridade |
|---|------|-----------|--------|------------|
| **E0** | **CRUD Fundamental** | **Operações básicas para todas entidades** | **⚠️ 75%** | **P0 CRÍTICO** |
| E1 | Autenticação e Usuários | Login, roles, permissões | ⚠️ 20% | P0 |
| E2 | Gestão de Clientes | CRUD clientes, workspaces | ⚠️ 70% | P0 |
| E3 | Workflow Engine | Módulos, steps, gates, DoD | ⚠️ 30% | P0 |
| E4 | Today View & Focus Mode | Dashboard TDAH-friendly | ⚠️ 50% | P0 |
| E5 | Portal do Cliente | Aprovações, assets, reports | ⚠️ 80% | P1 |
| E6 | CRM & Pipeline | Leads, templates, follow-up | ⚠️ 60% | P1 |
| E7 | Conteúdo & Criativos | Calendário, aprovação criativos | ⚠️ 60% | P1 |
| E8 | Mídia & Campanhas | Campanhas, budget, KPIs | ⚠️ 50% | P1 |
| E9 | Dados & KPIs | Tracking, health score | ⚠️ 30% | P1 |
| E10 | Automações & Integrações | Edge functions, n8n, notificações | ❌ 0% | P2 |
| E11 | Relatórios | Semanal, MBR, exportação | ❌ 0% | P2 |
| E12 | Playbooks | Templates, scripts, checklists | ⚠️ 40% | P2 |

---

## 🟡 Epic 0: CRUD Fundamental (EM PROGRESSO)

> **Status:** ⚠️ 75%  
> **Prioridade:** P0 — MÁXIMA  
> **Descrição:** Hooks Supabase e Dialogs P0+P1 implementados. Falta integração, P2 e migração de mocks.

### O Que Precisa de CRUD

| Entidade | Hook | Create | Read | Update | Delete | Dialog | Status |
|----------|:----:|:------:|:----:|:------:|:------:|:------:|--------|
| **Clients** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P0 | **80%** |
| **Tasks** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P0 | **80%** |
| **Leads (CRM)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P0 | **80%** |
| **Approvals** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P0 | **80%** |
| **Assets** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ P0 | **80%** |
| **Creatives** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ P1 | **40%** |
| **Campaigns** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ P1 | **40%** |
| **Message Templates** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ P1 | **40%** |
| **Users** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ P1 | **40%** |
| **Workflows** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ P1 | **40%** |
| **KPIs** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ P2 | **30%** |
| **Experiments** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ P2 | **30%** |

### US 0.1 — Hooks Supabase por Entidade ✅ COMPLETO

**Como** desenvolvedor,  
**Quero** ter hooks TanStack Query para cada entidade,  
**Para que** qualquer componente possa fazer CRUD.

**Status:** ✅ 17 hooks implementados cobrindo 21 tabelas

**Hooks a criar:**

```
src/hooks/
├── useClients.ts        # CRUD clients + workspace
├── useTasks.ts          # CRUD tasks
├── useLeads.ts          # CRUD crm_leads
├── useApprovals.ts      # CRUD approvals
├── useAssets.ts         # CRUD assets
├── useCreatives.ts      # CRUD creatives
├── useCampaigns.ts      # CRUD campaigns
├── useTemplates.ts      # CRUD message_templates
├── useUsers.ts          # CRUD users_profile
├── useNotes.ts          # CRUD notes (se tabela existir)
├── useWorkflows.ts      # CRUD workflows + modules + steps
└── useKPIs.ts           # Read kpi_values
```

**Critérios de Aceite por hook:**
- [ ] `useXxx()` — lista todos (com filtros)
- [ ] `useXxx(id)` — busca por ID
- [ ] `useCreateXxx()` — mutation para criar
- [ ] `useUpdateXxx()` — mutation para atualizar
- [ ] `useDeleteXxx()` — mutation para deletar
- [ ] Invalidação de cache após mutações
- [ ] Tipos TypeScript corretos

**Template de hook:**

```typescript
// src/hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

// LIST
export function useClients(filters?: { status?: string; health?: string }) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async () => {
      let query = supabase.from('clients').select('*, workspaces(*)');
      if (filters?.status) query = query.eq('status', filters.status);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });
}

// GET BY ID
export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*, workspaces(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

// CREATE
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

// UPDATE
export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: ClientUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', data.id] });
    }
  });
}

// DELETE
export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });
}
```

---

### US 0.2 — UI de Criar/Editar Clientes ✅ COMPLETO

**Como** Admin ou Manager,  
**Quero** criar e editar clientes pelo sistema,  
**Para que** eu não precise inserir dados manualmente no banco.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/clients/`

**Critérios de Aceite:**
- [x] Modal/Dialog com formulário
- [x] Campos: Nome, Slug, Nicho, Status
- [x] Validação com Zod
- [x] Auto-geração de slug
- [x] Toast de sucesso/erro
- [x] Fechar modal após salvar
- [ ] Integrar na ClientsList.tsx

---

### US 0.3 — UI de Criar/Editar Tasks ✅ COMPLETO

**Como** usuário,  
**Quero** criar, editar e excluir tasks,  
**Para que** eu gerencie meu trabalho.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/tasks/`

**Critérios de Aceite:**
- [x] Modal com formulário
- [x] Campos: Título, Descrição, Status, Prioridade, Responsável, Due Date
- [x] Excluir com confirmação (AlertDialog)
- [ ] Integrar no OperationsTab.tsx

---

### US 0.4 — UI de Criar/Editar Leads ✅ COMPLETO

**Como** usuário,  
**Quero** criar, editar e mover leads no pipeline,  
**Para que** eu gerencie o CRM.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/leads/`

**Critérios de Aceite:**
- [x] Modal com formulário
- [x] Campos: Nome, Telefone, Email, Origem, Stage, Score, Notas
- [x] Excluir com confirmação
- [ ] Integrar no CRMTab.tsx

---

### US 0.5 — UI de Solicitar/Gerenciar Aprovações ✅ COMPLETO

**Como** usuário da agência,  
**Quero** criar solicitações de aprovação,  
**Para que** o cliente possa aprovar/reprovar.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/approvals/`

**Critérios de Aceite:**
- [x] Modal: Tipo, Título, Descrição, Arquivo URL, Prazo
- [x] Aprovar/Rejeitar/Solicitar Revisão
- [x] Campo de feedback obrigatório para rejeição
- [ ] Integrar no ApprovalsTab.tsx

---

### US 0.6 — UI de Upload de Assets ✅ COMPLETO

**Como** cliente ou agência,  
**Quero** fazer upload de arquivos,  
**Para que** os assets fiquem centralizados.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/assets/`

**Critérios de Aceite:**
- [x] Drag-and-drop upload
- [x] Detecção automática de tipo
- [x] Suporte a URL externa
- [x] Preview de imagem
- [x] Copiar URL
- [ ] Integrar no AssetsTab.tsx

---

### US 0.7 — UI de Criar/Editar Criativos ✅ COMPLETO

**Como** Editor,  
**Quero** cadastrar criativos com upload,  
**Para que** eles entrem no fluxo de aprovação.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/creatives/`

**Critérios de Aceite:**
- [x] Dialog de criação com tipo, plataforma, formato, copy
- [x] Dialog de edição com status e exclusão
- [ ] Integrar no ContentTab.tsx

---

### US 0.8 — UI de Criar/Editar Campanhas ✅ COMPLETO

**Como** Media Buyer,  
**Quero** cadastrar campanhas,  
**Para que** eu controle mídia paga.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/campaigns/`

**Critérios de Aceite:**
- [x] Dialog de criação com plataforma, budget, datas
- [x] Dialog de edição com cálculo de uso de budget
- [ ] Integrar no MediaTab.tsx

---

### US 0.9 — UI de Gerenciar Templates de Mensagem ✅ COMPLETO

**Como** usuário,  
**Quero** criar, editar e excluir templates de mensagem,  
**Para que** eu personalize os scripts.

**Status:** ✅ Dialogs implementados em `src/components/dialogs/templates/`

**Critérios de Aceite:**
- [x] Dialog de criação com canal e categoria
- [x] Dialog de edição com botão de copiar
- [ ] Integrar no CRMTab.tsx

---

### US 0.10 — Migrar Componentes de Mock para Hooks ❌

**Como** desenvolvedor,  
**Quero** substituir importações de mockData por hooks reais,  
**Para que** o sistema use dados do Supabase.

**Componentes a migrar:**

| Componente | Mock Usado | Hook Necessário |
|------------|------------|-----------------|
| `ClientsList.tsx` | mockClients | useClients |
| `ClientWorkspace.tsx` | mockClients | useClient |
| `TodayDashboard.tsx` | mockTasks, mockApprovals | useTasks, useApprovals |
| `OperationsTab.tsx` | mockTasks | useTasks |
| `CRMTab.tsx` | mockLeads, mockMessageTemplates | useLeads, useTemplates |
| `ContentTab.tsx` | mockCreatives | useCreatives |
| `MediaTab.tsx` | mockCampaigns | useCampaigns |
| `ApprovalsTab.tsx` | mockApprovals | useApprovals |
| `AssetsTab.tsx` | mockAssets | useAssets |
| `NotesTab.tsx` | mockNotes | useNotes |
| `Reports.tsx` | mockKPIs | useKPIs |

**Critérios de Aceite:**
- [ ] Substituir `import { mockX } from @/data/mockData`
- [ ] Usar `const { data, isLoading, error } = useX()`
- [ ] Exibir loading state (skeleton)
- [ ] Exibir error state
- [ ] Exibir empty state
- [ ] Funcionar com dados reais

---

### Checklist de CRUD por Entidade

Use este checklist para acompanhar o progresso:

#### Clients
- [ ] Hook `useClients` criado
- [ ] Hook testado (console.log)
- [ ] `CreateClientDialog.tsx` criado
- [ ] `EditClientDialog.tsx` criado
- [ ] `ClientsList.tsx` usando hook
- [ ] Create funcional
- [ ] Update funcional
- [ ] Delete funcional

#### Tasks
- [ ] Hook `useTasks` criado
- [ ] Hook testado
- [ ] `CreateTaskDialog.tsx` criado
- [ ] `OperationsTab.tsx` usando hook
- [ ] CRUD funcional

#### Leads
- [ ] Hook `useLeads` criado
- [ ] Hook testado
- [ ] `CreateLeadDialog.tsx` criado
- [ ] `CRMTab.tsx` usando hook
- [ ] Move stage funcional
- [ ] CRUD funcional

#### Approvals
- [ ] Hook `useApprovals` criado
- [ ] Hook testado
- [ ] `CreateApprovalDialog.tsx` criado
- [ ] `ApprovalsTab.tsx` usando hook
- [ ] Approve/Reject funcional
- [ ] CRUD funcional

#### Assets
- [ ] Hook `useAssets` criado
- [ ] Supabase Storage configurado
- [ ] `FileUpload.tsx` criado
- [ ] `AssetsTab.tsx` usando hook
- [ ] Upload funcional
- [ ] CRUD funcional

#### Creatives
- [ ] Hook `useCreatives` criado
- [ ] `CreateCreativeDialog.tsx` criado
- [ ] `ContentTab.tsx` usando hook
- [ ] CRUD funcional

#### Campaigns
- [ ] Hook `useCampaigns` criado
- [ ] `CreateCampaignDialog.tsx` criado
- [ ] `MediaTab.tsx` usando hook
- [ ] CRUD funcional

#### Message Templates
- [ ] Hook `useTemplates` criado
- [ ] `MessageTemplatesManager.tsx` criado
- [ ] `CRMTab.tsx` usando hook
- [ ] CRUD funcional

---

## Epic 1: Autenticação e Usuários

> **PDR Ref:** §4 (Usuários, papéis e permissões), §8 FR-001, FR-002

### Status: ⚠️ 20% (UI existe, backend mock)

### User Stories

#### US 1.1 — Login com Supabase Auth ❌
**Como** usuário da agência,  
**Quero** fazer login com email e senha,  
**Para que** eu possa acessar o sistema de forma segura.

**Critérios de Aceite:**
- [ ] Formulário de login funcional
- [ ] Validação de credenciais via Supabase Auth
- [ ] Mensagem de erro clara para credenciais inválidas
- [ ] Redirecionamento para Dashboard após login
- [ ] Persistência de sessão (refresh token)

**Arquivos:**
- `src/pages/auth/Login.tsx` (modificar)
- `src/lib/supabase.ts` (usar)

---

#### US 1.2 — Logout ❌
**Como** usuário logado,  
**Quero** fazer logout,  
**Para que** eu possa encerrar minha sessão com segurança.

**Critérios de Aceite:**
- [ ] Botão de logout no menu do usuário
- [ ] Limpar sessão no Supabase
- [ ] Redirecionamento para Login
- [ ] Limpar dados em cache (TanStack Query)

**Arquivos:**
- `src/components/layout/AppSidebar.tsx` (modificar)

---

#### US 1.3 — Reset de Senha ❌
**Como** usuário que esqueceu a senha,  
**Quero** recuperar minha senha por email,  
**Para que** eu possa acessar o sistema novamente.

**Critérios de Aceite:**
- [ ] Formulário de reset funcional
- [ ] Email enviado via Supabase Auth
- [ ] Página de confirmação de nova senha
- [ ] Feedback de sucesso/erro

**Arquivos:**
- `src/pages/auth/ResetPassword.tsx` (modificar)

---

#### US 1.4 — Proteção de Rotas ❌
**Como** administrador,  
**Quero** que rotas sejam protegidas por autenticação,  
**Para que** usuários não autenticados não acessem o sistema.

**Critérios de Aceite:**
- [ ] Rotas da agência requerem login
- [ ] Rotas do portal cliente requerem login de cliente
- [ ] Redirecionamento automático para Login
- [ ] Loading state durante verificação de auth

**Arquivos:**
- `src/App.tsx` (modificar)
- `src/contexts/AuthContext.tsx` (criar)

---

#### US 1.5 — Gestão de Roles (Agência) ⚠️
**Como** admin,  
**Quero** atribuir papéis aos usuários (Admin, Manager, Editor, Media Buyer, Analyst, Viewer),  
**Para que** cada um tenha acesso apropriado ao sistema.

**Critérios de Aceite:**
- [ ] UI para visualizar usuários em Settings
- [ ] UI para editar role de usuário
- [ ] Validação de permissões no frontend
- [ ] RLS aplicado no backend (já existe)

**Arquivos:**
- `src/pages/Settings.tsx` (modificar tab Usuários)
- `src/hooks/useUsers.ts` (criar)

---

#### US 1.6 — Roles do Cliente (Portal) ❌
**Como** cliente,  
**Quero** que meus colaboradores tenham acesso ao portal com diferentes níveis,  
**Para que** eu controle quem pode aprovar e quem só visualiza.

**Critérios de Aceite:**
- [ ] Client Admin: pode aprovar, enviar assets
- [ ] Client Viewer: apenas visualização
- [ ] RLS aplicado para isolar dados do cliente

**Arquivos:**
- Tabela `clients_users` (já existe)
- RLS policies (já existem)

---

## Epic 2: Gestão de Clientes

> **PDR Ref:** §8 FR-003, §7.3

### Status: ⚠️ 70% (UI completa, dados mock)

### User Stories

#### US 2.1 — Listar Clientes ✅ UI | ❌ Backend
**Como** usuário da agência,  
**Quero** ver a lista de todos os clientes,  
**Para que** eu possa navegar entre eles.

**Critérios de Aceite:**
- [x] Grid/tabela de clientes
- [x] Filtros por health, fase, owner
- [x] Busca por nome
- [ ] Dados vindos do Supabase (não mock)
- [ ] Paginação

**Arquivos:**
- `src/components/clients/ClientsList.tsx` (modificar)
- `src/hooks/useClients.ts` (criar)

---

#### US 2.2 — Criar Cliente ⚠️
**Como** Admin ou Manager,  
**Quero** criar um novo cliente,  
**Para que** eu possa iniciar o onboarding dele.

**Critérios de Aceite:**
- [ ] Modal/drawer de criação
- [ ] Campos: nome, nicho, contato, logo
- [ ] Aplicar playbook ao criar
- [ ] Criar workspace automaticamente
- [ ] Criar workflow "Novo Cliente" automaticamente

**Arquivos:**
- `src/components/clients/CreateClientDialog.tsx` (criar)
- `src/hooks/useClients.ts` (mutation create)

---

#### US 2.3 — Visualizar Workspace ✅ UI | ⚠️ Backend
**Como** usuário da agência,  
**Quero** acessar o workspace de um cliente com todas as abas,  
**Para que** eu possa gerenciar todas as áreas do cliente.

**Critérios de Aceite:**
- [x] 10 abas funcionais (Overview, Workflows, Strategy, etc.)
- [x] Header com nome, fase, health
- [ ] Dados reais do Supabase em cada aba
- [ ] Tab ativa persistida na URL

**Arquivos:**
- `src/components/clients/ClientWorkspace.tsx` (modificar)
- Todos os componentes em `src/components/workspace/` (modificar)

---

#### US 2.4 — Editar Cliente ❌
**Como** Admin ou Manager,  
**Quero** editar informações do cliente,  
**Para que** eu mantenha os dados atualizados.

**Critérios de Aceite:**
- [ ] Modal/drawer de edição
- [ ] Campos editáveis: nome, nicho, contato, logo, status
- [ ] Histórico de mudanças (audit log)

**Arquivos:**
- `src/components/clients/EditClientDialog.tsx` (criar)
- `src/hooks/useClients.ts` (mutation update)

---

#### US 2.5 — Pausar/Arquivar Cliente ❌
**Como** Admin,  
**Quero** pausar ou arquivar um cliente,  
**Para que** ele não apareça na lista ativa.

**Critérios de Aceite:**
- [ ] Ação de pausar (status = paused)
- [ ] Ação de arquivar (status = churned)
- [ ] Filtro para mostrar/ocultar pausados

**Arquivos:**
- `src/hooks/useClients.ts` (mutation update status)

---

## Epic 3: Workflow Engine

> **PDR Ref:** §8 FR-004, FR-005, FR-006, FR-007, §9

### Status: ⚠️ 30% (Schema existe, lógica 0%)

### User Stories

#### US 3.1 — Visualizar Timeline do Workflow ✅ UI | ❌ Backend
**Como** usuário da agência,  
**Quero** ver a timeline visual do workflow do cliente,  
**Para que** eu entenda em qual fase ele está.

**Critérios de Aceite:**
- [x] Timeline visual com módulos
- [x] Indicador de status por módulo
- [x] Indicador de progresso
- [ ] Dados reais do Supabase
- [ ] Cálculo de progresso real

**Arquivos:**
- `src/components/workspace/WorkflowTimeline.tsx` (modificar)
- `src/hooks/useWorkflows.ts` (criar)

---

#### US 3.2 — Expandir Módulo e Ver Steps ✅ UI | ❌ Backend
**Como** usuário da agência,  
**Quero** expandir um módulo e ver seus steps,  
**Para que** eu saiba o que precisa ser feito.

**Critérios de Aceite:**
- [x] Card expansível por módulo
- [x] Lista de steps com status
- [x] Indicador de owner e SLA
- [ ] Dados reais do Supabase

**Arquivos:**
- `src/components/workspace/ModuleCard.tsx` (modificar)

---

#### US 3.3 — Validar Gate (Definition of Done) ❌
**Como** sistema (ou usuário clicando),  
**Quero** validar se o gate do módulo foi cumprido,  
**Para que** o módulo só avance quando os requisitos forem atendidos.

**Critérios de Aceite:**
- [ ] Função `validateGate()` implementada
- [ ] Verificar todos steps completed
- [ ] Verificar checklist items required marcados
- [ ] Atualizar status do gate (passed/failed)
- [ ] Exibir motivo de falha se houver

**Arquivos:**
- `src/lib/workflowEngine.ts` (criar)
- `src/hooks/useWorkflowEngine.ts` (criar)
- `src/components/workspace/GateStatus.tsx` (modificar)

---

#### US 3.4 — Bloquear Avanço se Gate Falhar ❌
**Como** usuário,  
**Quero** ser impedido de avançar se o gate não passou,  
**Para que** eu não pule etapas críticas.

**Critérios de Aceite:**
- [ ] Botão "Avançar" desabilitado se gate = failed
- [ ] Mensagem explicando o que falta
- [ ] Visual claro de bloqueio

**Arquivos:**
- `src/components/workspace/ModuleCard.tsx` (modificar)
- `src/components/workspace/GateStatus.tsx` (modificar)

---

#### US 3.5 — Marcar Step como Concluído ❌
**Como** usuário responsável,  
**Quero** marcar um step como concluído,  
**Para que** o progresso seja registrado.

**Critérios de Aceite:**
- [ ] Botão de concluir no step
- [ ] Apenas se todos checklist required estiverem marcados
- [ ] Registrar completed_at e completed_by
- [ ] Revalidar gate do módulo automaticamente

**Arquivos:**
- `src/lib/workflowEngine.ts` (função completeStep)
- `src/hooks/useSteps.ts` (criar)

---

#### US 3.6 — Focus Mode para Executar Step ❌
**Como** usuário,  
**Quero** entrar em Focus Mode para executar um step,  
**Para que** eu me concentre apenas naquela tarefa.

**Critérios de Aceite:**
- [ ] Drawer/Sheet lateral com detalhes do step
- [ ] Checklist interativo (toggles)
- [ ] Campos de evidência (links, notas)
- [ ] Progress bar de conclusão
- [ ] Botão concluir bloqueante
- [ ] Fechar ao concluir

**Arquivos:**
- `src/components/workspace/FocusModeDrawer.tsx` (criar)
- Integrar em `WorkflowTimeline.tsx`

---

#### US 3.7 — Criar Tasks a partir de Steps ❌
**Como** sistema,  
**Quero** criar tasks automaticamente a partir dos steps,  
**Para que** apareçam no Today View e Kanban.

**Critérios de Aceite:**
- [ ] Ao criar workflow, gerar tasks para steps iniciais
- [ ] Task com referência ao step_id
- [ ] Task herda owner e due_at do step

**Arquivos:**
- `src/lib/workflowEngine.ts` (função createTasksFromWorkflow)

---

## Epic 4: Today View & Focus Mode

> **PDR Ref:** §8 FR-008, FR-009, §10.2

### Status: ⚠️ 50% (UI existe, dados mock)

### User Stories

#### US 4.1 — Top 5 Ações Prioritárias ⚠️
**Como** usuário da agência,  
**Quero** ver minhas top 5 ações do dia,  
**Para que** eu saiba por onde começar.

**Critérios de Aceite:**
- [x] Seção "Top 5 Ações" no dashboard
- [x] Cards de ação com botão "Fazer agora"
- [ ] Dados reais (tasks por prioridade + due_at)
- [ ] Botão abre Focus Mode ou navega para item

**Arquivos:**
- `src/components/dashboard/TodayDashboard.tsx` (modificar)
- `src/hooks/useTasks.ts` (filtrar prioridade)

---

#### US 4.2 — Gates Bloqueados ⚠️
**Como** Manager,  
**Quero** ver quais gates estão bloqueados,  
**Para que** eu possa agir para destravar.

**Critérios de Aceite:**
- [x] Seção "Gates bloqueados" no dashboard
- [x] Card com módulo, cliente, motivo
- [ ] Dados reais do Supabase
- [ ] Botão "Resolver agora" navega para workflow

**Arquivos:**
- `src/components/dashboard/TodayDashboard.tsx` (modificar)
- `src/hooks/useGates.ts` (criar, filtrar failed)

---

#### US 4.3 — SLAs Vencendo ⚠️
**Como** usuário,  
**Quero** ver aprovações e tasks próximas do vencimento,  
**Para que** eu cumpra os prazos.

**Critérios de Aceite:**
- [x] Seção "SLAs vencendo" no dashboard
- [x] Contagem regressiva
- [ ] Dados reais (approvals + tasks com due_at próximo)
- [ ] Ordenar por urgência

**Arquivos:**
- `src/components/dashboard/TodayDashboard.tsx` (modificar)
- `src/hooks/useApprovals.ts` (criar)

---

#### US 4.4 — Clientes em Risco ⚠️
**Como** Manager,  
**Quero** ver clientes com health = risk,  
**Para que** eu priorize atenção a eles.

**Critérios de Aceite:**
- [x] Seção "Clientes em risco" no dashboard
- [x] Card com nome, último evento, health badge
- [ ] Dados reais (workspaces com health = risk)
- [ ] Clicar navega para workspace

**Arquivos:**
- `src/components/dashboard/TodayDashboard.tsx` (modificar)
- `src/hooks/useWorkspaces.ts` (criar)

---

## Epic 5: Portal do Cliente

> **PDR Ref:** §7.4, §8 FR-010, FR-011, §10.9

### Status: ⚠️ 80% (UI completa, backend parcial)

### User Stories

#### US 5.1 — Dashboard do Cliente ✅ UI
**Como** cliente,  
**Quero** ver minhas pendências e KPIs,  
**Para que** eu saiba o que preciso fazer.

**Critérios de Aceite:**
- [x] Pendências de aprovação
- [x] Ativos faltando
- [x] KPIs simples (7/30 dias)
- [ ] Dados reais do Supabase

**Arquivos:**
- `src/pages/client/Dashboard.tsx` (modificar)

---

#### US 5.2 — Aprovar/Reprovar Item ✅ UI | ❌ Backend
**Como** cliente,  
**Quero** aprovar ou reprovar um item,  
**Para que** a agência saiba se pode prosseguir.

**Critérios de Aceite:**
- [x] Lista de aprovações pendentes
- [x] Preview do item
- [x] Botões Aprovar/Reprovar
- [ ] Motivo obrigatório na reprova
- [ ] Atualizar status no Supabase
- [ ] Notificar agência

**Arquivos:**
- `src/pages/client/Approvals.tsx` (modificar)
- `src/hooks/useApprovals.ts` (mutation approve/reject)

---

#### US 5.3 — Upload de Ativos ⚠️
**Como** cliente,  
**Quero** enviar ativos solicitados pela agência,  
**Para que** eles possam trabalhar.

**Critérios de Aceite:**
- [x] Lista de ativos solicitados
- [x] Área de upload
- [ ] Upload real para Supabase Storage
- [ ] Atualizar status para 'uploaded'
- [ ] Notificar agência

**Arquivos:**
- `src/pages/client/Assets.tsx` (modificar)
- `src/hooks/useAssets.ts` (criar)
- Configurar Supabase Storage bucket

---

#### US 5.4 — Visualizar Relatórios ✅ UI
**Como** cliente,  
**Quero** ver os relatórios semanais e MBR,  
**Para que** eu acompanhe os resultados.

**Critérios de Aceite:**
- [x] Lista de relatórios
- [x] Visualização do relatório
- [ ] Dados reais do Supabase

**Arquivos:**
- `src/pages/client/Reports.tsx` (modificar)

---

## Epic 6: CRM & Pipeline

> **PDR Ref:** §8 FR-015, FR-016

### Status: ⚠️ 60% (UI completa, backend mock)

### User Stories

#### US 6.1 — Visualizar Pipeline de Leads ✅ UI | ❌ Backend
**Como** usuário da agência,  
**Quero** ver o pipeline de leads do cliente,  
**Para que** eu acompanhe o funil de vendas.

**Critérios de Aceite:**
- [x] Pipeline visual com 6 estágios
- [x] Cards de lead com informações
- [ ] Dados reais do Supabase
- [ ] Drag & drop para mover estágio

**Arquivos:**
- `src/components/workspace/CRMTab.tsx` (modificar)
- `src/hooks/useLeads.ts` (criar)

---

#### US 6.2 — Adicionar Lead ❌
**Como** usuário,  
**Quero** adicionar um lead manualmente,  
**Para que** ele entre no pipeline.

**Critérios de Aceite:**
- [ ] Modal de criação de lead
- [ ] Campos: nome, telefone, email, source
- [ ] Atribuir responsável
- [ ] Salvar no Supabase

**Arquivos:**
- `src/components/workspace/CreateLeadDialog.tsx` (criar)
- `src/hooks/useLeads.ts` (mutation create)

---

#### US 6.3 — Mover Lead no Pipeline ❌
**Como** usuário,  
**Quero** mover um lead entre estágios,  
**Para que** o status seja atualizado.

**Critérios de Aceite:**
- [ ] Drag & drop funcional
- [ ] Atualizar stage no Supabase
- [ ] Registrar em audit log

**Arquivos:**
- `src/components/workspace/CRMTab.tsx` (modificar)
- `src/hooks/useLeads.ts` (mutation update)

---

#### US 6.4 — Templates de Mensagem ✅ UI | ❌ Backend
**Como** usuário,  
**Quero** acessar templates de mensagem WhatsApp,  
**Para que** eu copie e use rapidamente.

**Critérios de Aceite:**
- [x] Lista de templates por categoria
- [x] Botão copiar
- [ ] Dados reais do Supabase
- [ ] CRUD de templates

**Arquivos:**
- `src/components/workspace/CRMTab.tsx` (modificar)
- `src/hooks/useMessageTemplates.ts` (criar)

---

## Epic 7: Conteúdo & Criativos

> **PDR Ref:** §7.3 Content Tab

### Status: ⚠️ 60% (UI completa, backend mock)

### User Stories

#### US 7.1 — Grid de Criativos ✅ UI | ❌ Backend
**Como** Editor,  
**Quero** ver todos os criativos do cliente,  
**Para que** eu gerencie a produção.

**Critérios de Aceite:**
- [x] Grid de criativos com thumbnail
- [x] Filtro por status, tipo, plataforma
- [ ] Dados reais do Supabase
- [ ] Paginação

**Arquivos:**
- `src/components/workspace/ContentTab.tsx` (modificar)
- `src/hooks/useCreatives.ts` (criar)

---

#### US 7.2 — Criar Criativo ❌
**Como** Editor,  
**Quero** cadastrar um novo criativo,  
**Para que** ele entre no fluxo de aprovação.

**Critérios de Aceite:**
- [ ] Modal de criação
- [ ] Upload de arquivo (Supabase Storage)
- [ ] Campos: título, tipo, plataforma, campanha
- [ ] Status inicial = draft

**Arquivos:**
- `src/components/workspace/CreateCreativeDialog.tsx` (criar)
- `src/hooks/useCreatives.ts` (mutation create)

---

#### US 7.3 — Solicitar Aprovação de Criativo ❌
**Como** Editor,  
**Quero** solicitar aprovação do cliente para um criativo,  
**Para que** ele valide antes de publicar.

**Critérios de Aceite:**
- [ ] Botão "Solicitar aprovação"
- [ ] Criar registro em approvals
- [ ] Atualizar status do criativo para 'pending'
- [ ] Notificar cliente

**Arquivos:**
- `src/components/workspace/ContentTab.tsx` (modificar)
- `src/hooks/useApprovals.ts` (mutation create)

---

#### US 7.4 — Calendário Editorial ✅ UI | ❌ Backend
**Como** Editor,  
**Quero** ver o calendário de publicações,  
**Para que** eu planeje o conteúdo.

**Critérios de Aceite:**
- [x] Visualização mensal
- [x] Eventos por dia
- [ ] Dados reais (criativos com scheduledFor)
- [ ] Arrastar para reagendar

**Arquivos:**
- `src/pages/Calendar.tsx` (modificar)
- `src/components/workspace/ContentTab.tsx` (modificar)

---

## Epic 8: Mídia & Campanhas

> **PDR Ref:** §7.3 Media Tab

### Status: ⚠️ 50% (UI completa, backend mock)

### User Stories

#### US 8.1 — Listar Campanhas ✅ UI | ❌ Backend
**Como** Media Buyer,  
**Quero** ver todas as campanhas do cliente,  
**Para que** eu gerencie mídia paga.

**Critérios de Aceite:**
- [x] Lista de campanhas
- [x] KPIs (leads, CPL, spent, budget)
- [ ] Dados reais do Supabase
- [ ] Filtro por status, plataforma

**Arquivos:**
- `src/components/workspace/MediaTab.tsx` (modificar)
- `src/hooks/useCampaigns.ts` (criar)

---

#### US 8.2 — Criar Campanha ❌
**Como** Media Buyer,  
**Quero** cadastrar uma nova campanha,  
**Para que** eu controle o budget e resultados.

**Critérios de Aceite:**
- [ ] Modal de criação
- [ ] Campos: nome, plataforma, objetivo, budget, datas
- [ ] Status inicial = draft

**Arquivos:**
- `src/components/workspace/CreateCampaignDialog.tsx` (criar)
- `src/hooks/useCampaigns.ts` (mutation create)

---

#### US 8.3 — Atualizar Métricas de Campanha ❌
**Como** Media Buyer,  
**Quero** atualizar métricas manualmente ou via webhook,  
**Para que** os dados estejam atualizados.

**Critérios de Aceite:**
- [ ] Formulário de edição de métricas
- [ ] Campos: leads, spent
- [ ] Recalcular CPL/CPA

**Arquivos:**
- `src/hooks/useCampaigns.ts` (mutation update)

---

## Epic 9: Dados & KPIs

> **PDR Ref:** §8 FR-019, FR-020, FR-021, §13

### Status: ⚠️ 30%

### User Stories

#### US 9.1 — Tracking Checklist ✅ UI | ❌ Backend
**Como** Analyst,  
**Quero** ver o checklist de tracking do cliente,  
**Para que** eu saiba o que está configurado.

**Critérios de Aceite:**
- [x] Lista de itens de tracking
- [x] Status por item
- [ ] Dados reais (de configuração ou tabela dedicada)
- [ ] Marcar como configurado

**Arquivos:**
- `src/components/workspace/DataTab.tsx` (modificar)

---

#### US 9.2 — Visualizar KPIs ⚠️
**Como** usuário,  
**Quero** ver os KPIs do cliente,  
**Para que** eu acompanhe a performance.

**Critérios de Aceite:**
- [x] Cards de KPIs no Overview
- [x] Gráficos em Reports.tsx
- [ ] Dados reais de kpi_values
- [ ] Filtro por período (7/30/90 dias)

**Arquivos:**
- `src/pages/Reports.tsx` (modificar)
- `src/hooks/useKPIs.ts` (criar)

---

#### US 9.3 — Health Score Automático ❌
**Como** sistema,  
**Quero** calcular o health score do cliente automaticamente,  
**Para que** o status seja sempre atualizado.

**Critérios de Aceite:**
- [ ] Função calculateHealthStatus()
- [ ] Regras conforme PDR §13.3
- [ ] Recálculo semanal ou por evento
- [ ] Atualizar campo health no workspace

**Arquivos:**
- `src/lib/healthScore.ts` (criar)
- Edge Function `recompute-health` (criar)

---

#### US 9.4 — Ingestão de Métricas via Webhook ❌
**Como** sistema,  
**Quero** receber métricas via webhook,  
**Para que** os KPIs sejam atualizados automaticamente.

**Critérios de Aceite:**
- [ ] Edge Function para receber webhook
- [ ] Validar payload
- [ ] Inserir em kpi_values
- [ ] Registrar em audit_logs

**Arquivos:**
- `supabase/functions/ingest/index.ts` (criar)

---

## Epic 10: Automações & Integrações

> **PDR Ref:** §8 FR-017, FR-018, §12

### Status: ❌ 0%

### User Stories

#### US 10.1 — Notificação de SLA Vencendo ❌
**Como** sistema,  
**Quero** notificar quando um SLA estiver próximo de vencer,  
**Para que** a equipe tome ação.

**Critérios de Aceite:**
- [ ] Edge Function ou n8n workflow
- [ ] T-24h: lembrete leve ao cliente
- [ ] T-6h: lembrete forte + CS
- [ ] T+0: criar task de cobrança
- [ ] Registrar em audit_logs

**Arquivos:**
- `supabase/functions/notify-sla/index.ts` (criar)
- n8n workflow

---

#### US 10.2 — Sprint Semanal Automático ❌
**Como** sistema,  
**Quero** criar a sprint semanal automaticamente toda segunda,  
**Para que** as tarefas padrão sejam geradas.

**Critérios de Aceite:**
- [ ] Cron job segunda 09:00
- [ ] Criar tasks padrão por cliente ativo
- [ ] Notificar equipe

**Arquivos:**
- `supabase/functions/create-weekly-sprint/index.ts` (criar)

---

#### US 10.3 — Notificações In-App ❌
**Como** usuário,  
**Quero** receber notificações dentro do sistema,  
**Para que** eu não perca eventos importantes.

**Critérios de Aceite:**
- [ ] Tabela notifications
- [ ] Componente NotificationBell
- [ ] Dropdown com lista
- [ ] Marcar como lida
- [ ] Real-time com Supabase Realtime

**Arquivos:**
- Criar tabela `notifications`
- `src/components/layout/NotificationBell.tsx` (criar)

---

## Epic 11: Relatórios

> **PDR Ref:** §8 FR-022, §13.4

### Status: ❌ 0%

### User Stories

#### US 11.1 — Gerar Relatório Semanal ❌
**Como** Manager,  
**Quero** gerar relatório semanal do cliente,  
**Para que** eu envie ao cliente.

**Critérios de Aceite:**
- [ ] Template de relatório semanal
- [ ] Preenchimento automático com KPIs
- [ ] Campos editáveis (highlights, decisões)
- [ ] Salvar em tabela reports

**Arquivos:**
- `src/components/reports/WeeklyReportGenerator.tsx` (criar)

---

#### US 11.2 — Gerar MBR Mensal ❌
**Como** Manager,  
**Quero** gerar o MBR mensal,  
**Para que** eu faça a revisão mensal com o cliente.

**Critérios de Aceite:**
- [ ] Template de MBR conforme PDR §19.5
- [ ] Comparativo vs metas
- [ ] Diagnóstico de gargalo
- [ ] Plano do próximo mês

**Arquivos:**
- `src/components/reports/MBRGenerator.tsx` (criar)

---

#### US 11.3 — Exportar para PDF ❌
**Como** Manager,  
**Quero** exportar relatórios em PDF,  
**Para que** eu envie ao cliente.

**Critérios de Aceite:**
- [ ] Botão "Exportar PDF"
- [ ] Layout formatado para impressão
- [ ] Download automático

**Arquivos:**
- Usar react-pdf ou similar

---

## Epic 12: Playbooks

> **PDR Ref:** §8 FR-013, FR-014

### Status: ⚠️ 40% (UI existe, backend parcial)

### User Stories

#### US 12.1 — Listar Playbooks ✅ UI
**Como** Admin,  
**Quero** ver a lista de playbooks disponíveis,  
**Para que** eu aplique ao criar clientes.

**Critérios de Aceite:**
- [x] Grid de playbooks
- [x] Informações: módulos, scripts, templates
- [ ] Dados reais do Supabase

**Arquivos:**
- `src/pages/Playbooks.tsx` (modificar)

---

#### US 12.2 — Aplicar Playbook ao Cliente ❌
**Como** Admin,  
**Quero** aplicar um playbook ao criar cliente,  
**Para que** workflows e templates sejam instanciados.

**Critérios de Aceite:**
- [ ] Seletor de playbook na criação de cliente
- [ ] Instanciar workflow template
- [ ] Copiar message templates
- [ ] Copiar KPI definitions

**Arquivos:**
- `src/lib/playbooks.ts` (criar)

---

#### US 12.3 — Editar Playbook ❌
**Como** Admin,  
**Quero** editar um playbook,  
**Para que** eu ajuste conforme aprendizados.

**Critérios de Aceite:**
- [ ] Editor de módulos e steps
- [ ] Editor de checklists
- [ ] Editor de templates
- [ ] Versionamento

**Arquivos:**
- `src/pages/PlaybookEditor.tsx` (criar)

---

---

## Roadmap de Implementação

### Sprint 1 (Semana 1) — Fundação
| US | Título | Esforço |
|----|--------|---------|
| US 1.1 | Login com Supabase Auth | 4h |
| US 1.2 | Logout | 1h |
| US 1.3 | Reset de Senha | 2h |
| US 1.4 | Proteção de Rotas | 3h |
| US 2.1 | Listar Clientes (backend) | 2h |
| US 3.1 | Visualizar Timeline (backend) | 2h |

### Sprint 2 (Semana 2) — Workflow Engine
| US | Título | Esforço |
|----|--------|---------|
| US 3.3 | Validar Gate (DoD) | 4h |
| US 3.4 | Bloquear Avanço | 2h |
| US 3.5 | Marcar Step Concluído | 2h |
| US 3.6 | Focus Mode | 6h |

### Sprint 3 (Semana 3) — Dados Reais
| US | Título | Esforço |
|----|--------|---------|
| US 4.1-4.4 | Today View (backend) | 4h |
| US 6.1-6.4 | CRM (backend) | 4h |
| US 7.1-7.4 | Conteúdo (backend) | 4h |
| US 8.1-8.3 | Mídia (backend) | 4h |

### Sprint 4 (Semana 4) — Portal Cliente
| US | Título | Esforço |
|----|--------|---------|
| US 5.2 | Aprovar/Reprovar (backend) | 3h |
| US 5.3 | Upload de Ativos | 4h |
| US 9.3 | Health Score | 4h |

### Sprint 5+ — Automações
| US | Título | Esforço |
|----|--------|---------|
| US 10.1 | Notificação SLA | 4h |
| US 10.2 | Sprint Automático | 4h |
| US 10.3 | Notificações In-App | 6h |
| US 11.1-11.3 | Relatórios | 8h |

---

## Legenda de Prioridades

| Prioridade | Significado | Prazo |
|------------|-------------|-------|
| **P0** | Crítico — bloqueia operação | Semana 1-2 |
| **P1** | Importante — funcionalidade core | Semana 3-4 |
| **P2** | Médio — melhoria significativa | Semana 5+ |
| **P3** | Baixo — nice to have | Backlog |

---

> [!TIP]
> **Para implementar uma User Story:**
> 1. Leia os critérios de aceite
> 2. Verifique os arquivos listados
> 3. Consulte o código de referência em `pendencias_de_implementacao_velocity_agency_os_v2.md`
> 4. Marque [x] conforme concluir cada critério
> 5. Atualize este documento
