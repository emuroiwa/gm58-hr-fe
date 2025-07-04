import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '../services/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(credentials: LoginRequest) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.login(credentials);
      
      token.value = response.token;
      user.value = response.user;
      
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(userData: RegisterRequest) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.register(userData);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProfile() {
    try {
      loading.value = true;
      const response = await apiService.getProfile();
      user.value = response;
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch profile';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function changePassword(passwordData: { current_password: string; new_password: string }) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiService.changePassword(passwordData);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Password change failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  function clearError() {
    error.value = null;
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchProfile,
    changePassword,
    logout,
    clearError,
  };
});
