/**
 * EditCampaignDialog
 * 
 * Dialog para editar campanha existente
 * Epic 0: US 0.8 - Dialogs CRUD P1
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useUpdateCampaign, useDeleteCampaign } from '@/hooks/useCampaigns';
import type { Database } from '@/integrations/supabase/types';
import { Trash2 } from 'lucide-react';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    platform: z.enum(['meta', 'google', 'tiktok', 'other']),
    status: z.enum(['draft', 'active', 'paused', 'completed']),
    budget: z.number().min(0),
    spent: z.number().min(0),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    external_id: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface EditCampaignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaign: Campaign | null;
}

export function EditCampaignDialog({ open, onOpenChange, campaign }: EditCampaignDialogProps) {
    const { toast } = useToast();
    const updateCampaign = useUpdateCampaign();
    const deleteCampaign = useDeleteCampaign();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            platform: 'meta',
            status: 'draft',
            budget: 0,
            spent: 0,
            start_date: '',
            end_date: '',
            external_id: '',
        },
    });

    useEffect(() => {
        if (campaign) {
            form.reset({
                name: campaign.name,
                platform: campaign.platform,
                status: campaign.status || 'draft',
                budget: campaign.budget || 0,
                spent: campaign.spent || 0,
                start_date: campaign.start_date?.split('T')[0] || '',
                end_date: campaign.end_date?.split('T')[0] || '',
                external_id: campaign.external_id || '',
            });
        }
    }, [campaign, form]);

    const onSubmit = async (data: FormData) => {
        if (!campaign) return;

        try {
            await updateCampaign.mutateAsync({
                id: campaign.id,
                name: data.name,
                platform: data.platform,
                status: data.status,
                budget: data.budget,
                spent: data.spent,
                start_date: data.start_date || null,
                end_date: data.end_date || null,
                external_id: data.external_id || null,
            });

            toast({
                title: 'Campanha atualizada!',
                description: `"${data.name}" foi salva com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar campanha',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!campaign) return;

        try {
            await deleteCampaign.mutateAsync(campaign.id);

            toast({
                title: 'Campanha excluída',
                description: 'A campanha foi removida.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const platformLabels: Record<string, string> = {
        meta: '📘 Meta (Facebook/Instagram)',
        google: '🔍 Google Ads',
        tiktok: '🎵 TikTok Ads',
        other: '📌 Outra Plataforma',
    };

    const statusLabels: Record<string, { label: string; color: string }> = {
        draft: { label: 'Rascunho', color: 'bg-gray-500' },
        active: { label: 'Ativa', color: 'bg-green-500' },
        paused: { label: 'Pausada', color: 'bg-yellow-500' },
        completed: { label: 'Finalizada', color: 'bg-blue-500' },
    };

    // Calculate budget usage
    const budgetUsage = campaign?.budget && campaign.budget > 0
        ? Math.round((campaign.spent || 0) / campaign.budget * 100)
        : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>Editar Campanha</DialogTitle>
                        {campaign?.status && (
                            <Badge className={statusLabels[campaign.status]?.color}>
                                {statusLabels[campaign.status]?.label}
                            </Badge>
                        )}
                    </div>
                    <DialogDescription>
                        Atualize as informações da campanha.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Campanha *</Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="platform">Plataforma</Label>
                            <Select
                                value={form.watch('platform')}
                                onValueChange={(value) => form.setValue('platform', value as FormData['platform'])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(platformLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.watch('status')}
                                onValueChange={(value) => form.setValue('status', value as FormData['status'])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusLabels).map(([value, { label }]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget (R$)</Label>
                            <Input
                                id="budget"
                                type="number"
                                min={0}
                                step={0.01}
                                {...form.register('budget', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="spent">Gasto (R$)</Label>
                            <Input
                                id="spent"
                                type="number"
                                min={0}
                                step={0.01}
                                {...form.register('spent', { valueAsNumber: true })}
                            />
                            {budgetUsage > 0 && (
                                <p className={`text-xs ${budgetUsage > 100 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                    {budgetUsage}% do budget utilizado
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Data Início</Label>
                            <Input
                                id="start_date"
                                type="date"
                                {...form.register('start_date')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">Data Fim</Label>
                            <Input
                                id="end_date"
                                type="date"
                                {...form.register('end_date')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="external_id">ID Externo</Label>
                        <Input
                            id="external_id"
                            {...form.register('external_id')}
                        />
                    </div>

                    <DialogFooter className="flex justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir campanha?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Todos os criativos vinculados perderão a associação.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Excluir
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={updateCampaign.isPending}>
                                {updateCampaign.isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
