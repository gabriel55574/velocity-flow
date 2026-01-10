/**
 * EditLeadDialog
 * 
 * Dialog para editar lead existente
 * Epic 0: US 0.2 - Dialogs CRUD
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
import { Textarea } from '@/components/ui/textarea';
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
import { useUpdateLead, useDeleteLead } from '@/hooks/useLeads';
import { useTeamMembers } from '@/hooks/useUsers';
import type { Database } from '@/types/database';
import { Trash2 } from 'lucide-react';

type Lead = Database['public']['Tables']['crm_leads']['Row'];

const schema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')).nullable(),
    phone: z.string().optional().nullable(),
    stage: z.enum(['cold', 'warm', 'hot', 'qualified', 'proposal', 'closed']),
    source: z.string().optional().nullable(),
    score: z.number().min(0).max(100),
    notes: z.string().optional().nullable(),
    assigned_to: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface EditLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead | null;
    agencyId?: string;
}

export function EditLeadDialog({ open, onOpenChange, lead, agencyId }: EditLeadDialogProps) {
    const { toast } = useToast();
    const updateLead = useUpdateLead();
    const deleteLead = useDeleteLead();
    const { data: teamMembers } = useTeamMembers(agencyId);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            stage: 'cold',
            source: '',
            score: 0,
            notes: '',
            assigned_to: '',
        },
    });

    useEffect(() => {
        if (lead) {
            form.reset({
                name: lead.name,
                email: lead.email || '',
                phone: lead.phone || '',
                stage: lead.stage || 'cold',
                source: lead.source || '',
                score: lead.score || 0,
                notes: lead.notes || '',
                assigned_to: lead.assigned_to || '',
            });
        }
    }, [lead, form]);

    const onSubmit = async (data: FormData) => {
        if (!lead) return;

        try {
            await updateLead.mutateAsync({
                id: lead.id,
                ...data,
                email: data.email || null,
                phone: data.phone || null,
                source: data.source || null,
                notes: data.notes || null,
                assigned_to: data.assigned_to || null,
            });

            toast({
                title: 'Lead atualizado!',
                description: `${data.name} foi atualizado com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar lead',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!lead) return;

        try {
            await deleteLead.mutateAsync(lead.id);

            toast({
                title: 'Lead excluído',
                description: 'O lead foi removido do pipeline.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao excluir lead',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const stageLabels: Record<string, string> = {
        cold: '❄️ Frio',
        warm: '🌤️ Morno',
        hot: '🔥 Quente',
        qualified: '✅ Qualificado',
        proposal: '📋 Proposta',
        closed: '🎉 Fechado',
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Lead</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do lead.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
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
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                {...form.register('email')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                {...form.register('phone')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stage">Estágio</Label>
                            <Select
                                value={form.watch('stage')}
                                onValueChange={(value) => form.setValue('stage', value as FormData['stage'])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(stageLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="source">Origem</Label>
                            <Input
                                id="source"
                                {...form.register('source')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="score">Score (0-100)</Label>
                            <Input
                                id="score"
                                type="number"
                                min={0}
                                max={100}
                                {...form.register('score', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assigned_to">Responsável</Label>
                            <Select
                                value={form.watch('assigned_to') || ''}
                                onValueChange={(value) => form.setValue('assigned_to', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Não atribuído</SelectItem>
                                    {teamMembers?.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                            {member.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                            id="notes"
                            rows={2}
                            {...form.register('notes')}
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
                                    <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. O lead será permanentemente removido.
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
                            <Button type="submit" disabled={updateLead.isPending}>
                                {updateLead.isPending ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
