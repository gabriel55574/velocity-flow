/**
 * CreateClientDialog
 * 
 * Dialog para criar novo cliente
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateClient } from '@/hooks/useClients';
import { useCurrentAgency } from '@/hooks/useAgency';

const schema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    slug: z.string().min(2, 'Slug deve ter no mínimo 2 caracteres').regex(/^[a-z0-9-]+$/, 'Apenas minúsculas, números e hífens'),
    niche: z.string().optional(),
    status: z.enum(['lead', 'onboarding', 'active', 'churned', 'paused']).default('onboarding'),
});

type FormData = z.infer<typeof schema>;

export interface CreateClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agencyId?: string;
}

export function CreateClientDialog({ open, onOpenChange, agencyId: propAgencyId }: CreateClientDialogProps) {
    const { toast } = useToast();
    const createClient = useCreateClient();
    const { data: currentAgency } = useCurrentAgency();

    // Use provided agencyId or get from current agency
    const agencyId = propAgencyId || currentAgency?.id;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            slug: '',
            niche: '',
            status: 'onboarding',
        },
    });

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue('name', name);

        // Generate slug: lowercase, replace spaces with hyphens, remove special chars
        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        form.setValue('slug', slug);
    };

    const onSubmit = async (data: FormData) => {
        if (!agencyId) {
            toast({
                title: 'Erro',
                description: 'Agência não encontrada. Faça login novamente.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await createClient.mutateAsync({
                name: data.name,
                slug: data.slug,
                niche: data.niche,
                status: data.status,
                agency_id: agencyId,
            });

            toast({
                title: 'Cliente criado!',
                description: `${data.name} foi adicionado com sucesso.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar cliente',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo Cliente</DialogTitle>
                    <DialogDescription>
                        Adicione um novo cliente à sua agência. Um workspace será criado automaticamente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            placeholder="Nome do cliente"
                            {...form.register('name')}
                            onChange={handleNameChange}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            placeholder="nome-do-cliente"
                            {...form.register('slug')}
                        />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Identificador único (minúsculas, sem espaços)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="niche">Nicho</Label>
                        <Input
                            id="niche"
                            placeholder="Ex: Harmonização Facial, Dermatologia"
                            {...form.register('niche')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(value) => form.setValue('status', value as FormData['status'])}
                            defaultValue={form.getValues('status')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="onboarding">Onboarding</SelectItem>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="paused">Pausado</SelectItem>
                                <SelectItem value="churned">Churned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={createClient.isPending || !agencyId}
                        >
                            {createClient.isPending ? 'Criando...' : 'Criar Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
