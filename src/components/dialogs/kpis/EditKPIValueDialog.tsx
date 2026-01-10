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
import { useUpdateKPIValue, useDeleteKPIValue } from '@/hooks/useKPIs';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type KPIValue = Database['public']['Tables']['kpi_values']['Row'] & {
    kpi?: {
        name: string;
        unit: string;
    };
};

const formSchema = z.object({
    value: z.preprocess((val) => Number(val), z.number()),
    period_start: z.string().min(1, { message: 'Início do período é obrigatório' }),
    period_end: z.string().min(1, { message: 'Fim do período é obrigatório' }),
});

interface EditKPIValueDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kpiValue: KPIValue;
}

export function EditKPIValueDialog({
    open,
    onOpenChange,
    kpiValue,
}: EditKPIValueDialogProps) {
    const { toast } = useToast();
    const updateValue = useUpdateKPIValue();
    const deleteValue = useDeleteKPIValue();
    const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: kpiValue.value,
            period_start: kpiValue.period_start,
            period_end: kpiValue.period_end,
        },
    });

    React.useEffect(() => {
        if (open && kpiValue) {
            form.reset({
                value: kpiValue.value,
                period_start: kpiValue.period_start,
                period_end: kpiValue.period_end,
            });
        }
    }, [open, kpiValue, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateValue.mutateAsync({
                id: kpiValue.id,
                ...values,
            });

            toast({
                title: 'Valor atualizado!',
                description: 'A métrica foi alterada com sucesso.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar valor',
                description: 'Ocorreu um erro ao salvar as alterações.',
            });
        }
    }

    async function handleDelete() {
        try {
            await deleteValue.mutateAsync(kpiValue.id);
            toast({
                title: 'Registro excluído',
                description: 'O valor da métrica foi removido.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir registro',
                description: 'Ocorreu um erro ao tentar excluir o valor.',
            });
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Valor: {kpiValue.kpi?.name}</DialogTitle>
                        <DialogDescription>
                            Altere os dados registrados para este período.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor ({kpiValue.kpi?.unit})</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="period_start"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Início do Período</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="period_end"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fim do Período</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                    <Button type="submit" disabled={updateValue.isPending}>
                                        {updateValue.isPending ? 'Salvando...' : 'Salvar'}
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
                            Esta ação excluirá permanentemente este registro de métrica.
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
