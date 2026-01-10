/**
 * useTasks Hook
 * 
 * CRUD operations for tasks table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

interface TaskFilters {
    client_id?: string;
    status?: Database['public']['Enums']['task_status'];
    assignee_id?: string;
    priority?: Database['public']['Enums']['priority_level'];
}

// LIST - Fetch all tasks with optional filters
export function useTasks(filters?: TaskFilters) {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: async () => {
            let query = supabase.from('tasks').select('*');

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.assignee_id) {
                query = query.eq('assignee_id', filters.assignee_id);
            }
            if (filters?.priority) {
                query = query.eq('priority', filters.priority);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

// GET BY ID - Fetch single task
export function useTask(id: string) {
    return useQuery({
        queryKey: ['tasks', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// CREATE - Create new task
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (task: TaskInsert) => {
            const { data, error } = await supabase
                .from('tasks')
                .insert(task)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (data?.client_id) {
                queryClient.invalidateQueries({ queryKey: ['tasks', { client_id: data.client_id }] });
            }
        }
    });
}

// UPDATE - Update existing task
export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: TaskUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (data?.id) {
                queryClient.invalidateQueries({ queryKey: ['tasks', data.id] });
            }
        }
    });
}

// DELETE - Delete task
export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
}

// BULK UPDATE - Update task status (for Kanban drag & drop)
export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Database['public']['Enums']['task_status'] }) => {
            const { data, error } = await supabase
                .from('tasks')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
}
