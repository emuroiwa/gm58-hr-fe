<template>
  <div v-if="message" class="rounded-md bg-green-50 p-4 mb-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircleIcon class="h-5 w-5 text-green-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-green-800">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-green-700">
          <p>{{ message }}</p>
        </div>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="$emit('dismiss')"
            class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
  message?: string | null;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  message: null,
  title: 'Success',
});

defineEmits<{
  dismiss: [];
}>();
</script>
