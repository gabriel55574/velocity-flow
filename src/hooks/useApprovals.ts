/**
 * useApprovals Hook
 * 
 * CRUD operations for approvals table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Approval = Database['public']['Tables']['approvals']['Row'];
type ApprovalInsert = Database['public']['Tables']['approvals']['Insert'];
type ApprovalUpdate = Database['public']['Tables']['approvals']['Update'];

interface ApprovalFilters {
    client_id?: string;
    status?: Database['public']['Enums']['approval_status'];
    type?: string;
    requester_id?: string;
}

// LIST - Fetch all approvals with optional filters
export function useApprovals(filters?: ApprovalFilters) {
    return useQuery({
        queryKey: ['approvals', filters],
        queryFn: async () => {
            let query = supabase.from('approvals').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.type) {
                query = query.eq('type', filters.type);
            }
            if (filters?.requester_id) {
                query = query.eq('requester_id', filters.requester_id);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET PENDING - Shortcut for pending approvals
export function usePendingApprovals(clientId?: string) {
    return useApprovals({ client_id: clientId, status: 'pending' });
}

// GET BY ID - Fetch single approval
export function useApproval(id: string) {
    return useQuery({
        queryKey: ['approvals', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('approvals')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new approval request
export function useCreateApproval() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (approval: ApprovalInsert) => {
            const { data, error } = await supabase
                .from('approvals')
                .insert(approval)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['approvals', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update existing approval
export function useUpdateApproval() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: ApprovalUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('approvals')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['approvals', data.id] });
            }
        }
    });
}

// DELETE - Delete approval
export function useDeleteApproval() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('approvals')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
        }
    });
}

// APPROVE - Approve an item
export function useApproveItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reviewer_id }: { id: string; reviewer_id: string }) => {
            const { data, error } = await supabase
                .from('approvals')
                .update({
                    status: 'approved' as const,
                    reviewer_id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
        }
    });
}

// REJECT - Reject an item
export function useRejectItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reviewer_id, feedback }: { id: string; reviewer_id: string; feedback: string }) => {
            const { data, error } = await supabase
                .from('approvals')
                .update({
                    status: 'rejected' as const,
                    reviewer_id,
                    feedback,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
        }
    });
}

// REQUEST REVISION - Request changes
export function useRequestRevision() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reviewer_id, feedback }: { id: string; reviewer_id: string; feedback: string }) => {
            const { data, error } = await supabase
                .from('approvals')
                .update({
                    status: 'revision' as const,
                    reviewer_id,
                    feedback,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
        }
    });
}
