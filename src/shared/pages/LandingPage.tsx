import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { TopNavbar } from "../components/TopNavbar";

type AuthFlow = "landing" | "signin" | "register";

export const LandingPage: React.FC = () => {
  const [flow, setFlow] = useState<AuthFlow>("landing");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopNavbar />
      <div style={{ flex: 1 }}>
        {flow === "landing" && (
          <LandingContent onSignIn={() => setFlow("signin")} onRegister={() => setFlow("register")} />
        )}
        {flow === "signin" && <SignInContent onBack={() => setFlow("landing")} />}
        {flow === "register" && <RegisterContent onBack={() => setFlow("landing")} />}
      </div>
    </div>
  );
};

interface LandingContentProps {
  onSignIn: () => void;
  onRegister: () => void;
}

const LandingContent: React.FC<LandingContentProps> = ({ onSignIn, onRegister }) => {
  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-badge">Plataforma Jurídica Profesional</div>
        
        <h1 className="hero-title">Gestión Integral de Carteras Inmobiliarias</h1>
        
        <p className="hero-subtitle">
          Automatiza la administración de contratos, cobros y prevención de conflictos 
          en tu cartera de propiedades. Diseñado para profesionales inmobiliarios que 
          requieren máxima precisión legal y eficiencia operativa.
        </p>

        <div className="auth-buttons">
          <button
            onClick={onSignIn}
            className="btn btn-primary btn-lg btn-block"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onRegister}
            className="btn btn-outline btn-lg btn-block"
          >
            Crear Cuenta
          </button>
        </div>

        <div style={{ marginTop: "var(--space-12)" }}>
          <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--space-6)" }}>
            Características Principales
          </h3>
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-4)",
            textAlign: "left"
          }}>
            <Feature icon="📋" title="Gestión de Contratos" description="Crear, firmar y administrar contratos con trazabilidad completa" />
            <Feature icon="💰" title="Control de Pagos" description="Monitoreo de cobros, alertas de morosidad y reportes" />
            <Feature icon="⚖️" title="Prevención Legal" description="Avisos automatizados y gestión de acciones legales" />
            <Feature icon="🤖" title="IA para Mediación" description="Análisis inteligente de riesgos y recomendaciones" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface SignInContentProps {
  onBack: () => void;
}

const SignInContent: React.FC<SignInContentProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOAuthSignIn = (provider: "google" | "microsoft") => {
    const base = import.meta.env.VITE_OAUTH_BASE_URL ?? "";
    window.location.href = `${base}/auth/${provider}`;
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-header">
          <h1 className="auth-header-title">Bienvenido de Vuelta</h1>
          <p className="auth-header-subtitle">Accede a tu cartera inmobiliaria</p>
        </div>

        <div className="oauth-buttons">
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="oauth-button"
          >
            <span>🔵</span>
            Continuar con Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("microsoft")}
            className="oauth-button"
          >
            <span>☁️</span>
            Continuar con Microsoft 365
          </button>
        </div>

        <div className="divider">o continúa con correo</div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@empresa.es"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="form-help">
              Usa el correo asociado a tu mandato de gestión o poder de representación
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="form-help">
              No compartas tus credenciales. El acceso queda registrado para auditoría
            </span>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Entrar en la Plataforma
          </button>
        </form>

        <a href="#forgot" className="back-link" style={{ display: "block", textAlign: "center" }}>
          ¿Olvidaste tu contraseña?
        </a>

        <button
          onClick={onBack}
          className="back-link"
        >
          ← Volver
        </button>

        <p
          style={{
            marginTop: "var(--space-8)",
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-tertiary)",
            lineHeight: 1.5,
            textAlign: "center"
          }}
        >
          El acceso y uso de la plataforma implica la aceptación de los términos de uso,
          política de privacidad y confidencialidad.
        </p>
      </div>
    </div>
  );
};

interface RegisterContentProps {
  onBack: () => void;
}

const RegisterContent: React.FC<RegisterContentProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const handleOAuthSignUp = (provider: "google" | "microsoft") => {
    const base = import.meta.env.VITE_OAUTH_BASE_URL ?? "";
    window.location.href = `${base}/auth/${provider}?signup=true`;
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-header">
          <h1 className="auth-header-title">Crear Cuenta</h1>
          <p className="auth-header-subtitle">Únete a nuestra plataforma</p>
        </div>

        <div className="oauth-buttons">
          <button
            onClick={() => handleOAuthSignUp("google")}
            className="oauth-button"
          >
            <span>🔵</span>
            Registrarse con Google
          </button>
          <button
            onClick={() => handleOAuthSignUp("microsoft")}
            className="oauth-button"
          >
            <span>☁️</span>
            Registrarse con Microsoft 365
          </button>
        </div>

        <div className="divider">o completa el formulario</div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo</label>
            <input
              id="fullName"
              type="text"
              placeholder="Juan García López"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Empresa / Razón Social</label>
            <input
              id="companyName"
              type="text"
              placeholder="Mi Inmobiliaria S.L."
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signupEmail">Correo Electrónico</label>
            <input
              id="signupEmail"
              type="email"
              placeholder="tu@empresa.es"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signupPassword">Contraseña</label>
            <input
              id="signupPassword"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <span className="form-help">
              Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Crear Cuenta
          </button>
        </form>

        <div style={{
          marginTop: "var(--space-6)",
          padding: "var(--space-4)",
          backgroundColor: "var(--color-bg-tertiary)",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6
        }}>
          <p>
            Al registrarte, aceptas nuestros <a href="#terms">términos de uso</a>,
            <a href="#privacy"> política de privacidad</a> y 
            <a href="#cookies"> uso de cookies</a>.
          </p>
        </div>

        <button
          onClick={onBack}
          className="back-link"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div style={{
    display: "flex",
    gap: "var(--space-4)",
    padding: "var(--space-4)",
    backgroundColor: "var(--color-bg-secondary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-light)"
  }}>
    <span style={{ fontSize: "1.5rem" }}>{icon}</span>
    <div>
      <h4 style={{
        fontWeight: "var(--font-weight-semibold)",
        marginBottom: "var(--space-1)",
        color: "var(--color-text-primary)"
      }}>
        {title}
      </h4>
      <p style={{
        margin: 0,
        fontSize: "var(--font-size-sm)",
        color: "var(--color-text-secondary)"
      }}>
        {description}
      </p>
    </div>
  </div>
);
