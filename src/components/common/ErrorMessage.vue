<template>
  <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ error }}</p>
        </div>
        <div v-if="retry" class="mt-4">
          <button
            @click="$emit('retry')"
            class="bg-red-100 px-2 py-1.5 rounded-md text-red-800 text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="$emit('dismiss')"
            class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
  error?: string | null;
  title?: string;
  retry?: boolean;
}

withDefaults(defineProps<Props>(), {
  error: null,
  title: 'Error',
  retry: false,
});

defineEmits<{
  retry: [];
  dismiss: [];
}>();
</script>
