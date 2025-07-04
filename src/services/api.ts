import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/auth';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const authStore = useAuthStore();
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
    });

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const authStore = useAuthStore();
          authStore.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: { username: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: { username: string; email: string; password: string; role?: string }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async changePassword(passwordData: { current_password: string; new_password: string }) {
    const response = await this.api.post('/auth/change-password', passwordData);
    return response.data;
  }

  // Employee endpoints
  async getEmployees(page = 1, limit = 10) {
    const response = await this.api.get(`/employees?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getEmployee(id: number) {
    const response = await this.api.get(`/employees/${id}`);
    return response.data;
  }

  async createEmployee(employeeData: any) {
    const response = await this.api.post('/employees', employeeData);
    return response.data;
  }

  async updateEmployee(id: number, employeeData: any) {
    const response = await this.api.put(`/employees/${id}`, employeeData);
    return response.data;
  }

  async deleteEmployee(id: number) {
    const response = await this.api.delete(`/employees/${id}`);
    return response.data;
  }

  async getEmployeePayslips(id: number) {
    const response = await this.api.get(`/employees/${id}/payslips`);
    return response.data;
  }

  // Payroll endpoints
  async getPayrollPeriods() {
    const response = await this.api.get('/payroll/periods');
    return response.data;
  }

  async createPayrollPeriod(periodData: { year: number; month: number; description?: string }) {
    const response = await this.api.post('/payroll/periods', periodData);
    return response.data;
  }

  async processPayroll(periodId: number) {
    const response = await this.api.post(`/payroll/periods/${periodId}/process`);
    return response.data;
  }

  async approvePayroll(periodId: number) {
    const response = await this.api.post(`/payroll/periods/${periodId}/approve`);
    return response.data;
  }

  async getPayslips(periodId?: number) {
    const url = periodId ? `/payroll/payslips?period_id=${periodId}` : '/payroll/payslips';
    const response = await this.api.get(url);
    return response.data;
  }

  async getPayslip(id: number) {
    const response = await this.api.get(`/payroll/payslips/${id}`);
    return response.data;
  }

  async getPayrollSummary(periodId: number) {
    const response = await this.api.get(`/payroll/periods/${periodId}/summary`);
    return response.data;
  }

  // Currency endpoints
  async getCurrencies() {
    const response = await this.api.get('/currencies');
    return response.data;
  }

  async createCurrency(currencyData: { code: string; name: string; symbol: string }) {
    const response = await this.api.post('/currencies', currencyData);
    return response.data;
  }

  async getExchangeRate(from: string, to: string) {
    const response = await this.api.get(`/currencies/exchange-rate?from=${from}&to=${to}`);
    return response.data;
  }

  async convertAmount(amount: number, from: string, to: string) {
    const response = await this.api.get(`/currencies/convert?amount=${amount}&from=${from}&to=${to}`);
    return response.data;
  }

  async updateExchangeRates() {
    const response = await this.api.post('/currencies/update-rates');
    return response.data;
  }

  async getExchangeRateHistory(from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await this.api.get(`/currencies/exchange-rate-history?${params}`);
    return response.data;
  }


    // Department endpoints
  async getDepartments(page = 1, limit = 10, isActive?: boolean) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (isActive !== undefined) params.append('is_active', isActive.toString());
    
    const response = await this.api.get(`/departments?${params}`);
    return response.data;
  }

  async getDepartment(id: number) {
    const response = await this.api.get(`/departments/${id}`);
    return response.data;
  }

  async createDepartment(departmentData: any) {
    const response = await this.api.post('/departments', departmentData);
    return response.data;
  }

  async updateDepartment(id: number, departmentData: any) {
    const response = await this.api.put(`/departments/${id}`, departmentData);
    return response.data;
  }

  async deleteDepartment(id: number) {
    const response = await this.api.delete(`/departments/${id}`);
    return response.data;
  }

  // Position endpoints
  async getPositions(page = 1, limit = 10, department?: string, isActive?: boolean) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (department) params.append('department', department);
    if (isActive !== undefined) params.append('is_active', isActive.toString());
    
    const response = await this.api.get(`/positions?${params}`);
    return response.data;
  }

  async getPosition(id: number) {
    const response = await this.api.get(`/positions/${id}`);
    return response.data;
  }

  async createPosition(positionData: any) {
    const response = await this.api.post('/positions', positionData);
    return response.data;
  }

  async updatePosition(id: number, positionData: any) {
    const response = await this.api.put(`/positions/${id}`, positionData);
    return response.data;
  }

  async deletePosition(id: number) {
    const response = await this.api.delete(`/positions/${id}`);
    return response.data;
  }

  async getPositionsByDepartment(departmentId: number) {
    const response = await this.api.get(`/positions/department/${departmentId}`);
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
