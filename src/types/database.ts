/**
 * Supabase Database Types
 * 
 * This file will be replaced with auto-generated types from Supabase CLI.
 * For now, it contains placeholder types for the 21 tables defined in the schema.
 * 
 * To generate real types:
 * npx supabase gen types typescript --project-id cuowpgsuaylnqntwnnur > src/types/database.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

// Enums
export type UserRole = 'owner' | 'admin' | 'manager' | 'operator' | 'viewer';
export type ClientStatus = 'lead' | 'onboarding' | 'active' | 'churned' | 'paused';
export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'review' | 'done' | 'blocked';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revision';
export type LeadStage = 'cold' | 'warm' | 'hot' | 'qualified' | 'proposal' | 'closed';
export type GateStatus = 'pending' | 'passed' | 'failed' | 'blocked';
export type CreativeStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'published';

export interface Database {
    public: {
        Tables: {
            // Core Tables
            agencies: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    logo_url: string | null;
                    settings: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['agencies']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['agencies']['Insert']>;
            };

            users_profile: {
                Row: {
                    id: string;
                    agency_id: string;
                    email: string;
                    full_name: string;
                    avatar_url: string | null;
                    role: UserRole;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['users_profile']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['users_profile']['Insert']>;
            };

            clients: {
                Row: {
                    id: string;
                    agency_id: string;
                    name: string;
                    slug: string;
                    niche: string;
                    status: ClientStatus;
                    health_score: number;
                    owner_id: string | null;
                    logo_url: string | null;
                    settings: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['clients']['Insert']>;
            };

            // Workspace & Workflow
            workspaces: {
                Row: {
                    id: string;
                    client_id: string;
                    name: string;
                    settings: Json;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['workspaces']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['workspaces']['Insert']>;
            };

            workflows: {
                Row: {
                    id: string;
                    workspace_id: string;
                    name: string;
                    description: string | null;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['workflows']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['workflows']['Insert']>;
            };

            modules: {
                Row: {
                    id: string;
                    workflow_id: string;
                    name: string;
                    order_index: number;
                    color: string;
                    icon: string;
                    is_active: boolean;
                };
                Insert: Omit<Database['public']['Tables']['modules']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['modules']['Insert']>;
            };

            steps: {
                Row: {
                    id: string;
                    module_id: string;
                    name: string;
                    description: string | null;
                    order_index: number;
                    status: TaskStatus;
                    assignee_id: string | null;
                    due_date: string | null;
                };
                Insert: Omit<Database['public']['Tables']['steps']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['steps']['Insert']>;
            };

            gates: {
                Row: {
                    id: string;
                    module_id: string;
                    name: string;
                    conditions: Json;
                    status: GateStatus;
                    passed_at: string | null;
                };
                Insert: Omit<Database['public']['Tables']['gates']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['gates']['Insert']>;
            };

            // Operations
            tasks: {
                Row: {
                    id: string;
                    client_id: string;
                    title: string;
                    description: string | null;
                    status: TaskStatus;
                    priority: 'low' | 'medium' | 'high' | 'urgent';
                    assignee_id: string | null;
                    due_date: string | null;
                    sprint_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
            };

            approvals: {
                Row: {
                    id: string;
                    client_id: string;
                    title: string;
                    description: string | null;
                    type: 'creative' | 'copy' | 'strategy' | 'report' | 'other';
                    status: ApprovalStatus;
                    requester_id: string;
                    reviewer_id: string | null;
                    due_date: string | null;
                    file_url: string | null;
                    feedback: string | null;
                    created_at: string;
                    reviewed_at: string | null;
                };
                Insert: Omit<Database['public']['Tables']['approvals']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['approvals']['Insert']>;
            };

            // Assets & Files
            assets: {
                Row: {
                    id: string;
                    client_id: string;
                    name: string;
                    type: 'image' | 'video' | 'document' | 'link' | 'credential';
                    url: string | null;
                    metadata: Json;
                    created_by: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['assets']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['assets']['Insert']>;
            };

            // CRM
            crm_leads: {
                Row: {
                    id: string;
                    client_id: string;
                    name: string;
                    email: string | null;
                    phone: string | null;
                    stage: LeadStage;
                    source: string | null;
                    score: number;
                    assigned_to: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['crm_leads']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['crm_leads']['Insert']>;
            };

            message_templates: {
                Row: {
                    id: string;
                    client_id: string;
                    name: string;
                    channel: 'whatsapp' | 'email' | 'sms';
                    content: string;
                    variables: Json;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['message_templates']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['message_templates']['Insert']>;
            };

            // Campaigns & Creatives
            campaigns: {
                Row: {
                    id: string;
                    client_id: string;
                    name: string;
                    platform: 'meta' | 'google' | 'tiktok' | 'other';
                    status: 'draft' | 'active' | 'paused' | 'completed';
                    budget: number;
                    spent: number;
                    start_date: string | null;
                    end_date: string | null;
                    external_id: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
            };

            creatives: {
                Row: {
                    id: string;
                    client_id: string;
                    campaign_id: string | null;
                    title: string;
                    type: 'image' | 'video' | 'carousel' | 'story';
                    format: string;
                    status: CreativeStatus;
                    file_url: string | null;
                    thumbnail_url: string | null;
                    copy: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['creatives']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['creatives']['Insert']>;
            };

            // KPIs & Experiments
            kpi_definitions: {
                Row: {
                    id: string;
                    agency_id: string;
                    name: string;
                    key: string;
                    unit: string;
                    target_direction: 'higher' | 'lower';
                    is_default: boolean;
                };
                Insert: Omit<Database['public']['Tables']['kpi_definitions']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['kpi_definitions']['Insert']>;
            };

            kpi_values: {
                Row: {
                    id: string;
                    client_id: string;
                    kpi_id: string;
                    value: number;
                    period_start: string;
                    period_end: string;
                    source: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['kpi_values']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['kpi_values']['Insert']>;
            };

            experiments: {
                Row: {
                    id: string;
                    client_id: string;
                    name: string;
                    hypothesis: string;
                    status: 'planned' | 'running' | 'completed' | 'cancelled';
                    result: 'win' | 'loss' | 'inconclusive' | null;
                    start_date: string | null;
                    end_date: string | null;
                    notes: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['experiments']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['experiments']['Insert']>;
            };

            // Audit & Access
            audit_logs: {
                Row: {
                    id: string;
                    agency_id: string;
                    user_id: string;
                    action: string;
                    entity_type: string;
                    entity_id: string;
                    old_data: Json | null;
                    new_data: Json | null;
                    ip_address: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
            };

            clients_users: {
                Row: {
                    id: string;
                    client_id: string;
                    user_id: string;
                    role: 'admin' | 'editor' | 'viewer';
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['clients_users']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['clients_users']['Insert']>;
            };

            checklist_items: {
                Row: {
                    id: string;
                    step_id: string;
                    name: string;
                    is_completed: boolean;
                    completed_at: string | null;
                    completed_by: string | null;
                };
                Insert: Omit<Database['public']['Tables']['checklist_items']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['checklist_items']['Insert']>;
            };
        };

        Views: {};

        Functions: {};

        Enums: {
            user_role: UserRole;
            client_status: ClientStatus;
            task_status: TaskStatus;
            approval_status: ApprovalStatus;
            lead_stage: LeadStage;
            gate_status: GateStatus;
            creative_status: CreativeStatus;
        };
    };
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
