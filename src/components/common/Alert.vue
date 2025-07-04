<template>
  <div v-if="show" :class="alertClasses" class="rounded-md p-4 mb-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <component :is="iconComponent" class="h-5 w-5" :class="iconClasses" />
      </div>
      <div class="ml-3">
        <h3 v-if="title" class="text-sm font-medium" :class="titleClasses">
          {{ title }}
        </h3>
        <div class="text-sm" :class="messageClasses">
          <p>{{ message }}</p>
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="$emit('dismiss')"
            type="button"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="dismissClasses"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline';

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  show?: boolean;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  show: true,
  dismissible: true,
});

defineEmits<{
  dismiss: [];
}>();

const alertClasses = computed(() => {
  const baseClasses = 'border';
  const typeClasses = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };
  return icons[props.type];
});

const iconClasses = computed(() => {
  const classes = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };
  return classes[props.type];
});

const titleClasses = computed(() => {
  const classes = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };
  return classes[props.type];
});

const messageClasses = computed(() => {
  const classes = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  };
  return classes[props.type];
});

const dismissClasses = computed(() => {
  const classes = {
    success: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600',
    error: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600',
    warning: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
    info: 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600',
  };
  return classes[props.type];
});
</script>
