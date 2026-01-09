import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { mockNotes, Note } from "@/data/mockData";
import {
    FileText,
    MessageSquare,
    Lightbulb,
    ClipboardList,
    Plus,
    Search,
    User,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
    note: Note;
}

function NoteCard({ note }: NoteCardProps) {
    const config = typeConfig[note.type];
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
                            {new Date(note.createdAt).toLocaleDateString('pt-BR', {
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
                        <User className="h-3 w-3" />
                        <span>{note.createdBy.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function NotesTab() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "note" | "decision" | "ata">("all");

    const filteredNotes = mockNotes.filter(note => {
        const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || note.type === filterType;
        return matchesSearch && matchesType;
    });

    const noteCounts = {
        all: mockNotes.length,
        note: mockNotes.filter(n => n.type === "note").length,
        decision: mockNotes.filter(n => n.type === "decision").length,
        ata: mockNotes.filter(n => n.type === "ata").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <GlassCard>
                <GlassCardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
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
                        <div className="flex gap-2">
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
                        <Button size="sm" className="gap-2">
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
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Nenhuma nota encontrada</p>
                        </div>
                    )}
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}
