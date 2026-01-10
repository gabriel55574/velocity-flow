/**
 * useCampaigns Hook
 * 
 * CRUD operations for campaigns table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

interface CampaignFilters {
    client_id?: string;
    status?: Database['public']['Enums']['campaign_status'];
    platform?: Database['public']['Enums']['platform_type'];
}

// LIST - Fetch all campaigns with optional filters
export function useCampaigns(filters?: CampaignFilters) {
    return useQuery({
        queryKey: ['campaigns', filters],
        queryFn: async () => {
            let query = supabase.from('campaigns').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.platform) {
                query = query.eq('platform', filters.platform);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch single campaign with creatives
export function useCampaign(id: string) {
    return useQuery({
        queryKey: ['campaigns', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('campaigns')
                .select(`
          *,
          creatives (*)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new campaign
export function useCreateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (campaign: CampaignInsert) => {
            const { data, error } = await supabase
                .from('campaigns')
                .insert(campaign)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['campaigns', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update existing campaign
export function useUpdateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: CampaignUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('campaigns')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['campaigns', data.id] });
            }
        }
    });
}

// DELETE - Delete campaign
export function useDeleteCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('campaigns')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        }
    });
}

// UPDATE METRICS - Update campaign performance data
export function useUpdateCampaignMetrics() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            spent,
            budget,
            impressions,
            clicks,
            conversions,
            revenue
        }: {
            id: string;
            spent?: number;
            budget?: number;
            impressions?: number;
            clicks?: number;
            conversions?: number;
            revenue?: number;
        }) => {
            const updates: CampaignUpdate = {
                spent,
                budget,
                impressions,
                clicks,
                conversions,
                revenue
            };

            const { data, error } = await supabase
                .from('campaigns')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['campaigns', data.id] });
            }
        }
    });
}
