# LegalTech Real Estate Frontend

A production-grade, mobile-first frontend for a B2B LegalTech real-estate platform aimed at professional landlords managing multiple properties and contracts.

**Built with:** React + TypeScript + Vite | Tailwind CSS | Capacitor | React Router | React Hook Form + Zod | TanStack Query

## Project Structure

```
src/
├── api/              # API layer and types
│   ├── auth.ts       # Authentication API client
│   ├── http.ts       # Axios HTTP client with interceptors
│   └── types.ts      # Domain models (Contract, Property, Tenant, etc.)
├── auth/             # Authentication & Authorization
│   ├── AuthContext.tsx    # Auth state context
│   ├── AuthProvider.tsx   # Auth provider with refresh logic
│   └── types.ts           # Auth types (User, Roles)
├── forms/            # Form validation schemas
│   └── schemas.ts    # Zod schemas for all forms
├── hooks/            # TanStack Query hooks
│   ├── useContracts.ts       # Contract queries & mutations
│   ├── usePayments.ts        # Payment queries & mutations
│   ├── useProperties.ts      # Property queries & mutations
│   ├── useTenants.ts         # Tenant queries & mutations
│   ├── useNotices.ts         # Notice queries & mutations
│   ├── useConflictCases.ts   # Conflict/AI mediation
│   └── index.ts              # Centralized exports
├── router/           # TanStack React Router
│   └── index.tsx     # Route definitions
├── shared/           # Shared components & layouts
│   ├── components/   # Reusable UI components
│   │   ├── FormField.tsx
│   │   ├── StatusBadge.tsx
│   │   └── Cards.tsx
│   ├── layouts/      # Global layouts
│   │   └── AppLayout.tsx     # Header + Bottom Nav
│   └── pages/        # Route pages
│       ├── DashboardPage.tsx
│       ├── LoginPage.tsx
│       ├── PaymentsPage.tsx
│       ├── NoticesPage.tsx
│       ├── SettingsPage.tsx
│       ├── ConflictPreventionPage.tsx
│       └── contracts/
│           ├── ContractsListPage.tsx
│           ├── ContractDetailPage.tsx
│           └── ContractCreatePage.tsx
├── index.css         # Global styles & utilities
├── main.tsx          # App entry point
└── router.tsx        # Route setup

```

## Architecture

### Authentication Flow (OAuth 2.0 / OpenID Connect)

1. **Login:** User clicks OAuth provider button or enters email/password
2. **Backend Authorization:** NestJS backend handles OAuth/credential validation
3. **Token Issuance:** Backend returns `accessToken` (JWT) + `refreshToken` (HTTP-only cookie)
4. **Storage:** Access token kept in memory (memory-only, no localStorage)
5. **Auto-Refresh:** On app load, AuthProvider attempts to refresh token
6. **Protected Routes:** Unauthenticated users redirected to `/login`

### Protected Routes

Routes under `/` (dashboard, contracts, etc.) are protected and require authentication:
- If user not authenticated → Redirect to `/login`
- If authentication loading → Show "Verificando sesión segura..."
- If authenticated → Render protected page

### API Integration

All API calls go through TanStack Query hooks in `src/hooks/`:

```tsx
// Contract listing with React Query
import { useContracts } from "@/hooks";

export const ContractsListPage = () => {
  const { data, isLoading, error } = useContracts();
  // ...
};
```

**Key Features:**
- ✅ Automatic caching & revalidation
- ✅ Optimistic updates (e.g., payment registration)
- ✅ Background refetching
- ✅ Error handling aligned with legal workflows (no silent failures)

### Form Handling & Validation

All forms use React Hook Form + Zod for strict validation:

```tsx
import { contractCreateSchema, type ContractCreateSchema } from "@/forms/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ContractForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ContractCreateSchema>({
    resolver: zodResolver(contractCreateSchema),
  });
  // ...
};
```

**Validation Includes:**
- Required fields (legal strictness)
- Date ranges & constraints
- Numeric validations
- Custom error messages in Spanish

### Domain Models

