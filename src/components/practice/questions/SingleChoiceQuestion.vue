<template>
  <div class="question-item mb-6">
    <p class="text-gray-800 leading-relaxed mb-3">
      <strong class="text-gray-900">{{ questionNumber }}.</strong>
      {{ content.questionText }}
    </p>
    <div class="radio-options flex flex-col gap-2 pl-6">
      <label
        v-for="option in content.options"
        :key="option.label"
        class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
      >
        <input
          type="radio"
          :name="`q${questionNumber}`"
          :value="option.label"
          :checked="modelValue === option.label"
          class="w-4 h-4 mt-1 text-primary-600 focus:ring-primary-500"
          @change="handleChange(option.label)"
        >
        <span class="flex-1">
          <span class="font-semibold text-gray-900">{{ option.label }}</span>
          {{ option.text }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultipleChoiceContent } from '@/types/exam'

interface Props {
  questionNumber: number
  content: MultipleChoiceContent
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

