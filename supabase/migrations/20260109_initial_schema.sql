-- ============================================================================
-- Velocity Agency OS - Full Database Schema
-- Version: 1.0.0
-- Date: 2026-01-09
-- Description: Complete schema with 21 tables, enums, indexes, and RLS policies
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'operator', 'viewer');
CREATE TYPE client_status AS ENUM ('lead', 'onboarding', 'active', 'churned', 'paused');
CREATE TYPE task_status AS ENUM ('backlog', 'todo', 'doing', 'review', 'done', 'blocked');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'revision');
CREATE TYPE lead_stage AS ENUM ('cold', 'warm', 'hot', 'qualified', 'proposal', 'closed');
CREATE TYPE gate_status AS ENUM ('pending', 'passed', 'failed', 'blocked');
CREATE TYPE creative_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'published');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE platform_type AS ENUM ('meta', 'google', 'tiktok', 'other');
CREATE TYPE asset_type AS ENUM ('image', 'video', 'document', 'link', 'credential');
CREATE TYPE creative_type AS ENUM ('image', 'video', 'carousel', 'story');
CREATE TYPE channel_type AS ENUM ('whatsapp', 'email', 'sms');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE experiment_status AS ENUM ('planned', 'running', 'completed', 'cancelled');
CREATE TYPE experiment_result AS ENUM ('win', 'loss', 'inconclusive');
CREATE TYPE client_user_role AS ENUM ('admin', 'editor', 'viewer');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- 1. Agencies (Multi-tenant root)
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Profiles
CREATE TABLE users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    niche TEXT,
    status client_status DEFAULT 'lead',
    health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
    owner_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(agency_id, slug)
);

-- ============================================================================
-- WORKSPACE & WORKFLOW TABLES
-- ============================================================================

-- 4. Workspaces
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Default',
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
    icon TEXT DEFAULT 'folder',
    is_active BOOLEAN DEFAULT true
);

-- 7. Steps
CREATE TABLE steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status task_status DEFAULT 'backlog',
    assignee_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ
);

-- 8. Gates
CREATE TABLE gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    conditions JSONB DEFAULT '[]',
    status gate_status DEFAULT 'pending',
    passed_at TIMESTAMPTZ
);

-- 9. Checklist Items
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES users_profile(id) ON DELETE SET NULL
);

-- ============================================================================
-- OPERATIONS TABLES
-- ============================================================================

-- 10. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status task_status DEFAULT 'backlog',
    priority priority_level DEFAULT 'medium',
    assignee_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    sprint_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Approvals
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'other',
    status approval_status DEFAULT 'pending',
    requester_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    file_url TEXT,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);

-- ============================================================================
-- ASSETS & FILES TABLES
-- ============================================================================

-- 12. Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type asset_type DEFAULT 'document',
    url TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- CRM TABLES
-- ============================================================================

-- 13. CRM Leads
CREATE TABLE crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    stage lead_stage DEFAULT 'cold',
    source TEXT,
    score INTEGER DEFAULT 0,
    assigned_to UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Message Templates
CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    channel channel_type DEFAULT 'whatsapp',
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- CAMPAIGNS & CREATIVES TABLES
-- ============================================================================

-- 15. Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    platform platform_type DEFAULT 'meta',
    status campaign_status DEFAULT 'draft',
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
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    type creative_type DEFAULT 'image',
    format TEXT,
    status creative_status DEFAULT 'draft',
    file_url TEXT,
    thumbnail_url TEXT,
    copy TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- KPI & EXPERIMENTS TABLES
-- ============================================================================

-- 17. KPI Definitions
CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key TEXT NOT NULL,
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

-- 19. Experiments
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    status experiment_status DEFAULT 'planned',
    result experiment_result,
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- AUDIT & ACCESS TABLES
-- ============================================================================

