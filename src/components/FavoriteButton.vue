<template>
    <v-btn
      variant="text"
      :icon="true"
      @click.stop="handleClick"
      :loading="loading"
      class="favorite-btn"
    >
      <v-icon
        :color="isFavorite ? 'red' : 'grey-lighten-1'"
        :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
      ></v-icon>
    </v-btn>
  </template>
  
  <script setup lang="ts">
  import type { OMDbMovie, OMDbSerie } from '~/types/movies';
  import { useFavoritesStore } from '~/stores/favorites';
  
  const props = defineProps<{
    movie: OMDbMovie | OMDbSerie;
  }>();
  
  const loading = ref(false);
  const favoritesStore = useFavoritesStore();
  
  const isFavorite = computed(() => 
    favoritesStore.favorites.some(fav => fav.imdbID === props.movie.imdbID)
  );
  
  async function handleClick() {
    loading.value = true;
    await favoritesStore.toggleFavorite(props.movie);
    loading.value = false;
  }
  </script>
  
  <style scoped>
  .favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
  
  .favorite-btn:hover {
    transform: scale(1.1);
  }
  
  .v-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  </style>