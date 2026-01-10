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

const schema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    slug: z.string().min(2, 'Slug deve ter no mínimo 2 caracteres').regex(/^[a-z0-9-]+$/, 'Apenas minúsculas, números e hífens'),
    niche: z.string().optional(),
    status: z.enum(['lead', 'onboarding', 'active', 'churned', 'paused']).default('onboarding'),
});

type FormData = z.infer<typeof schema>;

interface CreateClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agencyId: string;
}

export function CreateClientDialog({ open, onOpenChange, agencyId }: CreateClientDialogProps) {
    const { toast } = useToast();
    const createClient = useCreateClient();

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
        try {
            await createClient.mutateAsync({
                ...data,
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

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Cliente *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Empresa XYZ"
                            {...form.register('name')}
                            onChange={handleNameChange}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL) *</Label>
                        <Input
                            id="slug"
                            placeholder="empresa-xyz"
                            {...form.register('slug')}
                        />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="niche">Nicho/Segmento</Label>
                        <Input
                            id="niche"
                            placeholder="Ex: E-commerce, SaaS, Educação..."
                            {...form.register('niche')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status Inicial</Label>
                        <Select
                            value={form.watch('status')}
                            onValueChange={(value) => form.setValue('status', value as FormData['status'])}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="onboarding">Onboarding</SelectItem>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="paused">Pausado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createClient.isPending}>
                            {createClient.isPending ? 'Criando...' : 'Criar Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
