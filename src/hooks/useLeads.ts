/**
 * useLeads Hook
 * 
 * CRUD operations for crm_leads table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Lead = Database['public']['Tables']['crm_leads']['Row'];
type LeadInsert = Database['public']['Tables']['crm_leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['crm_leads']['Update'];

interface LeadFilters {
    client_id?: string;
    stage?: Database['public']['Enums']['lead_stage'];
    assigned_to?: string;
}

// LIST - Fetch all leads with optional filters
export function useLeads(filters?: LeadFilters) {
    return useQuery({
        queryKey: ['leads', filters],
        queryFn: async () => {
            let query = supabase.from('crm_leads').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.stage) {
                query = query.eq('stage', filters.stage);
            }
            if (filters?.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch single lead
export function useLead(id: string) {
    return useQuery({
        queryKey: ['leads', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('crm_leads')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new lead
export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (lead: LeadInsert) => {
            const { data, error } = await supabase
                .from('crm_leads')
                .insert(lead)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['leads', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update existing lead
export function useUpdateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: LeadUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('crm_leads')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['leads', data.id] });
            }
        }
    });
}

// DELETE - Delete lead
export function useDeleteLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('crm_leads')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        }
    });
}

// UPDATE STAGE - Move lead in pipeline
export function useUpdateLeadStage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, stage }: { id: string; stage: Database['public']['Enums']['lead_stage'] }) => {
            const { data, error } = await supabase
                .from('crm_leads')
                .update({ stage })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        }
    });
}
