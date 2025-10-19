import { ref, computed } from 'vue'
import Fuse from 'fuse.js'

interface SearchItem {
  id: string
  title: string
  difficulty: 1 | 2 | 3
  questionCount: number
  questionTypes: string[]
}

interface SearchIndex {
  version: string
  items: SearchItem[]
}

export function useSearch() {
  const searchIndex = ref<SearchIndex | null>(null)
  const searchResults = ref<SearchItem[]>([])
  const searchKeyword = ref('')
  const selectedDifficulty = ref<number[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  let fuse: Fuse<SearchItem> | null = null
  
  /**
   * 加载搜索索引
   */
  async function loadSearchIndex() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/data/search-index.json')
      if (!response.ok) {
        throw new Error('无法加载搜索索引')
      }
      
      searchIndex.value = await response.json()
      
      // 初始化Fuse.js
      if (searchIndex.value) {
        fuse = new Fuse(searchIndex.value.items, {
          keys: ['title'],
          threshold: 0.3,
          includeScore: true
        })
        
        // 默认显示所有文章
        searchResults.value = searchIndex.value.items
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载搜索索引失败'
      console.error('Error loading search index:', e)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 执行搜索
   */
  function search(keyword: string) {
    searchKeyword.value = keyword
    performSearch()
  }
  
  /**
   * 筛选难度
   */
  function filterByDifficulty(difficulties: number[]) {
    selectedDifficulty.value = difficulties
    performSearch()
  }
  
  /**
   * 执行搜索和筛选
   */
  function performSearch() {
    if (!searchIndex.value) return
    
    let results = searchIndex.value.items
    
    // 关键词搜索
    if (searchKeyword.value && fuse) {
      const fuseResults = fuse.search(searchKeyword.value)
      results = fuseResults.map(r => r.item)
    }
    
    // 难度筛选
    if (selectedDifficulty.value.length > 0) {
      results = results.filter(item => 
        selectedDifficulty.value.includes(item.difficulty)
      )
    }
    
    searchResults.value = results
  }
  
  /**
   * 清空搜索
   */
  function clearSearch() {
    searchKeyword.value = ''
    selectedDifficulty.value = []
    if (searchIndex.value) {
      searchResults.value = searchIndex.value.items
    }
  }
  
  // 统计信息
  const totalResults = computed(() => searchResults.value.length)
  const difficultyStats = computed(() => {
    const stats = { 1: 0, 2: 0, 3: 0 }
    searchResults.value.forEach(item => {
      stats[item.difficulty]++
    })
    return stats
  })
  
  return {
    searchIndex,
    searchResults,
    searchKeyword,
    selectedDifficulty,
    loading,
    error,
    totalResults,
    difficultyStats,
    loadSearchIndex,
    search,
    filterByDifficulty,
    clearSearch
  }
}

