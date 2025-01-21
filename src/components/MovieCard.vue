<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :elevation="isHovering ? 8 : 2"
        :class="['movie-card', { 'on-hover': isHovering }]"
        @click="$emit('click', movie.imdbID)"
        @keydown.enter="$emit('click', movie.imdbID)"
        role="article"
        tabindex="0"
        :aria-label="'Movie: ' + movie.Title"
      >
        <v-img
          :src="movie.Poster !== 'N/A' ? movie.Poster : placeholderImage"
          :aspect-ratio="2/3"
          cover
          class="movie-poster"
          :alt="movie.Title + ' poster'"
          loading="lazy"
        >
          <div v-if="isHovering" class="card-overlay" role="region" aria-live="polite">
            <div class="pa-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ movie.Title }}</h3>
              <p class="text-caption">{{ movie.Year }}</p>
              <v-chip
                size="small"
                color="primary"
                class="mt-2"
                :aria-label="movie.Type === 'movie' ? 'Movie type' : 'Series type'"
              >
                {{ movie.Type === 'movie' ? 'Movie' : 'Serie' }}
              </v-chip>
            </div>
          </div>
        </v-img>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup lang="ts">
import type { OMDbShort } from '~/types/movies'
import placeholderImage from '@/assets/placeholder.jpg'

defineProps<{
  movie: OMDbShort
}>()

defineEmits<{
  click: [id: string]
}>()
</script>

<style scoped>
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
</style>