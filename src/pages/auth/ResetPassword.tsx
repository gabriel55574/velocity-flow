import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound, Check } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Step = 'request' | 'sent' | 'reset';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setStep('sent');
    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada para redefinir a senha.",
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirm) {
      toast({
        title: "Senhas não conferem",
        description: "Digite a mesma senha nos dois campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: passwords.password });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao redefinir",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Senha redefinida!",
      description: "Você já pode fazer login com a nova senha",
    });
    navigate('/login');
  };

  return (
    <AuthLayout>
      {step === 'request' && (
        <>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Recuperar Senha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enviaremos um link para redefinir sua senha
            </p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full button-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                "Enviar link de recuperação"
              )}
            </Button>
          </form>

          <Link 
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </>
      )}

      {step === 'sent' && (
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-ok/10 flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-ok" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Email Enviado!</h1>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Enviamos um link de recuperação para <strong>{email}</strong>. 
            Verifique sua caixa de entrada e spam.
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setStep('reset')}
            >
              Já tenho o código (demo)
            </Button>
            
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      )}

      {step === 'reset' && (
        <>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Nova Senha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Digite sua nova senha
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={passwords.password}
                onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                required
                className="bg-white/50"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar Senha</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
                className="bg-white/50"
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full button-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redefinindo...
                </div>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </form>

          <Link 
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </>
      )}
    </AuthLayout>
  );
}
