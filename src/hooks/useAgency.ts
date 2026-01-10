/**
 * useAgency Hook
 * 
 * CRUD operations for agencies table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Agency = Database['public']['Tables']['agencies']['Row'];
type AgencyUpdate = Database['public']['Tables']['agencies']['Update'];

// GET CURRENT AGENCY - Fetch agency for current user
export function useCurrentAgency() {
    return useQuery({
        queryKey: ['agency', 'current'],
        queryFn: async () => {
            // Get current user's agency through users_profile
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data: profile } = await supabase
                .from('users_profile')
                .select('agency_id')
                .eq('id', user.id)
                .single();

            if (!profile?.agency_id) return null;

            const { data, error } = await supabase
                .from('agencies')
                .select('*')
                .eq('id', profile.agency_id)
                .single();

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch agency by ID
export function useAgency(id: string) {
    return useQuery({
        queryKey: ['agencies', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agencies')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// UPDATE - Update agency settings
export function useUpdateAgency() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: AgencyUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('agencies')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['agencies'] });
            queryClient.invalidateQueries({ queryKey: ['agency', 'current'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['agencies', data.id] });
            }
        }
    });
}

// UPDATE SETTINGS - Update agency settings JSON
export function useUpdateAgencySettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, settings }: { id: string; settings: Database['public']['Tables']['agencies']['Row']['settings'] }) => {
            const { data, error } = await supabase
                .from('agencies')
                .update({ settings })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies'] });
            queryClient.invalidateQueries({ queryKey: ['agency', 'current'] });
        }
    });
}

// UPDATE LOGO - Update agency logo
export function useUpdateAgencyLogo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, file }: { id: string; file: File }) => {
            // Upload to storage
            const fileExt = file.name.split('.').pop();
            const fileName = `agency-logos/${id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('public')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('public')
                .getPublicUrl(fileName);

            // Update agency record
            const { data, error } = await supabase
                .from('agencies')
                .update({ logo_url: publicUrl })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies'] });
            queryClient.invalidateQueries({ queryKey: ['agency', 'current'] });
        }
    });
}
