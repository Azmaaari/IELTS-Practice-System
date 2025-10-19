<template>
  <div class="question-item mb-6">
    <p class="text-gray-800 leading-relaxed">
      <strong class="text-gray-900">{{ questionNumber }}.</strong>
      <template v-for="(part, index) in sentenceParts" :key="index">
        <span v-if="part.type === 'text'">{{ part.content }}</span>
        <input
          v-else
          type="text"
          class="blank mx-1"
          :name="`q${questionNumber}`"
          :value="modelValue"
          @input="handleInput"
          :placeholder="content.wordLimit"
        >
      </template>
    </p>
    <p class="text-xs text-gray-500 mt-2 ml-6">
      {{ content.wordLimit }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompletionContent } from '@/types/exam'

interface Props {
  questionNumber: number
  content: CompletionContent
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 解析句子，分割文本和空格
const sentenceParts = computed(() => {
  const parts: Array<{ type: 'text' | 'blank'; content: string }> = []
  const sentence = props.content.sentence || ''
  const regex = /_{5,}/g
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(sentence)) !== null) {
    // 添加空格前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: sentence.substring(lastIndex, match.index)
      })
    }
    // 添加空格
    parts.push({
      type: 'blank',
      content: ''
    })
    lastIndex = regex.lastIndex
  }
  
  // 添加最后剩余的文本
  if (lastIndex < sentence.length) {
    parts.push({
      type: 'text',
      content: sentence.substring(lastIndex)
    })
  }
  
  return parts
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
/* 使用与HTML工作流一致的.blank样式 */
.blank {
  display: inline-block;
  min-width: 120px;
  padding: 0.25rem 0.5rem;
  border: none;
  border-bottom: 2px solid #374151;
  background-color: transparent;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.blank:focus {
  border-bottom-color: #3b82f6;
}

.blank::placeholder {
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>

