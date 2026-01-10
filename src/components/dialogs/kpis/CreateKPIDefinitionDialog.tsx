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
import { useCreateKPIDefinition } from '@/hooks/useKPIs';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    key: z.string().min(2, { message: 'Chave deve ter pelo menos 2 caracteres' }).regex(/^[a-z_]+$/, 'Apenas letras minúsculas e underscores'),
    unit: z.string().min(1, { message: 'Unidade é obrigatória (ex: %, R$, un)' }),
    target_direction: z.enum(['up', 'down']).default('up'),
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
            key: '',
            unit: '',
            target_direction: 'up',
            is_default: false,
        },
    });

    // Auto-generate key from name
    const handleNameChange = (value: string) => {
        form.setValue('name', value);
        const key = value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_');
        form.setValue('key', key);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createKPI.mutateAsync({
                name: values.name,
                key: values.key,
                unit: values.unit,
                target_direction: values.target_direction,
                is_default: values.is_default,
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
                                        <Input 
                                            placeholder="Ex: Custo por Lead" 
                                            {...field} 
                                            onChange={(e) => handleNameChange(e.target.value)}
                                        />
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
                                        <Input placeholder="Ex: custo_por_lead" {...field} />
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
                                                <SelectValue placeholder="Selecione a direção" />
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
                                        <Input placeholder="Ex: R$, %, leads" {...field} />
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