-- 20. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 21. Clients Users (Client Portal Access)
CREATE TABLE clients_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    role client_user_role DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(client_id, user_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Core lookups
CREATE INDEX idx_users_profile_agency ON users_profile(agency_id);
CREATE INDEX idx_clients_agency ON clients(agency_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_owner ON clients(owner_id);

-- Workspace/Workflow
CREATE INDEX idx_workspaces_client ON workspaces(client_id);
CREATE INDEX idx_workflows_workspace ON workflows(workspace_id);
CREATE INDEX idx_modules_workflow ON modules(workflow_id);
CREATE INDEX idx_steps_module ON steps(module_id);
CREATE INDEX idx_gates_module ON gates(module_id);
CREATE INDEX idx_checklist_step ON checklist_items(step_id);

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

-- Audit
CREATE INDEX idx_audit_agency ON audit_logs(agency_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Client Users
CREATE INDEX idx_clients_users_client ON clients_users(client_id);
CREATE INDEX idx_clients_users_user ON clients_users(user_id);

-- ============================================================================
-- TRIGGERS (updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON crm_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES (Agency-based multi-tenancy)
-- ============================================================================

-- Helper function to get user's agency_id
CREATE OR REPLACE FUNCTION auth.user_agency_id()
RETURNS UUID AS $$
    SELECT agency_id FROM users_profile WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Agencies: Users can only see their own agency
CREATE POLICY "Users can view own agency" ON agencies
    FOR SELECT USING (id = auth.user_agency_id());

-- Users Profile: Users can view colleagues, update own profile
CREATE POLICY "Users can view agency members" ON users_profile
    FOR SELECT USING (agency_id = auth.user_agency_id());

CREATE POLICY "Users can update own profile" ON users_profile
    FOR UPDATE USING (id = auth.uid());

-- Clients: Agency members can view/edit their clients
CREATE POLICY "Agency members access clients" ON clients
    FOR ALL USING (agency_id = auth.user_agency_id());

-- Workspaces: Through client access
CREATE POLICY "Access workspaces via client" ON workspaces
    FOR ALL USING (
        client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id())
    );

-- Workflows: Through workspace access
CREATE POLICY "Access workflows via workspace" ON workflows
    FOR ALL USING (
        workspace_id IN (
            SELECT w.id FROM workspaces w
            JOIN clients c ON w.client_id = c.id
            WHERE c.agency_id = auth.user_agency_id()
        )
    );

-- Modules: Through workflow access
CREATE POLICY "Access modules via workflow" ON modules
    FOR ALL USING (
        workflow_id IN (
            SELECT wf.id FROM workflows wf
            JOIN workspaces ws ON wf.workspace_id = ws.id
            JOIN clients c ON ws.client_id = c.id
            WHERE c.agency_id = auth.user_agency_id()
        )
    );

-- Steps: Through module access
CREATE POLICY "Access steps via module" ON steps
    FOR ALL USING (
        module_id IN (
            SELECT m.id FROM modules m
            JOIN workflows wf ON m.workflow_id = wf.id
            JOIN workspaces ws ON wf.workspace_id = ws.id
            JOIN clients c ON ws.client_id = c.id
            WHERE c.agency_id = auth.user_agency_id()
        )
    );

-- Gates: Through module access
CREATE POLICY "Access gates via module" ON gates
    FOR ALL USING (
        module_id IN (
            SELECT m.id FROM modules m
            JOIN workflows wf ON m.workflow_id = wf.id
            JOIN workspaces ws ON wf.workspace_id = ws.id
            JOIN clients c ON ws.client_id = c.id
            WHERE c.agency_id = auth.user_agency_id()
        )
    );

-- Checklist Items: Through step access
CREATE POLICY "Access checklist via step" ON checklist_items
    FOR ALL USING (
        step_id IN (
            SELECT s.id FROM steps s
            JOIN modules m ON s.module_id = m.id
            JOIN workflows wf ON m.workflow_id = wf.id
            JOIN workspaces ws ON wf.workspace_id = ws.id
            JOIN clients c ON ws.client_id = c.id
            WHERE c.agency_id = auth.user_agency_id()
        )
    );

-- Tasks: Through client access
CREATE POLICY "Access tasks via client" ON tasks
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- Approvals: Through client access
CREATE POLICY "Access approvals via client" ON approvals
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- Assets: Through client access
CREATE POLICY "Access assets via client" ON assets
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- CRM Leads: Through client access
CREATE POLICY "Access leads via client" ON crm_leads
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- Message Templates: Through client access
CREATE POLICY "Access templates via client" ON message_templates
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- Campaigns: Through client access
CREATE POLICY "Access campaigns via client" ON campaigns
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- Creatives: Through client access
CREATE POLICY "Access creatives via client" ON creatives
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- KPI Definitions: Agency access
CREATE POLICY "Access KPI defs via agency" ON kpi_definitions
    FOR ALL USING (agency_id = auth.user_agency_id());

-- KPI Values: Through client access
CREATE POLICY "Access KPI values via client" ON kpi_values
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- Experiments: Through client access
CREATE POLICY "Access experiments via client" ON experiments
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- Audit Logs: Agency access (read only for most users)
CREATE POLICY "View audit logs via agency" ON audit_logs
    FOR SELECT USING (agency_id = auth.user_agency_id());

-- Clients Users: Through client access
CREATE POLICY "Access client users via client" ON clients_users
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE agency_id = auth.user_agency_id()));

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
