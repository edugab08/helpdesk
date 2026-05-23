'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '../lib/api';

type AuthContextType = {
  user: User | null;
  token: string | null;
  carregando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Helpers de cookie (acessíveis pelo middleware no servidor) ───────────────
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('nexsupport_token');
    const savedUser  = localStorage.getItem('nexsupport_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setCarregando(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);

    // Persiste em localStorage (leitura client-side)
    localStorage.setItem('nexsupport_token', data.access_token);
    localStorage.setItem('nexsupport_user', JSON.stringify(data.user));

    // Persiste em cookie (leitura pelo middleware/servidor)
    setCookie('nexsupport_token', data.access_token);

    setToken(data.access_token);
    setUser(data.user);

    router.push('/');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('nexsupport_token');
    localStorage.removeItem('nexsupport_user');
    deleteCookie('nexsupport_token');

    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, carregando, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
