# API Integration Checklist

Use this checklist to ensure all backend endpoints are properly implemented and integrated.

## Authentication Endpoints

- [ ] `POST /auth/login` - Email/password login
  - **Request:** `{ email: string, password: string }`
  - **Response:** `{ accessToken: string, user: AuthUser }`
  - **Hook:** Not directly used (LoginPage calls `authApi.loginWithEmailPassword`)

- [ ] `POST /auth/refresh` - Refresh access token
  - **Request:** (empty, uses refresh cookie)
  - **Response:** `{ accessToken: string }`
  - **Hook:** Called by AuthProvider on mount

- [ ] `GET /auth/me` - Get current user
  - **Request:** (no body)
  - **Response:** `{ id: string, email: string, fullName: string, roles: string[], defaultRole: string }`
  - **Hook:** Called by AuthProvider on mount

- [ ] `POST /auth/logout` - Logout user
  - **Request:** (no body)
  - **Response:** `{ success: boolean }`
  - **Hook:** Called by `useAuth().logout()`

## Contract Endpoints

- [ ] `GET /contracts` - List contracts
  - **Query Params:** `propertyId?: string`
  - **Response:** `{ data: Contract[], total: number, page: number, limit: number, hasMore: boolean }`
  - **Hook:** `useContracts(propertyId?)`
  - **Page:** ContractsListPage

- [ ] `GET /contracts/:contractId` - Get contract details
  - **Response:** `Contract`
  - **Hook:** `useContract(contractId)`
  - **Page:** ContractDetailPage

- [ ] `POST /contracts` - Create contract
  - **Request:** `ContractCreateSchema`
  - **Response:** `Contract`
  - **Hook:** `useCreateContract()`
  - **Page:** ContractCreatePage

- [ ] `PATCH /contracts/:contractId` - Update contract
  - **Request:** `Partial<ContractCreateSchema>`
  - **Response:** `Contract`
  - **Hook:** `useUpdateContract(contractId)`

## Payment Endpoints

- [ ] `GET /payments` - List payments
  - **Query Params:** `contractId?: string, status?: string`
  - **Response:** `{ data: Payment[], total: number, ... }`
  - **Hook:** `usePayments(contractId?, filters?)`
  - **Page:** PaymentsPage

- [ ] `GET /payments/:paymentId` - Get payment details
  - **Response:** `Payment`
  - **Hook:** `usePayment(paymentId)`

- [ ] `POST /payments` - Register payment
  - **Request:** `PaymentCreateSchema`
  - **Response:** `Payment`
  - **Hook:** `useRegisterPayment()`
  - **Page:** PaymentsPage

- [ ] `PATCH /payments/:paymentId` - Update payment status
  - **Request:** `{ status: "paid" | "pending" | "cancelled" }`
  - **Response:** `Payment`
  - **Hook:** `useUpdatePaymentStatus(paymentId)`

## Property Endpoints

- [ ] `GET /properties` - List properties
  - **Response:** `{ data: Property[], ... }`
  - **Hook:** `useProperties()`

- [ ] `GET /properties/:propertyId` - Get property details
  - **Response:** `Property`
  - **Hook:** `useProperty(propertyId)`

- [ ] `POST /properties` - Create property
  - **Request:** `PropertyCreateSchema`
  - **Response:** `Property`
  - **Hook:** `useCreateProperty()`

- [ ] `PATCH /properties/:propertyId` - Update property
  - **Request:** `Partial<PropertyCreateSchema>`
  - **Response:** `Property`
  - **Hook:** `useUpdateProperty(propertyId)`

## Tenant Endpoints

- [ ] `GET /tenants` - List tenants
  - **Query Params:** `search?: string`
  - **Response:** `{ data: Tenant[], ... }`
  - **Hook:** `useTenants(filters?)`

- [ ] `GET /tenants/:tenantId` - Get tenant details
  - **Response:** `Tenant`
  - **Hook:** `useTenant(tenantId)`

- [ ] `POST /tenants` - Create tenant
  - **Request:** `TenantCreateSchema`
  - **Response:** `Tenant`
  - **Hook:** `useCreateTenant()`
  - **Page:** ContractCreatePage (step 2)

- [ ] `PATCH /tenants/:tenantId` - Update tenant
  - **Request:** `Partial<TenantCreateSchema>`
  - **Response:** `Tenant`
  - **Hook:** `useUpdateTenant(tenantId)`

## Notice Endpoints

- [ ] `GET /notices` - List notices
  - **Query Params:** `contractId?: string, status?: string`
  - **Response:** `{ data: Notice[], ... }`
  - **Hook:** `useNotices(contractId?, filters?)`
  - **Page:** NoticesPage

