<template>
  <div class="question-item mb-6">
    <p class="text-gray-800 leading-relaxed mb-3 flex items-center gap-2">
      <span
        class="dropzone inline-flex items-center justify-center min-w-[50px] min-h-[40px]"
        :class="{ 'drag-over': isDragOver }"
        :data-target="`q${questionNumber}`"
        @drop="handleDrop"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
      >
        <div
          v-if="droppedValue"
          class="card draggable text-sm"
          draggable="true"
          :data-value="droppedValue"
          @dragstart="handleDragFromDropzone"
        >
          {{ droppedValue }}
        </div>
      </span>
      <strong class="text-gray-900">{{ questionNumber }}.</strong>
      <span>{{ content.statement }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MatchingContent } from '@/types/exam'

interface Props {
  questionNumber: number
  content: MatchingContent
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const droppedValue = ref(props.modelValue || '')
const isDragOver = ref(false)

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  droppedValue.value = newVal || ''
})

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  
  const value = event.dataTransfer?.getData('text/plain')
  if (value) {
    droppedValue.value = value
    emit('update:modelValue', value)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDragFromDropzone(event: DragEvent) {
  if (droppedValue.value) {
    event.dataTransfer?.setData('text/plain', droppedValue.value)
    setTimeout(() => {
      droppedValue.value = ''
      emit('update:modelValue', '')
    }, 0)
  }
}
</script>

<style scoped>
.dropzone {
  padding: 0.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  transition: all 0.2s;
}

.dropzone.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.card.draggable {
  padding: 0.375rem 0.75rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  cursor: move;
  user-select: none;
  font-weight: 600;
}

.card.draggable:active {
  opacity: 0.5;
}
</style>

