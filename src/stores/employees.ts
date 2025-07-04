import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/api';
import type { Employee } from '../types';

export const useEmployeesStore = defineStore('employees', () => {
  const employees = ref<Employee[]>([]);
  const currentEmployee = ref<Employee | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);

  async function fetchEmployees(pageNum = 1, limitNum = 10) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getEmployees(pageNum, limitNum);
      
      employees.value = response.employees;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch employees';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchEmployee(id: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getEmployee(id);
      currentEmployee.value = response;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch employee';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createEmployee(employeeData: any) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.createEmployee(employeeData);
      
      // Refresh the list
      await fetchEmployees(page.value, limit.value);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create employee';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateEmployee(id: number, employeeData: any) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.updateEmployee(id, employeeData);
      
      // Update the current employee if it's the same one
      if (currentEmployee.value?.id === id) {
        currentEmployee.value = { ...currentEmployee.value, ...response };
      }
      
      // Refresh the list
      await fetchEmployees(page.value, limit.value);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update employee';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteEmployee(id: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.deleteEmployee(id);
      
      // Remove from the list
      employees.value = employees.value.filter(emp => emp.id !== id);
      
      // Clear current employee if it's the deleted one
      if (currentEmployee.value?.id === id) {
        currentEmployee.value = null;
      }
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete employee';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearCurrentEmployee() {
    currentEmployee.value = null;
  }

  return {
    employees,
    currentEmployee,
    loading,
    error,
    total,
    page,
    limit,
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    clearError,
    clearCurrentEmployee,
  };
});
