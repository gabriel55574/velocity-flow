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
import { useCreateKPIValue, useKPIDefinitions } from '@/hooks/useKPIs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const formSchema = z.object({
    kpi_id: z.string().min(1, { message: 'Selecione um KPI' }),
    value: z.preprocess((val) => Number(val), z.number()),
    period_start: z.string().min(1, { message: 'Início do período é obrigatório' }),
    period_end: z.string().min(1, { message: 'Fim do período é obrigatório' }),
});

interface CreateKPIValueDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    agencyId: string;
}

export function CreateKPIValueDialog({
    open,
    onOpenChange,
    clientId,
    agencyId,
}: CreateKPIValueDialogProps) {
    const { toast } = useToast();
    const { data: kpis } = useKPIDefinitions(agencyId);
    const createValue = useCreateKPIValue();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kpi_id: '',
            value: 0,
            period_start: format(new Date(), 'yyyy-MM-01'),
            period_end: format(new Date(), 'yyyy-MM-dd'),
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createValue.mutateAsync({
                kpi_id: values.kpi_id,
                value: values.value,
                period_start: values.period_start,
                period_end: values.period_end,
                client_id: clientId,
            });

            toast({
                title: 'Valor registrado!',
                description: 'A métrica foi salva com sucesso.',
            });
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar valor',
                description: 'Ocorreu um erro ao registrar a métrica.',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Métrica</DialogTitle>
                    <DialogDescription>
                        Insira os resultados alcançados no período.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="kpi_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>KPI</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o KPI" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {kpis?.map((kpi) => (
                                                <SelectItem key={kpi.id} value={kpi.id}>
                                                    {kpi.name} ({kpi.unit})
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
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createValue.isPending}>
                                {createValue.isPending ? 'Salvando...' : 'Salvar Valor'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
