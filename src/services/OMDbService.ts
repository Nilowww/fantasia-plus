import axios from "axios";
import { EOMDbType, type OMDbError, type OMDbMovie, type OMDbSearchResponse, type OMDbSerie } from "~/types/movies";

// Add caching
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export class OMDbService {
  private static getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}:${JSON.stringify(params)}`
  }

  private static getCachedData(key: string) {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    cache.delete(key)
    return null
  }

  private static setCachedData(key: string, data: any) {
    cache.set(key, { data, timestamp: Date.now() })
  }

  static async get(id: string) {
    const cacheKey = this.getCacheKey('get', { id })
    const cached = this.getCachedData(cacheKey)
    if (cached) return { data: cached }

    const response = await axios.get<OMDbMovie|OMDbSerie|OMDbError>(`/api/omdb/${id}`)
    this.setCachedData(cacheKey, response.data)
    return response
  }

  static async getList(search: string = "Movie", type?: EOMDbType, page: number = 1) {
    const cacheKey = this.getCacheKey('getList', { search, type, page })
    const cached = this.getCachedData(cacheKey)
    if (cached) return { data: cached }

    let url = `/api/omdb/?s=${search}&page=${page}`
    if (type) {
      url += `&type=${type}`
    }
    const response = await axios.get<OMDbSearchResponse|OMDbError>(url)
    this.setCachedData(cacheKey, response.data)
    return response
  }

  static async searchAll(search: string, page: number = 1) {
    const cacheKey = this.getCacheKey('searchAll', { search, page })
    const cached = this.getCachedData(cacheKey)
    if (cached) return { data: cached }

    const [moviesResponse, seriesResponse] = await Promise.all([
      this.getList(search, EOMDbType.MOVIE, page),
      this.getList(search, EOMDbType.SERIES, page)
    ]);

    const movies = moviesResponse.data.Response === 'True' ? moviesResponse.data : { Search: [], totalResults: '0' };
    const series = seriesResponse.data.Response === 'True' ? seriesResponse.data : { Search: [], totalResults: '0' };

    const combinedResults = {
      Search: [...(movies.Search || []), ...(series.Search || [])],
      totalResults: String(Number(movies.totalResults) + Number(series.totalResults)),
      Response: 'True' as const
    };

    this.setCachedData(cacheKey, combinedResults)
    return { data: combinedResults }
  }
}