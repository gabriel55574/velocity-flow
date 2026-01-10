/**
 * EditClientDialog
 * 
 * Dialog para editar cliente existente
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUpdateClient } from '@/hooks/useClients';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];

const schema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    slug: z.string().min(2, 'Slug deve ter no mínimo 2 caracteres').regex(/^[a-z0-9-]+$/, 'Apenas minúsculas, números e hífens'),
    niche: z.string().optional().nullable(),
    status: z.enum(['lead', 'onboarding', 'active', 'churned', 'paused']),
});

type FormData = z.infer<typeof schema>;

interface EditClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client: Client | null;
}

export function EditClientDialog({ open, onOpenChange, client }: EditClientDialogProps) {
    const { toast } = useToast();
    const updateClient = useUpdateClient();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            slug: '',
            niche: '',
            status: 'active',
        },
    });

    // Populate form when client changes
    useEffect(() => {
        if (client) {
            form.reset({
                name: client.name,
                slug: client.slug,
                niche: client.niche || '',
                status: client.status || 'active',
            });
        }
    }, [client, form]);

    const onSubmit = async (data: FormData) => {
        if (!client) return;

        try {
            await updateClient.mutateAsync({
                id: client.id,
                ...data,
            });

            toast({
                title: 'Cliente atualizado!',
                description: `${data.name} foi atualizado com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar cliente',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do cliente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Cliente *</Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL) *</Label>
                        <Input
                            id="slug"
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
                            {...form.register('niche')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
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
                                <SelectItem value="churned">Churned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={updateClient.isPending}>
                            {updateClient.isPending ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
