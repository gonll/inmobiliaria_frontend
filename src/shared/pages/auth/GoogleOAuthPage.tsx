import React, { useEffect } from "react";
import { TopNavbar } from "../../components/TopNavbar";

/**
 * Google OAuth Initiation Page
 * 
 * This page generates the OAuth authorization request and redirects to Google's
 * login page. It handles:
 * 1. Generating a random state parameter for CSRF protection
 * 2. Storing state in sessionStorage
 * 3. Redirecting to Google's OAuth authorization endpoint
 * 4. After user logs in, Google redirects back to /auth/callback
 */
export const GoogleOAuthPage: React.FC = () => {
  useEffect(() => {
    // Generate random state for CSRF protection
    const state = generateRandomState();
    sessionStorage.setItem("oauth_state", state);

    // Get the Google Client ID from environment
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is not configured");
      return;
    }

    // Build the authorization URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${window.location.origin}/auth/callback?provider=google`,
      response_type: "code",
      scope: "openid profile email",
      state,
    });

    // Redirect to Google's OAuth endpoint
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

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
            Redirigiendo a Google
          </h2>
          <p style={{
            color: "var(--color-text-secondary)",
          }}>
            Te estamos redirigiendo a tu cuenta de Google...
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
};

/**
 * Generate a random state parameter for OAuth CSRF protection
 */
function generateRandomState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
