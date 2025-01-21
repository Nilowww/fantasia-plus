<template>
  <div>
    <div class="d-flex flex-column flex-sm-row align-center justify-space-between mb-4">
      <slot name="header"></slot>
      <v-pagination
        v-if="totalPages > 1"
        :model-value="modelValue"
        :length="totalPages"
        :total-visible="isMobile ? 5 : 7"
        @update:model-value="$emit('update:modelValue', $event)"
        density="comfortable"
        class="pagination-custom mt-4 mt-sm-0"
        rounded="lg"
      ></v-pagination>
    </div>

    <v-row>
      <v-col
        v-for="movie in movies"
        :key="movie.imdbID"
        cols="6"
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
  </div>
</template>

<script setup lang="ts">
import type { OMDbShort } from '~/types/movies'

const isMobile = ref(false)

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

function checkMobile() {
  isMobile.value = window.innerWidth < 600
}

defineProps<{
  movies: OMDbShort[]
  totalPages: number
  modelValue: number
  loading?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: number]
  select: [id: string]
}>()
</script>

<style scoped>
:deep(.pagination-custom) {
  .v-pagination__item {
    color: rgba(255, 255, 255, 0.87);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0 2px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    &--active {
      background: rgb(79, 172, 254) !important;
      border-color: rgb(79, 172, 254) !important;
      color: white !important;
      font-weight: 600;
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
    }

    &--disabled {
      opacity: 0.5;
      background: rgba(255, 255, 255, 0.03) !important;
      border-color: rgba(255, 255, 255, 0.05) !important;
    }
  }

  .v-pagination__prev,
  .v-pagination__next {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.87) !important;
    margin: 0 2px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    &.v-pagination__item--disabled {
      opacity: 0.5;
      background: rgba(255, 255, 255, 0.03) !important;
      border-color: rgba(255, 255, 255, 0.05) !important;
    }
  }
}

@media (max-width: 600px) {
  :deep(.pagination-custom) {
    .v-pagination__item {
      min-width: 36px !important;
      width: 36px;
      height: 36px;
      font-size: 0.875rem;
      margin: 0 1px;
    }

    .v-pagination__prev,
    .v-pagination__next {
      min-width: 36px !important;
      width: 36px;
      height: 36px;
      margin: 0 1px;
    }
  }
}
</style>