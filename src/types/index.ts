// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalAgents?: number;
  totalDistributions?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  role: 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  email: string;
  mobile: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface UpdateAgentRequest {
  name?: string;
  email?: string;
  mobile?: string;
  isActive?: boolean;
}

export interface AgentsResponse {
  agents: Agent[];
  pagination: PaginationInfo;
}

// Distribution Types
export interface DistributionItem {
  firstName: string;
  phone: string;
  notes: string;
}

export interface Distribution {
  id: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  items: DistributionItem[];
  uploadDate: string;
  fileName: string;
  totalItems: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionSummary {
  agentId: string;
  agentName: string;
  agentEmail: string;
  itemsAssigned: number;
  distributionId: string;
}

export interface UploadResponse {
  fileName: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  agentsCount: number;
  distributions: DistributionSummary[];
  validationErrors?: any[];
}

export interface DistributionsResponse {
  distributions: Distribution[];
  pagination: PaginationInfo;
}

// Query Parameters
export interface AgentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
}

export interface DistributionQueryParams {
  page?: number;
  limit?: number;
  agentId?: string;
  startDate?: string;
  endDate?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AgentFormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateAgentFormData {
  name: string;
  email: string;
  mobile: string;
  isActive: boolean;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: ValidationError[];
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface TableState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
}

// File Upload Types
export interface FileUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  result: UploadResponse | null;
}