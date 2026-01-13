/**
 * CreateApprovalDialog
 * 
 * Dialog para criar nova solicitação de aprovação
 * Epic 0: US 0.2 - Dialogs CRUD
 */

import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useCreateApproval, useUploadApprovalFile } from '@/hooks/useApprovals';
import { useClient } from '@/hooks/useClients';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    type: z.enum(['creative', 'copy', 'strategy', 'report', 'other']).default('other'),
    due_date: z.string().optional(),
    file_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface CreateApprovalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    requesterId: string;
}

export function CreateApprovalDialog({
    open,
    onOpenChange,
    clientId,
    requesterId
}: CreateApprovalDialogProps) {
    const { toast } = useToast();
    const createApproval = useCreateApproval();
    const uploadApprovalFile = useUploadApprovalFile();
    const { data: client } = useClient(clientId);
    const agencyId = client?.agency_id || "";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            type: 'other',
            due_date: '',
            file_url: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            let fileUrl: string | null = data.file_url || null;

            if (selectedFile) {
                if (!agencyId) {
                    throw new Error('Agência não encontrada para upload.');
                }
                fileUrl = await uploadApprovalFile.mutateAsync({
                    file: selectedFile,
                    client_id: clientId,
                    agency_id: agencyId,
                    type: data.type,
                });
            }

            await createApproval.mutateAsync({
                title: data.title,
                type: data.type,
                client_id: clientId,
                requester_id: requesterId,
                status: 'pending',
                due_date: data.due_date || null,
                file_url: fileUrl,
                description: data.description || null,
            });

            toast({
                title: 'Aprovação solicitada!',
                description: `"${data.title}" foi enviada para aprovação.`,
            });

            form.reset();
            onOpenChange(false);
            setSelectedFile(null);
        } catch (error) {
            toast({
                title: 'Erro ao criar solicitação',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const typeLabels: Record<string, string> = {
        creative: '🎨 Criativo',
        copy: '✍️ Copy',
        strategy: '📈 Estratégia',
        report: '📊 Relatório',
        other: '📄 Outro',
    };

    const isPending = createApproval.isPending || uploadApprovalFile.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nova Solicitação de Aprovação</DialogTitle>
                    <DialogDescription>
                        Envie um item para aprovação do cliente ou gestor.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Post Instagram - Campanha Black Friday"
                            {...form.register('title')}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva o que precisa ser aprovado..."
                            rows={3}
                            {...form.register('description')}
                        />
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
                            <Label htmlFor="due_date">Prazo</Label>
                            <Input
                                id="due_date"
                                type="date"
                                {...form.register('due_date')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file_url">Link do Arquivo</Label>
                        <Input
                            id="file_url"
                            type="url"
                            placeholder="https://drive.google.com/..."
                            {...form.register('file_url')}
                        />
                        {form.formState.errors.file_url && (
                            <p className="text-sm text-destructive">{form.formState.errors.file_url.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Link para o arquivo no Drive, Dropbox, Figma, etc.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Upload do Arquivo</Label>
                        <div
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm text-muted-foreground",
                                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(event) => {
                                event.preventDefault();
                                setIsDragging(false);
                                const file = event.dataTransfer.files?.[0];
                                if (file) setSelectedFile(file);
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) setSelectedFile(file);
                                }}
                            />
                            <Upload className="h-5 w-5 text-primary" />
                            <div>
                                <p>{selectedFile ? selectedFile.name : "Clique ou arraste um arquivo"}</p>
                                <p className="text-xs">O arquivo enviado terá prioridade sobre o link.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Enviando...' : 'Solicitar Aprovação'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
