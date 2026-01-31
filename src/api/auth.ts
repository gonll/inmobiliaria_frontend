import { z } from "zod";
import { http, setAccessToken } from "./http";
import type { AuthTokens, AuthUser } from "../auth/types";

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    roles: z.array(z.string()),
    defaultRole: z.string(),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const authApi = {
  async loginWithEmailPassword(
    email: string,
    password: string,
  ): Promise<{ tokens: AuthTokens; user: AuthUser }> {
    const res = await http.post("/auth/login", { email, password });
    const parsed = loginResponseSchema.parse(res.data);
    const tokens: AuthTokens = { accessToken: parsed.accessToken };
    const user: AuthUser = {
      id: parsed.user.id,
      email: parsed.user.email,
      fullName: parsed.user.fullName,
      roles: parsed.user.roles as AuthUser["roles"],
      defaultRole: parsed.user.defaultRole as AuthUser["defaultRole"],
    };
    setAccessToken(tokens.accessToken);
    return { tokens, user };
  },

  async me(): Promise<AuthUser> {
    const res = await http.get("/auth/me");
    const parsed = loginResponseSchema
      .pick({ user: true })
      .parse({ user: res.data });
    return {
      id: parsed.user.id,
      email: parsed.user.email,
      fullName: parsed.user.fullName,
      roles: parsed.user.roles as AuthUser["roles"],
      defaultRole: parsed.user.defaultRole as AuthUser["defaultRole"],
    };
  },

  async refresh(): Promise<AuthTokens> {
    const res = await http.post("/auth/refresh");
    const parsed = loginResponseSchema.pick({ accessToken: true }).parse(res.data);
    const tokens: AuthTokens = { accessToken: parsed.accessToken };
    setAccessToken(tokens.accessToken);
    return tokens;
  },

  async logout(): Promise<void> {
    await http.post("/auth/logout");
    setAccessToken(null);
  },

  async oauthCallback(provider: string, code: string, state?: string): Promise<{ tokens: AuthTokens; user: AuthUser }> {
    const params: Record<string, string> = { code };
    if (state) params.state = state;

    const res = await http.post(`/auth/${provider}/callback`, params);
    const parsed = loginResponseSchema.parse(res.data);
    const tokens: AuthTokens = { accessToken: parsed.accessToken };
    const user: AuthUser = {
      id: parsed.user.id,
      email: parsed.user.email,
      fullName: parsed.user.fullName,
      roles: parsed.user.roles as AuthUser["roles"],
      defaultRole: parsed.user.defaultRole as AuthUser["defaultRole"],
    };
    setAccessToken(tokens.accessToken);
    return { tokens, user };
  },
};
