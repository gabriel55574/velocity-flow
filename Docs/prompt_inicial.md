📌 PROMPT COMPLETO — “VELOCITY AGENCY OS” (McDonald’s System for Agencies)

🎯 VISÃO GERAL DO PROJETO
Crie um aplicativo web completo e responsivo chamado “Velocity Agency OS”, um sistema operacional de agência que padroniza (e torna replicável) toda a jornada do cliente:
Comercial → Onboarding → Estratégia → Setup → Go-Live → Operação Semanal (Sprints) → MBR Mensal → Renovação/Offboarding.

O sistema deve ser “à prova de falhas”:
- cada fase é guiada por workflows (wizards),
- existem gates (Definition of Done) que bloqueiam avanço sem requisitos,
- o time opera por rotinas (diárias/semanais/mensais) com SLAs, alertas e “próxima ação”.

A plataforma é multi-cliente e multi-papel:
- Usuários da agência: Admin, Manager/CS, Editor (Conteúdo), Media Buyer, Analyst, Viewer.
- Usuários do cliente: Client Admin (aprova), Client Viewer (somente leitura).

Deve existir um “Playbook por nicho”. Entregar pelo menos 1 playbook inicial:
- Playbook “Clínica Premium — Harmonização Facial”
com linguagem “Decorado → Método → Procedimentos” (QFD), scripts de WhatsApp e rotinas de prova/valor sem promoção.

🛠️ STACK TECNOLÓGICA
Frontend
- Next.js (App Router) + React 18 + TypeScript
- Tailwind CSS + CSS Variables (temas)
- shadcn/ui (Radix UI) para componentes (Dialog, Drawer, Tabs, Toast, Dropdown, Command)
- TanStack Query (React Query) para dados
- React Hook Form + Zod (validação)
- Framer Motion (animações)
- Recharts (dashboards)
- Lucide React (ícones)

Backend / Dados
- Supabase (Postgres) como banco principal
- Supabase Auth (JWT) para login
- Row Level Security (RLS) ativo para multi-tenant (agency_id + client_id)
- Supabase Storage para assets (imagens, vídeos, documentos)
- Supabase Edge Functions (quando necessário) para endpoints internos (ex.: gatilhos, validações, webhooks)

Automações
- n8n para:
  - notificações (WhatsApp/Email/Slack) de SLA e aprovações
  - coleta de métricas (Meta/Instagram/Google) e envio para Supabase
  - criação automática de tarefas recorrentes (diário/semanal/mensal)
  - webhooks de entrada (leads do WhatsApp provider / form / anúncios)

🎨 DESIGN SYSTEM (MODERNO, GLASSMÓRFICO, MOBILE-FIRST)
Estilo: premium, limpo, focado em execução. Interface deve reduzir distração (TDAH-friendly):
- “Today View” com Top 5 ações, bloqueios e SLAs
- “Focus Mode” para operar só o que destrava o gate atual

Paleta (CSS Variables HSL)
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
  --ok: 145 63% 42%;
  --warn: 38 92% 50%;
  --risk: 0 84% 60%;

  /* Workflow Status */
  --blocked: 0 0% 55%;
  --inprogress: 219 85% 51%;
  --done: 145 63% 42%;
}

Componentes (classes)
- .glass-card: backdrop-blur-lg bg-white/70 border border-white/20 shadow-lg rounded-2xl
- .content-card: bg-white/80 backdrop-blur-lg border border-white/20 hover:shadow-xl transition
- .button-primary: bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg
- animações leves com Framer Motion (stagger em listas, hover em cards, drawer mobile)

Responsividade
- Mobile-first
- Barra inferior no mobile + sidebar expansível no desktop
- Breakpoints Tailwind padrão

🧭 ESTRUTURA DE PÁGINAS E NAVEGAÇÃO (Agency Portal + Client Portal)
A aplicação deve separar claramente “Portal da Agência” e “Portal do Cliente”.

1) Auth
- /login
- /reset-password
- /onboarding (somente Admin da Agência)

