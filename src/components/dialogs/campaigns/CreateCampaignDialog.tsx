/**
 * CreateCampaignDialog
 * 
 * Dialog para criar nova campanha
 * Epic 0: US 0.8 - Dialogs CRUD P1
 */

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateCampaign } from '@/hooks/useCampaigns';

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    platform: z.enum(['meta', 'google', 'tiktok', 'other']),
    status: z.enum(['draft', 'active', 'paused', 'completed']).default('draft'),
    budget: z.number().min(0).optional(),
    spent: z.number().min(0).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    external_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateCampaignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
}

export function CreateCampaignDialog({
    open,
    onOpenChange,
    clientId
}: CreateCampaignDialogProps) {
    const { toast } = useToast();
    const createCampaign = useCreateCampaign();

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

    const onSubmit = async (data: FormData) => {
        try {
            await createCampaign.mutateAsync({
                name: data.name,
                platform: data.platform,
                status: data.status,
                budget: data.budget || 0,
                spent: data.spent || 0,
                start_date: data.start_date || null,
                end_date: data.end_date || null,
                external_id: data.external_id || null,
                client_id: clientId,
            });

            toast({
                title: 'Campanha criada!',
                description: `"${data.name}" foi adicionada com sucesso.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar campanha',
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

    const statusLabels: Record<string, string> = {
        draft: '📝 Rascunho',
        active: '🟢 Ativa',
        paused: '⏸️ Pausada',
        completed: '✅ Finalizada',
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nova Campanha</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova campanha de mídia paga.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Campanha *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Black Friday 2026 - Conversão"
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
                                    {Object.entries(statusLabels).map(([value, label]) => (
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
                                placeholder="0,00"
                                {...form.register('budget', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="external_id">ID Externo</Label>
                            <Input
                                id="external_id"
                                placeholder="ID da plataforma"
                                {...form.register('external_id')}
                            />
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createCampaign.isPending}>
                            {createCampaign.isPending ? 'Criando...' : 'Criar Campanha'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
