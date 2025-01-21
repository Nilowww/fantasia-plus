import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { OMDbService } from '../OMDbService'
import { EOMDbType, type OMDbSearchResponse } from '../../types/movies'

vi.mock('axios')

describe('OMDbService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getList', () => {
    it('fetches movies successfully', async () => {
      const mockResponse = {
        data: {
          Search: [
            {
              Title: 'Test Movie',
              Year: '2024',
              imdbID: 'tt1234567',
              Type: EOMDbType.MOVIE,
              Poster: 'https://example.com/poster.jpg'
            }
          ],
          totalResults: '1',
          Response: 'True'
        } satisfies OMDbSearchResponse
      }

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse)

      const result = await OMDbService.getList('Test', EOMDbType.MOVIE, 1)
      
      if ('Search' in result.data) {
        expect(result.data.Search).toHaveLength(1)
        expect(result.data.Search[0].Title).toBe('Test Movie')
      } else {
        throw new Error('Expected search results but got error response')
      }
    })

    it('handles errors gracefully', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'))

      await expect(OMDbService.getList('Test')).rejects.toThrow('API Error')
    })
  })
})