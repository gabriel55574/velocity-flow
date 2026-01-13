/**
 * CreateAssetDialog
 * 
 * Dialog para upload de novo asset
 * Epic 0: US 0.2 - Dialogs CRUD
 */

import { useState, useRef } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUploadAsset, useCreateAsset } from '@/hooks/useAssets';
import { Upload, Link as LinkIcon, File, Image, Video, FileText, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    type: z.enum(['image', 'video', 'document', 'link', 'credential']),
    url: z.string().url('URL inválida').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface CreateAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    agencyId: string;
    userId: string;
}

export function CreateAssetDialog({
    open,
    onOpenChange,
    clientId,
    agencyId,
    userId
}: CreateAssetDialogProps) {
    const { toast } = useToast();
    const uploadAsset = useUploadAsset();
    const createAsset = useCreateAsset();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
    const [markAsPending, setMarkAsPending] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            type: 'document',
            url: '',
        },
    });

    const handleFileSelect = (file: File) => {
        if (markAsPending) {
            setMarkAsPending(false);
        }
        setSelectedFile(file);

        // Auto-detect type from file
        const mimeType = file.type;
        let type: FormData['type'] = 'document';

        if (mimeType.startsWith('image/')) {
            type = 'image';
        } else if (mimeType.startsWith('video/')) {
            type = 'video';
        }

        form.setValue('type', type);

        // Auto-fill name if empty
        if (!form.getValues('name')) {
            form.setValue('name', file.name.split('.')[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (markAsPending) {
            setMarkAsPending(false);
        }

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (markAsPending) {
                await createAsset.mutateAsync({
                    client_id: clientId,
                    name: data.name,
                    type: data.type,
                    created_by: userId,
                    status: 'missing',
                });
            } else if (uploadMode === 'file' && selectedFile) {
                await uploadAsset.mutateAsync({
                    file: selectedFile,
                    client_id: clientId,
                    agency_id: agencyId,
                    name: data.name,
                    type: data.type,
                    created_by: userId,
                    visibility: 'public',
                });
            } else if (uploadMode === 'url' && data.url) {
                await createAsset.mutateAsync({
                    client_id: clientId,
                    name: data.name,
                    type: data.type,
                    url: data.url,
                    created_by: userId,
                });
            } else {
                toast({
                    title: 'Arquivo ou URL obrigatório',
                    description: 'Selecione um arquivo, informe uma URL ou marque como pendente.',
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Asset adicionado!',
                description: `"${data.name}" foi salvo com sucesso.`,
            });

            form.reset();
            setSelectedFile(null);
            setMarkAsPending(false);
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao adicionar asset',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
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

    const isPending = uploadAsset.isPending || createAsset.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Novo Asset</DialogTitle>
                    <DialogDescription>
                        Adicione arquivos, links ou credenciais do cliente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                        <Checkbox
                            id="pending-asset"
                            checked={markAsPending}
                            onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                setMarkAsPending(isChecked);
                                if (isChecked) {
                                    setSelectedFile(null);
                                    form.setValue('url', '');
                                }
                            }}
                        />
                        <div className="space-y-1">
                            <Label htmlFor="pending-asset" className="font-medium">
                                Criar como pendente (sem arquivo)
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                O cliente verá este asset como “faltando” e poderá enviar depois.
                            </p>
                        </div>
                    </div>

                    {/* Toggle Upload Mode */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={uploadMode === 'file' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => {
                                setMarkAsPending(false);
                                setUploadMode('file');
                            }}
                            disabled={markAsPending}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                        </Button>
                        <Button
                            type="button"
                            variant={uploadMode === 'url' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => {
                                setMarkAsPending(false);
                                setUploadMode('url');
                            }}
                            disabled={markAsPending}
                        >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            URL
                        </Button>
                    </div>

                    {/* File Upload Zone */}
                    {!markAsPending && uploadMode === 'file' && (
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                                selectedFile && "border-green-500 bg-green-500/5"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            />

                            {selectedFile ? (
                                <div className="flex items-center justify-center gap-2">
                                    <File className="h-8 w-8 text-green-500" />
                                    <div className="text-left">
                                        <p className="font-medium">{selectedFile.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Arraste um arquivo ou clique para selecionar
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {/* URL Input */}
                    {!markAsPending && uploadMode === 'url' && (
                        <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://..."
                                {...form.register('url')}
                            />
                            {form.formState.errors.url && (
                                <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Logo Principal"
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Salvando...' : 'Adicionar Asset'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
