export type UserRole = "landlord" | "admin" | "legal";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  defaultRole: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  // Refresh token assumed as HTTP-only cookie managed by backend.
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
}

