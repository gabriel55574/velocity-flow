/**
 * useNotes Hook
 *
 * CRUD operations for client_notes table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type ClientNote = Database['public']['Tables']['client_notes']['Row'] & {
    user?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
    };
};

type ClientNoteInsert = Database['public']['Tables']['client_notes']['Insert'];
type ClientNoteUpdate = Database['public']['Tables']['client_notes']['Update'] & { id: string };

interface NoteFilters {
    client_id?: string;
    type?: Database['public']['Enums']['note_type'];
}

// LIST - Fetch notes with optional filters
export function useNotes(filters?: NoteFilters) {
    return useQuery({
        queryKey: ['client_notes', filters],
        queryFn: async () => {
            let query = supabase.from('client_notes').select(`
                *,
                user:user_id (
                    id,
                    full_name,
                    avatar_url
                )
            `);

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.type) {
                query = query.eq('type', filters.type);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data as ClientNote[];
        }
    });
}

// CREATE
export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (note: ClientNoteInsert) => {
            const { data, error } = await supabase
                .from('client_notes')
                .insert(note)
                .select(`
                    *,
                    user:user_id (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;
            return data as ClientNote;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['client_notes', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE
export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: ClientNoteUpdate) => {
            const { data, error } = await supabase
                .from('client_notes')
                .update(updates)
                .eq('id', id)
                .select(`
                    *,
                    user:user_id (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;
            return data as ClientNote;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['client_notes', data.id] });
            }
        }
    });
}

// DELETE
export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('client_notes')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
        }
    });
}
