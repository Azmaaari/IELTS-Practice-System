<template>
  <div class="question-item mb-6">
    <p class="text-gray-800 leading-relaxed mb-3">
      <strong class="text-gray-900">{{ questionNumber }}.</strong>
      {{ content.statement }}
    </p>
    <div class="radio-options flex flex-col gap-2 pl-6">
      <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
        <input
          type="radio"
          :name="`q${questionNumber}`"
          value="TRUE"
          :checked="modelValue === 'TRUE'"
          class="w-4 h-4 text-primary-600 focus:ring-primary-500"
          @change="handleChange('TRUE')"
        >
        <span>TRUE</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
        <input
          type="radio"
          :name="`q${questionNumber}`"
          value="FALSE"
          :checked="modelValue === 'FALSE'"
          class="w-4 h-4 text-primary-600 focus:ring-primary-500"
          @change="handleChange('FALSE')"
        >
        <span>FALSE</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
        <input
          type="radio"
          :name="`q${questionNumber}`"
          value="NOT GIVEN"
          :checked="modelValue === 'NOT GIVEN'"
          class="w-4 h-4 text-primary-600 focus:ring-primary-500"
          @change="handleChange('NOT GIVEN')"
        >
        <span>NOT GIVEN</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrueFalseContent } from '@/types/exam'

interface Props {
  questionNumber: number
  content: TrueFalseContent
  modelValue?: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleChange(value: string) {
  emit('update:modelValue', value)
}
</script>