2) Portal da Agência (roles: Admin/CS/Editor/Media/Analyst/Viewer)
2.1 Dashboard “Today” — /agency/dashboard
- Cards: Clientes em risco, Gates bloqueados, SLAs estourando, Próximas reuniões
- “Top 5 Ações que destravam” (ordenado por impacto)
- Atalhos: Criar Sprint semanal, Gerar pauta de reunião, Solicitar aprovação do cliente

2.2 Clientes — /agency/clients
- lista com: fase atual (Onboarding/Estratégia/Setup/Operação/Escala/Offboarding), health (verde/amarelo/vermelho), owner, último MBR
- abrir workspace do cliente

2.3 Workspace do Cliente — /agency/clients/:id/overview
Abas:
- Overview: KPIs do funil, health, próximos gates, tarefas críticas
- Workflows: timeline visual do fluxo (Kickoff → Diagnóstico → Blueprint → Setup → Go-Live → Sprints → MBR)
- Strategy: Kickoff / Diagnóstico 360 / Blueprint 30-60-90 / Arquitetura de Mensagem (QFD)
- Operations: Sprint semanal / Rotina diária / Relatório semanal / MBR mensal
- CRM: Pipeline de leads + scripts WhatsApp + follow-up
- Content: Calendário editorial + biblioteca de criativos + aprovações
- Media: estrutura de campanhas + otimização + budget
- Data: tracking checklist + UTMs + eventos + dashboards
- Approvals: aprovações pendentes do cliente
- Assets: arquivos e inventário (o que falta)
- Notes: atas, decisões, histórico

2.4 Configurações — /agency/settings
- Users (CRUD) + roles
- Clients (CRUD)
- Playbooks (biblioteca) + templates de workflow
- Templates (Kickoff, Diagnóstico, Blueprint, Scripts, Pauta semanal, MBR)
- Integrações (Supabase, n8n webhooks, Meta/Google placeholders)

3) Portal do Cliente (roles: Client Admin / Client Viewer)
3.1 Dashboard — /client/dashboard
- Pendências: aprovações, acessos, ativos faltando
- KPIs simples (últimos 7 e 30 dias)
- Próximas ações solicitadas pela agência

3.2 Aprovações — /client/approvals
- aprovar/reprovar com motivo (SLA)
- ver prévia de criativos/copies

3.3 Envio de Ativos e Acessos — /client/assets
- upload guiado (logo, fotos, vídeos, docs)
- checklist de acessos (IG, BM/Ads, Google, domínio)
- status “pendente / recebido / validado”

3.4 Relatórios e Decisões — /client/reports
- relatório semanal (resumo + decisões)
- MBR mensal

🔁 WORKFLOW ENGINE (O CORAÇÃO DO SISTEMA)
O sistema deve implementar Workflows com:
- Modules → Steps → Checklist Items
- Gates com “Definition of Done (DoD)” objetivos
- bloqueio de avanço quando gate falhar
- criação automática de tarefas a partir de templates quando o step inicia
- SLAs por etapa (ex.: aprovação em 24-48h)
- logs (audit trail) de aprovações e mudanças

Workflows obrigatórios:
A) Novo Cliente (Comercial → Onboarding → Estratégia → Setup → Go-Live)
B) Sprint Semanal (planejar → executar → reportar → decidir)
C) MBR Mensal (consolidar → analisar → decidir correção/escala)
D) Offboarding (entrega final + revogar acessos + lições)

Workflows/Modules do método (mínimo):
1. Onboarding Interno
2. Kickoff
3. Coleta de Acessos e Ativos
4. Diagnóstico 360
5. Blueprint 30/60/90 + ICE
6. Setup Tracking
7. Setup CRM/WhatsApp
8. Setup Conteúdo/Criativos
9. Setup Mídia
10. Gate Go-Live
11. Operação Semanal (Sprints)
12. MBR Mensal
13. Renovação / Offboarding

Gates obrigatórios (exemplos):
- Gate Estratégia: metas numéricas + persona + oferta + capacidade documentadas
- Gate Tracking: UTMs + eventos essenciais OK
- Gate Go-Live: tracking OK + scripts CRM OK + criativos aprovados + campanhas estruturadas
- Gate Sprint: backlog ICE priorizado + donos definidos + SLAs claros

