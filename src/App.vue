<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useExamStore } from '@/stores/examStore'

const examStore = useExamStore()

onMounted(async () => {
  // 加载manifest
  try {
    await examStore.loadManifest()
  } catch (error) {
    console.error('Failed to load manifest:', error)
  }
})
</script>

<style>
/* 全局样式已在 styles/index.css 中定义 */
</style>
