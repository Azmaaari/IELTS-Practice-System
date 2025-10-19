import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Manifest, ExamData, ChunkCache } from '@/types/exam'

export const useExamStore = defineStore('exam', () => {
  // State
  const manifest = ref<Manifest | null>(null)
  const chunkCache = ref<Map<string, ChunkCache>>(new Map())
  const currentExam = ref<ExamData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const totalExams = computed(() => manifest.value?.totalExams || 0)
  const examsByDifficulty = computed(() => {
    if (!manifest.value) return { 1: [], 2: [], 3: [] }
    
    const grouped: Record<number, any[]> = { 1: [], 2: [], 3: [] }
    manifest.value.index.forEach(item => {
      grouped[item.d].push(item)
    })
    return grouped
  })
  
  // Actions
  async function loadManifest() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/data/manifest.json')
      if (!response.ok) {
        throw new Error('Failed to load manifest')
      }
      manifest.value = await response.json()
    } catch (e) {
      error.value = '加载题库索引失败'
      console.error('Error loading manifest:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function loadExam(examId: string): Promise<ExamData | null> {
    loading.value = true
    error.value = null
    
    try {
      // 查找exam在manifest中的信息
      const examInfo = manifest.value?.index.find(item => item.id === examId)
      if (!examInfo) {
        throw new Error(`Exam ${examId} not found in manifest`)
      }
      
      // 检查chunk缓存
      const chunkId = examInfo.c
      let chunkData = chunkCache.value.get(chunkId)
      
      // 如果缓存不存在或过期，加载chunk
      if (!chunkData || Date.now() - chunkData.timestamp > 3600000) {
        const response = await fetch(`/data/chunks/${chunkId}.json`)
        if (!response.ok) {
          throw new Error(`Failed to load chunk ${chunkId}`)
        }
        const data = await response.json()
        chunkData = {
          data: data.data,
          timestamp: Date.now()
        }
        chunkCache.value.set(chunkId, chunkData)
      }
      
      // 从chunk中提取目标exam
      const exam = chunkData.data[examInfo.o]
      if (!exam) {
        throw new Error(`Exam not found at offset ${examInfo.o} in chunk ${chunkId}`)
      }
      
      currentExam.value = exam
      return exam
    } catch (e) {
      error.value = '加载文章失败'
      console.error('Error loading exam:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  function clearCache() {
    chunkCache.value.clear()
  }
  
  return {
    manifest,
    chunkCache,
    currentExam,
    loading,
    error,
    totalExams,
    examsByDifficulty,
    loadManifest,
    loadExam,
    clearCache
  }
})

