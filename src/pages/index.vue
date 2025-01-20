<template>
  <div class="movies-page">
    <v-container class="px-8 py-4">
      <MovieCarousel
        v-if="!loading && movies.length"
        :movies="movies.slice(0, 5)"
        @select="navigateToMovie"
      />

      <div class="d-flex align-center mb-6">
        <v-chip-group
          v-model="selectedType"
          mandatory
          selected-class="selected-chip"
        >
          <v-chip
            :value="EOMDbType.MOVIE"
            variant="elevated"
            class="mr-2"
          >
            Movies
          </v-chip>
          <v-chip
            :value="EOMDbType.SERIES"
            variant="elevated"
          >
            Series
          </v-chip>
        </v-chip-group>
      </div>

      <Transition
        mode="out-in"
        name="fade"
      >
        <MovieGrid
          :key="currentPage"
          :movies="movies"
          :total-pages="totalPages"
          :loading="loading"
          v-model="currentPage"
          @select="navigateToMovie"
          @update:model-value="handlePageChange"
        >
          <template #header>
            <h3 class="text-h6 font-weight-medium text-white">
            {{ selectedType === EOMDbType.MOVIE ? 'Movies' : 'Series' }}
            </h3>
          </template>
        </MovieGrid>
      </Transition>

      <div v-if="loading" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mt-4"
      >
        {{ error }}
      </v-alert>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { EOMDbType } from '~/types/movies'

definePageMeta({
  middleware: 'authenticated'
})

const router = useRouter()
const { 
  movies,
  loading,
  error,
  currentPage,
  totalPages,
  selectedType,
  fetchMovies,
  setType
} = useMovies()

async function handlePageChange(page: number) {
  await fetchMovies(page)
}

function navigateToMovie(id: string) {
  router.push(`/movies/${id}`)
}

watch(selectedType, (newType) => {
  setType(newType)
})

onMounted(() => fetchMovies())
</script>

<style scoped>
.movies-page {
  min-height: 100vh;
}

:deep(.selected-chip) {
  background-color: rgb(79, 172, 254) !important;
  color: white !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>