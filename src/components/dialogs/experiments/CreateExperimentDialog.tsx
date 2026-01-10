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
import { useCreateExperiment } from '@/hooks/useExperiments';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
    description: z.string().optional(),
    hypothesis: z.string().min(10, { message: 'Descreva a hipótese do experimento' }),
    metrics: z.string().min(5, { message: 'Defina as métricas de sucesso' }),
    status: z.enum(['draft', 'running', 'completed', 'cancelled']).default('draft'),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});

interface CreateExperimentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
}

export function CreateExperimentDialog({
    open,
    onOpenChange,
    clientId,
}: CreateExperimentDialogProps) {
    const { toast } = useToast();
    const createExperiment = useCreateExperiment();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            hypothesis: '',
            metrics: '',
            status: 'draft',
            start_date: '',
            end_date: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createExperiment.mutateAsync({
                ...values,
                client_id: clientId,
            });

            toast({
                title: 'Experimento criado!',
                description: `O experimento "${values.name}" foi registrado como rascunho.`,
            });
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao criar experimento',
                description: 'Ocorreu um erro ao salvar o experimento.',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Novo Experimento (Teste A/B)</DialogTitle>
                    <DialogDescription>
                        Registre um novo teste de hipótese para otimização de resultados.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Experimento</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Novo Headline na Landing Page" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hypothesis"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hipótese</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Se alterarmos X, então Y acontecerá porque Z..."
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metrics"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Métricas de Sucesso</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Aumento de 5% na Taxa de Conversão" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Início (Prevista)</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Fim (Prevista)</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição Detalhada (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detalhes sobre a implementação do teste..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
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
                            <Button type="submit" disabled={createExperiment.isPending}>
                                {createExperiment.isPending ? 'Criando...' : 'Criar Experimento'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
