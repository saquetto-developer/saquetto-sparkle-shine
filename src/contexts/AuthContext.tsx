import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[AuthContext] Error getting session:', error);
          setUser(null);
        } else if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
        }
      } catch (error) {
        console.error('[AuthContext] Unexpected error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth state changed:', event);

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      console.log('[AuthContext] Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('[AuthContext] Login error:', error);
        return {
          error: error.message === 'Invalid login credentials'
            ? 'Credenciais inválidas'
            : error.message
        };
      }

      if (!data.user) {
        return { error: 'Erro ao autenticar usuário' };
      }

      console.log('[AuthContext] Login successful for:', data.user.email);

      setUser({
        id: data.user.id,
        email: data.user.email || ''
      });

      return { error: null };
    } catch (error) {
      console.error('[AuthContext] Unexpected login error:', error);
      return { error: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Logging out...');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}