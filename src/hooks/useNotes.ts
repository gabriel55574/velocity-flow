/**
 * useNotes Hook
 * 
 * CRUD operations for client_notes table (Notes Tab)
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ClientNote = Database['public']['Tables']['client_notes']['Row'];
type ClientNoteInsert = Database['public']['Tables']['client_notes']['Insert'];
type ClientNoteUpdate = Database['public']['Tables']['client_notes']['Update'];

interface NoteFilters {
    client_id?: string;
    type?: Database['public']['Enums']['note_type'];
}

// LIST - Fetch all notes with optional filters
export function useNotes(filters?: NoteFilters) {
    return useQuery({
        queryKey: ['client_notes', filters],
        queryFn: async () => {
            let query = supabase
                .from('client_notes')
                .select(`
                    *,
                    user:users_profile (
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
            return data;
        },
        enabled: !!filters?.client_id
    });
}

// CREATE - Create new note
export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (note: ClientNoteInsert) => {
            const { data, error } = await supabase
                .from('client_notes')
                .insert(note)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['client_notes', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update note
export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: ClientNoteUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('client_notes')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['client_notes', data.id] });
            }
        }
    });
}

// DELETE - Delete note
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
