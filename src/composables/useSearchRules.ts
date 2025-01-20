import { ref } from 'vue'

export function useSearchRules() {
  const searchError = ref<string[]>([])

  const validateSearch = (query: string): boolean => {
    searchError.value = []
    
    if (!query || query.length < 3) {
      searchError.value.push('Search must be at least 3 characters')
      return false
    }
    
    const pattern = /^[a-zA-Z0-9\s]+$/
    if (!pattern.test(query)) {
      searchError.value.push('Search can only contain letters, numbers and spaces')
      return false
    }

    return true
  }

  return {
    searchError,
    validateSearch
  }
}