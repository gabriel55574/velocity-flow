/**
 * useAuditLogs Hook
 * 
 * READ-ONLY operations for audit_logs table
 * Epic 0: US 0.1 - Hooks Supabase por Entidade
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

interface AuditLogFilters {
    agency_id?: string;
    user_id?: string;
    entity_type?: string;
    entity_id?: string;
    action?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
}

// LIST - Fetch audit logs with optional filters
export function useAuditLogs(filters?: AuditLogFilters) {
    return useQuery({
        queryKey: ['audit_logs', filters],
        queryFn: async () => {
            let query = supabase
                .from('audit_logs')
                .select(`
          *,
          user:users_profile (
            id,
            full_name,
            email
          )
        `);

            if (filters?.agency_id) {
                query = query.eq('agency_id', filters.agency_id);
            }
            if (filters?.user_id) {
                query = query.eq('user_id', filters.user_id);
            }
            if (filters?.entity_type) {
                query = query.eq('entity_type', filters.entity_type);
            }
            if (filters?.entity_id) {
                query = query.eq('entity_id', filters.entity_id);
            }
            if (filters?.action) {
                query = query.eq('action', filters.action);
            }
            if (filters?.from_date) {
                query = query.gte('created_at', filters.from_date);
            }
            if (filters?.to_date) {
                query = query.lte('created_at', filters.to_date);
            }

            const limit = filters?.limit || 100;
            const { data, error } = await query
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        }
    });
}

// GET RECENT ACTIVITY - For dashboard
export function useRecentActivity(agencyId: string, limit: number = 20) {
    return useAuditLogs({ agency_id: agencyId, limit });
}

// GET ENTITY HISTORY - Get all changes to a specific entity
export function useEntityHistory(entityType: string, entityId: string) {
    return useQuery({
        queryKey: ['audit_logs', 'entity', entityType, entityId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('audit_logs')
                .select(`
          *,
          user:users_profile (
            id,
            full_name,
            email
          )
        `)
                .eq('entity_type', entityType)
                .eq('entity_id', entityId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!entityType && !!entityId
    });
}

// GET USER ACTIVITY - Get all actions by a specific user
export function useUserActivity(userId: string, limit: number = 50) {
    return useQuery({
        queryKey: ['audit_logs', 'user', userId, limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('audit_logs')
                .select(`
          *,
          user:users_profile (
            id,
            full_name,
            email
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        },
        enabled: !!userId
    });
}

// GET BY ID - Fetch single audit log entry
export function useAuditLog(id: string) {
    return useQuery({
        queryKey: ['audit_logs', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('audit_logs')
                .select(`
          *,
          user:users_profile (
            id,
            full_name,
            email
          )
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}

// STATS - Get activity stats for a time period
export function useActivityStats(agencyId: string, days: number = 7) {
    return useQuery({
        queryKey: ['audit_logs', 'stats', agencyId, days],
        queryFn: async () => {
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - days);

            const { data, error } = await supabase
                .from('audit_logs')
                .select('action, entity_type, created_at')
                .eq('agency_id', agencyId)
                .gte('created_at', fromDate.toISOString());

            if (error) throw error;

            // Calculate stats
            const stats = {
                total: data.length,
                byAction: {} as Record<string, number>,
                byEntityType: {} as Record<string, number>,
                byDay: {} as Record<string, number>
            };

            data.forEach((log) => {
                // By action
                stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

                // By entity type
                stats.byEntityType[log.entity_type] = (stats.byEntityType[log.entity_type] || 0) + 1;

                // By day
                if (log.created_at) {
                    const day = log.created_at.split('T')[0];
                    stats.byDay[day] = (stats.byDay[day] || 0) + 1;
                }
            });

            return stats;
        },
        enabled: !!agencyId
    });
}