📈 KPIs PADRÃO (CLÍNICAS DE HARMONIZAÇÃO)
No dashboard do cliente, calcular e exibir:
- Leads (semana/mês)
- Taxa de agendamento
- Show rate (comparecimento)
- Conversão em procedimento
- Ticket médio (quando informado)
- Retorno / Indicação (quando aplicável)
- Origem (IG, anúncios, Google, indicação)

🗄️ MODELO DE DADOS (SUPABASE / POSTGRES) — TABELAS PRINCIPAIS
Todas as tabelas devem suportar multi-tenant:
- agency_id (FK) em tudo
- client_id quando fizer sentido (dados do cliente)

1) agencies
- id uuid PK
- name text
- created_at timestamptz

2) users_profile (complemento do auth.users)
- id uuid PK (FK auth.users.id)
- agency_id uuid FK agencies
- name text
- role text enum: 'admin' | 'cs' | 'editor' | 'media' | 'analyst' | 'viewer'
- created_at, updated_at

3) clients
- id uuid PK
- agency_id uuid FK
- name text
- niche text
- business_data jsonb (capacidade, agenda, pricing, restrições)
- status text ('active','paused','offboarding')
- created_at, updated_at

4) clients_users (acesso do cliente ao portal)
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- user_id uuid FK auth.users
- role_at_client text enum: 'client_admin' | 'client_viewer'
- created_at

5) workspaces
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- current_phase text
- health_status text ('ok','warn','risk')
- owner_user_id uuid FK auth.users
- created_at, updated_at

6) workflows (templates e instâncias)
- id uuid PK
- agency_id uuid FK
- client_id uuid FK nullable (null = template)
- name text
- type text ('template','instance')
- playbook_id uuid nullable
- status text ('not_started','in_progress','blocked','done')
- created_at, updated_at

7) modules
- id uuid PK
- workflow_id uuid FK
- title text
- order_index int
- status text
- created_at, updated_at

8) steps
- id uuid PK
- module_id uuid FK
- title text
- description text
- order_index int
- owner_role text (quem normalmente executa)
- sla_hours int
- status text
- created_at, updated_at

9) checklist_items
- id uuid PK
- step_id uuid FK
- title text
- required boolean
- done boolean
- done_by uuid FK auth.users nullable
- done_at timestamptz nullable

10) gates
- id uuid PK
- module_id uuid FK
- title text
- rule jsonb (condições DoD; ex.: campos obrigatórios + checklist required = true)
- status text ('pass','fail')
- last_checked_at timestamptz

11) tasks
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- title text
- description text
- status text ('todo','doing','done','blocked','canceled')
- owner_user_id uuid FK auth.users
- due_at timestamptz
- related_step_id uuid FK steps nullable
- created_at, updated_at

12) approvals
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- type text ('creative','copy','plan','budget','other')
- title text
- payload jsonb (dados do item)
- status text ('pending','approved','rejected')
- requested_by uuid FK auth.users
- decided_by uuid FK auth.users nullable
- decided_at timestamptz nullable
- rejection_reason text nullable
- sla_due_at timestamptz

13) assets
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- type text ('logo','photo','video','doc','consent','other')
- title text
- storage_path text
- status text ('missing','uploaded','validated')
- created_at, updated_at

14) crm_leads
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- source text ('instagram','ads','google','referral','other')
- name text nullable
- phone text nullable
- stage text ('new','qualified','scheduled','showed','closed','lost')
- last_contact_at timestamptz nullable
- notes text nullable
- created_at, updated_at

15) message_templates
- id uuid PK
- agency_id uuid FK
- client_id uuid FK nullable (template global ou por cliente)
- name text
- category text ('first_reply','triage','closing','followup_d1','followup_d3','reminder')
- content text

16) experiments (ICE)
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- hypothesis text
- ice_score int
- status text ('planned','running','won','lost')
- metric text
- result jsonb
- created_at, updated_at

17) campaigns (mídia)
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- platform text ('meta','google','other')
- name text
- objective text
- status text
- budget_daily numeric
- created_at, updated_at

18) creatives
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- title text
- type text ('image','video','copy','landing')
- variant text
- status text ('draft','review','approved','published','archived')
- approval_id uuid FK approvals nullable
- performance jsonb nullable
- created_at, updated_at

