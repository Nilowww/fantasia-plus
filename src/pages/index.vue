<template>
  <div class="movies-page">
    <v-container class="px-8 py-4">
      <!-- Featured Content Slider -->
      <v-carousel
        v-if="loaded && movies.length"
        hide-delimiter-background
        show-arrows="hover"
        height="600"
        class="featured-carousel mb-8"
        cycle
        hide-delimiters
      >
        <v-carousel-item
          v-for="movie in movies.slice(0, 5)"
          :key="movie.imdbID"
          @click="navigateToMovie(movie.imdbID)"
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

      <!-- Movies Grid -->
      <div class="d-flex align-center justify-space-between mb-4">
        <h3 class="text-h6 font-weight-medium text-white">
          Popular Movies
        </h3>
        <div class="d-flex align-center">
          <v-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            @update:model-value="handlePageChange"
            class="pagination-custom"
          ></v-pagination>
        </div>
      </div>

      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="2"
          xl="2"
          v-for="(item, index) in movies"
          :key="item.imdbID"
        >
          <v-hover v-if="loaded">
            <template v-slot:default="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 8 : 2"
                :class="['movie-card', { 'on-hover': isHovering }]"
                @click="navigateToMovie(item.imdbID)"
              >
                <v-img
                  :src="item.Poster"
                  :aspect-ratio="2 / 3"
                  cover
                  class="movie-poster"
                >
                  <div v-if="isHovering" class="card-overlay">
                    <div class="pa-4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">
                        {{ item.Title }}
                      </h3>
                      <p class="text-caption">{{ item.Year }}</p>
                    </div>
                  </div>
                </v-img>
              </v-card>
            </template>
          </v-hover>
          <v-skeleton-loader
            v-else
            type="image, article"
            class="skeleton-card"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { OMDbService } from "~/services/OMDbService";
import type { OMDbShort } from "~/types/movies";

definePageMeta({
  middleware: "authenticated",
});

const router = useRouter();
const loaded = ref(false);
const movies = ref<OMDbShort[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);

async function fetchMovies(page = 1) {
  try {
    const response = await OMDbService.getList("movie", undefined, page);
    if (response.data.Response === "True") {
      movies.value = response.data.Search;
      totalPages.value = Math.ceil(parseInt(response.data.totalResults) / 10);
    } else {
      message.error("No se pudieron cargar las películas");
    }
  } catch (error) {
    message.error("Error al cargar las películas");
  } finally {
    loaded.value = true;
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchMovies(page);
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigateToMovie(id: string) {
  router.push(`/movies/${id}`);
}

onMounted(() => fetchMovies());
</script>

<style scoped>
.movies-page {
  min-height: 100vh;
}
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
.skeleton-card {
  height: 100%;
  border-radius: 4px;
}
:deep(.v-skeleton-loader__image) {
  aspect-ratio: 2/3;
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
