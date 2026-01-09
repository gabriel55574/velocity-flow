# Pendências de Implementação — Velocity Agency OS

**Data de referência:** 09 jan 2026  
**Objetivo atual aprovado:** **Frontend 100% (todas as páginas) + Portal do Cliente** e, em seguida, **10 abas completas do Workspace do Cliente**.

---

## 1) Status executivo (snapshot)

### 1.1 O que já foi implementado (UI / mock)
- **Design System** (CSS variables, cores, glassmorphic)
- **Componentes UI base** (ex.: GlassCard, StatusBadge, Button)
- **Layout** (Sidebar, MobileNav, PageHeader)
- **Roteamento básico**
- **Dados mock centralizados** (`src/data/mockData.ts`) + tipos
- **Shared components** (ex.: `EmptyState`, `SkeletonCard`)
- **Auth (UI):** `/login`, `/reset-password` (sem integração real)
- **Portal do Cliente (UI):**
  - `/client/dashboard`
  - `/client/approvals`
  - `/client/assets`
  - `/client/reports`
- **Páginas da Agência (UI):**
  - **Calendar:** visualização mensal com filtros/legenda
  - **Reports:** dashboard com gráficos (Recharts), KPIs, funil, investimento
  - **Playbooks:** visualizador (QFD, scripts WhatsApp e rotinas)
  - **Settings:** subpáginas (Usuários, Agência, Aparência, Integrações, Segurança)

### 1.2 Pendências críticas (alto nível)
- **Backend/Supabase:** 0% (schema, RLS, auth, storage, seeds)
- **Edge Functions:** 0% (ingest, recompute health/gates, sprint semanal, notify SLA)
- **Integrações n8n:** 0% (SLA approvals, follow-up CRM, sprint semanal, ingest métricas)
- **Workflow Engine:** 0% (módulos/steps/checklists, gates, SLAs, audit trail)
- **Workspace do Cliente (10 abas):** **pendente** (abas completas com UI e fluxos)
- **Funcionalidade real (dados/CRUD):** pendente para todas as telas (substituir mock por Supabase)

---

## 2) Backlog de pendências por área

> **Legenda de status**  
- **Não iniciado**: não existe UI nem integração  
- **UI concluída (mock)**: navegação e layout existem; dados falsos/sem persistência  
- **Parcial**: existe UI, mas faltam fluxos/estados/variações  
- **Bloqueado**: depende de outra área (ex.: Supabase, RLS)

---

## 3) Frontend — Páginas completas (Agência) e Portal do Cliente

### 3.1 Auth (UI)
- [ ] **Integração real com Supabase Auth** (login, sessão, refresh, logout) — **Bloqueado (depende do backend)**
- [ ] **Reset password real** (request + update) — **Bloqueado**
- [ ] **Proteção de rotas por role (Agency/Client)** — **Bloqueado**

### 3.2 Portal do Cliente (UI concluída)
- [ ] **Estados vazios e erros** consistentes (sem dados, sem pendências, carregando) — **Parcial**
- [ ] **Fluxos reais** (aprovar/reprovar, upload assets, visualizar relatórios) — **Bloqueado**
- [ ] **Permissões (Client Admin / Client Viewer)** — **Bloqueado**

### 3.3 Calendar (UI concluída)
- [ ] CRUD de eventos (criar/editar/excluir) — **Bloqueado**
- [ ] Integração com sprints e MBRs — **Bloqueado**

### 3.4 Reports (UI concluída)
- [ ] Conectar gráficos e KPIs ao banco (kpi_definitions / kpi_values) — **Bloqueado**
- [ ] Exportação (PDF/CSV) — **Não iniciado**

### 3.5 Playbooks (UI concluída)
- [ ] Persistência/CRUD de playbooks e templates — **Bloqueado**
- [ ] Ação “Aplicar em Cliente” (instanciar workflow/tarefas) — **Bloqueado (depende do Workflow Engine)**

### 3.6 Settings (UI concluída)
- [ ] Users CRUD + convites (email) + roles reais — **Bloqueado**
- [ ] Clients CRUD real — **Bloqueado**
- [ ] Integrações (n8n, Meta/Google, Supabase) com status real — **Bloqueado**
- [ ] Segurança (2FA, histórico de login) — **Não iniciado**

---

## 4) Workspace do Cliente — 10 abas completas (prioridade imediata após páginas completas)

**Estado atual:** estrutura de abas existe, **apenas Overview com mock**; demais abas eram placeholders.

### 4.1 Workflows
- [ ] Timeline visual do workflow (fases/módulos) — **Não iniciado**
- [ ] Status por módulo/step (not_started/in_progress/blocked/done) — **Não iniciado**
- [ ] Gates visuais (pass/fail) e bloqueio de avanço (UI) — **Não iniciado**

