<template>
    <v-carousel
      v-if="movies.length"
      hide-delimiter-background
      show-arrows="hover"
      height="600"
      class="featured-carousel mb-8"
      cycle
      hide-delimiters
    >
      <v-carousel-item
        v-for="movie in movies"
        :key="movie.imdbID"
        @click="$emit('select', movie.imdbID)"
        style="cursor: pointer"
      >
        <div
          class="carousel-image"
          :style="{
            backgroundImage: `url(${movie.Poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.9)',
            height: '100%',
          }"
        ></div>
        <div class="carousel-gradient"></div>
        <div class="carousel-content">
          <h2 class="text-h3 font-weight-bold mb-2">{{ movie.Title }}</h2>
          <p class="text-h6">{{ movie.Year }}</p>
        </div>
      </v-carousel-item>
    </v-carousel>
  </template>
  
  <script setup lang="ts">
  import type { OMDbShort } from '~/types/movies'
  
  defineProps<{
    movies: OMDbShort[]
  }>()
  
  defineEmits<{
    select: [id: string]
  }>()
  </script>
  
  <style scoped>
  .featured-carousel {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.5);
  }
  
  .carousel-image {
    transform: scale(1.1);
    transition: transform 0.3s ease;
  }
  
  .carousel-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(26, 29, 41, 1) 0%,
      rgba(26, 29, 41, 0.7) 30%,
      rgba(26, 29, 41, 0.4) 60%,
      rgba(26, 29, 41, 0.3) 100%
    );
  }
  
  .carousel-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 64px;
    color: white;
  }
  
  :deep(.v-carousel .v-btn--icon) {
    background: rgba(255, 255, 255, 0.1);
    color: white !important;
    border: 2px solid rgba(255, 255, 255, 0.5);
    height: 48px;
    width: 48px;
    transform: scale(0.8);
    transition: all 0.3s ease;
  }
  
  :deep(.v-carousel .v-btn--icon:hover) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1);
  }
  
  :deep(.v-carousel__controls) {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  }
  </style>