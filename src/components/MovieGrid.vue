<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <slot name="header"></slot>
      <v-pagination
        v-if="totalPages > 1"
        :model-value="modelValue"
        :length="totalPages"
        :total-visible="5"
        @update:model-value="$emit('update:modelValue', $event)"
        class="pagination-custom"
      ></v-pagination>
    </div>
  
    <v-fade-transition>
      <v-row>
        <v-col
          v-for="movie in movies"
          :key="movie.imdbID"
          cols="12"
          sm="6"
          md="4"
          lg="2"
          xl="2"
        >
          <MovieCard
            :movie="movie"
            @click="$emit('select', movie.imdbID)"
          />
        </v-col>
      </v-row>
    </v-fade-transition>
  </div>
  </template>
  
  <script setup lang="ts">
  import type { OMDbShort } from '~/types/movies'
  
  defineProps<{
    movies: OMDbShort[]
    totalPages: number
    modelValue: number
  }>()
  
  defineEmits<{
    'update:modelValue': [value: number]
    select: [id: string]
  }>()
  </script>
  
  <style scoped>
  :deep(.pagination-custom) {
    .v-pagination__item {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      &--active {
        background: rgb(79, 172, 254) !important;
      }
    }
  }
  
  :deep(.v-fade-transition-enter-active),
  :deep(.v-fade-transition-leave-active) {
    transition: opacity 0.3s ease;
  }
  
  :deep(.v-fade-transition-enter-from),
  :deep(.v-fade-transition-leave-to) {
    opacity: 0;
  }
  </style>