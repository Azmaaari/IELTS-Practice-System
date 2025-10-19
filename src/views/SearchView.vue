<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-6">
        <router-link to="/" class="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← 返回首页
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">IELTS 阅读题库</h1>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="card mb-6">
        <!-- 搜索框 -->
        <div class="mb-4">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索文章标题..."
            class="input"
            @input="handleSearch"
          >
        </div>

        <!-- 难度筛选 -->
        <div class="flex items-center gap-4 flex-wrap">
          <span class="text-sm font-medium text-gray-700">难度：</span>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="difficulties"
              type="checkbox"
              value="1"
              class="rounded text-primary-600 focus:ring-primary-500"
              @change="handleFilter"
            >
            <span>P1 (简单)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="difficulties"
              type="checkbox"
              value="2"
              class="rounded text-primary-600 focus:ring-primary-500"
              @change="handleFilter"
            >
            <span>P2 (中等)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="difficulties"
              type="checkbox"
              value="3"
              class="rounded text-primary-600 focus:ring-primary-500"
              @change="handleFilter"
            >
            <span>P3 (困难)</span>
          </label>
          
          <button
            v-if="keyword || difficulties.length > 0"
            @click="handleClearSearch"
            class="btn btn-secondary text-sm ml-auto"
          >
            清空筛选
          </button>
        </div>
      </div>

      <!-- 结果统计 -->
      <div class="mb-4 text-sm text-gray-600">
        显示 <span class="font-semibold text-gray-900">{{ totalResults }}</span> / 117 篇文章
        <span v-if="difficultyStats[1] > 0" class="ml-4">
          P1: {{ difficultyStats[1] }}
        </span>
        <span v-if="difficultyStats[2] > 0" class="ml-2">
          P2: {{ difficultyStats[2] }}
        </span>
        <span v-if="difficultyStats[3] > 0" class="ml-2">
          P3: {{ difficultyStats[3] }}
        </span>
      </div>

      <!-- 加载状态 -->
      <div v-if="searchLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="searchError" class="card bg-red-50 border border-red-200">
        <p class="text-red-600">{{ searchError }}</p>
      </div>

      <!-- 文章列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="exam in searchResults"
          :key="exam.id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToPractice(exam.id)"
        >
          <!-- 难度标签 -->
          <div class="flex items-center justify-between mb-3">
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-semibold',
                exam.difficulty === 1 ? 'bg-green-100 text-green-700' :
                exam.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              ]"
            >
              P{{ exam.difficulty }}
            </span>
            <span class="text-sm text-gray-500">{{ exam.questionCount }} 题</span>
          </div>

          <!-- 标题 -->
          <h3 class="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
            {{ exam.title }}
          </h3>

          <!-- 题型标签 -->
          <div class="flex flex-wrap gap-1 mb-4">
            <span
              v-for="type in exam.questionTypes.slice(0, 3)"
              :key="type"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {{ getQuestionTypeName(type) }}
            </span>
            <span
              v-if="exam.questionTypes.length > 3"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              +{{ exam.questionTypes.length - 3 }}
            </span>
          </div>

          <!-- 开始练习按钮 -->
          <button class="btn btn-primary w-full">
            开始练习
          </button>
        </div>
      </div>

      <!-- 无结果 -->
      <div v-if="!searchLoading && searchResults.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">未找到匹配的文章</p>
        <button @click="handleClearSearch" class="btn btn-primary mt-4">
          查看全部
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'

const router = useRouter()

const {
  searchResults,
  loading: searchLoading,
  error: searchError,
  totalResults,
  difficultyStats,
  loadSearchIndex,
  search,
  filterByDifficulty,
  clearSearch
} = useSearch()

const keyword = ref('')
const difficulties = ref<string[]>([])

// 防抖搜索
let searchTimeout: ReturnType<typeof setTimeout> | null = null
function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    search(keyword.value)
  }, 300)
}

// 筛选处理
function handleFilter() {
  const nums = difficulties.value.map(d => parseInt(d))
  filterByDifficulty(nums)
}

// 清空搜索
function handleClearSearch() {
  keyword.value = ''
  difficulties.value = []
  clearSearch()
}

// 跳转到练习页面
function goToPractice(examId: string) {
  router.push(`/practice/${examId}`)
}

// 题型名称映射
function getQuestionTypeName(type: string): string {
  const nameMap: Record<string, string> = {
    'true-false-ng': '判断题',
    'yes-no-ng': '判断题',
    'multiple-choice-single': '单选',
    'multiple-choice-multiple': '多选',
    'notes-completion': '填空',
    'summary-completion': '摘要',
    'sentence-completion': '句子',
    'paragraph-matching': '段落匹配',
    'heading-matching': '标题匹配',
    'feature-matching': '特征匹配',
    'statement-matching': '陈述匹配'
  }
  return nameMap[type] || type
}

// 加载搜索索引
onMounted(async () => {
  await loadSearchIndex()
})
</script>
