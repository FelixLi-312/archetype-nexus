import { ref } from 'vue'

export function useRowKey<T = any>(keyField = 'id') {
  const rowKey = ref(keyField)
  return {
    rowKey,
    setRowKey(field: string) {
      rowKey.value = field
    },
  }
}