- [ ] `GET /notices/:noticeId` - Get notice details
  - **Response:** `Notice`
  - **Hook:** `useNotice(noticeId)`

- [ ] `POST /notices` - Create notice
  - **Request:** `NoticeCreateSchema`
  - **Response:** `Notice`
  - **Hook:** `useCreateNotice()`
  - **Page:** NoticesPage

- [ ] `PATCH /notices/:noticeId` - Update notice status
  - **Request:** `{ status: "pending" | "acknowledged" | "resolved" | "escalated" }`
  - **Response:** `Notice`
  - **Hook:** `useUpdateNoticeStatus(noticeId)`

## Conflict/AI Mediation Endpoints

- [ ] `GET /conflicts` - List conflict cases
  - **Query Params:** `severity?: string, status?: string`
  - **Response:** `{ data: ConflictCase[], ... }`
  - **Hook:** `useConflictCases(filters?)`
  - **Page:** ConflictPreventionPage

- [ ] `GET /conflicts/:caseId` - Get case details
  - **Response:** `ConflictCase`
  - **Hook:** `useConflictCase(caseId)`

- [ ] `POST /conflicts/analyze/:contractId` - Trigger AI analysis
  - **Request:** (no body)
  - **Response:** `ConflictCase`
  - **Hook:** `useRequestAIAnalysis()`
  - **Backend:** Should analyze contract, detect risks, generate recommendations

- [ ] `PATCH /conflicts/:caseId` - Update case status
  - **Request:** `{ action: "resolve" | "escalate" }`
  - **Response:** `ConflictCase`
  - **Hook:** `useResolveConflictCase(caseId)`

## Audit Endpoints (Optional for MVP)

- [ ] `GET /audits` - List audit logs
  - **Query Params:** `limit?: number, offset?: number`
  - **Response:** `{ data: AuditLog[], ... }`

- [ ] `GET /audits/:entityType/:entityId` - Get audits for entity
  - **Response:** `AuditLog[]`
  - **Page:** SettingsPage (audit section)

## Integration Steps

1. **Set Environment Variable**
   ```env
   VITE_API_URL=https://your-api-domain.com/api/v1
   ```

2. **Verify Auth Flow**
   - User can login at `/login`
   - Tokens are properly exchanged
   - Auth refresh works on app load

3. **Test Each Hook**
   - Use React Query DevTools to monitor requests
   - Verify query caching is working
   - Check optimistic updates

4. **Test Error Handling**
   - Network errors are caught gracefully
   - 401/403 redirects to login
   - Validation errors display correctly

5. **Test Page Navigation**
   - All protected routes require authentication
   - Data loads correctly on each page
   - Mutations trigger proper refetches

## Expected Response Format

All endpoints should follow this format:

### Success Response (Single Resource)
```json
{
  "id": "uuid",
  "field1": "value1",
  "createdAt": "2024-01-01T12:00:00Z"
}
```

### Success Response (Paginated)
```json
{
  "data": [
    { "id": "uuid1", "field": "value" },
    { "id": "uuid2", "field": "value" }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

### Error Response
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input",
  "details": {
    "email": "Invalid email format"
  }
}
```

## HTTP Status Codes

- `200 OK` - Successful GET/PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - User lacks permission
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Semantic validation error
- `500 Internal Server Error` - Server error

## Testing with curl

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get contracts (with token)
curl http://localhost:3000/api/v1/contracts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create contract
curl -X POST http://localhost:3000/api/v1/contracts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "propertyId": "uuid",
    "tenantId": "uuid",
    "startDate": "2024-01-01",
    "endDate": "2025-01-01",
    "monthlyRent": 1200,
    "depositAmount": 2400
  }'
```

## Common Integration Issues

**"Failed to resolve import" errors**
- Make sure API is running and accessible
- Check VITE_API_URL environment variable
- Verify CORS headers if on different domain

**"401 Unauthorized" on every request**
- Verify accessToken is being stored correctly
- Check that Authorization header is being sent
- Ensure refresh token endpoint is working

**Data not updating after mutation**
- Make sure queryClient.invalidateQueries() is called
- Verify query key matches exactly
- Check that backend returns updated data

**"Type mismatch" errors**
- Ensure API response matches type definitions in src/api/types.ts
- Update types if API schema changes
- Use TypeScript strict mode for better type checking

## Performance Optimization

For optimal performance:

1. **Pagination:** Implement limit/offset for large lists
2. **Caching:** Set appropriate staleTime on queries
3. **Search:** Use debounced search with useDebounce hook
4. **Mutations:** Implement optimistic updates for better UX
5. **Batch Requests:** Consider batching multiple queries