#### Contract
```ts
interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  status: "draft" | "pending_signature" | "signed" | "active" | "expired" | "terminated";
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  property: Property;
  tenant: Tenant;
}
```

#### Payment
```ts
interface Payment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "overdue" | "paid" | "partial" | "cancelled";
  month: number;
  year: number;
}
```

#### Notice (Pre-legal Actions)
```ts
interface Notice {
  id: string;
  contractId: string;
  type: "lease_expiration" | "payment_default" | "maintenance_request" | "contract_violation" | "rent_increase";
  title: string;
  description: string;
  status: "pending" | "acknowledged" | "resolved" | "escalated";
}
```

#### ConflictCase (AI Mediation)
```ts
interface ConflictCase {
  id: string;
  contractId: string;
  severity: "low" | "medium" | "high";
  status: "detected" | "in_mediation" | "escalated" | "resolved";
  aiAnalysis?: string;
  recommendedActions?: string[];
}
```

## Backend API Specification

### Expected Endpoints

The frontend expects the following REST API endpoints (assume `/api/v1` base URL):

#### Authentication
```
POST   /auth/login                  # Email/password login
POST   /auth/oauth/authorize        # OAuth callback handler
POST   /auth/refresh               # Refresh access token
POST   /auth/logout                # Logout (invalidate tokens)
GET    /auth/me                    # Get current user
```

#### Contracts
```
GET    /contracts                  # List contracts (paginated)
GET    /contracts/:contractId      # Get contract details
POST   /contracts                  # Create contract
PATCH  /contracts/:contractId      # Update contract
DELETE /contracts/:contractId      # Delete/terminate contract
```

#### Payments
```
GET    /payments                   # List payments (filterable by status, contract)
POST   /payments                   # Register payment
PATCH  /payments/:paymentId        # Update payment status
GET    /payments/:paymentId        # Get payment details
```

#### Properties
```
GET    /properties                 # List properties
GET    /properties/:propertyId     # Get property details
POST   /properties                 # Create property
PATCH  /properties/:propertyId     # Update property
```

#### Tenants
```
GET    /tenants                    # List tenants (searchable)
GET    /tenants/:tenantId          # Get tenant details
POST   /tenants                    # Create tenant
PATCH  /tenants/:tenantId          # Update tenant
```

#### Notices
```
GET    /notices                    # List notices (filterable)
GET    /notices/:noticeId          # Get notice details
POST   /notices                    # Create notice
PATCH  /notices/:noticeId          # Update notice status
```

#### Conflict Cases & AI Mediation
```
GET    /conflicts                  # List detected conflicts/cases
GET    /conflicts/:caseId          # Get case details
POST   /conflicts/analyze/:contractId  # Trigger AI analysis
PATCH  /conflicts/:caseId          # Update case status (resolve/escalate)
```

#### Auditing
```
GET    /audits                     # Audit log listing
GET    /audits/:entityType/:entityId  # Audits for specific entity
```

### Response Format

All endpoints should return JSON with standardized structure:

```ts
// Successful single resource response
{
  id: string;
  // ... resource fields
}

// Paginated response
{
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error response
{
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### Authentication Headers

```
Authorization: Bearer {accessToken}
```

Access tokens are automatically added by the axios interceptor in `src/api/http.ts`.

### Refresh Token Flow

1. Access token expires (JWT)
2. Axios interceptor detects 401
3. Backend is called to refresh (automatic via cookie)
4. New access token is returned and stored in memory
5. Original request is retried

## Environment Variables

Create `.env` or set via CI/CD:

```env
# Backend API
VITE_API_URL=https://api.example.com/api/v1

