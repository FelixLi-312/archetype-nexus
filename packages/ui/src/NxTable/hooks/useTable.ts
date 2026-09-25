import { ref } from 'vue'

export function useTable<T = any>() {
  const data = ref<T[]>([])
  const loading = ref(false)

  return {
    data,
    loading,
    setData(items: T[]) {
      data.value = items
    }
  }
}
