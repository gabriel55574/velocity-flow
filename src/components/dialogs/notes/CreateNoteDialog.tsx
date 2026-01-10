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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateNote } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    type: z.enum(['note', 'decision', 'ata']).default('note'),
    content: z.string().min(1, { message: 'O conteúdo da nota é obrigatório' }),
});

interface CreateNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    agencyId: string;
    userId: string;
}

export function CreateNoteDialog({
    open,
    onOpenChange,
    clientId,
    agencyId,
    userId,
}: CreateNoteDialogProps) {
    const { toast } = useToast();
    const createNote = useCreateNote();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: 'note',
            content: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createNote.mutateAsync({
                type: values.type,
                content: values.content,
                client_id: clientId,
                agency_id: agencyId,
                user_id: userId,
            });

            toast({
                title: 'Nota salva!',
                description: 'A anotação foi adicionada ao histórico.',
            });
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar nota',
                description: 'Ocorreu um erro ao tentar salvar a anotação.',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nova Anotação</DialogTitle>
                    <DialogDescription>
                        Registre uma observação, uma decisão tomada ou uma ata de reunião.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Anotação</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="note">Anotação Simples</SelectItem>
                                            <SelectItem value="decision">Decisão</SelectItem>
                                            <SelectItem value="ata">Ata de Reunião</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conteúdo</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva o que aconteceu ou o que foi decidido..."
                                            className="min-h-[150px] resize-none"
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
                            <Button type="submit" disabled={createNote.isPending}>
                                {createNote.isPending ? 'Salvando...' : 'Salvar Nota'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
