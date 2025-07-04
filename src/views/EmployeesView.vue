<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Employees</h1>
        <p class="text-gray-600">Manage your workforce</p>
      </div>
      <button @click="openCreateModal" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Add Employee
      </button>
    </div>

    <!-- Alerts -->
    <Alert
      v-if="alertState.show"
      :type="alertState.type"
      :title="alertState.title"
      :message="alertState.message"
      @dismiss="dismissAlert"
    />

    <div class="card">
      <div class="mb-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search employees..."
              class="form-input"
            />
          </div>
          <select v-model="statusFilter" class="form-input w-48">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
                Position
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
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
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-blue-600">
                        {{ employee.first_name.charAt(0) }}{{ employee.last_name.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ employee.first_name }} {{ employee.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ employee.employee_number }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.position?.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.department?.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ employee.currency?.symbol }}{{ employee.basic_salary?.toLocaleString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="employee.employment_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'"
                >
                  {{ employee.employment_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/employees/${employee.id}`"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View
                </router-link>
                <button
                  @click="editEmployee(employee)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="deleteEmployee(employee.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ employeesStore.employees.length }} of {{ employeesStore.total }} employees
        </div>
        <div class="flex space-x-2">
          <button
            :disabled="employeesStore.page <= 1"
            @click="previousPage"
            class="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <button
            :disabled="employeesStore.employees.length < employeesStore.limit"
            @click="nextPage"
            class="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Multi-Step Create Employee Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white min-h-[600px]">
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Add New Employee</h3>
            <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <!-- Step Progress -->
          <StepProgress :steps="stepTitles" :current-step="currentStep" />
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Step 1: Personal Information -->
          <div v-show="currentStep === 0" class="space-y-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
            
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input 
                  v-model="employeeForm.first_name" 
                  type="text" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.first_name }"
                />
                <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input v-model="employeeForm.middle_name" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input 
                  v-model="employeeForm.last_name" 
                  type="text" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.last_name }"
                />
                <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  v-model="employeeForm.email" 
                  type="email" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input 
                  v-model="employeeForm.phone" 
                  type="tel" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.phone }"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Alternative Phone</label>
                <input v-model="employeeForm.alternative_phone" type="tel" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                <input v-model="employeeForm.national_id" type="text" class="form-input" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tax Number</label>
                <input v-model="employeeForm.tax_number" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input v-model="employeeForm.passport_number" type="text" class="form-input" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea v-model="employeeForm.address" rows="2" class="form-input"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input v-model="employeeForm.city" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input v-model="employeeForm.country" type="text" class="form-input" placeholder="Local" />
              </div>
            </div>
          </div>

          <!-- Step 2: Employment Details -->
          <div v-show="currentStep === 1" class="space-y-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Employment Details</h4>
            
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select 
                  v-model="employeeForm.department_id" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.department_id }"
                  @change="loadPositionsForDepartment"
                >
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <p v-if="errors.department_id" class="mt-1 text-sm text-red-600">{{ errors.department_id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <select 
                  v-model="employeeForm.position_id" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.position_id }"
                  :disabled="!employeeForm.department_id"
                >
                  <option value="">Select Position</option>
                  <option v-for="pos in availablePositions" :key="pos.id" :value="pos.id">
                    {{ pos.title }}
                  </option>
                </select>
                <p v-if="errors.position_id" class="mt-1 text-sm text-red-600">{{ errors.position_id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                <select v-model="employeeForm.manager_id" class="form-input">
                  <option value="">Select Manager</option>
                  <option v-for="emp in managers" :key="emp.id" :value="emp.id">
                    {{ emp.first_name }} {{ emp.last_name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select v-model="employeeForm.employment_type" class="form-input">
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                <select v-model="employeeForm.employment_status" class="form-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
                <input v-model="employeeForm.employee_number" type="text" class="form-input" placeholder="Auto-generated if empty" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                <input 
                  v-model="employeeForm.hire_date" 
                  type="date" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.hire_date }"
                />
                <p v-if="errors.hire_date" class="mt-1 text-sm text-red-600">{{ errors.hire_date }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Probation End Date</label>
                <input v-model="employeeForm.probation_end_date" type="date" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contract End Date</label>
                <input v-model="employeeForm.contract_end_date" type="date" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Step 3: Salary & Payment -->
          <div v-show="currentStep === 2" class="space-y-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Salary & Payment Information</h4>
            
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                <input 
                  v-model="employeeForm.basic_salary" 
                  type="number" 
                  step="0.01" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.basic_salary }"
                />
                <p v-if="errors.basic_salary" class="mt-1 text-sm text-red-600">{{ errors.basic_salary }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                <select 
                  v-model="employeeForm.currency_id" 
                  required 
                  class="form-input"
                  :class="{ 'border-red-500': errors.currency_id }"
                >
                  <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                    {{ currency.code }} - {{ currency.name }}
                  </option>
                </select>
                <p v-if="errors.currency_id" class="mt-1 text-sm text-red-600">{{ errors.currency_id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Schedule</label>
                <select v-model="employeeForm.payment_schedule" class="form-input">
                  <option value="monthly">Monthly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select v-model="employeeForm.payment_method" class="form-input">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 4: Bank Details -->
          <div v-show="currentStep === 3" class="space-y-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Bank Details</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input v-model="employeeForm.bank_name" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input v-model="employeeForm.bank_account" type="text" class="form-input" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bank Branch</label>
                <input v-model="employeeForm.bank_branch" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bank Code</label>
                <input v-model="employeeForm.bank_code" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">SWIFT Code</label>
                <input v-model="employeeForm.swift_code" type="text" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Step 5: Emergency & Medical -->
          <div v-show="currentStep === 4" class="space-y-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Emergency Contact & Medical Information</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                <input v-model="employeeForm.emergency_contact_name" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                <input v-model="employeeForm.emergency_contact_phone" type="tel" class="form-input" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Medical Aid Provider</label>
                <input v-model="employeeForm.medical_aid_provider" type="text" class="form-input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Medical Aid Number</label>
                <input v-model="employeeForm.medical_aid_number" type="text" class="form-input" />
              </div>
            </div>

            <div class="flex items-center">
              <input
                v-model="employeeForm.is_active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Active Employee</label>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              @click="previousStep"
              :disabled="currentStep === 0"
              class="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            
            <div class="flex space-x-3">
              <button type="button" @click="closeCreateModal" class="btn-secondary">
                Cancel
              </button>
              
              <button
                v-if="currentStep < stepTitles.length - 1"
                type="button"
                @click="nextStep"
                class="btn-primary"
              >
                Next
              </button>
              
              <button
                v-else
                type="submit"
                :disabled="employeesStore.loading"
                class="btn-primary"
              >
                <span v-if="employeesStore.loading">Creating...</span>
                <span v-else>Create Employee</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useEmployeesStore } from '../stores/employees';
import { useDepartmentsStore } from '../stores/departments';
import { usePositionsStore } from '../stores/positions';
import { apiService } from '../services/api';
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Alert from '../components/common/Alert.vue';
import StepProgress from '../components/common/StepProgress.vue';

const employeesStore = useEmployeesStore();
const departmentsStore = useDepartmentsStore();
const positionsStore = usePositionsStore();

const searchQuery = ref('');
const statusFilter = ref('');
const showCreateModal = ref(false);
const currentStep = ref(0);

const stepTitles = [
  'Personal Info',
  'Employment',
  'Salary & Payment',
  'Bank Details',
  'Emergency & Medical'
];

const departments = ref([]);
const currencies = ref([]);
const managers = ref([]);
const availablePositions = ref([]);

// Alert state
const alertState = reactive({
  show: false,
  type: 'info',
  title: '',
  message: ''
});

// Form validation errors
const errors = reactive({});

const employeeForm = reactive({
  // Personal Information
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  phone: '',
  alternative_phone: '',
  national_id: '',
  tax_number: '',
  passport_number: '',
  address: '',
  city: '',
  country: 'Local',
  
  // Employment Details
  employee_number: '',
  position_id: '',
  department_id: '',
  manager_id: '',
  employment_type: 'permanent',
  employment_status: 'active',
  hire_date: '',
  probation_end_date: '',
  contract_end_date: '',
  
  // Salary & Payment
  basic_salary: '',
  currency_id: 1,
  payment_method: 'bank_transfer',
  payment_schedule: 'monthly',
  
  // Bank Details
  bank_name: '',
  bank_account: '',
  bank_branch: '',
  bank_code: '',
  swift_code: '',
  
  // Emergency & Medical
  emergency_contact_name: '',
  emergency_contact_phone: '',
  medical_aid_provider: '',
  medical_aid_number: '',
  is_active: true,
});

const filteredEmployees = computed(() => {
  let filtered = employeesStore.employees;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(emp => 
      emp.first_name.toLowerCase().includes(query) ||
      emp.last_name.toLowerCase().includes(query) ||
      emp.employee_number.toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(emp => emp.employment_status === statusFilter.value);
  }
  
  return filtered;
});

onMounted(async () => {
  await Promise.all([
    employeesStore.fetchEmployees(),
    departmentsStore.fetchDepartments(1, 100),
    loadCurrencies(),
    loadManagers()
  ]);
  departments.value = departmentsStore.departments;
});

const loadCurrencies = async () => {
  try {
    currencies.value = await apiService.getCurrencies();
  } catch (error) {
    console.error('Failed to load currencies:', error);
  }
};

const loadManagers = async () => {
  try {
    const response = await employeesStore.fetchEmployees(1, 100);
    managers.value = employeesStore.employees;
  } catch (error) {
    console.error('Failed to load managers:', error);
  }
};

const loadPositionsForDepartment = async () => {
  if (employeeForm.department_id) {
    try {
      availablePositions.value = await positionsStore.fetchPositionsByDepartment(employeeForm.department_id);
    } catch (error) {
      console.error('Failed to load positions:', error);
    }
  } else {
    availablePositions.value = [];
  }
  employeeForm.position_id = '';
};

const openCreateModal = () => {
  showCreateModal.value = true;
  currentStep.value = 0;
  clearForm();
  clearErrors();
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  currentStep.value = 0;
  clearForm();
  clearErrors();
};

const clearForm = () => {
  Object.assign(employeeForm, {
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    alternative_phone: '',
    national_id: '',
    tax_number: '',
    passport_number: '',
    address: '',
    city: '',
    country: 'Local',
    employee_number: '',
    position_id: '',
    department_id: '',
    manager_id: '',
    employment_type: 'permanent',
    employment_status: 'active',
    hire_date: '',
    probation_end_date: '',
    contract_end_date: '',
    basic_salary: '',
    currency_id: 1,
    payment_method: 'bank_transfer',
    payment_schedule: 'monthly',
    bank_name: '',
    bank_account: '',
    bank_branch: '',
    bank_code: '',
    swift_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_aid_provider: '',
    medical_aid_number: '',
    is_active: true,
  });
};

const clearErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
};

const validateStep = (step: number) => {
  clearErrors();
  
  switch (step) {
    case 0: // Personal Information
      if (!employeeForm.first_name) errors.first_name = 'First name is required';
      if (!employeeForm.last_name) errors.last_name = 'Last name is required';
      if (!employeeForm.email) errors.email = 'Email is required';
      if (!employeeForm.phone) errors.phone = 'Phone is required';
      break;
      
    case 1: // Employment Details
      if (!employeeForm.department_id) errors.department_id = 'Department is required';
      if (!employeeForm.position_id) errors.position_id = 'Position is required';
      if (!employeeForm.hire_date) errors.hire_date = 'Hire date is required';
      break;
      
    case 2: // Salary & Payment
      if (!employeeForm.basic_salary) errors.basic_salary = 'Basic salary is required';
      if (!employeeForm.currency_id) errors.currency_id = 'Currency is required';
      break;
  }
  
  return Object.keys(errors).length === 0;
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (!validateStep(currentStep.value)) return;
  
  try {
    await employeesStore.createEmployee(employeeForm);
    closeCreateModal();
    showAlert('success', 'Success!', 'Employee created successfully');
  } catch (error) {
    console.error('Failed to create employee:', error);
    showAlert('error', 'Error', 'Failed to create employee. Please try again.');
  }
};

const showAlert = (type: string, title: string, message: string) => {
  alertState.show = true;
  alertState.type = type;
  alertState.title = title;
  alertState.message = message;
  
  if (type === 'success') {
    setTimeout(() => {
      alertState.show = false;
    }, 5000);
  }
};

const dismissAlert = () => {
  alertState.show = false;
};

const editEmployee = (employee: any) => {
  console.log('Edit employee:', employee);
};

const deleteEmployee = async (id: number) => {
  if (confirm('Are you sure you want to delete this employee?')) {
    try {
      await employeesStore.deleteEmployee(id);
      showAlert('success', 'Success!', 'Employee deleted successfully');
    } catch (error) {
      console.error('Failed to delete employee:', error);
      showAlert('error', 'Error', 'Failed to delete employee. Please try again.');
    }
  }
};

const previousPage = () => {
  if (employeesStore.page > 1) {
    employeesStore.fetchEmployees(employeesStore.page - 1, employeesStore.limit);
  }
};

const nextPage = () => {
  employeesStore.fetchEmployees(employeesStore.page + 1, employeesStore.limit);
};
</script>
