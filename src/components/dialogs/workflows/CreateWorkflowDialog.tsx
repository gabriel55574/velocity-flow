/**
 * CreateWorkflowDialog
 * 
 * Dialog para criar novo workflow a partir de playbook
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
import { useCreateWorkflow } from '@/hooks/useWorkflows';

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    playbook_id: z.string().optional(),
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const defaultPlaybooks = [
    { id: 'onboarding', name: '🚀 Onboarding Novo Cliente' },
    { id: 'campaign', name: '📱 Lançamento de Campanha' },
    { id: 'monthly', name: '📊 Ciclo Mensal' },
    { id: 'custom', name: '✏️ Workflow Customizado' },
];

interface CreateWorkflowDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
}

export function CreateWorkflowDialog({
    open,
    onOpenChange,
    workspaceId
}: CreateWorkflowDialogProps) {
    const { toast } = useToast();
    const createWorkflow = useCreateWorkflow();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            playbook_id: '',
            description: '',
        },
    });

    const selectedPlaybook = form.watch('playbook_id');

    // Auto-fill name based on playbook
    const handlePlaybookChange = (value: string) => {
        form.setValue('playbook_id', value);
        const playbook = defaultPlaybooks.find(p => p.id === value);
        if (playbook && !form.getValues('name')) {
            form.setValue('name', playbook.name.replace(/^[^\s]+\s/, '')); // Remove emoji prefix
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            await createWorkflow.mutateAsync({
                name: data.name,
                workspace_id: workspaceId,
                description: data.description || null,
            });

            toast({
                title: 'Workflow criado!',
                description: `"${data.name}" foi iniciado com sucesso.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar workflow',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Novo Workflow</DialogTitle>
                    <DialogDescription>
                        Crie um novo workflow para organizar as entregas do cliente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="playbook_id">Playbook Base</Label>
                        <Select
                            value={selectedPlaybook || ''}
                            onValueChange={handlePlaybookChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecionar playbook..." />
                            </SelectTrigger>
                            <SelectContent>
                                {defaultPlaybooks.map((playbook) => (
                                    <SelectItem key={playbook.id} value={playbook.id}>
                                        {playbook.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            O playbook define os módulos e steps iniciais do workflow.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Workflow *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Onboarding Q1 2026"
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
                            placeholder="Objetivo e contexto do workflow..."
                            rows={3}
                            {...form.register('description')}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createWorkflow.isPending}>
                            {createWorkflow.isPending ? 'Criando...' : 'Criar Workflow'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
