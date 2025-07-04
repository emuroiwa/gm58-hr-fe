<template>
  <nav class="flex items-center justify-center mb-8">
    <ol class="flex items-center space-x-2">
      <li v-for="(step, index) in steps" :key="index" class="flex items-center">
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium"
            :class="getStepClasses(index)"
          >
            <CheckIcon v-if="index < currentStep" class="w-5 h-5" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="ml-2 text-sm font-medium" :class="getTextClasses(index)">
            {{ step }}
          </span>
        </div>
        <ChevronRightIcon 
          v-if="index < steps.length - 1" 
          class="w-5 h-5 text-gray-400 ml-4" 
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

interface Props {
  steps: string[];
  currentStep: number;
}

const props = defineProps<Props>();

const getStepClasses = (index: number) => {
  if (index < props.currentStep) {
    return 'bg-blue-600 border-blue-600 text-white';
  } else if (index === props.currentStep) {
    return 'bg-blue-100 border-blue-600 text-blue-600';
  } else {
    return 'bg-white border-gray-300 text-gray-500';
  }
};

const getTextClasses = (index: number) => {
  if (index <= props.currentStep) {
    return 'text-blue-600';
  } else {
    return 'text-gray-500';
  }
};
</script>
