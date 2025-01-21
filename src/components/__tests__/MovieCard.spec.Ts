import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '../MovieCard.vue'
import { EOMDbType, type OMDbShort } from '../../types/movies'

describe('MovieCard', () => {
  let wrapper: ReturnType<typeof mount>
  const mockMovie: OMDbShort = {
    Title: 'Test Movie',
    Year: '2024',
    imdbID: 'tt1234567',
    Type: EOMDbType.MOVIE,
    Poster: 'https://example.com/poster.jpg'
  }

  beforeEach(() => {
    wrapper = mount(MovieCard, {
      props: {
        movie: mockMovie
      }
    })
  })

  it('renders movie information correctly', () => {
    expect(wrapper.text()).toContain(mockMovie.Title)
    expect(wrapper.text()).toContain(mockMovie.Year)
    expect(wrapper.find('img').attributes('alt')).toBe(mockMovie.Title + ' poster')
    expect(wrapper.attributes('role')).toBe('article')
  })

  it('emits click event with movie ID on click', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted().click[0]).toEqual([mockMovie.imdbID])
  })

  it('emits click event with movie ID on enter key', async () => {
    await wrapper.trigger('keydown.enter')
    expect(wrapper.emitted().click[0]).toEqual([mockMovie.imdbID])
  })

  it('shows placeholder image when poster is N/A', async () => {
    const movieWithoutPoster = { ...mockMovie, Poster: 'N/A' }
    const wrapperWithoutPoster = mount(MovieCard, {
      props: {
        movie: movieWithoutPoster
      }
    })
    expect(wrapperWithoutPoster.find('img').attributes('src')).toContain('placeholder.jpg')
  })

  it('applies hover styles correctly', async () => {
    expect(wrapper.classes()).not.toContain('on-hover')
    await wrapper.trigger('mouseenter')
    expect(wrapper.classes()).toContain('on-hover')
  })
})