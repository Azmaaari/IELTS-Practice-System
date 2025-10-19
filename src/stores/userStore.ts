import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const theme = ref<'light' | 'dark'>('light')
  const fontSize = ref<'small' | 'medium' | 'large'>('medium')
  const highlightColor = ref<'yellow' | 'green' | 'blue'>('yellow')
  const showTimer = ref(true)
  const autoSave = ref(true)
  
  // Actions
  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
  
  function setFontSize(size: 'small' | 'medium' | 'large') {
    fontSize.value = size
  }
  
  function setHighlightColor(color: 'yellow' | 'green' | 'blue') {
    highlightColor.value = color
  }
  
  function toggleTimer() {
    showTimer.value = !showTimer.value
  }
  
  function toggleAutoSave() {
    autoSave.value = !autoSave.value
  }
  
  return {
    theme,
    fontSize,
    highlightColor,
    showTimer,
    autoSave,
    setTheme,
    setFontSize,
    setHighlightColor,
    toggleTimer,
    toggleAutoSave
  }
}, {
  persist: {
    storage: localStorage
  }
})

