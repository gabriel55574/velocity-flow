-- ============================================================================
-- Velocity Agency OS - Seed Data
-- Date: 2026-01-09
-- Description: Demo data for testing and development
-- ============================================================================

-- Agency
INSERT INTO agencies (id, name, slug, logo_url, settings)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'Velocity Agency',
    'velocity-agency',
    '/logo.svg',
    '{"timezone": "America/Sao_Paulo", "currency": "BRL"}'
) ON CONFLICT (slug) DO NOTHING;

-- Clients
INSERT INTO clients (id, agency_id, name, slug, niche, status, health_score, settings)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'techcorp-solutions', 'SaaS', 'active', 92, '{"plan": "premium", "monthly_budget": 15000}'),
    ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Bella Moda', 'bella-moda', 'E-commerce', 'active', 78, '{"plan": "standard", "monthly_budget": 8000}'),
    ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'ClínicaVida', 'clinica-vida', 'Saúde', 'onboarding', 100, '{"plan": "starter", "monthly_budget": 5000}')
ON CONFLICT DO NOTHING;

-- Workspaces
INSERT INTO workspaces (id, client_id, name, settings)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'Marketing Digital', '{}'),
    ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', 'Growth E-commerce', '{}'),
    ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440013', 'Onboarding Clínica', '{}')
ON CONFLICT DO NOTHING;

