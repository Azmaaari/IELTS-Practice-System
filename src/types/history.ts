import type { UserAnswer, Highlight } from './practice'

// 会话记录
export interface SessionRecord {
  id: string
  type: 'single' | 'full-test'
  timestamp: number
  duration: number
  
  // 单篇练习
  examId?: string
  
  // 套题练习
  exams?: Array<{
    examId: string
    difficulty: 1 | 2 | 3
    score: number
    total: number
  }>
  
  // 成绩
  score: number
  totalQuestions: number
  percentage: number
  
  // 答题详情
  answers: Record<string, UserAnswer>
  correctAnswers: Record<string, string | string[]>
  
  // 高亮和笔记
  highlights?: Highlight[]
  notes?: string
  
  // 分析数据
  questionTypeStats: Record<string, {
    correct: number
    total: number
  }>
}

