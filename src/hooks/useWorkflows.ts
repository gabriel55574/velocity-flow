/**
 * useWorkflows Hook
 * 
 * CRUD operations for workflows, modules, steps, gates, and checklist_items
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Step = Database['public']['Tables']['steps']['Row'];
type Gate = Database['public']['Tables']['gates']['Row'];
type WorkflowInsert = Database['public']['Tables']['workflows']['Insert'];
type WorkflowUpdate = Database['public']['Tables']['workflows']['Update'];
type ModuleInsert = Database['public']['Tables']['modules']['Insert'];
type ModuleUpdate = Database['public']['Tables']['modules']['Update'];
type StepInsert = Database['public']['Tables']['steps']['Insert'];
type StepUpdate = Database['public']['Tables']['steps']['Update'];

// ============================================================================
// WORKFLOWS
// ============================================================================

// LIST - Fetch all workflows for a workspace
export function useWorkflows(workspaceId: string) {
    return useQuery({
        queryKey: ['workflows', { workspace_id: workspaceId }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workflows')
                .select(`
          *,
          modules (
            *,
            steps (*),
            gates (*)
          )
        `)
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!workspaceId
    });
}

// GET BY ID - Fetch single workflow with all nested data
export function useWorkflow(id: string) {
    return useQuery({
        queryKey: ['workflows', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workflows')
                .select(`
          *,
          modules (
            *,
            steps (
              *,
              checklist_items (*)
            ),
            gates (*)
          )
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new workflow
export function useCreateWorkflow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (workflow: WorkflowInsert) => {
            const { data, error } = await supabase
                .from('workflows')
                .insert(workflow)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// UPDATE - Update existing workflow
export function useUpdateWorkflow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: WorkflowUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('workflows')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['workflows', data.id] });
            }
        }
    });
}

// DELETE - Delete workflow
export function useDeleteWorkflow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('workflows')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// ============================================================================
// MODULES
// ============================================================================

// LIST - Fetch all modules for a workflow
export function useModules(workflowId: string) {
    return useQuery({
        queryKey: ['modules', { workflow_id: workflowId }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('modules')
                .select(`
          *,
          steps (*),
          gates (*)
        `)
                .eq('workflow_id', workflowId)
                .order('order_index', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!workflowId
    });
}

// CREATE - Create new module
export function useCreateModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (module: ModuleInsert) => {
            const { data, error } = await supabase
                .from('modules')
                .insert(module)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// UPDATE - Update existing module
export function useUpdateModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: ModuleUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('modules')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
            if (data?.workflow_id) {
                queryClient.invalidateQueries({ queryKey: ['workflows', data.workflow_id] });
            }
        }
    });
}

// DELETE - Delete module
export function useDeleteModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('modules')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// ============================================================================
// STEPS
// ============================================================================

// LIST - Fetch all steps for a module
export function useSteps(moduleId: string) {
    return useQuery({
        queryKey: ['steps', { module_id: moduleId }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('steps')
                .select(`
          *,
          checklist_items (*)
        `)
                .eq('module_id', moduleId)
                .order('order_index', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!moduleId
    });
}

// CREATE - Create new step
export function useCreateStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (step: StepInsert) => {
            const { data, error } = await supabase
                .from('steps')
                .insert(step)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['steps'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// UPDATE - Update existing step
export function useUpdateStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: StepUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('steps')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['steps'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
            if (data?.module_id) {
                queryClient.invalidateQueries({ queryKey: ['steps', { module_id: data.module_id }] });
            }
        }
    });
}

// DELETE - Delete step
export function useDeleteStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('steps')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['steps'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// UPDATE STEP STATUS
export function useUpdateStepStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Database['public']['Enums']['task_status'] }) => {
            const { data, error } = await supabase
                .from('steps')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['steps'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// ============================================================================
// CHECKLIST ITEMS
// ============================================================================

// TOGGLE CHECKLIST ITEM
export function useToggleChecklistItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            is_completed,
            completed_by
        }: {
            id: string;
            is_completed: boolean;
            completed_by?: string;
        }) => {
            const { data, error } = await supabase
                .from('checklist_items')
                .update({
                    is_completed,
                    completed_at: is_completed ? new Date().toISOString() : null,
                    completed_by: is_completed ? completed_by : null
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['steps'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// DELETE CHECKLIST ITEM
export function useDeleteChecklistItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('checklist_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['steps'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// ============================================================================
// GATES
// ============================================================================

// GET GATE BY ID
export function useGate(id: string) {
    return useQuery({
        queryKey: ['gates', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('gates')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// UPDATE GATE STATUS
export function useUpdateGateStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Database['public']['Enums']['gate_status'] }) => {
            const updates: Partial<Gate> = { status };
            if (status === 'passed') {
                updates.passed_at = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('gates')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gates'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });
}

// GET BLOCKED GATES - For Today Dashboard
export function useBlockedGates() {
    return useQuery({
        queryKey: ['gates', { status: 'blocked' }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('gates')
                .select(`
          *,
          module:modules (
            name,
            workflow:workflows (
              name,
              workspace:workspaces (
                client:clients (
                  id,
                  name
                )
              )
            )
          )
        `)
                .in('status', ['blocked', 'failed']);

            if (error) throw error;
            return data;
        }
    });
}
// ============================================================================
// SPECIALIZED HOOKS FOR WORKSPACE TABS
// ============================================================================

export function useProjectModules(filters: { client_id: string }) {
    return useQuery({
        queryKey: ['project_modules', filters],
        queryFn: async () => {
            const { data: workspace } = await supabase
                .from('workspaces')
                .select('id')
                .eq('client_id', filters.client_id)
                .maybeSingle();

            if (!workspace) return [];

            const { data: workflow } = await supabase
                .from('workflows')
                .select('id')
                .eq('workspace_id', workspace.id)
                .limit(1)
                .maybeSingle();

            if (!workflow) return [];

            const { data, error } = await supabase
                .from('modules')
                .select(`
                    *,
                    steps (*)
                `)
                .eq('workflow_id', workflow.id)
                .order('order_index', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!filters.client_id
    });
}

export function useTrackingChecklist(filters: { client_id: string }) {
    return useQuery({
        queryKey: ['tracking_checklist', filters],
        queryFn: async () => {
            const { data: workspace } = await supabase
                .from('workspaces')
                .select('id')
                .eq('client_id', filters.client_id)
                .maybeSingle();

            if (!workspace) return [];

            const { data, error } = await supabase
                .from('steps')
                .select(`
                    *,
                    module:modules!inner(*)
                `)
                .eq('module.workflow_id', (
                    await supabase
                        .from('workflows')
                        .select('id')
                        .eq('workspace_id', workspace.id)
                        .limit(1)
                        .maybeSingle()
                ).data?.id)
                .ilike('module.name', '%tracking%')
                .order('order_index', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!filters.client_id
    });
}

export function useAccessValidation(filters: { client_id: string }) {
    return useQuery({
        queryKey: ['access_validation', filters],
        queryFn: async () => {
            const { data: workspace } = await supabase
                .from('workspaces')
                .select('id')
                .eq('client_id', filters.client_id)
                .maybeSingle();

            if (!workspace) return [];

            const { data, error } = await supabase
                .from('steps')
                .select(`
                    *,
                    module:modules!inner(*)
                `)
                .eq('module.workflow_id', (
                    await supabase
                        .from('workflows')
                        .select('id')
                        .eq('workspace_id', workspace.id)
                        .limit(1)
                        .maybeSingle()
                ).data?.id)
                .ilike('module.name', '%acesso%')
                .order('order_index', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!filters.client_id
    });
}
