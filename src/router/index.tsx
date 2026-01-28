import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { AppLayout } from "../shared/layouts/AppLayout";
import { LoginPage } from "../shared/pages/LoginPage";
import { DashboardPage } from "../shared/pages/DashboardPage";
import { ContractsListPage } from "../shared/pages/contracts/ContractsListPage";
import { ContractDetailPage } from "../shared/pages/contracts/ContractDetailPage";
import { ContractCreatePage } from "../shared/pages/contracts/ContractCreatePage";
import { PaymentsPage } from "../shared/pages/PaymentsPage";
import { NoticesPage } from "../shared/pages/NoticesPage";
import { ConflictPreventionPage } from "../shared/pages/ConflictPreventionPage";
import { SettingsPage } from "../shared/pages/SettingsPage";

const RootComponent: React.FC = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

const rootRoute = createRootRoute({
  component: RootComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: async ({ context }) => {
    const { user, isLoading } = context.auth;
    // Wait for auth to finish loading
    let attempts = 0;
    while (isLoading && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    if (!context.auth.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => {
    const { isLoading } = useAuth();
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          Verificando sesión segura...
        </div>
      );
    }
    return <Outlet />;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: DashboardPage,
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
  loginRoute,
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
