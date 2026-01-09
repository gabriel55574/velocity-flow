import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, Building2, User } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [portalType, setPortalType] = useState<'agency' | 'client'>('agency');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - will be replaced with Supabase auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao Velocity Agency OS",
      });
      
      if (portalType === 'agency') {
        navigate('/');
      } else {
        navigate('/client/dashboard');
      }
    }, 1000);
  };

  return (
    <AuthLayout>
      <Tabs value={portalType} onValueChange={(v) => setPortalType(v as 'agency' | 'client')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="agency" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Agência
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cliente
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agency">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">Entrar na Agência</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse o painel de controle da sua agência
            </p>
          </div>
        </TabsContent>

        <TabsContent value="client">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">Portal do Cliente</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Aprove conteúdos e acompanhe resultados
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link 
              to="/reset-password" 
              className="text-xs text-primary hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="bg-white/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full button-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Entrar
            </div>
          )}
        </Button>
      </form>

      {portalType === 'agency' && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          Não tem acesso?{" "}
          <span className="text-primary">Fale com o administrador</span>
        </p>
      )}
    </AuthLayout>
  );
}