19) kpi_definitions
- id uuid PK
- agency_id uuid FK
- name text
- formula text nullable
- created_at

20) kpi_values
- id uuid PK
- agency_id uuid FK
- client_id uuid FK
- kpi_id uuid FK
- period_start date
- period_end date
- value numeric
- created_at

21) audit_logs
- id uuid PK
- agency_id uuid FK
- client_id uuid FK nullable
- user_id uuid FK auth.users
- action text
- entity text
- entity_id uuid
- metadata jsonb
- created_at

🔒 RLS (SEGURANÇA) — REGRAS OBRIGATÓRIAS
- Usuários da agência só acessam registros da própria agency_id.
- Usuários do cliente (clients_users) só acessam dados do próprio client_id e agency_id.
- approvals: cliente pode aprovar/reprovar somente do seu client_id.
- tasks: cliente não vê tasks internas, apenas “requests” (exibir via approvals e assets).
- audit_logs visível apenas para Admin/CS/Analyst da agência.

🔌 ENDPOINTS / FUNÇÕES
Preferir Supabase client direto + Edge Functions para:
- /functions/v1/n8n-webhook-ingest (receber leads/métricas)
- /functions/v1/recompute-health (calcular health e gates)
- /functions/v1/create-weekly-sprint (criar tarefas recorrentes)
- /functions/v1/notify-sla (disparar notificação via n8n)

🤖 INTEGRAÇÕES COM N8N (OBRIGATÓRIAS)
1) SLA Approvals:
- quando approvals.status = pending e sla_due_at expira → n8n notifica cliente e CS
2) Daily CRM Follow-up:
- todo dia: listar leads em estágios críticos sem contato há X horas → criar tasks + notificar
3) Weekly Sprint:
- toda segunda 09:00: criar sprint semanal padrão (tarefas) para cada cliente ativo
4) Metrics Ingest:
- endpoint para receber métricas (meta/ig/google) e gravar em kpi_values / creatives.performance

📦 PLAYBOOK “CLÍNICA PREMIUM — HARMONIZAÇÃO”
Criar templates dentro do sistema:
- Arquitetura de Mensagem QFD: Decorado (sentimento) → Método (planejamento em fases) → Procedimentos (meios)
- Scripts WhatsApp anti “ml” (primeira resposta, triagem, fechamento, follow-up)
- Checklist de Go-Live específico: tracking + CRM + criativos + campanhas
- Rotina de prova/valor: reviews Google, depoimentos, bastidores, educação
- KPIs padrão de clínica (agendamento, show, conversão, origem)

🧪 SEEDS (DADOS INICIAIS)
- 1 agency: “Velocity”
- 1 client demo: “Visage Face (demo)” com niche “Harmonização Facial”
- usuários demo: Admin, CS, Editor, Media, Analyst
- workflow templates: Novo Cliente, Sprint Semanal, MBR Mensal, Offboarding
- templates de mensagens WhatsApp
- templates de pauta semanal e MBR
- 10 tarefas padrão de sprint (conteúdo, mídia, CRM, dados)

✅ REQUISITOS DE UX ESSENCIAIS (TDAH-FRIENDLY)
- Tela “Today” sempre com:
  - Top 5 ações
  - Gates bloqueados com botão “Resolver agora”
  - SLAs vencendo
  - “Próxima ação” por cliente
- “Focus Mode” para executar por etapa (wizard) e impedir dispersão
- Logs e histórico claros (tudo auditável)
- Menos campos por tela; use etapas curtas e progress bar

🎭 ANIMAÇÕES E FEEDBACK
- Toasts (sucesso/erro/aviso)
- microcelebrações leves quando gates passam ou sprint fecha
- skeleton loaders e estados vazios bem desenhados

OBJETIVO FINAL
Entregar um sistema operacional completo, pronto para uso, que padroniza a agência com:
- Workflows guiados + gates
- Tarefas e rotinas recorrentes
- Portal do cliente para aprovações/ativos
- CRM pipeline básico + scripts
- Conteúdo/Creatives + aprovações
- Performance (KPIs) + health score
- Automações via n8n
- Supabase com RLS e multi-tenant
