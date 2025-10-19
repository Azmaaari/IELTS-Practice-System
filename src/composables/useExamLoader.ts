import { ref } from 'vue'
import type { ExamData } from '@/types/exam'

export function useExamLoader() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  /**
   * 加载单篇文章
   * 暂时直接从chunks目录加载单个JSON文件
   */
  async function loadExam(examId: string): Promise<ExamData | null> {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`/data/chunks/${examId}.json`)
      
      if (!response.ok) {
        throw new Error(`无法加载文章 ${examId}`)
      }
      
      const data = await response.json()
      
      // 验证数据结构
      if (!data.id || !data.passage || !data.questions) {
        throw new Error('数据格式不正确')
      }
      
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
      console.error('Error loading exam:', e)
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 批量加载文章（用于套题）
   */
  async function loadExams(examIds: string[]): Promise<ExamData[]> {
    const promises = examIds.map(id => loadExam(id))
    const results = await Promise.all(promises)
    return results.filter(exam => exam !== null) as ExamData[]
  }
  
  return {
    loading,
    error,
    loadExam,
    loadExams
  }
}

