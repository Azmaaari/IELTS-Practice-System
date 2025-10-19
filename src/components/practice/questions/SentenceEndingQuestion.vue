<template>
  <div class="question-item mb-6">
    <div class="flex items-start gap-4">
      <strong class="text-gray-900 min-w-[3rem]">{{ questionNumber }}.</strong>
      <div class="flex-1">
        <!-- 句子前半部分 + input框 -->
        <p class="text-gray-800 mb-2">
          {{ content.sentenceStem }}
          <input
            type="text"
            class="ending-input mx-2"
            :name="`q${questionNumber}`"
            :value="modelValue"
            @input="handleInput"
            @blur="validateInput"
            maxlength="1"
            placeholder="A–F"
          >
        </p>
        
        <!-- 如果有错误提示 -->
        <p v-if="errorMessage" class="text-red-500 text-sm mt-1 ml-14">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface SentenceEndingContent {
  sentenceStem: string
  options: Array<{ label: string; text: string }>
  canReuse: boolean
}

interface Props {
  questionNumber: number
  content: SentenceEndingContent
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const errorMessage = ref('')

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.toUpperCase().trim()
  
  // 只允许A-F字母
  if (value && !/^[A-F]$/.test(value)) {
    errorMessage.value = 'Please enter a letter from A to F'
    return
  }
  
  errorMessage.value = ''
  emit('update:modelValue', value)
}

function validateInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.toUpperCase().trim()
  
  if (value && !/^[A-F]$/.test(value)) {
    errorMessage.value = 'Please enter a letter from A to F'
    target.value = ''
    emit('update:modelValue', '')
  } else {
    errorMessage.value = ''
  }
}
</script>

<style scoped>
.ending-input {
  display: inline-block;
  width: 40px;
  padding: 0.25rem 0.5rem;
  border: none;
  border-bottom: 2px solid #374151;
  background-color: transparent;
  font-size: inherit;
  font-family: inherit;
  text-align: center;
  text-transform: uppercase;
  outline: none;
  transition: border-color 0.2s;
}

.ending-input:focus {
  border-bottom-color: #3b82f6;
}

.ending-input::placeholder {
  color: #9ca3af;
  font-size: 0.75rem;
  text-transform: none;
}
</style>

