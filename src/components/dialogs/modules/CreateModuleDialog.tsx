/**
 * CreateModuleDialog
 * 
 * Dialog para criar novo módulo em um workflow
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
import { useToast } from '@/hooks/use-toast';
import { useCreateModule } from '@/hooks/useWorkflows';

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    order_index: z.number().int().min(0),
});

type FormData = z.infer<typeof schema>;

interface CreateModuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workflowId: string;
    nextOrder: number;
}

export function CreateModuleDialog({
    open,
    onOpenChange,
    workflowId,
    nextOrder
}: CreateModuleDialogProps) {
    const { toast } = useToast();
    const createModule = useCreateModule();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            order_index: nextOrder,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createModule.mutateAsync({
                name: data.name,
                workflow_id: workflowId,
                order_index: data.order_index,
            });

            toast({
                title: 'Módulo criado!',
                description: `"${data.name}" foi adicionado ao workflow.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar módulo',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Novo Módulo</DialogTitle>
                    <DialogDescription>
                        Adicione um novo módulo ao workflow.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Módulo *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Imersão Estratégica"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createModule.isPending}>
                            {createModule.isPending ? 'Criando...' : 'Criar Módulo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
