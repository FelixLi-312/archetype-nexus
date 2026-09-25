import { ref } from 'vue'

export function useSelection<T = any>() {
  const selectedKeys = ref<T[]>([])
  return {
    selectedKeys,
    setSelected(keys: T[]) {
      selectedKeys.value = keys
    }
  }
}
