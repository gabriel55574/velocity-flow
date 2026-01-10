/**
 * CreateTemplateDialog
 * 
 * Dialog para criar novo template de mensagem
 * Epic 0: US 0.9 - Dialogs CRUD P1
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
import { useCreateMessageTemplate } from '@/hooks/useMessageTemplates';

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    channel: z.enum(['whatsapp', 'email', 'sms', 'instagram', 'telefone']),
    category: z.string().optional(),
    content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
});

type FormData = z.infer<typeof schema>;

interface CreateTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
}

export function CreateTemplateDialog({
    open,
    onOpenChange,
    clientId
}: CreateTemplateDialogProps) {
    const { toast } = useToast();
    const createTemplate = useCreateMessageTemplate();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            channel: 'whatsapp',
            category: '',
            content: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createTemplate.mutateAsync({
                name: data.name,
                channel: data.channel,
                category: data.category || null,
                content: data.content,
                client_id: clientId,
            });

            toast({
                title: 'Template criado!',
                description: `"${data.name}" foi adicionado com sucesso.`,
            });

            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Erro ao criar template',
                description: error instanceof Error ? error.message : 'Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    const channelLabels: Record<string, string> = {
        whatsapp: '💬 WhatsApp',
        email: '📧 E-mail',
        sms: '📱 SMS',
        instagram: '📷 Instagram DM',
        telefone: '📞 Telefone',
    };

    const categoryOptions = ['Primeiro Contato', 'Follow-up', 'Proposta', 'Fechamento', 'Pós-venda', 'Reativação'];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Novo Template de Mensagem</DialogTitle>
                    <DialogDescription>
                        Crie um script de mensagem reutilizável para o CRM.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Template *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Primeiro Contato - WhatsApp"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                            <Label htmlFor="category">Categoria</Label>
                            <Select
                                value={form.watch('category') || ''}
                                onValueChange={(value) => form.setValue('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Conteúdo da Mensagem *</Label>
                        <Textarea
                            id="content"
                            placeholder="Olá {{nome}}, tudo bem?

Vi que você se interessou pelo nosso serviço de {{servico}}...

Use {{variavel}} para campos dinâmicos."
                            rows={6}
                            className="font-mono text-sm"
                            {...form.register('content')}
                        />
                        {form.formState.errors.content && (
                            <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Use {'{{variavel}}'} para campos dinâmicos como nome, empresa, etc.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createTemplate.isPending}>
                            {createTemplate.isPending ? 'Criando...' : 'Criar Template'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
