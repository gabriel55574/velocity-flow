/**
 * useNotes Hook
 * 
 * Stub for notes functionality - client_notes table doesn't exist yet
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Stub types since client_notes table doesn't exist in schema
interface ClientNote {
    id: string;
    client_id: string;
    user_id: string;
    type: 'note' | 'decision' | 'ata';
    content: string;
    created_at: string;
    user?: {
        id: string;
        full_name: string;
        avatar_url: string | null;
    };
}

interface NoteFilters {
    client_id?: string;
    type?: 'note' | 'decision' | 'ata';
}

interface ClientNoteInsert {
    client_id: string;
    user_id: string;
    type: 'note' | 'decision' | 'ata';
    content: string;
}

// LIST - Stub that returns empty array (table doesn't exist)
export function useNotes(filters?: NoteFilters) {
    return useQuery({
        queryKey: ['client_notes', filters],
        queryFn: async (): Promise<ClientNote[]> => {
            // Table doesn't exist yet - return empty array
            console.warn('client_notes table not implemented yet');
            return [];
        },
        enabled: !!filters?.client_id
    });
}

// CREATE - Stub mutation
export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (note: ClientNoteInsert): Promise<ClientNote> => {
            console.warn('client_notes table not implemented yet');
            throw new Error('Notes feature not yet implemented');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
        }
    });
}

// UPDATE - Stub mutation
export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<ClientNote> & { id: string }): Promise<ClientNote> => {
            console.warn('client_notes table not implemented yet');
            throw new Error('Notes feature not yet implemented');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
        }
    });
}

// DELETE - Stub mutation
export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            console.warn('client_notes table not implemented yet');
            throw new Error('Notes feature not yet implemented');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client_notes'] });
        }
    });
}