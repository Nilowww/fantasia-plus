<template>
  <v-app>
    <v-app-bar v-if="user" color="rgb(9, 11, 19)" elevation="0" class="px-4">
      <v-container class="d-flex align-center py-1 px-0">
        <nuxt-link to="/" class="text-decoration-none d-flex align-center">
          <v-img :src="logoImage" max-width="80" class="mr-8" />
        </nuxt-link>

        <v-btn variant="text" class="nav-btn" to="/">
          <v-icon>mdi-home</v-icon>
          <span class="d-none d-sm-inline ml-2">HOME</span>
        </v-btn>

        <v-btn variant="text" class="nav-btn" to="/favorites">
          <v-icon>mdi-heart</v-icon>
          <span class="d-none d-sm-inline ml-2">FAVORITES</span>
        </v-btn>

        <v-btn
          variant="text"
          class="nav-btn d-block d-sm-none"
          @click="searchStore.toggleSearch"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-spacer />

        <div class="d-flex align-center">
          <v-slide-x-transition>
            <div v-if="!searchStore.isSearchOpen" class="d-flex align-center">
              <v-btn
                variant="text"
                class="nav-btn d-none d-sm-flex"
                @click="searchStore.toggleSearch"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>

              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                location="bottom end"
                transition="slide-y-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="text"
                    class="nav-btn"
                    v-bind="props"
                  >
                    <v-icon>mdi-account</v-icon>
                  </v-btn>
                </template>

                <v-card class="profile-menu" min-width="200">
                  <v-list bg-color="rgb(9, 11, 19)">
                    <v-list-item>
                      <v-list-item-title class="text-white">
                        {{ user.email }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item @click="handleLogout" class="logout-item">
                      <template v-slot:prepend>
                        <v-icon>mdi-logout</v-icon>
                      </template>
                      <v-list-item-title>Log Out</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>
          </v-slide-x-transition>

          <v-slide-x-transition>
            <div
              v-if="searchStore.isSearchOpen"
              class="search-container d-flex align-center"
            >
              <v-text-field
                v-model="searchQuery"
                placeholder="Search movies and series..."
                variant="outlined"
                hide-details
                :bg-color="searchError.length ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 255, 255, 0.1)'"
                density="compact"
                class="search-input"
                :loading="searchStore.loading"
                @keyup.esc="searchStore.toggleSearch"
                :error="searchError.length > 0"
              >
                <template v-slot:prepend-inner>
                  <v-icon :color="searchError.length ? 'error' : 'white'"
                    >mdi-magnify</v-icon
                  >
                </template>
              </v-text-field>

              <v-btn
                icon
                class="close-search ml-2"
                @click="searchStore.toggleSearch"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-slide-x-transition>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="main-content">
      <slot />
      <v-expand-transition>
        <div
          v-if="searchStore.isSearchOpen && (searchStore.searchResults.length > 0 || searchStore.error)"
          class="search-results-overlay"
        >
          <v-container class="px-8 py-4">
            <div v-if="searchStore.loading" class="d-flex justify-center py-8">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
            </div>

            <div v-else-if="searchStore.error" class="text-center py-8">
              <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
              <h3 class="text-h5 text-white mb-2">{{ searchStore.error }}</h3>
              <p class="text-subtitle-1 text-medium-emphasis">
                Try with other search terms
              </p>
            </div>

            <MovieGrid
              v-else
              :movies="searchStore.searchResults"
              :total-pages="searchStore.totalPages"
              v-model="searchStore.currentPage"
              @select="handleMovieSelect"
              @update:model-value="handlePageChange"
            >
              <template #header>
                <h3 class="text-h6 font-weight-medium text-white">
                  Results for "{{ searchStore.searchQuery }}"
                </h3>
              </template>
            </MovieGrid>
          </v-container>
        </div>
      </v-expand-transition>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import logoImage from '@/assets/fantasia-logo.png'
import { useSearchStore } from '~/stores/search'
import { useSearchRules } from '~/composables/useSearchRules'

const user = useSupabaseUser()
const { auth } = useSupabaseClient()
const router = useRouter()
const menu = ref(false)
const searchStore = useSearchStore()
const searchQuery = ref('')
const { searchError, validateSearch } = useSearchRules()

// Debounced search function
const debouncedSearch = debounce(async (query: string) => {
  if (query.trim()) {
    if (validateSearch(query)) {
      searchStore.searchQuery = query
      await searchStore.searchMovies(query)
    }
  } else {
    searchStore.resetSearch()
  }
}, 300)

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

const handleLogout = async () => {
  menu.value = false
  await auth.signOut()
  router.push('/login')
}

const handlePageChange = (page: number) => {
  searchStore.searchMovies(searchStore.searchQuery, page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleMovieSelect = (id: string) => {
  router.push(`/movies/${id}`)
  searchStore.toggleSearch()
  searchQuery.value = ''
}

// Reset search query when closing search
watch(() => searchStore.isSearchOpen, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ''
    searchError.value = []
  }
})

watch(
  () => router.currentRoute.value.path,
  () => {
    menu.value = false
  }
)
</script>

<style>
.v-application {
  background: rgb(26, 29, 41) !important;
}

.main-content {
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    rgb(26, 29, 41) 0%,
    rgb(20, 22, 31) 100%
  );
}

.nav-btn {
  color: rgb(249, 249, 249) !important;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1.42px;
  margin-right: 24px;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  transform: scale(1.05);
}

.cursor-pointer {
  cursor: pointer;
}

.profile-menu {
  background: rgb(9, 11, 19) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-item {
  color: white !important;
  transition: background 0.3s ease;
}

.logout-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-list-item__prepend > .v-icon) {
  color: white !important;
}

.search-container {
  width: 350px;
}

.search-input {
  :deep(.v-field__input) {
    color: white !important;
    min-height: 36px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  :deep(.v-field__outline) {
    color: rgba(255, 255, 255, 0.1) !important;
  }
  :deep(.v-field__field) {
    color: white !important;
  }
}

.close-search {
  color: white !important;
}

.search-results-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(26, 29, 41);
  z-index: 99;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .search-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 8px 16px;
    background: rgb(9, 11, 19);
    z-index: 1000;
    width: 100%;
  }

  .close-search {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  .search-results-overlay {
    top: 56px;
  }

  .nav-btn {
    margin-right: 12px;
    min-width: 40px !important;
    padding: 0 8px !important;
  }

  .nav-btn:last-child {
    margin-right: 0;
  }
}
</style>