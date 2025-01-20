import { defineStore } from 'pinia'
import { OMDbService } from '~/services/OMDbService'
import type { OMDbShort } from '~/types/movies'

export const useSearchStore = defineStore('search', {
  state: () => ({
    isSearchOpen: false,
    searchQuery: '',
    searchResults: [] as OMDbShort[],
    loading: false,
    error: null as string | null,
    currentPage: 1,
    totalPages: 1
  }),
  
  actions: {
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen
      if (!this.isSearchOpen) {
        this.resetSearch()
      }
    },
    
    resetSearch() {
      this.searchQuery = ''
      this.searchResults = []
      this.error = null
      this.currentPage = 1
      this.totalPages = 1
    },
    
    async searchMovies(query: string, page = 1) {
      if (!query.trim()) return
      this.loading = true
      this.error = null
      
      try {
        const { data } = await OMDbService.searchAll(query, page)
        if (data.Search?.length > 0) {
          this.searchResults = data.Search
          this.totalPages = Math.ceil(parseInt(data.totalResults) / 20)
        } else {
          this.error = 'No results found'
          this.searchResults = []
          this.totalPages = 1
        }
      } catch (e) {
        this.error = 'Error when searching for movies'
        this.searchResults = []
        this.totalPages = 1
      } finally {
        this.loading = false
      }
    }
  }
})