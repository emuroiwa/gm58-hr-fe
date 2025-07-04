import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/api';
import type { Department } from '../types';

export const useDepartmentsStore = defineStore('departments', () => {
  const departments = ref<Department[]>([]);
  const currentDepartment = ref<Department | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);

  async function fetchDepartments(pageNum = 1, limitNum = 10, isActive?: boolean) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getDepartments(pageNum, limitNum, isActive);
      
      departments.value = response.departments;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch departments';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchDepartment(id: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getDepartment(id);
      currentDepartment.value = response;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch department';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createDepartment(departmentData: any) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.createDepartment(departmentData);
      
      // Refresh the list
      await fetchDepartments(page.value, limit.value);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create department';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateDepartment(id: number, departmentData: any) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.updateDepartment(id, departmentData);
      
      // Update the current department if it's the same one
      if (currentDepartment.value?.id === id) {
        currentDepartment.value = { ...currentDepartment.value, ...response };
      }
      
      // Refresh the list
      await fetchDepartments(page.value, limit.value);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update department';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteDepartment(id: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.deleteDepartment(id);
      
      // Remove from the list
      departments.value = departments.value.filter(dept => dept.id !== id);
      
      // Clear current department if it's the deleted one
      if (currentDepartment.value?.id === id) {
        currentDepartment.value = null;
      }
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete department';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearCurrentDepartment() {
    currentDepartment.value = null;
  }

  return {
    departments,
    currentDepartment,
    loading,
    error,
    total,
    page,
    limit,
    fetchDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearError,
    clearCurrentDepartment,
  };
});
