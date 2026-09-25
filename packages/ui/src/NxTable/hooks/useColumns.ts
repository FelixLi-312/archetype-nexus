import { ref } from 'vue'

export function useColumns(columns: any[] = []) {
  const tableColumns = ref(columns)
  return {
    tableColumns,
    setColumns(next: any[]) {
      tableColumns.value = next
    }
  }
}
