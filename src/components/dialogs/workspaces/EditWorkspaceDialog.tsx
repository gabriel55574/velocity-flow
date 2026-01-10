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
import { useUpdateWorkspace, useDeleteWorkspace } from '@/hooks/useWorkspaces';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Database } from '@/types/database';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

const formSchema = z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
});

interface EditWorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspace: Workspace;
}

export function EditWorkspaceDialog({
    open,
    onOpenChange,
    workspace,
}: EditWorkspaceDialogProps) {
    const { toast } = useToast();
    const updateWorkspace = useUpdateWorkspace();
    const deleteWorkspace = useDeleteWorkspace();
    const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: workspace.name,
        },
    });

    React.useEffect(() => {
        if (open && workspace) {
            form.reset({
                name: workspace.name,
            });
        }
    }, [open, workspace, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateWorkspace.mutateAsync({
                id: workspace.id,
                name: values.name,
            });

            toast({
                title: 'Workspace atualizado!',
                description: 'As alterações foram salvas com sucesso.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar workspace',
                description: 'Ocorreu um erro ao salvar as alterações.',
            });
        }
    }

    async function handleDelete() {
        try {
            await deleteWorkspace.mutateAsync(workspace.id);
            toast({
                title: 'Workspace excluído',
                description: 'O ambiente foi removido com sucesso.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir workspace',
                description: 'Ocorreu um erro ao tentar excluir o ambiente.',
            });
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Workspace</DialogTitle>
                        <DialogDescription>
                            Gerencie as configurações deste ambiente de trabalho.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Workspace</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                    <Button type="submit" disabled={updateWorkspace.isPending}>
                                        {updateWorkspace.isPending ? 'Salvando...' : 'Salvar'}
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
                            Esta ação excluirá permanentemente o workspace e todos os dados
                            associados a ele (workflows, módulos, etc).
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