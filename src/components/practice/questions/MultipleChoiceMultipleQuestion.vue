<template>
  <div class="question-item mb-6">
    <!-- 题号和题干 -->
    <div class="mb-4">
      <p class="text-gray-800 leading-relaxed">
        <strong class="text-gray-900">{{ getQuestionNumbers() }}</strong>
        {{ content.questionText }}
      </p>
    </div>
    
    <!-- 选项列表（多选框） -->
    <div class="space-y-2">
      <label
        v-for="option in content.options"
        :key="option.label"
        class="flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50"
        :class="{
          'border-primary-500 bg-primary-50': isSelected(option.label),
          'border-gray-200': !isSelected(option.label)
        }"
      >
        <input
          type="checkbox"
          :value="option.label"
          :checked="isSelected(option.label)"
          @change="toggleOption(option.label)"
          class="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <div class="flex-1">
          <span class="font-semibold text-gray-900">{{ option.label }}.</span>
          <span class="text-gray-800 ml-2">{{ option.text }}</span>
        </div>
      </label>
    </div>
    
    <!-- 选择提示 -->
    <div class="mt-3 text-sm text-gray-500">
      已选择 {{ selectedCount }} 项
      <span v-if="content.requiredCount" class="ml-2">
        (需要选择 {{ content.requiredCount }} 项)
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MultipleChoiceMultipleContent {
  questionText: string
  options: Array<{ label: string; text: string }>
  requiredCount?: number
}

interface Props {
  questionNumber: number
  content: MultipleChoiceMultipleContent & {
    occupiesQuestions?: number
  }
  modelValue?: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// 当前选中的选项
const selectedOptions = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

const selectedCount = computed(() => selectedOptions.value.length)

// 检查选项是否被选中
function isSelected(label: string): boolean {
  return selectedOptions.value.includes(label)
}

// 切换选项选中状态
function toggleOption(label: string) {
  const current = [...selectedOptions.value]
  const index = current.indexOf(label)
  
  if (index > -1) {
    // 已选中，移除
    current.splice(index, 1)
  } else {
    // 未选中，添加
    current.push(label)
  }
  
  emit('update:modelValue', current)
}

// 获取题号显示（如果占用多个题号）
function getQuestionNumbers(): string {
  const occupies = props.content.occupiesQuestions || 1
  if (occupies === 1) {
    return `${props.questionNumber}.`
  }
  const endNumber = props.questionNumber + occupies - 1
  return `${props.questionNumber}-${endNumber}.`
}
</script>

<style scoped>
input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
</style>

