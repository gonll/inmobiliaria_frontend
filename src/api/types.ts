/* Domain Models */

export interface Property {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  city: string;
  type: "apartment" | "house" | "commercial" | "land";
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  createdAt: string;
}

export interface Tenant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth?: string;
  address: string;
  createdAt: string;
}

export type ContractStatus = "draft" | "pending_signature" | "signed" | "active" | "expired" | "terminated";

export type ContractTerminationReason = "mutual_agreement" | "landlord_notice" | "tenant_notice" | "breach" | "other";

export interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  signedDate?: string;
  terminatedDate?: string;
  terminationReason?: ContractTerminationReason;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  property: Property;
  tenant: Tenant;
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "overdue" | "paid" | "partial" | "cancelled";
  month: number;
  year: number;
  notes?: string;
  createdAt: string;
  contract: Contract;
}

export interface Notice {
  id: string;
  contractId: string;
  type: "lease_expiration" | "payment_default" | "maintenance_request" | "contract_violation" | "rent_increase";
  title: string;
  description: string;
  issueDate: string;
  dueDate?: string;
  status: "pending" | "acknowledged" | "resolved" | "escalated";
  attachmentUrl?: string;
  createdAt: string;
  contract: Contract;
}

export interface ConflictCase {
  id: string;
  contractId: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "detected" | "in_mediation" | "escalated" | "resolved";
  aiAnalysis?: string;
  recommendedActions?: string[];
  createdAt: string;
  contract: Contract;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

/* API Response Wrappers */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
