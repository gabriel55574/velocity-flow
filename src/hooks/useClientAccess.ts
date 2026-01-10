/**
 * useClientAccess Hook
 * 
 * CRUD operations for clients_users table (Client Portal Access)
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type ClientUser = Database['public']['Tables']['clients_users']['Row'];
type ClientUserInsert = Database['public']['Tables']['clients_users']['Insert'];
type ClientUserUpdate = Database['public']['Tables']['clients_users']['Update'];

// LIST - Fetch all users with access to a client
export function useClientUsers(clientId: string) {
    return useQuery({
        queryKey: ['clients_users', { client_id: clientId }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('clients_users')
                .select(`
          *,
          user:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
                .eq('client_id', clientId);

            if (error) throw error;
            return data;
        },
        enabled: !!clientId
    });
}

// LIST - Fetch all clients a user has access to
export function useUserClients(userId: string) {
    return useQuery({
        queryKey: ['clients_users', { user_id: userId }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('clients_users')
                .select(`
          *,
          client:client_id (
            id,
            name,
            slug,
            logo_url,
            status
          )
        `)
                .eq('user_id', userId);

            if (error) throw error;
            return data;
        },
        enabled: !!userId
    });
}

// CHECK ACCESS - Check if user has access to a client
export function useCheckClientAccess(clientId: string, userId: string) {
    return useQuery({
        queryKey: ['clients_users', 'check', clientId, userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('clients_users')
                .select('*')
                .eq('client_id', clientId)
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            return data || null;
        },
        enabled: !!clientId && !!userId
    });
}

// GRANT ACCESS - Give user access to client
export function useGrantClientAccess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (access: ClientUserInsert) => {
            const { data, error } = await supabase
                .from('clients_users')
                .insert(access)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['clients_users'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['clients_users', { client_id: data.client_id }] });
            }
            if (data?.user_id) {
                queryClient.invalidateQueries({ queryKey: ['clients_users', { user_id: data.user_id }] });
            }
        }
    });
}

// UPDATE ROLE - Change user's role for a client
export function useUpdateClientAccessRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            role
        }: {
            id: string;
            role: Database['public']['Enums']['client_user_role'];
        }) => {
            const { data, error } = await supabase
                .from('clients_users')
                .update({ role })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients_users'] });
        }
    });
}

// REVOKE ACCESS - Remove user's access to client
export function useRevokeClientAccess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('clients_users')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients_users'] });
        }
    });
}

// REVOKE BY USER AND CLIENT - Remove access by user_id and client_id
export function useRevokeAccessByUserClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ client_id, user_id }: { client_id: string; user_id: string }) => {
            const { error } = await supabase
                .from('clients_users')
                .delete()
                .eq('client_id', client_id)
                .eq('user_id', user_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients_users'] });
        }
    });
}

// BULK GRANT - Give multiple users access to a client
export function useBulkGrantAccess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (accesses: ClientUserInsert[]) => {
            const { data, error } = await supabase
                .from('clients_users')
                .insert(accesses)
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients_users'] });
        }
    });
}
