/**
 * Validation utility functions
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate required fields
 */
export function validateRequired(value: any, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (value > max) {
    return `${fieldName} must not exceed ${max}`;
  }
  
  return null;
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate employee form
 */
export function validateEmployeeForm(employee: any): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  if (!employee.first_name?.trim()) {
    errors.push('First name is required');
  }
  
  if (!employee.last_name?.trim()) {
    errors.push('Last name is required');
  }
  
  if (!employee.email?.trim()) {
    errors.push('Email is required');
  } else if (!validateEmail(employee.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!employee.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!validatePhone(employee.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  if (!employee.basic_salary || employee.basic_salary <= 0) {
    errors.push('Basic salary must be greater than 0');
  }
  
  if (!employee.position_id) {
    errors.push('Position is required');
  }
  
  if (!employee.department_id) {
    errors.push('Department is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate payroll period form
 */
export function validatePayrollPeriod(period: any): ValidationResult {
  const errors: string[] = [];
  
  if (!period.year || period.year < 2000 || period.year > 2100) {
    errors.push('Please enter a valid year');
  }
  
  if (!period.month || period.month < 1 || period.month > 12) {
    errors.push('Please select a valid month');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate currency form
 */
export function validateCurrencyForm(currency: any): ValidationResult {
  const errors: string[] = [];
  
  if (!currency.code?.trim()) {
    errors.push('Currency code is required');
  } else if (currency.code.length !== 3) {
    errors.push('Currency code must be 3 characters long');
  }
  
  if (!currency.name?.trim()) {
    errors.push('Currency name is required');
  }
  
  if (!currency.symbol?.trim()) {
    errors.push('Currency symbol is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
