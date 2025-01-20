<template>
  <div class="search-page">
    <v-container class="px-8 py-4">
      <SearchBar
        v-model="searchQuery"
        :loading="loading"
        @search="handleSearch"
      />

      <div v-if="hasSearched" class="mt-8">
        <div v-if="loading" class="d-flex justify-center py-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
          <h3 class="text-h5 text-white mb-2">{{ error }}</h3>
          <p class="text-subtitle-1 text-medium-emphasis">Try with other search terms</p>
        </div>

        <MovieGrid
          v-else
          :movies="movies"
          :total-pages="totalPages"
          v-model="currentPage"
          @select="navigateToMovie"
          @update:model-value="handlePageChange"
        >
          <template #header>
            <h3 v-if="movies.length" class="text-h6 font-weight-medium text-white">
              Results for "{{ searchQuery }}"
            </h3>
          </template>
        </MovieGrid>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'authenticated'
})

const router = useRouter()
const searchQuery = ref('')
const hasSearched = ref(false)

const { 
  movies,
  loading,
  error,
  currentPage,
  totalPages,
  searchMovies
} = useMovies()

async function handleSearch(query: string) {
  if (!query.trim()) return
  hasSearched.value = true
  await searchMovies(query, 1)
}

function handlePageChange(page: number) {
  searchMovies(searchQuery.value, page)
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
</style>