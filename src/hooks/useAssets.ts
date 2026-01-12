/**
 * useAssets Hook
 * 
 * CRUD operations for assets table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];
type AssetInsert = Database['public']['Tables']['assets']['Insert'];
type AssetUpdate = Database['public']['Tables']['assets']['Update'];

interface AssetFilters {
    client_id?: string;
    type?: Database['public']['Enums']['asset_type'];
    status?: Database['public']['Enums']['asset_status'];
}

// LIST - Fetch all assets with optional filters
export function useAssets(filters?: AssetFilters) {
    return useQuery({
        queryKey: ['assets', filters],
        queryFn: async () => {
            let query = supabase.from('assets').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.type) {
                query = query.eq('type', filters.type);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch single asset
export function useAsset(id: string) {
    return useQuery({
        queryKey: ['assets', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new asset (after file upload)
export function useCreateAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (asset: AssetInsert) => {
            const { data, error } = await supabase
                .from('assets')
                .insert(asset)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['assets', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update existing asset
export function useUpdateAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: AssetUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('assets')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['assets', data.id] });
            }
        }
    });
}

// DELETE - Delete asset (and file from storage if applicable)
export function useDeleteAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            // First get the asset to check if there's a file to delete
            const { data: asset } = await supabase
                .from('assets')
                .select('url')
                .eq('id', id)
                .single();

            // Delete from storage if URL exists and is from our storage
            if (asset?.url && asset.url.includes('supabase')) {
                const path = asset.url.split('/').pop();
                if (path) {
                    await supabase.storage.from('assets').remove([path]);
                }
            }

            // Delete the record
            const { error } = await supabase
                .from('assets')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        }
    });
}

// UPLOAD FILE - Upload file to storage and create asset record
export function useUploadAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            file,
            client_id,
            name,
            type,
            created_by
        }: {
            file: File;
            client_id: string;
            name: string;
            type: Database['public']['Enums']['asset_type'];
            created_by: string;
        }) => {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${client_id}/${Date.now()}.${fileExt}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(fileName);

            // Create asset record
            const { data, error } = await supabase
                .from('assets')
                .insert({
                    client_id,
                    name,
                    type,
                    url: publicUrl,
                    created_by,
                    status: 'uploaded',
                    metadata: {
                        originalName: file.name,
                        size: file.size,
                        mimeType: file.type
                    }
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
        }
    });
}
