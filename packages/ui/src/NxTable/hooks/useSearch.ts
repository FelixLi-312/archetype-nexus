import { ref } from 'vue'

export function useSearch<T = Record<string, any>>() {
  const filters = ref<Partial<T>>({})

  return {
    filters,
    setFilters(values: Partial<T>) {
      filters.value = values
    },
    reset() {
      filters.value = {} as Partial<T>
    },
  }
}
