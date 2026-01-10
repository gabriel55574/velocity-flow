/**
 * CreateLeadDialog
 * 
 * Dialog para criar novo lead (CRM)
 * Epic 0: US 0.2 - Dialogs CRUD
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateLead } from '@/hooks/useLeads';
import { useTeamMembers } from '@/hooks/useUsers';

const schema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    phone: z.string().optional(),
    stage: z.enum(['cold', 'warm', 'hot', 'qualified', 'proposal', 'closed']).default('cold'),
    source: z.string().optional(),
    score: z.number().min(0).max(100).default(0),
    notes: z.string().optional(),
    assigned_to: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    agencyId?: string;
    defaultStage?: FormData['stage'];
}

export function CreateLeadDialog({
    open,
    onOpenChange,
    clientId,
    agencyId,
    defaultStage = 'cold'
}: CreateLeadDialogProps) {
    const { toast } = useToast();
    const createLead = useCreateLead();
    const { data: teamMembers } = useTeamMembers(agencyId);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            stage: defaultStage,
            source: '',
            score: 0,
            notes: '',
            assigned_to: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createLead.mutateAsync({
                ...data,
                client_id: clientId,
                email: data.email || null,
                phone: data.phone || null,
                source: data.source || null,
                notes: data.notes || null,
                assigned_to: data.assigned_to || null,
            });

            toast({
                title: 'Lead criado!',
                description: `${data.name} foi adicionado ao pipeline.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar lead',
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
                    <DialogTitle>Novo Lead</DialogTitle>
                    <DialogDescription>
                        Adicione um novo lead ao funil de vendas.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            placeholder="Nome do contato"
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
                                placeholder="email@exemplo.com"
                                {...form.register('email')}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                placeholder="(11) 99999-9999"
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
                                placeholder="Ex: Instagram, Indicação..."
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
                            placeholder="Informações adicionais sobre o lead..."
                            rows={2}
                            {...form.register('notes')}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createLead.isPending}>
                            {createLead.isPending ? 'Criando...' : 'Criar Lead'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
