/**
 * useNotes Hook
 * 
 * Stub for notes functionality - client_notes table doesn't exist yet
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

// Stub types since client_notes table doesn't exist in schema
export interface ClientNote {
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

export interface ClientNoteInsert {
    client_id: string;
    user_id: string;
    type: 'note' | 'decision' | 'ata';
    content: string;
}

// LIST - Stub that returns empty array (table doesn't exist)
export function useNotes(_filters?: NoteFilters) {
    // Table doesn't exist yet - return static stub data
    return {
        data: [] as ClientNote[],
        isLoading: false,
        error: null,
    };
}

// CREATE - Stub mutation
export function useCreateNote() {
    return {
        mutateAsync: async (_note: ClientNoteInsert): Promise<ClientNote> => {
            console.warn('client_notes table not implemented yet');
            throw new Error('Notes feature not yet implemented');
        },
        isPending: false,
    };
}

// UPDATE - Stub mutation
export function useUpdateNote() {
    return {
        mutateAsync: async (_params: Partial<ClientNote> & { id: string }): Promise<ClientNote> => {
            console.warn('client_notes table not implemented yet');
            throw new Error('Notes feature not yet implemented');
        },
        isPending: false,
    };
}

// DELETE - Stub mutation
export function useDeleteNote() {
    return {
        mutateAsync: async (_id: string): Promise<void> => {
            console.warn('client_notes table not implemented yet');
            throw new Error('Notes feature not yet implemented');
        },
        isPending: false,
    };
}