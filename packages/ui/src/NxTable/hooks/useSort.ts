import { ref } from 'vue'

export function useSort() {
  const sortBy = ref<string | null>(null)
  const sortOrder = ref<'asc' | 'desc' | null>(null)

  return {
    sortBy,
    sortOrder,
    setSort(field: string, order: 'asc' | 'desc') {
      sortBy.value = field
      sortOrder.value = order
    },
  }
}
