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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useGrantClientAccess } from '@/hooks/useClientAccess';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    user_id: z.string().min(1, { message: 'Selecione um usuário' }),
    role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
});

interface GrantAccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    agencyId: string;
}

export function GrantAccessDialog({
    open,
    onOpenChange,
    clientId,
    agencyId,
}: GrantAccessDialogProps) {
    const { toast } = useToast();
    const { data: users } = useUsers({ agency_id: agencyId, is_active: true });
    const grantAccess = useGrantClientAccess();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_id: '',
            role: 'viewer',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await grantAccess.mutateAsync({
                user_id: values.user_id,
                role: values.role,
                client_id: clientId,
            });

            toast({
                title: 'Acesso concedido!',
                description: 'O usuário agora tem acesso ao portal deste cliente.',
            });
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao conceder acesso',
                description: 'Ocorreu um erro ao tentar salvar o acesso.',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Conceder Acesso ao Portal</DialogTitle>
                    <DialogDescription>
                        Permita que um usuário acesse e gerencie este cliente.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="user_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usuário</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o usuário" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users?.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.full_name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nível de Acesso</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a função" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="viewer">Visualizador (Viewer)</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <DialogDescription className="text-xs pt-1">
                                        Visualizadores podem apenas ver. Editores podem alterar tarefas e leads.
                                        Admins gerenciam workflows e assets.
                                    </DialogDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={grantAccess.isPending}>
                                {grantAccess.isPending ? 'Concedendo...' : 'Conceder Acesso'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
