import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/api';
import type { PayrollPeriod, Payslip } from '../types';

export const usePayrollStore = defineStore('payroll', () => {
  const periods = ref<PayrollPeriod[]>([]);
  const currentPeriod = ref<PayrollPeriod | null>(null);
  const payslips = ref<Payslip[]>([]);
  const currentPayslip = ref<Payslip | null>(null);
  const summary = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchPeriods() {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getPayrollPeriods();
      periods.value = response;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch payroll periods';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createPeriod(periodData: { year: number; month: number; description?: string }) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.createPayrollPeriod(periodData);
      
      // Refresh the list
      await fetchPeriods();
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create payroll period';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function processPayroll(periodId: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.processPayroll(periodId);
      
      // Refresh the periods
      await fetchPeriods();
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to process payroll';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function approvePayroll(periodId: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.approvePayroll(periodId);
      
      // Refresh the periods
      await fetchPeriods();
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to approve payroll';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPayslips(periodId?: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getPayslips(periodId);
      payslips.value = response;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch payslips';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPayslip(id: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getPayslip(id);
      currentPayslip.value = response;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch payslip';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchSummary(periodId: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getPayrollSummary(periodId);
      summary.value = response;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch payroll summary';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    periods,
    currentPeriod,
    payslips,
    currentPayslip,
    summary,
    loading,
    error,
    fetchPeriods,
    createPeriod,
    processPayroll,
    approvePayroll,
    fetchPayslips,
    fetchPayslip,
    fetchSummary,
    clearError,
  };
});
