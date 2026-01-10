/**
 * useUsers Hook
 * 
 * CRUD operations for users_profile table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users_profile']['Row'];
type UserProfileInsert = Database['public']['Tables']['users_profile']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['users_profile']['Update'];

interface UserFilters {
    agency_id?: string;
    role?: Database['public']['Enums']['user_role'];
    is_active?: boolean;
}

// GET CURRENT USER PROFILE
export function useCurrentUser() {
    return useQuery({
        queryKey: ['users', 'current'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return data;
        }
    });
}

// LIST - Fetch all users with optional filters
export function useUsers(filters?: UserFilters) {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: async () => {
            let query = supabase.from('users_profile').select('*');

            if (filters?.agency_id) {
                query = query.eq('agency_id', filters.agency_id);
            }
            if (filters?.role) {
                query = query.eq('role', filters.role);
            }
            if (filters?.is_active !== undefined) {
                query = query.eq('is_active', filters.is_active);
            }

            const { data, error } = await query.order('full_name', { ascending: true });

            if (error) throw error;
            return data;
        }
    });
}

// GET ACTIVE TEAM MEMBERS - For assignment dropdowns
export function useTeamMembers(agencyId?: string) {
    return useUsers({ agency_id: agencyId, is_active: true });
}

// GET BY ID - Fetch single user
export function useUser(id: string) {
    return useQuery({
        queryKey: ['users', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new user profile
// Can be used after Supabase Auth signup (with id) or to invite users (without id - generates uuid)
export function useCreateUserProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: Omit<UserProfileInsert, 'id'> & { id?: string }) => {
            const profileWithId = {
                ...profile,
                id: profile.id || crypto.randomUUID(),
            };

            const { data, error } = await supabase
                .from('users_profile')
                .insert(profileWithId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

// UPDATE - Update user profile
export function useUpdateUserProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UserProfileUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('users_profile')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', 'current'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['users', data.id] });
            }
        }
    });
}

// UPDATE ROLE - Change user role
export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, role }: { id: string; role: Database['public']['Enums']['user_role'] }) => {
            const { data, error } = await supabase
                .from('users_profile')
                .update({ role })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

// DEACTIVATE - Deactivate user (soft delete)
export function useDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('users_profile')
                .update({ is_active: false })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

// REACTIVATE - Reactivate user
export function useReactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('users_profile')
                .update({ is_active: true })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

// UPDATE AVATAR - Upload and update user avatar
export function useUpdateAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, file }: { id: string; file: File }) => {
            // Upload to storage
            const fileExt = file.name.split('.').pop();
            const fileName = `avatars/${id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('public')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('public')
                .getPublicUrl(fileName);

            // Update user profile
            const { data, error } = await supabase
                .from('users_profile')
                .update({ avatar_url: publicUrl })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', 'current'] });
        }
    });
}

// TOGGLE ACTIVE - Toggle user active status
export function useToggleUserActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
            const { data, error } = await supabase
                .from('users_profile')
                .update({ is_active: isActive })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

// DELETE - Delete user profile
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('users_profile')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}

// ============================================================================
// ALIASES - For dialog compatibility
// ============================================================================
export const useCreateUser = useCreateUserProfile;
export const useUpdateUser = useUpdateUserProfile;

