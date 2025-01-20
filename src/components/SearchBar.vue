<template>
    <div class="search-container">
      <v-text-field
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        bg-color="rgba(255, 255, 255, 0.1)"
        color="white"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        class="search-input"
        hide-details
        @keyup.enter="$emit('search', modelValue)"
        :loading="loading"
        clearable
      >
        <template v-slot:append>
          <v-btn
            color="primary"
            @click="$emit('search', modelValue)"
            :loading="loading"
            class="search-button"
          >
            Search
          </v-btn>
        </template>
      </v-text-field>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = withDefaults(defineProps<{
    modelValue: string
    loading?: boolean
    placeholder?: string
  }>(), {
    loading: false,
    placeholder: 'Search movies and series...'
  })
  
  defineEmits<{
    'update:modelValue': [value: string]
    search: [query: string]
  }>()
  </script>
  
  <style scoped>
  .search-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .search-input {
    border-radius: 8px;
  }
  
  :deep(.search-input .v-field__input) {
    color: white !important;
    font-size: 1.1rem;
    padding: 16px;
  }
  
  :deep(.search-input .v-field__append-inner) {
    padding-right: 8px;
  }
  
  :deep(.search-input .v-field__outline) {
    color: rgba(255, 255, 255, 0.1) !important;
  }
  
  :deep(.search-input .v-field__field) {
    color: white !important;
  }
  
  .search-button {
    height: 100%;
    border-radius: 0 8px 8px 0;
    font-weight: 600;
  }
  </style>