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
import { useUpdateCampaignMetrics } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/types/database';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

const formSchema = z.object({
    budget: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    spent: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    impressions: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    clicks: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    conversions: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    revenue: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
});

interface EditCampaignMetricsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaign: Campaign;
}

export function EditCampaignMetricsDialog({
    open,
    onOpenChange,
    campaign,
}: EditCampaignMetricsDialogProps) {
    const { toast } = useToast();
    const updateMetrics = useUpdateCampaignMetrics();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            budget: campaign.budget || undefined,
            spent: campaign.spent || undefined,
            impressions: campaign.impressions || undefined,
            clicks: campaign.clicks || undefined,
            conversions: campaign.conversions || undefined,
            revenue: campaign.revenue || undefined,
        },
    });

    React.useEffect(() => {
        if (open && campaign) {
            form.reset({
                budget: campaign.budget || undefined,
                spent: campaign.spent || undefined,
                impressions: campaign.impressions || undefined,
                clicks: campaign.clicks || undefined,
                conversions: campaign.conversions || undefined,
                revenue: campaign.revenue || undefined,
            });
        }
    }, [open, campaign, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateMetrics.mutateAsync({
                id: campaign.id,
                ...values,
            });

            toast({
                title: 'Métricas atualizadas!',
                description: `Os dados de performance para "${campaign.name}" foram salvos.`,
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar métricas',
                description: 'Ocorreu um erro ao atualizar os dados de performance.',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Métricas de Performance</DialogTitle>
                    <DialogDescription>
                        Atualize manualmente os números desta campanha.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Orçamento (Budget)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="spent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gasto (Spent)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="impressions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Impressões</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="clicks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cliques</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="conversions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Conversões</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="revenue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Receita (Revenue)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" {...field} />
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
                            <Button type="submit" disabled={updateMetrics.isPending}>
                                {updateMetrics.isPending ? 'Salvando...' : 'Salvar Métricas'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
