<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Departments</h1>
        <p class="text-gray-600">Manage organizational departments</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Add Department
      </button>
    </div>

    <div class="card">
      <div class="mb-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search departments..."
              class="form-input"
            />
          </div>
          <select v-model="statusFilter" class="form-input w-48">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
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
            <tr v-for="department in filteredDepartments" :key="department.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <BuildingOfficeIcon class="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ department.name }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ department.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">
                  {{ department.description || 'No description' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="department.manager" class="text-sm text-gray-900">
                  {{ department.manager.first_name }} {{ department.manager.last_name }}
                </div>
                <div v-else class="text-sm text-gray-500">No manager assigned</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="department.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'"
                >
                  {{ department.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/departments/${department.id}`"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View
                </router-link>
                <button
                  @click="editDepartment(department)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="deleteDepartment(department.id)"
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
          Showing {{ departmentsStore.departments.length }} of {{ departmentsStore.total }} departments
        </div>
        <div class="flex space-x-2">
          <button
            :disabled="departmentsStore.page <= 1"
            @click="previousPage"
            class="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <button
            :disabled="departmentsStore.departments.length < departmentsStore.limit"
            @click="nextPage"
            class="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Department Modal -->
    <div v-if="showCreateModal || editingDepartment" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingDepartment ? 'Edit Department' : 'Add New Department' }}
          </h3>
        </div>
        <form @submit.prevent="saveDepartment">
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
              <input v-model="departmentForm.name" type="text" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="departmentForm.description" rows="3" class="form-input"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <select v-model="departmentForm.manager_id" class="form-input">
                <option value="">Select Manager</option>
                <option v-for="employee in availableManagers" :key="employee.id" :value="employee.id">
                  {{ employee.first_name }} {{ employee.last_name }} ({{ employee.employee_number }})
                </option>
              </select>
            </div>
            <div class="flex items-center">
              <input
                v-model="departmentForm.is_active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Active</label>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="cancelEdit" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="departmentsStore.loading" class="btn-primary">
              {{ editingDepartment ? 'Update' : 'Create' }} Department
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useDepartmentsStore } from '../stores/departments';
import { useEmployeesStore } from '../stores/employees';
import { PlusIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline';

const departmentsStore = useDepartmentsStore();
const employeesStore = useEmployeesStore();

const searchQuery = ref('');
const statusFilter = ref('');
const showCreateModal = ref(false);
const editingDepartment = ref(null);
const availableManagers = ref([]);

const departmentForm = reactive({
  name: '',
  description: '',
  manager_id: '',
  is_active: true,
});

const filteredDepartments = computed(() => {
  let filtered = departmentsStore.departments;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(dept => 
      dept.name.toLowerCase().includes(query) ||
      dept.description?.toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'true';
    filtered = filtered.filter(dept => dept.is_active === isActive);
  }
  
  return filtered;
});

onMounted(async () => {
  await Promise.all([
    departmentsStore.fetchDepartments(),
    employeesStore.fetchEmployees(1, 100) // Get all employees for manager selection
  ]);
  availableManagers.value = employeesStore.employees;
});

const saveDepartment = async () => {
  try {
    const data = {
      ...departmentForm,
      manager_id: departmentForm.manager_id || null,
    };
    
    if (editingDepartment.value) {
      await departmentsStore.updateDepartment(editingDepartment.value.id, data);
    } else {
      await departmentsStore.createDepartment(data);
    }
    
    cancelEdit();
  } catch (error) {
    console.error('Failed to save department:', error);
  }
};

const editDepartment = (department) => {
  editingDepartment.value = department;
  Object.assign(departmentForm, {
    name: department.name,
    description: department.description || '',
    manager_id: department.manager_id || '',
    is_active: department.is_active,
  });
};

const cancelEdit = () => {
  showCreateModal.value = false;
  editingDepartment.value = null;
  Object.assign(departmentForm, {
    name: '',
    description: '',
    manager_id: '',
    is_active: true,
  });
};

const deleteDepartment = async (id: number) => {
  if (confirm('Are you sure you want to delete this department?')) {
    try {
      await departmentsStore.deleteDepartment(id);
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  }
};

const previousPage = () => {
  if (departmentsStore.page > 1) {
    departmentsStore.fetchDepartments(departmentsStore.page - 1, departmentsStore.limit);
  }
};

const nextPage = () => {
  departmentsStore.fetchDepartments(departmentsStore.page + 1, departmentsStore.limit);
};
</script>
