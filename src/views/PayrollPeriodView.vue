<template>
  <div class="p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="$router.back()" class="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon class="w-6 h-6" />
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Payroll Period: {{ periodTitle }}
              </h1>
              <p class="text-gray-600">Manage payroll processing and payslips</p>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button
              v-if="period && period.status === 'draft'"
              @click="processPayroll"
              :disabled="payrollStore.loading"
              class="btn-primary"
            >
              <PlayIcon class="w-5 h-5 mr-2" />
              Process Payroll
            </button>
            
            <button
              v-if="period && period.status === 'processed'"
              @click="approvePayroll"
              :disabled="payrollStore.loading"
              class="btn-primary"
            >
              <CheckIcon class="w-5 h-5 mr-2" />
              Approve Payroll
            </button>
            
            <button @click="refreshData" class="btn-secondary">
              <ArrowPathIcon class="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div v-if="payrollStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else class="space-y-8">
        <!-- Period Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100">
                <CalendarIcon class="w-8 h-8 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Period Status</p>
                <span
                  class="inline-flex px-2 py-1 text-sm font-semibold rounded-full"
                  :class="getStatusColor(period?.status)"
                >
                  {{ period?.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100">
                <UsersIcon class="w-8 h-8 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Employees</p>
                <p class="text-2xl font-bold text-gray-900">{{ summary?.total_employees || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100">
                <BanknotesIcon class="w-8 h-8 text-yellow-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Earnings</p>
                <p class="text-2xl font-bold text-gray-900">
                  ${{ summary?.total_earnings?.toLocaleString() || 0 }}
                </p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100">
                <CurrencyDollarIcon class="w-8 h-8 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Net Pay</p>
                <p class="text-2xl font-bold text-gray-900">
                  ${{ summary?.total_net_pay?.toLocaleString() || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Currency Breakdown -->
        <div v-if="summary?.currency_breakdown" class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Currency Breakdown</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="(breakdown, currency) in summary.currency_breakdown"
              :key="currency"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">{{ currency }}</h4>
                <span class="text-sm text-gray-500">{{ breakdown.employee_count }} employees</span>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Total Earnings:</span>
                  <span class="font-medium">{{ getCurrencySymbol(currency) }}{{ breakdown.total_earnings?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Net Pay:</span>
                  <span class="font-medium">{{ getCurrencySymbol(currency) }}{{ breakdown.total_net_pay?.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payslips Table -->
        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Payslips</h3>
            
            <div class="flex items-center space-x-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search employees..."
                class="form-input w-64"
              />
              <select v-model="statusFilter" class="form-input">
                <option value="">All Status</option>
                <option value="generated">Generated</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earnings
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="payslip in filteredPayslips" :key="payslip.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-primary-600">
                            {{ payslip.employee?.first_name?.charAt(0) }}{{ payslip.employee?.last_name?.charAt(0) }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ payslip.employee?.first_name }} {{ payslip.employee?.last_name }}
                        </div>
                        <div class="text-sm text-gray-500">{{ payslip.employee?.employee_number }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ payslip.currency?.symbol }}{{ payslip.basic_salary?.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ payslip.currency?.symbol }}{{ payslip.total_earnings?.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ payslip.currency?.symbol }}{{ payslip.total_deductions?.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ payslip.currency?.symbol }}{{ payslip.net_pay?.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {{ payslip.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="viewPayslip(payslip)" class="text-primary-600 hover:text-primary-900 mr-4">
                      View
                    </button>
                    <button @click="downloadPayslip(payslip)" class="text-indigo-600 hover:text-indigo-900">
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Payslip Detail Modal -->
      <div v-if="selectedPayslip" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Payslip Details</h3>
            <button @click="selectedPayslip = null" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Employee</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedPayslip.employee?.first_name }} {{ selectedPayslip.employee?.last_name }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Employee Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPayslip.employee?.employee_number }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Working Days</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPayslip.working_days }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Days Worked</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPayslip.days_worked }}</p>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-2">Earnings</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="flex justify-between">
                  <span>Basic Salary:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.basic_salary?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Overtime:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.overtime?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Allowances:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.allowances?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Bonus:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.bonus?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between font-medium border-t pt-1">
                  <span>Total Earnings:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.total_earnings?.toLocaleString() }}</span>
                </div>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-2">Deductions</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="flex justify-between">
                  <span>PAYE Tax:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.payee_tax?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>AIDS Levy:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.aids_levy?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>NSSA:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.nssa_contribution?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Medical Aid:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.medical_aid?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between font-medium border-t pt-1">
                  <span>Total Deductions:</span>
                  <span>{{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.total_deductions?.toLocaleString() }}</span>
                </div>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <div class="flex justify-between text-lg font-bold">
                <span>Net Pay:</span>
                <span class="text-green-600">
                  {{ selectedPayslip.currency?.symbol }}{{ selectedPayslip.net_pay?.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePayrollStore } from '../stores/payroll';
import {
  ArrowLeftIcon,
  PlayIcon,
  CheckIcon,
  ArrowPathIcon,
  CalendarIcon,
  UsersIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const route = useRoute();
const payrollStore = usePayrollStore();

const searchQuery = ref('');
const statusFilter = ref('');
const selectedPayslip = ref(null);

const period = computed(() => {
  const periodId = parseInt(route.params.id as string);
  return payrollStore.periods.find(p => p.id === periodId);
});

const summary = computed(() => payrollStore.summary);

const periodTitle = computed(() => {
  if (!period.value) return 'Loading...';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[period.value.month - 1]} ${period.value.year}`;
});

const filteredPayslips = computed(() => {
  let filtered = payrollStore.payslips;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(payslip => 
      payslip.employee?.first_name?.toLowerCase().includes(query) ||
      payslip.employee?.last_name?.toLowerCase().includes(query) ||
      payslip.employee?.employee_number?.toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(payslip => payslip.status === statusFilter.value);
  }
  
  return filtered;
});

onMounted(async () => {
  const periodId = parseInt(route.params.id as string);
  await Promise.all([
    payrollStore.fetchPeriods(),
    payrollStore.fetchPayslips(periodId),
    payrollStore.fetchSummary(periodId),
  ]);
});

const processPayroll = async () => {
  if (confirm('Are you sure you want to process this payroll period? This action cannot be undone.')) {
    try {
      const periodId = parseInt(route.params.id as string);
      await payrollStore.processPayroll(periodId);
      await refreshData();
    } catch (error) {
      console.error('Failed to process payroll:', error);
    }
  }
};

const approvePayroll = async () => {
  if (confirm('Are you sure you want to approve this payroll period? This action cannot be undone.')) {
    try {
      const periodId = parseInt(route.params.id as string);
      await payrollStore.approvePayroll(periodId);
      await refreshData();
    } catch (error) {
      console.error('Failed to approve payroll:', error);
    }
  }
};

const refreshData = async () => {
  const periodId = parseInt(route.params.id as string);
  await Promise.all([
    payrollStore.fetchPeriods(),
    payrollStore.fetchPayslips(periodId),
    payrollStore.fetchSummary(periodId),
  ]);
};

const viewPayslip = (payslip: any) => {
  selectedPayslip.value = payslip;
};

const downloadPayslip = (payslip: any) => {
  // Implement payslip download
  console.log('Download payslip:', payslip.id);
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

const getCurrencySymbol = (currencyCode: string) => {
  const symbols = {
    USD: '$',
    ZAR: 'R',
    ZWL: 'Z$',
    EUR: '€',
  };
  return symbols[currencyCode] || currencyCode;
};
</script>
