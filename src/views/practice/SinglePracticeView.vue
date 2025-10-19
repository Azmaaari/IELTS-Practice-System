<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">单篇练习</h1>
    <div class="card">
      <p class="text-gray-600">文章ID: {{ examId }}</p>
      <p class="text-gray-600 mt-4">单篇练习功能开发中...</p>
      <router-link to="/search" class="btn btn-primary mt-4 inline-block">
        返回搜索
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const examId = route.params.id
</script>

