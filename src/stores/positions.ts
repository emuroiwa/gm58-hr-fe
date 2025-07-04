import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/api';
import type { Position } from '../types';

export const usePositionsStore = defineStore('positions', () => {
  const positions = ref<Position[]>([]);
  const currentPosition = ref<Position | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);

  async function fetchPositions(pageNum = 1, limitNum = 10, department?: string, isActive?: boolean) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getPositions(pageNum, limitNum, department, isActive);
      
      positions.value = response.positions;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch positions';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPosition(id: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getPosition(id);
      currentPosition.value = response;
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch position';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPositionsByDepartment(departmentId: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.getPositionsByDepartment(departmentId);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch positions by department';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createPosition(positionData: any) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.createPosition(positionData);
      
      // Refresh the list
      await fetchPositions(page.value, limit.value);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create position';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updatePosition(id: number, positionData: any) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.updatePosition(id, positionData);
      
      // Update the current position if it's the same one
      if (currentPosition.value?.id === id) {
        currentPosition.value = { ...currentPosition.value, ...response };
      }
      
      // Refresh the list
      await fetchPositions(page.value, limit.value);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update position';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deletePosition(id: number) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.deletePosition(id);
      
      // Remove from the list
      positions.value = positions.value.filter(pos => pos.id !== id);
      
      // Clear current position if it's the deleted one
      if (currentPosition.value?.id === id) {
        currentPosition.value = null;
      }
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete position';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearCurrentPosition() {
    currentPosition.value = null;
  }

  return {
    positions,
    currentPosition,
    loading,
    error,
    total,
    page,
    limit,
    fetchPositions,
    fetchPosition,
    fetchPositionsByDepartment,
    createPosition,
    updatePosition,
    deletePosition,
    clearError,
    clearCurrentPosition,
  };
});
