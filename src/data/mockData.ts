// Centralized mock data for Velocity Agency OS

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cs' | 'editor' | 'media' | 'analyst' | 'viewer';
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface Client {
  id: string;
  name: string;
  niche: string;
  phase: 'onboarding' | 'strategy' | 'setup' | 'golive' | 'operation' | 'scale' | 'offboarding';
  health: 'ok' | 'warn' | 'risk';
  owner: User;
  progress: number;
  nextMBR: string;
  logo?: string;
  businessData: {
    capacity: number;
    pricing: string;
    location: string;
  };
}

export interface WorkflowModule {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'blocked' | 'done';
  progress: number;
  steps: WorkflowStep[];
  gate?: Gate;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done' | 'blocked';
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
  status: 'pass' | 'fail';
  conditions: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: User;
  dueAt: string;
  clientId: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: 'instagram' | 'ads' | 'google' | 'referral' | 'whatsapp';
  stage: 'new' | 'qualified' | 'scheduled' | 'showed' | 'closed' | 'lost';
  lastContactAt: string;
  notes: string;
  clientId: string;
}

export interface Creative {
  id: string;
  title: string;
  type: 'image' | 'video' | 'copy' | 'carousel';
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  thumbnail?: string;
  scheduledFor?: string;
  platform: 'instagram' | 'facebook' | 'google' | 'tiktok';
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'meta' | 'google';
  objective: string;
  status: 'active' | 'paused' | 'draft';
  budgetDaily: number;
  spent: number;
  leads: number;
  cpl: number;
}

export interface Approval {
  id: string;
  type: 'creative' | 'copy' | 'plan' | 'budget';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: User;
  requestedAt: string;
  slaDueAt: string;
  preview?: string;
  clientId: string;
}

export interface Asset {
  id: string;
  type: 'logo' | 'photo' | 'video' | 'doc' | 'consent';
  title: string;
  status: 'missing' | 'uploaded' | 'validated';
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
  modules: string[];
  scriptsCount: number;
  templatesCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'sprint' | 'mbr' | 'meeting' | 'deadline' | 'golive';
  date: string;
  time?: string;
  clientId?: string;
  clientName?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: User;
  type: 'note' | 'decision' | 'ata';
}

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@velocity.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Carlos Costa', email: 'carlos@velocity.com', role: 'cs', status: 'active' },
  { id: '3', name: 'Marina Reis', email: 'marina@velocity.com', role: 'editor', status: 'active' },
  { id: '4', name: 'Pedro Santos', email: 'pedro@velocity.com', role: 'media', status: 'active' },
  { id: '5', name: 'Julia Mendes', email: 'julia@velocity.com', role: 'analyst', status: 'active' },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'cli-001',
    name: 'Visage Face',
    niche: 'Harmonização Facial',
    phase: 'operation',
    health: 'ok',
    owner: mockUsers[1],
    progress: 78,
    nextMBR: '2026-01-15',
    businessData: { capacity: 40, pricing: 'Premium', location: 'São Paulo, SP' },
  },
  {
    id: 'cli-002',
    name: 'Clínica Renova',
    niche: 'Estética Corporal',
    phase: 'setup',
    health: 'warn',
    owner: mockUsers[1],
    progress: 45,
    nextMBR: '2026-01-20',
    businessData: { capacity: 30, pricing: 'Mid-Premium', location: 'Rio de Janeiro, RJ' },
  },
  {
    id: 'cli-003',
    name: 'Dr. Marcus Vinicius',
    niche: 'Harmonização Facial',
    phase: 'strategy',
    health: 'risk',
    owner: mockUsers[1],
    progress: 22,
    nextMBR: '2026-01-25',
    businessData: { capacity: 20, pricing: 'Premium', location: 'Belo Horizonte, MG' },
  },
  {
    id: 'cli-004',
    name: 'Bella Vita Estética',
    niche: 'Estética Avançada',
    phase: 'golive',
    health: 'ok',
    owner: mockUsers[1],
    progress: 92,
    nextMBR: '2026-01-18',
    businessData: { capacity: 50, pricing: 'Acessível', location: 'Curitiba, PR' },
  },
  {
    id: 'cli-005',
    name: 'Instituto Dermato',
    niche: 'Dermatologia',
    phase: 'onboarding',
    health: 'ok',
    owner: mockUsers[1],
    progress: 10,
    nextMBR: '2026-02-01',
    businessData: { capacity: 60, pricing: 'Premium', location: 'Brasília, DF' },
  },
];

