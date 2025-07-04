<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Payroll Management</h1>
        <p class="text-gray-600">Manage payroll periods and processing</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        New Period
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Payroll Periods</h3>
          
          <div class="space-y-4">
            <div
              v-for="period in payrollStore.periods"
              :key="period.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-medium text-gray-900">
                    {{ getMonthName(period.month) }} {{ period.year }}
                  </h4>
                  <p class="text-sm text-gray-500">{{ period.description }}</p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ formatDate(period.start_date) }} - {{ formatDate(period.end_date) }}
                  </p>
                </div>
                
                <div class="flex items-center space-x-3">
                  <span
                    class="px-3 py-1 text-sm font-medium rounded-full"
                    :class="getStatusColor(period.status)"
                  >
                    {{ period.status }}
                  </span>
                  
                  <div class="flex space-x-2">
                    <router-link
                      :to="`/payroll/periods/${period.id}`"
                      class="text-primary-600 hover:text-primary-900 text-sm"
                    >
                      View
                    </router-link>
                    
                    <button
                      v-if="period.status === 'draft'"
                      @click="processPayroll(period.id)"
                      class="text-blue-600 hover:text-blue-900 text-sm"
                      :disabled="payrollStore.loading"
                    >
                      Process
                    </button>
                    
                    <button
                      v-if="period.status === 'processed'"
                      @click="approvePayroll(period.id)"
                      class="text-green-600 hover:text-green-900 text-sm"
                      :disabled="payrollStore.loading"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Periods</span>
              <span class="font-medium">{{ payrollStore.periods.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Draft</span>
              <span class="font-medium text-yellow-600">{{ draftCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Processed</span>
              <span class="font-medium text-blue-600">{{ processedCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Approved</span>
              <span class="font-medium text-green-600">{{ approvedCount }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div class="space-y-3">
            <button
              @click="refreshPeriods"
              class="w-full btn-secondary"
              :disabled="payrollStore.loading"
            >
              Refresh Data
            </button>
            
            <router-link
              to="/employees"
              class="block w-full btn-secondary text-center"
            >
              Manage Employees
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Period Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">Create New Payroll Period</h3>
        </div>
        <form @submit.prevent="createPeriod">
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input v-model="newPeriod.year" type="number" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select v-model="newPeriod.month" required class="form-input">
                <option v-for="(month, index) in months" :key="index" :value="index + 1">
                  {{ month }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input v-model="newPeriod.description" type="text" class="form-input" />
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="payrollStore.loading" class="btn-primary">
              Create Period
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { usePayrollStore } from '../stores/payroll';
import { PlusIcon } from '@heroicons/vue/24/outline';

const payrollStore = usePayrollStore();

const showCreateModal = ref(false);

const newPeriod = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  description: '',
});

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const draftCount = computed(() => 
  payrollStore.periods.filter(p => p.status === 'draft').length
);

const processedCount = computed(() => 
  payrollStore.periods.filter(p => p.status === 'processed').length
);

const approvedCount = computed(() => 
  payrollStore.periods.filter(p => p.status === 'approved').length
);

onMounted(() => {
  payrollStore.fetchPeriods();
});

const createPeriod = async () => {
  try {
    await payrollStore.createPeriod(newPeriod);
    showCreateModal.value = false;
    newPeriod.description = '';
  } catch (error) {
    console.error('Failed to create period:', error);
  }
};

const processPayroll = async (periodId: number) => {
  if (confirm('Are you sure you want to process this payroll period?')) {
    try {
      await payrollStore.processPayroll(periodId);
    } catch (error) {
      console.error('Failed to process payroll:', error);
    }
  }
};

const approvePayroll = async (periodId: number) => {
  if (confirm('Are you sure you want to approve this payroll period?')) {
    try {
      await payrollStore.approvePayroll(periodId);
    } catch (error) {
      console.error('Failed to approve payroll:', error);
    }
  }
};

const refreshPeriods = () => {
  payrollStore.fetchPeriods();
};

const getMonthName = (month: number) => {
  return months[month - 1];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
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
