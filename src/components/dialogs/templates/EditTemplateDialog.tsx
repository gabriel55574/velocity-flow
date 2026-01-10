/**
 * EditTemplateDialog
 * 
 * Dialog para editar template de mensagem existente
 * Epic 0: US 0.9 - Dialogs CRUD P1
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
import { useUpdateMessageTemplate, useDeleteMessageTemplate } from '@/hooks/useMessageTemplates';
import type { Database } from '@/types/database';
import { Trash2, Copy } from 'lucide-react';

type MessageTemplate = Database['public']['Tables']['message_templates']['Row'];

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    channel: z.enum(['whatsapp', 'email', 'sms']),
    content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
});

type FormData = z.infer<typeof schema>;

interface EditTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: MessageTemplate | null;
}

export function EditTemplateDialog({ open, onOpenChange, template }: EditTemplateDialogProps) {
    const { toast } = useToast();
    const updateTemplate = useUpdateMessageTemplate();
    const deleteTemplate = useDeleteMessageTemplate();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            channel: 'whatsapp',
            content: '',
        },
    });

    useEffect(() => {
        if (template) {
            form.reset({
                name: template.name,
                channel: template.channel || 'whatsapp',
                content: template.content,
            });
        }
    }, [template, form]);

    const onSubmit = async (data: FormData) => {
        if (!template) return;

        try {
            await updateTemplate.mutateAsync({
                id: template.id,
                name: data.name,
                channel: data.channel,
                content: data.content,
            });

            toast({
                title: 'Template atualizado!',
                description: `"${data.name}" foi salvo com sucesso.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar template',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!template) return;

        try {
            await deleteTemplate.mutateAsync(template.id);

            toast({
                title: 'Template excluído',
                description: 'O template foi removido.',
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

    const handleCopyContent = () => {
        if (template?.content) {
            navigator.clipboard.writeText(template.content);
            toast({
                title: 'Copiado!',
                description: 'O conteúdo foi copiado para a área de transferência.',
            });
        }
    };

    const channelLabels: Record<string, string> = {
        whatsapp: '💬 WhatsApp',
        email: '📧 E-mail',
        sms: '📱 SMS',
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Editar Template</DialogTitle>
                    <DialogDescription>
                        Atualize o script de mensagem.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Template *</Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="channel">Canal</Label>
                        <Select
                            value={form.watch('channel')}
                            onValueChange={(value) => form.setValue('channel', value as FormData['channel'])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(channelLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="content">Conteúdo da Mensagem *</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyContent}
                            >
                                <Copy className="h-4 w-4 mr-1" />
                                Copiar
                            </Button>
                        </div>
                        <Textarea
                            id="content"
                            rows={6}
                            className="font-mono text-sm"
                            {...form.register('content')}
                        />
                        {form.formState.errors.content && (
                            <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
                        )}
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
                                    <AlertDialogTitle>Excluir template?</AlertDialogTitle>
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
                            <Button type="submit" disabled={updateTemplate.isPending}>
                                {updateTemplate.isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}