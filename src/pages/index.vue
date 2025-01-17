<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="3" v-for="index in 12" :key="index" v-if="!loaded">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-col>
        <v-col cols="3" v-else v-for="movie in movies" :key="movie.Title">
          <v-card class="pa-2" outlined>
            <v-img :src="movie.Poster" width="100%" />
            <v-divider></v-divider>
            <div class="text-center">
              <div>
                {{ movie.Title }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { OMDbService } from '~/services/OMDbService';
import { EOMDbType } from '~/types/movies';
import type { OMDbShort } from '~/types/movies';


definePageMeta({
  middleware: "authenticated",
});

const loaded = ref(false);
const movies = ref<OMDbShort[]>([]);

async function handleClick() {
  const value = (await OMDbService.getList("movie"));
  if (value.data.Response === "True") {
    movies.value = value.data.Search;
  } else {
    message.error("Error");
  }
  loaded.value = true;
}

onMounted(() => handleClick());

</script>