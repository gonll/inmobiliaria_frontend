import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/AuthContext";
import { authApi } from "../../api/auth";
import { TopNavbar } from "../components/TopNavbar";

export const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTokensAndUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL search params
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const provider = searchParams.get("provider") || "google";

        if (!code) {
          throw new Error("No authorization code received from OAuth provider");
        }

        // Validate state parameter for CSRF protection
        const storedState = sessionStorage.getItem("oauth_state");
        if (state !== storedState) {
          throw new Error("State parameter mismatch - possible CSRF attack");
        }

        // Clear the stored state
        sessionStorage.removeItem("oauth_state");

        // Exchange code for tokens
        const { tokens, user } = await authApi.oauthCallback(provider, code, state || undefined);
        
        // Store in auth context
        setTokensAndUser(tokens, user);

        // Redirect to dashboard
        navigate({ to: "/dashboard" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to complete OAuth login";
        setError(message);
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, setTokensAndUser]);

  if (isProcessing) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "var(--color-bg-primary)",
      }}>
        <TopNavbar />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}>
          <div style={{
            textAlign: "center",
            padding: "var(--space-8)",
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "var(--space-4)",
              animation: "spin 1s linear infinite",
            }}>
              ⏳
            </div>
            <h2 style={{
              color: "var(--color-text-primary)",
              marginBottom: "var(--space-2)",
            }}>
              Procesando tu acceso
            </h2>
            <p style={{
              color: "var(--color-text-secondary)",
            }}>
              Por favor espera mientras completamos tu autenticación...
            </p>
          </div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "var(--color-bg-primary)",
      }}>
        <TopNavbar />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}>
          <div style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-error)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-8)",
            maxWidth: "500px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "var(--space-4)",
            }}>
              ⚠️
            </div>
            <h2 style={{
              color: "var(--color-error)",
              marginBottom: "var(--space-4)",
            }}>
              Error de Autenticación
            </h2>
            <p style={{
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-6)",
            }}>
              {error}
            </p>
            <button
              onClick={() => navigate({ to: "/login" })}
              className="btn btn-primary"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
