/**
 * EditAssetDialog
 * 
 * Dialog para editar asset existente
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
import { useUpdateAsset, useDeleteAsset } from '@/hooks/useAssets';
import type { Database } from '@/types/database';
import { Trash2, ExternalLink, Image, Video, FileText, Link as LinkIcon, Key, Copy } from 'lucide-react';

type Asset = Database['public']['Tables']['assets']['Row'];

const schema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    type: z.enum(['image', 'video', 'document', 'link', 'credential']),
    url: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
});

type FormData = z.infer<typeof schema>;

interface EditAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset: Asset | null;
}

export function EditAssetDialog({ open, onOpenChange, asset }: EditAssetDialogProps) {
    const { toast } = useToast();
    const updateAsset = useUpdateAsset();
    const deleteAsset = useDeleteAsset();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            type: 'document',
            url: '',
        },
    });

    useEffect(() => {
        if (asset) {
            form.reset({
                name: asset.name,
                type: asset.type,
                url: asset.url || '',
            });
        }
    }, [asset, form]);

    const onSubmit = async (data: FormData) => {
        if (!asset) return;

        try {
            await updateAsset.mutateAsync({
                id: asset.id,
                ...data,
                url: data.url || null,
            });

            toast({
                title: 'Asset atualizado!',
                description: `"${data.name}" foi salvo com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar asset',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!asset) return;

        try {
            await deleteAsset.mutateAsync(asset.id);

            toast({
                title: 'Asset excluído',
                description: 'O arquivo foi removido.',
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao excluir asset',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleCopyUrl = () => {
        if (asset?.url) {
            navigator.clipboard.writeText(asset.url);
            toast({
                title: 'URL copiada!',
                description: 'A URL foi copiada para a área de transferência.',
            });
        }
    };

    const typeIcons: Record<string, React.ReactNode> = {
        image: <Image className="h-4 w-4" />,
        video: <Video className="h-4 w-4" />,
        document: <FileText className="h-4 w-4" />,
        link: <LinkIcon className="h-4 w-4" />,
        credential: <Key className="h-4 w-4" />,
    };

    const typeLabels: Record<string, string> = {
        image: 'Imagem',
        video: 'Vídeo',
        document: 'Documento',
        link: 'Link',
        credential: 'Credencial',
    };

    // Preview for images
    const isImage = asset?.type === 'image' && asset?.url;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Asset</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do asset.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Image Preview */}
                    {isImage && (
                        <div className="relative rounded-lg overflow-hidden bg-muted">
                            <img
                                src={asset.url!}
                                alt={asset.name}
                                className="w-full h-40 object-contain"
                            />
                        </div>
                    )}

                    {/* URL Actions */}
                    {asset?.url && (
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={handleCopyUrl}
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar URL
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                asChild
                            >
                                <a href={asset.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Abrir
                                </a>
                            </Button>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

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
                                    <SelectItem key={value} value={value}>
                                        <div className="flex items-center gap-2">
                                            {typeIcons[value]}
                                            {label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            type="url"
                            {...form.register('url')}
                        />
                        {form.formState.errors.url && (
                            <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
                        )}
                    </div>

                    {/* Metadata */}
                    {asset?.metadata && typeof asset.metadata === 'object' && (
                        <div className="text-xs text-muted-foreground">
                            {(asset.metadata as { size?: number })?.size && (
                                <p>Tamanho: {((asset.metadata as { size: number }).size / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                            {(asset.metadata as { mimeType?: string })?.mimeType && (
                                <p>Tipo: {(asset.metadata as { mimeType: string }).mimeType}</p>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir asset?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. O arquivo será permanentemente removido.
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
                            <Button type="submit" disabled={updateAsset.isPending}>
                                {updateAsset.isPending ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
