import { ref } from 'vue'

export function usePagination() {
  const currentPage = ref(1)
  const pageSize = ref(10)

  return {
    currentPage,
    pageSize,
    setPage(page: number) {
      currentPage.value = page
    },
    setSize(size: number) {
      pageSize.value = size
    },
  }
}
