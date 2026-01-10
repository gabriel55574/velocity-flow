/**
 * EditApprovalDialog
 * 
 * Dialog para editar/revisar aprovação existente
 * Epic 0: US 0.2 - Dialogs CRUD
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
    useUpdateApproval,
    useDeleteApproval,
    useApproveItem,
    useRejectItem,
    useRequestRevision
} from '@/hooks/useApprovals';
import type { Database } from '@/types/database';
import { Check, X, RotateCcw, Trash2, ExternalLink } from 'lucide-react';

type Approval = Database['public']['Tables']['approvals']['Row'];

const schema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional().nullable(),
    type: z.enum(['creative', 'copy', 'strategy', 'report', 'other']),
    due_date: z.string().optional().nullable(),
    file_url: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
    feedback: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface EditApprovalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    approval: Approval | null;
    currentUserId: string;
    canReview?: boolean;
}

export function EditApprovalDialog({
    open,
    onOpenChange,
    approval,
    currentUserId,
    canReview = true
}: EditApprovalDialogProps) {
    const { toast } = useToast();
    const updateApproval = useUpdateApproval();
    const deleteApproval = useDeleteApproval();
    const approveItem = useApproveItem();
    const rejectItem = useRejectItem();
    const requestRevision = useRequestRevision();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            type: 'other',
            due_date: '',
            file_url: '',
            feedback: '',
        },
    });

    useEffect(() => {
        if (approval) {
            form.reset({
                title: approval.title,
                description: approval.description || '',
                type: (approval.type as FormData['type']) || 'other',
                due_date: approval.due_date?.split('T')[0] || '',
                file_url: approval.file_url || '',
                feedback: approval.feedback || '',
            });
        }
    }, [approval, form]);

    const onSubmit = async (data: FormData) => {
        if (!approval) return;

        try {
            await updateApproval.mutateAsync({
                id: approval.id,
                ...data,
                due_date: data.due_date || null,
                file_url: data.file_url || null,
                description: data.description || null,
                feedback: data.feedback || null,
            });

            toast({
                title: 'Aprovação atualizada!',
                description: 'As alterações foram salvas.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleApprove = async () => {
        if (!approval) return;

        try {
            await approveItem.mutateAsync({
                id: approval.id,
                reviewer_id: currentUserId,
            });

            toast({
                title: '✅ Aprovado!',
                description: 'O item foi aprovado com sucesso.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao aprovar',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleReject = async () => {
        if (!approval) return;
        const feedback = form.getValues('feedback');

        if (!feedback) {
            toast({
                title: 'Feedback obrigatório',
                description: 'Informe o motivo da rejeição no campo de feedback.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await rejectItem.mutateAsync({
                id: approval.id,
                reviewer_id: currentUserId,
                feedback,
            });

            toast({
                title: '❌ Rejeitado',
                description: 'O item foi rejeitado.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao rejeitar',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleRequestRevision = async () => {
        if (!approval) return;
        const feedback = form.getValues('feedback');

        if (!feedback) {
            toast({
                title: 'Feedback obrigatório',
                description: 'Informe o que precisa ser alterado no campo de feedback.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await requestRevision.mutateAsync({
                id: approval.id,
                reviewer_id: currentUserId,
                feedback,
            });

            toast({
                title: '🔄 Revisão solicitada',
                description: 'O item foi enviado para revisão.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao solicitar revisão',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!approval) return;

        try {
            await deleteApproval.mutateAsync(approval.id);

            toast({
                title: 'Aprovação excluída',
                description: 'A solicitação foi removida.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const statusLabels: Record<string, { label: string; color: string }> = {
        pending: { label: 'Pendente', color: 'bg-yellow-500' },
        approved: { label: 'Aprovado', color: 'bg-green-500' },
        rejected: { label: 'Rejeitado', color: 'bg-red-500' },
        revision: { label: 'Revisão', color: 'bg-blue-500' },
    };

    const typeLabels: Record<string, string> = {
        creative: '🎨 Criativo',
        copy: '✍️ Copy',
        strategy: '📈 Estratégia',
        report: '📊 Relatório',
        other: '📄 Outro',
    };

    const isPending = approval?.status === 'pending';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>Detalhes da Aprovação</DialogTitle>
                        {approval?.status && (
                            <Badge className={statusLabels[approval.status]?.color}>
                                {statusLabels[approval.status]?.label}
                            </Badge>
                        )}
                    </div>
                    <DialogDescription>
                        {isPending ? 'Revise e tome uma ação.' : 'Visualize os detalhes da aprovação.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            {...form.register('title')}
                            disabled={!isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            rows={2}
                            {...form.register('description')}
                            disabled={!isPending}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select
                                value={form.watch('type')}
                                onValueChange={(value) => form.setValue('type', value as FormData['type'])}
                                disabled={!isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(typeLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="due_date">Prazo</Label>
                            <Input
                                id="due_date"
                                type="date"
                                {...form.register('due_date')}
                                disabled={!isPending}
                            />
                        </div>
                    </div>

                    {approval?.file_url && (
                        <div className="space-y-2">
                            <Label>Arquivo</Label>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start"
                                asChild
                            >
                                <a href={approval.file_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Abrir Arquivo
                                </a>
                            </Button>
                        </div>
                    )}

                    {canReview && (
                        <>
                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="feedback">Feedback</Label>
                                <Textarea
                                    id="feedback"
                                    placeholder="Deixe seu feedback aqui..."
                                    rows={2}
                                    {...form.register('feedback')}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Obrigatório para rejeitar ou solicitar revisão.
                                </p>
                            </div>
                        </>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        {isPending && canReview && (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 text-red-600 hover:text-red-700"
                                    onClick={handleReject}
                                    disabled={rejectItem.isPending}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Rejeitar
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleRequestRevision}
                                    disabled={requestRevision.isPending}
                                >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Revisão
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={handleApprove}
                                    disabled={approveItem.isPending}
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Aprovar
                                </Button>
                            </div>
                        )}

                        {!isPending && (
                            <div className="flex gap-2 w-full justify-between">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Fechar
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
