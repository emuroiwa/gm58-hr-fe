<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Positions</h1>
        <p class="text-gray-600">Manage job positions and roles</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Add Position
      </button>
    </div>

    <div class="card">
      <div class="mb-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search positions..."
              class="form-input"
            />
          </div>
          <select v-model="departmentFilter" class="form-input w-48">
            <option value="">All Departments</option>
            <option v-for="department in departments" :key="department.id" :value="department.name">
              {{ department.name }}
            </option>
          </select>
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
                Position
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary Range
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
            <tr v-for="position in filteredPositions" :key="position.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <BriefcaseIcon class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ position.title }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ position.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ position.department?.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ position.currency?.symbol }}{{ position.min_salary?.toLocaleString() }} - 
                  {{ position.currency?.symbol }}{{ position.max_salary?.toLocaleString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="position.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'"
                >
                  {{ position.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/positions/${position.id}`"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View
                </router-link>
                <button
                  @click="editPosition(position)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="deletePosition(position.id)"
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
          Showing {{ positionsStore.positions.length }} of {{ positionsStore.total }} positions
        </div>
        <div class="flex space-x-2">
          <button
            :disabled="positionsStore.page <= 1"
            @click="previousPage"
            class="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <button
            :disabled="positionsStore.positions.length < positionsStore.limit"
            @click="nextPage"
            class="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Position Modal -->
    <div v-if="showCreateModal || editingPosition" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingPosition ? 'Edit Position' : 'Add New Position' }}
          </h3>
        </div>
        <form @submit.prevent="savePosition">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
              <input v-model="positionForm.title" type="text" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select v-model="positionForm.department_id" required class="form-input">
                <option value="">Select Department</option>
                <option v-for="department in departments" :key="department.id" :value="department.id">
                  {{ department.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select v-model="positionForm.currency_id" required class="form-input">
                <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                  {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
              <input v-model="positionForm.min_salary" type="number" required class="form-input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
              <input v-model="positionForm.max_salary" type="number" required class="form-input" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="positionForm.description" rows="3" class="form-input"></textarea>
            </div>
            <div class="col-span-2 flex items-center">
              <input
                v-model="positionForm.is_active"
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
            <button type="submit" :disabled="positionsStore.loading" class="btn-primary">
              {{ editingPosition ? 'Update' : 'Create' }} Position
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { usePositionsStore } from '../stores/positions';
import { useDepartmentsStore } from '../stores/departments';
import { apiService } from '../services/api';
import { PlusIcon, BriefcaseIcon } from '@heroicons/vue/24/outline';

const positionsStore = usePositionsStore();
const departmentsStore = useDepartmentsStore();

const searchQuery = ref('');
const departmentFilter = ref('');
const statusFilter = ref('');
const showCreateModal = ref(false);
const editingPosition = ref(null);
const departments = ref([]);
const currencies = ref([]);

const positionForm = reactive({
  title: '',
  department_id: '',
  description: '',
  min_salary: 0,
  max_salary: 0,
  currency_id: 1,
  is_active: true,
});

const filteredPositions = computed(() => {
  let filtered = positionsStore.positions;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(pos => 
      pos.title.toLowerCase().includes(query) ||
      pos.department?.name.toLowerCase().includes(query)
    );
  }
  
  if (departmentFilter.value) {
    filtered = filtered.filter(pos => pos.department?.name === departmentFilter.value);
  }
  
  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'true';
    filtered = filtered.filter(pos => pos.is_active === isActive);
  }
  
  return filtered;
});

onMounted(async () => {
  await Promise.all([
    positionsStore.fetchPositions(),
    departmentsStore.fetchDepartments(1, 100),
    loadCurrencies()
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

const savePosition = async () => {
  try {
    const data = {
      ...positionForm,
      min_salary: Number(positionForm.min_salary),
      max_salary: Number(positionForm.max_salary),
    };
    
    if (data.min_salary >= data.max_salary) {
      alert('Minimum salary must be less than maximum salary');
      return;
    }
    
    if (editingPosition.value) {
      await positionsStore.updatePosition(editingPosition.value.id, data);
    } else {
      await positionsStore.createPosition(data);
    }
    
    cancelEdit();
  } catch (error) {
    console.error('Failed to save position:', error);
  }
};

const editPosition = (position) => {
  editingPosition.value = position;
  Object.assign(positionForm, {
    title: position.title,
    department_id: position.department_id,
    description: position.description || '',
    min_salary: position.min_salary,
    max_salary: position.max_salary,
    currency_id: position.currency_id,
    is_active: position.is_active,
  });
};

const cancelEdit = () => {
  showCreateModal.value = false;
  editingPosition.value = null;
  Object.assign(positionForm, {
    title: '',
    department_id: '',
    description: '',
    min_salary: 0,
    max_salary: 0,
    currency_id: 1,
    is_active: true,
  });
};

const deletePosition = async (id: number) => {
  if (confirm('Are you sure you want to delete this position?')) {
    try {
      await positionsStore.deletePosition(id);
    } catch (error) {
      console.error('Failed to delete position:', error);
    }
  }
};

const previousPage = () => {
  if (positionsStore.page > 1) {
    positionsStore.fetchPositions(positionsStore.page - 1, positionsStore.limit);
  }
};

const nextPage = () => {
  positionsStore.fetchPositions(positionsStore.page + 1, positionsStore.limit);
};
</script>
