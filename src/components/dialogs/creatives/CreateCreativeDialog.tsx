/**
 * CreateCreativeDialog
 * 
 * Dialog para criar novo criativo
 * Epic 0: US 0.7 - Dialogs CRUD P1
 */

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
import { useToast } from '@/hooks/use-toast';
import { useCreateCreative } from '@/hooks/useCreatives';

const schema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    type: z.enum(['image', 'video', 'carousel', 'story']).default('image'),
    format: z.string().optional(),
    copy: z.string().optional(),
    file_url: z.string().url('URL inválida').optional().or(z.literal('')),
    campaign_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateCreativeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    campaignId?: string;
}

export function CreateCreativeDialog({
    open,
    onOpenChange,
    clientId,
    campaignId
}: CreateCreativeDialogProps) {
    const { toast } = useToast();
    const createCreative = useCreateCreative();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            type: 'image',
            format: '',
            copy: '',
            file_url: '',
            campaign_id: campaignId || '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createCreative.mutateAsync({
                title: data.title,
                type: data.type,
                format: data.format || null,
                copy: data.copy || null,
                file_url: data.file_url || null,
                campaign_id: data.campaign_id || null,
                client_id: clientId,
                status: 'draft',
            });

            toast({
                title: 'Criativo adicionado!',
                description: `"${data.title}" foi criado com sucesso.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar criativo',
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Novo Criativo</DialogTitle>
                    <DialogDescription>
                        Adicione um novo criativo ao calendário de conteúdo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Post Black Friday - Feed"
                            {...form.register('title')}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
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
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="format">Formato</Label>
                        <Input
                            id="format"
                            placeholder="Ex: 1080x1080, 9:16, etc."
                            {...form.register('format')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file_url">Link do Arquivo</Label>
                        <Input
                            id="file_url"
                            type="url"
                            placeholder="https://drive.google.com/..."
                            {...form.register('file_url')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="copy">Copy / Legenda</Label>
                        <Textarea
                            id="copy"
                            placeholder="Texto que acompanha o criativo..."
                            rows={3}
                            {...form.register('copy')}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createCreative.isPending}>
                            {createCreative.isPending ? 'Criando...' : 'Criar Criativo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
