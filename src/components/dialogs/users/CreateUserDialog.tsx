/**
 * CreateUserDialog
 * 
 * Dialog para criar novo usuário da agência
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateUser } from '@/hooks/useUsers';

const schema = z.object({
    email: z.string().email('E-mail inválido'),
    full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    role: z.enum(['owner', 'admin', 'manager', 'operator', 'viewer']),
});

type FormData = z.infer<typeof schema>;

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agencyId: string;
}

export function CreateUserDialog({
    open,
    onOpenChange,
    agencyId
}: CreateUserDialogProps) {
    const { toast } = useToast();
    const createUser = useCreateUser();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            full_name: '',
            role: 'viewer',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createUser.mutateAsync({
                email: data.email,
                full_name: data.full_name,
                role: data.role,
                agency_id: agencyId,
                is_active: true,
            });

            toast({
                title: 'Usuário criado!',
                description: `${data.full_name} foi adicionado à equipe.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar usuário',
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Novo Usuário</DialogTitle>
                    <DialogDescription>
                        Adicione um novo membro à equipe da agência.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo *</Label>
                        <Input
                            id="full_name"
                            placeholder="João Silva"
                            {...form.register('full_name')}
                        />
                        {form.formState.errors.full_name && (
                            <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="joao@agencia.com"
                            {...form.register('email')}
                        />
                        {form.formState.errors.email && (
                            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Um e-mail de convite será enviado para este endereço.
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createUser.isPending}>
                            {createUser.isPending ? 'Criando...' : 'Adicionar Usuário'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
