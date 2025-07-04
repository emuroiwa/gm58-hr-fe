<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
        <p class="text-gray-600">Manage your account settings</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="card mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
            
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    :value="authStore.user?.username"
                    type="text"
                    readonly
                    class="form-input bg-gray-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    :value="authStore.user?.role"
                    type="text"
                    readonly
                    class="form-input bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  :value="authStore.user?.email"
                  type="email"
                  readonly
                  class="form-input bg-gray-50"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <input
                  :value="formatDate(authStore.user?.last_login)"
                  type="text"
                  readonly
                  class="form-input bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div v-if="authStore.user?.employee" class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Employee Information</h3>
            
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
                  <input
                    :value="authStore.user.employee.employee_number"
                    type="text"
                    readonly
                    class="form-input bg-gray-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    :value="authStore.user.employee.position?.title"
                    type="text"
                    readonly
                    class="form-input bg-gray-50"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    :value="authStore.user.employee.first_name"
                    type="text"
                    readonly
                    class="form-input bg-gray-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    :value="authStore.user.employee.last_name"
                    type="text"
                    readonly
                    class="form-input bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  :value="authStore.user.employee.position?.department?.name"
                  type="text"
                  readonly
                  class="form-input bg-gray-50"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                <input
                  :value="`${authStore.user.employee.currency?.symbol}${authStore.user.employee.basic_salary?.toLocaleString()}`"
                  type="text"
                  readonly
                  class="form-input bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="card mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            
            <form @submit.prevent="handlePasswordChange">
              <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
              
              <div v-if="success" class="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-sm text-green-600">Password changed successfully!</p>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    v-model="passwordForm.current_password"
                    type="password"
                    required
                    class="form-input"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    v-model="passwordForm.new_password"
                    type="password"
                    required
                    class="form-input"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    v-model="passwordForm.confirm_password"
                    type="password"
                    required
                    class="form-input"
                  />
                </div>
                
                <button
                  type="submit"
                  :disabled="authStore.loading"
                  class="btn-primary w-full"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            
            <div class="space-y-3">
              <button
                @click="refreshProfile"
                class="btn-secondary w-full"
                :disabled="authStore.loading"
              >
                Refresh Profile
              </button>
              
              <router-link
                v-if="authStore.user?.employee"
                :to="`/employees/${authStore.user.employee.id}`"
                class="btn-secondary w-full text-center block"
              >
                View Employee Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const error = ref('');
const success = ref(false);

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
});

const handlePasswordChange = async () => {
  try {
    error.value = '';
    success.value = false;
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      error.value = 'New passwords do not match';
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      error.value = 'New password must be at least 6 characters long';
      return;
    }
    
    await authStore.changePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
    });
    
    success.value = true;
    
    // Reset form
    Object.assign(passwordForm, {
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    
  } catch (err) {
    error.value = authStore.error || 'Failed to change password';
  }
};

const refreshProfile = async () => {
  try {
    await authStore.fetchProfile();
  } catch (error) {
    console.error('Failed to refresh profile:', error);
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
};
</script>
