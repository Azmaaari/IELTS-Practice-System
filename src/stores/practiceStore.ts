import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PracticeSession, UserAnswer } from '@/types/practice'

export const usePracticeStore = defineStore('practice', () => {
  // State
  const sessionType = ref<'single' | 'full-test'>('single')
  const currentSession = ref<PracticeSession | null>(null)
  const userAnswers = ref<Record<string, UserAnswer>>({})
  const startTime = ref<number>(0)
  const elapsedTime = ref<number>(0)
  const isPaused = ref(false)
  
  // Getters
  const answeredCount = computed(() => Object.keys(userAnswers.value).length)
  const totalQuestions = computed(() => currentSession.value?.totalQuestions || 0)
  const progress = computed(() => 
    totalQuestions.value > 0 
      ? (answeredCount.value / totalQuestions.value) * 100 
      : 0
  )
  
  // Actions
  function startPractice(session: PracticeSession) {
    currentSession.value = session
    sessionType.value = session.type
    userAnswers.value = {}
    startTime.value = Date.now()
    elapsedTime.value = 0
    isPaused.value = false
  }
  
  function setAnswer(questionId: string, value: string | string[]) {
    userAnswers.value[questionId] = {
      value,
      timestamp: Date.now()
    }
  }
  
  function pauseTimer() {
    isPaused.value = true
  }
  
  function resumeTimer() {
    isPaused.value = false
  }
  
  function resetSession() {
    currentSession.value = null
    userAnswers.value = {}
    startTime.value = 0
    elapsedTime.value = 0
    isPaused.value = false
  }
  
  return {
    sessionType,
    currentSession,
    userAnswers,
    startTime,
    elapsedTime,
    isPaused,
    answeredCount,
    totalQuestions,
    progress,
    startPractice,
    setAnswer,
    pauseTimer,
    resumeTimer,
    resetSession
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['currentSession', 'userAnswers', 'startTime']
  }
})

