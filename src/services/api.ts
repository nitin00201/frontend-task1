import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  AgentsResponse,
  AgentQueryParams,
  Distribution,
  DistributionsResponse,
  DistributionQueryParams,
  UploadResponse,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Initialize token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Helper method to handle API responses
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const { data } = response;
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }
    return data.data as T;
  }

  // Authentication endpoints
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    const authData = this.handleResponse(response);
    this.setToken(authData.token);
    return authData;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const authData = this.handleResponse(response);
    this.setToken(authData.token);
    return authData;
  }

  async logout(): Promise<void> {
    this.removeToken();
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<ApiResponse<{ user: User }>>('/auth/profile');
    const data = this.handleResponse(response);
    return data.user;
  }

  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    const response = await this.client.get<ApiResponse<{ valid: boolean; user: User }>>('/auth/verify');
    return this.handleResponse(response);
  }

  // Agent endpoints
  async createAgent(agentData: CreateAgentRequest): Promise<{ agent: Agent }> {
    const response = await this.client.post<ApiResponse<{ agent: Agent }>>('/agents', agentData);
    return this.handleResponse(response);
  }

  async getAgents(params: AgentQueryParams = {}): Promise<AgentsResponse> {
    const response = await this.client.get<ApiResponse<AgentsResponse>>('/agents', { params });
    return this.handleResponse(response);
  }

  async getActiveAgents(): Promise<{ agents: Agent[]; count: number }> {
    const response = await this.client.get<ApiResponse<{ agents: Agent[]; count: number }>>('/agents/active');
    return this.handleResponse(response);
  }

  async getAgentById(id: string): Promise<{ agent: Agent }> {
    const response = await this.client.get<ApiResponse<{ agent: Agent }>>(`/agents/${id}`);
    return this.handleResponse(response);
  }

  async updateAgent(id: string, agentData: UpdateAgentRequest): Promise<{ agent: Agent }> {
    const response = await this.client.put<ApiResponse<{ agent: Agent }>>(`/agents/${id}`, agentData);
    return this.handleResponse(response);
  }

  async deleteAgent(id: string): Promise<void> {
    const response = await this.client.delete<ApiResponse<void>>(`/agents/${id}`);
    this.handleResponse(response);
  }

  // File upload and distribution endpoints
  async uploadAndDistribute(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<UploadResponse>>(
      '/uploads/distribute',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return this.handleResponse(response);
  }

  async getDistributions(params: DistributionQueryParams = {}): Promise<DistributionsResponse> {
    const response = await this.client.get<ApiResponse<DistributionsResponse>>('/uploads/distributions', { params });
    return this.handleResponse(response);
  }

  async getDistributionById(id: string): Promise<{ distribution: Distribution }> {
    const response = await this.client.get<ApiResponse<{ distribution: Distribution }>>(`/uploads/distributions/${id}`);
    return this.handleResponse(response);
  }

  async deleteDistribution(id: string): Promise<void> {
    const response = await this.client.delete<ApiResponse<void>>(`/uploads/distributions/${id}`);
    this.handleResponse(response);
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string; environment: string }> {
    const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const response = await axios.get(`${baseURL}/health`);
    return response.data;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const authApi = {
  register: (userData: RegisterRequest) => apiClient.register(userData),
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
  getProfile: () => apiClient.getProfile(),
  verifyToken: () => apiClient.verifyToken(),
};

export const agentApi = {
  create: (agentData: CreateAgentRequest) => apiClient.createAgent(agentData),
  getAll: (params?: AgentQueryParams) => apiClient.getAgents(params),
  getActive: () => apiClient.getActiveAgents(),
  getById: (id: string) => apiClient.getAgentById(id),
  update: (id: string, agentData: UpdateAgentRequest) => apiClient.updateAgent(id, agentData),
  delete: (id: string) => apiClient.deleteAgent(id),
};

export const distributionApi = {
  upload: (file: File) => apiClient.uploadAndDistribute(file),
  getAll: (params?: DistributionQueryParams) => apiClient.getDistributions(params),
  getById: (id: string) => apiClient.getDistributionById(id),
  delete: (id: string) => apiClient.deleteDistribution(id),
};

export default apiClient;