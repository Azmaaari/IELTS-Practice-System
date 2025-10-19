// Manifest索引项
export interface ManifestItem {
  id: string
  t: string          // title
  d: 1 | 2 | 3       // difficulty
  qc: number         // questionCount
  qt: string[]       // questionTypes
  c: string          // chunk
  o: number          // offset
}

// Manifest
export interface Manifest {
  version: string
  totalExams: number
  lastUpdated: string
  index: ManifestItem[]
}

// 段落
export interface Paragraph {
  label: string | null
  content: string
}

// 文章
export interface Passage {
  title: string
  paragraphs: Paragraph[]
}

// 题型代码
export type QuestionType =
  | 'true-false-ng'
  | 'yes-no-ng'
  | 'multiple-choice-single'
  | 'multiple-choice-multiple'
  | 'sentence-completion'
  | 'summary-completion'
  | 'notes-completion'
  | 'table-completion'
  | 'short-answer'
  | 'paragraph-matching'
  | 'heading-matching'
  | 'feature-matching'
  | 'statement-matching'
  | 'sentence-ending-matching'
  | 'classification'

// 各题型的content接口
export interface TrueFalseContent {
  statement: string
}

export interface MultipleChoiceContent {
  questionText: string
  options: Array<{ label: string; text: string }>
}

export interface MultipleChoiceMultipleContent extends MultipleChoiceContent {
  numberOfAnswers: number
  checkboxGroupName: string
}

export interface CompletionContent {
  sentence: string
  wordLimit: string
  options?: Array<{ label: string; text: string }>
  canReuse?: boolean
}

export interface MatchingContent {
  statement: string
  options?: Array<{ label: string; text: string }>
  canReuse: boolean
}

// 题目基础接口
export interface BaseQuestion {
  questionNumber: number
  type: QuestionType
  instruction: string
  answer?: string | string[]
  explanation?: string
}

// 完整题目类型
export type Question = BaseQuestion & {
  content: TrueFalseContent | MultipleChoiceContent | MultipleChoiceMultipleContent | CompletionContent | MatchingContent
  checkboxGroupName?: string
  occupiesQuestions?: number
}

// 元数据
export interface Metadata {
  difficulty: 1 | 2 | 3
  totalQuestions: number
  questionTypes: string[]
  isHidden: boolean
}

// 完整考试数据
export interface ExamData {
  id: string
  passage: Passage
  questions: Question[]
  metadata: Metadata
}

// Chunk缓存
export interface ChunkCache {
  data: ExamData[]
  timestamp: number
}

