// Глобальное состояние авторизации: текущий пользователь, вход, выход.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as api from "../api/client";
import type { Me } from "../api/types";

interface AuthState {
  user: Me | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, fullName: string, password: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  signOut: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  // При старте — пробуем восстановить сессию по сохранённому токену.
  useEffect(() => {
    if (!api.getToken()) {
      setLoading(false);
      return;
    }
    api
      .fetchMe()
      .then(setUser)
      .catch(() => api.setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const token = await api.login(username, password);
    api.setToken(token);
    const me = await api.fetchMe();
    setUser(me);
  }, []);

  const signUp = useCallback(
    async (username: string, fullName: string, password: string) => {
      const token = await api.register(username, fullName, password);
      api.setToken(token);
      const me = await api.fetchMe();
      setUser(me);
    },
    [],
  );

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    const access = await api.resetPassword(token, newPassword);
    api.setToken(access);
    const me = await api.fetchMe();
    setUser(me);
  }, []);

  const signOut = useCallback(() => {
    api.setToken(null);
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => user?.permissions.includes(permission) ?? false,
    [user],
  );

  const value = useMemo<AuthState>(
    () => ({ user, loading, signIn, signUp, resetPassword, signOut, hasPermission }),
    [user, loading, signIn, signUp, resetPassword, signOut, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth должен использоваться внутри <AuthProvider>");
  return ctx;
}
