<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Employees</h1>
        <p class="text-gray-600">Manage your workforce</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Add Employee
      </button>
    </div>

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
                    <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-primary-600">
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
                  class="text-primary-600 hover:text-primary-900 mr-4"
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

    <!-- Create Employee Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add New Employee</h3>
        </div>
        <form @submit.prevent="createEmployee">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input v-model="newEmployee.first_name" type="text" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input v-model="newEmployee.last_name" type="text" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="newEmployee.email" type="email" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="newEmployee.phone" type="tel" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
              <input v-model="newEmployee.basic_salary" type="number" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Position ID</label>
              <input v-model="newEmployee.position_id" type="number" required class="form-input" />
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="employeesStore.loading" class="btn-primary">
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useEmployeesStore } from '../stores/employees';
import { PlusIcon } from '@heroicons/vue/24/outline';

const employeesStore = useEmployeesStore();

const searchQuery = ref('');
const statusFilter = ref('');
const showCreateModal = ref(false);

const newEmployee = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  basic_salary: 0,
  position_id: 1,
  department_id: 1,
  currency_id: 1,
  employment_type: 'permanent',
  employment_status: 'active',
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

onMounted(() => {
  employeesStore.fetchEmployees();
});

const createEmployee = async () => {
  try {
    await employeesStore.createEmployee(newEmployee);
    showCreateModal.value = false;
    Object.assign(newEmployee, {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      basic_salary: 0,
      position_id: 1,
      department_id: 1,
      currency_id: 1,
      employment_type: 'permanent',
      employment_status: 'active',
    });
  } catch (error) {
    console.error('Failed to create employee:', error);
  }
};

const editEmployee = (employee: any) => {
  // Implement edit functionality
  console.log('Edit employee:', employee);
};

const deleteEmployee = async (id: number) => {
  if (confirm('Are you sure you want to delete this employee?')) {
    try {
      await employeesStore.deleteEmployee(id);
    } catch (error) {
      console.error('Failed to delete employee:', error);
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
