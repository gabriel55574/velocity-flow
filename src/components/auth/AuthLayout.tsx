import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <img src="/logo.svg" alt="Velocity Logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold text-foreground">Velocity</span>
          </div>
          <p className="text-sm text-muted-foreground">Agency Operating System</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 Velocity Agency OS. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
