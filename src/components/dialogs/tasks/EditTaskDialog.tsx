/**
 * EditTaskDialog
 * 
 * Dialog para editar tarefa existente
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
import { useToast } from '@/hooks/use-toast';
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useUsers';
import type { Database } from '@/types/database';
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
import { Trash2 } from 'lucide-react';

type Task = Database['public']['Tables']['tasks']['Row'];

const schema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional().nullable(),
    status: z.enum(['backlog', 'todo', 'doing', 'review', 'done', 'blocked']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    due_date: z.string().optional().nullable(),
    assignee_id: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface EditTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    agencyId?: string;
}

export function EditTaskDialog({ open, onOpenChange, task, agencyId }: EditTaskDialogProps) {
    const { toast } = useToast();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const { data: teamMembers } = useTeamMembers(agencyId);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            due_date: '',
            assignee_id: '',
        },
    });

    useEffect(() => {
        if (task) {
            form.reset({
                title: task.title,
                description: task.description || '',
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                due_date: task.due_date?.split('T')[0] || '',
                assignee_id: task.assignee_id || '',
            });
        }
    }, [task, form]);

    const onSubmit = async (data: FormData) => {
        if (!task) return;

        try {
            await updateTask.mutateAsync({
                id: task.id,
                ...data,
                due_date: data.due_date || null,
                assignee_id: data.assignee_id || null,
            });

            toast({
                title: 'Tarefa atualizada!',
                description: `"${data.title}" foi atualizada com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar tarefa',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!task) return;

        try {
            await deleteTask.mutateAsync(task.id);

            toast({
                title: 'Tarefa excluída',
                description: 'A tarefa foi removida com sucesso.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao excluir tarefa',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                    <DialogDescription>
                        Atualize as informações da tarefa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
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

                    <DialogFooter className="flex justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. A tarefa será permanentemente removida.
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
                            <Button type="submit" disabled={updateTask.isPending}>
                                {updateTask.isPending ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
