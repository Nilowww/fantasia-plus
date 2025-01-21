<template>
  <div class="favorites-page">
    <v-container class="px-8 py-4">
      <div class="d-flex flex-column flex-sm-row align-center mb-6">
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchQuery"
          placeholder="Search favorites..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          class="search-field"
          bg-color="rgba(255, 255, 255, 0.1)"
          color="white"
        ></v-text-field>
      </div>

      <v-row v-if="favoritesStore.loading">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-col>
      </v-row>

      <v-row v-else-if="!favoritesStore.filteredFavorites.length">
        <v-col cols="12">
          <v-alert
            type="info"
            variant="tonal"
            class="text-center"
          >
            No favorites found. Start adding some movies to your favorites!
          </v-alert>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col
          v-for="movie in favoritesStore.filteredFavorites"
          :key="movie.imdbID"
          cols="6"
          sm="6"
          md="4"
          lg="3"
        >
          <MovieCard 
            :movie="movie" 
            @click="navigateToMovie"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '~/stores/favorites';

definePageMeta({
  middleware: 'authenticated'
});

const router = useRouter();
const favoritesStore = useFavoritesStore();
const searchQuery = ref('');

useHead({
  title: 'Fantasia+ | Favorites',
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})

const navigateToMovie = (id: string) => {
  router.push(`/movies/${id}`);
};

watch(searchQuery, (query) => {
  favoritesStore.filterFavorites(query);
});

onMounted(() => {
  favoritesStore.loadFavorites();
});
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
}

.search-field {
  max-width: 300px;
}

:deep(.v-field__input) {
  color: white !important;
}

:deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.1) !important;
}

@media (max-width: 600px) {
  .search-field {
    width: 100%;
    max-width: none;
  }

  .v-container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
</style>