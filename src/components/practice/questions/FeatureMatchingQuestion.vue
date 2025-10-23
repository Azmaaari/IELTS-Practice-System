<template>
  <div class="question-item mb-6">
    <!-- 题号和待匹配项 -->
    <div class="flex items-start gap-4">
      <strong class="text-gray-900 min-w-[3rem]">{{ questionNumber }}.</strong>
      <div class="flex-1">
        <p class="text-gray-800 mb-2">{{ content.statement }}</p>
        
        <!-- Dropzone区域 -->
        <div
          class="dropzone relative min-h-[40px] border-2 border-dashed rounded-md p-2 transition-colors"
          :class="dropzoneClass"
          @drop="handleDrop"
          @dragover.prevent="isDragOver = true"
          @dragleave="isDragOver = false"
        >
          <!-- 已选择的答案 -->
          <div v-if="modelValue" class="selected-answer flex items-center justify-between bg-primary-100 rounded px-3 py-2">
            <span class="text-primary-900 font-medium">
              {{ modelValue }} - {{ getOptionText(modelValue) }}
            </span>
            <button
              type="button"
              class="text-primary-600 hover:text-primary-800 text-xl leading-none"
              @click="clearAnswer"
              title="清除答案"
            >
              ×
            </button>
          </div>
          
          <!-- 占位提示 -->
          <div v-else class="text-gray-400 text-sm">
            拖拽选项到此处，或点击下方选项选择
          </div>
        </div>
      </div>
    </div>
    
    <!-- 选项池（如果需要显示） -->
    <div v-if="showOptionsPool && content.options" class="options-pool mt-3 ml-14">
      <div class="text-xs text-gray-500 mb-2">可选项：</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in availableOptions"
          :key="option.label"
          type="button"
          class="drag-item px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-sm cursor-pointer transition-colors"
          :class="{ 'opacity-50': isOptionUsed(option.label) && !content.canReuse }"
          :disabled="isOptionUsed(option.label) && !content.canReuse"
          @click="selectOption(option.label)"
          draggable="true"
          @dragstart="(e) => handleDragStart(option.label, e)"
        >
          <span class="font-semibold">{{ option.label }}</span> {{ option.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FeatureMatchingContent } from '@/types/exam'

interface Props {
  questionNumber: number
  content: FeatureMatchingContent
  modelValue?: string
  showOptionsPool?: boolean
  usedOptions?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  showOptionsPool: false,  // 默认不显示选项池，统一在题组底部显示
  usedOptions: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isDragOver = ref(false)
const draggedOption = ref<string | null>(null)

const dropzoneClass = computed(() => ({
  'border-gray-300 bg-gray-50': !isDragOver.value && !props.modelValue,
  'border-primary-400 bg-primary-50': isDragOver.value,
  'border-primary-500 bg-white': props.modelValue
}))

const availableOptions = computed(() => {
  return props.content.options || []
})

function isOptionUsed(label: string): boolean {
  if (props.content.canReuse) return false
  return props.usedOptions.includes(label) && props.modelValue !== label
}

function getOptionText(label: string): string {
  const option = props.content.options?.find(opt => opt.label === label)
  return option ? option.text : ''
}

function handleDragStart(label: string, event?: DragEvent) {
  draggedOption.value = label
  // 拖拽数据
  if (event && event.dataTransfer) {
    event.dataTransfer.setData('text/plain', label)
    event.dataTransfer.effectAllowed = 'move'
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  
  // 从dataTransfer获取数据
  const droppedValue = event.dataTransfer?.getData('text/plain')
  
  if (droppedValue) {
    selectOption(droppedValue)
  } else if (draggedOption.value) {
    selectOption(draggedOption.value)
  }
  
  draggedOption.value = null
}

function selectOption(label: string) {
  // 如果不能重复使用且已被使用，不允许选择
  if (isOptionUsed(label)) return
  
  emit('update:modelValue', label)
}

function clearAnswer() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.dropzone {
  min-height: 48px;
}

.drag-item:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.selected-answer {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

