export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  last_login?: string;
  employee?: Employee;
}

export interface Employee {
  id: number;
  user_id?: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  national_id?: string;
  tax_number?: string;
  passport_number?: string;
  email: string;
  phone: string;
  alternative_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  position_id: number;
  position?: Position;
  department_id: number;
  department?: Department;
  manager_id?: number;
  basic_salary: number;
  currency_id: number;
  currency?: Currency;
  payment_method?: string;
  payment_schedule?: string;
  bank_name?: string;
  bank_account?: string;
  bank_branch?: string;
  bank_code?: string;
  swift_code?: string;
  hire_date: string;
  probation_end_date?: string;
  contract_end_date?: string;
  termination_date?: string;
  employment_type: string;
  employment_status: string;
  is_active: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_aid_number?: string;
  medical_aid_provider?: string;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: number;
  title: string;
  department_id: number;
  department?: Department;
  min_salary: number;
  max_salary: number;
  currency_id: number;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
  is_base_currency: boolean;
}

export interface PayrollPeriod {
  id: number;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'processed' | 'approved';
  description?: string;
  processed_at?: string;
  processed_by?: number;
  approved_at?: string;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Payslip {
  id: number;
  employee_id: number;
  payroll_period_id: number;
  employee?: Employee;
  currency?: Currency;
  payroll_period?: PayrollPeriod;
  exchange_rate: number;
  basic_salary: number;
  overtime: number;
  allowances: number;
  bonus: number;
  commission: number;
  other_earnings: number;
  total_earnings: number;
  payee_tax: number;
  aids_levy: number;
  nssa_contribution: number;
  pension_contribution: number;
  medical_aid: number;
  union_dues: number;
  loan_deductions: number;
  other_deductions: number;
  total_deductions: number;
  net_pay: number;
  total_earnings_base: number;
  total_deductions_base: number;
  net_pay_base: number;
  working_days: number;
  days_worked: number;
  days_absent: number;
  status: string;
  payment_reference?: string;
  payment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
