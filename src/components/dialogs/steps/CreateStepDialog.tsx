/**
 * CreateStepDialog
 * 
 * Dialog para criar novo step em um módulo
 * Epic 0: Dialogs CRUD P1
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
import { useCreateStep } from '@/hooks/useWorkflows';
import { useTeamMembers } from '@/hooks/useUsers';

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    order_index: z.number().int().min(0),
    assignee_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
const UNASSIGNED_VALUE = "unassigned";

interface CreateStepDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    moduleId: string;
    nextOrder: number;
    agencyId?: string;
}

export function CreateStepDialog({
    open,
    onOpenChange,
    moduleId,
    nextOrder,
    agencyId
}: CreateStepDialogProps) {
    const { toast } = useToast();
    const createStep = useCreateStep();
    const { data: teamMembers } = useTeamMembers(agencyId);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            order_index: nextOrder,
            assignee_id: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createStep.mutateAsync({
                name: data.name,
                module_id: moduleId,
                order_index: data.order_index,
                assignee_id: data.assignee_id || null,
                description: data.description || null,
                status: 'todo',
            });

            toast({
                title: 'Step criado!',
                description: `"${data.name}" foi adicionado ao módulo.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar step',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Novo Step</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova etapa ao módulo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Step *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Reunião de Briefing"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            placeholder="O que precisa ser feito neste step..."
                            rows={2}
                            {...form.register('description')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="order_index">Ordem</Label>
                        <Input
                            id="order_index"
                            type="number"
                            min={0}
                            {...form.register('order_index', { valueAsNumber: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assignee_id">Responsável</Label>
                        <Select
                            value={form.watch('assignee_id') || UNASSIGNED_VALUE}
                            onValueChange={(value) => form.setValue('assignee_id', value === UNASSIGNED_VALUE ? '' : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={UNASSIGNED_VALUE}>Não atribuído</SelectItem>
                                {teamMembers?.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createStep.isPending}>
                            {createStep.isPending ? 'Criando...' : 'Criar Step'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
