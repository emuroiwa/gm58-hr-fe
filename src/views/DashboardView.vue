<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Welcome back, {{ authStore.user?.username }}!</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <UsersIcon class="w-8 h-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Employees</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalEmployees }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <BanknotesIcon class="w-8 h-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Monthly Payroll</p>
            <p class="text-2xl font-bold text-gray-900">${{ stats.monthlyPayroll?.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <ClockIcon class="w-8 h-8 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Pending Periods</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingPeriods }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <CurrencyDollarIcon class="w-8 h-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Currencies</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeCurrencies }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Payroll Periods</h3>
        <div class="space-y-3">
          <div v-for="period in recentPeriods" :key="period.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">{{ getMonthName(period.month) }} {{ period.year }}</p>
              <p class="text-sm text-gray-500">{{ period.description }}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(period.status)">
              {{ period.status }}
            </span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <router-link to="/employees" class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div class="flex items-center">
              <UsersIcon class="w-5 h-5 text-blue-600 mr-3" />
              <span class="font-medium text-blue-900">Manage Employees</span>
            </div>
          </router-link>
          
          <router-link to="/payroll" class="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div class="flex items-center">
              <BanknotesIcon class="w-5 h-5 text-green-600 mr-3" />
              <span class="font-medium text-green-900">Process Payroll</span>
            </div>
          </router-link>
          
          <router-link to="/currencies" class="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div class="flex items-center">
              <CurrencyDollarIcon class="w-5 h-5 text-purple-600 mr-3" />
              <span class="font-medium text-purple-900">Manage Currencies</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { usePayrollStore } from '../stores/payroll';
import { useEmployeesStore } from '../stores/employees';
import {
  UsersIcon,
  BanknotesIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const payrollStore = usePayrollStore();
const employeesStore = useEmployeesStore();

const stats = ref({
  totalEmployees: 0,
  monthlyPayroll: 0,
  pendingPeriods: 0,
  activeCurrencies: 3,
});

const recentPeriods = ref([]);

onMounted(async () => {
  try {
    // Fetch dashboard data
    await Promise.all([
      employeesStore.fetchEmployees(1, 100),
      payrollStore.fetchPeriods(),
    ]);

    stats.value.totalEmployees = employeesStore.total;
    stats.value.pendingPeriods = payrollStore.periods.filter(p => p.status === 'draft').length;
    recentPeriods.value = payrollStore.periods.slice(0, 5);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
});

const getMonthName = (month: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'processed':
      return 'bg-blue-100 text-blue-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>