// Mock Workflow for a client
export const mockWorkflowModules: WorkflowModule[] = [
  {
    id: 'mod-1',
    title: 'Onboarding Interno',
    status: 'done',
    progress: 100,
    steps: [
      { id: 's1', title: 'Contrato assinado', description: 'Verificar assinatura', status: 'done', owner: 'Admin', slaHours: 24, checklist: [] },
      { id: 's2', title: 'Setup Workspace', description: 'Criar espaço do cliente', status: 'done', owner: 'CS', slaHours: 4, checklist: [] },
    ],
    gate: { id: 'g1', title: 'Gate Onboarding', status: 'pass', conditions: ['Contrato OK', 'Workspace criado'] },
  },
  {
    id: 'mod-2',
    title: 'Kickoff',
    status: 'done',
    progress: 100,
    steps: [
      { id: 's3', title: 'Agendar reunião', description: 'Marcar kickoff com cliente', status: 'done', owner: 'CS', slaHours: 48, checklist: [] },
      { id: 's4', title: 'Realizar kickoff', description: 'Executar reunião de kickoff', status: 'done', owner: 'CS', slaHours: 2, checklist: [] },
    ],
    gate: { id: 'g2', title: 'Gate Kickoff', status: 'pass', conditions: ['Kickoff realizado', 'Metas definidas'] },
  },
  {
    id: 'mod-3',
    title: 'Coleta de Acessos',
    status: 'done',
    progress: 100,
    steps: [
      { id: 's5', title: 'Solicitar acessos', description: 'Enviar checklist de acessos', status: 'done', owner: 'CS', slaHours: 24, checklist: [] },
      { id: 's6', title: 'Validar acessos', description: 'Verificar todos os acessos', status: 'done', owner: 'CS', slaHours: 48, checklist: [] },
    ],
  },
  {
    id: 'mod-4',
    title: 'Diagnóstico 360',
    status: 'done',
    progress: 100,
    steps: [
      { id: 's7', title: 'Análise de mercado', description: 'Pesquisar concorrentes', status: 'done', owner: 'Analyst', slaHours: 72, checklist: [] },
      { id: 's8', title: 'Audit digital', description: 'Analisar presença atual', status: 'done', owner: 'Analyst', slaHours: 48, checklist: [] },
    ],
    gate: { id: 'g3', title: 'Gate Diagnóstico', status: 'pass', conditions: ['Análise completa', 'Relatório entregue'] },
  },
  {
    id: 'mod-5',
    title: 'Blueprint 30/60/90',
    status: 'done',
    progress: 100,
    steps: [
      { id: 's9', title: 'Definir metas', description: 'Estabelecer KPIs por período', status: 'done', owner: 'CS', slaHours: 24, checklist: [] },
      { id: 's10', title: 'Priorizar ações ICE', description: 'Pontuar e ordenar hipóteses', status: 'done', owner: 'CS', slaHours: 24, checklist: [] },
    ],
    gate: { id: 'g4', title: 'Gate Estratégia', status: 'pass', conditions: ['Metas numéricas OK', 'Persona definida', 'Oferta clara'] },
  },
  {
    id: 'mod-6',
    title: 'Setup Tracking',
    status: 'in_progress',
    progress: 60,
    steps: [
      { id: 's11', title: 'Instalar Pixel', description: 'Configurar Meta Pixel', status: 'done', owner: 'Media', slaHours: 4, checklist: [] },
      { id: 's12', title: 'Configurar GTM', description: 'Setup Google Tag Manager', status: 'in_progress', owner: 'Media', slaHours: 8, checklist: [] },
      { id: 's13', title: 'Eventos essenciais', description: 'Configurar eventos de conversão', status: 'pending', owner: 'Media', slaHours: 4, checklist: [] },
    ],
    gate: { id: 'g5', title: 'Gate Tracking', status: 'fail', conditions: ['Pixel OK', 'GTM OK', 'Eventos OK'] },
  },
  {
    id: 'mod-7',
    title: 'Setup CRM/WhatsApp',
    status: 'in_progress',
    progress: 40,
    steps: [
      { id: 's14', title: 'Configurar pipeline', description: 'Criar etapas do funil', status: 'done', owner: 'CS', slaHours: 4, checklist: [] },
      { id: 's15', title: 'Templates WhatsApp', description: 'Criar scripts de resposta', status: 'in_progress', owner: 'CS', slaHours: 8, checklist: [] },
    ],
  },
  {
    id: 'mod-8',
    title: 'Setup Conteúdo',
    status: 'not_started',
    progress: 0,
    steps: [
      { id: 's16', title: 'Calendário editorial', description: 'Planejar 30 dias', status: 'pending', owner: 'Editor', slaHours: 24, checklist: [] },
      { id: 's17', title: 'Criar criativos', description: 'Produzir peças iniciais', status: 'pending', owner: 'Editor', slaHours: 48, checklist: [] },
    ],
  },
  {
    id: 'mod-9',
    title: 'Setup Mídia',
    status: 'not_started',
    progress: 0,
    steps: [
      { id: 's18', title: 'Estruturar campanhas', description: 'Criar estrutura de ads', status: 'pending', owner: 'Media', slaHours: 8, checklist: [] },
      { id: 's19', title: 'Configurar públicos', description: 'Definir segmentações', status: 'pending', owner: 'Media', slaHours: 4, checklist: [] },
    ],
  },
  {
    id: 'mod-10',
    title: 'Go-Live',
    status: 'not_started',
    progress: 0,
    steps: [
      { id: 's20', title: 'Checklist final', description: 'Validar todos os gates', status: 'pending', owner: 'CS', slaHours: 4, checklist: [] },
      { id: 's21', title: 'Ativar campanhas', description: 'Ligar ads', status: 'pending', owner: 'Media', slaHours: 2, checklist: [] },
    ],
    gate: { id: 'g6', title: 'Gate Go-Live', status: 'fail', conditions: ['Tracking OK', 'CRM OK', 'Criativos aprovados', 'Campanhas estruturadas'] },
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  { id: 't1', title: 'Finalizar configuração GTM', description: 'Completar setup do Google Tag Manager', status: 'doing', priority: 'high', owner: mockUsers[3], dueAt: '2026-01-10', clientId: 'cli-001' },
  { id: 't2', title: 'Criar 5 criativos para Stories', description: 'Produzir peças para campanha de janeiro', status: 'todo', priority: 'medium', owner: mockUsers[2], dueAt: '2026-01-12', clientId: 'cli-001' },
  { id: 't3', title: 'Revisar scripts WhatsApp', description: 'Ajustar tom de voz nos templates', status: 'todo', priority: 'medium', owner: mockUsers[1], dueAt: '2026-01-11', clientId: 'cli-001' },
  { id: 't4', title: 'Configurar eventos de conversão', description: 'Setup dos eventos no Pixel', status: 'blocked', priority: 'urgent', owner: mockUsers[3], dueAt: '2026-01-09', clientId: 'cli-001' },
  { id: 't5', title: 'Aprovar calendário editorial', description: 'Cliente precisa aprovar o plano', status: 'todo', priority: 'high', owner: mockUsers[1], dueAt: '2026-01-10', clientId: 'cli-001' },
];

// Mock Leads
export const mockLeads: Lead[] = [
  { id: 'l1', name: 'Maria Fernanda', phone: '(11) 99999-1111', source: 'instagram', stage: 'new', lastContactAt: '2026-01-09T10:30:00', notes: 'Interessada em harmonização', clientId: 'cli-001' },
  { id: 'l2', name: 'João Pedro', phone: '(11) 99999-2222', source: 'ads', stage: 'qualified', lastContactAt: '2026-01-08T15:00:00', notes: 'Já fez procedimentos antes', clientId: 'cli-001' },
  { id: 'l3', name: 'Ana Carolina', phone: '(11) 99999-3333', source: 'referral', stage: 'scheduled', lastContactAt: '2026-01-09T09:00:00', notes: 'Indicação da Maria, agendou para dia 15', clientId: 'cli-001' },
  { id: 'l4', name: 'Roberto Silva', phone: '(11) 99999-4444', source: 'google', stage: 'showed', lastContactAt: '2026-01-07T14:00:00', notes: 'Compareceu, fazendo orçamento', clientId: 'cli-001' },
  { id: 'l5', name: 'Fernanda Lima', phone: '(11) 99999-5555', source: 'ads', stage: 'closed', lastContactAt: '2026-01-06T11:00:00', notes: 'Fechou pacote completo', clientId: 'cli-001' },
  { id: 'l6', name: 'Carlos Eduardo', phone: '(11) 99999-6666', source: 'whatsapp', stage: 'lost', lastContactAt: '2026-01-05T16:00:00', notes: 'Achou caro, não retornou', clientId: 'cli-001' },
];

// Mock Creatives
export const mockCreatives: Creative[] = [
  { id: 'cr1', title: 'Antes e Depois - Harmonização', type: 'image', status: 'published', platform: 'instagram', scheduledFor: '2026-01-08' },
  { id: 'cr2', title: 'Depoimento Dra. Ana', type: 'video', status: 'approved', platform: 'instagram', scheduledFor: '2026-01-10' },
  { id: 'cr3', title: 'Carrossel Procedimentos', type: 'carousel', status: 'review', platform: 'instagram', scheduledFor: '2026-01-12' },
  { id: 'cr4', title: 'Copy Campanha Janeiro', type: 'copy', status: 'draft', platform: 'facebook' },
  { id: 'cr5', title: 'Bastidores Clínica', type: 'video', status: 'draft', platform: 'instagram' },
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  { id: 'camp1', name: 'Harmonização - Awareness', platform: 'meta', objective: 'Alcance', status: 'active', budgetDaily: 50, spent: 320, leads: 0, cpl: 0 },
  { id: 'camp2', name: 'Harmonização - Leads', platform: 'meta', objective: 'Leads', status: 'active', budgetDaily: 100, spent: 890, leads: 45, cpl: 19.78 },
  { id: 'camp3', name: 'Remarketing', platform: 'meta', objective: 'Conversões', status: 'paused', budgetDaily: 30, spent: 150, leads: 12, cpl: 12.50 },
  { id: 'camp4', name: 'Search - Harmonização SP', platform: 'google', objective: 'Leads', status: 'draft', budgetDaily: 80, spent: 0, leads: 0, cpl: 0 },
];

// Mock Approvals
export const mockApprovals: Approval[] = [
  { id: 'ap1', type: 'creative', title: 'Carrossel Procedimentos', description: '5 slides mostrando procedimentos disponíveis', status: 'pending', requestedBy: mockUsers[2], requestedAt: '2026-01-08T14:00:00', slaDueAt: '2026-01-10T14:00:00', clientId: 'cli-001' },
  { id: 'ap2', type: 'copy', title: 'Legenda Campanha Janeiro', description: 'Copy para o post principal do mês', status: 'pending', requestedBy: mockUsers[2], requestedAt: '2026-01-09T10:00:00', slaDueAt: '2026-01-11T10:00:00', clientId: 'cli-001' },
  { id: 'ap3', type: 'plan', title: 'Calendário Editorial Janeiro', description: 'Plano de 15 posts para o mês', status: 'pending', requestedBy: mockUsers[1], requestedAt: '2026-01-07T09:00:00', slaDueAt: '2026-01-09T18:00:00', clientId: 'cli-001' },
  { id: 'ap4', type: 'budget', title: 'Aumento Budget Meta', description: 'Proposta de aumento de R$100 para R$150/dia', status: 'approved', requestedBy: mockUsers[3], requestedAt: '2026-01-05T11:00:00', slaDueAt: '2026-01-07T11:00:00', clientId: 'cli-001' },
];

// Mock Assets
export const mockAssets: Asset[] = [
  { id: 'as1', type: 'logo', title: 'Logo Principal', status: 'validated' },
  { id: 'as2', type: 'photo', title: 'Fotos da Clínica', status: 'uploaded' },
  { id: 'as3', type: 'photo', title: 'Fotos da Equipe', status: 'missing' },
  { id: 'as4', type: 'video', title: 'Vídeo Institucional', status: 'missing' },
  { id: 'as5', type: 'doc', title: 'Termo de Uso de Imagem', status: 'validated' },
  { id: 'as6', type: 'consent', title: 'Autorização Antes/Depois', status: 'uploaded' },
];

// Mock Reports
export const mockReports: Report[] = [
  { id: 'rp1', type: 'weekly', title: 'Relatório Semanal', period: '30/12 - 05/01', createdAt: '2026-01-06', highlights: ['45 leads gerados', 'CPL de R$19,78', '3 agendamentos'], decisions: ['Aumentar budget em 50%', 'Criar novos criativos de depoimento'] },
  { id: 'rp2', type: 'mbr', title: 'MBR Dezembro', period: 'Dezembro 2025', createdAt: '2026-01-02', highlights: ['180 leads no mês', 'Taxa de show 65%', '12 procedimentos realizados'], decisions: ['Manter estratégia atual', 'Testar público lookalike'] },
];

// Mock Playbooks
export const mockPlaybooks: Playbook[] = [
  { id: 'pb1', name: 'Clínica Premium - Harmonização Facial', niche: 'Harmonização Facial', description: 'Playbook completo para clínicas de harmonização com foco em posicionamento premium', modules: ['QFD', 'Scripts WhatsApp', 'Rotinas de Prova/Valor', 'KPIs'], scriptsCount: 8, templatesCount: 12 },
  { id: 'pb2', name: 'Estética Corporal', niche: 'Estética Corporal', description: 'Metodologia para clínicas focadas em procedimentos corporais', modules: ['QFD', 'Scripts WhatsApp', 'Funil de Vendas'], scriptsCount: 6, templatesCount: 8 },
  { id: 'pb3', name: 'Dermatologia Clínica', niche: 'Dermatologia', description: 'Playbook para consultórios dermatológicos', modules: ['Posicionamento', 'Scripts', 'Conteúdo Educativo'], scriptsCount: 5, templatesCount: 6 },
];

// Mock Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'ev1', title: 'Sprint Semanal', type: 'sprint', date: '2026-01-13', time: '09:00', clientId: 'cli-001', clientName: 'Visage Face' },
  { id: 'ev2', title: 'MBR Mensal', type: 'mbr', date: '2026-01-15', time: '14:00', clientId: 'cli-001', clientName: 'Visage Face' },
  { id: 'ev3', title: 'Go-Live', type: 'golive', date: '2026-01-18', time: '10:00', clientId: 'cli-004', clientName: 'Bella Vita' },
  { id: 'ev4', title: 'Reunião de Alinhamento', type: 'meeting', date: '2026-01-10', time: '15:00', clientId: 'cli-002', clientName: 'Clínica Renova' },
  { id: 'ev5', title: 'Kickoff', type: 'meeting', date: '2026-01-12', time: '10:00', clientId: 'cli-005', clientName: 'Instituto Dermato' },
  { id: 'ev6', title: 'Deadline Criativos', type: 'deadline', date: '2026-01-11', clientId: 'cli-001', clientName: 'Visage Face' },
];

