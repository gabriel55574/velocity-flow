import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/alert-dialog';
import { useUpdateExperiment, useDeleteExperiment } from '@/hooks/useExperiments';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Database } from '@/types/database';

type Experiment = Database['public']['Tables']['experiments']['Row'];

const formSchema = z.object({
    name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
    hypothesis: z.string().min(10, { message: 'Descreva a hipótese do experimento' }),
    notes: z.string().optional(),
    status: z.enum(['planned', 'running', 'completed', 'cancelled']),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});

interface EditExperimentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    experiment: Experiment;
}

export function EditExperimentDialog({
    open,
    onOpenChange,
    experiment,
}: EditExperimentDialogProps) {
    const { toast } = useToast();
    const updateExperiment = useUpdateExperiment();
    const deleteExperiment = useDeleteExperiment();
    const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: experiment.name,
            hypothesis: experiment.hypothesis || '',
            notes: experiment.notes || '',
            status: experiment.status as 'planned' | 'running' | 'completed' | 'cancelled',
            start_date: experiment.start_date || '',
            end_date: experiment.end_date || '',
        },
    });

    React.useEffect(() => {
        if (open && experiment) {
            form.reset({
                name: experiment.name,
                hypothesis: experiment.hypothesis || '',
                notes: experiment.notes || '',
                status: experiment.status as 'planned' | 'running' | 'completed' | 'cancelled',
                start_date: experiment.start_date || '',
                end_date: experiment.end_date || '',
            });
        }
    }, [open, experiment, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateExperiment.mutateAsync({
                id: experiment.id,
                name: values.name,
                hypothesis: values.hypothesis,
                notes: values.notes,
                status: values.status,
                start_date: values.start_date || null,
                end_date: values.end_date || null,
            });

            toast({
                title: 'Experimento atualizado!',
                description: 'As alterações foram salvas com sucesso.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar experimento',
                description: 'Ocorreu um erro ao salvar as alterações.',
            });
        }
    }

    async function handleDelete() {
        try {
            await deleteExperiment.mutateAsync(experiment.id);
            toast({
                title: 'Experimento excluído',
                description: 'O registro do experimento foi removido.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir experimento',
                description: 'Ocorreu um erro ao tentar excluir o experimento.',
            });
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Experimento</DialogTitle>
                        <DialogDescription>
                            Acompanhe o progresso e registre os resultados do teste.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Experimento</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="planned">Planejado</SelectItem>
                                                <SelectItem value="running">Em Execução</SelectItem>
                                                <SelectItem value="completed">Concluído</SelectItem>
                                                <SelectItem value="cancelled">Cancelado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hypothesis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hipótese</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Início</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Fim</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resultados / Notas</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Registre o que foi aprendido com este teste..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="flex justify-between items-center sm:justify-between">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => setShowDeleteAlert(true)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={updateExperiment.isPending}>
                                        {updateExperiment.isPending ? 'Salvando...' : 'Salvar Alterações'}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro
                            deste experimento.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
