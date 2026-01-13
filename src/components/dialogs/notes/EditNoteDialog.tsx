import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/alert-dialog";
import { useUpdateNote, useDeleteNote, type ClientNote } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
    type: z.enum(["note", "decision", "ata"]).default("note"),
    content: z.string().min(1, { message: "O conteúdo da nota é obrigatório" }),
});

interface EditNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note: ClientNote | null;
}

export function EditNoteDialog({ open, onOpenChange, note }: EditNoteDialogProps) {
    const { toast } = useToast();
    const updateNote = useUpdateNote();
    const deleteNote = useDeleteNote();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "note",
            content: "",
        },
    });

    useEffect(() => {
        if (open && note) {
            form.reset({
                type: note.type || "note",
                content: note.content || "",
            });
        }
    }, [open, note, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!note) return;

        try {
            await updateNote.mutateAsync({
                id: note.id,
                type: values.type,
                content: values.content,
            });

            toast({
                title: "Nota atualizada!",
                description: "A anotação foi atualizada com sucesso.",
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar nota",
                description: "Ocorreu um erro ao salvar as alterações.",
            });
        }
    }

    async function handleDelete() {
        if (!note) return;

        try {
            await deleteNote.mutateAsync(note.id);
            toast({
                title: "Nota excluída",
                description: "A anotação foi removida do histórico.",
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao excluir nota",
                description: "Ocorreu um erro ao tentar excluir a anotação.",
            });
        } finally {
            setDeleteOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Anotação</DialogTitle>
                    <DialogDescription>
                        Atualize o tipo ou o conteúdo desta nota.
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                        <DialogFooter className="gap-2 sm:gap-0">
                            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="ghost" className="gap-2 text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        Excluir
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir anotação?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. A nota será removida do histórico.
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

                            <div className="flex flex-1 justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={updateNote.isPending}>
                                    {updateNote.isPending ? "Salvando..." : "Salvar"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
