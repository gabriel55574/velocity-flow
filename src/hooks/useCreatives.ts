/**
 * useCreatives Hook
 * 
 * CRUD operations for creatives table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type Creative = Database['public']['Tables']['creatives']['Row'];
type CreativeInsert = Database['public']['Tables']['creatives']['Insert'];
type CreativeUpdate = Database['public']['Tables']['creatives']['Update'];

interface CreativeFilters {
    client_id?: string;
    campaign_id?: string;
    status?: Database['public']['Enums']['creative_status'];
    type?: Database['public']['Enums']['creative_type'];
}

// LIST - Fetch all creatives with optional filters
export function useCreatives(filters?: CreativeFilters) {
    return useQuery({
        queryKey: ['creatives', filters],
        queryFn: async () => {
            let query = supabase.from('creatives').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.campaign_id) {
                query = query.eq('campaign_id', filters.campaign_id);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.type) {
                query = query.eq('type', filters.type);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch single creative
export function useCreative(id: string) {
    return useQuery({
        queryKey: ['creatives', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('creatives')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new creative
export function useCreateCreative() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (creative: CreativeInsert) => {
            const { data, error } = await supabase
                .from('creatives')
                .insert(creative)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['creatives'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['creatives', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update existing creative
export function useUpdateCreative() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: CreativeUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('creatives')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['creatives'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['creatives', data.id] });
            }
        }
    });
}

// DELETE - Delete creative
export function useDeleteCreative() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('creatives')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creatives'] });
        }
    });
}

// UPDATE STATUS - Change creative status
export function useUpdateCreativeStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Database['public']['Enums']['creative_status'] }) => {
            const { data, error } = await supabase
                .from('creatives')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creatives'] });
        }
    });
}