// Mock Notes
export const mockNotes: Note[] = [
  { id: 'n1', content: 'Cliente aprovou a estratégia de posicionamento premium. Foco em resultados naturais.', createdAt: '2026-01-08T16:00:00', createdBy: mockUsers[1], type: 'decision' },
  { id: 'n2', content: 'Reunião de kickoff realizada. Cliente muito engajado e com expectativas alinhadas.', createdAt: '2026-01-05T11:00:00', createdBy: mockUsers[1], type: 'ata' },
  { id: 'n3', content: 'Lembrar de pedir fotos atualizadas do espaço após reforma.', createdAt: '2026-01-07T14:30:00', createdBy: mockUsers[2], type: 'note' },
];

// WhatsApp Message Templates
export const mockMessageTemplates = [
  { id: 'mt1', name: 'Primeira Resposta', category: 'first_reply', content: 'Olá! 😊 Obrigada pelo seu interesse! Vi que você quer saber mais sobre harmonização facial. Para te ajudar melhor, pode me contar um pouquinho sobre o que você gostaria de realçar no seu rosto?' },
  { id: 'mt2', name: 'Triagem', category: 'triage', content: 'Que legal! Entendi perfeitamente. 💫 Aqui na clínica trabalhamos com um planejamento facial completo, onde analisamos seu rosto como um todo para trazer harmonia natural. Você já fez algum procedimento antes?' },
  { id: 'mt3', name: 'Fechamento', category: 'closing', content: 'Perfeito! Que tal marcarmos uma avaliação? É sem compromisso e você vai conhecer nosso método de planejamento facial. Temos horário disponível [DIA] às [HORA]. Funciona pra você?' },
  { id: 'mt4', name: 'Follow-up D+1', category: 'followup_d1', content: 'Oi! 👋 Passando aqui pra ver se ficou alguma dúvida sobre a harmonização facial. Fico à disposição!' },
  { id: 'mt5', name: 'Follow-up D+3', category: 'followup_d3', content: 'Olá! Sei que a rotina é corrida, mas não queria deixar de te lembrar que estou aqui caso queira agendar sua avaliação. Sem pressão, ok? 😊' },
  { id: 'mt6', name: 'Lembrete Consulta', category: 'reminder', content: 'Oi! Tudo bem? 😊 Passando pra confirmar sua avaliação amanhã, [DIA], às [HORA]. Posso contar com a sua presença?' },
];

