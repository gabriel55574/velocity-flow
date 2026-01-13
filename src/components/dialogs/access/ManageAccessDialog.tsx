import { useState } from "react";
import type { ElementType } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, ShieldHalf, Shield } from "lucide-react";
import { useClientUsers, useRevokeClientAccess, useUpdateClientAccessRole } from "@/hooks/useClientAccess";
import type { Database } from "@/types/database";
import { GrantAccessDialog } from "./GrantAccessDialog";

type ClientUserRole = Database["public"]["Enums"]["client_user_role"];
type AccessWithUser = Database["public"]["Tables"]["clients_users"]["Row"] & {
    user?: Database["public"]["Tables"]["users_profile"]["Row"] | null;
};

interface ManageAccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    agencyId: string;
}

const ROLE_LABEL: Record<ClientUserRole, { label: string; icon: ElementType }> = {
    admin: { label: "Administrador", icon: ShieldCheck },
    editor: { label: "Editor", icon: ShieldHalf },
    viewer: { label: "Visualizador", icon: Shield },
};

export function ManageAccessDialog({ open, onOpenChange, clientId, agencyId }: ManageAccessDialogProps) {
    const { data: accesses, isLoading, error } = useClientUsers(clientId);
    const updateRole = useUpdateClientAccessRole();
    const revokeAccess = useRevokeClientAccess();
    const [grantOpen, setGrantOpen] = useState(false);

    const handleRoleChange = async (id: string, role: ClientUserRole) => {
        await updateRole.mutateAsync({ id, role });
    };

    const handleRevoke = async (id: string) => {
        const confirmed = window.confirm("Revogar o acesso deste usuário?");
        if (!confirmed) return;
        await revokeAccess.mutateAsync(id);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[620px]">
                    <DialogHeader>
                        <DialogTitle>Gerenciar Acessos do Cliente</DialogTitle>
                        <DialogDescription>
                            Conceda, altere permissões ou revogue acessos ao portal deste cliente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end">
                        <Button size="sm" onClick={() => setGrantOpen(true)}>
                            Conceder acesso
                        </Button>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando acessos...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
                            Erro ao carregar acessos. Tente novamente.
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="space-y-3">
                            {accesses && accesses.length > 0 ? (
                                (accesses as AccessWithUser[]).map((access) => {
                                    const role = (access.role as ClientUserRole) || "viewer";
                                    const user = access.user || {};
                                    const Icon = ROLE_LABEL[role]?.icon || Shield;
                                    return (
                                        <div
                                            key={access.id}
                                            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>
                                                        {user.full_name?.substring(0, 2)?.toUpperCase() || "US"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">
                                                        {user.full_name || "Usuário"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {user.email || "sem email"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                                                <Badge variant="secondary" className="gap-1">
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {ROLE_LABEL[role]?.label || role}
                                                </Badge>

                                                <Select
                                                    value={role}
                                                    onValueChange={(value) => handleRoleChange(access.id, value as ClientUserRole)}
                                                >
                                                    <SelectTrigger className="h-9 w-[150px]">
                                                        <SelectValue placeholder="Permissão" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="viewer">Visualizador</SelectItem>
                                                        <SelectItem value="editor">Editor</SelectItem>
                                                        <SelectItem value="admin">Administrador</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={() => handleRevoke(access.id)}
                                                >
                                                    Revogar
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 text-center text-muted-foreground rounded-xl border border-dashed">
                                    Nenhum usuário com acesso. Conceda acesso para começar.
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <GrantAccessDialog
                open={grantOpen}
                onOpenChange={setGrantOpen}
                clientId={clientId}
                agencyId={agencyId}
            />
        </>
    );
}
