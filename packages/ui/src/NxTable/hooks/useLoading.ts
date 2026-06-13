import { ref } from 'vue'

export function useLoading() {
  const loading = ref(false)
  return {
    loading,
    start() {
      loading.value = true
    },
    finish() {
      loading.value = false
    },
  }
}
