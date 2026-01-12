import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    CheckSquare,
    Clock,
    CheckCircle2,
    XCircle,
    Image,
    FileText,
    DollarSign,
    Calendar,
    Loader2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateApprovalDialog } from "@/components/dialogs/approvals/CreateApprovalDialog";
import { EditApprovalDialog } from "@/components/dialogs/approvals/EditApprovalDialog";
import { useApprovals, useApproveItem, useRejectItem } from "@/hooks/useApprovals";
import { useCurrentUser } from "@/hooks/useUsers";
import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";

const typeIcons = {
    creative: Image,
    copy: FileText,
    plan: Calendar,
    budget: DollarSign,
    other: FileText,
};

interface ApprovalCardProps {
    approval: Database['public']['Tables']['approvals']['Row'];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onOpen: (approval: Database['public']['Tables']['approvals']['Row']) => void;
}

function ApprovalCard({ approval, onApprove, onReject, onOpen }: ApprovalCardProps) {
    const TypeIcon = typeIcons[approval.type] || FileText;
    const isPending = approval.status === "pending";
    const isOverdue = isPending && approval.due_date && new Date(approval.due_date) < new Date();

    return (
        <div
            className={`p-4 rounded-xl border cursor-pointer ${isOverdue
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-border/50 bg-card"
                }`}
            onClick={() => onOpen(approval)}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${approval.status === "approved"
                        ? "bg-emerald-500/10"
                        : approval.status === "rejected"
                            ? "bg-red-500/10"
                            : "bg-amber-500/10"
                    }`}>
                    <TypeIcon className={`h-5 w-5 ${approval.status === "approved"
                            ? "text-emerald-500"
                            : approval.status === "rejected"
                                ? "text-red-500"
                                : "text-amber-500"
                        }`} />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{approval.title}</h4>
                        <StatusBadge
                            status={
                                approval.status === "approved"
                                    ? "ok"
                                    : approval.status === "rejected"
                                        ? "risk"
                                        : "warn"
                            }
                            size="sm"
                        >
                            {approval.status === "approved"
                                ? "Aprovado"
                                : approval.status === "rejected"
                                    ? "Rejeitado"
                                    : "Pendente"}
                        </StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                        {approval.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                                {isPending
                                    ? approval.due_date
                                        ? `Vence: ${new Date(approval.due_date).toLocaleDateString('pt-BR')}`
                                        : 'Sem SLA'
                                    : `Solicitado: ${new Date(approval.created_at).toLocaleDateString('pt-BR')}`
                                }
                            </span>
                        </div>
                        <span>Por: {approval.requester_id ? `User ${approval.requester_id.slice(0, 4)}` : 'N/D'}</span>
                    </div>
                </div>

                {isPending && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500"
                            onClick={(event) => {
                                event.stopPropagation();
                                onReject(approval.id);
                            }}
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600"
                            onClick={(event) => {
                                event.stopPropagation();
                                onApprove(approval.id);
                            }}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ApprovalsTabProps {
    clientId?: string;
}

export function ApprovalsTab({ clientId }: ApprovalsTabProps) {
    const { data: currentUser } = useCurrentUser();
    const { data: approvals, isLoading, error } = useApprovals(clientId ? { client_id: clientId } : undefined);
    const approveMutation = useApproveItem();
    const rejectMutation = useRejectItem();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState<Database['public']['Tables']['approvals']['Row'] | null>(null);

    const pending = (approvals || []).filter(a => a.status === "pending");
    const approved = (approvals || []).filter(a => a.status === "approved");
    const rejected = (approvals || []).filter(a => a.status === "rejected");

    const handleApprove = async (id: string) => {
        if (!currentUser) return;
        await approveMutation.mutateAsync({ id, reviewer_id: currentUser.id });
    };

    const handleReject = async (id: string) => {
        if (!currentUser) return;
        const feedback = window.prompt("Informe o motivo da reprovação:");
        if (!feedback) return;
        await rejectMutation.mutateAsync({ id, reviewer_id: currentUser.id, feedback });
    };

    const handleOpenEdit = (approval: Database['public']['Tables']['approvals']['Row']) => {
        setSelectedApproval(approval);
        setEditOpen(true);
    };

    if (isLoading) {
        return (
            <GlassCard>
                <GlassCardContent className="p-6 flex items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sincronizando aprovações...
                </GlassCardContent>
            </GlassCard>
        );
    }

    if (error) {
        return (
            <GlassCard>
                <GlassCardContent className="p-6 text-center text-muted-foreground">
                    <p>Erro ao carregar aprovações. Tente novamente.</p>
                </GlassCardContent>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-lg">Aprovações</h3>
                    <p className="text-sm text-muted-foreground">Solicitações e histórico do cliente</p>
                </div>
                <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => setCreateOpen(true)}
                    disabled={!clientId || !currentUser}
                >
                    <Plus className="h-4 w-4" />
                    Nova Aprovação
                </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <GlassCard className="p-4 text-center">
                    <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{pending.length}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{approved.length}</p>
                    <p className="text-xs text-muted-foreground">Aprovadas</p>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                    <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{rejected.length}</p>
                    <p className="text-xs text-muted-foreground">Rejeitadas</p>
                </GlassCard>
            </div>

            {/* Pending Approvals */}
            {pending.length > 0 && (
                <GlassCard>
                    <GlassCardHeader>
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <CheckSquare className="h-5 w-5 text-amber-500" />
                            Aguardando Aprovação ({pending.length})
                        </GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent className="space-y-3">
                        {pending.map((approval) => (
                            <ApprovalCard
                                key={approval.id}
                                approval={approval}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onOpen={handleOpenEdit}
                            />
                        ))}
                    </GlassCardContent>
                </GlassCard>
            )}

            {/* History */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="text-base">Histórico</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                    {[...approved, ...rejected].length > 0 ? (
                        [...approved, ...rejected].map((approval) => (
                            <ApprovalCard
                                key={approval.id}
                                approval={approval}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onOpen={handleOpenEdit}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma aprovação concluída ainda.</p>
                    )}
                </GlassCardContent>
            </GlassCard>

            {clientId && currentUser?.id && (
                <CreateApprovalDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    clientId={clientId}
                    requesterId={currentUser.id}
                />
            )}

            {currentUser?.id && (
                <EditApprovalDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    approval={selectedApproval}
                    currentUserId={currentUser.id}
                />
            )}
        </div>
    );
}
