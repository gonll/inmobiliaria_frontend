# Development Guide

This guide explains how to extend and maintain the LegalTech Real Estate frontend.

## Adding a New Feature

### 1. Define Domain Model

Add your model to `src/api/types.ts`:

```ts
export interface MyNewEntity {
  id: string;
  name: string;
  // ... other fields
  createdAt: string;
}
```

### 2. Create Form Schema

Add validation schema to `src/forms/schemas.ts`:

```ts
export const myNewEntitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  // ... other validations
});

export type MyNewEntitySchema = z.infer<typeof myNewEntitySchema>;
```

### 3. Create TanStack Query Hook

Create `src/hooks/useMyNewEntity.ts`:

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { MyNewEntity } from "../api/types";
import { myNewEntitySchema, type MyNewEntitySchema } from "../forms/schemas";

const QUERY_KEY = ["my-new-entity"];

export const useMyNewEntities = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await http.get("/my-endpoint");
      return response.data;
    },
  });
};

export const useCreateMyNewEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MyNewEntitySchema) => {
      const response = await http.post("/my-endpoint", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
```

Export from `src/hooks/index.ts`.

### 4. Create UI Components

Add reusable components to `src/shared/components/`:

```tsx
// MyNewEntityCard.tsx
import { Link } from "@tanstack/react-router";
import type { MyNewEntity } from "../../api/types";

export const MyNewEntityCard: React.FC<{ entity: MyNewEntity }> = ({ entity }) => {
  return (
    <div className="card">
      <h3 className="font-semibold text-slate-50">{entity.name}</h3>
      {/* ... */}
    </div>
  );
};
```

### 5. Create Page

Create page file in `src/shared/pages/`:

```tsx
import { useMyNewEntities } from "../../hooks";
import { MyNewEntityCard } from "../components/MyNewEntityCard";

export const MyNewEntityPage: React.FC = () => {
  const { data, isLoading, error } = useMyNewEntities();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">My New Entity</h1>
      <div className="space-y-2">
        {data?.map((entity) => (
          <MyNewEntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </div>
  );
};
```

### 6. Add Route

Add route to `src/router/index.tsx`:

```ts
import { MyNewEntityPage } from "../shared/pages/MyNewEntityPage";

const myNewEntityRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/my-new-entity",
  component: MyNewEntityPage,
});

// Add to routeTree.addChildren()
```

### 7. Add Navigation

Update `src/shared/layouts/AppLayout.tsx`:

```ts
const NAV_ITEMS = [
  { to: "/", label: "Resumen", icon: "🏠" },
  { to: "/my-new-entity", label: "My Entity", icon: "📌" },
  // ...
];
```

## Using Forms

### Basic Form Example

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { myNewEntitySchema, type MyNewEntitySchema } from "../forms/schemas";
import { FormField } from "../components/FormField";
import { useCreateMyNewEntity } from "../../hooks";

export const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MyNewEntitySchema>({
    resolver: zodResolver(myNewEntitySchema),
  });
  
  const createMutation = useCreateMyNewEntity();

  const onSubmit = async (values: MyNewEntitySchema) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Name" error={errors.name}>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50"
          {...register("name")}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create"}
      </button>
    </form>
  );
};
```

## Data Fetching Patterns

### Query with Refetch

```tsx
import { useMyNewEntities } from "../../hooks";

export const EntityList = () => {
  const query = useMyNewEntities();

  return (
    <div>
      <button onClick={() => query.refetch()}>
        Refresh
      </button>
      {/* ... */}
    </div>
  );
};
```

### Optimistic Updates

```tsx
const mutation = useMutation({
  mutationFn: (data) => http.patch(`/entity/${id}`, data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: QUERY_KEY });
    
    // Snapshot old data
    const previousData = queryClient.getQueryData(QUERY_KEY);
    
    // Optimistically update
    queryClient.setQueryData(QUERY_KEY, (old: any) => ({
      ...old,
      ...newData,
    }));
    
    return { previousData };
  },
  onError: (_err, _vars, context) => {
    // Revert on error
    if (context?.previousData) {
      queryClient.setQueryData(QUERY_KEY, context.previousData);
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  },
});
```

### Filtered Queries

```tsx
export const useFilteredEntities = (filters: FilterOptions) => {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: async () => {
      const response = await http.get("/entities", { params: filters });
      return response.data;
    },
  });
};

// Usage
const { data } = useFilteredEntities({ status: "active", type: "contract" });
```

## Styling Guidelines

### Using Tailwind Classes

All styling uses Tailwind CSS. Common patterns:

```tsx
// Cards
<div className="card">...</div>

// Status pills
<span className="pill-success">Paid</span>
<span className="pill-danger">Overdue</span>
<span className="pill-warning">Pending</span>

// Buttons
<button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
  Primary
</button>

<button className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800">
  Secondary
</button>

// Forms
<input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500" />

// Grid layouts
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">...</div>
```

### Responsive Design

Use Tailwind breakpoints:
- `sm:` - Small (640px+)
- `lg:` - Large (1024px+)
- Mobile-first default

```tsx
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {/* Stacks on mobile, 2 cols on sm, 3 on lg */}
</div>
```

## Type Safety

### API Response Types

Always type API responses:

```ts
const response = await http.get<Contract[]>("/contracts");
// response.data is typed as Contract[]
```

### Form Types

Always infer types from Zod schemas:

```ts
type MyFormData = z.infer<typeof mySchema>;

const form = useForm<MyFormData>({ /* ... */ });
```

### Component Props

```tsx
interface MyComponentProps {
  entity: Contract;
  onSelect?: (entity: Contract) => void;
  loading?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({ entity, onSelect, loading }) => {
  // ...
};
```

## Error Handling

### API Errors

```tsx
const { data, error, isError } = useQuery({
  queryKey: ["entities"],
  queryFn: async () => {
    try {
      const response = await http.get("/entities");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch entities:", err);
      throw err;
    }
  },
});

if (isError) {
  return <div className="text-red-400">Error: {error?.message}</div>;
}
```

### Form Validation Errors

Errors are automatically displayed by `FormField` component:

```tsx
<FormField label="Email" error={errors.email}>
  <input {...register("email")} />
</FormField>
```

The error message from the Zod schema will display automatically.

## Testing

While not currently set up, here's how you would add tests:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event
```

Example test:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyForm } from "./MyForm";

describe("MyForm", () => {
  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<MyForm />);
    
    const input = screen.getByLabelText("Name");
    await user.type(input, "Test Name");
    
    const button = screen.getByRole("button", { name: /create/i });
    await user.click(button);
    
    // Assert submission
  });
});
```

## Performance Optimization

### Query Caching

```ts
// Manually set cache time
useQuery({
  queryKey: ["entities"],
  queryFn: () => http.get("/entities"),
  staleTime: 60_000,        // 1 minute
  gcTime: 5 * 60 * 1000,    // 5 minutes (formerly cacheTime)
});
```

### Code Splitting

Pages are naturally split by route:

```ts
// Each route loads its component only when accessed
const contractDetailRoute = createRoute({
  path: "/contracts/$contractId",
  component: ContractDetailPage,
});
```

### Memoization

```tsx
import { memo } from "react";

export const MyComponent = memo(({ entity }: Props) => {
  // Only re-renders if entity prop changes
  return <div>{entity.name}</div>;
});
```

## Debugging

### React DevTools

Install React DevTools browser extension to inspect:
- Component tree
- Props and state
- Re-renders

### TanStack Query DevTools

Included in dev environment:

```tsx
// In src/main.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

Click the floating icon in bottom-right to inspect queries/mutations.

### Network Tab

Use browser DevTools Network tab to inspect:
- API requests/responses
- Headers and payload
- Performance

## Common Issues

### "Property not found" error

Make sure your form/component is using correct relative imports:
```ts
// ✗ Wrong
import { FormField } from "./FormField";

// ✓ Correct
import { FormField } from "../components/FormField";
```

### Query not refetching after mutation

Make sure to invalidate the query key:
```ts
onSuccess: () => {
  // ✓ Correct - matches the query key
  queryClient.invalidateQueries({ queryKey: ["entities"] });
}
```

### Form not showing validation errors

Ensure the schema is correct and resolver is set:
```tsx
const form = useForm<MyFormData>({
  resolver: zodResolver(mySchema),  // Don't forget!
});
```

### Authentication redirecting to login unexpectedly

Check that:
1. Token is being stored correctly
2. API refresh endpoint is working
3. Error handling in AuthProvider is not silently failing

## Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test
3. Commit: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request

### Commit Message Format

```
feat: add new contract filtering
fix: correct payment status update
docs: update API integration guide
refactor: simplify auth redirect logic
style: improve form spacing
test: add contract list tests
chore: update dependencies
```

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Vite Docs](https://vitejs.dev)
