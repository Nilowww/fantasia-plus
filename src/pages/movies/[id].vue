<template>
  <div class="movie-detail-page">
    <v-container class="px-8 py-4" v-if="currentMovie">
      <div class="movie-hero">
        <div
          class="hero-backdrop"
          :style="{ backgroundImage: `url(${currentMovie.Poster})` }"
        ></div>

        <div class="hero-content">
          <div class="content-grid">
            <div class="poster-container">
              <v-img
                :src="currentMovie.Poster"
                :aspect-ratio="2/3"
                class="poster-image"
                cover
              >
                <FavoriteButton :movie="currentMovie" class="favorite-btn" />
              </v-img>
            </div>

            <div class="info-container">
              <h1 class="text-h3 text-sm-h2 font-weight-bold mb-4">{{ currentMovie.Title }}</h1>
              
              <div class="meta-info mb-6">
                <v-chip color="primary" variant="elevated" class="mr-2 mb-2">{{ currentMovie.Year }}</v-chip>
                <v-chip color="secondary" variant="elevated" class="mr-2 mb-2">{{ currentMovie.Rated }}</v-chip>
                <v-chip color="info" variant="elevated" class="mb-2">{{ currentMovie.Runtime }}</v-chip>
                <v-chip 
                  :color="currentMovie.Type === 'movie' ? 'success' : 'warning'" 
                  variant="elevated" 
                  class="ml-2 mb-2"
                >
                  {{ currentMovie.Type === 'movie' ? 'Movie' : 'TV Series' }}
                </v-chip>
                
                <div class="rating-container mt-4">
                  <v-rating
                    v-if="currentMovie.imdbRating"
                    :model-value="Number(currentMovie.imdbRating) / 2"
                    color="amber"
                    half-increments
                    readonly
                    size="small"
                  ></v-rating>
                  <span class="rating-text">IMDb: {{ currentMovie.imdbRating }}/10</span>
                </div>
              </div>

              <div class="plot-section mb-8">
                <p class="text-body-1">{{ currentMovie.Plot }}</p>
              </div>

              <div class="details-grid">
                <div class="detail-item">
                  <h4>Director</h4>
                  <p>{{ currentMovie.Director }}</p>
                </div>

                <div class="detail-item">
                  <h4>Cast</h4>
                  <p>{{ currentMovie.Actors }}</p>
                </div>

                <div class="detail-item">
                  <h4>Genre</h4>
                  <div class="genres-container">
                    <v-chip
                      v-for="genre in currentMovie.Genre.split(', ')"
                      :key="genre"
                      size="small"
                      variant="outlined"
                      class="mr-2 mb-2"
                    >
                      {{ genre }}
                    </v-chip>
                  </div>
                </div>

                <div class="detail-item" v-if="currentMovie.Awards !== 'N/A'">
                  <h4>Awards</h4>
                  <p>{{ currentMovie.Awards }}</p>
                </div>

                <div class="detail-item">
                  <h4>Language</h4>
                  <p>{{ currentMovie.Language }}</p>
                </div>

                <template v-if="isMovie">
                  <div class="detail-item" v-if="movieDetails.BoxOffice !== 'N/A'">
                    <h4>Box Office</h4>
                    <p>{{ movieDetails.BoxOffice }}</p>
                  </div>
                  <div class="detail-item" v-if="movieDetails.DVD !== 'N/A'">
                    <h4>DVD Release</h4>
                    <p>{{ movieDetails.DVD }}</p>
                  </div>
                  <div class="detail-item" v-if="movieDetails.Production !== 'N/A'">
                    <h4>Production</h4>
                    <p>{{ movieDetails.Production }}</p>
                  </div>
                </template>

                <template v-else>
                  <div class="detail-item">
                    <h4>Total Seasons</h4>
                    <p>{{ seriesDetails.totalSeasons }}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>

    <div v-else-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="error" class="error-container">
      <v-alert type="error" variant="tonal" class="error-alert">
        {{ error }}
      </v-alert>
    </div>

    <v-btn
      class="back-button"
      icon="mdi-arrow-left"
      variant="tonal"
      @click="router.back()"
    >
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { OMDbMovie, OMDbSerie } from '~/types/movies'

definePageMeta({ middleware: 'authenticated' })

const route = useRoute()
const router = useRouter()
const { currentMovie, loading, error, fetchMovieById } = useMovies()

useHead({
  title: computed(() => currentMovie.value 
    ? `Fantasia+ | ${currentMovie.value.Title}`
    : 'Fantasia+ | Details'
  )
})

// Type guards
const isMovie = computed(() => currentMovie.value?.Type === 'movie')
const movieDetails = computed(() => currentMovie.value as OMDbMovie)
const seriesDetails = computed(() => currentMovie.value as OMDbSerie)

onMounted(async () => {
  await fetchMovieById(route.params.id as string)
})
</script>

<style scoped>
.movie-detail-page {
  min-height: 100vh;
  color: white;
  padding-top: 64px;
}

.movie-hero {
  position: relative;
  min-height: calc(100vh - 64px);
  border-radius: 16px;
  overflow: hidden;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(70px) brightness(0.3);
  transform: scale(1.2);
}

.hero-content {
  position: relative;
  padding: 48px;
  height: 100%;
}

.content-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 48px;
  max-width: 1400px;
  margin: 0 auto;
}

.poster-container {
  position: sticky;
  top: 100px;
}

.poster-image {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.info-container {
  padding-top: 24px;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.plot-section {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.detail-item {
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.9);
  }
  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }
}

.genres-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.loading-container,
.error-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-alert {
  max-width: 400px;
}

.back-button {
  position: fixed;
  top: 80px;
  left: 24px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white !important;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateX(-4px);
  background: rgba(255, 255, 255, 0.2) !important;
}

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .poster-container {
    max-width: 300px;
    margin: 0 auto;
    position: relative;
    top: 0;
  }

  .hero-content {
    padding: 24px;
  }
}

@media (max-width: 600px) {
  .movie-detail-page {
    padding-top: 56px;
  }

  .movie-hero {
    border-radius: 0;
  }

  .back-button {
    top: 12px;
    left: 16px;
    height: 36px;
    width: 36px;
  }

  .hero-content {
    padding: 16px;
  }

  .content-grid {
    gap: 24px;
  }

  .poster-container {
    max-width: 200px;
    width: 100%;
    margin: 0 auto;
  }

  .poster-image {
    width: 100% !important;
    height: auto !important;
  }

  .meta-info {
    gap: 4px;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  h1 {
    font-size: 1.75rem !important;
    line-height: 1.2;
  }

  .plot-section {
    font-size: 1rem;
  }

  .v-container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
</style>