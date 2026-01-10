/**
 * EditCreativeDialog
 * 
 * Dialog para editar criativo existente
 * Epic 0: US 0.7 - Dialogs CRUD P1
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
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useUpdateCreative, useDeleteCreative, useUpdateCreativeStatus } from '@/hooks/useCreatives';
import type { Database } from '@/types/database';
import { Trash2, ExternalLink } from 'lucide-react';

type Creative = Database['public']['Tables']['creatives']['Row'];

const schema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    type: z.enum(['image', 'video', 'carousel', 'story']),
    status: z.enum(['draft', 'pending_approval', 'approved', 'rejected', 'published']),
    format: z.string().optional().nullable(),
    copy: z.string().optional().nullable(),
    file_url: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
});

type FormData = z.infer<typeof schema>;

interface EditCreativeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    creative: Creative | null;
}

export function EditCreativeDialog({ open, onOpenChange, creative }: EditCreativeDialogProps) {
    const { toast } = useToast();
    const updateCreative = useUpdateCreative();
    const deleteCreative = useDeleteCreative();
    const updateStatus = useUpdateCreativeStatus();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            type: 'image',
            status: 'draft',
            format: '',
            copy: '',
            file_url: '',
        },
    });

    useEffect(() => {
        if (creative) {
            form.reset({
                title: creative.title,
                type: creative.type,
                status: creative.status || 'draft',
                format: creative.format || '',
                copy: creative.copy || '',
                file_url: creative.file_url || '',
            });
        }
    }, [creative, form]);

    const onSubmit = async (data: FormData) => {
        if (!creative) return;

        try {
            await updateCreative.mutateAsync({
                id: creative.id,
                title: data.title,
                type: data.type,
                status: data.status,
                format: data.format || null,
                copy: data.copy || null,
                file_url: data.file_url || null,
            });

            toast({
                title: 'Criativo atualizado!',
                description: `"${data.title}" foi salvo com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar criativo',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!creative) return;

        try {
            await deleteCreative.mutateAsync(creative.id);

            toast({
                title: 'Criativo excluído',
                description: 'O criativo foi removido.',
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

    const typeLabels: Record<string, string> = {
        image: '🖼️ Imagem',
        video: '🎬 Vídeo',
        carousel: '📱 Carrossel',
        story: '📖 Story',
    };

    const statusLabels: Record<string, { label: string; color: string }> = {
        draft: { label: 'Rascunho', color: 'bg-gray-500' },
        pending_approval: { label: 'Aguardando Aprovação', color: 'bg-yellow-500' },
        approved: { label: 'Aprovado', color: 'bg-green-500' },
        rejected: { label: 'Rejeitado', color: 'bg-red-500' },
        published: { label: 'Publicado', color: 'bg-blue-500' },
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>Editar Criativo</DialogTitle>
                        {creative?.status && (
                            <Badge className={statusLabels[creative.status]?.color}>
                                {statusLabels[creative.status]?.label}
                            </Badge>
                        )}
                    </div>
                    <DialogDescription>
                        Atualize as informações do criativo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            {...form.register('title')}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select
                                value={form.watch('type')}
                                onValueChange={(value) => form.setValue('type', value as FormData['type'])}
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
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.watch('status')}
                                onValueChange={(value) => form.setValue('status', value as FormData['status'])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusLabels).map(([value, { label }]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="format">Formato</Label>
                        <Input
                            id="format"
                            placeholder="Ex: 1080x1080"
                            {...form.register('format')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file_url">Link do Arquivo</Label>
                        <div className="flex gap-2">
                            <Input
                                id="file_url"
                                type="url"
                                className="flex-1"
                                {...form.register('file_url')}
                            />
                            {creative?.file_url && (
                                <Button type="button" variant="outline" size="icon" asChild>
                                    <a href={creative.file_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="copy">Copy / Legenda</Label>
                        <Textarea
                            id="copy"
                            rows={3}
                            {...form.register('copy')}
                        />
                    </div>

                    <DialogFooter className="flex justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir criativo?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Excluir
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={updateCreative.isPending}>
                                {updateCreative.isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
