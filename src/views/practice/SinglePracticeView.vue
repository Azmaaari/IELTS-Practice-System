<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 加载状态 -->
    <div v-if="examLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">加载文章中...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="examError" class="flex items-center justify-center min-h-screen">
      <div class="card max-w-md">
        <h2 class="text-xl font-bold text-red-600 mb-4">加载失败</h2>
        <p class="text-gray-600 mb-6">{{ examError }}</p>
        <router-link to="/search" class="btn btn-primary">
          返回搜索
        </router-link>
      </div>
    </div>

    <!-- 练习界面 -->
    <div v-else-if="examData" class="practice-container">
      <!-- 顶部工具栏 -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div class="w-full flex items-center justify-between">
          <router-link to="/search" class="text-primary-600 hover:text-primary-700">
            ← 返回搜索
          </router-link>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">
              已答: {{ answeredCount }}/{{ examData.metadata.totalQuestions }}
            </span>
            <button @click="handleSubmit" class="btn btn-primary">
              提交答案
            </button>
          </div>
        </div>
      </div>

      <!-- 主要内容区：左右分栏 -->
      <div class="w-full px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 左侧：文章 -->
          <div class="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <PassageViewer :passage="examData.passage" />
          </div>

          <!-- 右侧：题目 -->
          <div class="space-y-6">
            <!-- 按题型分组显示 -->
            <div
              v-for="(group, groupIndex) in questionGroups"
              :key="groupIndex"
              class="question-group bg-white rounded-lg shadow-sm p-6"
            >
              <!-- 题组说明（只显示一次） -->
              <h4 class="instruction text-base font-semibold text-gray-700 mb-6 border-l-4 border-primary-600 pl-4">
                {{ group.instruction }}
              </h4>

              <!-- 题目列表 -->
              <div class="space-y-6">
                <QuestionRenderer
                  v-for="question in group.questions"
                  :key="question.questionNumber"
                  :question="question"
                  :show-instruction="false"
                  v-model="userAnswers[`q${question.questionNumber}`]"
                />
              </div>

      <!-- 拖拽题的选项池（对所有匹配类题型显示） -->
      <OptionPool
        v-if="group.hasOptions && group.options && ['heading-matching', 'paragraph-matching', 'feature-matching', 'statement-matching', 'classification'].includes(group.type)"
        :pool-id="`pool-${groupIndex}`"
        :options="group.options"
        :can-reuse="group.canReuse || false"
        :used-options="getUsedOptionsForGroup(group)"
      />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamLoader } from '@/composables/useExamLoader'
import PassageViewer from '@/components/practice/PassageViewer.vue'
import QuestionRenderer from '@/components/practice/QuestionRenderer.vue'
import OptionPool from '@/components/practice/questions/OptionPool.vue'
import type { ExamData, Question } from '@/types/exam'

const route = useRoute()
const router = useRouter()
const examId = route.params.id as string

const { loading: examLoading, error: examError, loadExam } = useExamLoader()

const examData = ref<ExamData | null>(null)
const userAnswers = ref<Record<string, string | string[]>>({})

// 已答题数量
const answeredCount = computed(() => Object.keys(userAnswers.value).length)

// 按题型和instruction分组题目
const questionGroups = computed(() => {
  if (!examData.value) return []
  
  const groups: Array<{
    instruction: string
    questions: Question[]
    hasOptions: boolean
    options?: Array<{ label: string; text: string }>
    canReuse?: boolean
    type: string
  }> = []
  
  let currentInstruction = ''
  let currentQuestions: Question[] = []
  let currentOptions: Array<{ label: string; text: string }> | undefined
  let currentCanReuse = false
  let currentType = ''
  
  examData.value.questions.forEach((q, index) => {
    // 清理instruction，移除"List of Headings"等选项列表文本
    const cleanInstruction = q.instruction
      .replace(/List of Headings.*$/s, '')
      .replace(/List of Countries.*$/s, '')
      .replace(/List of.*$/s, '')
      .trim()
    
    // 如果instruction或题型变化，开始新的分组
    if ((cleanInstruction !== currentInstruction || q.type !== currentType) && currentQuestions.length > 0) {
      groups.push({
        instruction: currentInstruction,
        questions: currentQuestions,
        hasOptions: !!currentOptions,
        options: currentOptions,
        canReuse: currentCanReuse,
        type: currentType
      })
      currentQuestions = []
      currentOptions = undefined
      currentCanReuse = false
    }
    
    currentInstruction = cleanInstruction
    currentType = q.type
    currentQuestions.push(q)
    
    // 只在第一个题目时提取选项（避免重复）
    if (!currentOptions && 'options' in q.content && Array.isArray(q.content.options)) {
      currentOptions = q.content.options as Array<{ label: string; text: string }>
      currentCanReuse = 'canReuse' in q.content ? Boolean(q.content.canReuse) : false
    }
    
    // 最后一个题目
    if (index === examData.value!.questions.length - 1) {
      groups.push({
        instruction: currentInstruction,
        questions: currentQuestions,
        hasOptions: !!currentOptions,
        options: currentOptions,
        canReuse: currentCanReuse,
        type: currentType
      })
    }
  })
  
  return groups
})

// 加载文章数据
onMounted(async () => {
  const data = await loadExam(examId)
  if (data) {
    examData.value = data
  }
})

// 获取题组中已使用的选项
function getUsedOptionsForGroup(group: any): string[] {
  const used: string[] = []
  group.questions.forEach((q: Question) => {
    const answer = userAnswers.value[`q${q.questionNumber}`]
    if (answer && typeof answer === 'string') {
      used.push(answer)
    }
  })
  return used
}

// 提交答案
function handleSubmit() {
  // 验证是否全部答完
  const totalQuestions = examData.value?.metadata.totalQuestions || 0
  const answeredQuestions = Object.keys(userAnswers.value).length
  
  if (answeredQuestions < totalQuestions) {
    const confirmed = confirm(
      `您还有 ${totalQuestions - answeredQuestions} 道题未作答，确定要提交吗？`
    )
    if (!confirmed) return
  }
  
  // 后续实现评分逻辑
  console.log('用户答案:', userAnswers.value)
  alert('评分功能开发中...')
}
</script>