// QFD - Arquitetura de Mensagem
export const mockQFD = {
  decorado: {
    title: 'Decorado (Sentimento)',
    items: [
      'Confiança ao se olhar no espelho',
      'Naturalidade que encanta',
      'Harmonia que realça sua essência',
      'Rejuvenescimento sutil e elegante',
    ],
  },
  metodo: {
    title: 'Método (Planejamento)',
    items: [
      'Análise facial 360° personalizada',
      'Planejamento em fases progressivas',
      'Acompanhamento contínuo de resultados',
      'Ajustes precisos ao longo do tempo',
    ],
  },
  procedimentos: {
    title: 'Procedimentos (Meios)',
    items: [
      'Toxina botulínica',
      'Ácido hialurônico',
      'Bioestimuladores de colágeno',
      'Fios de PDO',
      'Skinbooster',
    ],
  },
};

// Tracking Checklist
export const mockTrackingChecklist = [
  { id: 'tc1', title: 'Meta Pixel instalado', status: 'done' as const },
  { id: 'tc2', title: 'Google Tag Manager configurado', status: 'in_progress' as const },
  { id: 'tc3', title: 'Evento PageView funcionando', status: 'done' as const },
  { id: 'tc4', title: 'Evento Lead configurado', status: 'pending' as const },
  { id: 'tc5', title: 'Evento Purchase configurado', status: 'pending' as const },
  { id: 'tc6', title: 'UTMs padronizados', status: 'done' as const },
  { id: 'tc7', title: 'Google Analytics 4 conectado', status: 'pending' as const },
];

