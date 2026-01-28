import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthState, AuthTokens, AuthUser, UserRole } from "./types";
import { authApi } from "../api/auth";
import { setAccessToken } from "../api/http";

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(initialState);

  const setTokensAndUser = useCallback((tokens: AuthTokens, user: AuthUser) => {
    setAccessToken(tokens.accessToken);
    setState({
      user,
      tokens,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setState({
        user: null,
        tokens: null,
        isLoading: false,
      });
    }
  }, []);

  const loginWithOAuth = useCallback(
    (provider: "google" | "microsoft" | "github") => {
      // In a real app this would redirect to the OAuth authorization URL.
      const base = import.meta.env.VITE_OAUTH_BASE_URL ?? "";
      window.location.href = `${base}/auth/${provider}`;
    },
    [],
  );

  const loginWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      const { tokens, user } = await authApi.loginWithEmailPassword(
        email,
        password,
      );
      setTokensAndUser(tokens, user);
    },
    [setTokensAndUser],
  );

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!state.user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.some((r) => state.user?.roles.includes(r));
    },
    [state.user],
  );

  // Initial bootstrap: try refresh -> me
  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      try {
        const tokens = await authApi.refresh();
        const user = await authApi.me();
        if (!cancelled) {
          setTokensAndUser(tokens, user);
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setTokensAndUser]);

  const value = useMemo(
    () => ({
      ...state,
      loginWithOAuth,
      loginWithEmailPassword,
      logout,
      hasRole,
      setTokensAndUser,
    }),
    [state, loginWithOAuth, loginWithEmailPassword, logout, hasRole, setTokensAndUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