# OAuth Configuration
VITE_OAUTH_BASE_URL=https://oauth.example.com
```

## Features Implemented

### Pages
- ✅ **Login Page:** OAuth + email/password, professional legal-grade UI
- ✅ **Dashboard:** Multi-property overview, KPIs, quick actions, recent activity
- ✅ **Contracts:** List view, detail view, guided creation stepper
- ✅ **Payments:** Payment tracking, collection management, overdue alerts
- ✅ **Notices:** Pre-legal action management, legal notices
- ✅ **Conflict Prevention:** AI-powered risk detection with recommendations
- ✅ **Settings:** Profile, security, notifications, integrations, data privacy

### UI Components
- ✅ **StatusBadge:** Visual status indicators (paid, pending, overdue, signed, disputed, etc.)
- ✅ **PropertyCard:** Property overview cards
- ✅ **ContractCard:** Contract overview with expiration warnings
- ✅ **FormField:** Reusable form input wrapper with validation
- ✅ **Bottom Navigation:** Mobile-first navigation bar
- ✅ **Header:** User info + logout button

### Technical Features
- ✅ **OAuth 2.0 / OpenID Connect** authentication with JWT
- ✅ **Role-based access control** (landlord, admin, legal)
- ✅ **Protected routes** with auto-redirect
- ✅ **TanStack Query** for server state management
- ✅ **Form validation** with React Hook Form + Zod
- ✅ **Type-safe API client** with typed responses
- ✅ **Responsive design** (mobile-first, Tailwind CSS)
- ✅ **Error handling** aligned with legal workflows
- ✅ **Capacitor ready** for iOS/Android packaging

## Development

### Install Dependencies
```bash
pnpm install
```

### Start Dev Server
```bash
npm run dev
```

Runs on `http://localhost:5173`

### Build
```bash
npm run build
```

### Type Checking
```bash
npm run lint
```

## Capacitor Integration

### Prepare for Native Build
```bash
npm run cap:sync
```

### Open iOS Project
```bash
npm run cap:ios
```

### Open Android Project
```bash
npm run cap:android
```

The app is configured to work as a native iOS/Android app via Capacitor, with:
- Environment-aware routing (no SPA history issues)
- Placeholder hooks for native plugins (biometric unlock, file storage)
- Full API communication via HTTP (native networking)

## Design System

### Colors
- **Brand:** `#4f57ff` (primary blue)
- **Background:** `#020617` (dark navy)
- **Surface:** `#030712` (elevated dark)
- **Border:** `#1e293b` (subtle gray)
- **Status Colors:**
  - Paid/Signed: Green
  - Overdue/Disputed: Red
  - Pending: Gray
  - Warning: Amber

### Typography
- **Font:** System UI sans-serif
- **Headings:** Large, bold, high contrast
- **Body:** Clear hierarchy, high readability

### Layout
- **Mobile-first:** Optimized for phone/tablet
- **Bottom Navigation:** Easy thumb-reach access
- **Cards:** Consistent spacing and shadows
- **Inputs:** Large touch targets

## Security Considerations

1. **Tokens:** Access token in memory only (no localStorage)
2. **Refresh Token:** HTTP-only cookie (backend manages)
3. **XSS Prevention:** React escapes by default
4. **CSRF:** Handled by backend (refresh token as cookie)
5. **Audit Logging:** All actions logged server-side
6. **Data Privacy:** GDPR compliance ready (download data, audit logs)

## Legal Compliance

This platform is designed for legal-grade reliability:
- ✅ Audit trails for all actions
- ✅ Explicit error handling (no silent failures)
- ✅ Legal-strict form validation
- ✅ Status transparency (clear state indicators)
- ✅ Data governance & privacy controls

## Future Enhancements

- [ ] Contract versioning & signature workflows
- [ ] Document storage & management (Capacitor file plugin)
- [ ] Biometric unlock (Capacitor biometric plugin)
- [ ] Offline-first caching (Service Worker + IndexedDB)
- [ ] Advanced search & filtering
- [ ] Payment automation & integrations (Stripe, etc.)
- [ ] Automated reminders & escalation workflows
- [ ] Multi-language support
- [ ] E-signature integration (DocuSign, etc.)
- [ ] Tenant portal (view contracts, pay rent)

## Support

For integration questions or issues, refer to:
- Backend API documentation
- Zod schema definitions in `src/forms/schemas.ts`
- TanStack Query docs: https://tanstack.com/query
- React Hook Form docs: https://react-hook-form.com
- TanStack Router docs: https://tanstack.com/router
