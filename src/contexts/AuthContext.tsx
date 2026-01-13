/**
 * AuthContext
 * 
 * Provides authentication state and methods throughout the app
 */

import { useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/contexts/auth-context';
import type { AuthContextType } from '@/contexts/auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('current_client_id');
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      // reset client selection on new login
      setClientId(null);
      localStorage.removeItem('current_client_id');
    }
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setClientId(null);
    localStorage.removeItem('current_client_id');
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, clientId, setClientId: (id) => {
      setClientId(id);
      if (id) localStorage.setItem('current_client_id', id);
      else localStorage.removeItem('current_client_id');
    }, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export type { AuthContextType };
