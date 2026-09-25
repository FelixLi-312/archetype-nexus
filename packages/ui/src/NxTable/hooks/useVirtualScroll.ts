import { ref } from 'vue'

export function useVirtualScroll() {
  const enabled = ref(false)
  return {
    enabled,
    toggleVirtualScroll() {
      enabled.value = !enabled.value
    }
  }
}
