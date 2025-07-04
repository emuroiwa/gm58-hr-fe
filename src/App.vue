<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <NavBar v-if="authStore.isAuthenticated" />
    <main :class="authStore.isAuthenticated ? 'ml-64' : ''">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import NavBar from './components/common/NavBar.vue';

const authStore = useAuthStore();

onMounted(async () => {
  // Try to load user profile if token exists
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch (error) {
      console.error('Failed to load user profile:', error);
      authStore.logout();
    }
  }
});
</script>
