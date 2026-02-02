import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { AppLayout } from "../shared/layouts/AppLayout";
import { LandingPage } from "../shared/pages/LandingPage";
import { LoginPage } from "../shared/pages/LoginPage";
import { OAuthCallbackPage } from "../shared/pages/OAuthCallbackPage";
import { GoogleOAuthPage } from "../shared/pages/auth/GoogleOAuthPage";
import { MicrosoftOAuthPage } from "../shared/pages/auth/MicrosoftOAuthPage";
import { DashboardPage } from "../shared/pages/DashboardPage";
import { BuildingsPage } from "../shared/pages/BuildingsPage";
import { ContractsListPage } from "../shared/pages/contracts/ContractsListPage";
import { ContractDetailPage } from "../shared/pages/contracts/ContractDetailPage";
import { ContractCreatePage } from "../shared/pages/contracts/ContractCreatePage";
import { PaymentsPage } from "../shared/pages/PaymentsPage";
import { NoticesPage } from "../shared/pages/NoticesPage";
import { ConflictPreventionPage } from "../shared/pages/ConflictPreventionPage";
import { SettingsPage } from "../shared/pages/SettingsPage";

const RootComponent: React.FC = () => {
  return <Outlet />;
};

const rootRoute = createRootRoute({
  component: RootComponent,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: OAuthCallbackPage,
});

const googleOAuthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/google",
  component: GoogleOAuthPage,
});

const microsoftOAuthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/microsoft",
  component: MicrosoftOAuthPage,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app-layout",
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const protectedRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  id: "protected",
  component: ProtectedRouteComponent,
});

function ProtectedRouteComponent() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--font-size-sm)",
        color: "var(--color-text-tertiary)",
      }}>
        Verificando sesión segura...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
}

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const buildingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/buildings",
  component: BuildingsPage,
});

const contractsListRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/contracts",
  component: ContractsListPage,
});

const contractDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/contracts/$contractId",
  component: ContractDetailPage,
});

const contractCreateRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/contracts/new",
  component: ContractCreatePage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/payments",
  component: PaymentsPage,
});

const noticesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/notices",
  component: NoticesPage,
});

const conflictPreventionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/conflict-prevention",
  component: ConflictPreventionPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  oauthCallbackRoute,
  googleOAuthRoute,
  microsoftOAuthRoute,
  appLayoutRoute.addChildren([
    protectedRoute.addChildren([
      dashboardRoute,
      contractsListRoute,
      contractDetailRoute,
      contractCreateRoute,
      paymentsRoute,
      noticesRoute,
      conflictPreventionRoute,
      settingsRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
