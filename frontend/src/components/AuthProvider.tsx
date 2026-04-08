import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { fetchMe, login, signup } from "../api";
import type { User, UserRole } from "../types";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem("resume-match-token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        setUser(null);
        window.localStorage.removeItem("resume-match-token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const persist = (nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    window.localStorage.setItem("resume-match-token", nextToken);
  };

  const value: AuthContextValue = {
    token,
    user,
    loading,
    signIn: async (email, password) => {
      const response = await login({ email, password });
      persist(response.access_token, response.user);
    },
    signUp: async (fullName, email, password, role) => {
      const response = await signup({ full_name: fullName, email, password, role });
      persist(response.access_token, response.user);
    },
    logout: () => {
      setToken(null);
      setUser(null);
      window.localStorage.removeItem("resume-match-token");
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
