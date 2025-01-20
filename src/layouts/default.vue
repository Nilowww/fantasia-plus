<template>
  <v-app>
    <v-app-bar v-if="user" color="rgb(9, 11, 19)" elevation="0" class="px-4">
      <v-container class="d-flex align-center py-1 px-0">
        <nuxt-link to="/" class="text-decoration-none d-flex align-center">
          <v-img src="/assets/fantasia-logo.png" max-width="80" class="mr-8" />
        </nuxt-link>
        
        <v-btn variant="text" class="nav-btn" to="/">
          <v-icon start>mdi-home</v-icon>
          HOME
        </v-btn>
        
        <v-btn variant="text" class="nav-btn" to="/search">
          <v-icon start>mdi-magnify</v-icon>
          SEARCH
        </v-btn>

        <v-spacer />

        <!-- Profile Menu -->
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          location="bottom end"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ props }">
            <v-avatar
              class="cursor-pointer"
              color="primary"
              size="32"
              v-bind="props"
            >
              <v-icon>mdi-account</v-icon>
            </v-avatar>
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
      </v-container>
    </v-app-bar>

    <v-main class="main-content">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { auth } = useSupabaseClient()
const router = useRouter()
const menu = ref(false)

const handleLogout = async () => {
  menu.value = false
  await auth.signOut()
  router.push('/login')
}

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
  background: linear-gradient(to bottom, rgb(26, 29, 41) 0%, rgb(20, 22, 31) 100%);
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
</style>