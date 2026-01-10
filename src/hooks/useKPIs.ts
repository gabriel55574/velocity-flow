/**
 * useKPIs Hook
 * 
 * CRUD operations for kpi_definitions and kpi_values tables
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type KPIDefinition = Database['public']['Tables']['kpi_definitions']['Row'];
type KPIDefinitionInsert = Database['public']['Tables']['kpi_definitions']['Insert'];
type KPIDefinitionUpdate = Database['public']['Tables']['kpi_definitions']['Update'];

type KPIValue = Database['public']['Tables']['kpi_values']['Row'];
type KPIValueInsert = Database['public']['Tables']['kpi_values']['Insert'];
type KPIValueUpdate = Database['public']['Tables']['kpi_values']['Update'];

// ============================================================================
// KPI DEFINITIONS
// ============================================================================

// LIST - Fetch all KPI definitions for an agency
export function useKPIDefinitions(agencyId: string) {
    return useQuery({
        queryKey: ['kpi_definitions', { agency_id: agencyId }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('kpi_definitions')
                .select('*')
                .eq('agency_id', agencyId)
                .order('name', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!agencyId
    });
}

// GET DEFAULT KPIs - Fetch default KPI definitions
export function useDefaultKPIs(agencyId: string) {
    return useQuery({
        queryKey: ['kpi_definitions', 'default', agencyId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('kpi_definitions')
                .select('*')
                .eq('agency_id', agencyId)
                .eq('is_default', true)
                .order('name', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!agencyId
    });
}

// GET BY ID - Fetch single KPI definition
export function useKPIDefinition(id: string) {
    return useQuery({
        queryKey: ['kpi_definitions', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('kpi_definitions')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new KPI definition
export function useCreateKPIDefinition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (definition: KPIDefinitionInsert) => {
            const { data, error } = await supabase
                .from('kpi_definitions')
                .insert(definition)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kpi_definitions'] });
        }
    });
}

// UPDATE - Update KPI definition
export function useUpdateKPIDefinition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: KPIDefinitionUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('kpi_definitions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['kpi_definitions'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['kpi_definitions', data.id] });
            }
        }
    });
}

// DELETE - Delete KPI definition
export function useDeleteKPIDefinition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('kpi_definitions')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kpi_definitions'] });
        }
    });
}

// ============================================================================
// KPI VALUES
// ============================================================================

// LIST - Fetch KPI values for a client
export function useKPIValues(clientId: string, filters?: { kpi_id?: string; period_start?: string; period_end?: string }) {
    return useQuery({
        queryKey: ['kpi_values', { client_id: clientId, ...filters }],
        queryFn: async () => {
            let query = supabase
                .from('kpi_values')
                .select(`
          *,
          kpi:kpi_definitions (*)
        `)
                .eq('client_id', clientId);

            if (filters?.kpi_id) {
                query = query.eq('kpi_id', filters.kpi_id);
            }
            if (filters?.period_start) {
                query = query.gte('period_start', filters.period_start);
            }
            if (filters?.period_end) {
                query = query.lte('period_end', filters.period_end);
            }

            const { data, error } = await query.order('period_start', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!clientId
    });
}

// GET LATEST VALUES - Fetch most recent KPI values for a client
export function useLatestKPIValues(clientId: string) {
    return useQuery({
        queryKey: ['kpi_values', 'latest', clientId],
        queryFn: async () => {
            // Get latest value for each KPI
            const { data: definitions } = await supabase
                .from('kpi_definitions')
                .select('id');

            if (!definitions) return [];

            const latestValues = await Promise.all(
                definitions.map(async (def) => {
                    const { data } = await supabase
                        .from('kpi_values')
                        .select(`
              *,
              kpi:kpi_definitions (*)
            `)
                        .eq('client_id', clientId)
                        .eq('kpi_id', def.id)
                        .order('period_end', { ascending: false })
                        .limit(1)
                        .single();

                    return data;
                })
            );

            return latestValues.filter(Boolean);
        },
        enabled: !!clientId
    });
}

// CREATE - Record new KPI value
export function useCreateKPIValue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (value: KPIValueInsert) => {
            const { data, error } = await supabase
                .from('kpi_values')
                .insert(value)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['kpi_values', { client_id: data.client_id }] });
                queryClient.invalidateQueries({ queryKey: ['kpi_values', 'latest', data.client_id] });
            }
        }
    });
}

// BULK CREATE - Record multiple KPI values at once
export function useBulkCreateKPIValues() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: KPIValueInsert[]) => {
            const { data, error } = await supabase
                .from('kpi_values')
                .insert(values)
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
        }
    });
}

// UPDATE - Update KPI value
export function useUpdateKPIValue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: KPIValueUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('kpi_values')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
        }
    });
}

// DELETE - Delete KPI value
export function useDeleteKPIValue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('kpi_values')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
        }
    });
}
