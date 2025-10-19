import type { ExamData } from './exam'

// 练习会话类型
export type SessionType = 'single' | 'full-test'

// 用户答案
export interface UserAnswer {
  value: string | string[]
  timestamp: number
}

// 单篇练习会话
export interface SinglePracticeSession {
  type: 'single'
  examId: string
  examData: ExamData
  totalQuestions: number
  timeLimit: number  // 秒
}

// 套题练习会话
export interface FullTestSession {
  type: 'full-test'
  exams: Array<{
    examId: string
    examData: ExamData
    difficulty: 1 | 2 | 3
  }>
  totalQuestions: number
  timeLimit: number
}

export type PracticeSession = SinglePracticeSession | FullTestSession

// 高亮标记
export interface Highlight {
  paragraphLabel: string | null
  startOffset: number
  endOffset: number
  text: string
  color: 'yellow' | 'green' | 'blue'
}

// 评分结果
export interface GradingResult {
  score: number
  totalQuestions: number
  percentage: number
  correctAnswers: Record<string, string | string[]>
  userAnswers: Record<string, UserAnswer>
  questionTypeStats: Record<string, {
    correct: number
    total: number
  }>
}

