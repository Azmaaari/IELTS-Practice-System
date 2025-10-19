<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-primary-600 mb-6">
        IELTS 阅读练习平台
      </h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- 统计卡片 -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-2">总练习次数</h3>
          <p class="text-3xl font-bold text-primary-600">{{ totalSessions }}</p>
        </div>
        <div class="card">
          <h3 class="text-lg font-semibold mb-2">平均正确率</h3>
          <p class="text-3xl font-bold text-primary-600">{{ averageScore }}%</p>
        </div>
        <div class="card">
          <h3 class="text-lg font-semibold mb-2">题库总数</h3>
          <p class="text-3xl font-bold text-primary-600">{{ totalExams }}</p>
        </div>
      </div>

      <!-- 快速开始 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card hover:shadow-lg transition-shadow cursor-pointer" @click="goToSearch">
          <h2 class="text-2xl font-bold mb-4">🔍 搜索单篇文章</h2>
          <p class="text-gray-600">自由选择任意文章进行练习</p>
        </div>
        <div class="card hover:shadow-lg transition-shadow cursor-pointer" @click="startFullTest">
          <h2 class="text-2xl font-bold mb-4">📝 开始完整套题</h2>
          <p class="text-gray-600">模拟真实考试（60分钟）</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useExamStore, useHistoryStore } from '@/stores'

const router = useRouter()
const examStore = useExamStore()
const historyStore = useHistoryStore()

const totalExams = computed(() => examStore.totalExams)
const totalSessions = computed(() => historyStore.totalSessions)
const averageScore = computed(() => historyStore.averageScore)

function goToSearch() {
  router.push('/search')
}

function startFullTest() {
  router.push('/practice/full-test/confirm')
}
</script>

