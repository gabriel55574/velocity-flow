/**
 * useClients Hook
 * 
 * CRUD operations for clients table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

interface ClientFilters {
    status?: Database['public']['Enums']['client_status'];
    health?: 'good' | 'at_risk' | 'critical';
    agency_id?: string;
}

// LIST - Fetch all clients with optional filters
export function useClients(filters?: ClientFilters) {
    return useQuery({
        queryKey: ['clients', filters],
        queryFn: async () => {
            let query = supabase
                .from('clients')
                .select(`
          *,
          workspaces (*)
        `);

            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.agency_id) {
                query = query.eq('agency_id', filters.agency_id);
            }

            // Health Score Filters
            if (filters?.health) {
                if (filters.health === 'good') {
                    query = query.gte('health_score', 80);
                } else if (filters.health === 'at_risk') {
                    query = query.gte('health_score', 50).lt('health_score', 80);
                } else if (filters.health === 'critical') {
                    query = query.lt('health_score', 50);
                }
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch single client with related data
export function useClient(id: string) {
    return useQuery({
        queryKey: ['clients', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('clients')
                .select(`
          *,
          workspaces (
            *,
            workflows (
              *,
              modules (
                *,
                steps (*),
                gates (*)
              )
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

// CREATE - Create new client
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

            // Create workspace automatically
            if (data) {
                await supabase.from('workspaces').insert({
                    client_id: data.id,
                    name: `Workspace ${data.name}`,
                    settings: {}
                });
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        }
    });
}

// UPDATE - Update existing client
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
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['clients', data.id] });
            }
        }
    });
}

// DELETE - Delete client
export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        }
    });
}
