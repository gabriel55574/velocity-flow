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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
import { useUpdateKPIDefinition, useDeleteKPIDefinition } from '@/hooks/useKPIs';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type KPIDefinition = Database['public']['Tables']['kpi_definitions']['Row'];

const formSchema = z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    key: z.string().min(2, { message: 'Chave deve ter pelo menos 2 caracteres' }),
    unit: z.string().min(1, { message: 'Unidade é obrigatória' }),
    target_direction: z.enum(['up', 'down']),
    is_default: z.boolean(),
});

interface EditKPIDefinitionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kpi: KPIDefinition;
}

export function EditKPIDefinitionDialog({
    open,
    onOpenChange,
    kpi,
}: EditKPIDefinitionDialogProps) {
    const { toast } = useToast();
    const updateKPI = useUpdateKPIDefinition();
    const deleteKPI = useDeleteKPIDefinition();
    const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: kpi.name,
            key: kpi.key,
            unit: kpi.unit || '',
            target_direction: (kpi.target_direction as 'up' | 'down') || 'up',
            is_default: kpi.is_default || false,
        },
    });

    React.useEffect(() => {
        if (open && kpi) {
            form.reset({
                name: kpi.name,
                key: kpi.key,
                unit: kpi.unit || '',
                target_direction: (kpi.target_direction as 'up' | 'down') || 'up',
                is_default: kpi.is_default || false,
            });
        }
    }, [open, kpi, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateKPI.mutateAsync({
                id: kpi.id,
                name: values.name,
                key: values.key,
                unit: values.unit,
                target_direction: values.target_direction,
                is_default: values.is_default,
            });

            toast({
                title: 'KPI atualizado com sucesso!',
                description: `As alterações em ${values.name} foram salvas.`,
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar KPI',
                description: 'Ocorreu um erro ao salvar as alterações.',
            });
        }
    }

    async function handleDelete() {
        try {
            await deleteKPI.mutateAsync(kpi.id);
            toast({
                title: 'KPI excluído',
                description: 'O KPI foi removido com sucesso.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir KPI',
                description: 'Ocorreu um erro ao tentar excluir o KPI.',
            });
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar KPI</DialogTitle>
                        <DialogDescription>
                            Altere as configurações deste indicador de performance.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do KPI</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chave (identificador)</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="target_direction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Direção da Meta</FormLabel>
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
                                                <SelectItem value="up">Maior é melhor</SelectItem>
                                                <SelectItem value="down">Menor é melhor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidade / Símbolo</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_default"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>KPI Padrão</FormLabel>
                                            <DialogDescription>
                                                Ativar para todos os novos clientes.
                                            </DialogDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
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
                                    <Button type="submit" disabled={updateKPI.isPending}>
                                        {updateKPI.isPending ? 'Salvando...' : 'Salvar Alterações'}
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
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o KPI
                            "{kpi.name}" e todos os dados associados a ele.
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