### 4.2 Strategy (Kickoff/Diagnóstico/Blueprint/QFD)
- [ ] Seções: Kickoff, Diagnóstico 360, Blueprint 30/60/90 + ICE, QFD — **Não iniciado**
- [ ] Componentes de leitura/edição (UI) — **Não iniciado**

### 4.3 Operations (Sprints)
- [ ] Kanban simples (To Do/Doing/Done) — **Não iniciado**
- [ ] Rotinas/checklists e histórico de sprints — **Não iniciado**

### 4.4 CRM
- [ ] Pipeline (Novo, Qualificado, Agendado, Compareceu, Fechado, Perdido) — **Não iniciado**
- [ ] Templates de WhatsApp por categoria — **Não iniciado**

### 4.5 Content
- [ ] Calendário editorial + cards de posts — **Não iniciado**
- [ ] Biblioteca de criativos (grid) + status — **Não iniciado**
- [ ] Aprovações inline — **Não iniciado**

### 4.6 Media
- [ ] Campanhas (Meta/Google) + KPIs (CPL/CPA etc.) — **Não iniciado**
- [ ] Budget (diário/mensal) + sugestões de otimização (UI) — **Não iniciado**

### 4.7 Data
- [ ] Tracking checklist (Pixel/GTM/eventos/UTMs) + status — **Não iniciado**
- [ ] Links para dashboards externos (placeholder controlado) — **Não iniciado**

### 4.8 Approvals
- [ ] Lista de aprovações pendentes com preview e SLA — **Não iniciado**
- [ ] Histórico de aprovações — **Não iniciado**

### 4.9 Assets
- [ ] Inventário (missing/uploaded/validated) — **Não iniciado**
- [ ] Checklist de acessos (IG/BM/Google/domínio) — **Não iniciado**
- [ ] Área de upload (UI) — **Não iniciado**

### 4.10 Notes
- [ ] Timeline de notas/atas + decisões — **Não iniciado**
- [ ] Busca no histórico — **Não iniciado**

---

## 5) Backend / Supabase (0% implementado)

### 5.1 Database & multi-tenant
- [ ] **Schema (21 tabelas):** agencies, users_profile, clients, workspaces, workflows, modules, steps, checklist_items, gates, tasks, approvals, assets, crm_leads, message_templates, experiments, campaigns, creatives, kpi_definitions, kpi_values, audit_logs, clients_users — **Não iniciado**
- [ ] **Row Level Security (RLS)** multi-tenant (agency_id + client_id) — **Não iniciado**
- [ ] **Seeds** (Velocity agency, client demo, usuários demo, templates) — **Não iniciado**

### 5.2 Auth & Storage
- [ ] Supabase Auth (JWT) — **Não iniciado**
- [ ] Supabase Storage (assets) — **Não iniciado**

---

## 6) Edge Functions (0% implementado)
- [ ] `/functions/v1/n8n-webhook-ingest` — receber leads/métricas — **Não iniciado**
- [ ] `/functions/v1/recompute-health` — calcular health e gates — **Não iniciado**
- [ ] `/functions/v1/create-weekly-sprint` — criar tarefas recorrentes — **Não iniciado**
- [ ] `/functions/v1/notify-sla` — disparar notificação via n8n — **Não iniciado**

---

## 7) Autenticação e Roles (0% implementado — além de UI)
- [ ] Login/logout real — **Bloqueado (depende de Supabase Auth)**
- [ ] Reset password real — **Bloqueado**
- [ ] Onboarding de Admin — **Não iniciado**
- [ ] Roles da agência (Admin, Manager/CS, Editor, Media Buyer, Analyst, Viewer) — **Não iniciado**
- [ ] Roles do cliente (Client Admin, Client Viewer) — **Não iniciado**
- [ ] Proteção de rotas por role — **Não iniciado**

---

## 8) Workflow Engine (0% implementado)
- [ ] Modules → Steps → Checklist Items — **Não iniciado**
- [ ] Gates com Definition of Done (DoD) — **Não iniciado**
- [ ] Bloqueio de avanço quando gate falhar — **Não iniciado**
- [ ] Criação automática de tarefas por templates — **Não iniciado**
- [ ] SLAs por etapa com alertas — **Não iniciado**
- [ ] Audit trail (aprovações/mudanças) — **Não iniciado**
- [ ] Timeline visual do workflow (dados reais) — **Não iniciado**
- [ ] Focus Mode (wizard por etapa) — **Não iniciado**

---

## 9) Workflows obrigatórios (0% implementado)
- [ ] **A) Novo Cliente** (Comercial → Onboarding → Estratégia → Setup → Go-Live)
- [ ] **B) Sprint Semanal** (planejar → executar → reportar → decidir)
- [ ] **C) MBR Mensal** (consolidar → analisar → decidir)
- [ ] **D) Offboarding** (entrega final → revogar acessos → lições)

