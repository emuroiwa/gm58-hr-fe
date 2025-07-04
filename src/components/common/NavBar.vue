<template>
  <nav class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-10">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-blue-600">Payroll System</h1>
    </div>
    
    <div class="px-6">
      <div class="space-y-1">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="isActiveRoute(item.to) 
            ? 'bg-blue-100 text-blue-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
      <div class="flex items-center mb-4">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ authStore.user?.username }}</p>
          <p class="text-xs text-gray-500">{{ authStore.user?.role }}</p>
        </div>
      </div>
      
      <div class="space-y-1">
        <router-link
          to="/profile"
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900"
        >
          <UserIcon class="w-5 h-5 mr-3" />
          Profile
        </router-link>
        
        <button
          @click="logout"
          class="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navigationItems = computed(() => [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Employees', to: '/employees', icon: UsersIcon },
  { name: 'Departments', to: '/departments', icon: BuildingOfficeIcon },
  { name: 'Positions', to: '/positions', icon: BriefcaseIcon },
  { name: 'Payroll', to: '/payroll', icon: BanknotesIcon },
  { name: 'Currencies', to: '/currencies', icon: CurrencyDollarIcon },
]);

const isActiveRoute = (to: string) => {
  return route.path.startsWith(to);
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