// Access Checklist
export const mockAccessChecklist = [
  { id: 'ac1', title: 'Instagram Business', status: 'validated' as const },
  { id: 'ac2', title: 'Meta Business Manager', status: 'validated' as const },
  { id: 'ac3', title: 'Conta de Anúncios Meta', status: 'validated' as const },
  { id: 'ac4', title: 'Google Ads', status: 'pending' as const },
  { id: 'ac5', title: 'Google Analytics', status: 'pending' as const },
  { id: 'ac6', title: 'Acesso ao Site/Domínio', status: 'validated' as const },
  { id: 'ac7', title: 'WhatsApp Business', status: 'validated' as const },
];

// KPI Definitions
export const mockKPIs = [
  { id: 'kpi1', name: 'Leads', value: 45, previousValue: 38, period: 'Últimos 7 dias' },
  { id: 'kpi2', name: 'Taxa de Agendamento', value: 42, previousValue: 35, period: 'Últimos 7 dias', suffix: '%' },
  { id: 'kpi3', name: 'Show Rate', value: 68, previousValue: 72, period: 'Últimos 7 dias', suffix: '%' },
  { id: 'kpi4', name: 'Conversão', value: 28, previousValue: 25, period: 'Últimos 7 dias', suffix: '%' },
  { id: 'kpi5', name: 'CPL', value: 19.78, previousValue: 22.50, period: 'Últimos 7 dias', prefix: 'R$' },
  { id: 'kpi6', name: 'Investimento', value: 890, previousValue: 750, period: 'Últimos 7 dias', prefix: 'R$' },
];
