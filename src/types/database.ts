export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            agencies: {
                Row: {
                    created_at: string | null
                    id: string
                    logo_url: string | null
                    name: string
                    settings: Json | null
                    slug: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    logo_url?: string | null
                    name: string
                    settings?: Json | null
                    slug: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    logo_url?: string | null
                    name?: string
                    settings?: Json | null
                    slug?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            approvals: {
                Row: {
                    client_id: string
                    created_at: string | null
                    description: string | null
                    due_date: string | null
                    feedback: string | null
                    file_url: string | null
                    id: string
                    requester_id: string
                    reviewed_at: string | null
                    reviewer_id: string | null
                    status: Database["public"]["Enums"]["approval_status"] | null
                    title: string
                    type: string | null
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    feedback?: string | null
                    file_url?: string | null
                    id?: string
                    requester_id: string
                    reviewed_at?: string | null
                    reviewer_id?: string | null
                    status?: Database["public"]["Enums"]["approval_status"] | null
                    title: string
                    type?: string | null
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    feedback?: string | null
                    file_url?: string | null
                    id?: string
                    requester_id?: string
                    reviewed_at?: string | null
                    reviewer_id?: string | null
                    status?: Database["public"]["Enums"]["approval_status"] | null
                    title?: string
                    type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "approvals_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "approvals_requester_id_fkey"
                        columns: ["requester_id"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "approvals_reviewer_id_fkey"
                        columns: ["reviewer_id"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                ]
            }
            assets: {
                Row: {
                    client_id: string
                    created_at: string | null
                    created_by: string
                    id: string
                    metadata: Json | null
                    name: string
                    type: Database["public"]["Enums"]["asset_type"]
                    url: string | null
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    created_by: string
                    id?: string
                    metadata?: Json | null
                    name: string
                    type: Database["public"]["Enums"]["asset_type"]
                    url?: string | null
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    created_by?: string
                    id?: string
                    metadata?: Json | null
                    name?: string
                    type?: Database["public"]["Enums"]["asset_type"]
                    url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "assets_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "assets_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                ]
            }
            audit_logs: {
                Row: {
                    action: string
                    agency_id: string
                    created_at: string | null
                    entity_id: string
                    entity_type: string
                    id: string
                    ip_address: unknown | null
                    new_data: Json | null
                    old_data: Json | null
                    user_id: string | null
                }
                Insert: {
                    action: string
                    agency_id: string
                    created_at?: string | null
                    entity_id: string
                    entity_type: string
                    id?: string
                    ip_address?: unknown | null
                    new_data?: Json | null
                    old_data?: Json | null
                    user_id?: string | null
                }
                Update: {
                    action?: string
                    agency_id?: string
                    created_at?: string | null
                    entity_id?: string
                    entity_type?: string
                    id?: string
                    ip_address?: unknown | null
                    new_data?: Json | null
                    old_data?: Json | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "audit_logs_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "audit_logs_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                ]
            }
            campaigns: {
                Row: {
                    budget: number | null
                    client_id: string
                    created_at: string | null
                    end_date: string | null
                    external_id: string | null
                    id: string
                    name: string
                    platform: Database["public"]["Enums"]["platform_type"]
                    spent: number | null
                    start_date: string | null
                    status: Database["public"]["Enums"]["campaign_status"] | null
                }
                Insert: {
                    budget?: number | null
                    client_id: string
                    created_at?: string | null
                    end_date?: string | null
                    external_id?: string | null
                    id?: string
                    name: string
                    platform: Database["public"]["Enums"]["platform_type"]
                    spent?: number | null
                    start_date?: string | null
                    status?: Database["public"]["Enums"]["campaign_status"] | null
                }
                Update: {
                    budget?: number | null
                    client_id?: string
                    created_at?: string | null
                    end_date?: string | null
                    external_id?: string | null
                    id?: string
                    name?: string
                    platform?: Database["public"]["Enums"]["platform_type"]
                    spent?: number | null
                    start_date?: string | null
                    status?: Database["public"]["Enums"]["campaign_status"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "campaigns_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            checklist_items: {
                Row: {
                    completed_at: string | null
                    completed_by: string | null
                    id: string
                    is_completed: boolean | null
                    name: string
                    step_id: string
                }
                Insert: {
                    completed_at?: string | null
                    completed_by?: string | null
                    id?: string
                    is_completed?: boolean | null
                    name: string
                    step_id: string
                }
                Update: {
                    completed_at?: string | null
                    completed_by?: string | null
                    id?: string
                    is_completed?: boolean | null
                    name?: string
                    step_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "checklist_items_completed_by_fkey"
                        columns: ["completed_by"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "checklist_items_step_id_fkey"
                        columns: ["step_id"]
                        isOneToOne: false
                        referencedRelation: "steps"
                        referencedColumns: ["id"]
                    },
                ]
            }
            client_notes: {
                Row: {
                    agency_id: string
                    client_id: string
                    content: string
                    created_at: string
                    id: string
                    type: Database["public"]["Enums"]["note_type"]
                    user_id: string
                }
                Insert: {
                    agency_id: string
                    client_id: string
                    content: string
                    created_at?: string
                    id?: string
                    type?: Database["public"]["Enums"]["note_type"]
                    user_id: string
                }
                Update: {
                    agency_id?: string
                    client_id?: string
                    content?: string
                    created_at?: string
                    id?: string
                    type?: Database["public"]["Enums"]["note_type"]
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "client_notes_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "client_notes_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "client_notes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    }
                ]
            }
            clients: {
                Row: {
                    agency_id: string
                    created_at: string | null
                    health_score: number | null
                    id: string
                    logo_url: string | null
                    name: string
                    niche: string | null
                    owner_id: string | null
                    settings: Json | null
                    slug: string
                    status: Database["public"]["Enums"]["client_status"] | null
                    updated_at: string | null
                }
                Insert: {
                    agency_id: string
                    created_at?: string | null
                    health_score?: number | null
                    id?: string
                    logo_url?: string | null
                    name: string
                    niche?: string | null
                    owner_id?: string | null
                    settings?: Json | null
                    slug: string
                    status?: Database["public"]["Enums"]["client_status"] | null
                    updated_at?: string | null
                }
                Update: {
                    agency_id?: string
                    created_at?: string | null
                    health_score?: number | null
                    id?: string
                    logo_url?: string | null
                    name?: string
                    niche?: string | null
                    owner_id?: string | null
                    settings?: Json | null
                    slug?: string
                    status?: Database["public"]["Enums"]["client_status"] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "clients_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "clients_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                ]
            }
            clients_users: {
                Row: {
                    client_id: string
                    created_at: string | null
                    id: string
                    role: Database["public"]["Enums"]["client_user_role"] | null
                    user_id: string
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    id?: string
                    role?: Database["public"]["Enums"]["client_user_role"] | null
                    user_id: string
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    id?: string
                    role?: Database["public"]["Enums"]["client_user_role"] | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "clients_users_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            creatives: {
                Row: {
                    campaign_id: string | null
                    client_id: string
                    copy: string | null
                    created_at: string | null
                    file_url: string | null
                    format: string | null
                    id: string
                    status: Database["public"]["Enums"]["creative_status"] | null
                    thumbnail_url: string | null
                    title: string
                    type: Database["public"]["Enums"]["creative_type"]
                }
                Insert: {
                    campaign_id?: string | null
                    client_id: string
                    copy?: string | null
                    created_at?: string | null
                    file_url?: string | null
                    format?: string | null
                    id?: string
                    status?: Database["public"]["Enums"]["creative_status"] | null
                    thumbnail_url?: string | null
                    title: string
                    type: Database["public"]["Enums"]["creative_type"]
                }
                Update: {
                    campaign_id?: string | null
                    client_id?: string
                    copy?: string | null
                    created_at?: string | null
                    file_url?: string | null
                    format?: string | null
                    id?: string
                    status?: Database["public"]["Enums"]["creative_status"] | null
                    thumbnail_url?: string | null
                    title?: string
                    type?: Database["public"]["Enums"]["creative_type"]
                }
                Relationships: [
                    {
                        foreignKeyName: "creatives_campaign_id_fkey"
                        columns: ["campaign_id"]
                        isOneToOne: false
                        referencedRelation: "campaigns"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "creatives_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            crm_leads: {
                Row: {
                    assigned_to: string | null
                    client_id: string
                    created_at: string | null
                    email: string | null
                    id: string
                    name: string
                    notes: string | null
                    phone: string | null
                    score: number | null
                    source: string | null
                    stage: Database["public"]["Enums"]["lead_stage"] | null
                    updated_at: string | null
                }
                Insert: {
                    assigned_to?: string | null
                    client_id: string
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name: string
                    notes?: string | null
                    phone?: string | null
                    score?: number | null
                    source?: string | null
                    stage?: Database["public"]["Enums"]["lead_stage"] | null
                    updated_at?: string | null
                }
                Update: {
                    assigned_to?: string | null
                    client_id?: string
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name?: string
                    notes?: string | null
                    phone?: string | null
                    score?: number | null
                    source?: string | null
                    stage?: Database["public"]["Enums"]["lead_stage"] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "crm_leads_assigned_to_fkey"
                        columns: ["assigned_to"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "crm_leads_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            experiments: {
                Row: {
                    client_id: string
                    created_at: string | null
                    end_date: string | null
                    hypothesis: string | null
                    id: string
                    name: string
                    notes: string | null
                    result: Database["public"]["Enums"]["experiment_result"] | null
                    start_date: string | null
                    status: Database["public"]["Enums"]["experiment_status"] | null
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    end_date?: string | null
                    hypothesis?: string | null
                    id?: string
                    name: string
                    notes?: string | null
                    result?: Database["public"]["Enums"]["experiment_result"] | null
                    start_date?: string | null
                    status?: Database["public"]["Enums"]["experiment_status"] | null
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    end_date?: string | null
                    hypothesis?: string | null
                    id?: string
                    name?: string
                    notes?: string | null
                    result?: Database["public"]["Enums"]["experiment_result"] | null
                    start_date?: string | null
                    status?: Database["public"]["Enums"]["experiment_status"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "experiments_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            gates: {
                Row: {
                    conditions: Json | null
                    id: string
                    module_id: string
                    name: string
                    passed_at: string | null
                    status: Database["public"]["Enums"]["gate_status"] | null
                }
                Insert: {
                    conditions?: Json | null
                    id?: string
                    module_id: string
                    name: string
                    passed_at?: string | null
                    status?: Database["public"]["Enums"]["gate_status"] | null
                }
                Update: {
                    conditions?: Json | null
                    id?: string
                    module_id?: string
                    name?: string
                    passed_at?: string | null
                    status?: Database["public"]["Enums"]["gate_status"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "gates_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "modules"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kpi_definitions: {
                Row: {
                    agency_id: string
                    id: string
                    is_default: boolean | null
                    key: string
                    name: string
                    target_direction: string | null
                    unit: string | null
                }
                Insert: {
                    agency_id: string
                    id?: string
                    is_default?: boolean | null
                    key: string
                    name: string
                    target_direction?: string | null
                    unit?: string | null
                }
                Update: {
                    agency_id?: string
                    id?: string
                    is_default?: boolean | null
                    key?: string
                    name?: string
                    target_direction?: string | null
                    unit?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "kpi_definitions_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kpi_values: {
                Row: {
                    client_id: string
                    created_at: string | null
                    id: string
                    kpi_id: string
                    period_end: string
                    period_start: string
                    source: string | null
                    value: number
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    id?: string
                    kpi_id: string
                    period_end: string
                    period_start: string
                    source?: string | null
                    value: number
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    id?: string
                    kpi_id?: string
                    period_end?: string
                    period_start?: string
                    source?: string | null
                    value?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "kpi_values_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kpi_values_kpi_id_fkey"
                        columns: ["kpi_id"]
                        isOneToOne: false
                        referencedRelation: "kpi_definitions"
                        referencedColumns: ["id"]
                    },
                ]
            }
            message_templates: {
                Row: {
                    channel: Database["public"]["Enums"]["channel_type"] | null
                    client_id: string
                    content: string
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    variables: Json | null
                }
                Insert: {
                    channel?: Database["public"]["Enums"]["channel_type"] | null
                    client_id: string
                    content: string
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    variables?: Json | null
                }
                Update: {
                    channel?: Database["public"]["Enums"]["channel_type"] | null
                    client_id?: string
                    content?: string
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    variables?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "message_templates_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            modules: {
                Row: {
                    color: string | null
                    icon: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    order_index: number
                    workflow_id: string
                }
                Insert: {
                    color?: string | null
                    icon?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    order_index: number
                    workflow_id: string
                }
                Update: {
                    color?: string | null
                    icon?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    order_index?: number
                    workflow_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "modules_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            steps: {
                Row: {
                    assignee_id: string | null
                    description: string | null
                    due_date: string | null
                    id: string
                    module_id: string
                    name: string
                    order_index: number
                    status: Database["public"]["Enums"]["task_status"] | null
                }
                Insert: {
                    assignee_id?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    module_id: string
                    name: string
                    order_index: number
                    status?: Database["public"]["Enums"]["task_status"] | null
                }
                Update: {
                    assignee_id?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    module_id?: string
                    name?: string
                    order_index?: number
                    status?: Database["public"]["Enums"]["task_status"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "steps_assignee_id_fkey"
                        columns: ["assignee_id"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "steps_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "modules"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tasks: {
                Row: {
                    assignee_id: string | null
                    client_id: string
                    created_at: string | null
                    description: string | null
                    due_date: string | null
                    id: string
                    priority: Database["public"]["Enums"]["priority_level"] | null
                    sprint_id: string | null
                    status: Database["public"]["Enums"]["task_status"] | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    assignee_id?: string | null
                    client_id: string
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    priority?: Database["public"]["Enums"]["priority_level"] | null
                    sprint_id?: string | null
                    status?: Database["public"]["Enums"]["task_status"] | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    assignee_id?: string | null
                    client_id?: string
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    priority?: Database["public"]["Enums"]["priority_level"] | null
                    sprint_id?: string | null
                    status?: Database["public"]["Enums"]["task_status"] | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tasks_assignee_id_fkey"
                        columns: ["assignee_id"]
                        isOneToOne: false
                        referencedRelation: "users_profile"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tasks_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users_profile: {
                Row: {
                    agency_id: string
                    avatar_url: string | null
                    created_at: string | null
                    email: string
                    full_name: string
                    id: string
                    is_active: boolean | null
                    role: Database["public"]["Enums"]["user_role"] | null
                    updated_at: string | null
                }
                Insert: {
                    agency_id: string
                    avatar_url?: string | null
                    created_at?: string | null
                    email: string
                    full_name: string
                    id: string
                    is_active?: boolean | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Update: {
                    agency_id?: string
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string
                    full_name?: string
                    id?: string
                    is_active?: boolean | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "users_profile_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            workflows: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    workspace_id: string
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    workspace_id: string
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    workspace_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "workflows_workspace_id_fkey"
                        columns: ["workspace_id"]
                        isOneToOne: false
                        referencedRelation: "workspaces"
                        referencedColumns: ["id"]
                    },
                ]
            }
            workspaces: {
                Row: {
                    client_id: string
                    created_at: string | null
                    id: string
                    name: string
                    settings: Json | null
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    id?: string
                    name: string
                    settings?: Json | null
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    id?: string
                    name?: string
                    settings?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "workspaces_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            user_agency_id: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
        }
        Enums: {
            approval_status: "pending" | "approved" | "rejected" | "revision"
            asset_type: "image" | "video" | "document" | "link" | "credential"
            campaign_status: "draft" | "active" | "paused" | "completed"
            channel_type: "whatsapp" | "email" | "sms"
            client_status: "lead" | "onboarding" | "active" | "churned" | "paused"
            client_user_role: "admin" | "editor" | "viewer"
            creative_status: "draft" | "pending_approval" | "approved" | "rejected" | "published"
            creative_type: "image" | "video" | "carousel" | "story"
            experiment_result: "win" | "loss" | "inconclusive"
            experiment_status: "planned" | "running" | "completed" | "cancelled"
            gate_status: "pending" | "passed" | "failed" | "blocked"
            lead_stage: "cold" | "warm" | "hot" | "qualified" | "proposal" | "closed"
            note_type: "note" | "decision" | "ata"
            platform_type: "meta" | "google" | "tiktok" | "other"
            priority_level: "low" | "medium" | "high" | "urgent"
            task_status: "backlog" | "todo" | "doing" | "review" | "done" | "blocked"
            user_role: "owner" | "admin" | "manager" | "operator" | "viewer"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for convenience
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']