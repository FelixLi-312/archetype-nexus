import { ref } from 'vue'

export function useFilter() {
  const filters = ref<Record<string, any>>({})

  return {
    filters,
    setFilter(key: string, value: any) {
      filters.value[key] = value
    }
  }
}
