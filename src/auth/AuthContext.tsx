import React, { createContext, useContext } from "react";
import type { AuthState, AuthTokens, AuthUser, UserRole } from "./types";

export interface AuthContextValue extends AuthState {
  loginWithOAuth: (provider: "google" | "microsoft" | "github") => void;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  setTokensAndUser: (tokens: AuthTokens, user: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

