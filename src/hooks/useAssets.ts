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
type AssetType = Database['public']['Enums']['asset_type'];
type AssetVisibility = 'public' | 'private';

interface AssetFilters {
    client_id?: string;
    type?: Database['public']['Enums']['asset_type'];
    status?: Database['public']['Enums']['asset_status'];
}

const resolveAssetBucket = (visibility?: AssetVisibility) =>
    visibility === 'private' ? 'assets-private' : 'assets-public';

const buildAssetPath = (agencyId: string, clientId: string, type: AssetType, filename: string) => {
    const safeName = filename.replace(/[^\w.-]+/g, '-');
    return `${agencyId}/${clientId}/${type}/${Date.now()}-${safeName}`;
};

const extractStoragePath = (url?: string | null) => {
    if (!url) return null;
    const publicMatch = url.match(/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (publicMatch) {
        return { bucket: publicMatch[1], path: publicMatch[2] };
    }
    const signedMatch = url.match(/storage\/v1\/object\/sign\/([^/]+)\/([^?]+)/);
    if (signedMatch) {
        return { bucket: signedMatch[1], path: signedMatch[2] };
    }
    return null;
};

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
                .select('url, metadata')
                .eq('id', id)
                .single();

            const meta = asset?.metadata as { bucket?: string; path?: string } | null;
            const storageRef = meta?.bucket && meta?.path ? { bucket: meta.bucket, path: meta.path } : extractStoragePath(asset?.url);
            if (storageRef?.bucket && storageRef?.path) {
                await supabase.storage.from(storageRef.bucket).remove([storageRef.path]);
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
            agency_id,
            name,
            type,
            created_by,
            visibility = 'public',
        }: {
            file: File;
            client_id: string;
            agency_id: string;
            name: string;
            type: AssetType;
            created_by: string;
            visibility?: AssetVisibility;
        }) => {
            const bucket = resolveAssetBucket(visibility);
            const fileName = buildAssetPath(agency_id, client_id, type, file.name);

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type || undefined,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
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
                        bucket,
                        path: fileName,
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

// UPLOAD FILE FOR EXISTING ASSET
export function useUploadAssetFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            asset_id,
            file,
            client_id,
            agency_id,
            type,
            visibility = 'public',
            uploaded_by,
        }: {
            asset_id: string;
            file: File;
            client_id: string;
            agency_id: string;
            type: AssetType;
            visibility?: AssetVisibility;
            uploaded_by: string;
        }) => {
            const { data: existingAsset, error: existingError } = await supabase
                .from('assets')
                .select('status, url, metadata')
                .eq('id', asset_id)
                .single();

            if (existingError) throw existingError;
            if (existingAsset?.status === 'validated') {
                throw new Error('Asset validado não pode ser alterado.');
            }

            const existingMeta = existingAsset?.metadata as { bucket?: string; path?: string } | null;
            const existingRef =
                existingMeta?.bucket && existingMeta?.path
                    ? { bucket: existingMeta.bucket, path: existingMeta.path }
                    : extractStoragePath(existingAsset?.url);

            const bucket = resolveAssetBucket(visibility);
            const fileName = buildAssetPath(agency_id, client_id, type, file.name);

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type || undefined,
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            const { data, error } = await supabase
                .from('assets')
                .update({
                    url: publicUrl,
                    status: 'uploaded',
                    metadata: {
                        bucket,
                        path: fileName,
                        originalName: file.name,
                        size: file.size,
                        mimeType: file.type,
                        uploadedBy: uploaded_by,
                    },
                })
                .eq('id', asset_id)
                .select()
                .single();

            if (error) throw error;

            if (
                existingRef?.bucket &&
                existingRef?.path &&
                (existingRef.bucket !== bucket || existingRef.path !== fileName)
            ) {
                const { error: removeError } = await supabase.storage
                    .from(existingRef.bucket)
                    .remove([existingRef.path]);
                if (removeError) {
                    console.warn('Falha ao remover arquivo anterior do asset.', removeError);
                }
            }
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
