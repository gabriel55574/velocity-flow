import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Building2, Palette, Plug, Shield, Plus, Edit, Trash2, Check, X, Moon, Sun } from "lucide-react";
import { mockUsers } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const roleLabels: Record<string, string> = {
  admin: 'Administrador', cs: 'Customer Success', editor: 'Editor de Conteúdo', media: 'Media Buyer', analyst: 'Analista', viewer: 'Visualizador',
};

const integrations = [
  { id: 'n8n', name: 'n8n', description: 'Automações e workflows', status: 'connected', icon: '⚡' },
  { id: 'meta', name: 'Meta Business', description: 'Facebook e Instagram Ads', status: 'connected', icon: '📘' },
  { id: 'google', name: 'Google Ads', description: 'Campanhas de pesquisa', status: 'pending', icon: '🔍' },
  { id: 'supabase', name: 'Supabase', description: 'Banco de dados', status: 'connected', icon: '🗄️' },
  { id: 'whatsapp', name: 'WhatsApp API', description: 'Mensagens automatizadas', status: 'disconnected', icon: '💬' },
];

export default function Settings() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  const handleInvite = () => {
    toast({ title: "Convite enviado! 📧", description: `Um email foi enviado para ${inviteEmail}` });
    setInviteDialogOpen(false);
    setInviteEmail('');
  };

  return (
    <AppLayout>
      <PageHeader title="Configurações" subtitle="Gerencie sua agência" />

      <div className="p-4 md:p-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" />Usuários</TabsTrigger>
            <TabsTrigger value="agency" className="gap-2"><Building2 className="h-4 w-4" />Agência</TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" />Aparência</TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2"><Plug className="h-4 w-4" />Integrações</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" />Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-lg font-semibold">Equipe</h2><p className="text-sm text-muted-foreground">Gerencie os membros da sua agência</p></div>
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild><Button className="button-primary gap-2"><Plus className="h-4 w-4" />Convidar</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Convidar Membro</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="email@exemplo.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Função</Label><Select value={inviteRole} onValueChange={setInviteRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(roleLabels).map(([key, label]) => (<SelectItem key={key} value={key}>{label}</SelectItem>))}</SelectContent></Select></div>
                    <Button className="w-full button-primary" onClick={handleInvite}>Enviar Convite</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <GlassCard>
              <GlassCardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex flex-col gap-3 p-4 hover:bg-muted/30 transition-colors sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span></div>
                        <div><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <Badge variant="secondary">{roleLabels[user.role]}</Badge>
                        <Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-risk hover:text-risk"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="agency" className="space-y-6">
            <GlassCard>
              <GlassCardHeader><GlassCardTitle>Dados da Agência</GlassCardTitle></GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"><span className="text-white font-bold text-3xl">V</span></div>
                  <div><Button variant="outline">Alterar Logo</Button><p className="text-xs text-muted-foreground mt-2">PNG ou JPG, máximo 2MB</p></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="agencyName">Nome da Agência</Label><Input id="agencyName" defaultValue="Velocity" /></div>
                  <div className="space-y-2"><Label htmlFor="agencyEmail">Email de Contato</Label><Input id="agencyEmail" type="email" defaultValue="contato@velocity.com" /></div>
                  <div className="space-y-2"><Label htmlFor="agencyPhone">Telefone</Label><Input id="agencyPhone" defaultValue="(11) 99999-0000" /></div>
                  <div className="space-y-2"><Label htmlFor="agencyWebsite">Website</Label><Input id="agencyWebsite" defaultValue="https://velocity.com" /></div>
                </div>
                <Button className="button-primary">Salvar Alterações</Button>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <GlassCard>
              <GlassCardHeader><GlassCardTitle>Tema</GlassCardTitle></GlassCardHeader>
              <GlassCardContent className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">{darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}<div><p className="font-medium">Modo Escuro</p><p className="text-sm text-muted-foreground">Alterna entre tema claro e escuro</p></div></div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </GlassCardContent>
            </GlassCard>
            <GlassCard>
              <GlassCardHeader><GlassCardTitle>Cor Primária</GlassCardTitle></GlassCardHeader>
              <GlassCardContent>
                <div className="flex flex-wrap gap-3">
                  {[{ name: 'Azul', color: 'bg-blue-500' }, { name: 'Verde', color: 'bg-green-500' }, { name: 'Roxo', color: 'bg-purple-500' }, { name: 'Rosa', color: 'bg-pink-500' }, { name: 'Laranja', color: 'bg-orange-500' }].map((c) => (
                    <button key={c.name} className={cn("w-10 h-10 rounded-lg transition-transform hover:scale-110 ring-2 ring-transparent", c.color, c.name === 'Azul' && "ring-primary ring-offset-2")} title={c.name} />
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div><h2 className="text-lg font-semibold">Integrações</h2><p className="text-sm text-muted-foreground">Conecte suas ferramentas externas</p></div>
            <div className="grid md:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <GlassCard key={integration.id}>
                  <GlassCardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center text-2xl">{integration.icon}</div>
                        <div><h3 className="font-medium">{integration.name}</h3><p className="text-sm text-muted-foreground">{integration.description}</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integration.status === 'connected' && <Badge className="bg-ok/10 text-ok border-ok/20"><Check className="h-3 w-3 mr-1" />Conectado</Badge>}
                        {integration.status === 'pending' && <Badge className="bg-warn/10 text-warn border-warn/20">Pendente</Badge>}
                        {integration.status === 'disconnected' && <Badge variant="outline"><X className="h-3 w-3 mr-1" />Desconectado</Badge>}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      {integration.status === 'connected' ? (<><Button variant="outline" size="sm" className="flex-1">Configurar</Button><Button variant="outline" size="sm" className="text-risk hover:text-risk">Desconectar</Button></>) : (<Button className="flex-1 button-primary" size="sm">Conectar</Button>)}
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <GlassCard>
              <GlassCardHeader><GlassCardTitle>Autenticação em Duas Etapas</GlassCardTitle></GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">2FA via Aplicativo</p><p className="text-sm text-muted-foreground">Use Google Authenticator ou similar</p></div><Switch /></div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">2FA via SMS</p><p className="text-sm text-muted-foreground">Receba código por mensagem de texto</p></div><Switch /></div>
              </GlassCardContent>
            </GlassCard>
            <GlassCard>
              <GlassCardHeader><GlassCardTitle>Sessões Ativas</GlassCardTitle></GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  {[{ device: 'Chrome - Windows', location: 'São Paulo, BR', current: true }, { device: 'Safari - iPhone', location: 'São Paulo, BR', current: false }].map((session, idx) => (
                    <div key={idx} className="flex flex-col gap-3 rounded-lg bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><p className="font-medium text-sm flex items-center gap-2">{session.device}{session.current && <Badge variant="secondary" className="text-xs">Atual</Badge>}</p><p className="text-xs text-muted-foreground">{session.location}</p></div>
                      {!session.current && <Button variant="ghost" size="sm" className="text-risk">Encerrar</Button>}
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
            <GlassCard>
              <GlassCardHeader><GlassCardTitle>Alterar Senha</GlassCardTitle></GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="currentPassword">Senha Atual</Label><Input id="currentPassword" type="password" /></div>
                <div className="space-y-2"><Label htmlFor="newPassword">Nova Senha</Label><Input id="newPassword" type="password" /></div>
                <div className="space-y-2"><Label htmlFor="confirmPassword">Confirmar Nova Senha</Label><Input id="confirmPassword" type="password" /></div>
                <Button className="button-primary">Alterar Senha</Button>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
