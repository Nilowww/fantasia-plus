<template>
    <div class="search-page">
      <v-container class="px-8 py-4">
        <!-- Search Input -->
        <div class="search-container mb-8">
          <v-text-field
            v-model="searchQuery"
            placeholder="Buscar películas y series..."
            bg-color="rgba(255, 255, 255, 0.1)"
            color="white"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            class="search-input"
            hide-details
            @keyup.enter="handleSearch"
            :loading="loading"
            clearable
          >
            <template v-slot:append>
              <v-btn
                color="primary"
                @click="handleSearch"
                :loading="loading"
                class="search-button"
              >
                Buscar
              </v-btn>
            </template>
          </v-text-field>
        </div>
  
        <!-- Results -->
        <div v-if="hasSearched">
          <div v-if="loading" class="d-flex justify-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </div>
  
          <div v-else-if="error" class="text-center py-8">
            <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
            <h3 class="text-h5 text-white mb-2">{{ error }}</h3>
            <p class="text-subtitle-1 text-medium-emphasis">Intenta con otros términos de búsqueda</p>
          </div>
  
          <template v-else>
            <div class="d-flex align-center justify-space-between mb-4">
              <h3 v-if="results.length" class="text-h6 font-weight-medium text-white">
                Resultados para "{{ searchQuery }}"
              </h3>
              <v-pagination
                v-if="totalPages > 1"
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                @update:model-value="handlePageChange"
                class="pagination-custom"
              ></v-pagination>
            </div>
            
            <v-row>
              <v-col
                cols="6"
                sm="4"
                md="3"
                lg="2"
                v-for="item in results"
                :key="item.imdbID"
              >
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      :elevation="isHovering ? 8 : 2"
                      :class="['movie-card', { 'on-hover': isHovering }]"
                      @click="navigateToMovie(item.imdbID)"
                    >
                      <v-img
                        :src="item.Poster !== 'N/A' ? item.Poster : '/placeholder.jpg'"
                        :aspect-ratio="2/3"
                        cover
                        class="movie-poster"
                      >
                        <div v-if="isHovering" class="card-overlay">
                          <div class="pa-4">
                            <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ item.Title }}</h3>
                            <p class="text-caption">{{ item.Year }}</p>
                            <v-chip
                              size="small"
                              color="primary"
                              class="mt-2"
                            >
                              {{ item.Type === 'movie' ? 'Película' : 'Serie' }}
                            </v-chip>
                          </div>
                        </div>
                      </v-img>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </template>
        </div>
      </v-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { OMDbService } from '~/services/OMDbService'
  import type { OMDbShort } from '~/types/movies'
  
  definePageMeta({
    middleware: 'authenticated'
  })
  
  const router = useRouter()
  const searchQuery = ref('')
  const results = ref<OMDbShort[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasSearched = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(1)
  
  async function handleSearch(page = 1) {
    if (!searchQuery.value.trim()) return
  
    loading.value = true
    error.value = null
    hasSearched.value = true
  
    try {
      const response = await OMDbService.getList(searchQuery.value, undefined, page)
      if (response.data.Response === 'True') {
        results.value = response.data.Search
        totalPages.value = Math.ceil(parseInt(response.data.totalResults) / 10)
      } else {
        error.value = 'No se encontraron resultados'
        results.value = []
        totalPages.value = 1
      }
    } catch (e) {
      error.value = 'Error al buscar películas'
      results.value = []
      totalPages.value = 1
    } finally {
      loading.value = false
    }
  }
  
  function handlePageChange(page: number) {
    currentPage.value = page
    handleSearch(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  function navigateToMovie(id: string) {
    router.push(`/movies/${id}`)
  }
  </script>
  
  <style scoped>
  .search-page {
    min-height: 100vh;
    padding-top: 24px;
  }
  
  .search-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .search-input {
    border-radius: 8px;
  }
  
  :deep(.search-input .v-field__input) {
    color: white !important;
    font-size: 1.1rem;
    padding: 16px;
  }
  
  :deep(.search-input .v-field__append-inner) {
    padding-right: 8px;
  }
  
  :deep(.search-input .v-field__outline) {
    color: rgba(255, 255, 255, 0.1) !important;
  }
  
  :deep(.search-input .v-field__field) {
    color: white !important;
  }
  
  .search-button {
    height: 100%;
    border-radius: 0 8px 8px 0;
    font-weight: 600;
  }
  
  .movie-card {
    transition: all 0.3s ease;
    background: rgb(49, 52, 62);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .movie-card.on-hover {
    transform: scale(1.05);
  }
  
  .movie-poster {
    transition: transform 0.3s ease;
  }
  
  .card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .movie-card.on-hover .card-overlay {
    opacity: 1;
  }
  
  :deep(.pagination-custom) {
    .v-pagination__item {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      
      &--active {
        background: rgb(79, 172, 254) !important;
      }
    }
  }
  </style>