/**
 * CreateTaskDialog
 * 
 * Dialog para criar nova tarefa
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
import { useCreateTask } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useUsers';

const schema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    status: z.enum(['backlog', 'todo', 'doing', 'review', 'done', 'blocked']).default('todo'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    due_date: z.string().optional(),
    assignee_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    agencyId?: string;
    defaultStatus?: FormData['status'];
}

export function CreateTaskDialog({
    open,
    onOpenChange,
    clientId,
    agencyId,
    defaultStatus = 'todo'
}: CreateTaskDialogProps) {
    const { toast } = useToast();
    const createTask = useCreateTask();
    const { data: teamMembers } = useTeamMembers(agencyId);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            status: defaultStatus,
            priority: 'medium',
            due_date: '',
            assignee_id: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createTask.mutateAsync({
                ...data,
                client_id: clientId,
                due_date: data.due_date || null,
                assignee_id: data.assignee_id || null,
            });

            toast({
                title: 'Tarefa criada!',
                description: `"${data.title}" foi adicionada com sucesso.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar tarefa',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                    <DialogDescription>
                        Crie uma nova tarefa para este cliente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Criar landing page"
                            {...form.register('title')}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva a tarefa em detalhes..."
                            rows={3}
                            {...form.register('description')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    <SelectItem value="backlog">Backlog</SelectItem>
                                    <SelectItem value="todo">A Fazer</SelectItem>
                                    <SelectItem value="doing">Em Andamento</SelectItem>
                                    <SelectItem value="review">Revisão</SelectItem>
                                    <SelectItem value="done">Concluído</SelectItem>
                                    <SelectItem value="blocked">Bloqueado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridade</Label>
                            <Select
                                value={form.watch('priority')}
                                onValueChange={(value) => form.setValue('priority', value as FormData['priority'])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baixa</SelectItem>
                                    <SelectItem value="medium">Média</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                    <SelectItem value="urgent">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Data Limite</Label>
                            <Input
                                id="due_date"
                                type="date"
                                {...form.register('due_date')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignee_id">Responsável</Label>
                            <Select
                                value={form.watch('assignee_id') || ''}
                                onValueChange={(value) => form.setValue('assignee_id', value)}
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createTask.isPending}>
                            {createTask.isPending ? 'Criando...' : 'Criar Tarefa'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
