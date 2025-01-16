<template>
  <div>
    <NuxtLayout>
      <v-app :class="[user && 'logged']">
        <NuxtPage />
      </v-app>
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
</script>