---

## 10) Módulos do Método (0% implementado)
- [ ] Onboarding Interno
- [ ] Kickoff
- [ ] Coleta de Acessos e Ativos
- [ ] Diagnóstico 360
- [ ] Blueprint 30/60/90 + ICE
- [ ] Setup Tracking
- [ ] Setup CRM/WhatsApp
- [ ] Setup Conteúdo/Criativos
- [ ] Setup Mídia
- [ ] Gate Go-Live
- [ ] Operação Semanal (Sprints)
- [ ] MBR Mensal
- [ ] Renovação / Offboarding

---

## 11) Integrações n8n (0% implementado)
- [ ] SLA Approvals — notificar quando expirar
- [ ] Daily CRM Follow-up — listar leads críticos
- [ ] Weekly Sprint — criar sprint toda segunda
- [ ] Metrics Ingest — receber métricas Meta/IG/Google

---

## 12) Funcionalidades de UX (parcial)
- [ ] Tela “Today” com Top 5 ações — **UI feita (sem dados reais)**
- [ ] Gates bloqueados + “Resolver agora” — **UI feita (sem funcionalidade)**
- [ ] SLAs vencendo — **UI feita (sem dados reais)**
- [ ] “Próxima ação” por cliente — **Não iniciado**
- [ ] Focus Mode — **Não iniciado**
- [ ] Logs e histórico auditáveis — **Não iniciado**
- [ ] Progress bar em wizards — **Não iniciado**

---

## 13) Calendário (5% implementado)
- [ ] Visualização de eventos — **UI concluída/placeholder**
- [ ] Criar/editar eventos — **Não iniciado**
- [ ] Integrar com sprints e MBRs — **Não iniciado**

---

## 14) Relatórios (5% implementado)
- [ ] Relatório semanal — **UI/placeholder**
- [ ] MBR mensal — **UI/placeholder**
- [ ] Dashboards com Recharts — **UI concluída (mock)**
- [ ] Exportação — **Não iniciado**

---

## 15) Playbook “Clínica Premium — Harmonização” (0% implementado)
- [ ] Arquitetura de Mensagem QFD (Decorado → Método → Procedimentos)
- [ ] Scripts WhatsApp (primeira resposta, triagem, fechamento, follow-up)
- [ ] Checklist de Go-Live específico
- [ ] Rotina de prova/valor (reviews, depoimentos, bastidores, educação)
- [ ] KPIs padrão de clínica

---

## 16) Resumo quantitativo (base original + observação)

> O resumo abaixo reflete o **cenário base** informado (antes das últimas entregas de UI). Recomenda-se recalcular quando houver checklist fechado por módulo.

| Categoria | Implementado | Total | % |
|---|---:|---:|---:|
| Frontend UI/Layout | ~70% | 100% | 70% |
| Backend/Database | 0% | 100% | 0% |
| Autenticação | 0% | 100% | 0% |
| Workflow Engine | 0% | 100% | 0% |
| Portal Cliente | 0% | 100% | 0% |
| Edge Functions | 0% | 100% | 0% |
| Integrações n8n | 0% | 100% | 0% |
| Playbook Clínica | 0% | 100% | 0% |
| **TOTAL GERAL** | ~10% | 100% | 10% |

**Observação:** Já existem entregas adicionais de UI (Auth, Portal Cliente, Calendar, Reports, Playbooks, Settings). Para refletir fielmente, reestime após fechar o escopo “Frontend 100%” (incluindo as **10 abas do Workspace**).

---

## 17) Próximas pendências priorizadas (ordem prática)

### P0 — Fechar “Frontend 100%” (UI + navegação + estados)
1. [ ] Implementar **10 abas do Workspace do Cliente** (Workflows → Notes)
2. [ ] Completar **estados vazios**, **loading**, **erro**, e **responsividade** em todas as páginas
3. [ ] Padronizar componentes de **modal/drawer** e fluxos (novo lead, aprovar item, upload, etc.)

### P1 — Preparar integração (sem backend ainda)
4. [ ] Definir contratos de dados (types/interfaces) alinhados ao schema Supabase
5. [ ] Consolidar `mockData` por domínio (crm, content, media, approvals, tasks) para simular CRUD

### P2 — Backend essencial (para sair do mock)
6. [ ] Implementar schema + RLS + Auth + Storage + Seeds
7. [ ] Trocar data layer do frontend (mock → Supabase) com TanStack Query

---

## 18) Registro de decisões
- **09 jan 2026:** prioridade aprovada: **páginas completas (Calendar/Reports/Playbooks/Settings) e Portal do Cliente**, depois **10 abas do Workspace do Cliente**.

