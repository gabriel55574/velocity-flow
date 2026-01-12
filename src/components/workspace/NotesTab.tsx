import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import {
    FileText,
    MessageSquare,
    Lightbulb,
    ClipboardList,
    Plus,
    Search,
    User as UserIcon,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useCurrentUser } from "@/hooks/useUsers";
import { CreateNoteDialog } from "@/components/dialogs/notes/CreateNoteDialog";

const typeConfig = {
    note: {
        icon: MessageSquare,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        label: "Nota"
    },
    decision: {
        icon: Lightbulb,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        label: "Decisão"
    },
    ata: {
        icon: ClipboardList,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        label: "Ata"
    },
};

interface NoteCardProps {
    note: {
        id: string;
        type: 'note' | 'decision' | 'ata';
        content: string;
        created_at: string;
        user?: {
            full_name: string;
        };
    };
}

function NoteCard({ note }: NoteCardProps) {
    const config = typeConfig[note.type] || typeConfig.note;
    const TypeIcon = config.icon;

    return (
        <div className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${config.bg}`}>
                    <TypeIcon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                            {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(note.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <UserIcon className="h-3 w-3" />
                        <span>{note.user?.full_name || 'Usuário desconhecido'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface NotesTabProps {
    clientId: string;
}

export function NotesTab({ clientId }: NotesTabProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "note" | "decision" | "ata">("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const { data: currentUser } = useCurrentUser();
    const { data: notes, isLoading } = useNotes({
        client_id: clientId,
        type: filterType === "all" ? undefined : filterType
    });

    const filteredNotes = notes?.filter(note =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const noteCounts = {
        all: notes?.length || 0,
        note: notes?.filter(n => n.type === "note").length || 0,
        decision: notes?.filter(n => n.type === "decision").length || 0,
        ata: notes?.filter(n => n.type === "ata").length || 0,
    };

    return (
        <div className="space-y-6">
            {/* Coming Soon Banner */}
            <GlassCard>
                <GlassCardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar em notas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            {(["all", "note", "decision", "ata"] as const).map((type) => (
                                <Button
                                    key={type}
                                    size="sm"
                                    variant={filterType === type ? "default" : "outline"}
                                    onClick={() => setFilterType(type)}
                                    className="gap-1"
                                >
                                    {type === "all" ? "Todos" : typeConfig[type].label}
                                    <span className="text-xs opacity-70">({noteCounts[type]})</span>
                                </Button>
                            ))}
                        </div>

                        {/* Add Note */}
                        <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Nova Nota
                        </Button>
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Notes Timeline */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-5 w-5 text-primary" />
                        Histórico ({filteredNotes.length})
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                            <p className="text-sm text-muted-foreground">Carregando notas...</p>
                        </div>
                    ) : filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Nenhuma nota encontrada</p>
                            <p className="text-xs mt-1">Funcionalidade em desenvolvimento</p>
                        </div>
                    )}
                </GlassCardContent>
            </GlassCard>

            {currentUser && (
                <CreateNoteDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    clientId={clientId}
                    agencyId={currentUser.agency_id}
                    userId={currentUser.id}
                />
            )}
        </div>
    );
}
