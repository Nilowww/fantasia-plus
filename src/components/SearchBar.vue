<template>
  <div class="search-container">
    <v-text-field
      :model-value="modelValue"
      @update:model-value="handleInput"
      :placeholder="placeholder"
      bg-color="rgba(255, 255, 255, 0.1)"
      color="white"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      class="search-input"
      :error-messages="searchError"
      @keyup.enter="handleSearch"
      :loading="loading"
      clearable
      persistent-hint
    >
      <template v-slot:append>
        <v-btn
          color="primary"
          @click="handleSearch"
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
import { useSearchRules } from '~/composables/useSearchRules'

const props = withDefaults(defineProps<{
  modelValue: string
  loading?: boolean
  placeholder?: string
}>(), {
  loading: false,
  placeholder: 'Search movies and series...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
}>()

const { searchError, validateSearch } = useSearchRules()

const handleInput = (value: string) => {
  emit('update:modelValue', value)
  if (value === '') {
    searchError.value = []
  }
}

const handleSearch = () => {
  if (validateSearch(props.modelValue)) {
    emit('search', props.modelValue)
  }
}
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

:deep(.v-messages) {
  color: rgb(244, 67, 54) !important;
  min-height: 24px;
}

.search-button {
  height: 100%;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
}
</style>