-- Workflows
INSERT INTO workflows (id, workspace_id, name, description, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', 'Workflow Padrão SaaS', 'Workflow completo para clientes SaaS', true),
    ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440022', 'Workflow E-commerce', 'Workflow otimizado para vendas online', true),
    ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440023', 'Workflow Onboarding', 'Workflow inicial de kickoff', true)
ON CONFLICT DO NOTHING;

-- Modules
INSERT INTO modules (id, workflow_id, name, order_index, color, icon, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', 'Kickoff', 0, '#10B981', 'rocket', true),
    ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440031', 'Diagnóstico', 1, '#3B82F6', 'search', true),
    ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440031', 'Estratégia', 2, '#8B5CF6', 'lightbulb', true),
    ('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440031', 'Execução', 3, '#F59E0B', 'play', true),
    ('550e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440031', 'Otimização', 4, '#EF4444', 'trending-up', true)
ON CONFLICT DO NOTHING;

-- Steps
INSERT INTO steps (id, module_id, name, description, order_index, status)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440041', 'Reunião de Kickoff', 'Apresentação inicial do projeto', 0, 'done'),
    ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440041', 'Coletar Acessos', 'Obter credenciais de plataformas', 1, 'done'),
    ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440041', 'Setup de Tracking', 'Configurar GA4 e pixels', 2, 'doing'),
    ('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440042', 'Análise de Funil', 'Mapear funil atual', 0, 'todo'),
    ('550e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440042', 'Benchmark Concorrência', 'Análise competitiva', 1, 'backlog')
ON CONFLICT DO NOTHING;

-- Tasks
INSERT INTO tasks (id, client_id, title, description, status, priority, due_date)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440011', 'Revisar copy do anúncio principal', 'Ajustar headline e CTA', 'doing', 'high', NOW() + INTERVAL '2 days'),
    ('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440011', 'Criar relatório semanal', 'Compilar métricas da semana', 'todo', 'medium', NOW() + INTERVAL '5 days'),
    ('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440011', 'Otimizar campanha de remarketing', 'Ajustar públicos e lances', 'blocked', 'high', NOW() + INTERVAL '1 day'),
    ('550e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440012', 'Configurar pixel da loja', 'Instalar e testar', 'doing', 'urgent', NOW()),
    ('550e8400-e29b-41d4-a716-446655440065', '550e8400-e29b-41d4-a716-446655440012', 'Criar carousel de produtos', 'Selecionar produtos destaque', 'todo', 'medium', NOW() + INTERVAL '3 days'),
    ('550e8400-e29b-41d4-a716-446655440066', '550e8400-e29b-41d4-a716-446655440013', 'Agendar reunião de kickoff', 'Primeira call com cliente', 'done', 'high', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- CRM Leads
INSERT INTO crm_leads (id, client_id, name, email, phone, stage, source, score, notes)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440011', 'João Silva', 'joao@empresa.com', '11999887766', 'qualified', 'Meta Ads', 85, 'Demonstrou interesse no plano Enterprise'),
    ('550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440011', 'Maria Santos', 'maria@startup.io', '11988776655', 'proposal', 'Google Ads', 92, 'Agendou demo para semana que vem'),
    ('550e8400-e29b-41d4-a716-446655440073', '550e8400-e29b-41d4-a716-446655440011', 'Pedro Costa', 'pedro@tech.com', '11977665544', 'hot', 'Organic', 78, 'Veio pelo blog'),
    ('550e8400-e29b-41d4-a716-446655440074', '550e8400-e29b-41d4-a716-446655440012', 'Ana Oliveira', 'ana@gmail.com', '21999887766', 'warm', 'Instagram', 45, 'Interessada em produtos de inverno'),
    ('550e8400-e29b-41d4-a716-446655440075', '550e8400-e29b-41d4-a716-446655440012', 'Carlos Ferreira', 'carlos@email.com', '21988776655', 'cold', 'Meta Ads', 25, 'Primeiro contato')
ON CONFLICT DO NOTHING;

-- Campaigns
INSERT INTO campaigns (id, client_id, name, platform, status, budget, spent, start_date, end_date)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440011', 'Lead Gen SaaS Q1', 'meta', 'active', 5000.00, 2340.50, '2026-01-01', '2026-03-31'),
    ('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440011', 'Remarketing Users', 'google', 'active', 2000.00, 890.25, '2026-01-01', '2026-02-28'),
    ('550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440012', 'Promoção Verão', 'meta', 'active', 3000.00, 1567.80, '2026-01-05', '2026-01-31'),
    ('550e8400-e29b-41d4-a716-446655440084', '550e8400-e29b-41d4-a716-446655440012', 'Carrinho Abandonado', 'meta', 'paused', 1500.00, 750.00, '2026-01-01', '2026-01-31')
ON CONFLICT DO NOTHING;

-- Creatives
INSERT INTO creatives (id, client_id, campaign_id, title, type, format, status, copy)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440081', 'Hero Banner SaaS', 'image', '1200x628', 'approved', 'Automatize seu negócio em minutos'),
    ('550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440081', 'Demo Video 30s', 'video', '1080x1920', 'pending_approval', 'Veja como funciona na prática'),
    ('550e8400-e29b-41d4-a716-446655440093', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440083', 'Carousel Produtos', 'carousel', '1080x1080', 'approved', 'Até 50% OFF em peças selecionadas'),
    ('550e8400-e29b-41d4-a716-446655440094', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440083', 'Story Promocional', 'story', '1080x1920', 'draft', 'Coleção de verão chegou!')
ON CONFLICT DO NOTHING;

-- KPI Definitions
INSERT INTO kpi_definitions (id, agency_id, name, key, unit, target_direction, is_default)
VALUES 
    ('550e8400-e29b-41d4-a716-4466554400a1', '550e8400-e29b-41d4-a716-446655440001', 'Custo por Lead', 'cpl', 'BRL', 'lower', true),
    ('550e8400-e29b-41d4-a716-4466554400a2', '550e8400-e29b-41d4-a716-446655440001', 'Taxa de Conversão', 'conversion_rate', '%', 'higher', true),
    ('550e8400-e29b-41d4-a716-4466554400a3', '550e8400-e29b-41d4-a716-446655440001', 'ROAS', 'roas', 'x', 'higher', true),
    ('550e8400-e29b-41d4-a716-4466554400a4', '550e8400-e29b-41d4-a716-446655440001', 'CTR', 'ctr', '%', 'higher', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
