/**
 * useExperiments Hook
 * 
 * CRUD operations for experiments table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type Experiment = Database['public']['Tables']['experiments']['Row'];
type ExperimentInsert = Database['public']['Tables']['experiments']['Insert'];
type ExperimentUpdate = Database['public']['Tables']['experiments']['Update'];

interface ExperimentFilters {
    client_id?: string;
    status?: Database['public']['Enums']['experiment_status'];
    result?: Database['public']['Enums']['experiment_result'];
}

// LIST - Fetch all experiments with optional filters
export function useExperiments(filters?: ExperimentFilters) {
    return useQuery({
        queryKey: ['experiments', filters],
        queryFn: async () => {
            let query = supabase.from('experiments').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.result) {
                query = query.eq('result', filters.result);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET ACTIVE EXPERIMENTS - Fetch running experiments
export function useActiveExperiments(clientId?: string) {
    return useExperiments({ client_id: clientId, status: 'running' });
}

// GET BY ID - Fetch single experiment
export function useExperiment(id: string) {
    return useQuery({
        queryKey: ['experiments', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('experiments')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new experiment
export function useCreateExperiment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (experiment: ExperimentInsert) => {
            // Ensure hypothesis is provided (required by DB)
            if (!experiment.hypothesis) {
                throw new Error('Hypothesis is required');
            }
            
            const { data, error } = await supabase
                .from('experiments')
                .insert({
                    client_id: experiment.client_id,
                    name: experiment.name,
                    hypothesis: experiment.hypothesis,
                    notes: experiment.notes,
                    status: experiment.status,
                    start_date: experiment.start_date,
                    end_date: experiment.end_date,
                    result: experiment.result,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['experiments', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update experiment
export function useUpdateExperiment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: ExperimentUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('experiments')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['experiments', data.id] });
            }
        }
    });
}

// DELETE - Delete experiment
export function useDeleteExperiment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('experiments')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
        }
    });
}

// START EXPERIMENT - Change status to running
export function useStartExperiment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('experiments')
                .update({
                    status: 'running' as const,
                    start_date: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
        }
    });
}

// COMPLETE EXPERIMENT - Mark as completed with result
export function useCompleteExperiment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            result,
            notes
        }: {
            id: string;
            result: Database['public']['Enums']['experiment_result'];
            notes?: string;
        }) => {
            const { data, error } = await supabase
                .from('experiments')
                .update({
                    status: 'completed' as const,
                    result,
                    notes,
                    end_date: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
        }
    });
}

// CANCEL EXPERIMENT
export function useCancelExperiment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
            const { data, error } = await supabase
                .from('experiments')
                .update({
                    status: 'cancelled' as const,
                    notes,
                    end_date: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
        }
    });
}
