import { ref } from 'vue'
import { OMDbService } from '~/services/OMDbService'
import type { OMDbShort, OMDbMovie, OMDbSerie } from '~/types/movies'
import { EOMDbType } from '~/types/movies'

export function useMovies() {
  const movies = ref<OMDbShort[]>([])
  const currentMovie = ref<OMDbMovie | OMDbSerie | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const selectedType = ref<EOMDbType>(EOMDbType.MOVIE)

  function getSearchTerm() {
    return selectedType.value === EOMDbType.MOVIE ? 'movie' : 'series'
  }

  async function fetchMovies(page = 1) {
    loading.value = true
    error.value = null
    try {
      const searchTerm = getSearchTerm()
      const response = await OMDbService.getList(searchTerm, selectedType.value, page)
      if (response.data.Response === 'True') {
        movies.value = response.data.Search
        totalPages.value = Math.ceil(parseInt(response.data.totalResults) / 10)
      } else {
        error.value = `Unable to load ${searchTerm}`
      }
    } catch (e) {
      error.value = `Error loading ${getSearchTerm()}`
    } finally {
      loading.value = false
    }
  }

  async function fetchMovieById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await OMDbService.get(id)
      if (response.data.Response === 'True') {
        currentMovie.value = response.data as OMDbMovie | OMDbSerie
      } else {
        error.value = 'Film not found'
      }
    } catch (e) {
      error.value = 'Error loading movie'
    } finally {
      loading.value = false
    }
  }

  async function searchMovies(query: string, page = 1) {
    if (!query.trim()) return
    loading.value = true
    error.value = null
    try {
      const response = await OMDbService.searchAll(query, page)
      if (response.data.Search.length > 0) {
        movies.value = response.data.Search
        totalPages.value = Math.ceil(parseInt(response.data.totalResults) / 20)
      } else {
        error.value = 'No results found'
        movies.value = []
        totalPages.value = 1
      }
    } catch (e) {
      error.value = 'Error when searching for movies'
      movies.value = []
      totalPages.value = 1
    } finally {
      loading.value = false
    }
  }

  function setType(type: EOMDbType) {
    selectedType.value = type
    currentPage.value = 1
    fetchMovies(1)
  }

  return {
    movies,
    currentMovie,
    loading,
    error,
    currentPage,
    totalPages,
    selectedType,
    fetchMovies,
    fetchMovieById,
    searchMovies,
    setType
  }
}