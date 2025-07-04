<template>
  <div class="p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button @click="$router.back()" class="text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon class="w-6 h-6" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Employee Details</h1>
            <p class="text-gray-600">View and manage employee information</p>
          </div>
        </div>
      </div>

      <div v-if="employeesStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="employee" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Information -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Personal Information -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
              <button @click="editMode.personal = !editMode.personal" class="btn-secondary">
                <PencilIcon class="w-4 h-4 mr-2" />
                {{ editMode.personal ? 'Cancel' : 'Edit' }}
              </button>
            </div>

            <form v-if="editMode.personal" @submit.prevent="updatePersonal" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input v-model="editForm.first_name" type="text" required class="form-input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input v-model="editForm.last_name" type="text" required class="form-input" />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input v-model="editForm.email" type="email" required class="form-input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input v-model="editForm.phone" type="tel" required class="form-input" />
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button type="button" @click="editMode.personal = false" class="btn-secondary">
                  Cancel
                </button>
                <button type="submit" :disabled="employeesStore.loading" class="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>

            <div v-else class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">Employee Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.employee_number }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Full Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.first_name }} {{ employee.last_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Phone</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.phone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">National ID</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.national_id || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Tax Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.tax_number || 'Not provided' }}</p>
              </div>
            </div>
          </div>

          <!-- Employment Information -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Employment Information</h3>
            
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">Position</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.position?.title }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Department</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.department?.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Employment Type</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.employment_type }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Employment Status</label>
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="employee.employment_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'"
                >
                  {{ employee.employment_status }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Hire Date</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(employee.hire_date) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Basic Salary</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ employee.currency?.symbol }}{{ employee.basic_salary?.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Bank Information -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Banking Information</h3>
            
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">Bank Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.bank_name || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Account Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.bank_account || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Branch</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.bank_branch || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">SWIFT Code</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.swift_code || 'Not provided' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div class="space-y-3">
              <button @click="viewPayslips" class="btn-primary w-full">
                <DocumentTextIcon class="w-5 h-5 mr-2" />
                View Payslips
              </button>
              
              <button @click="generateReport" class="btn-secondary w-full">
                <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
                Generate Report
              </button>
              
              <router-link to="/employees" class="btn-secondary w-full text-center block">
                <ArrowLeftIcon class="w-5 h-5 mr-2 inline" />
                Back to Employees
              </router-link>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-500">Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.emergency_contact_name || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Phone</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.emergency_contact_phone || 'Not provided' }}</p>
              </div>
            </div>
          </div>

          <!-- Medical Information -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-500">Medical Aid Provider</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.medical_aid_provider || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Medical Aid Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.medical_aid_number || 'Not provided' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payslips Modal -->
      <div v-if="showPayslips" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Employee Payslips</h3>
            <button @click="showPayslips = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
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
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="payslip in payslips" :key="payslip.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getMonthName(payslip.payroll_period?.month) }} {{ payslip.payroll_period?.year }}
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {{ payslip.currency?.symbol }}{{ payslip.net_pay?.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {{ payslip.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useEmployeesStore } from '../stores/employees';
import { apiService } from '../services/api';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const route = useRoute();
const employeesStore = useEmployeesStore();

const showPayslips = ref(false);
const payslips = ref([]);

const editMode = reactive({
  personal: false,
});

const editForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
});

const employee = computed(() => employeesStore.currentEmployee);

onMounted(async () => {
  const employeeId = parseInt(route.params.id as string);
  await employeesStore.fetchEmployee(employeeId);
  
  if (employee.value) {
    Object.assign(editForm, {
      first_name: employee.value.first_name,
      last_name: employee.value.last_name,
      email: employee.value.email,
      phone: employee.value.phone,
    });
  }
});

const updatePersonal = async () => {
  try {
    const employeeId = parseInt(route.params.id as string);
    await employeesStore.updateEmployee(employeeId, editForm);
    editMode.personal = false;
  } catch (error) {
    console.error('Failed to update employee:', error);
  }
};

const viewPayslips = async () => {
  try {
    const employeeId = parseInt(route.params.id as string);
    const response = await apiService.getEmployeePayslips(employeeId);
    payslips.value = response;
    showPayslips.value = true;
  } catch (error) {
    console.error('Failed to fetch payslips:', error);
  }
};

const generateReport = () => {
  // Implement report generation
  console.log('Generate report for employee:', employee.value?.id);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getMonthName = (month: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
};
</script>
