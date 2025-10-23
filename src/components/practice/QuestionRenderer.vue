<template>
  <div class="question-renderer">
    <!-- 题目说明 -->
    <h4 v-if="showInstruction" class="instruction text-base font-semibold text-gray-700 mb-4">
      {{ question.instruction }}
    </h4>

    <!-- 动态渲染题型组件 -->
    <component
      :is="questionComponent"
      :question-number="question.questionNumber"
      :content="question.content"
      v-model="answer"
      @update:model-value="handleAnswerChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import type { Question } from '@/types/exam'

interface Props {
  question: Question
  modelValue?: string | string[]
  showInstruction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showInstruction: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const answer = ref(props.modelValue || '')

watch(() => props.modelValue, (newVal) => {
  answer.value = newVal || ''
})

// 根据题型动态加载组件
const questionComponent = computed(() => {
  const componentMap: Record<string, any> = {
    'true-false-ng': defineAsyncComponent(() => 
      import('./questions/TrueFalseQuestion.vue')
    ),
    'yes-no-ng': defineAsyncComponent(() => 
      import('./questions/TrueFalseQuestion.vue')
    ),
    'multiple-choice-single': defineAsyncComponent(() => 
      import('./questions/SingleChoiceQuestion.vue')
    ),
    'heading-matching': defineAsyncComponent(() => 
      import('./questions/HeadingMatchingQuestion.vue')
    ),
    'notes-completion': defineAsyncComponent(() => 
      import('./questions/NotesCompletionQuestion.vue')
    ),
    'summary-completion': defineAsyncComponent(() => 
      import('./questions/NotesCompletionQuestion.vue')
    ),
    'sentence-completion': defineAsyncComponent(() => 
      import('./questions/NotesCompletionQuestion.vue')
    ),
    'paragraph-matching': defineAsyncComponent(() => 
      import('./questions/ParagraphMatchingQuestion.vue')
    ),
    'feature-matching': defineAsyncComponent(() => 
      import('./questions/FeatureMatchingQuestion.vue')
    ),
    'statement-matching': defineAsyncComponent(() => 
      import('./questions/FeatureMatchingQuestion.vue')
    ),
    'table-completion': defineAsyncComponent(() => 
      import('./questions/NotesCompletionQuestion.vue')
    ),
    'short-answer': defineAsyncComponent(() => 
      import('./questions/NotesCompletionQuestion.vue')
    ),
    'sentence-ending-matching': defineAsyncComponent(() => 
      import('./questions/SentenceEndingQuestion.vue')
    ),
    'multiple-choice-multiple': defineAsyncComponent(() => 
      import('./questions/MultipleChoiceMultipleQuestion.vue')
    )
  }
  
  const component = componentMap[props.question.type]
  
  if (!component) {
    console.warn(`未实现的题型: ${props.question.type}`)
    return null
  }
  
  return component
})

function handleAnswerChange(value: string | string[]) {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.instruction {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
}
</style>

