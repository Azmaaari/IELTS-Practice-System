import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/db'
import type { SessionRecord } from '@/types/history'

export const useHistoryStore = defineStore('history', () => {
  // State
  const recentSessions = ref<SessionRecord[]>([])
  const loading = ref(false)
  
  // Getters
  const totalSessions = computed(() => recentSessions.value.length)
  const averageScore = computed(() => {
    if (recentSessions.value.length === 0) return 0
    const sum = recentSessions.value.reduce((acc, s) => acc + s.score, 0)
    return Math.round(sum / recentSessions.value.length * 100) / 100
  })
  
  // Actions
  async function loadRecentSessions(limit = 10) {
    loading.value = true
    try {
      recentSessions.value = await db.sessions
        .orderBy('timestamp')
        .reverse()
        .limit(limit)
        .toArray()
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function saveSession(session: SessionRecord) {
    try {
      await db.sessions.add(session)
      await loadRecentSessions()
    } catch (error) {
      console.error('Error saving session:', error)
      throw error
    }
  }
  
  async function getSessionById(id: string): Promise<SessionRecord | undefined> {
    try {
      return await db.sessions.get(id)
    } catch (error) {
      console.error('Error getting session:', error)
      return undefined
    }
  }
  
  async function deleteSession(id: string) {
    try {
      await db.sessions.delete(id)
      await loadRecentSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  }
  
  return {
    recentSessions,
    loading,
    totalSessions,
    averageScore,
    loadRecentSessions,
    saveSession,
    getSessionById,
    deleteSession
  }
})

