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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateKPIDefinition } from '@/hooks/useKPIs';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    description: z.string().optional(),
    unit: z.string().min(1, { message: 'Unidade é obrigatória (ex: %, R$, un)' }),
    type: z.enum(['number', 'percentage', 'currency']),
    is_default: z.boolean().default(false),
});

interface CreateKPIDefinitionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agencyId: string;
}

export function CreateKPIDefinitionDialog({
    open,
    onOpenChange,
    agencyId,
}: CreateKPIDefinitionDialogProps) {
    const { toast } = useToast();
    const createKPI = useCreateKPIDefinition();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            unit: '',
            type: 'number',
            is_default: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createKPI.mutateAsync({
                ...values,
                agency_id: agencyId,
            });

            toast({
                title: 'KPI criado com sucesso!',
                description: `O KPI ${values.name} foi adicionado.`,
            });
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao criar KPI',
                description: 'Ocorreu um erro ao salvar o KPI. Tente novamente.',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo KPI</DialogTitle>
                    <DialogDescription>
                        Defina um novo indicador de performance para sua agência.
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
                                        <Input placeholder="Ex: Custo por Lead" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Dado</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="number">Número</SelectItem>
                                            <SelectItem value="currency">Moeda (R$)</SelectItem>
                                            <SelectItem value="percentage">Porcentagem (%)</SelectItem>
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
                                        <Input placeholder="Ex: R$, %, leads" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Explique o que este KPI mede..."
                                            className="resize-none"
                                            {...field}
                                        />
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createKPI.isPending}>
                                {createKPI.isPending ? 'Criando...' : 'Criar KPI'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
