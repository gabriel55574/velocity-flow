/**
 * EditUserDialog
 * 
 * Dialog para editar usuário da agência
 * Epic 0: Dialogs CRUD P1
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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUpdateUser, useUpdateUserRole, useToggleUserActive } from '@/hooks/useUsers';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users_profile']['Row'];

const schema = z.object({
    full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    role: z.enum(['owner', 'admin', 'manager', 'operator', 'viewer']),
    is_active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface EditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
    const { toast } = useToast();
    const updateUser = useUpdateUser();
    const updateRole = useUpdateUserRole();
    const toggleActive = useToggleUserActive();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            full_name: '',
            role: 'viewer',
            is_active: true,
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                full_name: user.full_name,
                role: user.role,
                is_active: user.is_active ?? true,
            });
        }
    }, [user, form]);

    const onSubmit = async (data: FormData) => {
        if (!user) return;

        try {
            // Update basic info
            await updateUser.mutateAsync({
                id: user.id,
                full_name: data.full_name,
            });

            // Update role if changed
            if (data.role !== user.role) {
                await updateRole.mutateAsync({
                    id: user.id,
                    role: data.role,
                });
            }

            // Toggle active if changed
            if (data.is_active !== user.is_active) {
                await toggleActive.mutateAsync({
                    userId: user.id,
                    isActive: data.is_active,
                });
            }

            toast({
                title: 'Usuário atualizado!',
                description: `${data.full_name} foi salvo com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar usuário',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const roleLabels: Record<string, { label: string; description: string }> = {
        owner: { label: '👑 Owner', description: 'Proprietário da agência' },
        admin: { label: '🛡️ Admin', description: 'Acesso total ao sistema' },
        manager: { label: '📊 Manager', description: 'Gerencia clientes e equipe' },
        operator: { label: '⚙️ Operador', description: 'Executa tarefas e operações' },
        viewer: { label: '👁️ Viewer', description: 'Apenas visualização' },
    };

    const isPending = updateUser.isPending || updateRole.isPending || toggleActive.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>Editar Usuário</DialogTitle>
                        {user && !user.is_active && (
                            <Badge variant="secondary">Inativo</Badge>
                        )}
                    </div>
                    <DialogDescription>
                        Atualize as informações do usuário.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo *</Label>
                        <Input
                            id="full_name"
                            {...form.register('full_name')}
                        />
                        {form.formState.errors.full_name && (
                            <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input
                            value={user?.email || ''}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            O e-mail não pode ser alterado.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Papel</Label>
                        <Select
                            value={form.watch('role')}
                            onValueChange={(value) => form.setValue('role', value as FormData['role'])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(roleLabels).map(([value, { label, description }]) => (
                                    <SelectItem key={value} value={value}>
                                        <div className="flex flex-col">
                                            <span>{label}</span>
                                            <span className="text-xs text-muted-foreground">{description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active">Usuário Ativo</Label>
                            <p className="text-sm text-muted-foreground">
                                Usuários inativos não podem acessar o sistema.
                            </p>
                        </div>
                        <Switch
                            id="is_active"
                            checked={form.watch('is_active')}
                            onCheckedChange={(checked) => form.setValue('is_active', checked)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
