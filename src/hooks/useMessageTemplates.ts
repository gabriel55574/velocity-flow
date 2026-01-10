/**
 * useMessageTemplates Hook
 * 
 * CRUD operations for message_templates table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type MessageTemplate = Database['public']['Tables']['message_templates']['Row'];
type MessageTemplateInsert = Database['public']['Tables']['message_templates']['Insert'];
type MessageTemplateUpdate = Database['public']['Tables']['message_templates']['Update'];

interface TemplateFilters {
    client_id?: string;
    channel?: Database['public']['Enums']['channel_type'];
    is_active?: boolean;
}

// LIST - Fetch all templates with optional filters
export function useMessageTemplates(filters?: TemplateFilters) {
    return useQuery({
        queryKey: ['message_templates', filters],
        queryFn: async () => {
            let query = supabase.from('message_templates').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.channel) {
                query = query.eq('channel', filters.channel);
            }
            if (filters?.is_active !== undefined) {
                query = query.eq('is_active', filters.is_active);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch single template
export function useMessageTemplate(id: string) {
    return useQuery({
        queryKey: ['message_templates', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('message_templates')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new template
export function useCreateMessageTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (template: MessageTemplateInsert) => {
            const { data, error } = await supabase
                .from('message_templates')
                .insert(template)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['message_templates'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['message_templates', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update existing template
export function useUpdateMessageTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: MessageTemplateUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('message_templates')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['message_templates'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['message_templates', data.id] });
            }
        }
    });
}

// DELETE - Delete template
export function useDeleteMessageTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('message_templates')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['message_templates'] });
        }
    });
}

// TOGGLE ACTIVE - Toggle template active status
export function useToggleTemplateActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
            const { data, error } = await supabase
                .from('message_templates')
                .update({ is_active })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['message_templates'] });
        }
    });
}
