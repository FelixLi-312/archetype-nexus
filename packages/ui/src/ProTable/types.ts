// src/components/ProTable/types.ts
import type { PaginationProps } from 'element-plus'
import type { VNode } from 'vue'
export type PermissionType = string | string[]

// --- 搜索栏配置 ---
export interface SearchItem {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'daterange' | 'number' | 'time'
  placeholder?: string
  options?: { label: string; value: any }[] // for select
  defaultValue?: any
  span?: number // 占据栅格数 (可选，用于更复杂的布局)
  // 组件属性 (直接传递给 Element Plus 组件)
  componentProps?: Record<string, any> // ⭐⭐⭐
  // 表单项属性 (直接传递给 el-form-item)
  formItemProps?: Record<string, any>
  // 列属性 (直接传递给 el-table-column)
  colProps?: Record<string, any>

  visible?: boolean
}

// --- 按钮配置 (基础) ---
export interface ActionButtonConfig {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  icon?: string
  size?: 'large' | 'default' | 'small'
  isShow?: boolean
  confirm?: boolean | string
  gap?: number // 按钮间距
  onClick?: (row: any) => void // 点击事件处理函数
  disabled?: boolean
  tag?: 'el-button' | 'el-link'

  // 下拉菜单子项
  dropdown?: Array<{
    label: string
    icon?: string
    divided?: boolean
    disabled?: boolean
    onClick?: (row: any) => void // 点击事件处理函数
    isShow?: boolean // 默认显示
  }>
}

// --- 操作列配置 (扁平化设计) ---
export interface ActionsConfig {
  // 列属性 (直接平铺)
  label?: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right' | false
  showOverflowTooltip?: boolean
  className?: string

  // 按钮组
  buttonGroup?: ActionButtonConfig[]

  // 布局控制
  layout?: 'horizontal' | 'vertical'
  gap?: number // 默认间距
}

// --- 列配置 ---

export interface ColumnConfig<T = any> {
  // prop?: keyof T;
  prop?: Extract<keyof T, string>
  label: string

  width?: string | number
  minWidth?: string | number

  sortable?: boolean

  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'

  visible?: boolean
  permission?: PermissionType
  // 显示省略号 (仅对文本类型有效)
  ellipsis?: boolean
  // 可复制内容 (如 ID、链接等)
  copyable?: boolean
  // 枚举值映射 (用于状态展示)
  valueEnum?: Record<
    string,
    {
      text: string
      type?: 'success' | 'warning' | 'danger' | 'info'
    }
  >

  slot?: string

  render?: (
    h: any,
    scope: {
      row: T
      column: ColumnConfig<T>
      $index: number
    }
  ) => VNode

  children?: ColumnConfig<T>[]
}

// --- 工具栏按钮配置 ---
export interface ToolbarButtonConfig extends ActionButtonConfig {
  position?: 'left' | 'right' // 默认 left
  onClick?: () => void // 点击事件处理函数
}

/**
 * 分页配置接口
 */
export interface PaginationConfig extends Partial<
  Omit<PaginationProps, 'currentPage' | 'pageSize'>
> {
  enabled?: boolean // 是否开启分页 ⭐⭐⭐
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  // ⭐ 远程分页回调
  onChange?: (page: number, size: number) => void
}

/**
 * ProTable 配置接口
 * @param T 表格数据的行类型，默认为 DefaultRow (any)
 */
export interface ProTableConfig<T = any> {
  // --- 总配置对象 ---
  border?: boolean
  stripe?: boolean
  loading?: boolean
  selection?: boolean
  columns: ColumnConfig<T>[]
  actions?: ActionsConfig // 扁平化操作列配置
  searchConfig?: SearchItem[]
  toolbar?: ToolbarButtonConfig[]
  exportable?: boolean
  exportFileName?: string

  // --- 新增：分页配置 ---
  pagination?: PaginationConfig
}

// --- 事件类型 ---
export interface ProTableEmits {
  (e: 'search', form: any): void
  (e: 'reset'): void
  (e: 'export'): void
  (e: 'page-change', data: { page: number; size: number }): void
  (e: 'size-change', val: number): void
  (e: 'selection-change', val: any[]): void
  (e: 'sort-change', data: any): void
  (e: 'update:currentPage', val: number): void
  (e: 'update:pageSize', val: number): void
}

export interface ProTableInstance<T = any> {
  reload: () => void

  setData: (data: T[]) => void
  getData: () => T[]

  resetSearch: () => void
  getSearchParams: () => Record<string, any>
  setSearchParams: (params: Record<string, any>) => void

  getSelectionRows: () => T[]
  clearSelection: () => void
  toggleRowSelection: (row: T, selected?: boolean) => void

  setPage: (page: number) => void
  setPageSize: (size: number) => void

  scrollToTop: () => void
}
