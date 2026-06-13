import type { ElPagination } from 'element-plus'

export interface PaginationOptions {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  layout?: string
  pagerCount?: number
  noAutoLayout?: boolean
  change?: (page: number, size: number) => void
}

export interface TablePaginationInstance {
  getCurrentPage(): number
  getPageSize(): number
  setPage(page: number): void
  setSize(size: number): void
}
