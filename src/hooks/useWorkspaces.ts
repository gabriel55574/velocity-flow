/**
 * useWorkspaces Hook
 * 
 * CRUD operations for workspaces table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Workspace = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];
type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update'];

// LIST - Fetch all workspaces for a client
export function useWorkspaces(clientId: string) {
    return useQuery({
        queryKey: ['workspaces', { client_id: clientId }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workspaces')
                .select(`
          *,
          workflows (
            id,
            name,
            is_active
          )
        `)
                .eq('client_id', clientId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!clientId
    });
}

// GET BY ID - Fetch single workspace with workflows
export function useWorkspace(id: string) {
    return useQuery({
        queryKey: ['workspaces', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workspaces')
                .select(`
          *,
          client:clients (
            id,
            name,
            slug
          ),
          workflows (
            *,
            modules (
              *,
              steps (*),
              gates (*)
            )
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

// GET DEFAULT WORKSPACE FOR CLIENT
export function useClientDefaultWorkspace(clientId: string) {
    return useQuery({
        queryKey: ['workspaces', 'default', clientId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workspaces')
                .select('*')
                .eq('client_id', clientId)
                .order('created_at', { ascending: true })
                .limit(1)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!clientId
    });
}

// CREATE - Create new workspace
export function useCreateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (workspace: WorkspaceInsert) => {
            const { data, error } = await supabase
                .from('workspaces')
                .insert(workspace)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['workspaces', { client_id: data.client_id }] });
                queryClient.invalidateQueries({ queryKey: ['clients', data.client_id] });
            }
        }
    });
}

// UPDATE - Update workspace
export function useUpdateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: WorkspaceUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('workspaces')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['workspaces', data.id] });
            }
        }
    });
}

// DELETE - Delete workspace
export function useDeleteWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('workspaces')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        }
    });
}

// UPDATE SETTINGS - Update workspace settings JSON
export function useUpdateWorkspaceSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, settings }: { id: string; settings: Record<string, unknown> }) => {
            const { data, error } = await supabase
                .from('workspaces')
                .update({ settings })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        }
    });
}
