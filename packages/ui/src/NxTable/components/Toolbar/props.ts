import type { PropType } from 'vue'
import type { VxeTableInstance } from 'vxe-table'

export interface ExportMenuItem {
  label: string
  filename?: string
  handle?: (vxeTable: VxeTableInstance, filename: string) => void | 'csv' | 'html' | 'xml' | 'txt'
}

export interface ToolbarProps {
  search?: string
  searchPlaceholder?: string | ((t: (key: string) => string) => string)
  searchable?: boolean
  showRefresh?: boolean
  showAdd?: boolean
  showColumnSetting?: boolean
  exportMenu?: ExportMenuItem[]
  printable?: boolean
  showTools?: boolean
}
