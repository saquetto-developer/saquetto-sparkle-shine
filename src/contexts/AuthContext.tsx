import React, { createContext, useContext, useEffect, useState } from 'react';

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

// Lista de usuários válidos para autenticação local
const validUsers = [
  { 
    id: '1', 
    email: 'adm@saquetto.com.br', 
    password: 'S@quetto123' 
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('fiscal-audit-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validação local contra usuários válidos
      const validUser = validUsers.find(
        user => user.email === email && user.password === password
      );

      if (!validUser) {
        return { error: 'Credenciais inválidas' };
      }

      const userSession = {
        id: validUser.id,
        email: validUser.email
      };

      setUser(userSession);
      localStorage.setItem('fiscal-audit-user', JSON.stringify(userSession));
      
      return { error: null };
    } catch (error) {
      return { error: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fiscal-audit-user');
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